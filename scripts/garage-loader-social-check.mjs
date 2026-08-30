import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "http://127.0.0.1:3117").replace(/\/+$/, "");
const OUT = path.resolve(
  process.env.RELEASE_SHOT_DIR || "output/playwright/garage-loader-social-local/release",
);

const FOCUS = (process.env.RELEASE_FOCUS || "").trim().toLowerCase();
const sizes = [
  { name: "desktop", width: 1440, height: 900, dsf: 1, garage: true },
  { name: "iphone-se", width: 320, height: 568, dsf: 2 },
  { name: "iphone-375", width: 375, height: 667, dsf: 2 },
  { name: "iphone-390", width: 390, height: 844, dsf: 3, garage: true },
  { name: "iphone-430", width: 430, height: 932, dsf: 3 },
  { name: "ipad-768", width: 768, height: 1024, dsf: 2 },
].filter((size) => !FOCUS || size.name.toLowerCase() === FOCUS);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function pass(scope, message, detail) {
  console.log(`PASS ${scope} · ${message} — ${detail}`);
}

async function scrollTo(page, selector, progress = 0) {
  const found = await page.evaluate(
    ({ selector, progress }) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const y =
        rect.top +
        window.scrollY +
        progress * Math.max(1, rect.height - window.innerHeight);
      window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
      return true;
    },
    { selector, progress },
  );
  assert.ok(found, `${selector} was not found`);
}

async function continuouslyScrollTo(page, selector, progress, duration) {
  const result = await page.evaluate(
    ({ selector, progress, duration }) =>
      new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (!element) return resolve(null);
        const rect = element.getBoundingClientRect();
        const from = window.scrollY;
        const to =
          rect.top +
          window.scrollY +
          progress * Math.max(1, rect.height - window.innerHeight);
        const started = performance.now();
        let frames = 0;
        const tick = (now) => {
          const t = Math.min(1, (now - started) / duration);
          const eased = t * t * (3 - 2 * t);
          const y = from + (to - from) * eased;
          window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
          window.scrollTo(0, y);
          frames += 1;
          if (t < 1) requestAnimationFrame(tick);
          else {
            resolve({
              frames,
              elapsed: performance.now() - started,
              stage: document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage"),
              mounted: Boolean(document.querySelector("[data-shop-world]")),
              heroRuntime: document
                .querySelector("[data-hero-runtime]")
                ?.getAttribute("data-hero-runtime"),
              heroSceneReady: document
                .querySelector("[data-hero-scene-ready]")
                ?.getAttribute("data-hero-scene-ready"),
              stages: window.__releaseAudit?.shopStages || [],
              shopResources: performance
                .getEntriesByType("resource")
                .filter((entry) => /ShopWorld|models-(?:opt|mobile)/i.test(entry.name)).length,
            });
          }
        };
        requestAnimationFrame(tick);
      }),
    { selector, progress, duration },
  );
  assert.ok(result, `${selector} was not found`);
  return result;
}

