/**
 * SHELF TOPOLOGY AUDIT — where the vertex-split waste actually lives.
 *
 *   node scripts/audit-topology.js  [--json out.json]
 *
 * No dependencies. Parses the GLB container by hand (JSON chunk + BIN chunk),
 * because the only thing gltf-transform would add here is a Document graph we
 * do not need, and it is not installed on this machine.
 *
 * Three passes:
 *   1. public/models-opt/*.glb   — the bytes that actually ship. Counts,
 *      attribute presence, material/texture inventory, and byte attribution
 *      split into geometry-on-disk vs texture-on-disk. Non-vehicle files are
 *      EXT_meshopt_compressed, so "on disk" reads the extension's byteLength,
 *      not the bufferView's (which describes the DEcompressed size).
 *   2. public/models/*.glb       — the uncompressed authoring source, same
 *      geometry. Float positions are readable here, so this pass computes the
 *      EXACT weld floor: how many distinct positions the mesh really has, and
 *      what fraction of its triangles carry one normal per face.
 *   3. components/shop/Stations.tsx — how many times each file is placed, at
 *      what world size, and how close the nearest camera orbit gets to it.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OPT = path.join(ROOT, "public", "models-opt");
const SRC = path.join(ROOT, "public", "models");

/* ── GLB container ──────────────────────────────────────────────────────── */

function readGLB(file) {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("not a GLB");
  let off = 12;
  let json = null;
  let bin = null;
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32LE(off);
    const type = buf.readUInt32LE(off + 4);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString("utf8"));
    else if (type === 0x004e4942) bin = data;
    off += 8 + len + ((4 - (len % 4)) % 4) * 0; // chunks are already 4-aligned
    off += (4 - (off % 4)) % 4;
  }
  return { json, bin, size: buf.length };
}

const COMP_BYTES = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
const TYPE_N = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
const elemSize = (a) => COMP_BYTES[a.componentType] * TYPE_N[a.type];

/* ── Image headers (no sharp needed) ────────────────────────────────────── */

