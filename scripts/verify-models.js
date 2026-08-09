/**
 * THE GATE BETWEEN A REGENERATED SHELF AND A DEPLOY.
 *
 *   node scripts/verify-models.js [--shelf models-mobile] [--baseline file.json]
 *                                 [--write-baseline file.json] [--json out.json]
 *
 * A GLB that WRITES SUCCESSFULLY and THROWS ON LOAD is the failure mode this
 * project has already shipped once: the pipeline stripped JOINTS_0/WEIGHTS_0
 * while a node still referenced a Skin, every offline check passed, and three
 * walked the skin, asked a missing accessor for its `count`, and took the whole
 * Canvas down with it. No byte count, no file listing and no `gltf-transform
 * validate` catches that class of bug. Only a real parse does.
 *
 * So this parses EVERY file on the shelf through the SAME three GLTFLoader the
 * site uses, in a real Chrome, with the same MeshoptDecoder wired in — and then
 * replays the runtime's own classification (`isFlatShaded`, the glass/rubber/
 * chrome branches of `grade`) over the result, because those decide what the
 * model LOOKS like and they are keyed on data a re-export can silently move.
 *
 * Exit code 0 = shelf is safe to deploy. Non-zero = do not ship.
 */
const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.resolve(__dirname, "..");
const THREE_DIR = path.join(ROOT, "node_modules", "three");
/* puppeteer-core is not a dependency of this site — it is borrowed, exactly as
   the screenshot tooling does, so the runtime bundle never grows for a check. */
const PUPPETEER = ["C:\\Users\\lucid\\Desktop\\2240-v-dark\\node_modules\\puppeteer-core",
  path.join(ROOT, "node_modules", "puppeteer-core")].find((p) => fs.existsSync(p));
const CHROME = ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const SHELF = arg("--shelf", "models-mobile");
const SHELF_DIR = path.join(ROOT, "public", SHELF);
/** How many times each model is parsed before the median is taken. */
const REPEAT = Number(arg("--repeat", 5));

/* ── The thresholds the runtime actually uses ────────────────────────────────
   Kept here as literals rather than imported, on purpose: if someone changes
   one in Loaders.tsx, this check should DISAGREE and say so, rather than
   silently move with it. */
const CREASE_BUDGET = 80_000;   // Loaders.tsx: above this, smooth() bails
const FLAT_SAMPLE = 200;        // isFlatShaded() sample size
const FLAT_BAR = 0.7;           // isFlatShaded() threshold
const RUBBER_LUMA = 0.045;
const CHROME_LUMA = 0.62;
const CHROME_SAT = 0.14;

/* ── Which files want which finish — read out of Loaders.tsx, never retyped ── */
function finishTable() {
  const src = fs.readFileSync(path.join(ROOT, "components", "shop", "Loaders.tsx"), "utf8");
  const keyToFile = new Map();
  for (const m of src.matchAll(/(\w+):\s*`\$\{BASE\}([\w.\-]+\.glb)`/g)) keyToFile.set(m[1], m[2]);
  const setOf = (name) => {
    const block = src.match(new RegExp(`const ${name}[\\s\\S]*?\\n\\]\\)`, "m"));
    if (!block) return new Set();
    return new Set([...block[0].matchAll(/M\.(\w+)/g)].map((m) => keyToFile.get(m[1])).filter(Boolean));
  };
  return { painted: setOf("PAINTED"), bare: setOf("BARE"), all: [...new Set(keyToFile.values())] };
}

/* ── A static server rooted where the browser needs it ─────────────────────── */
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".glb": "model/gltf-binary",
  ".json": "application/json", ".wasm": "application/wasm" };

