/* Walk-through diagnostics: scene/DoF/rail state at three beats, with [shop] logs. */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const OUT = path.join(__dirname, "..", "shots-wt-diag");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 240000,
    args: [
      "--window-position=-2400,0",
      "--window-size=1600,1100",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--mute-audio",
      "--no-first-run",
    ],
  });
  const page = await browser.newPage();
  const logs = [];
  page.on("console", (m) => {
    const t = m.text();
    if (t.includes("[shop]") || m.type() === "error") logs.push(`${m.type()}: ${t}`);
  });
  page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  await page.goto(`${BASE}/?perf`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await sleep(6000);

  const wt = await page.evaluate(() => {
    const n = document.querySelector("#walkthrough-runway");
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });
  if (!wt) {
    console.log("NO RUNWAY");
    await browser.close();
    return;
  }

  const dump = () =>
    page.evaluate(() => {
      const shop = window.__shop;
      const out = { hasShop: !!shop, scrollY: Math.round(window.scrollY) };
      const host = document.querySelector("canvas");
      if (host) {
        out.canvas = {
          w: host.width,
          h: host.height,
          cw: host.clientWidth,
          ch: host.clientHeight,
          n: document.querySelectorAll("canvas").length,
        };
      }
      if (!shop || !shop.scene) return out;
      const { scene, camera, gl } = shop;
      out.pixelRatio = gl.getPixelRatio();
      out.glSize = { w: gl.domElement.width, h: gl.domElement.height, cw: gl.domElement.clientWidth, ch: gl.domElement.clientHeight };
      out.cam = camera.position.toArray().map((v) => +v.toFixed(2));
      out.fov = +camera.fov.toFixed(1);
      const rail = camera.userData.rail;
      out.rail = rail
        ? { t: +rail.t.toFixed(4), station: +(rail.t * 6).toFixed(2), look: rail.look.toArray().map((v) => +v.toFixed(2)) }
        : null;
      out.children = scene.children.map((c, i) => {
        let meshes = 0, vis = 0, paced = 0, lights = 0;
        c.traverse((n) => {
          if (n.isMesh || n.isPoints || n.isLine) {
            meshes++;
            if (n.visible) vis++;
            if (n.userData && n.userData.pacedHidden) paced++;
          }
          if (n.isLight) lights++;
        });
        return { i, type: c.type, visible: c.visible, meshes, vis, paced, lights };
      });
      const comp = shop.composer && shop.composer.current;
      if (comp && comp.passes) {
        out.passes = comp.passes.map((p) => p.constructor.name);
        for (const p of comp.passes) {
          const effects = p.effects || [];
          for (const e of effects) {
            const name = e.constructor.name;
            if (/DepthOfField/i.test(name) || (e.cocMaterial || e.circleOfConfusionMaterial)) {
              const m = e.cocMaterial || e.circleOfConfusionMaterial;
              const u = m && m.uniforms;
              out.dof = {
                name,
                target: e.target ? e.target.toArray().map((v) => +v.toFixed(2)) : null,
                bokehScale: e.bokehScale,
                focusDistance: u && u.focusDistance ? u.focusDistance.value : null,
                focusRange: u && u.focusRange ? u.focusRange.value : null,
                resolution: e.resolution ? { w: e.resolution.width, h: e.resolution.height } : null,
              };
            }
          }
        }
      }
      return out;
    });

  const results = {};
  for (const [label, p] of [["doorway", 0.03], ["mid", 0.42], ["dyno", 0.62], ["late", 0.83]]) {
    const y = Math.max(0, wt.top + p * Math.max(1, wt.height - 900));
    await page.evaluate((yy) => {
      const lenis = window.__lenis2240;
      if (lenis) lenis.scrollTo(yy, { immediate: true, force: true });
      window.scrollTo(0, yy);
    }, y);
    await sleep(4000);
    results[label] = await dump();
    await page.screenshot({ path: path.join(OUT, `diag-${label}.png`) });
  }

  // Give the 15s module timer and 10s watchdog time to act, then re-dump dyno.
  await sleep(12000);
  results["dyno-after-wait"] = await dump();
  await page.screenshot({ path: path.join(OUT, "diag-dyno-after-wait.png") });

  fs.writeFileSync(path.join(OUT, "diag.json"), JSON.stringify({ wt, results, logs }, null, 2));
  console.log(JSON.stringify({ wt, results }, null, 2));
  console.log("LOGS:\n" + logs.join("\n"));
  await browser.close();
})();
