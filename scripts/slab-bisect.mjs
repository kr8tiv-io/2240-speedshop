/**
 * Name the object painting the black slab, by elimination — no more theories.
 *
 *   node scripts/slab-bisect.mjs http://localhost:PORT 5200 600 650
 *
 * Guessing has now been wrong four times (giant point, rubber albedo, ghost,
 * hood lighting). This hides one candidate at a time, samples the mean
 * luminance of a 120px patch centred on the slab, and reports which single
 * removal actually lifts it. The screenshot is cropped via CDP clip so each
 * probe is cheap.
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, yArg, pxArg, pyArg] = process.argv.slice(2);
const Y = Number(yArg), PX = Number(pxArg), PY = Number(pyArg);

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

async function patchLum() {
  const shot = await page.screenshot({
    clip: { x: PX - 60, y: PY - 60, width: 120, height: 120 },
    encoding: "base64",
  });
  // Decode via the page itself — no image lib needed in node.
  return await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 30;
    c.height = 30;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, 30, 30);
    const d = ctx.getImageData(0, 0, 30, 30).data;
    let s = 0;
    for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    return Math.round((s / (d.length / 4)) * 10) / 10;
  }, shot);
}

const baseline = await patchLum();
console.log(`baseline patch luminance: ${baseline}`);

// Build the candidate list: every named top-level scene child, and inside the
// live act group every distinct object type bucket.
const candidates = await page.evaluate(() => {
  const { scene } = window.__film.three;
  window.__cands = [];
  scene.children.forEach((c, i) => {
    let meshes = 0;
    c.traverse((o) => { if (o.isMesh || o.isPoints || o.isSprite || o.isLine) meshes++; });
    window.__cands.push({ path: [i], label: `child[${i}] ${c.type} (${meshes} drawables)` });
  });
  const live = scene.children.findIndex((c) => {
    let n = 0;
    c.traverse((o) => { if (o.isMesh) n++; });
    return c.visible && n > 20;
  });
  if (live >= 0) {
    scene.children[live].children.forEach((k, j) => {
      let n = 0;
      k.traverse((o) => { if (o.isMesh || o.isPoints) n++; });
      window.__cands.push({ path: [live, j], label: `act.child[${j}] ${k.type} name="${k.name}" (${n})` });
    });
  }
  return window.__cands.map((c) => c.label);
});

for (let i = 0; i < candidates.length; i++) {
  await page.evaluate((idx) => {
    const { scene } = window.__film.three;
    const cand = window.__cands[idx];
    let node = scene;
    for (const p of cand.path) node = node.children[p];
    cand.was = node.visible;
    node.visible = false;
    window.__hidden = node;
  }, i);
  await new Promise((r) => setTimeout(r, 250));
  const lum = await patchLum();
  await page.evaluate(() => {
    if (window.__hidden) window.__hidden.visible = true;
  });
  const delta = lum - baseline;
  console.log(`${delta > 12 ? ">>> " : "    "}hide ${candidates[i]} -> ${lum} (${delta >= 0 ? "+" : ""}${Math.round(delta * 10) / 10})`);
}
await browser.close();
