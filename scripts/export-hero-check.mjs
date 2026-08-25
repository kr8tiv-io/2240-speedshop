import assert from "node:assert/strict";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const versioner = require("./model-version.js");
const HERO_VERSION = versioner.heroVersion();
const BASE = (process.env.BASE_URL || "http://127.0.0.1:3117").replace(/\/+$/, "");
const CHROME =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 180_000,
  args: [
    "--window-position=-2400,0",
    "--window-size=500,950",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    "--mute-audio",
    "--no-first-run",
  ],
});

try {
  const page = await browser.newPage();
  const errors = [];
  const heroResponses = [];
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource/i.test(message.text())) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText || "failed";
    if (reason !== "net::ERR_ABORTED") errors.push(`request: ${request.url()} — ${reason}`);
  });
  page.on("response", (response) => {
    const pathname = new URL(response.url()).pathname;
    if (response.status() >= 400) errors.push(`response: ${response.url()} — HTTP ${response.status()}`);
    if (/\/models\/hero(?:-[^/]+)?\/[^/]+\.glb$/i.test(pathname)) {
      heroResponses.push({ pathname, status: response.status() });
    }
  });
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.goto(`${BASE}/?tune=1`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page
    .waitForFunction(
      () =>
        document.querySelector("[data-hero-runtime]") &&
        document.querySelectorAll("[data-hero-runtime] canvas").length === 1,
      { timeout: 20_000 },
    )
    .catch(() => {});
  await page
    .waitForFunction(
      () => performance.getEntriesByType("resource").filter((entry) => /\/models\/hero-[^/]+\/[^/]+\.glb$/i.test(new URL(entry.name).pathname)).length >= 3,
      { timeout: 20_000 },
    )
    .catch(() => {});

  const runtime = await page.evaluate(() => ({
    profile: document.querySelector("[data-hero-runtime]")?.getAttribute("data-runtime-profile") || null,
    canvases: document.querySelectorAll("[data-hero-runtime] canvas").length,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl2: Boolean(
      window.WebGL2RenderingContext && document.createElement("canvas").getContext("webgl2"),
    ),
  }));
  const expectedRoot = `/models/hero-${HERO_VERSION}/`;
  if (runtime.profile !== "mobile" || runtime.canvases !== 1 || heroResponses.length !== 3 || errors.length) {
    console.error(JSON.stringify({ runtime, heroResponses, errors }, null, 2));
  }
  assert.equal(runtime.profile, "mobile", `wrong first runtime profile: ${runtime.profile}`);
  assert.equal(runtime.canvases, 1, `expected one hero canvas, saw ${runtime.canvases}`);
  assert.equal(heroResponses.length, 3, `expected three hero responses, saw ${heroResponses.length}`);
  assert.ok(
    heroResponses.every((response) => response.pathname.startsWith(expectedRoot)),
    `unversioned or wrong-version hero request: ${JSON.stringify(heroResponses)}`,
  );
  assert.ok(
    heroResponses.every((response) => response.status === 200),
    `hero response failed: ${JSON.stringify(heroResponses)}`,
  );
  assert.deepEqual(errors, [], `runtime errors: ${errors.join(" | ")}`);
  console.log(
    `export hero audit: PASS — ${runtime.profile}, ${runtime.canvases} canvas, 3× ${expectedRoot} at HTTP 200`,
  );
} finally {
  await browser.close().catch(() => {});
}
