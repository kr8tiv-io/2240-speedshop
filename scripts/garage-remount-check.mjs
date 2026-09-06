import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "http://127.0.0.1:3117").replace(/\/+$/, "");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 180_000,
  args: ["--window-position=-2400,0", "--disable-features=CalculateNativeWinOcclusion",
    "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling", "--mute-audio", "--no-first-run"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`);
  });

  const enterGarage = async () => {
    await page.waitForSelector("#walkthrough-runway", { timeout: 30_000 });
    await page.evaluate(() => {
      const runway = document.querySelector("#walkthrough-runway");
      const rect = runway.getBoundingClientRect();
      const y = rect.top + window.scrollY + 0.16 * Math.max(1, rect.height - window.innerHeight);
      window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
    });
    await page.waitForFunction(
      () => document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage") === "world",
      { timeout: 90_000 },
    );
    const visible = await page
      .waitForFunction(
        () => {
          const world = document.querySelector("[data-shop-world]");
          return Boolean(
            world &&
              world.querySelector("canvas") &&
              Number.parseFloat(getComputedStyle(world).opacity) > 0.98 &&
              window.__shop?.scene,
          );
        },
        { timeout: 40_000 },
      )
      .then(() => true)
      .catch(() => false);
    if (!visible) {
      const state = await page.evaluate(() => {
        const host = document.querySelector("[data-shop-stage]");
        const world = document.querySelector("[data-shop-world]");
        return {
          stage: host?.getAttribute("data-shop-stage"),
          hostOpacity: host ? getComputedStyle(host).opacity : null,
          worldOpacity: world ? getComputedStyle(world).opacity : null,
          worldClass: world?.className || null,
          canvas: Boolean(world?.querySelector("canvas")),
          runtime: Boolean(window.__shop?.scene),
        };
      });
      throw new Error(`remounted garage stayed hidden: ${JSON.stringify(state)}`);
    }
    return page.evaluate(() => ({
      scene: window.__shop.scene.uuid,
      stage: document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage"),
      canvases: document.querySelectorAll("[data-shop-world] canvas").length,
    }));
  };

  await page.goto(`${BASE}/?perf=1`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const first = await enterGarage();
  assert.equal(first.stage, "world");
  assert.equal(first.canvases, 1);

  await Promise.all([
    page.waitForFunction(() => location.pathname.replace(/\/+$/, "") === "/about", {
      timeout: 20_000,
    }),
    page.evaluate(() => {
      const about = document.querySelector('a[href="/about"], a[href="/about/"]');
      if (!about) throw new Error("about link missing");
      about.click();
    }),
  ]);
  await page.waitForFunction(
    () => !document.querySelector("[data-shop-world] canvas"),
    { timeout: 20_000 },
  );

  // Browser-back exercises Next's SPA route cache while preserving `?perf=1`
  // for the second renderer diagnostics.
  await page.goBack({ waitUntil: "domcontentloaded", timeout: 20_000 });
  await page.waitForFunction(
    () => location.pathname === "/" && location.search.includes("perf=1"),
    { timeout: 20_000 },
  );
  await page.waitForFunction(
    () => document.querySelector("[data-shop-stage]")?.getAttribute("data-shop-stage") === "poster",
    { timeout: 20_000 },
  );

  const second = await enterGarage();
  assert.equal(second.stage, "world");
  assert.equal(second.canvases, 1);
  assert.notEqual(second.scene, first.scene, "route revisit reused disposed renderer scene");
  if (process.env.QA_ORIENTATION === "1") {
    for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
      await page.setViewport({ ...viewport, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      const rotated = await enterGarage();
      assert.equal(rotated.stage, "world");
      assert.equal(rotated.canvases, 1);
      const layout = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth, x: scrollX, rail: window.__shop.camera.userData.rail.t }));
      assert.ok(layout.document <= layout.width && layout.body <= layout.width, "Rotation cannot create sideways overflow");
      assert.equal(layout.x, 0);
      assert.ok(Number.isFinite(layout.rail), "Tour camera remains live after rotation");
      console.log(`garage orientation: PASS ${viewport.width} x ${viewport.height}, one populated Canvas, no overflow`);
    }
  }
  assert.deepEqual(errors, [], `garage remount emitted errors: ${errors.join(" | ")}`);

  console.log(
    `garage remount audit: PASS — fresh mobile renderer ${first.scene.slice(0, 8)} → ${second.scene.slice(0, 8)}, one populated Canvas`,
  );
} finally {
  await browser.close();
}
