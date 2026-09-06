import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const base = process.env.BASE_URL || "http://127.0.0.1:3196";
const label = process.env.QA_LABEL || "hero-curtain-baseline";
const output = path.resolve(`output/playwright/${label}`);
await fs.mkdir(output, { recursive: true });
const report = { base, label, cases: [], errors: [], failures: [] };
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: false, protocolTimeout: 180_000,
  args: ["--window-position=-2400,0", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--mute-audio"] });
try {
  for (const profile of [{ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    { width: 1440, height: 900, deviceScaleFactor: 1 }]) {
    const context = await browser.createBrowserContext();
    try {
      const page = await context.newPage();
      await page.setViewport(profile);
      page.on("pageerror", error => report.errors.push(error.message));
      await page.goto(`${base}/?perf=1&tune=1`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.querySelector("[data-hero-scene-ready]")?.getAttribute("data-hero-scene-ready") === "true" && window.__film?.three?.gl, { timeout: 60_000 });
      const release = await page.$eval('meta[name="2240-release"]', node => node.content);
      await page.evaluate(() => { window.__curtainOriginalScene = window.__film.three.scene; });
      const move = async (reel, position) => {
        await page.evaluate(({ reel, position }) => {
          const runway = document.querySelector(`[data-runway-${reel}]`);
          const rect = runway.getBoundingClientRect();
          // Just beyond the actual fade threshold but INSIDE the broad IO
          // margin, reproducing the extra hidden renderer work at the doorway.
          const y = rect.top + scrollY + (rect.height - innerHeight) * position;
          window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
          window.scrollTo(0, y);
        }, { reel, position });
      };
      const watchFade = () => page.evaluate(() => {
        window.__curtainFade = [];
        const until = performance.now() + 800;
        const record = () => {
          const opacity = Number(getComputedStyle(document.querySelector("[data-film-canvas]")).opacity);
          window.__curtainFade.push({ opacity, frame: window.__film.three.gl.info.render.frame });
          if (performance.now() < until) requestAnimationFrame(record);
        };
        requestAnimationFrame(record);
      });
      const sample = async (name, expectedVisible) => {
        await page.waitForFunction(visible => {
          const style = getComputedStyle(document.querySelector("[data-film-canvas]"));
          return visible ? Number(style.opacity) > .98 : style.visibility === "hidden" && Number(style.opacity) === 0;
        }, { timeout: 10_000 }, expectedVisible);
        // React commits the parking signal after the fade completion callback.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const start = await page.evaluate(() => window.__film.three.gl.info.render.frame);
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 600)));
        const state = await page.evaluate(() => {
          const host = document.querySelector("[data-film-canvas]");
          const gl = window.__film.three.gl;
          return { frame: gl.info.render.frame, opacity: getComputedStyle(host).opacity,
            visibility: getComputedStyle(host).visibility, scene: window.__film.three.scene.uuid,
            sameScene: window.__film.three.scene === window.__curtainOriginalScene,
            contexts: document.querySelectorAll("[data-hero-runtime] canvas").length,
            width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            dpr: gl.getPixelRatio(), buffer: [gl.domElement.width, gl.domElement.height],
            scrollY, act: window.__film.stage.act, at: performance.now() };
        });
        const entry = { name, profile, release, expectedVisible, drawSubmissions: state.frame - start, ...state };
        report.cases.push(entry);
        if (!state.sameScene || state.contexts !== 1) report.failures.push(`${profile.width}/${name}: scene/context replaced`);
        if (state.scrollWidth > profile.width) report.failures.push(`${profile.width}/${name}: horizontal overflow`);
        if (expectedVisible ? entry.drawSubmissions <= 0 : entry.drawSubmissions !== 0)
          report.failures.push(`${profile.width}/${name}: ${entry.drawSubmissions} submissions while ${expectedVisible ? "visible" : "fully hidden"}`);
        if (!expectedVisible) {
          entry.fadeFrames = await page.evaluate(() => window.__curtainFade.filter(r => r.opacity > 0 && r.opacity < .9));
          if (entry.fadeFrames.length < 2 || entry.fadeFrames.at(-1).frame <= entry.fadeFrames[0].frame)
            report.failures.push(`${profile.width}/${name}: outgoing fade must retain its live rendered animation`);
        }
        await page.screenshot({ path: path.join(output, `${profile.width}-${name}.png`), captureBeyondViewport: false });
      };
      await move("a", .75);
      await sample("visible-bay", true);
      await watchFade();
      await move("a", 1.015);
      await sample("hidden-after-opening", false);
      await move("a", .75);
      await sample("return-opening", true);
      await move("c", .55);
      await sample("visible-finale", true);
      await watchFade();
      await move("c", 1.015);
      await sample("hidden-after-finale", false);
      await move("c", .55);
      await sample("return-finale", true);
      // Reverse during the outgoing tween: a superseded completion must not
      // switch off the now-visible renderer.
      await move("a", 1.015);
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 100)));
      await move("a", .75);
      await sample("interrupted-hide-return", true);
    } finally { await context.close(); }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failures, [], "Hidden film must park only after its full fade, and resume on return without a remount");
  report.status = "PASS";
} catch (error) {
  report.status = "FAIL";
  report.failure = String(error.stack || error);
  process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, "results.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