function serve(harnessHtml) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      if (url === "/" || url === "/harness.html") {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(harnessHtml);
      }
      // Answered rather than filtered, so a 404 in the log always means a model.
      if (url === "/favicon.ico") { res.writeHead(204); return res.end(); }
      // `/three/**` is the real package, so the loader under test is byte-for-byte
      // the one the site bundles.
      const file = url.startsWith("/three/")
        ? path.join(THREE_DIR, url.slice("/three/".length))
        : path.join(ROOT, "public", url.replace(/^\//, ""));
      if (!file.startsWith(THREE_DIR) && !file.startsWith(path.join(ROOT, "public"))) {
        res.writeHead(403); return res.end();
      }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

/* ── The page. Everything below runs in Chrome. ───────────────────────────── */
const HARNESS = (shelf, files) => `<!doctype html><meta charset="utf-8">
<script type="importmap">{"imports":{
  "three":"/three/build/three.module.js",
  "three/webgpu":"/three/build/three.webgpu.js",
  "three/tsl":"/three/build/three.tsl.js"
}}</script>
<body><pre id="log">booting</pre>
<script type="module">
import * as THREE from "three";
import { GLTFLoader } from "/three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "/three/examples/jsm/libs/meshopt_decoder.module.js";
import { toCreasedNormals } from "/three/examples/jsm/utils/BufferGeometryUtils.js";

const FILES = ${JSON.stringify(files)};
const SHELF = ${JSON.stringify(shelf)};
const CREASE_BUDGET = ${CREASE_BUDGET}, FLAT_SAMPLE = ${FLAT_SAMPLE}, FLAT_BAR = ${FLAT_BAR};
const REPEAT = ${REPEAT};
const RUBBER_LUMA = ${RUBBER_LUMA}, CHROME_LUMA = ${CHROME_LUMA}, CHROME_SAT = ${CHROME_SAT};

/* Verbatim from Loaders.tsx — if this drifts from the app the check is a lie. */
function isFlatShaded(geometry) {
  const normal = geometry.getAttribute("normal");
  // Loaders.tsx returns a bare true here; smooth() never even calls it in that
  // case, because its guard short-circuits on the missing attribute and creases
  // unconditionally. Same outcome, reported as a ratio so the caller is uniform.
  if (!normal) return { flatRatio: 1, verdict: true, noNormals: true };
  const index = geometry.getIndex();
  const triangles = (index ? index.count : normal.count) / 3;
  if (triangles < 1) return { flatRatio: 0, verdict: false };
  const step = Math.max(1, Math.floor(triangles / FLAT_SAMPLE));
  let sampled = 0, flat = 0;
  for (let t = 0; t < triangles; t += step) {
    const a = index ? index.getX(t*3) : t*3, b = index ? index.getX(t*3+1) : t*3+1, c = index ? index.getX(t*3+2) : t*3+2;
    sampled++;
    const same =
      Math.abs(normal.getX(a)-normal.getX(b))<1e-4 && Math.abs(normal.getY(a)-normal.getY(b))<1e-4 &&
      Math.abs(normal.getZ(a)-normal.getZ(b))<1e-4 && Math.abs(normal.getX(a)-normal.getX(c))<1e-4 &&
      Math.abs(normal.getY(a)-normal.getY(c))<1e-4 && Math.abs(normal.getZ(a)-normal.getZ(c))<1e-4;
    if (same) flat++;
  }
  return { flatRatio: sampled ? flat/sampled : 0, verdict: sampled > 0 && flat/sampled > FLAT_BAR };
}
const lumaOf = (c) => c.r*0.2126 + c.g*0.7152 + c.b*0.0722;

async function one(name, finish) {
  const row = { name, finish, ok: false };
  const t0 = performance.now();
  const res = await fetch(\`/\${SHELF}/\${name}\`);
  row.bytes = (await res.clone().arrayBuffer()).byteLength;
  const buf = await res.arrayBuffer();
  row.fetchMs = Math.round(performance.now() - t0);

  /* PARSE IT REPEATEDLY AND TAKE THE MEDIAN.
     A single timing here is worthless: over five runs on byte-identical input
     the "slowest model" was a different file every time (113 / 268 / 407 / 522
     ms on four different props), because one cold parse is mostly JIT warm-up,
     GC and async image-decode scheduling. Repeating inside one page removes all
     three and leaves the number the model is actually responsible for. */
  const samples = [];
  let gltf;
  for (let k = 0; k < REPEAT; k++) {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);   // exactly extendLoader() in Loaders.tsx
    const t1 = performance.now();
    try {
      // A fresh copy each time: GLTFLoader takes ownership of the buffer.
      gltf = await new Promise((ok, no) => loader.parse(buf.slice(0), "", ok, no));
    } catch (e) {
      row.error = String(e && e.message || e);
      row.parseMs = Math.round(performance.now() - t1);
      return row;
    }
    samples.push(performance.now() - t1);
  }
  samples.sort((a, b) => a - b);
  row.parseMs = Math.round(samples[Math.floor(samples.length / 2)]);
  row.parseSpread = [Math.round(samples[0]), Math.round(samples[samples.length - 1])];
  row.ok = true;

  /* ── what the runtime will do with it ── */
  let meshes = 0, verts = 0, tris = 0, overBudget = 0, willCrease = 0, alreadySmooth = 0;
  let creasedVertsAfter = 0, drawCalls = 0, noNormals = 0, nonIndexed = 0;
  const flatRatios = [], mats = new Map(), classes = { PAINT:0, "BARE-PAINT":0, GLASS:0, RUBBER:0, CHROME:0, PROP:0 };
  const warn = [];
  gltf.scene.traverse((o) => {
    if (o.isMesh || o.isPoints || o.isLine) drawCalls++;
    if (!o.isMesh) return;
    meshes++;
    const g = o.geometry;
    const pos = g.getAttribute("position");
    if (!pos) { warn.push("mesh with no POSITION: " + o.name); return; }
    verts += pos.count;
    const idx = g.getIndex();
    if (!idx) nonIndexed++;
    tris += (idx ? idx.count : pos.count) / 3;
    // NaN sweep — a non-finite position silently collapses measure()'s Box3
    // into the 1 m fallback cube and the model is scaled from nothing.
    for (let i = 0; i < pos.count * pos.itemSize; i++) {
      if (!Number.isFinite(pos.array[i])) { warn.push("NON-FINITE position in " + (o.name||"?")); break; }
    }
    const hasMorph = g.morphAttributes && Object.keys(g.morphAttributes).length > 0;
    const skinned = !!g.getAttribute("skinIndex");
    if (pos.count > CREASE_BUDGET) { overBudget++; }
    else if (hasMorph || skinned) { /* smooth() skips */ }
    else {
      const f = isFlatShaded(g);
      if (f.noNormals) noNormals++;
      flatRatios.push(+f.flatRatio.toFixed(3));
      if (f.verdict) {
        willCrease++;
        // toCreasedNormals de-indexes: the GPU buffer becomes 3 verts per tri.
        creasedVertsAfter += idx ? idx.count : pos.count;
      } else { alreadySmooth++; creasedVertsAfter += pos.count; }
    }
    for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
      if (!m || mats.has(m.uuid)) continue;
      mats.set(m.uuid, 1);
      const name = (m.name || "").toLowerCase();
      const L = lumaOf(m.color || new THREE.Color(1,1,1));
      const S = (m.color || new THREE.Color(1,1,1)).getHSL({h:0,s:0,l:0}).s;
      if (finish === "prop") { classes.PROP++; continue; }
      const isGlass = m.transparent || m.opacity < 1 || /glass|window|windscreen|windshield|screen/.test(name);
      const isRubber = L < RUBBER_LUMA || /tyre|tire|rubber|wheel/.test(name);
      const chromeish = finish === "paint" && L > CHROME_LUMA && S < CHROME_SAT;
      const cls = isGlass ? "GLASS" : isRubber ? "RUBBER" : chromeish ? "CHROME" : finish === "matte" ? "BARE-PAINT" : "PAINT";
      classes[cls]++;
      if (cls === "RUBBER" && /body|panel|hood|bonnet|door|roof|fender|wing|quarter/.test(name)) {
        warn.push(\`BODY MATERIAL CLASSIFIED RUBBER: "\${m.name}" luma \${L.toFixed(4)} < \${RUBBER_LUMA} — no clearcoat, and tint cannot reach it\`);
      }
      if (cls === "CHROME" && m.map) {
        warn.push(\`TEXTURED MATERIAL CLASSIFIED CHROME: "\${m.name}" (white baseColorFactor + a texture) — metalness 1, clearcoat 0\`);
      }
    }
  });

  const box = new THREE.Box3().setFromObject(gltf.scene);
  row.bbox = box.isEmpty() || !Number.isFinite(box.min.x)
    ? null
    : box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(4));
  if (!row.bbox) warn.push("EMPTY OR NON-FINITE bounding box — Placed() will fall back to a 1 m cube");
  row.meshes = meshes; row.verts = verts; row.tris = Math.round(tris); row.drawCalls = drawCalls;
  row.materials = mats.size;
  row.willCrease = willCrease; row.alreadySmooth = alreadySmooth; row.overCreaseBudget = overBudget;
  row.gpuVertsAfterCrease = creasedVertsAfter;
  row.flatRatios = flatRatios;
  row.classes = classes;
  row.noNormals = noNormals;
  row.nonIndexed = nonIndexed;
  row.warn = warn;
  return row;
}

const out = [];
for (const f of FILES) {
  try { out.push(await one(f.name, f.finish)); }
  catch (e) { out.push({ name: f.name, ok: false, error: "HARNESS: " + String(e && e.message || e) }); }
  document.getElementById("log").textContent = \`\${out.length}/\${FILES.length}\`;
}
window.__RESULT__ = out;
document.getElementById("log").textContent = "done " + out.length;
</script>`;

(async () => {
  if (!PUPPETEER) { console.error("puppeteer-core not found — borrow it from 2240-v-dark"); process.exit(2); }
  if (!CHROME) { console.error("no Chrome binary found"); process.exit(2); }
  if (!fs.existsSync(SHELF_DIR)) { console.error(`no such shelf: ${SHELF_DIR}`); process.exit(2); }

  const { painted, bare, all } = finishTable();
  const onDisk = fs.readdirSync(SHELF_DIR).filter((f) => f.endsWith(".glb")).sort();
  const missing = all.filter((f) => !onDisk.includes(f));
  const orphan = onDisk.filter((f) => !all.includes(f));

  const files = onDisk.map((name) => ({
    name,
    finish: painted.has(name) ? "paint" : bare.has(name) ? "matte" : "prop",
  }));

  const { server, port } = await serve(HARNESS(SHELF, files));
  const puppeteer = require(PUPPETEER);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e.message || e)));
  page.on("console", (m) => { if (m.type() === "error") pageErrors.push("console: " + m.text()); });
  // The tab asks for a favicon this server does not have. Everything else is real.
  page.on("requestfailed", (r) => { if (!r.url().endsWith("/favicon.ico")) pageErrors.push("net: " + r.url()); });

  await page.goto(`http://127.0.0.1:${port}/harness.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction("window.__RESULT__ !== undefined", { timeout: 300000 });
  const rows = await page.evaluate("window.__RESULT__");
  await browser.close();
  server.close();

  /* ── Report ────────────────────────────────────────────────────────────── */
  const bytes = onDisk.reduce((s, f) => s + fs.statSync(path.join(SHELF_DIR, f)).size, 0);
  const brFiles = fs.readdirSync(SHELF_DIR).filter((f) => f.endsWith(".glb.br"));
  const brBytes = brFiles.reduce((s, f) => s + fs.statSync(path.join(SHELF_DIR, f)).size, 0);
  const stale = onDisk.filter((f) => {
    const br = path.join(SHELF_DIR, f + ".br");
    return !fs.existsSync(br) || fs.statSync(br).mtimeMs < fs.statSync(path.join(SHELF_DIR, f)).mtimeMs;
  });

  const failed = rows.filter((r) => !r.ok);
  const warned = rows.filter((r) => (r.warn || []).length);
  const slowest = [...rows].filter((r) => r.ok).sort((a, b) => b.parseMs - a.parseMs).slice(0, 8);

  console.log(`\nshelf            ${SHELF}`);
  console.log(`files            ${onDisk.length} glb · ${brFiles.length} br`);
  console.log(`bytes on disk    ${bytes} (${(bytes / 1048576).toFixed(2)} MB)`);
  console.log(`bytes brotli     ${brBytes} (${(brBytes / 1048576).toFixed(2)} MB)  <- what goes on the wire`);
  console.log(`parse total      ${rows.reduce((s, r) => s + (r.parseMs || 0), 0)} ms`);
  console.log(`geometry         ${rows.reduce((s, r) => s + (r.verts || 0), 0)} verts · ${rows.reduce((s, r) => s + (r.tris || 0), 0)} tris · ${rows.reduce((s, r) => s + (r.drawCalls || 0), 0)} drawables`);
  console.log(`after crease     ${rows.reduce((s, r) => s + (r.gpuVertsAfterCrease || 0), 0)} verts uploaded (toCreasedNormals de-indexes)`);

  if (missing.length) console.log(`\nMISSING from shelf but referenced by Loaders.tsx: ${missing.join(", ")}`);
  if (orphan.length) console.log(`ON SHELF but not referenced (dead bytes): ${orphan.join(", ")}`);
  if (stale.length) console.log(`STALE OR ABSENT .br twin (the loader asks for these BY NAME): ${stale.join(", ")}`);
  if (pageErrors.length) console.log(`\nPAGE ERRORS: ${pageErrors.length}\n  ${pageErrors.slice(0, 10).join("\n  ")}`);

  console.log(`\nslowest parses (median of ${REPEAT}, [fastest..slowest] alongside):`);
  for (const r of slowest) console.log(`  ${String(r.parseMs).padStart(5)} ms  ${r.name}  ${JSON.stringify(r.parseSpread || [])}`);

  if (failed.length) {
    console.log(`\n=== ${failed.length} FILE(S) FAILED TO LOAD — DO NOT DEPLOY ===`);
    for (const r of failed) console.log(`  ${r.name}: ${r.error}`);
  }
  if (warned.length) {
    console.log(`\n=== ${warned.length} file(s) load clean but will RENDER WRONG ===`);
    for (const r of warned) for (const w of r.warn) console.log(`  ${r.name}: ${w}`);
  }

  const jsonOut = arg("--json", null);
  const payload = { shelf: SHELF, at: new Date().toISOString(), bytes, brBytes, files: onDisk.length,
    missing, orphan, stale, pageErrors, rows };
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(payload, null, 1));

  /* ── Baseline comparison: the actual regression gate ─────────────────────── */
  const writeBase = arg("--write-baseline", null);
  if (writeBase) { fs.writeFileSync(writeBase, JSON.stringify(payload, null, 1)); console.log(`\nbaseline written to ${writeBase}`); }

  let regressions = [];
  const baseFile = arg("--baseline", null);
  if (baseFile && fs.existsSync(baseFile)) {
    const base = JSON.parse(fs.readFileSync(baseFile, "utf8"));
    const byName = new Map(base.rows.map((r) => [r.name, r]));
    const pct = (now, was) => was ? ((now - was) / was) * 100 : 0;
    const check = (label, now, was, limitPct) => {
      const d = pct(now, was);
      const line = `${label.padEnd(22)} ${String(was).padStart(10)} -> ${String(now).padStart(10)}  ${d >= 0 ? "+" : ""}${d.toFixed(1)}%  (limit +${limitPct}%)`;
      if (d > limitPct) { regressions.push(line); console.log("  FAIL  " + line); }
      else console.log("  ok    " + line);
    };
    console.log(`\n=== against baseline ${path.basename(baseFile)} (${base.at}) ===`);
    check("bytes on disk", bytes, base.bytes, 0);
    check("bytes brotli (wire)", brBytes, base.brBytes, 0);
    /* PARSE TIME IS THE NOISY ONE — measured, not assumed. Five runs over
       byte-identical input gave 766 / 769 / 851 / 1012 / 1307 / 1594 ms: a 2.1x
       spread, because at these file sizes the number is dominated by JIT warm-up
       and scheduling rather than by the models — the "slowest model" was a
       different file on every pass. A percentage gate on that would fail honest
       builds and teach everyone to ignore the check.
       Taking the MEDIAN of `--repeat` parses inside one page removes all three:
       the same total then reproduced at 495 and 482 ms across passes, a 2.6%
       spread, and the worst model was prop-pipes-industrial both times. THAT is
       tight enough to gate on. Do not lower --repeat below 5 and keep this
       limit. */
    check("total parse ms", rows.reduce((s, r) => s + (r.parseMs||0), 0), base.rows.reduce((s, r) => s + (r.parseMs||0), 0), 20);
    check("drawables", rows.reduce((s,r)=>s+(r.drawCalls||0),0), base.rows.reduce((s,r)=>s+(r.drawCalls||0),0), 0);
    check("gpu verts after crease", rows.reduce((s,r)=>s+(r.gpuVertsAfterCrease||0),0), base.rows.reduce((s,r)=>s+(r.gpuVertsAfterCrease||0),0), 10);
    for (const r of rows) {
      const b = byName.get(r.name);
      if (!b) { console.log(`  NEW   ${r.name}`); continue; }
      if (b.ok && !r.ok) { regressions.push(`${r.name} loaded before and does not now: ${r.error}`); console.log(`  FAIL  ${r.name} NO LONGER LOADS: ${r.error}`); }
      if (b.bbox && r.bbox) {
        const drift = Math.max(...r.bbox.map((v, i) => b.bbox[i] ? Math.abs(v - b.bbox[i]) / b.bbox[i] : 0));
        if (drift > 0.02) { regressions.push(`${r.name} bbox moved ${(drift*100).toFixed(1)}% — orient/scale will shift`); console.log(`  FAIL  ${r.name} bbox ${JSON.stringify(b.bbox)} -> ${JSON.stringify(r.bbox)}`); }
      }
      if (b.classes && r.classes) {
        for (const k of Object.keys(r.classes)) if (r.classes[k] !== b.classes[k]) {
          regressions.push(`${r.name} finish classes changed: ${k} ${b.classes[k]} -> ${r.classes[k]}`);
          console.log(`  FAIL  ${r.name} ${k} ${b.classes[k]} -> ${r.classes[k]}`);
        }
      }
    }
  }

  /* ── Absolute parse ceiling ──────────────────────────────────────────────
     One model is the most a reader can ever be made to wait for — `queueParse`
     guarantees exactly that by running one parse at a time. So the number that
     matters is the WORST single model, not the sum, and it is judged against a
     fixed budget rather than against yesterday.
     Today's worst on the mobile shelf is prop-pipes-industrial at 22-24 ms
     median on this desktop. 60 ms is ~2.5x that — room for a model to get
     genuinely richer, and still a single dropped frame rather than a stutter
     once a mid phone's 4-6x penalty is applied. */
  const PARSE_CEILING_MS = 60;
  const tooSlow = rows.filter((r) => r.ok && r.parseMs > PARSE_CEILING_MS);
  for (const r of tooSlow) console.log(`  SLOW  ${r.name} parsed in ${r.parseMs} ms (ceiling ${PARSE_CEILING_MS} ms)`);

  /* ── Rename drift ────────────────────────────────────────────────────────
     Three separate things key off a model's FILENAME, and none of them fails
     loudly when it stops matching:
       compress-models HERO   — miss it and the file silently gets half the
                                texture budget it was chosen for
       /^(car|truck)-/        — miss it and the file is meshopt-QUANTISED, which
                                changes the space `toCreasedNormals` welds in
       public/models/<name>   — miss it and the pipeline has nothing to read */
  const cm = fs.readFileSync(path.join(ROOT, "scripts", "compress-models.js"), "utf8");
  const heroBlock = cm.match(/const HERO = new Set\(\[([\s\S]*?)\]\)/);
  const HERO = heroBlock ? [...heroBlock[1].matchAll(/"([\w.\-]+\.glb)"/g)].map((m) => m[1]) : [];
  const sources = fs.readdirSync(path.join(ROOT, "public", "models")).filter((f) => f.endsWith(".glb"));
  const drift = [
    ...HERO.filter((h) => !sources.includes(h)).map((h) => `HERO lists "${h}" but public/models has no such file`),
    ...HERO.filter((h) => !all.includes(h)).map((h) => `HERO lists "${h}" which the site no longer mounts`),
    ...all.filter((u) => !sources.includes(u)).map((u) => `Loaders.tsx mounts "${u}" but public/models has no source — the pipeline cannot rebuild it`),
    ...all.filter((u) => /^(car|truck)-/.test(u) && !HERO.includes(u)).map((u) => `vehicle "${u}" is not in HERO — it gets HALF the texture budget`),
  ];
  for (const d of drift) console.log(`  DRIFT ${d}`);

  const hardFail = failed.length || missing.length || stale.length || pageErrors.length
    || regressions.length || tooSlow.length || drift.length;
  console.log(`\n${hardFail ? "FAIL" : "PASS"} — ${failed.length} load failures, ${missing.length} missing, ${stale.length} stale twins,`
    + ` ${pageErrors.length} page errors, ${regressions.length} regressions, ${tooSlow.length} over parse ceiling, ${drift.length} name drift`);
  process.exit(hardFail ? 1 : 0);
})();