function imageSize(b) {
  if (b.length < 24) return null;
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  // WebP
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const cc = b.toString("ascii", 12, 16);
    if (cc === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (cc === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (cc === "VP8L") {
      const n = b.readUInt32LE(21);
      return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
    }
  }
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if ((m >= 0xc0 && m <= 0xc3) || (m >= 0xc5 && m <= 0xc7) || (m >= 0xc9 && m <= 0xcb) || (m >= 0xcd && m <= 0xcf))
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  // KTX2
  if (b.length > 24 && b[0] === 0xab && b[1] === 0x4b && b[2] === 0x54 && b[3] === 0x58)
    return [b.readUInt32LE(20), b.readUInt32LE(24)];
  return null;
}

/* ── Pass 1: what ships ─────────────────────────────────────────────────── */

/** On-disk bytes of a bufferView, honouring EXT_meshopt_compression. */
function viewDiskBytes(bv) {
  const ext = bv.extensions && bv.extensions.EXT_meshopt_compression;
  return ext ? ext.byteLength : bv.byteLength;
}

function analyseShipped(file) {
  const { json: g, bin, size } = readGLB(file);
  const acc = g.accessors || [];
  const views = g.bufferViews || [];

  let verts = 0, tris = 0, prims = 0;
  const semantics = new Set();
  const geomViews = new Set();
  const attrLogical = {}; // semantic -> uncompressed bytes
  let indexLogical = 0;
  const modes = new Set();
  const meshVerts = [];   // per-mesh, so node instancing can be weighted below
  let lo = Infinity, hi = -Infinity; // model-space extent, from accessor min/max

  for (const mesh of g.meshes || []) {
    let mv = 0;
    for (const p of mesh.primitives || []) {
      prims++;
      modes.add(p.mode === undefined ? 4 : p.mode);
      const pos = acc[p.attributes.POSITION];
      if (!pos) continue;
      verts += pos.count;
      mv += pos.count;
      if (pos.min && pos.max) {
        lo = Math.min(lo, ...pos.min);
        hi = Math.max(hi, ...pos.max);
      }
      if (p.indices !== undefined) {
        const ia = acc[p.indices];
        tris += ia.count / 3;
        indexLogical += ia.count * elemSize(ia);
        if (ia.bufferView !== undefined) geomViews.add(ia.bufferView);
      } else {
        tris += pos.count / 3;
      }
      for (const [sem, ai] of Object.entries(p.attributes)) {
        semantics.add(sem);
        const a = acc[ai];
        attrLogical[sem] = (attrLogical[sem] || 0) + a.count * elemSize(a);
        if (a.bufferView !== undefined) geomViews.add(a.bufferView);
      }
    }
    meshVerts.push(mv);
  }

  // A mesh referenced by four nodes is uploaded once but drawn four times, and
  // Blender's importer counts it four times — which is why its vertex numbers
  // run ahead of the on-the-wire ones.
  const useCount = new Array(meshVerts.length).fill(0);
  for (const n of g.nodes || []) if (n.mesh !== undefined) useCount[n.mesh]++;
  const drawVerts = meshVerts.reduce((a, v, i) => a + v * Math.max(1, useCount[i]), 0);

  let geomDisk = 0;
  for (const v of geomViews) geomDisk += viewDiskBytes(views[v]);

  const textures = [];
  let texDisk = 0;
  for (const img of g.images || []) {
    if (img.bufferView === undefined) continue;
    const bv = views[img.bufferView];
    const bytes = viewDiskBytes(bv);
    texDisk += bytes;
    const data = bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bytes);
    const dim = imageSize(data);
    textures.push({ mime: img.mimeType || "?", bytes, w: dim ? dim[0] : 0, h: dim ? dim[1] : 0 });
  }

  return {
    size, verts, tris, prims, drawVerts,
    extent: lo === Infinity ? null : hi - lo,
    ratio: tris ? verts / tris : 0,
    hasNORMAL: semantics.has("NORMAL"),
    hasUV: semantics.has("TEXCOORD_0"),
    hasUV1: semantics.has("TEXCOORD_1"),
    hasCOLOR: semantics.has("COLOR_0"),
    hasTANGENT: semantics.has("TANGENT"),
    materials: (g.materials || []).length,
    meshes: (g.meshes || []).length,
    textures,
    texDisk, geomDisk,
    attrLogical, indexLogical,
    meshopt: !!(g.extensionsUsed || []).includes("EXT_meshopt_compression"),
    draco: !!(g.extensionsUsed || []).includes("KHR_draco_mesh_compression"),
    modes: [...modes],
  };
}

/* ── Pass 2: the exact weld floor, from the uncompressed source ─────────── */

function accessorFloats(g, bin, i) {
  const a = g.accessors[i];
  if (a.bufferView === undefined) return null;
  const bv = g.bufferViews[a.bufferView];
  if (bv.extensions && bv.extensions.EXT_meshopt_compression) return null;
  const n = TYPE_N[a.type];
  const stride = bv.byteStride || elemSize(a);
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = new Float64Array(a.count * n);
  for (let k = 0; k < a.count; k++) {
    const o = base + k * stride;
    for (let c = 0; c < n; c++) {
      const p = o + c * COMP_BYTES[a.componentType];
      let v;
      switch (a.componentType) {
        case 5126: v = bin.readFloatLE(p); break;
        case 5123: v = bin.readUInt16LE(p); if (a.normalized) v /= 65535; break;
        case 5122: v = bin.readInt16LE(p); if (a.normalized) v = Math.max(v / 32767, -1); break;
        case 5121: v = bin.readUInt8(p); if (a.normalized) v /= 255; break;
        case 5120: v = bin.readInt8(p); if (a.normalized) v = Math.max(v / 127, -1); break;
        case 5125: v = bin.readUInt32LE(p); break;
        default: v = 0;
      }
      out[k * n + c] = v;
    }
  }
  return out;
}

