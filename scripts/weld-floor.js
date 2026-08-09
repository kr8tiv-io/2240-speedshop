/**
 * THE EXACT WELD FLOOR OF THE SHELF AS IT ACTUALLY SHIPS.
 *
 *   node scripts/weld-floor.js  [--json out.json]
 *
 * `audit-topology.js` derives its weld floor from `public/models/`, the raw
 * authoring source. That is only honest while the optimised shelf is a
 * straight re-encode of it — the moment anything upstream welds or decimates,
 * the source-derived ratio credits a saving that has already been banked.
 *
 * This reads `public/models-opt/` itself. Non-vehicle files are
 * EXT_meshopt_compressed, so the streams are decoded with the same wasm
 * decoder the site ships (three/examples/jsm/libs/meshopt_decoder.module.js)
 * before any position is looked at, and KHR_mesh_quantization positions are
 * de-quantised through their node scale so the tolerance means something.
 *
 * Reports, per file: vertices as shipped, the distinct-position floor, the
 * distinct-(position,uv) floor, which of those two applies given the
 * attributes the file actually carries, and the resulting recoverable bytes.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OPT = path.join(ROOT, "public", "models-opt");

const CB = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
const TN = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
const elemSize = (a) => CB[a.componentType] * TN[a.type];

function readGLB(file) {
  const buf = fs.readFileSync(file);
  let off = 12, json = null, bin = null;
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32LE(off), type = buf.readUInt32LE(off + 4);
    const d = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(d.toString("utf8"));
    else if (type === 0x004e4942) bin = d;
    off += 8 + len; off += (4 - (off % 4)) % 4;
  }
  return { json, bin, size: buf.length };
}

(async () => {
  const { MeshoptDecoder } = await import(
    "file:///" + path.join(ROOT, "node_modules/three/examples/jsm/libs/meshopt_decoder.module.js").replace(/\\/g, "/")
  );
  await MeshoptDecoder.ready;

  const rows = [];

  for (const f of fs.readdirSync(OPT).filter((x) => x.endsWith(".glb")).sort()) {
    const { json: g, bin, size } = readGLB(path.join(OPT, f));

    /* Materialise every bufferView as real bytes: pass-through when plain,
       wasm-decoded when the meshopt extension is on it. */
    const viewData = new Map();
    const viewOf = (i) => {
      if (viewData.has(i)) return viewData.get(i);
      const bv = g.bufferViews[i];
      const ext = bv.extensions && bv.extensions.EXT_meshopt_compression;
      let out;
      if (ext) {
        const src = bin.subarray(ext.byteOffset || 0, (ext.byteOffset || 0) + ext.byteLength);
        out = new Uint8Array(ext.count * ext.byteStride);
        MeshoptDecoder.decodeGltfBuffer(out, ext.count, ext.byteStride, src, ext.mode, ext.filter);
      } else {
        out = new Uint8Array(bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength));
      }
      out = Buffer.from(out.buffer, out.byteOffset, out.byteLength);
      viewData.set(i, out);
      return out;
    };

    const read = (ai) => {
      const a = g.accessors[ai];
      if (a.bufferView === undefined) return null;
      const bv = g.bufferViews[a.bufferView];
      const data = viewOf(a.bufferView);
      const n = TN[a.type], cb = CB[a.componentType];
      const stride = (bv.extensions && bv.extensions.EXT_meshopt_compression)
        ? bv.extensions.EXT_meshopt_compression.byteStride
        : (bv.byteStride || cb * n);
      const base = a.byteOffset || 0;
      const out = new Float64Array(a.count * n);
      for (let k = 0; k < a.count; k++) {
        for (let c = 0; c < n; c++) {
          const p = base + k * stride + c * cb;
          let v;
          switch (a.componentType) {
            case 5126: v = data.readFloatLE(p); break;
            case 5125: v = data.readUInt32LE(p); break;
            case 5123: v = data.readUInt16LE(p); if (a.normalized) v /= 65535; break;
            case 5122: v = data.readInt16LE(p); if (a.normalized) v = Math.max(v / 32767, -1); break;
            case 5121: v = data.readUInt8(p); if (a.normalized) v /= 255; break;
            case 5120: v = data.readInt8(p); if (a.normalized) v = Math.max(v / 127, -1); break;
            default: v = 0;
          }
          out[k * n + c] = v;
        }
      }
      return out;
    };

    let verts = 0, tris = 0, uniPos = 0, uniPosUV = 0, flat = 0, sampled = 0;
    let hasUV = false, hasNRM = false;
    const attrLogical = {};
    let idxLogical = 0;
    const geomViews = new Set();

    /* Extent first, so the weld tolerance can be relative to the model — and
       measured in the SAME space the positions are read in. Taking it from
       accessor.min/max instead is a unit trap: under KHR_mesh_quantization
       those are the raw i16 ints (±32767) while `read()` hands back the
       normalised floats (±1). Mixing the two makes the tolerance ~65000x too
       coarse and welds an entire barrel down to 35 vertices. */
    const posCache = new Map();
    let lo = Infinity, hi = -Infinity;
    for (const m of g.meshes || []) for (const p of m.primitives || []) {
      const pi = p.attributes.POSITION;
      if (pi === undefined || posCache.has(pi)) continue;
      const arr = read(pi);
      posCache.set(pi, arr);
      for (let k = 0; k < arr.length; k++) {
        if (arr[k] < lo) lo = arr[k];
        if (arr[k] > hi) hi = arr[k];
      }
    }
    const tol = Math.max((hi - lo) * 1e-5, 1e-12);

    for (const m of g.meshes || []) {
      for (const p of m.primitives || []) {
        if (p.mode !== undefined && p.mode !== 4) continue;
        const pi = p.attributes.POSITION;
        if (pi === undefined) continue;
        const a = g.accessors[pi];
        verts += a.count;
        for (const [sem, ai] of Object.entries(p.attributes)) {
          const acc = g.accessors[ai];
          attrLogical[sem] = (attrLogical[sem] || 0) + acc.count * elemSize(acc);
          if (acc.bufferView !== undefined) geomViews.add(acc.bufferView);
          if (sem === "TEXCOORD_0") hasUV = true;
          if (sem === "NORMAL") hasNRM = true;
        }
        if (p.indices !== undefined) {
          const ia = g.accessors[p.indices];
          idxLogical += ia.count * elemSize(ia);
          if (ia.bufferView !== undefined) geomViews.add(ia.bufferView);
        }

        const pos = posCache.get(pi) || read(pi);
        const uv = p.attributes.TEXCOORD_0 !== undefined ? read(p.attributes.TEXCOORD_0) : null;
        const nrm = p.attributes.NORMAL !== undefined ? read(p.attributes.NORMAL) : null;
        const idx = p.indices !== undefined ? read(p.indices) : null;

        const q = (v) => Math.round(v / tol);
        const sp = new Set(), spu = new Set();
        for (let k = 0; k < a.count; k++) {
          const key = `${q(pos[3 * k])},${q(pos[3 * k + 1])},${q(pos[3 * k + 2])}`;
          sp.add(key);
          spu.add(uv ? `${key}|${Math.round(uv[2 * k] * 1e4)},${Math.round(uv[2 * k + 1] * 1e4)}` : key);
        }
        uniPos += sp.size;
        uniPosUV += spu.size;

        const tc = idx ? idx.length / 3 : a.count / 3;
        tris += tc;
        if (nrm) {
          const eq = (x, y) => Math.abs(nrm[3 * x] - nrm[3 * y]) < 1e-3 &&
            Math.abs(nrm[3 * x + 1] - nrm[3 * y + 1]) < 1e-3 &&
            Math.abs(nrm[3 * x + 2] - nrm[3 * y + 2]) < 1e-3;
          for (let t = 0; t < tc; t++) {
            const i0 = idx ? idx[3 * t] : 3 * t, i1 = idx ? idx[3 * t + 1] : 3 * t + 1, i2 = idx ? idx[3 * t + 2] : 3 * t + 2;
            sampled++;
            if (eq(i0, i1) && eq(i1, i2)) flat++;
          }
        }
      }
    }

    let geomDisk = 0;
    for (const i of geomViews) {
      const bv = g.bufferViews[i];
      const ext = bv.extensions && bv.extensions.EXT_meshopt_compression;
      geomDisk += ext ? ext.byteLength : bv.byteLength;
    }

    const floor = (hasUV ? uniPosUV : uniPos) / (verts || 1);
    const attrLog = Object.values(attrLogical).reduce((x, y) => x + y, 0);
    const attrDisk = geomDisk * (attrLog / (attrLog + idxLogical || 1));
    const saveKB = (attrDisk * (1 - floor) * 0.85) / 1024;

    rows.push({
      file: f,
      kb: +(size / 1024).toFixed(1),
      verts, tris: Math.round(tris),
      ratio: +(verts / (tris || 1)).toFixed(2),
      uniPos, uniPosUV,
      posFloor: +(uniPos / (verts || 1)).toFixed(3),
      uvFloor: +(uniPosUV / (verts || 1)).toFixed(3),
      floor: +floor.toFixed(3),
      hasUV, hasNRM,
      flatPct: sampled ? +((100 * flat) / sampled).toFixed(1) : null,
      geomKB: +(geomDisk / 1024).toFixed(1),
      saveKB: +saveKB.toFixed(1),
    });
  }

  const j = process.argv.indexOf("--json");
  if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(rows, null, 2));

  const cols = ["file", "kb", "verts", "tris", "ratio", "posFloor", "uvFloor", "floor", "hasUV", "flatPct", "geomKB", "saveKB"];
  console.log(cols.join("\t"));
  for (const r of rows) console.log(cols.map((c) => r[c]).join("\t"));
  const tot = rows.reduce((a, r) => ({ s: a.s + r.saveKB, g: a.g + r.geomKB }), { s: 0, g: 0 });
  console.error(`\nSHIPPED-shelf weld floor: geometry ${(tot.g / 1024).toFixed(2)} MB, ` +
    `recoverable ${(tot.s / 1024).toFixed(2)} MB (${(100 * tot.s / tot.g).toFixed(0)}%)`);
})();
