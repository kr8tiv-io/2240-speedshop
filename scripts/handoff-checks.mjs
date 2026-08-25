/**
 * Focused visual continuity gate for the film → shop → film handoffs.
 *
 * The old choreography hid the hero a full viewport before the shop world
 * began to rise, producing a dead-black frame on phones and desktop. These
 * probes sit inside those former holes and require the graded shop room to be
 * materially present. Screenshots are retained for human composition review.
 */
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "http://localhost:3117").replace(/\/+$/, "");
const OUT = path.resolve(process.env.HANDOFF_SHOT_DIR || "shots-handoffs");
const MIN_SHOP_OPACITY = 0.25;
const MIN_LUMA = 12;
const MIN_LIT_COVERAGE = 0.2;
const FOCUS = (process.env.HANDOFF_FOCUS || "").trim().toLowerCase();

const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone390", width: 390, height: 844, dsf: 2, mobile: true },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const failures = [];

function check(scope, label, condition, measured) {
  try {
    assert.ok(condition, measured);
    console.log(`PASS ${scope} · ${label} — ${measured}`);
  } catch {
    const message = `${scope} · ${label} — ${measured}`;
    failures.push(message);
    console.error(`FAIL ${message}`);
  }
}

async function imageLight(buffer) {
  const { data, info } = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let lumaTotal = 0;
  let lit = 0;
  for (let index = 0; index < data.length; index += info.channels) {
    const luma = data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
    lumaTotal += luma;
    if (luma >= 12) lit += 1;
  }
  const pixels = info.width * info.height;
  return { mean: lumaTotal / pixels, coverage: lit / pixels };
}

async function auditSize(browser, size) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  await page.setViewport({
    width: size.width,
    height: size.height,
    deviceScaleFactor: size.dsf,
    isMobile: !!size.mobile,
    hasTouch: !!size.mobile,
  });
  await page.setCacheEnabled(false);
  await page.goto(`${BASE}/?tune=1`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page
    .waitForFunction(() => !document.querySelector("[data-preloader]"), { timeout: 20_000 })
    .catch(() => {});
  // The shop mounts and warms silently after 3.5 seconds.
  await sleep(5_000);

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { top: box.top + window.scrollY, height: box.height };
    };
    return {
      shop: rect("#walkthrough-runway"),
      finale: rect("[data-runway-c]"),
    };
  });
  if (!metrics.shop || !metrics.finale) {
    check(size.name, "handoff runways exist", false, JSON.stringify(metrics));
    await context.close();
    return;
  }

  const beats = [
    { name: "film-to-shop", y: metrics.shop.top - size.height * 0.7 },
    { name: "shop-to-film", y: metrics.finale.top - size.height * 0.3 },
  ];

  for (const beat of beats) {
    await page.evaluate((y) => {
      if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }, beat.y);
    await sleep(2_000);
    const layers = await page.evaluate(() => {
      const shop = document.querySelector(".wt-world-veil")?.parentElement;
      const film = document.querySelector("[data-film-canvas]");
      return {
        shopOpacity: shop ? Number(getComputedStyle(shop).opacity) : null,
        filmOpacity: film ? Number(getComputedStyle(film).opacity) : null,
      };
    });
    const screenshot = await page.screenshot({ type: "png", captureBeyondViewport: false });
    await fs.writeFile(path.join(OUT, `${size.name}-${beat.name}.png`), screenshot);
    const light = await imageLight(screenshot);
    check(
      `${size.name}/${beat.name}`,
      "graded shop room overlaps the former black gap",
      layers.shopOpacity !== null && layers.shopOpacity >= MIN_SHOP_OPACITY,
      `shop opacity=${layers.shopOpacity ?? "missing"}; film opacity=${layers.filmOpacity ?? "missing"}`,
    );
    check(
      `${size.name}/${beat.name}`,
      "frame retains visible light and texture",
      light.mean >= MIN_LUMA && light.coverage >= MIN_LIT_COVERAGE,
      `mean luma=${light.mean.toFixed(2)}; pixels >=12 luma=${(light.coverage * 100).toFixed(2)}%`,
    );
  }

  check(size.name, "handoffs emit no page or console errors", errors.length === 0, `${errors.length} error(s)`);
  await context.close();
}

await fs.mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 240_000,
  args: [
    "--window-position=-2400,0",
    "--window-size=1600,1100",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    "--mute-audio",
    "--no-first-run",
  ],
});

try {
  const sizes = FOCUS ? SIZES.filter((size) => size.name.toLowerCase() === FOCUS) : SIZES;
  for (const size of sizes) await auditSize(browser, size);
} finally {
  await browser.close().catch(() => {});
}

if (failures.length) {
  console.error(`\nHANDOFF AUDIT RED — ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nHANDOFF AUDIT GREEN — all measured continuity budgets passed");
}