function accessorInts(g, bin, i) {
  const a = g.accessors[i];
  if (a.bufferView === undefined) return null;
  const bv = g.bufferViews[a.bufferView];
  if (bv.extensions && bv.extensions.EXT_meshopt_compression) return null;
  const stride = bv.byteStride || elemSize(a);
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const out = new Uint32Array(a.count);
  for (let k = 0; k < a.count; k++) {
    const p = base + k * stride;
    out[k] = a.componentType === 5125 ? bin.readUInt32LE(p)
      : a.componentType === 5123 ? bin.readUInt16LE(p)
      : bin.readUInt8(p);
  }
  return out;
}

function analyseWeld(file) {
  const { json: g, bin } = readGLB(file);
  if ((g.extensionsUsed || []).includes("KHR_draco_mesh_compression")) return { skipped: "draco" };

  let verts = 0, tris = 0, flatTris = 0, triSampled = 0;
  let uniquePos = 0, uniquePosUV = 0;
  let bbox = [Infinity, -Infinity];
  let readable = 0, total = 0;

  // Pass A: model extent, so the weld tolerance below can be relative to it.
  for (const mesh of g.meshes || []) {
    for (const p of mesh.primitives || []) {
      const a = g.accessors[p.attributes.POSITION];
      if (a && a.min && a.max) {
        bbox[0] = Math.min(bbox[0], ...a.min);
        bbox[1] = Math.max(bbox[1], ...a.max);
      }
    }
  }

  // Pass B: the welds themselves.
  for (const mesh of g.meshes || []) {
    for (const p of mesh.primitives || []) {
      if (p.mode !== undefined && p.mode !== 4) continue;
      total++;
      const posI = p.attributes.POSITION;
      if (posI === undefined) continue;
      const pos = accessorFloats(g, bin, posI);
      if (!pos) continue; // meshopt-compressed source, cannot decode here
      readable++;
      const n = g.accessors[posI].count;
      verts += n;

      const uvI = p.attributes.TEXCOORD_0;
      const uv = uvI !== undefined ? accessorFloats(g, bin, uvI) : null;
      const nrmI = p.attributes.NORMAL;
      const nrm = nrmI !== undefined ? accessorFloats(g, bin, nrmI) : null;

      // Exact weld floor: distinct positions, and distinct (position,uv) pairs.
      // The tolerance has to be RELATIVE — model units across this shelf run
      // from 0.037 (a car authored at 1/150 scale, real size carried on the
      // node) to 65534 (KHR_mesh_quantization). One absolute epsilon either
      // welds a whole car into a point or welds nothing at all.
      const sp = new Set(), spu = new Set();
      const tol = Math.max((bbox[1] - bbox[0]) * 1e-5, 1e-9);
      const q = (v) => Math.round(v / tol);
      for (let k = 0; k < n; k++) {
        const key = `${q(pos[k * 3])},${q(pos[k * 3 + 1])},${q(pos[k * 3 + 2])}`;
        sp.add(key);
        spu.add(uv ? `${key}|${q(uv[k * 2])},${q(uv[k * 2 + 1])}` : key);
      }
      uniquePos += sp.size;
      uniquePosUV += spu.size;

      const idx = p.indices !== undefined ? accessorInts(g, bin, p.indices) : null;
      const triCount = idx ? idx.length / 3 : n / 3;
      tris += triCount;

      if (nrm) {
        const eq = (a, b) =>
          Math.abs(nrm[a * 3] - nrm[b * 3]) < 1e-4 &&
          Math.abs(nrm[a * 3 + 1] - nrm[b * 3 + 1]) < 1e-4 &&
          Math.abs(nrm[a * 3 + 2] - nrm[b * 3 + 2]) < 1e-4;
        for (let t = 0; t < triCount; t++) {
          const a = idx ? idx[t * 3] : t * 3;
          const b = idx ? idx[t * 3 + 1] : t * 3 + 1;
          const c = idx ? idx[t * 3 + 2] : t * 3 + 2;
          triSampled++;
          if (eq(a, b) && eq(b, c)) flatTris++;
        }
      }
    }
  }

  return {
    verts, tris,
    uniquePos, uniquePosUV,
    weldFloor: verts ? uniquePosUV / verts : 1,
    posOnlyFloor: verts ? uniquePos / verts : 1,
    flatPct: triSampled ? (100 * flatTris) / triSampled : null,
    extent: bbox[0] === Infinity ? 0 : bbox[1] - bbox[0],
    partial: readable < total,
  };
}

