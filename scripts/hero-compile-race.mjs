import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:3117").replace(/\/+$/, "");
const CHROME =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const RUNS = Number(process.env.HERO_RACE_RUNS || 3);
const CHURN = process.env.HERO_RACE_CHURN !== "0";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 180_000,
  args: [
    "--window-position=-2400,0",
    "--window-size=960,950",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    "--mute-audio",
    "--no-first-run",
  ],
});

const results = [];

try {
  for (let run = 1; run <= RUNS; run += 1) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const errors = [];
    const trace = [];
    let churned = false;

    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      const value = message.text();
      if (value.startsWith("[hero-compile]")) trace.push(value);
      if (CHURN && !churned && value.startsWith("[hero-compile] polling")) {
        churned = true;
        void (async () => {
          // Orientation/split-view changes are allowed while the opening scene
          // is compiling. Exercise both material profiles during Three's
          // asynchronous KHR_parallel_shader_compile polling window.
          for (const width of [900, 390, 900, 390]) {
            await page.setViewport({
              width,
              height: 844,
              deviceScaleFactor: width < 768 ? 3 : 1,
              isMobile: true,
              hasTouch: true,
            });
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
        })().catch((error) => errors.push(`viewport churn: ${error.message}`));
      }
    });

    await page.setCacheEnabled(false);
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "no-preference" },
    ]);
    await page.evaluateOnNewDocument(() => {
      const original = WebGL2RenderingContext.prototype.getProgramParameter;
      WebGL2RenderingContext.prototype.getProgramParameter = function getProgramParameter(
        program,
        parameter,
      ) {
        // KHR_parallel_shader_compile's COMPLETION_STATUS_KHR. A fast desktop
        // driver can finish before the responsive commit; a slower Apple GPU
        // leaves the same programs in Three's polling set for longer.
        if (parameter === 0x91b1) {
          window.__heroCompilePollHoldUntil ??= performance.now() + 1_500;
          if (performance.now() < window.__heroCompilePollHoldUntil) return false;
        }
        return original.call(this, program, parameter);
      };
    });
    await page.goto(`${BASE}/?tune=1&compiletrace=1&race=${run}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });

    const sceneReady = await page
      .waitForFunction(
        () =>
          document
            .querySelector("[data-hero-runtime]")
            ?.getAttribute("data-hero-scene-ready") === "true",
        { timeout: 25_000 },
      )
      .then(() => true)
      .catch(() => false);

    await page.evaluate(() => {
      const runway = document.querySelector("[data-runway-a]");
      if (!runway) return;
      const rect = runway.getBoundingClientRect();
      const y = rect.top + scrollY + 0.3 * Math.max(1, rect.height - innerHeight);
      window.__lenis2240?.scrollTo(y, { immediate: true, force: true });
      scrollTo(0, y);
    });
    await new Promise((resolve) => setTimeout(resolve, 1_500));

    const state = await page.evaluate(() => ({
      act: window.__film?.stage?.act ?? null,
      edge: Number.isFinite(window.__film?.edge) ? Number(window.__film.edge) : null,
      canvasCount: document.querySelectorAll("[data-hero-runtime] canvas").length,
      preloader: document
        .querySelector("[data-preloader]")
        ?.getAttribute("data-ready-reason") ?? null,
    }));
    const isReadyErrors = errors.filter((error) => /isReady|currentProgram/i.test(error));
    const disposedDuringCompile = trace.filter((value) => value.includes("disposed while polling"));

    results.push({ run, churned, sceneReady, errors, trace, state });
    console.log(
        `hero compile race ${run}/${RUNS}: churn=${churned}; scene=${sceneReady}; ` +
        `act=${state.act}; edge=${state.edge}; canvases=${state.canvasCount}; ` +
        `disposed=${disposedDuringCompile.length}; errors=${JSON.stringify(errors)}`,
    );

    assert.equal(churned, CHURN, `run ${run}: compile-window churn state was not observed`);
    assert.equal(
      disposedDuringCompile.length,
      0,
      `run ${run}: ${disposedDuringCompile.join(" | ")}`,
    );
    assert.deepEqual(isReadyErrors, [], `run ${run}: ${isReadyErrors.join(" | ")}`);
    assert.ok(sceneReady, `run ${run}: scene never established ready provenance`);
    assert.equal(state.canvasCount, 1, `run ${run}: expected one hero canvas`);
    assert.equal(state.act, 0, `run ${run}: expected Act I, saw ${state.act}`);
    assert.ok(state.edge !== null && state.edge <= 1, `run ${run}: Act I edge ${state.edge}`);

    await context.close();
  }

  console.log(`hero compile race audit: PASS — ${results.length} cold responsive compile runs`);
} finally {
  await browser.close().catch(() => {});
}
