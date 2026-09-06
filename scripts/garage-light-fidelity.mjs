import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { ShaderChunk, REVISION } from "three";

// Private diagnostic, not an application shader patch. A zero-contribution
// light must produce identical HDR pixels before it can qualify for release.
const base = process.env.BASE_URL || "http://127.0.0.1:3197";
const label = process.env.QA_LABEL || "zero-light-fidelity";
const output = path.resolve(`output/playwright/garage-performance-2026-09-06/${label}`);
await fs.mkdir(output, { recursive: true });
const report = { label, base, revision: REVISION, status: "RUNNING", errors: [], poses: [] };
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: false, protocolTimeout: 180_000,
  args: ["--window-position=-2400,0", "--window-size=1600,1100", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--mute-audio", "--no-first-run"] });
const context = await browser.createBrowserContext();
const page = await context.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.on("pageerror", error => report.errors.push(error.message));
page.on("console", message => { if (message.type() === "error") report.errors.push(message.text()); });
try {
  await page.goto(`${base}/?perf=1&shaderdebug=1`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  report.release = await page.$eval('meta[name="2240-release"]', node => node.content);
  await page.waitForFunction(() => document.querySelector('[data-hero-runtime] canvas'), { timeout: 30_000 });
  await page.evaluate(() => {
    const y = scrollY + document.getElementById("walkthrough-runway").getBoundingClientRect().top;
    window.__lenis2240?.scrollTo(y, { immediate: true, force: true }); scrollTo(0, y);
  });
  await page.waitForFunction(() => document.querySelector('[data-shop-stage]')?.getAttribute('data-shop-stage') === 'world' && window.__shop?.composer?.current, { timeout: 90_000 });
  await page.evaluate(() => {
    const shop = window.__shop, original = shop.gl.render;
    shop.gl.render = function (scene, camera) {
      if (scene === shop.scene && camera !== shop.camera) shop.reflectionCameraForQA = camera;
      return original.call(this, scene, camera);
    };
  });
  const poses = process.env.QA_POSES ? process.env.QA_POSES.split(",").map(Number) : [0.175, 0.8, 1.175, 1.8, 2.175, 2.8, 3.175, 3.8, 4.175, 4.8, 5.175, 5.8, 6.175];
  for (const pose of poses) {
    await page.evaluate(pose => {
      const rect = document.getElementById("walkthrough-runway").getBoundingClientRect();
      const y = scrollY + rect.top + (((pose - 0.175) * 2.4 + 0.7) / 15.8) * (rect.height - innerHeight);
      window.__lenis2240?.scrollTo(y, { immediate: true, force: true }); scrollTo(0, y);
    }, pose);
    await page.waitForFunction(pose => Math.abs(window.__shop.camera.userData.rail.t * 6 - pose) < 0.05, { timeout: 15_000 }, pose);
    const result = await page.evaluate(async ({ chunk }) => {
      const { gl: renderer, scene, camera, composer, reflectionCameraForQA } = window.__shop;
      const root = scene.__r3f.root, mode = root.getState().frameloop;
      const previousTarget = renderer.getRenderTarget(), previousAutoClear = renderer.autoClear;
      root.setState({ frameloop: "never" });
      const target = composer.current.inputBuffer.clone();
      const materials = new Map();
      let floor;
      scene.traverse(object => {
        if (object.material?.color?.getHexString() === "292c33" && object.position.y === 0 && object.geometry?.index?.count === 6) floor = object;
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          if (material?.isMeshStandardMaterial && !materials.has(material)) materials.set(material, { compile: material.onBeforeCompile, key: material.customProgramCacheKey });
        }
      });
      if (!floor || !reflectionCameraForQA || !materials.size) throw new Error("Missing original world state");
      const floorVisible = floor.visible;
      const call = "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );";
      // Replace only the FIRST call: the point-light loop. No light values,
      // attenuation, draw order, surface equations or other loops are changed.
      const optimized = chunk.replace(call, `if ( directLight.visible ) { ${call} }`);
      if (optimized === chunk) throw new Error("Point-light shader anchor missing");
      let patchedCompiles = 0;
      const select = enabled => {
        for (const [material, original] of materials) {
          material.onBeforeCompile = enabled ? function (shader, gl) {
            original.compile.call(this, shader, gl);
            if (!shader.fragmentShader.includes("#include <lights_fragment_begin>")) throw new Error("Missing composed lights chunk");
            shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", optimized);
            patchedCompiles++;
          } : original.compile;
          material.customProgramCacheKey = enabled ? function () { return `${original.key.call(this)}|qa-zero-point-light-v1`; } : original.key;
          material.needsUpdate = true;
        }
      };
      const digest = async pixels => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", pixels))).map(n => n.toString(16).padStart(2, "0")).join("");
      const comparisons = [];
      try {
        renderer.autoClear = true;
        for (const [name, view, width, height, samples] of [["main", camera, target.width, target.height, 4], ["reflection", reflectionCameraForQA, 256, 256, 0]]) {
          floor.visible = name === "reflection" ? false : floorVisible;
          if (target.samples !== samples) { target.samples = samples; target.dispose(); }
          target.setSize(width, height);
          const render = async enabled => {
            select(enabled);
            renderer.setRenderTarget(target);
            await renderer.compileAsync(scene, view);
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
          comparisons.push({ name, width, height, samples, changedChannels, changedPixels, repeatedChannels, beforeHash: await digest(before), afterHash: await digest(after), repeatHash: await digest(repeat), differences });
        }
        const error = renderer.getContext().getError();
        if (error) throw new Error(`WebGL readback error ${error}`);
        return { materials: materials.size, patchedCompiles, comparisons };
      } finally {
        select(false);
        floor.visible = floorVisible;
        renderer.autoClear = previousAutoClear;
        renderer.setRenderTarget(previousTarget);
        target.dispose();
        root.setState({ frameloop: mode });
        root.getState().invalidate();
      }
    }, { chunk: ShaderChunk.lights_fragment_begin });
    report.poses.push({ pose, ...result });
    console.log(JSON.stringify({ pose, ...result }));
  }
  assert.deepEqual(report.errors, []);
  assert.ok(report.poses.some(pose => pose.patchedCompiles > 0), "Experiment must actually compile the changed shader");
  assert.ok(report.poses.every(pose => pose.comparisons.every(frame => frame.repeatedChannels === 0)), "ABA baseline must be deterministic");
  assert.ok(report.poses.every(pose => pose.comparisons.every(frame => frame.changedChannels === 0)), "Zero-light optimization must retain the original HDR pixels");
  report.status = "PASS";
} catch (error) { report.status = "FAIL"; report.failure = String(error.stack || error); console.error(report.failure); }
finally { await fs.writeFile(path.join(output, "results.json"), JSON.stringify(report, null, 2)); await context.close(); await browser.close(); }
console.log(JSON.stringify({ label, status: report.status, output, failure: report.failure }));
if (report.status !== "PASS") process.exitCode = 1;