/* ── Pass 3: how visible is it ──────────────────────────────────────────── */

// The seven orbit arcs, copied from components/shop/world.ts.
const ARCS = [
  { cx: -1.1, cz: -2.75, r: 4.3 },
  { cx: -3.2, cz: -7.0, r: 4.4 },
  { cx: 3.3, cz: -17.1, r: 3.2 },
  { cx: -4.3, cz: -30.4, r: 3.6 },
  { cx: 0.9, cz: -37.4, r: 3.8 },
  { cx: -5.3, cz: -41.7, r: 2.9 },
  { cx: -3.4, cz: -53.2, r: 4.1 },
];

/** Closest the camera ring ever gets to a point on the floor. */
function nearestApproach(x, z) {
  let best = Infinity;
  for (const a of ARCS) {
    const d = Math.hypot(x - a.cx, z - a.cz);
    best = Math.min(best, Math.abs(d - a.r));
  }
  return best;
}

function scanStations() {
  const src = fs.readFileSync(path.join(ROOT, "components", "shop", "Stations.tsx"), "utf8");
  const loaders = fs.readFileSync(path.join(ROOT, "components", "shop", "Loaders.tsx"), "utf8");

  // key -> filename
  const M = {};
  for (const m of loaders.matchAll(/(\w+):\s*`\$\{BASE\}([\w.\-]+\.glb)`/g)) M[m[1]] = m[2];

  // Walk the JSX linearly, keeping a stack of parent <group|Turntable|...>
  // position offsets so a <Vehicle position={[0,0,0]}> inside a turntable
  // resolves to the turntable's floor spot rather than the origin.
  // Lowercase intrinsics count too: <group position={[...]}> is the wrapper
  // that most of the set dressing hangs off, and a walker that only sees
  // capitalised components resolves every child of one to the world origin.
  const tag = /<(\/?)([A-Za-z]\w*)([^>]*?)(\/?)>/gs;
  const stack = [];
  const out = {}; // file -> { count, sizes[], minDist }
  const unresolved = new Set(); // reported, never silently swallowed
  let m;
  while ((m = tag.exec(src))) {
    const [, closing, name, attrs, selfClose] = m;
    if (closing) {
      // Unwind to the matching open tag rather than only testing the top —
      // one unbalanced pair otherwise corrupts every offset that follows.
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === name) { stack.length = i; break; }
      }
      continue;
    }

    // Positions are not all literals — a third of the dressing is placed
    // against the wall as `HALF_W - 0.66`. Treating those as [0,0] parked 26
    // files at the origin and gave every one of them the same fake 1.34 m
    // camera distance, which is exactly the number the ranking turns on.
    const pm = attrs.match(/position=\{\[([^\]]*)\]/);
    let off = [0, 0];
    if (pm) {
      const parts = pm[1].split(",");
      const val = (s) => {
        const e = s.replace(/HALF_W/g, "9").replace(/CEIL/g, "7.2").trim();
        return /^[-+*/(). \d]+$/.test(e) ? Function(`"use strict";return(${e})`)() : NaN;
      };
      const x = parts[0] !== undefined ? val(parts[0]) : NaN;
      const z = parts[2] !== undefined ? val(parts[2]) : NaN;
      off = [Number.isFinite(x) ? x : 0, Number.isFinite(z) ? z : 0];
      if (!Number.isFinite(x) || !Number.isFinite(z)) unresolved.add(pm[1].trim().slice(0, 40));
    }

    const um = attrs.match(/url=\{M\.(\w+)\}/);
    if (um && M[um[1]]) {
      const file = M[um[1]];
      let x = off[0], z = off[1];
      for (const s of stack) { x += s.x; z += s.z; }
      const sm = attrs.match(/size=\{([\d.]+)\}/);
      const e = (out[file] = out[file] || { count: 0, sizes: [], minDist: Infinity, vehicle: false });
      e.count++;
      if (sm) e.sizes.push(parseFloat(sm[1]));
      if (name === "Vehicle") e.vehicle = true;
      e.minDist = Math.min(e.minDist, nearestApproach(x, z));
    }

    if (!selfClose) stack.push({ name, x: off[0], z: off[1] });
  }
  /* Fixtures are components, not placements.
     `<DropLight position={...}/>` is declared once as a function whose body
     holds `<Placed url={M.droplight} position={[0,0,0]}/>` under a
     `<group position={position}>`. The walk above sees one placement at the
     origin; the scene actually hangs five of them from the ceiling. Resolve
     each such wrapper to its call sites, or the ranking judges a lamp that is
     in frame for half the scroll by a position it never occupies. */
  for (const fn of src.matchAll(/function\s+([A-Z]\w*)\s*\(([\s\S]*?)\n\}/g)) {
    const [, name, body] = fn;
    const urls = [...body.matchAll(/url=\{M\.(\w+)\}/g)].map((u) => M[u[1]]).filter(Boolean);
    if (!urls.length) continue;
    const sites = [...src.matchAll(
      new RegExp(`<${name}\\s[^>]*?position=\\{\\[\\s*(-?[\\d.]+)\\s*,\\s*(-?[\\d.]+)\\s*,\\s*(-?[\\d.]+)`, "g"))];
    if (!sites.length) continue;
    for (const url of new Set(urls)) {
      const e = out[url];
      if (!e) continue;
      e.count = sites.length;               // one entry per fixture, not one total
      e.viaFixture = name;
      e.minDist = Infinity;
      for (const st of sites) e.minDist = Math.min(e.minDist, nearestApproach(+st[1], +st[3]));
    }
  }

  if (unresolved.size)
    console.error(`[audit] ${unresolved.size} position expr(s) not evaluated: ` +
      [...unresolved].slice(0, 6).join(" | "));
  return out;
}

