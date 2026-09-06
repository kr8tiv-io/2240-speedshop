import puppeteer from "puppeteer-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.BASE_URL || "http://127.0.0.1:3197";
const output = path.resolve(process.env.HERO_PROBE_OUTPUT || "output/playwright/site-actions-2026-09-06/hero-viewport");
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: false, protocolTimeout: 120_000,
  args: ["--window-position=-2400,0", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows"],
});
try {
  const page = await browser.newPage();
  const viewport = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
  await page.setViewport(viewport);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/?tune`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__film?.three?.camera && !document.querySelector("[data-preloader]"), { timeout: 50_000 });
  const heldY = await page.evaluate(() => {
    const runway = document.querySelector("[data-runway-a]").getBoundingClientRect();
    const y = runway.top + scrollY + 0.25 * (runway.height - innerHeight);
    if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
    const st = window.ScrollTrigger || window.gsap?.core?.globals?.().ScrollTrigger;
    window.__viewportProbe = { frames: [], phase: "settle", refreshes: st ? 0 : null,
      refreshListenerAvailable: Boolean(st), resizeEvents: 0 };
    st?.addEventListener("refresh", () => window.__viewportProbe.refreshes++);
    window.addEventListener("resize", () => window.__viewportProbe.resizeEvents++);
    function capture() {
      const p = window.__viewportProbe;
      if (!p) return;
      const film = window.__film;
      const host = document.querySelector("[data-film-canvas]");
      const canvas = host?.querySelector("canvas");
      const runway = document.querySelector("[data-runway-a]");
      const camera = film?.three.camera;
      if (camera && canvas) p.frames.push({ time: performance.now(), phase: p.phase, scrollY,
        innerHeight, visualHeight: visualViewport?.height, hostHeight: host.getBoundingClientRect().height,
        canvasHeight: canvas.getBoundingClientRect().height, bufferHeight: canvas.height, bufferWidth: canvas.width,
        runwayHeight: runway.getBoundingClientRect().height, stickyHeight: runway.firstElementChild.getBoundingClientRect().height,
        stage: { ...film.stage }, position: camera.position.toArray(), aspect: camera.aspect, fov: camera.fov,
        projection: camera.projectionMatrix.toArray(), refreshes: p.refreshes, resizeEvents: p.resizeEvents });
      requestAnimationFrame(capture);
    }
    requestAnimationFrame(capture);
    return y;
  });
  const record = async (phase, duration) => {
    await page.evaluate((label) => { window.__viewportProbe.phase = label; }, phase);
    await new Promise((resolve) => setTimeout(resolve, duration));
  };
  await record("baseline-844", 1800);
  await page.screenshot({ path: path.join(output, "baseline-844.png") });
  for (const height of [780, 844]) {
    await page.evaluate((next) => { window.__viewportProbe.phase = `resize-${next}`; }, height);
    await page.setViewport({ ...viewport, height });
    await page.evaluate((y) => {
      if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }, heldY);
    await record(`resize-${height}`, 1800);
    await page.screenshot({ path: path.join(output, `resize-${height}.png`) });
  }
  await page.evaluate(() => { window.__viewportProbe.phase = "native-touch-scroll"; });
  const session = await page.createCDPSession();
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: 650 }] });
  for (let index = 1; index <= 14; index++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y: 650 - index * 22 }] });
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await record("touch-settle", 1500);
  const result = await page.evaluate(() => {
    const result = window.__viewportProbe;
    window.__viewportProbe = null;
    return result;
  });
  await writeFile(path.join(output, "results.json"), JSON.stringify({ base, heldY, errors, ...result,
    limitation: "Controlled Chromium viewport resize and native CDP touch input; not physical Safari browser chrome." }, null, 2));
  console.log(JSON.stringify({ output, frames: result.frames.length, errors, heldY, refreshes: result.refreshes }));
} finally {
  await browser.close();
}
