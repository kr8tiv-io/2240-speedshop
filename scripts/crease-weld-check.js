/* Reproduce, exactly, the vertex-id hashing inside three's toCreasedNormals
   (BufferGeometryUtils.js:1344-1421) against the shipped vehicle GLBs, and
   compare the weld it produces with the weld the geometry actually wants. */
const fs = require("fs"), path = require("path");
const OPT = "C:/Users/lucid/Desktop/2240-speedshop/public/models-opt";

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
  return { json, bin };
}
const CB = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
const TN = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

function floats(g, bin, i) {
  const a = g.accessors[i], bv = g.bufferViews[a.bufferView];
  const n = TN[a.type], stride = bv.byteStride || CB[a.componentType] * n;
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = new Float64Array(a.count * n);
  for (let k = 0; k < a.count; k++)
    for (let c = 0; c < n; c++) {
      const p = base + k * stride + c * CB[a.componentType];
      out[k * n + c] = a.componentType === 5126 ? bin.readFloatLE(p)
        : a.componentType === 5122 ? Math.max(bin.readInt16LE(p) / 32767, -1)
        : bin.readUInt16LE(p);
    }
  return out;
}
function ints(g, bin, i) {
  const a = g.accessors[i], bv = g.bufferViews[a.bufferView];
  const stride = bv.byteStride || CB[a.componentType];
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = new Uint32Array(a.count);
  for (let k = 0; k < a.count; k++) {
    const p = base + k * stride;
    out[k] = a.componentType === 5125 ? bin.readUInt32LE(p)
      : a.componentType === 5123 ? bin.readUInt16LE(p) : bin.readUInt8(p);
  }
  return out;
}

/** three's own quantiser, verbatim: ~~(v * (1+1e-10)*1e2), compared as ints. */
function threeWeldIds(pos, n) {
  const H = (1 + 1e-10) * 1e2;
  const seen = new Map();
  let unique = 0;
  for (let i = 0; i < n; i++) {
    const k = `${~~(pos[3 * i] * H)},${~~(pos[3 * i + 1] * H)},${~~(pos[3 * i + 2] * H)}`;
    if (!seen.has(k)) seen.set(k, unique++);
  }
  return unique;
}
/** what the geometry actually wants: distinct positions at 1e-5 of its own size */
function trueUnique(pos, n, tol) {
  const s = new Set();
  for (let i = 0; i < n; i++)
    s.add(`${Math.round(pos[3 * i] / tol)},${Math.round(pos[3 * i + 1] / tol)},${Math.round(pos[3 * i + 2] / tol)}`);
  return s.size;
}

console.log("file".padEnd(30) + "nonIdxV".padStart(9) + "trueUniq".padStart(10) +
  "threeWeld".padStart(11) + "over-merge".padStart(12) + "  cell/model");
for (const f of fs.readdirSync(OPT).filter(x => /^(car|truck)-.*\.glb$/.test(x)).sort()) {
  const { json: g, bin } = readGLB(path.join(OPT, f));
  let lo = Infinity, hi = -Infinity;
  const chunks = [];
  for (const m of g.meshes || []) for (const p of m.primitives || []) {
    const pi = p.attributes.POSITION; if (pi === undefined) continue;
    const pos = floats(g, bin, pi);
    const idx = p.indices !== undefined ? ints(g, bin, p.indices) : null;
    // toNonIndexed(): every triangle corner becomes its own vertex
    const cnt = idx ? idx.length : g.accessors[pi].count;
    const flat = new Float64Array(cnt * 3);
    for (let k = 0; k < cnt; k++) {
      const s = (idx ? idx[k] : k) * 3;
      flat[k * 3] = pos[s]; flat[k * 3 + 1] = pos[s + 1]; flat[k * 3 + 2] = pos[s + 2];
    }
    for (let k = 0; k < cnt * 3; k++) { if (flat[k] < lo) lo = flat[k]; if (flat[k] > hi) hi = flat[k]; }
    chunks.push([flat, cnt]);
  }
  const ext = hi - lo;
  const tol = Math.max(ext * 1e-5, 1e-9);
  let nv = 0, tu = 0, tw = 0;
  for (const [flat, cnt] of chunks) { nv += cnt; tu += trueUnique(flat, cnt, tol); tw += threeWeldIds(flat, cnt); }
  const over = tu / tw; // >1 means three collapsed vertices that are genuinely distinct
  console.log(f.replace(".glb", "").padEnd(30) + String(nv).padStart(9) + String(tu).padStart(10) +
    String(tw).padStart(11) + (over.toFixed(2) + "x").padStart(12) +
    "  " + (0.01 / ext * 100).toFixed(2) + "% of model" + (over > 1.5 ? "   <-- DEGENERATE" : ""));
}