/* ── Report ─────────────────────────────────────────────────────────────── */

const HERO_TEX = new Set(
  (fs.readFileSync(path.join(ROOT, "scripts", "compress-models.js"), "utf8")
    .match(/const HERO = new Set\(\[([\s\S]*?)\]\);/)[1]
    .match(/"([\w.\-]+\.glb)"/g) || []).map((s) => s.replace(/"/g, "")),
);

const files = fs.readdirSync(OPT).filter((f) => f.endsWith(".glb")).sort();
const placements = scanStations();
const rows = [];

for (const f of files) {
  const ship = analyseShipped(path.join(OPT, f));
  let weld = { skipped: "no-source" };
  const sp = path.join(SRC, f);
  if (fs.existsSync(sp)) {
    try { weld = analyseWeld(sp); } catch (e) { weld = { skipped: e.message.slice(0, 40) }; }
  }
  const place = placements[f] || { count: 0, sizes: [], minDist: Infinity, vehicle: false };

  // What a weld would return. Vertex-attribute bytes scale with the vertex
  // count; indices do not. On a meshopt file the on-disk stream is already
  // compressed, but it is a per-vertex stream, so it scales the same way.
  //
  // WHICH floor applies depends on what SHIPS, not on what the source holds.
  // `prune({keepAttributes:false})` drops TEXCOORD_0 from every model whose
  // material carries no texture — so for those the UV seams that force a split
  // are already gone and the position-only floor is the real one. Reading the
  // source's (position,uv) floor for those files understates the win by up to
  // 4x: the prewar donor scores 0.997 on pos+uv and 0.27 on position alone.
  const rawFloor = ship.hasUV ? weld.weldFloor : weld.posOnlyFloor;
  const floor = rawFloor && rawFloor < 1 ? rawFloor : null;
  const attrLog = Object.values(ship.attrLogical).reduce((a, b) => a + b, 0);
  const attrShare = attrLog + ship.indexLogical ? attrLog / (attrLog + ship.indexLogical) : 1;
  const attrDisk = ship.geomDisk * attrShare;
  // 0.85: welding also costs an index buffer growth and the compressor loses a
  // little coherence, so the realised saving lands below the arithmetic floor.
  const saveBytes = floor ? attrDisk * (1 - floor) * 0.85 : 0;

  rows.push({
    file: f,
    kb: +(ship.size / 1024).toFixed(1),
    verts: ship.verts,
    drawVerts: ship.drawVerts,
    tris: Math.round(ship.tris),
    ratio: +ship.ratio.toFixed(2),
    NORMAL: ship.hasNORMAL, UV: ship.hasUV, COLOR: ship.hasCOLOR, TANGENT: ship.hasTANGENT,
    mats: ship.materials,
    tex: ship.textures.length,
    texDims: ship.textures.map((t) => `${t.w}x${t.h}`).join(" "),
    texKB: +(ship.texDisk / 1024).toFixed(1),
    geomKB: +(ship.geomDisk / 1024).toFixed(1),
    posKB: +((ship.attrLogical.POSITION || 0) / 1024).toFixed(1),
    nrmKB: +((ship.attrLogical.NORMAL || 0) / 1024).toFixed(1),
    uvKB: +((ship.attrLogical.TEXCOORD_0 || 0) / 1024).toFixed(1),
    idxKB: +(ship.indexLogical / 1024).toFixed(1),
    meshopt: ship.meshopt,
    srcVerts: weld.verts || null,
    floorUsed: floor ? +floor.toFixed(3) : null,
    weldFloor: weld.weldFloor ? +weld.weldFloor.toFixed(3) : null,
    posFloor: weld.posOnlyFloor ? +weld.posOnlyFloor.toFixed(3) : null,
    flatPct: weld.flatPct != null ? +weld.flatPct.toFixed(1) : null,
    // Model-space size, and how many of three's 0.01-unit crease cells it spans.
    // toCreasedNormals welds on `~~(v * 100)`, so a model authored small enough
    // that it covers only a few dozen cells is being welded across gaps the
    // viewer can see — the runtime smoothing pass degrades instead of helping.
    extent: ship.extent != null ? +ship.extent.toFixed(3) : null,
    creaseCells: ship.extent != null ? Math.round(ship.extent * 100) : null,
    skipped: weld.skipped || null,
    saveKB: +(saveBytes / 1024).toFixed(1),
    instances: place.count,
    maxSize: place.sizes.length ? Math.max(...place.sizes) : null,
    minDist: place.minDist === Infinity ? null : +place.minDist.toFixed(2),
    viaFixture: place.viaFixture || null,
    vehicle: place.vehicle,
    heroTex: HERO_TEX.has(f),
  });
}

const jsonAt = process.argv.indexOf("--json");
if (jsonAt >= 0) fs.writeFileSync(process.argv[jsonAt + 1], JSON.stringify(rows, null, 2));

const cols = ["file", "kb", "verts", "drawVerts", "tris", "ratio", "NORMAL", "UV", "COLOR", "mats", "tex", "texKB",
  "geomKB", "posKB", "nrmKB", "uvKB", "idxKB", "meshopt", "srcVerts", "floorUsed", "weldFloor", "posFloor",
  "flatPct", "extent", "creaseCells", "saveKB", "instances", "maxSize", "minDist", "vehicle", "heroTex", "skipped"];
console.log(cols.join("\t"));
for (const r of rows) console.log(cols.map((c) => (r[c] === null || r[c] === undefined ? "" : r[c])).join("\t"));

const tot = rows.reduce((a, r) => ({
  kb: a.kb + r.kb, verts: a.verts + r.verts, tris: a.tris + r.tris,
  texKB: a.texKB + r.texKB, geomKB: a.geomKB + r.geomKB, saveKB: a.saveKB + r.saveKB,
}), { kb: 0, verts: 0, tris: 0, texKB: 0, geomKB: 0, saveKB: 0 });
console.error(`\nfiles ${rows.length}  total ${(tot.kb / 1024).toFixed(2)} MB  ` +
  `geom ${(tot.geomKB / 1024).toFixed(2)} MB  tex ${(tot.texKB / 1024).toFixed(2)} MB  ` +
  `verts ${tot.verts.toLocaleString()}  tris ${tot.tris.toLocaleString()}  ` +
  `weld-recoverable ${(tot.saveKB / 1024).toFixed(2)} MB (desktop shelf)`);
