import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer, { PredefinedNetworkConditions } from "puppeteer-core";
import { createHash } from "node:crypto";
import { brotliCompressSync, brotliDecompressSync } from "node:zlib";
import { decodeModelPacket } from "../components/shop/modelPackets.ts";
import { readModelCatalog } from "./build-model-packets.mjs";

const base = process.env.BASE_URL || "http://127.0.0.1:3197";
const label = process.env.QA_LABEL || "baseline";
const out = path.resolve(`output/playwright/garage-performance-2026-09-06/${label}`);
await fs.mkdir(out, { recursive: true });
const profile = process.env.QA_PROFILE === "phone-390"
  ? { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
  : { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false };
const deviceLabel = profile.isMobile ? "phone-390" : "desktop";
const result = { label, startedAt: new Date().toISOString(), base, profile, status: "RUNNING", stations: [], errors: [], warnings: [], consoleLog: [], modelResponses: [] };
const packetManifest = JSON.parse(await fs.readFile("components/shop/modelPackets.generated.json", "utf8"));
const packetFailure = process.env.QA_PACKET_FAILURE || "";
assert.ok(["", "404", "corrupt"].includes(packetFailure));
result.packetFailure = packetFailure;
result.packetResponses = [];
result.expectedPacketErrors = [];
const isPacket = url => new URL(url).pathname.includes("/model-packets/");
const officeFiles = ["car-d100-truck.jpg", "car-green-coupe.jpg", "car-black-muscle.jpg", "car-blue-pickup.jpg", "car-red-pickup.jpg", "car-black-classic.jpg", "badge-2240-sign.png"];
const officeUrl = url => officeFiles.includes(new URL(url).pathname.split("/").at(-1));
const officeDelay = Number(process.env.QA_PHOTO_DELAY_MS || 0);
result.officePhotoDelayMs = officeDelay;
const network = process.env.QA_NETWORK === "fast-4g" ? PredefinedNetworkConditions["Fast 4G"] : null;
result.networkConditions = network;
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: false,
  protocolTimeout: 180_000,
  args: ["--window-position=-2400,0", "--window-size=1600,1100", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--mute-audio", "--no-first-run"],
});
const context = await browser.createBrowserContext();
const page = await context.newPage();
await page.setViewport(profile);
await page.setCacheEnabled(false);
// The application's streamed FileLoader bodies are not reliably retained by
// DevTools. Tee exact fetch responses in this private test only, identically
// for old/new runs; defer hashing and Node transfer until timing has ended.
await page.evaluateOnNewDocument(() => {
  const original = window.fetch;
  window.__modelByteCapture = [];
  window.fetch = async function (...args) {
    const response = await original.apply(this, args);
    if (/\.(?:glb(?:\.br)?|bin\.br)$/.test(new URL(response.url).pathname)) {
      const bytes = response.clone().arrayBuffer();
      void bytes.catch(() => {});
      window.__modelByteCapture.push({ url: response.url, status: response.status, bytes });
    }
    return response;
  };
});
if (network) await page.emulateNetworkConditions(network);
if (officeDelay > 0 || packetFailure) {
  // Optional, identical added latency for every office photo in both builds.
  // The actual unmodified image bytes still come from the normal local host.
  await page.setRequestInterception(true);
  page.on("request", async request => {
    if (packetFailure && isPacket(request.url())) {
      if (packetFailure === "404") await request.respond({ status: 404, body: "deliberate private QA failure" });
      else {
        const file = new URL(request.url()).pathname.split("/").at(-1);
        assert.match(file, /^[a-f0-9]{64}\.bin\.br$/);
        const decoded = brotliDecompressSync(await fs.readFile(`public/model-packets/${file}`));
        decoded[24] ^= 1;
        await request.respond({ status: 200, headers: { "content-type": "application/octet-stream", "content-encoding": "br" }, body: brotliCompressSync(decoded) });
      }
      return;
    }
    const proceed = () => {
      if (!request.isInterceptResolutionHandled()) void request.continue().catch(() => {});
    };
    if (officeUrl(request.url())) setTimeout(proceed, officeDelay);
    else proceed();
  });
}
page.on("pageerror", (error) => result.errors.push(`page: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") {
    if (packetFailure === "404" && message.location().url && isPacket(message.location().url) && /404/.test(message.text())) result.expectedPacketErrors.push(message.text());
    else result.errors.push(message.text());
  }
  if (message.type() === "warn") result.warnings.push(message.text());
  if (/\[shop\]/.test(message.text())) result.consoleLog.push({ receivedAt: new Date().toISOString(), text: message.text() });
});
page.on("response", (response) => {
  if (response.status() >= 400) {
    if (packetFailure === "404" && isPacket(response.url()) && response.status() === 404) result.expectedPacketErrors.push(`${response.status()} ${response.url()}`);
    else result.errors.push(`${response.status()} ${response.url()}`);
  }
  if (/\.glb(?:\.br)?$/.test(new URL(response.url()).pathname)) result.modelResponses.push({ url: response.url(), status: response.status(), compressedBytes: Number(response.headers()["content-length"] || 0) });
  if (isPacket(response.url())) result.packetResponses.push({ url: response.url(), status: response.status(), compressedBytes: Number(response.headers()["content-length"] || 0) });
});
await page.evaluateOnNewDocument(() => {
  performance.setResourceTimingBufferSize(2000);
  const qa = window.__garageQA = { stages: [], longTasks: [], frames: [], phase: "hero", cls: 0 };
  new PerformanceObserver((list) => { for (const entry of list.getEntries()) qa.longTasks.push({ startTime: entry.startTime, duration: entry.duration, name: entry.name, phase: qa.phase, attribution: entry.attribution.map((a) => ({ name: a.name, containerType: a.containerType })) }); }).observe({ type: "longtask", buffered: true });
  new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) qa.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
  let last = 0;
  const frame = (now) => {
    if (last) qa.frames.push({ at: now, duration: now - last, phase: qa.phase });
    last = now;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  addEventListener("DOMContentLoaded", () => {
    const scan = () => {
      const stage = document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage");
      if (stage && qa.stages.at(-1)?.stage !== stage) qa.stages.push({ stage, at: performance.now() });
    };
    scan();
    new MutationObserver(scan).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["data-shop-stage"] });
  }, { once: true });
});

const save = async () => fs.writeFile(path.join(out, "results.json"), `${JSON.stringify(result, null, 2)}\n`);
const summary = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const percentile = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] || 0;
  return { count: values.length, totalMs: values.reduce((a, b) => a + b, 0), medianMs: percentile(0.5), p95Ms: percentile(0.95), p99Ms: percentile(0.99), maxMs: sorted.at(-1) || 0, over33ms: values.filter((n) => n > 33.5).length, over50ms: values.filter((n) => n > 50).length };
};
const scrollToProgress = async (progress, duration, phase) => page.evaluate(({ progress, duration, phase }) => new Promise((resolve) => {
  window.__garageQA.phase = phase;
  const rect = document.getElementById("walkthrough-runway").getBoundingClientRect();
  const from = scrollY;
  const to = scrollY + rect.top + progress * (rect.height - innerHeight);
  const started = performance.now();
  let frames = 0;
  const tick = (now) => {
    const ratio = Math.min(1, (now - started) / duration);
    const y = from + (to - from) * ratio;
    window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
    window.scrollTo(0, y);
    frames++;
    if (ratio < 1) requestAnimationFrame(tick);
    else resolve({ elapsed: performance.now() - started, frames, at: performance.now(), stage: document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage") });
  };
  requestAnimationFrame(tick);
}), { progress, duration, phase });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (process.env.QA_GL_PROFILE === "1") await page.evaluateOnNewDocument(() => {
  const programs = new WeakMap(), shaders = new WeakMap(), contexts = new WeakMap();
  const events = window.__glStartup = [];
  let contextId = 0, programId = 0;
  const proto = WebGL2RenderingContext.prototype;
  const context = (gl) => {
    if (!contexts.has(gl)) contexts.set(gl, ++contextId);
    return contexts.get(gl);
  };
  const wrap = (name, fn) => {
    const original = proto[name];
    proto[name] = function (...args) { return fn.call(this, original, args); };
  };
  wrap("shaderSource", function (original, args) {
    shaders.set(args[0], args[1]);
    return original.apply(this, args);
  });
  wrap("attachShader", function (original, args) {
    if (!programs.has(args[0])) {
      const entry = { id: ++programId, context: context(this), sources: [], queriesMs: 0 };
      programs.set(args[0], entry); events.push(entry);
    }
    programs.get(args[0]).sources.push(shaders.get(args[1]));
    return original.apply(this, args);
  });
  wrap("linkProgram", function (original, args) {
    const entry = programs.get(args[0]);
    if (entry) entry.linkAt = performance.now();
    return original.apply(this, args);
  });
  for (const name of ["getProgramParameter", "getActiveUniform", "getUniformLocation"]) wrap(name, function (original, args) {
    const start = performance.now();
    const value = original.apply(this, args);
    const elapsed = performance.now() - start;
    if (name !== "getProgramParameter" || args[1] === this.ACTIVE_UNIFORMS) {
      const entry = programs.get(args[0]);
      if (entry) {
        entry.firstQueryAt ??= start; entry.queriesMs += elapsed;
        if (elapsed > 50 && window.__shop?.gl?.getContext() === this) {
          entry.objects = [];
          window.__shop.scene.traverse(object => {
            for (const material of [object.material].flat().filter(Boolean)) {
              if (window.__shop.gl.properties.get(material).currentProgram?.program !== args[0]) continue;
              const ancestry = []; let current = object;
              while (current) { ancestry.push(`${current.type}:${current.name}`); current = current.parent; }
              entry.objects.push({ ancestry, material: material.uuid, map: material.map?.name, fog: material.fog, geometry: object.geometry?.type });
            }
          });
        }
      }
    }
    return value;
  });
});

try {
  result.browserVersion = await browser.version();
  const browserCDP = await browser.target().createCDPSession();
  result.systemGpu = (await browserCDP.send("SystemInfo.getInfo")).gpu;
  await browserCDP.detach();
  let startupProfiler = null;
  if (process.env.QA_CPU_PROFILE === "1") {
    startupProfiler = await page.createCDPSession();
    await startupProfiler.send("Profiler.enable");
    await startupProfiler.send("Profiler.setSamplingInterval", { interval: 1000 });
    await startupProfiler.send("Profiler.start");
  }
  await page.goto(`${base}/?perf=1`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  result.release = await page.$eval('meta[name="2240-release"]', (node) => node.content);
  await page.waitForFunction(() => {
    const loader = document.querySelector("[data-preloader]");
    return !loader || getComputedStyle(loader).visibility === "hidden" || getComputedStyle(loader).opacity === "0";
  }, { timeout: 12_000 });
  await page.waitForFunction(() => document.querySelectorAll("[data-hero-runtime] canvas").length === 1, { timeout: 20_000 });
  result.heroReadyAt = await page.evaluate(() => performance.now());
  await page.screenshot({ path: path.join(out, `${deviceLabel}-hero.png`), captureBeyondViewport: false });
  result.arrival = await scrollToProgress(0.04, 6000, "entry-scroll");
  console.log(`${label}: arrival ${JSON.stringify(result.arrival)}`);
  await page.evaluate(() => { window.__garageQA.phase = "waiting-world"; });
  await page.waitForFunction(() => document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage") === "world", { timeout: 90_000 });
  await page.waitForFunction(() => {
    const world = document.querySelector("[data-shop-world]");
    return !!window.__shop?.scene && world && Number.parseFloat(getComputedStyle(world).opacity) > 0.98;
  }, { timeout: 20_000 });
  result.worldVisibleAt = await page.evaluate(() => performance.now());
  result.officeTextures = await page.evaluate(files => {
    const textures = new Map();
    window.__shop.scene.traverse(object => {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        const texture = material?.map;
        const image = texture?.image;
        if (!image?.src || !files.includes(new URL(image.src).pathname.split("/").at(-1))) continue;
        textures.set(texture.uuid, { path: new URL(image.src).pathname, width: image.naturalWidth, height: image.naturalHeight, anisotropy: texture.anisotropy, colorSpace: texture.colorSpace, minFilter: texture.minFilter, magFilter: texture.magFilter, generateMipmaps: texture.generateMipmaps });
      }
    });
    return [...textures.values()].sort((a, b) => a.path.localeCompare(b.path));
  }, officeFiles);
  result.officeResources = (await page.evaluate(() => performance.getEntriesByType("resource").map(r => ({ name: r.name, startTime: r.startTime, responseStart: r.responseStart, responseEnd: r.responseEnd, duration: r.duration, encodedBodySize: r.encodedBodySize })))).filter(r => officeUrl(r.name));
  assert.equal(result.officeTextures.length, 7, "All seven original office photos/sign textures must be present");
  for (const file of officeFiles) {
    assert.equal(result.officeResources.filter(r => new URL(r.name).pathname.endsWith(`/${file}`)).length, 1, `No duplicate office image request: ${file}`);
  }
  if (process.env.QA_PHOTO_EXPECT_EARLY === "1") {
    const created = result.consoleLog.map(log => log.text).find(line => /renderer created/.test(line));
    const rendererAt = Number(created?.match(/@(\d+)/)?.[1]);
    assert.ok(Number.isFinite(rendererAt), "Read the actual renderer creation time");
    assert.ok(result.officeResources.every(r => r.startTime <= rendererAt + 250), "Office requests must start with this renderer, not late at station five");
  }
  if (process.env.QA_GL_PROFILE === "1") {
    const programs = await page.evaluate(() => window.__glStartup);
    await fs.writeFile(path.join(out, "startup-programs.json"), JSON.stringify(programs, null, 2));
    console.log(JSON.stringify(programs.filter(p => p.queriesMs > 10).map(({ sources, ...p }) => ({ ...p, defines: sources.map(s => s?.match(/^#define .*/gm)?.slice(0, 35)) })), null, 2));
  }
  if (startupProfiler) {
    const { profile: cpuProfile } = await startupProfiler.send("Profiler.stop");
    await fs.writeFile(path.join(out, "startup.cpuprofile"), JSON.stringify(cpuProfile));
    const nodes = new Map(cpuProfile.nodes.map(node => [node.id, node]));
    const time = new Map();
    cpuProfile.samples.forEach((id, i) => time.set(id, (time.get(id) || 0) + cpuProfile.timeDeltas[i]));
    result.startupCpu = [...time].map(([id, microseconds]) => ({ ...nodes.get(id).callFrame, milliseconds: microseconds / 1000 })).sort((a, b) => b.milliseconds - a.milliseconds).slice(0, 35);
    console.log(JSON.stringify({ startupCpu: result.startupCpu }, null, 2));
    await startupProfiler.detach();
  }
  result.gpu = await page.evaluate(() => {
    const renderer = window.__shop.gl;
    const gl = renderer.getContext();
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    return { vendor: gl.getParameter(gl.VENDOR), renderer: gl.getParameter(gl.RENDERER), unmaskedVendor: info && gl.getParameter(info.UNMASKED_VENDOR_WEBGL), unmaskedRenderer: info && gl.getParameter(info.UNMASKED_RENDERER_WEBGL), version: gl.getParameter(gl.VERSION), pixelRatio: renderer.getPixelRatio(), antialias: gl.getContextAttributes().antialias };
  });
  assert.doesNotMatch(result.gpu.unmaskedRenderer || result.gpu.renderer, /swiftshader|llvmpipe|software/i, "Measurement requires hardware GPU");
  console.log(`${label}: world ${result.worldVisibleAt.toFixed(0)}ms, GPU ${result.gpu.unmaskedRenderer}`);
  for (let station = 0; station < (process.env.QA_STARTUP_ONLY === "1" ? 0 : 7); station++) {
    const progress = (station * 2.4 + 0.7) / 15.8;
    const travel = await scrollToProgress(progress, station === 0 ? 500 : 2000, `tour-${station}`);
    await page.waitForFunction((station) => {
      const position = Number(window.__shop?.camera.userData?.rail?.t) * 6;
      return Number.isFinite(position) && Math.abs(position - (station + 0.175)) < 0.14;
    }, { timeout: 15_000 }, station);
    await page.evaluate((station) => { window.__garageQA.phase = `idle-${station}`; }, station);
    await delay(1500);
    const state = await page.evaluate((station) => {
      const { scene, camera, gl } = window.__shop;
      let renderables = 0, visible = 0;
      scene.traverse((object) => {
        if (object.name !== `bay-${station}`) return;
        object.traverse((child) => {
          if (!(child.isMesh || child.isPoints || child.isLine)) return;
          renderables++;
          let current = child;
          let shown = true;
          while (current) { if (!current.visible) shown = false; current = current.parent; }
          if (shown) visible++;
        });
      });
      return { station, at: performance.now(), actualStation: Number(camera.userData.rail.t) * 6, position: camera.position.toArray(), renderables, visible, stage: document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage"), contexts: document.querySelectorAll("[data-shop-world] canvas").length, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures, calls: gl.info.render.calls, triangles: gl.info.render.triangles, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, scrollX };
    }, station);
    result.stations.push({ ...state, travel });
    assert.ok(state.visible > 0, `No visible models in bay ${station}`);
    assert.equal(state.contexts, 1);
    assert.ok(state.scrollWidth <= state.viewport && state.bodyWidth <= state.viewport, "No horizontal overflow");
    assert.equal(state.scrollX, 0);
    await page.evaluate(() => { window.__garageQA.phase = "screenshot"; });
    await page.screenshot({ path: path.join(out, `${deviceLabel}-station-${station}.png`), captureBeyondViewport: false });
    console.log(`${label}: station ${station}, ${state.visible} visible models, rail ${state.actualStation.toFixed(3)}`);
  }
  result.measurementFinishedAt = await page.evaluate(() => performance.now());
  if (process.env.QA_RAIL === "1") {
    result.railButtons = await page.$$eval('nav[aria-label="Shop tour stations"] button', (buttons) => buttons.map((button) => ({ label: button.getAttribute("aria-label"), text: button.textContent.trim(), rect: { width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height } })));
    assert.equal(result.railButtons.length, 7, "All seven station controls exist");
    result.railClicks = [];
    for (let station = 0; station < result.railButtons.length; station++) {
      const label = result.railButtons[station].label;
      await page.evaluate((station) => { window.__garageQA.phase = `rail-click-${station}`; }, station);
      await page.click(`nav[aria-label="Shop tour stations"] button[aria-label="${label}"]`);
      await page.waitForFunction(({ station, label }) => {
        const position = Number(window.__shop?.camera.userData?.rail?.t) * 6;
        const button = [...document.querySelectorAll('nav[aria-label="Shop tour stations"] button')].find((node) => node.getAttribute("aria-label") === label);
        return Number.isFinite(position) && Math.abs(position - (station + 0.175)) < 0.08 && button?.getAttribute("data-active") === "true";
      }, { timeout: 20_000 }, { station, label });
      const state = await page.evaluate(() => ({ cameraStation: Number(window.__shop.camera.userData.rail.t) * 6, activeLabels: [...document.querySelectorAll('nav[aria-label="Shop tour stations"] button[data-active="true"]')].map((b) => b.getAttribute("aria-label")), stage: document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage"), scrollY }));
      assert.deepEqual(state.activeLabels, [label]);
      assert.equal(state.stage, "world");
      result.railClicks.push({ station, label, ...state });
      console.log(`${result.label}: clicked ${label}, camera ${state.cameraStation.toFixed(3)}`);
    }
    await page.screenshot({ path: path.join(out, "desktop-rail-last-station.png"), captureBeyondViewport: false });
  }
  assert.deepEqual(result.errors, []);
  // Verify bytes after the timing window so Node-side response inspection
  // cannot improve or slow the measured startup. Packet count never stands
  // in for model coverage: every one of the 71 original GLBs is required.
  const covered = new Set(), hero = new Set();
  const tier = profile.isMobile ? "lite" : "full";
  const shelf = profile.isMobile ? "models-mobile" : "models-opt";
  const hash = bytes => createHash("sha256").update(bytes).digest("hex");
  result.verifiedModels = [];
  const captures = await page.evaluate(() => window.__modelByteCapture.map(({ url, status }) => ({ url, status })));
  for (const [index, capture] of captures.entries()) {
    const response = { url: () => capture.url, status: () => capture.status, buffer: async () => {
      const encoded = await page.evaluate(async index => {
        const bytes = new Uint8Array(await window.__modelByteCapture[index].bytes);
        let binary = "";
        for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
        return btoa(binary);
      }, index);
      return Buffer.from(encoded, "base64");
    } };
    const pathname = new URL(response.url()).pathname;
    if (response.status() !== 200 || (packetFailure && isPacket(response.url()))) continue;
    if (isPacket(response.url())) {
      const descriptor = packetManifest.shelves[tier].find(item => pathname.endsWith(`/${item.file}`));
      assert.ok(descriptor, `Packet belongs to the unchanged ${tier} shelf`);
      const body = await response.buffer();
      const models = await decodeModelPacket(body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength), descriptor);
      for (const [name, bytes] of models) {
        const expected = await fs.readFile(`public/${shelf}/${name}`);
        assert.equal(hash(Buffer.from(bytes)), hash(expected), `Exact packet model ${name}`);
        covered.add(name); result.verifiedModels.push({ name, sha256: hash(expected), via: "packet" });
      }
    } else if (/\/models-(opt|mobile)-[^/]+\//.test(pathname)) {
      assert.ok(pathname.includes(`/${shelf}-`), `No model shelf quality substitution: ${pathname}`);
      const name = pathname.split("/").at(-1).replace(/\.br$/, "");
      const body = await response.buffer(), expected = await fs.readFile(`public/${shelf}/${name}`);
      assert.equal(hash(body), hash(expected), `Exact individual model ${name}`);
      covered.add(name); result.verifiedModels.push({ name, sha256: hash(expected), via: "individual" });
    } else if (pathname.includes("/models/hero-")) hero.add(pathname.split("/").at(-1).replace(/\.br$/, ""));
  }
  assert.deepEqual([...covered].sort(), (await readModelCatalog()).names.sort(), "All 71 exact garage resources arrived");
  assert.equal(hero.size, 3, "All three original hero resources arrived");
  result.modelCoverage = { garage: covered.size, hero: hero.size, individualRequests: result.modelResponses.length, packetRequests: result.packetResponses.length };
  result.status = "PASS";
} catch (error) {
  result.status = "FAIL";
  result.failure = String(error.stack || error);
  await page.screenshot({ path: path.join(out, "failure.png"), captureBeyondViewport: false }).catch(() => {});
  console.error(result.failure);
} finally {
  result.metrics = await page.evaluate(() => ({ ...window.__garageQA, fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime, resources: performance.getEntriesByType("resource").map((r) => ({ name: r.name, initiatorType: r.initiatorType, startTime: r.startTime, responseStart: r.responseStart, responseEnd: r.responseEnd, duration: r.duration, transferSize: r.transferSize, encodedBodySize: r.encodedBodySize, decodedBodySize: r.decodedBodySize })) })).catch(() => null);
  if (result.metrics) {
    if (result.measurementFinishedAt) {
      result.metrics.frames = result.metrics.frames.filter(frame => frame.at <= result.measurementFinishedAt);
      result.metrics.longTasks = result.metrics.longTasks.filter(task => task.startTime <= result.measurementFinishedAt);
    }
    result.frameSummary = Object.fromEntries([...new Set(result.metrics.frames.map((f) => f.phase))].map((phase) => [phase, summary(result.metrics.frames.filter((f) => f.phase === phase).map((f) => f.duration))]));
    result.longTaskSummary = summary(result.metrics.longTasks.map((t) => t.duration));
    result.startupLongTaskSummary = summary(result.metrics.longTasks.filter((t) => t.startTime < result.worldVisibleAt).map((t) => t.duration));
    result.modelResourceSummary = summary(result.metrics.resources.filter((r) => /\.glb(?:\.br)?$/.test(new URL(r.name).pathname)).map((r) => r.duration));
  }
  result.finishedAt = new Date().toISOString();
  await save();
  await context.close();
  await browser.close();
}
console.log(JSON.stringify({ label, status: result.status, release: result.release, arrival: result.arrival, worldVisibleAt: result.worldVisibleAt, gpu: result.gpu, stages: result.metrics?.stages, longTaskSummary: result.longTaskSummary, frameSummary: result.frameSummary, failure: result.failure }, null, 2));
if (result.status !== "PASS") process.exitCode = 1;
