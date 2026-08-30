import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:3117").replace(/\/+$/, "");
const CHROME =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 180_000,
  args: [
    "--window-position=40,40",
    "--window-size=500,950",
    "--disable-backgrounding-occluded-windows",
    "--disable-features=CalculateNativeWinOcclusion",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    "--mute-audio",
    "--no-first-run",
  ],
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
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
  console.log("hero remount: opening route loaded");

  const waitForHero = () =>
    page.waitForFunction(
      () =>
        document.querySelector("[data-hero-runtime][data-runtime-profile='mobile'] canvas") &&
        !document.querySelector("[data-preloader]"),
      { timeout: 25_000 },
    );
  await waitForHero();
  console.log("hero remount: first mobile scene ready");
  await page.evaluate(() => {
    window.__ownershipFirstScene = window.__film?.three?.scene || null;
    document.querySelector("a[href='/about/'], a[href='/about']")?.click();
  });
  await page.waitForFunction(() => location.pathname === "/about/" || location.pathname === "/about", {
    timeout: 15_000,
  });
  await page.waitForFunction(() => !document.querySelector("[data-hero-runtime]"), { timeout: 8_000 });
  console.log("hero remount: about route released the scene");
  await page.goBack({ timeout: 15_000 });
  await page.waitForFunction(() => location.pathname === "/", { timeout: 15_000 });
  await waitForHero();
  console.log("hero remount: second mobile scene ready");

  await page.evaluate(() => {
    const runway = document.querySelector("[data-runway-c]");
    const rect = runway.getBoundingClientRect();
    const y = rect.top + scrollY + 0.7 * Math.max(1, rect.height - innerHeight);
    window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
    scrollTo(0, y);
  });
  await page.waitForFunction(() => window.__film?.stage?.act === 2, { timeout: 8_000 });
  console.log("hero remount: remounted scene reached Act III");
  await new Promise((resolve) => setTimeout(resolve, 1_500));
  const result = await page.evaluate(() => {
    const currentScene = window.__film?.three?.scene || null;
    let ownedMaterials = 0;
    currentScene?.traverse((object) => {
      if (!object.isMesh) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      ownedMaterials += materials.filter((material) => material?.userData?.role).length;
    });
    return {
      distinctScene: Boolean(currentScene && currentScene !== window.__ownershipFirstScene),
      act: window.__film?.stage?.act ?? null,
      edge: Number.isFinite(window.__film?.edge) ? Number(window.__film.edge) : null,
      ownedMaterials,
      canvasCount: document.querySelectorAll("[data-hero-runtime] canvas").length,
    };
  });

  assert.ok(result.distinctScene, "route remount reused the disposed renderer scene");
  assert.equal(result.act, 2, `expected Act III after remount, saw ${result.act}`);
  assert.ok(result.edge !== null && result.edge <= 1, `Act III framing failed: ${result.edge}`);
  assert.ok(result.ownedMaterials > 0, "remounted scene has no owned role materials");
  assert.equal(result.canvasCount, 1, `expected one remounted canvas, saw ${result.canvasCount}`);
  assert.deepEqual(errors, [], `remount emitted errors: ${errors.join(" | ")}`);
  console.log(
    `hero remount audit: PASS — distinct scene, ${result.ownedMaterials} owned materials, Act III edge ${result.edge.toFixed(3)}`,
  );
} finally {
  await browser.close().catch(() => {});
}