async function auditSize(browser, size) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors = [];
  const staleGaragePhotos = [];

  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text() !== "Failed to load resource: the server responded with a status of 404 (Not Found)"
    ) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`);
  });
  page.on("request", (request) => {
    if (/shop-showroom-neon-/i.test(request.url())) staleGaragePhotos.push(request.url());
  });

  await page.evaluateOnNewDocument(() => {
    window.__releaseAudit = {
      loaderSeenAt: null,
      loaderGoneAt: null,
      shopStages: [],
    };
    const scan = () => {
      const audit = window.__releaseAudit;
      const loader = document.querySelector("[data-preloader]");
      const shop = document.querySelector("[data-shop-stage]");
      if (loader && audit.loaderSeenAt === null) audit.loaderSeenAt = performance.now();
      if (!loader && audit.loaderSeenAt !== null && audit.loaderGoneAt === null) {
        audit.loaderGoneAt = performance.now();
      }
      const stage = shop?.getAttribute("data-shop-stage");
      const latest = audit.shopStages.at(-1)?.stage;
      if (stage && stage !== latest) {
        audit.shopStages.push({ stage, at: performance.now() });
      }
    };
    window.addEventListener(
      "DOMContentLoaded",
      () => {
        scan();
        new MutationObserver(scan).observe(document.documentElement, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ["data-shop-stage"],
        });
      },
      { once: true },
    );
  });

  await page.setViewport({
    width: size.width,
    height: size.height,
    deviceScaleFactor: size.dsf,
    isMobile: size.name !== "desktop",
    hasTouch: size.name !== "desktop",
  });
  await page.goto(`${BASE}/?perf=1`, { waitUntil: "domcontentloaded", timeout: 120_000 });

  const loader = await page.$("[data-preloader]");
  assert.ok(loader, `${size.name}: branded preloader was never presented`);
  assert.ok(
    await page.$("[data-loader-instrument]"),
    `${size.name}: instrument loader is missing`,
  );
  const cssFailsafe = await page.$eval("[data-preloader]", (element) => {
    const style = getComputedStyle(element);
    const seconds = (value) => Number.parseFloat(value) * (value.endsWith("ms") ? 0.001 : 1);
    return {
      name: style.animationName,
      delay: seconds(style.animationDelay),
      duration: seconds(style.animationDuration),
      reason: element.getAttribute("data-ready-reason"),
    };
  });
  const visualBudget = size.name === "desktop" ? 2.2 : 4;
  if (cssFailsafe.name === "preloader-failsafe") {
    assert.ok(
      cssFailsafe.delay + cssFailsafe.duration <= visualBudget,
      `${size.name}: CSS failsafe covers for ${cssFailsafe.delay + cssFailsafe.duration}s`,
    );
  } else {
    assert.match(
      cssFailsafe.reason || "",
      /^(?:scene|progressive-ceiling)$/,
      `${size.name}: CSS failsafe disappeared without a verified handoff`,
    );
  }
  await page.screenshot({
    path: path.join(OUT, `${size.name}-loader.png`),
    captureBeyondViewport: false,
  });

  await page.waitForFunction(
    () => window.__releaseAudit?.loaderGoneAt !== null,
    { timeout: 5_000 },
  );
  const loaderTiming = await page.evaluate(() => ({ ...window.__releaseAudit }));
  assert.ok(loaderTiming.loaderSeenAt !== null, `${size.name}: loader timing was not recorded`);
  const hydratedDuration = loaderTiming.loaderGoneAt - loaderTiming.loaderSeenAt;
  /* DOM removal is housekeeping after the CSS plate is already invisible.
     A cold mobile renderer can delay that React commit while it initializes;
     the user-facing release budget is the independently asserted 2.2 s CSS
     envelope above. Keep a generous leak guard without conflating the two. */
  assert.ok(hydratedDuration <= 8_000, `${size.name}: loader DOM cleanup took ${hydratedDuration}ms`);
  pass(
    size.name,
    "instrument loader exits inside the release budget",
    `${visualBudget.toFixed(1)} s visual ceiling; DOM cleanup ${Math.round(hydratedDuration)} ms after first scan`,
  );

  const shopType = await page.evaluate(() => {
    const px = (selector) => {
      const node = document.querySelector(selector);
      return node ? Number.parseFloat(getComputedStyle(node).fontSize) : 0;
    };
    return {
      eyebrow: px(".wt-station-eyebrow"),
      body: px(".wt-station-body"),
      list: px(".wt-station-list"),
      glide: px(".wt-glide-body"),
    };
  });
  assert.ok(shopType.eyebrow >= 12, `${size.name}: shop eyebrow is ${shopType.eyebrow}px`);
  assert.ok(shopType.body >= 17, `${size.name}: shop body is ${shopType.body}px`);
  assert.ok(shopType.list >= 12, `${size.name}: shop list is ${shopType.list}px`);
  assert.ok(shopType.glide >= 16, `${size.name}: shop travel copy is ${shopType.glide}px`);
  pass(
    size.name,
    "garage copy meets the legibility floor",
    `eyebrow ${shopType.eyebrow}px; body ${shopType.body}px; list ${shopType.list}px; travel ${shopType.glide}px`,
  );

  if (size.garage) {
    const arrival = await continuouslyScrollTo(
      page,
      "#walkthrough-runway",
      0.18,
      size.name === "desktop" ? 6_000 : 9_000,
    );
    assert.ok(
      !arrival.mounted,
      `${size.name}: garage compiler started during continuous motion: ${JSON.stringify(arrival)}`,
    );
    pass(
      size.name,
      "continuous scrolling keeps the garage compiler parked",
      `${Math.round(arrival.elapsed)} ms / ${arrival.frames} frames; arrival stage ${arrival.stage}; ${arrival.shopResources} prefetched resource(s)`,
    );
    await page.waitForFunction(
      () => {
        const host = document.querySelector("[data-shop-stage]");
        return host?.getAttribute("data-shop-stage") === "world";
      },
      { timeout: 75_000 },
    );
    const worldVisible = await page
      .waitForFunction(
        () => {
          const world = document.querySelector("[data-shop-world]");
          return world && Number.parseFloat(getComputedStyle(world).opacity) > 0.98;
        },
        { polling: 100, timeout: 20_000 },
      )
      .then(() => true)
      .catch(() => false);
    if (!worldVisible) {
      const state = await page.evaluate(() => {
        const host = document.querySelector("[data-shop-stage]");
        const world = document.querySelector("[data-shop-world]");
        return {
          hostStage: host?.getAttribute("data-shop-stage"),
          hostOpacity: host ? getComputedStyle(host).opacity : null,
          worldClass: world?.className || null,
          worldOpacity: world ? getComputedStyle(world).opacity : null,
          canvas: Boolean(world?.querySelector("canvas")),
          runtime: Boolean(window.__shop?.scene && window.__shop?.camera),
          stages: window.__releaseAudit?.shopStages || [],
        };
      });
      throw new Error(`${size.name}: live world stayed hidden: ${JSON.stringify(state)}`);
    }
    await sleep(1_600);
    const shop = await page.evaluate(() => {
      const runtime = window.__shop;
      const scene = runtime?.scene;
      const camera = runtime?.camera;
      if (!scene || !camera) return null;
      const rail = Number(camera.userData?.rail?.t);
      const station = Number.isFinite(rail)
        ? Math.max(0, Math.min(6, Math.round(rail * 6)))
        : null;
      let renderables = 0;
      let visible = 0;
      scene.traverse((object) => {
        if (object.name !== `bay-${station}`) return;
        object.traverse((child) => {
          if (!(child.isMesh || child.isPoints || child.isLine)) return;
          renderables += 1;
          let shown = child.visible;
          let parent = child.parent;
          while (shown && parent) {
            shown = parent.visible;
            parent = parent.parent;
          }
          if (shown) visible += 1;
        });
      });
      return {
        station,
        renderables,
        visible,
        stage: document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage"),
        stages: window.__releaseAudit?.shopStages || [],
      };
    });
    assert.ok(shop, `${size.name}: shop runtime diagnostics are missing`);
    assert.equal(shop.stage, "world", `${size.name}: shop did not reach the live world`);
    assert.ok(shop.renderables > 0, `${size.name}: current garage bay has no models`);
    assert.ok(shop.visible > 0, `${size.name}: current garage bay models are hidden`);
    pass(
      size.name,
      "live 3D garage reaches a populated bay",
      `station ${shop.station}; ${shop.visible}/${shop.renderables} renderables visible; ${shop.stages.map((item) => item.stage).join(" → ")}`,
    );
    await page.screenshot({
      path: path.join(OUT, `${size.name}-garage.png`),
      captureBeyondViewport: false,
    });
  }

  await scrollTo(page, "#instagram-heading");
  await page.waitForFunction(
    () => [...document.querySelectorAll(".ig-card img")].every((image) => image.complete),
    { timeout: 20_000 },
  );
  await sleep(400);
  const gallery = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".ig-card")];
    const rects = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    const hrefs = cards.map((card) => card.href);
    return {
      count: cards.length,
      rects,
      hrefs,
      uniqueHrefs: new Set(hrefs).size,
      directLinks: hrefs.every((href) => /instagram\.com\/(?:p|reel)\/[^/]+\/$/.test(href)),
      overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });
  assert.equal(gallery.count, 10, `${size.name}: expected ten curated cards`);
  assert.equal(gallery.uniqueHrefs, 10, `${size.name}: repeated social link found`);
  assert.ok(gallery.directLinks, `${size.name}: profile-only Instagram link found`);
  assert.equal(gallery.overflow, 0, `${size.name}: horizontal overflow is ${gallery.overflow}px`);
  assert.ok(
    gallery.rects.every(({ width, height }) => Math.abs(width - height) < 0.75),
    `${size.name}: not every card is square`,
  );
  pass(
    size.name,
    "social wall is equal-crop, unique, direct-linked, and overflow-free",
    `10 cards; ${gallery.rects[0].width.toFixed(1)}px square; 10 source URLs`,
  );

  if (size.name === "desktop") {
    await page.hover(".ig-card");
    await sleep(550);
  }
  await page.screenshot({
    path: path.join(OUT, `${size.name}-shop-floor.png`),
    captureBeyondViewport: false,
  });

  assert.deepEqual(
    staleGaragePhotos,
    [],
    `${size.name}: old showroom photograph was requested:\n${staleGaragePhotos.join("\n")}`,
  );

  assert.deepEqual(errors, [], `${size.name}: browser errors:\n${errors.join("\n")}`);
  pass(size.name, "release probe emits no page or console errors", "0 errors");
  await context.close();
}

await fs.mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  /* The shop audit must run on the same hardware WebGL path a visitor uses.
     Chromium headless forces SwiftShader here, which is slow enough to turn a
     correct 1600 ms dissolve into a false timeout. */
  headless: false,
  protocolTimeout: 240_000,
  args: [
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--window-position=-2400,0",
    "--window-size=1600,1100",
    "--disable-features=CalculateNativeWinOcclusion",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-dev-shm-usage",
    "--no-sandbox",
  ],
});

try {
  for (const size of sizes) await auditSize(browser, size);
  console.log("\nGARAGE / LOADER / SOCIAL RELEASE PROBE GREEN");
} finally {
  await browser.close();
}
