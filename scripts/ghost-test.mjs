/**
 * Is the wireframe GHOST covering the car?
 *
 *   node scripts/ghost-test.mjs http://localhost:4315 4400
 *
 * The act's group holds the car AND a second draw of the same geometry as a
 * lattice, built with `line.matrix.copy(mesh.matrixWorld)` and
 * matrixAutoUpdate off. If that copied matrix and the group's own transform
 * are ever applied together, the ghost is not where the car is. The original
 * failing frame — pure black with faint line traces along the bottom — is
 * exactly what an oversized lattice drawn in front of the camera looks like.
 *
 * The ghost is one material shared across many meshes, so it is identifiable
 * without guessing: whichever material instance the most meshes point at.
 * Hide those meshes, change NOTHING else, and shoot the normal render.
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, yArg] = process.argv.slice(2);
const Y = Number(yArg);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-position=-2400,0", "--window-size=1456,1020"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
for (let y = 0; y < Y; y += 300) {
  await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.08 }), y);
  await new Promise((r) => setTimeout(r, 45));
}
await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.2 }), Y);
await new Promise((r) => setTimeout(r, 1600));
await page.screenshot({ path: "C:\\tmp\\ghost-before.png" });

const info = await page.evaluate(() => {
  const { scene } = window.__film.three;
  const group = scene.children.find((c) => {
    let n = 0;
    c.traverse((o) => { if (o.isMesh) n++; });
    return c.visible && n > 20;
  });
  if (!group) return { error: "no live act group" };

  // Tally how many meshes share each material instance.
  const counts = new Map();
  group.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [].concat(o.material || [])) {
      if (m) counts.set(m, (counts.get(m) || 0) + 1);
    }
  });
  let ghostMat = null, best = 0;
  for (const [m, n] of counts) if (n > best) { best = n; ghostMat = m; }

  // Measure the ghost's world extent against the car's, then hide it.
  let hidden = 0;
  const box = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  group.traverse((o) => {
    if (!o.isMesh) return;
    const isGhost = [].concat(o.material || []).includes(ghostMat);
    if (!isGhost) return;
    const e = o.matrixWorld.elements;
    const s = Math.hypot(e[0], e[1], e[2]);
    const g = o.geometry;
    g.computeBoundingBox?.();
    const bb = g.boundingBox;
    if (bb) {
      for (const k of [0, 1, 2]) {
        const lo = [bb.min.x, bb.min.y, bb.min.z][k] * s + e[12 + k];
        const hi = [bb.max.x, bb.max.y, bb.max.z][k] * s + e[12 + k];
        box.min[k] = Math.min(box.min[k], lo, hi);
        box.max[k] = Math.max(box.max[k], lo, hi);
      }
    }
    o.visible = false;
    hidden++;
  });

  return {
    sharedBy: best,
    matType: ghostMat?.type,
    hidden,
    ghostWorldSize: box.min[0] === Infinity ? null : [0, 1, 2].map((k) => Math.round((box.max[k] - box.min[k]) * 100) / 100),
  };
});
console.log("GHOST:", JSON.stringify(info));

await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: "C:\\tmp\\ghost-after.png" });

/* BODYWORK ALONE. Every previous isolation left one other thing in the frame
   that could paint: the floor, the scan sheet, the point cloud (whose size is
   undefined under an override material), or the ghost. Each time the magenta
   mass turned out to be that other thing. This hides all of them at once and
   pins the state every frame, so anything magenta left on screen is the car. */
const kept = await page.evaluate(() => {
  const { scene } = window.__film.three;
  let donor = null;
  scene.traverse((o) => {
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    if (!donor && m?.type === "MeshBasicMaterial") donor = m;
  });
  const flat = donor.clone();
  flat.color.setHex(0xff00ff);
  flat.transparent = false;
  flat.opacity = 1;
  flat.map = null;
  flat.toneMapped = false;
  flat.depthTest = true;
  flat.depthWrite = true;
  scene.overrideMaterial = flat;

  const live = scene.children.find((c) => {
    let n = 0;
    c.traverse((o) => { if (o.isMesh) n++; });
    return c.visible && n > 20;
  });
  for (const c of scene.children) if (c !== live) c.visible = false;

  // The ghost material is the one instance the most meshes share.
  const counts = new Map();
  live.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [].concat(o.material || [])) if (m) counts.set(m, (counts.get(m) || 0) + 1);
  });
  let ghostMat = null, best = 0;
  for (const [m, n] of counts) if (n > best) { best = n; ghostMat = m; }

  let shown = 0;
  const pin = () => {
    shown = 0;
    live.traverse((o) => {
      if (o.isPoints) { o.visible = false; return; }
      if (!o.isMesh) return;
      const g = o.geometry;
      const tris = (g?.index?.count ?? g?.attributes?.position?.count ?? 0) / 3;
      const isGhost = [].concat(o.material || []).includes(ghostMat);
      o.visible = !isGhost && tris > 4;
      if (o.visible) shown++;
    });
    requestAnimationFrame(pin);
  };
  pin();
  return { ghostShared: best, carMeshes: shown };
});
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: "C:\\tmp\\ghost-bodyonly.png" });
console.log("BODY ONLY:", JSON.stringify(kept), "-> ghost-bodyonly.png");
await browser.close();
