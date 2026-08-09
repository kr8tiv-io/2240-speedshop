/**
 * Parse every shipped GLB through three's own GLTFLoader, in a real browser.
 *
 * WHY THIS EXISTS
 *
 * `prop-bench-vice.glb` once wrote successfully and threw on load: the pipeline
 * stripped JOINTS_0/WEIGHTS_0 while a node still referenced a Skin, so three
 * asked a deleted accessor for its `count` and died. A single bad model unmounts
 * the whole Canvas, and nothing before this point would catch it — gltf-transform
 * validates what it wrote, not what three will do with it. File size, node count
 * and a clean write are all consistent with a file that cannot be loaded.
 *
 * So the only honest test is the real loader, with the real extensions, in a real
 * browser. Anything less is checking that the writer agrees with itself.
 *
 *   node scripts/loadtest-models.js [dir ...]     (default: both shipped shelves)
 *
 * Exits non-zero if any model fails, so it can gate a deploy.
 */
const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.resolve(__dirname, "..");
const LIB = "C:\\Users\\lucid\\Desktop\\2240-v-dark\\node_modules";
const puppeteer = require(path.join(LIB, "puppeteer-core"));
const CHROME =
  "C:\\Users\\lucid\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe";

const dirs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [path.join(ROOT, "public", "models-opt"), path.join(ROOT, "public", "models-mobile")];

const MIME = {
  ".glb": "model/gltf-binary",
  ".js": "text/javascript",
  ".wasm": "application/wasm",
  ".html": "text/html",
};

/* Serve the repo over HTTP: three's loader and the meshopt decoder both want
   real requests, and file:// gives neither of them a usable origin. */
function serve(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split("?")[0]);
      // The harness page is served rather than injected, so the document has a
      // real http origin and `/_lib/…` resolves as an ordinary absolute URL.
      if (rel === "/_loadtest.html") {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(
          `<!doctype html><meta charset=utf-8>
           <script type="importmap">
           {"imports":{"three":"/_lib/three/build/three.module.js","three/addons/":"/_lib/three/examples/jsm/"}}
           </script><body></body>`,
        );
        return;
      }
      // `/_lib/…` exposes node_modules so three's example modules can resolve
      // their OWN relative imports — GLTFLoader reaches for
      // `../utils/BufferGeometryUtils.js`, which no amount of blob-URL
      // rewriting can satisfy. Served properly, with an import map for the bare
      // `three` specifier, the real module graph just loads.
      const base = rel.startsWith("/_lib/") ? path.join(ROOT, "node_modules") : path.join(ROOT, "public");
      const file = path.join(base, rel.startsWith("/_lib/") ? rel.slice(6) : rel);
      if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

(async () => {
  const port = 8781;
  const server = await serve(port);
  // Headful. GLTFLoader parses geometry and materials without ever touching a
  // GL context, so no renderer is needed — and the headless+swiftshader
  // combination times out waiting for its WS endpoint on this machine, which is
  // a launch problem masquerading as a model problem.
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    args: ["--no-sandbox", "--window-size=520,400"],
    protocolTimeout: 600000,
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log(`  page error: ${String(e).slice(0, 200)}`));

  // three and the meshopt decoder come from the app's OWN node_modules, so this
  // tests the exact versions that ship.
  await page.goto(`http://localhost:${port}/_loadtest.html`, { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    const [three, gltf, meshopt] = await Promise.all([
      import("three"),
      import("/_lib/three/examples/jsm/loaders/GLTFLoader.js"),
      import("/_lib/three/examples/jsm/libs/meshopt_decoder.module.js"),
    ]);
    window.__T = three;
    window.__L = new gltf.GLTFLoader();
    window.__L.setMeshoptDecoder(meshopt.MeshoptDecoder);
  });

  let failed = 0;
  let checked = 0;
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      console.log(`skip (missing): ${dir}`);
      continue;
    }
    const rel = path.relative(path.join(ROOT, "public"), dir).replace(/\\/g, "/");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".glb"));
    console.log(`\n${rel} — ${files.length} models`);
    for (const file of files) {
      checked++;
      const out = await page.evaluate(
        (href) =>
          new Promise((resolve) => {
            window.__L.load(
              href,
              (g) => {
                // Loading is not enough: three defers plenty until the scene is
                // walked, so touch every mesh the way a render would.
                let meshes = 0;
                let tris = 0;
                try {
                  g.scene.traverse((o) => {
                    if (!o.isMesh) return;
                    meshes++;
                    const idx = o.geometry.index;
                    const pos = o.geometry.attributes.position;
                    if (!pos) throw new Error("mesh has no position attribute");
                    tris += (idx ? idx.count : pos.count) / 3;
                    o.geometry.computeBoundingSphere();
                    if (!Number.isFinite(o.geometry.boundingSphere.radius))
                      throw new Error("non-finite bounding sphere (NaN in positions)");
                    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
                      if (!m) throw new Error("mesh has a null material");
                    }
                  });
                } catch (e) {
                  resolve({ ok: false, error: String(e && e.message ? e.message : e) });
                  return;
                }
                resolve({ ok: true, meshes, tris: Math.round(tris) });
              },
              undefined,
              (e) => resolve({ ok: false, error: String(e && e.message ? e.message : e).slice(0, 200) }),
            );
          }),
        `http://localhost:${port}/${rel}/${file}`,
      );
      if (out.ok) {
        process.stdout.write(".");
      } else {
        failed++;
        console.log(`\n  FAIL ${file}: ${out.error}`);
      }
    }
  }

  console.log(`\n\n${checked} models parsed through three's GLTFLoader · ${failed} failed`);
  await browser.close();
  server.close();
  process.exit(failed ? 1 : 0);
})();
