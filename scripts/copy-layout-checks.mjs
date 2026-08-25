import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "http://localhost:3117").replace(/\/+$/, "");
const OUT = path.resolve(process.env.COPY_SHOT_DIR || "shots-copy");
const FOCUS = (process.env.COPY_FOCUS || "").trim().toLowerCase();
const sizes = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 2, mobile: true },
].filter((size) => !FOCUS || size.name.toLowerCase() === FOCUS);

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

async function seek(page, selector, progress) {
  return page.evaluate(
    ({ selector, progress }) => {
      const runway = document.querySelector(selector);
      if (!runway) return false;
      const rect = runway.getBoundingClientRect();
      const y = rect.top + window.scrollY + progress * Math.max(1, rect.height - innerHeight);
      if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
      // Keep the native position and Lenis's internal position on the same
      // frame. This mirrors the production visual harness and prevents an
      // immediate Lenis call made during a paused tick from certifying the
      // previous beat.
      window.scrollTo(0, y);
      return true;
    },
    { selector, progress },
  );
}

async function capture(page, size, name) {
  await page.screenshot({
    path: path.join(OUT, `${size.name}-${name}.png`),
    captureBeyondViewport: false,
  });
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
  await page.goto(`${BASE}/?tune=1`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page
    .waitForFunction(() => !document.querySelector("[data-preloader]"), { timeout: 20_000 })
    .catch(() => {});
  await sleep(600);

  const grain = await page.evaluate(() => {
    const element = document.querySelector("body > .grain");
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      surfaceRatio: (rect.width * rect.height) / (innerWidth * innerHeight),
      opacity: style.opacity,
      blend: style.mixBlendMode,
      animation: style.animationName,
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
  const grainCoversViewport =
    !!grain && grain.left <= 0 && grain.top <= 0 && grain.right >= grain.viewport.width && grain.bottom >= grain.viewport.height;
  check(
    size.name,
    "film grain keeps its look within the compositor budget",
    grainCoversViewport &&
      grain.surfaceRatio <= 1.6 &&
      grain.opacity === "0.055" &&
      grain.blend === "overlay" &&
      grain.animation === "grain-shift",
    grain
      ? `${grain.surfaceRatio.toFixed(2)}× viewport; covers=${grainCoversViewport}; opacity=${grain.opacity}; blend=${grain.blend}; animation=${grain.animation}`
      : "global grain layer missing",
  );

  let actThreeReady = false;
  for (let attempt = 0; attempt < 3 && !actThreeReady; attempt += 1) {
    await seek(page, "[data-runway-c]", 0.7);
    actThreeReady = await page
      .waitForFunction(
        () =>
          window.__film?.stage?.act === 2 &&
          Number(getComputedStyle(document.querySelector("[data-chapter='3']")).opacity) >= 0.9,
        { polling: 50, timeout: 4_000 },
      )
      .then(() => true)
      .catch(() => false);
  }
  await sleep(400);
  const actThree = await page.evaluate(() => {
    const chapter = document.querySelector("[data-chapter='3']");
    const plate = chapter?.querySelector(".copy-plate");
    const heading = chapter?.querySelector("h2");
    const buttons = [...(chapter?.querySelectorAll("a") || [])];
    const box = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
    };
    return {
      act: window.__film?.stage?.act ?? null,
      chapterOpacity: chapter ? Number(getComputedStyle(chapter).opacity) : 0,
      plate: box(plate),
      heading: heading?.textContent?.replace(/\s+/g, " ").trim() || "",
      buttons: buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
  const plateFits =
    !!actThree.plate &&
    actThree.plate.top >= 68 &&
    actThree.plate.bottom <= actThree.viewport.height - 8 &&
    actThree.plate.left >= 0 &&
    actThree.plate.right <= actThree.viewport.width;
  check(
    size.name,
    "Act III selling plate fits beneath the nav",
    actThreeReady && actThree.act === 2 && actThree.chapterOpacity >= 0.9 && plateFits,
    `act=${actThree.act ?? "missing"}; opacity=${actThree.chapterOpacity.toFixed(2)}; heading=“${actThree.heading}”; plate=${JSON.stringify(actThree.plate)}; viewport=${actThree.viewport.width}×${actThree.viewport.height}`,
  );
  check(
    size.name,
    "Act III calls to action retain touch-safe height",
    actThree.buttons.length === 2 && actThree.buttons.every((button) => button.height >= 44),
    `${actThree.buttons.length} CTA(s): ${actThree.buttons.map((button) => `${button.width.toFixed(0)}×${button.height.toFixed(0)}`).join(", ")}`,
  );
  await capture(page, size, "act-three");

  await seek(page, "#walkthrough-runway", 0.03);
  await sleep(2_000);
  const doorway = await page.evaluate(() => {
    const heading = document.getElementById("wt-doorway-heading");
    if (!heading) return null;
    const rect = heading.getBoundingClientRect();
    return {
      text: heading.textContent?.replace(/\s+/g, " ").trim(),
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
  check(
    size.name,
    "shop doorway headline is readable in its shot",
    !!doorway && doorway.top >= 68 && doorway.bottom <= doorway.viewport.height && doorway.right <= doorway.viewport.width,
    doorway ? `“${doorway.text}” at ${doorway.top.toFixed(0)}→${doorway.bottom.toFixed(0)}px` : "heading missing",
  );
  await capture(page, size, "shop-doorway");

  for (const [name, selector] of [
    ["reviews", "#reviews-heading"],
    ["location", "#areas-heading"],
  ]) {
    const found = await page.evaluate((selector) => {
      const heading = document.querySelector(selector);
      if (!heading) return false;
      const y = heading.getBoundingClientRect().top + window.scrollY - 96;
      if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      return true;
    }, selector);
    await sleep(900);
    const layout = await page.evaluate((selector) => {
      const heading = document.querySelector(selector);
      if (!heading) return null;
      const rect = heading.getBoundingClientRect();
      return {
        text: heading.textContent?.replace(/\s+/g, " ").trim(),
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: innerWidth,
      };
    }, selector);
    check(
      size.name,
      `${name} headline fits the viewport`,
      found && !!layout && layout.left >= 0 && layout.right <= layout.width && layout.top >= 64,
      layout ? `“${layout.text}” rect ${layout.left.toFixed(0)},${layout.top.toFixed(0)}→${layout.right.toFixed(0)},${layout.bottom.toFixed(0)}` : `${selector} missing`,
    );
    await capture(page, size, name);
  }

  check(
    size.name,
    "copy pass emits no page or console errors",
    errors.length === 0,
    errors.length ? `${errors.length} error(s): ${errors.join(" | ").slice(0, 1_200)}` : "0 error(s)",
  );
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
  for (const size of sizes) await auditSize(browser, size);
} finally {
  await browser.close().catch(() => {});
}

if (failures.length) {
  console.error(`\nCOPY LAYOUT AUDIT RED — ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nCOPY LAYOUT AUDIT GREEN — every selling line fits its composition");
}
