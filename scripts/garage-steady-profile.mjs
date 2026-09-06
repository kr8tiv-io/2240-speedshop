import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const base = process.env.BASE_URL || "http://127.0.0.1:3197";
const label = process.env.QA_LABEL || "desktop-steady-baseline";
const output = path.resolve(`output/playwright/garage-performance-2026-09-06/${label}`);
await fs.mkdir(output, { recursive: true });
const report = { label, base, startedAt: new Date().toISOString(), status: "RUNNING", errors: [], stations: [] };
report.opaqueSort = process.env.QA_OPAQUE_SORT || "default";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: false, protocolTimeout: 180_000,
  args: ["--window-position=-2400,0", "--window-size=1600,1100", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--mute-audio", "--no-first-run"],
});
const context = await browser.createBrowserContext();
const page = await context.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.on("pageerror", error => report.errors.push(error.message));
page.on("console", message => { if (message.type() === "error") report.errors.push(message.text()); });
page.on("response", response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  await page.goto(`${base}/?perf=1`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  report.release = await page.$eval('meta[name="2240-release"]', node => node.content);
  await page.waitForFunction(() => document.querySelector('[data-hero-runtime] canvas'), { timeout: 30_000 });
  await page.evaluate(() => {
    const runway = document.getElementById("walkthrough-runway");
    const y = scrollY + runway.getBoundingClientRect().top;
    window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
    scrollTo(0, y);
  });
  await page.waitForFunction(() => document.querySelector('[data-shop-stage]')?.getAttribute('data-shop-stage') === 'world' && window.__shop?.composer?.current, { timeout: 90_000 });
  await wait(2000);
  if (process.env.QA_OPAQUE_SORT === "front-first") await page.evaluate(() => {
    window.__shop.gl.setOpaqueSort((a, b) => a.groupOrder - b.groupOrder || a.renderOrder - b.renderOrder || a.z - b.z || a.material.id - b.material.id || a.materialVariant - b.materialVariant || a.id - b.id);
  });
  if (process.env.QA_OPAQUE_SORT === "room-last") await page.evaluate(() => {
    let shell;
    window.__shop.scene.traverse(object => { if (object.material?.color?.getHexString() === "292c33" && object.position.y === 0 && object.geometry?.index?.count === 6) shell = object.parent; });
    if (!shell) throw new Error("Missing original structural shell");
    shell.renderOrder = 1;
  });
  report.inventory = await page.evaluate(() => {
    const { gl: renderer, composer, scene, camera } = window.__shop;
    const gl = renderer.getContext();
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const unsafeOpaque = [], lights = [];
    scene.traverse(object => {
      if (object.isLight) lights.push({ type: object.type, intensity: object.intensity, distance: object.distance, visible: object.visible });
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (material && !material.transparent && (!material.depthTest || !material.depthWrite || material.blending > 1)) unsafeOpaque.push({ object: object.name, material: material.name, type: material.type, depthTest: material.depthTest, depthWrite: material.depthWrite, blending: material.blending });
      }
    });
    const passInfo = pass => ({ name: pass.name, constructor: pass.constructor.name, enabled: pass.enabled, needsSwap: pass.needsSwap, renderToScreen: pass.renderToScreen, effects: pass.effects?.map(effect => ({ name: effect.name, constructor: effect.constructor.name })) });
    return { gpu: info && gl.getParameter(info.UNMASKED_RENDERER_WEBGL), dpr: renderer.getPixelRatio(), autoReset: renderer.info.autoReset, unsafeOpaque, lights, passes: composer.current.passes.map(passInfo), input: { width: composer.current.inputBuffer.width, height: composer.current.inputBuffer.height, samples: composer.current.inputBuffer.samples }, output: { width: composer.current.outputBuffer.width, height: composer.current.outputBuffer.height, samples: composer.current.outputBuffer.samples }, scene: scene.uuid, camera: camera.uuid, timerAvailable: !!gl.getExtension("EXT_disjoint_timer_query_webgl2"), canvases: [...document.querySelectorAll("canvas")].map(canvas => ({ width: canvas.width, height: canvas.height })) };
  });
  assert.doesNotMatch(report.inventory.gpu, /swiftshader|llvmpipe|software/i);
  console.log(JSON.stringify({ label, inventory: report.inventory }, null, 2));

  // Diagnostic wrappers live only in this isolated browser. They forward all
  // calls unchanged. GPU scopes are non-nested: top-level composer passes and
  // renders outside the composer (planar reflection/blur). No gl.finish/readback.
  await page.evaluate(({ meshQueries }) => {
    const { gl: renderer, composer } = window.__shop;
    const gl = renderer.getContext();
    const ext = gl.getExtension("EXT_disjoint_timer_query_webgl2");
    const state = window.__steadyProfile = { recording: false, phase: "", renders: [], passes: [], frames: [], gpu: [], objects: {}, disjoint: 0, skipped: 0, pending: [], originals: [], sequence: 0, frame: 0 };
    let activePass = null, activeEffect = null, depth = 0, lastFrame = 0;
    const remember = (object, key, replacement) => { const original = object[key]; state.originals.push(() => { object[key] = original; }); object[key] = replacement(original); };
    const queryStart = label => {
      if (!ext || !state.recording) return null;
      if (state.pending.length >= 4096) { state.skipped++; return null; }
      const query = gl.createQuery();
      gl.beginQuery(ext.TIME_ELAPSED_EXT, query);
      return { query, label, phase: state.phase, frame: state.frame };
    };
    const queryEnd = entry => { if (entry) { gl.endQuery(ext.TIME_ELAPSED_EXT); state.pending.push(entry); } };
    const poll = () => {
      if (!ext || !state.pending.length) return;
      const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
      if (disjoint) state.disjoint++;
      state.pending = state.pending.filter(entry => {
        const ready = gl.getQueryParameter(entry.query, gl.QUERY_RESULT_AVAILABLE);
        if (!ready && !disjoint) return true;
        if (!disjoint) state.gpu.push({ label: entry.label, phase: entry.phase, frame: entry.frame, ms: gl.getQueryParameter(entry.query, gl.QUERY_RESULT) / 1e6 });
        gl.deleteQuery(entry.query);
        return false;
      });
    };
    const tick = now => {
      state.frame++;
      if (state.recording && lastFrame) state.frames.push({ phase: state.phase, frame: state.frame, ms: now - lastFrame });
      lastFrame = now;
      poll();
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
    for (const [index, pass] of composer.current.passes.entries()) {
      const label = `${index}:${pass.name || pass.constructor.name}${pass.effects ? ':' + pass.effects.map(effect => effect.name).join('+') : ''}`;
      remember(pass, "render", original => function (...args) {
        const previous = activePass;
        activePass = label;
        const entry = !previous && !meshQueries ? queryStart(label) : null;
        const start = performance.now();
        try { return original.apply(this, args); }
        finally { queryEnd(entry); if (state.recording) state.passes.push({ label, phase: state.phase, frame: state.frame, ms: performance.now() - start }); activePass = previous; }
      });
      for (const effect of pass.effects || []) {
        remember(effect, "update", original => function (...args) {
          const previous = activeEffect;
          activeEffect = effect.name;
          try { return original.apply(this, args); } finally { activeEffect = previous; }
        });
      }
    }
    remember(renderer, "render", original => function (scene, camera) {
      if (!state.recording || depth) return original.call(this, scene, camera);
      depth++;
      const target = renderer.getRenderTarget();
      const name = scene.name || scene.children?.[0]?.material?.name || scene.children?.[0]?.material?.type || scene.type;
      const label = `${activePass || "outside-composer"}/${activeEffect || name}`;
      const entry = !activePass && !meshQueries ? queryStart(label) : null;
      const before = { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
      const start = performance.now();
      try { return original.call(this, scene, camera); }
      finally {
        queryEnd(entry);
        state.renders.push({ label, phase: state.phase, frame: state.frame, ms: performance.now() - start, calls: renderer.info.render.calls - before.calls, triangles: renderer.info.render.triangles - before.triangles, target: target ? [target.width, target.height, target.samples] : null, camera: camera.uuid });
        depth--;
      }
    });
    if (meshQueries) remember(renderer, "renderBufferDirect", original => function (camera, scene, geometry, material, object, group) {
      if (!state.recording || activePass !== "0:RenderPass") return original.apply(this, arguments);
      const label = `${object.uuid}/${material.uuid}`;
      if (!state.objects[label]) {
        const ancestors = []; let parent = object;
        while (parent) { if (parent.name) ancestors.unshift(parent.name); parent = parent.parent; }
        state.objects[label] = { ancestors, name: object.name, type: object.type, material: { type: material.type, name: material.name, color: material.color?.getHexString(), transparent: material.transparent, opacity: material.opacity, side: material.side, depthTest: material.depthTest, depthWrite: material.depthWrite }, vertices: geometry.attributes.position?.count, indices: geometry.index?.count, instances: object.count, world: object.matrixWorld.elements.slice(12, 15) };
      }
      const query = queryStart(label);
      try { return original.apply(this, arguments); } finally { queryEnd(query); }
    });
    state.stop = async () => {
      state.recording = false;
      for (let i = 0; i < 100 && state.pending.length; i++) { await new Promise(resolve => setTimeout(resolve, 20)); poll(); }
      cancelAnimationFrame(state.raf);
      for (const restore of state.originals.reverse()) restore();
      for (const entry of state.pending) gl.deleteQuery(entry.query);
      return { renders: state.renders, passes: state.passes, frames: state.frames, gpu: state.gpu, objects: state.objects, disjoint: state.disjoint, skipped: state.skipped, unresolved: state.pending.length, glError: gl.getError() };
    };
  }, { meshQueries: process.env.QA_QUERY_SCOPE === "mesh" });

  const cdp = await page.createCDPSession();
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.setSamplingInterval", { interval: 1000 });
  await cdp.send("Profiler.start");
  for (const station of [0, 2, 5]) {
    await page.evaluate(station => {
      const runway = document.getElementById("walkthrough-runway").getBoundingClientRect();
      const y = scrollY + runway.top + ((station * 2.4 + 0.7) / 15.8) * (runway.height - innerHeight);
      window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
      scrollTo(0, y);
    }, station);
    await page.waitForFunction(station => Math.abs(window.__shop.camera.userData.rail.t * 6 - (station + 0.175)) < 0.04, { timeout: 15_000 }, station);
    await wait(3000);
    await page.evaluate(station => { window.__steadyProfile.phase = `idle-${station}`; window.__steadyProfile.recording = true; }, station);
    await wait(6000);
    const state = await page.evaluate(() => {
      window.__steadyProfile.recording = false;
      const { gl, composer, camera } = window.__shop;
      return { cameraStation: camera.userData.rail.t * 6, textures: gl.info.memory.textures, geometries: gl.info.memory.geometries, activePasses: composer.current.passes.map(pass => ({ name: pass.name, enabled: pass.enabled, intensity: pass.configuration?.intensity })) };
    });
    report.stations.push({ station, ...state });
    console.log(JSON.stringify({ label, station, ...state }));
  }
  const { profile } = await cdp.send("Profiler.stop");
  await fs.writeFile(path.join(output, "steady.cpuprofile"), JSON.stringify(profile));
  await cdp.detach();
  report.measurements = await page.evaluate(() => window.__steadyProfile.stop());
  assert.equal(report.measurements.glError, 0, "Profiling must not create WebGL errors");
  assert.deepEqual(report.errors, []);
  report.status = "PASS";
} catch (error) {
  report.status = "FAIL";
  report.failure = String(error.stack || error);
  console.error(report.failure);
} finally {
  report.finishedAt = new Date().toISOString();
  await fs.writeFile(path.join(output, "results.json"), JSON.stringify(report, null, 2));
  await context.close();
  await browser.close();
}
console.log(JSON.stringify({ label, status: report.status, output, failure: report.failure }));
if (report.status !== "PASS") process.exitCode = 1;
