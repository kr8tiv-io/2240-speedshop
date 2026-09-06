import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const base = process.env.BASE_URL || "http://127.0.0.1:3197";
const label = process.env.QA_LABEL || "opaque-sort-fidelity";
const output = path.resolve(`output/playwright/garage-performance-2026-09-06/${label}`);
await fs.mkdir(output, { recursive: true });
const report = { label, base, status: "RUNNING", errors: [], poses: [] };
report.experiment = process.env.QA_SORT_EXPERIMENT || "front-first";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: false, protocolTimeout: 180_000,
  args: ["--window-position=-2400,0", "--window-size=1600,1100", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--mute-audio", "--no-first-run"] });
const context = await browser.createBrowserContext();
const page = await context.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.on("pageerror", error => report.errors.push(error.message));
page.on("console", message => { if (message.type() === "error") report.errors.push(message.text()); });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  await page.goto(`${base}/?perf=1`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  report.release = await page.$eval('meta[name="2240-release"]', node => node.content);
  await page.waitForFunction(() => document.querySelector('[data-hero-runtime] canvas'), { timeout: 30_000 });
  await page.evaluate(() => {
    const y = scrollY + document.getElementById("walkthrough-runway").getBoundingClientRect().top;
    window.__lenis2240?.scrollTo(y, { immediate: true, force: true }); scrollTo(0, y);
  });
  await page.waitForFunction(() => document.querySelector('[data-shop-stage]')?.getAttribute('data-shop-stage') === 'world' && window.__shop?.composer?.current, { timeout: 90_000 });
  // Observe the exact reflection camera; do not reconstruct or change its rail.
  await page.evaluate(() => {
    const shop = window.__shop;
    const original = shop.gl.render;
    shop.gl.render = function (scene, camera) {
      if (scene === shop.scene && camera !== shop.camera) shop.reflectionCameraForQA = camera;
      return original.call(this, scene, camera);
    };
  });
  for (const pose of [0.175, 0.8, 1.175, 1.8, 2.175, 2.8, 3.175, 3.8, 4.175, 4.8, 5.175, 5.8, 6.175]) {
    await page.evaluate(pose => {
      const rect = document.getElementById("walkthrough-runway").getBoundingClientRect();
      // Inverse of the existing section timeline, including each orbit/travel.
      const progress = ((pose - 0.175) * 2.4 + 0.7) / 15.8;
      const y = scrollY + rect.top + progress * (rect.height - innerHeight);
      window.__lenis2240?.scrollTo(y, { immediate: true, force: true }); scrollTo(0, y);
    }, pose);
    await page.waitForFunction(pose => Math.abs(window.__shop.camera.userData.rail.t * 6 - pose) < 0.05, { timeout: 15_000 }, pose);
    await wait(1000);
    const comparisons = await page.evaluate(async ({ experiment }) => {
      const { gl: renderer, scene, camera, composer, reflectionCameraForQA } = window.__shop;
      const root = scene.__r3f.root;
      const mode = root.getState().frameloop;
      const previousTarget = renderer.getRenderTarget(), previousAutoClear = renderer.autoClear;
      // Freeze callbacks, not geometry or material quality. The three draws in
      // each ABA comparison use exactly the same camera, animation and uniforms.
      root.setState({ frameloop: "never" });
      const target = composer.current.inputBuffer.clone();
      let shell;
      scene.traverse(object => { if (object.material?.color?.getHexString() === "292c33" && object.position.y === 0 && object.geometry?.index?.count === 6) shell = object.parent; });
      if (!shell) throw new Error("Missing observed original structural shell");
      const previousShellOrder = shell.renderOrder;
      const frontFirst = (a, b) => a.groupOrder - b.groupOrder || a.renderOrder - b.renderOrder || a.z - b.z || a.material.id - b.material.id || a.materialVariant - b.materialVariant || a.id - b.id;
      const digest = async pixels => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", pixels))).map(n => n.toString(16).padStart(2, "0")).join("");
      const results = [];
      try {
        renderer.autoClear = true;
        for (const [name, view, width, height, samples] of [["main", camera, target.width, target.height, 4], ["reflection", reflectionCameraForQA, 256, 256, 0]]) {
          if (!view) throw new Error("Missing observed reflection camera");
          if (target.samples !== samples) { target.samples = samples; target.dispose(); }
          target.setSize(width, height);
          const render = async sorted => {
            renderer.setOpaqueSort(sorted && experiment === "front-first" ? frontFirst : null);
            shell.renderOrder = sorted && experiment === "room-last" ? 1 : previousShellOrder;
            renderer.setRenderTarget(target);
            renderer.render(scene, view);
            renderer.setRenderTarget(null);
            const pixels = new Uint16Array(width * height * 4);
            await renderer.readRenderTargetPixelsAsync(target, 0, 0, width, height, pixels);
            return pixels;
          };
          const before = await render(false), after = await render(true), repeat = await render(false);
          let changedChannels = 0, repeatedChannels = 0, changedPixels = 0;
          const differences = [];
          for (let pixel = 0; pixel < before.length; pixel += 4) {
            let changed = false;
            for (let channel = 0; channel < 4; channel++) {
              const i = pixel + channel;
              if (before[i] !== after[i]) { changedChannels++; changed = true; if (differences.length < 15) differences.push({ pixel: pixel / 4, channel, before: before[i], after: after[i] }); }
              if (before[i] !== repeat[i]) repeatedChannels++;
            }
            if (changed) changedPixels++;
          }
          results.push({ name, width, height, samples, changedChannels, changedPixels, repeatedChannels, beforeHash: await digest(before), afterHash: await digest(after), repeatHash: await digest(repeat), differences });
        }
        const error = renderer.getContext().getError();
        if (error) throw new Error(`WebGL readback error ${error}`);
        return results;
      } finally {
        renderer.setOpaqueSort(null);
        shell.renderOrder = previousShellOrder;
        renderer.autoClear = previousAutoClear;
        renderer.setRenderTarget(previousTarget);
        target.dispose();
        root.setState({ frameloop: mode });
        root.getState().invalidate();
      }
    }, { experiment: report.experiment });
    report.poses.push({ pose, comparisons });
    console.log(JSON.stringify({ pose, comparisons: comparisons.map(({ differences, ...result }) => result) }));
  }
  assert.deepEqual(report.errors, []);
  assert.ok(report.poses.every(pose => pose.comparisons.every(frame => frame.repeatedChannels === 0)), "ABA baseline must be deterministic");
  assert.ok(report.poses.every(pose => pose.comparisons.every(frame => frame.changedChannels === 0)), "Opaque sorting must retain the original HDR pixels");
  report.status = "PASS";
} catch (error) { report.status = "FAIL"; report.failure = String(error.stack || error); console.error(report.failure); }
finally { await fs.writeFile(path.join(output, "results.json"), JSON.stringify(report, null, 2)); await context.close(); await browser.close(); }
console.log(JSON.stringify({ label, status: report.status, output, failure: report.failure }));
if (report.status !== "PASS") process.exitCode = 1;
