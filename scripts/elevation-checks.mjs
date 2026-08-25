/**
 * Falsifiable launch budgets for the combined 3D homepage.
 *
 * Chrome is deliberately headful and on-screen. Headless Chrome uses
 * SwiftShader on this machine, while a fully off-screen native window can have
 * requestAnimationFrame throttled independently of renderer activity. Either
 * condition would turn this GPU frame-pacing audit into fiction. Programmatic
 * scrolling always goes through the page's Lenis instance when it exists.
 *
 *   npm run audit:elevation
 *   BASE_URL=https://example.com npm run audit:elevation
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "http://localhost:3117").replace(/\/+$/, "");
const FOCUS = (process.env.ELEVATION_FOCUS || "all").trim().toLowerCase();
const URL = `${BASE}/?tune=1${FOCUS === "shop" ? "&perf=1" : ""}`;

const PRELOADER_BUDGET_MS = 12_000;
const PRELOADER_EMERGENCY_MS = 20_000;
const EDITORIAL_NEAR_PX = 280;
const MAX_CANVASES = 2;
const MAX_CAR_EDGE = 1;
const MAX_RAF_GAP_MS = 250;
const HERO_RUNTIME_CHUNK_MARKER = "2240-hero-runtime-chunk";

const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone375", width: 375, height: 667, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "phone430", width: 430, height: 932, dsf: 3, mobile: true },
];

const EDGE_BEATS = [
  { name: "act-I", selector: "[data-runway-a]", progress: 0.3, expectedAct: 0 },
  { name: "act-II", selector: "[data-runway-a]", progress: 0.8, expectedAct: 1 },
  { name: "act-III", selector: "[data-runway-c]", progress: 0.62, expectedAct: 2 },
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

function colourAlpha(colour) {
  if (!colour || colour === "transparent") return 0;
  // Chromium reports Tailwind's modern colours as `oklab(... / 0.97)`, not
  // necessarily rgba(). Preserve the measured alpha across both syntaxes.
  const slashAlpha = colour.match(/\/\s*([\d.]+)(%)?\s*\)/);
  if (slashAlpha) {
    const value = Number(slashAlpha[1]);
    return slashAlpha[2] ? value / 100 : value;
  }
  if (!colour.startsWith("rgba")) return 1;
  const values = colour.match(/[\d.]+/g) || [];
  return Number(values[3] ?? 0);
}

function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
}

async function inspectRequestedJavaScript(page, requestUrls) {
  const urls = [...new Set(requestUrls)].filter((requestUrl) => {
    try {
      return /\.js$/i.test(new globalThis.URL(requestUrl).pathname);
    } catch {
      return /\.js(?:[?#]|$)/i.test(requestUrl);
    }
  });
  // Inspect through the already-trusted browser origin. Node's bundled CA set
  // can reject otherwise valid Hostinger certificate chains on Windows, which
  // used to turn every chunk into an audit failure before source inspection.
  const inspected = await page.evaluate(
    async ({ requestUrls: sourceUrls, marker }) =>
      Promise.all(
        sourceUrls.map(async (requestUrl) => {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15_000);
          try {
            const response = await fetch(requestUrl, {
              cache: "force-cache",
              signal: controller.signal,
            });
            if (!response.ok) return { requestUrl, error: `HTTP ${response.status}` };
            const source = await response.text();
            const hero =
              source.includes(marker) ||
              source.includes("/models/hero/challenger.glb") ||
              source.includes("/models/hero/challenger.glb.br") ||
              source.includes("data-hero-runtime");
            return { requestUrl, hero };
          } catch (error) {
            return { requestUrl, error: error instanceof Error ? error.message : String(error) };
          } finally {
            clearTimeout(timeout);
          }
        }),
      ),
    { requestUrls: urls, marker: HERO_RUNTIME_CHUNK_MARKER },
  );
  return {
    requested: urls,
    hero: inspected.filter((entry) => entry.hero).map((entry) => entry.requestUrl),
    failed: inspected.filter((entry) => entry.error),
  };
}

async function seek(page, selector, progress) {
  return page.evaluate(
    ({ runwaySelector, runwayProgress }) => {
      const runway = document.querySelector(runwaySelector);
      if (!runway) return { ok: false, reason: `${runwaySelector} missing` };
      const rect = runway.getBoundingClientRect();
      const y = Math.max(
        0,
        rect.top + window.scrollY + runwayProgress * Math.max(1, rect.height - innerHeight),
      );
      if (window.__lenis2240) {
        window.__lenis2240.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
      return { ok: true, y: Math.round(y), usedLenis: !!window.__lenis2240 };
    },
    { runwaySelector: selector, runwayProgress: progress },
  );
}

async function auditMenu(page, size) {
  const trigger = await page.$('button[aria-controls="mobile-nav"]');
  if (!trigger) {
    check(
      size.name,
      "all exposed mobile-menu interactive controls are at least 44×44 CSS px",
      false,
      "menu toggle/close control missing; open-menu targets could not be measured",
    );
    return;
  }

  let opened = false;
  try {
    await page.click('button[aria-controls="mobile-nav"]');
    await page.waitForFunction(
      () => document.querySelector('button[aria-controls="mobile-nav"]')?.getAttribute("aria-expanded") === "true",
      { timeout: 2_000 },
    );
    await sleep(380);
    opened = true;
  } catch (error) {
    check(size.name, "mobile menu opens", false, `click/open failed: ${error.message}`);
  }
  if (!opened) {
    check(
      size.name,
      "all exposed mobile-menu interactive controls are at least 44×44 CSS px",
      false,
      "menu did not open; interactive targets could not be measured",
    );
    return;
  }

  const targetAudit = await page.evaluate(() => {
    const menu = document.getElementById("mobile-nav");
    const toggle = document.querySelector('button[aria-controls="mobile-nav"]');
    if (!menu || !toggle) return null;
    const selector = [
      "a[href]",
      "area[href]",
      "button:not([disabled])",
      "input:not([type='hidden']):not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "summary",
      "[role='button']",
      "[role='link']",
      "[contenteditable='true']",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const controls = [...new Set([toggle, ...menu.querySelectorAll(selector)])];
    const targets = controls
      .filter((control) => {
        const rect = control.getBoundingClientRect();
        const style = getComputedStyle(control);
        const visible = control.checkVisibility
          ? control.checkVisibility({ opacityProperty: true, visibilityProperty: true })
          : style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0;
        return visible && style.pointerEvents !== "none" && rect.width > 0 && rect.height > 0;
      })
      .map((control) => {
        const rect = control.getBoundingClientRect();
        const rawLabel =
          control.getAttribute("aria-label") ||
          control.textContent ||
          control.getAttribute("href") ||
          control.tagName;
        return {
          label: rawLabel.replace(/\s+/g, " ").trim().slice(0, 54),
          tag: control.tagName.toLowerCase(),
          width: rect.width,
          height: rect.height,
          toggle: control === toggle,
        };
      });
    return { targets, hasToggle: targets.some((target) => target.toggle) };
  });
  const undersized =
    targetAudit?.targets.filter((target) => target.width < 44 || target.height < 44) || [];
  const targetsAvailable = !!targetAudit && targetAudit.hasToggle && targetAudit.targets.length > 1;
  check(
    size.name,
    "all exposed mobile-menu interactive controls are at least 44×44 CSS px",
    targetsAvailable && undersized.length === 0,
    !targetsAvailable
      ? `interactive target diagnostics unavailable or incomplete (${targetAudit?.targets.length ?? 0} rendered control(s), toggle=${targetAudit?.hasToggle ?? false})`
      : undersized.length
        ? `${undersized.length}/${targetAudit.targets.length} undersized: ${undersized.map((target) => `${target.tag}“${target.label}” ${target.width.toFixed(1)}×${target.height.toFixed(1)}px`).join("; ")}`
        : `${targetAudit.targets.length} rendered controls measured; smallest dimensions all >=44×44px`,
  );

  const layer = await page.evaluate(() => {
    const menu = document.getElementById("mobile-nav");
    if (!menu) return null;
    const rect = menu.getBoundingClientRect();
    const style = getComputedStyle(menu);
    return {
      rect: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      },
      viewport: { width: innerWidth, height: innerHeight },
      background: style.backgroundColor,
      isolation: style.isolation,
      position: style.position,
      opacity: Number(style.opacity),
      visibility: style.visibility,
      dialog: menu.getAttribute("role") === "dialog",
      modal: menu.getAttribute("aria-modal") === "true",
      overlay: document.documentElement.getAttribute("data-ui-overlay"),
      shellInert: document.getElementById("site-shell")?.inert === true,
      shellHidden: document.getElementById("site-shell")?.getAttribute("aria-hidden") === "true",
      focusInside: menu.contains(document.activeElement),
    };
  });
  const alpha = colourAlpha(layer?.background);
  const covers =
    !!layer &&
    layer.rect.left <= 1 &&
    layer.rect.top <= 1 &&
    layer.rect.right >= layer.viewport.width - 1 &&
    layer.rect.bottom >= layer.viewport.height - 1;
  const isolatedOpaque =
    !!layer &&
    covers &&
    layer.position === "fixed" &&
    layer.visibility === "visible" &&
    layer.opacity >= 0.99 &&
    alpha >= 0.995 &&
    layer.isolation === "isolate" &&
    layer.dialog &&
    layer.modal &&
    layer.overlay === "menu" &&
    layer.shellInert &&
    layer.shellHidden &&
    layer.focusInside;
  check(
    size.name,
    "mobile menu is a viewport-covering opaque isolated layer",
    isolatedOpaque,
    layer
      ? `rect ${layer.rect.left.toFixed(0)},${layer.rect.top.toFixed(0)}→${layer.rect.right.toFixed(0)},${layer.rect.bottom.toFixed(0)} ` +
          `vs ${layer.viewport.width}×${layer.viewport.height}; bg ${layer.background} (alpha ${alpha}); isolation ${layer.isolation}`
          + `; dialog=${layer.dialog}/${layer.modal}; overlay=${layer.overlay}; shell inert=${layer.shellInert}; focus inside=${layer.focusInside}`
      : "#mobile-nav missing after trigger opened",
  );

  const before = await page.evaluate(() => ({
    y: window.scrollY,
    htmlOverflow: getComputedStyle(document.documentElement).overflowY,
    bodyOverflow: getComputedStyle(document.body).overflowY,
  }));
  await page.mouse.move(Math.floor(size.width / 2), Math.floor(size.height / 2));
  await page.mouse.wheel({ deltaY: 700 });
  await sleep(450);
  const afterY = await page.evaluate(() => window.scrollY);
  const overflowLocked = [before.htmlOverflow, before.bodyOverflow].some((v) =>
    ["hidden", "clip"].includes(v),
  );
  const delta = Math.abs(afterY - before.y);
  check(
    size.name,
    "menu-open locks document scroll",
    overflowLocked && delta <= 1,
    `overflow html=${before.htmlOverflow}, body=${before.bodyOverflow}; wheel delta moved scroll ${delta.toFixed(1)}px`,
  );

  await page.keyboard.press("Escape");
  await sleep(350);
  const restored = await page.evaluate(() => {
    const toggle = document.querySelector('button[aria-controls="mobile-nav"]');
    const shell = document.getElementById("site-shell");
    return {
      closed: toggle?.getAttribute("aria-expanded") === "false",
      focusReturned: document.activeElement === toggle,
      overlay: document.documentElement.getAttribute("data-ui-overlay"),
      shellInert: shell?.inert === true,
      shellHidden: shell?.getAttribute("aria-hidden"),
      bodyPosition: document.body.style.position,
    };
  });
  check(
    size.name,
    "Escape closes the modal and restores the page shell",
    restored.closed &&
      restored.focusReturned &&
      restored.overlay === null &&
      !restored.shellInert &&
      restored.shellHidden === null &&
      restored.bodyPosition !== "fixed",
    `closed=${restored.closed}; focus returned=${restored.focusReturned}; overlay=${restored.overlay ?? "none"}; shell inert=${restored.shellInert}; shell aria-hidden=${restored.shellHidden ?? "none"}; body position=${restored.bodyPosition || "default"}`,
  );
}

async function auditDesktopScroll(page) {
  // The audit is launched from another desktop app, so Chrome is not
  // guaranteed to own OS focus even though its window is visible. Explicitly
  // activate this target before sampling; otherwise Chromium is allowed to
  // reduce rAF cadence for a background tab and the result measures the test
  // runner rather than the website.
  await page.bringToFront();
  const focusSession = await page.createCDPSession();
  await focusSession.send("Emulation.setFocusEmulationEnabled", { enabled: true });
  if (FOCUS === "shop") {
    await focusSession.send("Profiler.enable");
    await focusSession.send("Profiler.setSamplingInterval", { interval: 1_000 });
    await focusSession.send("Profiler.start");
  }
  await seek(page, "[data-runway-a]", 0);
  await sleep(300);
  const pageState = await page.evaluate(() => ({
    visibility: document.visibilityState,
    focused: document.hasFocus(),
  }));
  check(
    "desktop",
    "frame sampler owns an active foreground document",
    pageState.visibility === "visible" && pageState.focused,
    `visibility=${pageState.visibility}; focused=${pageState.focused}`,
  );
  await page.evaluate(() => {
    window.__elevationRaf = { active: true, gaps: [], longTasks: [], last: null };
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const sample = window.__elevationRaf;
        if (!sample?.active) return;
        for (const entry of list.getEntries()) {
          sample.longTasks.push({
            start: entry.startTime,
            duration: entry.duration,
            y: window.scrollY,
          });
        }
      });
      try {
        observer.observe({ type: "longtask", buffered: false });
        window.__elevationRaf.observer = observer;
      } catch {
        observer.disconnect();
      }
    }
    const tick = (now) => {
      const sample = window.__elevationRaf;
      if (!sample?.active) return;
      if (sample.last !== null) {
        sample.gaps.push({ gap: now - sample.last, y: window.scrollY, at: now });
      }
      sample.last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  for (let y = 0; y <= 7200; y += 240) {
    await page.evaluate((targetY) => {
      if (window.__lenis2240) {
        window.__lenis2240.scrollTo(targetY, { duration: 0.09, force: true });
      } else {
        window.scrollTo(0, targetY);
      }
    }, y);
    await sleep(60);
  }
  await sleep(600);

  const sample = await page.evaluate(() => {
    const sample = window.__elevationRaf;
    if (!sample || !Array.isArray(sample.gaps)) return null;
    sample.active = false;
    sample.observer?.disconnect();
    return {
      gaps: sample.gaps.filter((entry) => Number.isFinite(entry.gap) && entry.gap >= 0),
      longTasks: Array.isArray(sample.longTasks) ? sample.longTasks : [],
    };
  });
  const gapValues = sample?.gaps.map((entry) => entry.gap) ?? null;
  const worstEntry = sample?.gaps.length
    ? sample.gaps.reduce((largest, entry) => (entry.gap > largest.gap ? entry : largest))
    : null;
  const worst = worstEntry?.gap ?? null;
  const p95 = gapValues ? percentile(gapValues, 0.95) : null;
  const shopMountedDuringMotion = await page.evaluate(() =>
    Boolean(document.querySelector("[data-shop-world]")),
  );
  if (FOCUS === "shop") {
    const { profile } = await focusSession.send("Profiler.stop");
    const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
    const totals = new Map();
    for (let i = 0; i < (profile.samples?.length ?? 0); i++) {
      const node = nodes.get(profile.samples[i]);
      if (!node) continue;
      const frame = node.callFrame;
      const key = `${frame.functionName || "(anonymous)"} · ${frame.url || "browser"}:${frame.lineNumber + 1}`;
      totals.set(key, (totals.get(key) ?? 0) + (profile.timeDeltas?.[i] ?? 0) / 1_000);
    }
    const leaders = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    for (const [frame, milliseconds] of leaders) {
      console.log(`TRACE [hero-cpu] ${milliseconds.toFixed(1)} ms · ${frame}`);
    }
  }
  check(
    "desktop",
    "continuous hero motion does not start the shop compiler",
    !shopMountedDuringMotion,
    `shop mounted during sample=${shopMountedDuringMotion}`,
  );
  check(
    "desktop",
    "controlled 0→7200 scroll worst rAF gap <=250ms",
    worst !== null && worst <= MAX_RAF_GAP_MS,
    worst === null
      ? "rAF sampler produced no finite samples"
      : `worst ${worst.toFixed(1)}ms at y=${Math.round(worstEntry.y)}px; p95 ${p95.toFixed(1)}ms; ${gapValues.length} frames; ${sample.longTasks.length} long task(s)${sample.longTasks.length ? ` (largest ${Math.max(...sample.longTasks.map((entry) => entry.duration)).toFixed(1)}ms)` : ""}; budget ${MAX_RAF_GAP_MS}ms`,
  );
}

/**
 * Cold-start contract for the homepage's first 3D boundary.
 *
 * This deliberately runs before the wider launch matrix. It catches two bugs
 * that a settled screenshot cannot: mounting the desktop renderer for a phone
 * and merely hiding an already-downloaded Three scene for reduced motion.
 */
async function auditHeroBoot(browser) {
  const scenarios = [
    { name: "boot-phone390", reduced: false },
    { name: "boot-reduced390", reduced: true },
  ];
  let knownHeroRuntimeScripts = [];

  for (const scenario of scenarios) {
    let browserContext;
    let page;
    let releaseHeldHeroRequest = null;
    try {
      browserContext = await browser.createBrowserContext();
      page = await browserContext.newPage();
      await page.setCacheEnabled(false);
      await page.setViewport({
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      });
      await page.emulateMediaFeatures([
        {
          name: "prefers-reduced-motion",
          value: scenario.reduced ? "reduce" : "no-preference",
        },
      ]);

      const pageErrors = [];
      const hydrationErrors = [];
      const requests = [];
      let heldHeroRequestSeen = false;
      let signalHeldHeroRequest;
      const heldHeroRequestReady = new Promise((resolve) => {
        signalHeldHeroRequest = resolve;
      });
      let releaseHeldRequest;
      const heldRequestReleased = new Promise((resolve) => {
        releaseHeldRequest = resolve;
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("console", (message) => {
        const value = message.text();
        if (
          message.type() === "error" &&
          /hydration|hydrated|server rendered html|did not match/i.test(value)
        ) {
          hydrationErrors.push(value);
        }
      });
      if (!scenario.reduced) await page.setRequestInterception(true);
      page.on("request", async (request) => {
        requests.push(request.url());
        if (!scenario.reduced) {
          const hold =
            !heldHeroRequestSeen &&
            /\/models\/hero(?:-[^/]+)?\/charger\.glb(?:\.br)?(?:[?#]|$)/i.test(request.url());
          if (hold) {
            heldHeroRequestSeen = true;
            signalHeldHeroRequest();
            releaseHeldHeroRequest = releaseHeldRequest;
            await heldRequestReleased;
          }
          await request.continue().catch(() => {});
        }
      });

      await page.evaluateOnNewDocument(() => {
        window.__elevationHeroBoot = { firstProfile: null, mounts: [] };
        const record = (node) => {
          if (!(node instanceof Element)) return;
          const runtimes = [
            ...(node.matches("[data-hero-runtime]") ? [node] : []),
            ...node.querySelectorAll("[data-hero-runtime]"),
          ];
          for (const runtime of runtimes) {
            const profile = runtime.getAttribute("data-runtime-profile");
            window.__elevationHeroBoot.mounts.push(profile);
            window.__elevationHeroBoot.firstProfile ??= profile;
          }
        };
        new MutationObserver((records) => {
          for (const entry of records) {
            for (const node of entry.addedNodes) record(node);
          }
        }).observe(document, { childList: true, subtree: true });
      });

      await page.goto(`${URL}&boot=${scenario.reduced ? "reduced" : "mobile"}`, {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });

      if (scenario.reduced) {
        // Long enough for the old post-hydration preference effect and the
        // shop's early warm timer to fire; still short enough for a focused
        // boot check to stay useful while iterating.
        await sleep(4_500);
      } else {
        await page
          .waitForFunction(
            () =>
              window.__elevationHeroBoot?.firstProfile !== null &&
              document.querySelector("[data-hero-runtime] canvas"),
            { timeout: 15_000 },
          )
          .catch(() => {});

        const held = await Promise.race([
          heldHeroRequestReady.then(() => true),
          sleep(8_000).then(() => false),
        ]);
        const beforeResize = await page.evaluate(() => {
          const preloader = document.querySelector("[data-preloader]");
          const progress = preloader?.getAttribute("data-progress");
          const generation = preloader?.getAttribute("data-boot-generation");
          return {
            progress: progress === null || progress === undefined ? null : Number(progress),
            generation:
              generation === null || generation === undefined ? null : Number(generation),
          };
        });
        await page.setViewport({
          width: 900,
          height: 844,
          deviceScaleFactor: 1,
          isMobile: true,
          hasTouch: true,
        });
        await page
          .waitForFunction(
            () =>
              document.querySelector("[data-hero-runtime]")?.getAttribute("data-runtime-profile") ===
              "desktop",
            { timeout: 4_000 },
          )
          .catch(() => {});
        await sleep(250);
        const afterResize = await page.evaluate(() => {
          const preloader = document.querySelector("[data-preloader]");
          const progress = preloader?.getAttribute("data-progress");
          const generation = preloader?.getAttribute("data-boot-generation");
          return {
            progress: progress === null || progress === undefined ? null : Number(progress),
            generation:
              generation === null || generation === undefined ? null : Number(generation),
          };
        });
        check(
          scenario.name,
          "active mobile-breakpoint resize preserves in-flight hero readiness",
          held &&
            Number.isFinite(beforeResize.progress) &&
            Number.isFinite(afterResize.progress) &&
            Number.isFinite(beforeResize.generation) &&
            beforeResize.generation === afterResize.generation &&
            afterResize.progress >= beforeResize.progress,
          `held charger=${held}; generation ${beforeResize.generation ?? "missing"}→${afterResize.generation ?? "missing"}; progress ${beforeResize.progress ?? "missing"}→${afterResize.progress ?? "missing"}`,
        );
        releaseHeldHeroRequest?.();
      }

      const state = await page.evaluate(() => ({
        firstProfile: window.__elevationHeroBoot?.firstProfile ?? null,
        mounts: window.__elevationHeroBoot?.mounts ?? [],
        runtimeCount: document.querySelectorAll("[data-hero-runtime]").length,
        runtimeCanvasCount: document.querySelectorAll("[data-hero-runtime] canvas").length,
        canvasCount: document.querySelectorAll("canvas").length,
      }));
      const heroGlbs = requests.filter((requestUrl) => {
        try {
          return /\/models\/hero(?:-[^/]+)?\/[^?#]+\.glb(?:\.br)?$/i.test(
            new globalThis.URL(requestUrl).pathname,
          );
        } catch {
          return /\/models\/hero(?:-[^/]+)?\/[^?#]+\.glb(?:\.br)?(?:[?#]|$)/i.test(requestUrl);
        }
      });
      const scripts = await inspectRequestedJavaScript(page, requests);

      if (scenario.reduced) {
        check(
          scenario.name,
          "reduced motion mounts zero WebGL canvases",
          state.canvasCount === 0,
          `${state.canvasCount} connected canvas(es); runtime wrappers ${state.runtimeCount}`,
        );
        check(
          scenario.name,
          "reduced motion requests zero hero GLBs",
          heroGlbs.length === 0,
          heroGlbs.length
            ? `${heroGlbs.length} hero request(s): ${[...new Set(heroGlbs)].join(", ")}`
            : "0 /models/hero/*.glb requests",
        );
        const bootErrors = [...new Set([...pageErrors, ...hydrationErrors])];
        check(
          scenario.name,
          "reduced motion has zero hydration or page errors",
          bootErrors.length === 0,
          bootErrors.length ? `${bootErrors.length} error(s): ${bootErrors.join(" | ")}` : "0 errors",
        );
        const knownRequested = knownHeroRuntimeScripts.filter((known) =>
          scripts.requested.includes(known),
        );
        check(
          scenario.name,
          "reduced motion never requests the HeroRuntime JavaScript chunk",
          knownHeroRuntimeScripts.length > 0 &&
            scripts.hero.length === 0 &&
            knownRequested.length === 0,
          knownHeroRuntimeScripts.length === 0
            ? `hero chunk diagnostics unavailable; inspected ${scripts.requested.length} reduced JS response(s)`
            : `known hero chunk(s) ${knownHeroRuntimeScripts.join(", ")}; reduced marker hits ${scripts.hero.length}; direct URL hits ${knownRequested.length}; ${scripts.failed.length} JS inspection failure(s)`,
        );
      } else {
        check(
          scenario.name,
          "first hero runtime mount is explicitly mobile",
          state.firstProfile === "mobile" && state.runtimeCanvasCount === 1,
          `first profile ${state.firstProfile ?? "missing"}; mounts ${JSON.stringify(state.mounts)}; runtime canvases ${state.runtimeCanvasCount}`,
        );
        knownHeroRuntimeScripts = scripts.hero;
        check(
          scenario.name,
          "HeroRuntime JavaScript chunk diagnostics resolve dynamically",
          knownHeroRuntimeScripts.length > 0,
          knownHeroRuntimeScripts.length
            ? `${knownHeroRuntimeScripts.length} hero-marked JS response(s): ${knownHeroRuntimeScripts.join(", ")}`
            : `no hero marker in ${scripts.requested.length} inspected JS response(s); ${scripts.failed.length} inspection failure(s)`,
        );
        const lossExtensionAvailable = await page.evaluate(() => {
          const canvas = document.querySelector("[data-hero-runtime] canvas");
          const context = canvas?.getContext("webgl2");
          const extension = context?.getExtension("WEBGL_lose_context");
          extension?.loseContext();
          return Boolean(extension);
        });
        const fallbackVisible = await page
          .waitForSelector("[data-hero-runtime] [data-webgl-fallback]", { timeout: 4_000 })
          .then(() => true)
          .catch(() => false);
        check(
          scenario.name,
          "hero context loss resolves into the cinematic fallback",
          lossExtensionAvailable && fallbackVisible,
          `WEBGL_lose_context=${lossExtensionAvailable}; fallback=${fallbackVisible}`,
        );
      }
    } catch (error) {
      const message = `${scenario.name} · boot audit execution — ${error.stack || error.message}`;
      failures.push(message);
      console.error(`FAIL ${message}`);
    } finally {
      releaseHeldHeroRequest?.();
      await page?.close().catch(() => {});
      await browserContext?.close().catch(() => {});
    }
  }
}

async function auditSize(browserContext, size) {
  const page = await browserContext.newPage();
  // Every viewport is a cold, independent visit. Browser contexts isolate the
  // HTTP cache from the previous viewport; this also disables this page's own
  // cache explicitly before the first request is allowed to leave.
  await page.setCacheEnabled(false);
  const pageErrors = [];
  const consoleErrors = [];
  // Kept inside this invocation so editorial request evidence cannot leak
  // across viewport audits even if Puppeteer changes context cache semantics.
  const requests = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    const text = message.text();
    if (FOCUS === "shop" && text.startsWith("[shop]")) console.log(`TRACE ${text}`);
    if (message.type() === "error") consoleErrors.push(text);
    else if (/webgl/i.test(text) && /(error|lost|invalid|context)/i.test(text)) {
      consoleErrors.push(`${message.type()}: ${text}`);
    }
  });
  page.on("request", (request) => requests.push(request.url()));

  await page.setViewport({
    width: size.width,
    height: size.height,
    deviceScaleFactor: size.dsf,
    isMobile: !!size.mobile,
    hasTouch: !!size.mobile,
  });
  await page.evaluateOnNewDocument(() => {
    window.__elevationWebGLErrors = [];
    window.__elevationPreloader = {
      seen: false,
      sceneReady: false,
      readyReason: null,
      domState: null,
      emergency: false,
      emergencyReason: null,
      inlineEscape: false,
      cssDeadManFired: false,
      goneObserved: false,
      genericGone: false,
      removed: false,
      removedAfterScene: false,
      goneAfterScene: false,
    };

    /* A computed opacity of zero proves only that the CSS dead-man timer ran.
       Record explicit runtime provenance instead. ONLY data-ready-reason=
       "scene" establishes a normal origin; data-state="gone" or DOM removal
       can confirm clearance only after that origin. Emergency is monotonic. */
    const preloaderSelector = ".preloader-veil, [data-preloader]";
    const instrumentation = window.__elevationPreloader;
    const isEmergency = (value) =>
      /(?:emergency|escape|timeout|hard[-_ ]?cap|css|dead[-_ ]?man)/i.test(value || "");
    const markEmergency = (reason) => {
      if (!instrumentation.emergencyReason) instrumentation.emergencyReason = reason;
      instrumentation.emergency = true;
    };
    const inspectPreloader = (veil, changedAttribute = null) => {
      instrumentation.seen = true;
      if (changedAttribute === null || changedAttribute === "data-ready-reason") {
        const reason = (veil.getAttribute("data-ready-reason") || "").trim().toLowerCase();
        if (reason) instrumentation.readyReason = reason;
        if (isEmergency(reason)) markEmergency(`marker:${reason}`);
        // Once an emergency was observed, a late scene marker cannot rewrite
        // history and turn the emergency path into a normal handoff.
        if (reason === "scene" && !instrumentation.emergency) {
          instrumentation.sceneReady = true;
        }
      }
      if (changedAttribute === null || changedAttribute === "data-state") {
        const domState = (veil.getAttribute("data-state") || "").trim().toLowerCase();
        if (domState) instrumentation.domState = domState;
        if (isEmergency(domState)) markEmergency(`marker:${domState}`);
        if (domState === "gone" && !instrumentation.goneObserved) {
          instrumentation.goneObserved = true;
          if (instrumentation.sceneReady && !instrumentation.emergency) {
            instrumentation.goneAfterScene = true;
          } else {
            instrumentation.genericGone = true;
          }
        }
      }
      if (
        (changedAttribute === null || changedAttribute === "style") &&
        veil.style.display === "none"
      ) {
        instrumentation.inlineEscape = true;
        markEmergency("inline-display-none");
      }
    };
    const visitPreloaders = (node, removed = false) => {
      if (!(node instanceof Element)) return;
      const veils = [
        ...(node.matches(preloaderSelector) ? [node] : []),
        ...node.querySelectorAll(preloaderSelector),
      ];
      for (const veil of veils) {
        inspectPreloader(veil);
        if (removed) {
          instrumentation.removed = true;
          if (
            instrumentation.sceneReady &&
            !instrumentation.emergency &&
            !instrumentation.genericGone
          ) {
            instrumentation.removedAfterScene = true;
          }
        }
      }
    };
    const preloaderObserver = new MutationObserver((records) => {
      for (const record of records) {
        if (
          record.type === "attributes" &&
          record.target instanceof Element &&
          record.target.matches(preloaderSelector)
        ) {
          inspectPreloader(record.target, record.attributeName);
        }
        for (const node of record.addedNodes) visitPreloaders(node);
        for (const node of record.removedNodes) visitPreloaders(node, true);
      }
    });
    preloaderObserver.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-ready-reason", "data-state", "style"],
    });
    if (document.documentElement) visitPreloaders(document.documentElement);

    // globals.css attaches this exact animation to `.preloader-veil` as the
    // final 19 s CSS dead-man. If it starts on an existing veil, the fallback has
    // visibly taken control: always mark emergency. A healthy scene-ready path
    // must cancel/disable this animation before it starts, then finish its own
    // exit; an earlier scene marker does not excuse a fallback-owned exit.
    document.addEventListener(
      "animationstart",
      (event) => {
        const veil = event.target;
        if (
          veil instanceof Element &&
          veil.matches(preloaderSelector) &&
          event.animationName === "preloader-failsafe"
        ) {
          instrumentation.cssDeadManFired = true;
          markEmergency("css-animation:preloader-failsafe");
        }
      },
      true,
    );

    window.addEventListener(
      "webglcontextlost",
      (event) => {
        window.__elevationWebGLErrors.push(`webglcontextlost: ${event.target?.tagName || "canvas"}`);
      },
      true,
    );
    const nativeGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function patchedGetContext(type, ...args) {
      const context = nativeGetContext.call(this, type, ...args);
      if (context && /^(webgl|webgl2|experimental-webgl)$/i.test(String(type))) {
        this.__elevationContextType = String(type);
      }
      return context;
    };
  });

  const navigationStarted = Date.now();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const budgetRemaining = Math.max(1, PRELOADER_BUDGET_MS - (Date.now() - navigationStarted));
  const preloaderReady = await page
    .waitForFunction(
      () => {
        const state = window.__elevationPreloader;
        if (!state) return false;
        const sceneCleared =
          state.sceneReady && (state.goneAfterScene || state.removedAfterScene);
        return !state.emergency && sceneCleared;
      },
      { timeout: budgetRemaining },
    )
    .then(() => true)
    .catch(() => false);
  const preloaderElapsed = Date.now() - navigationStarted;
  // Budget already decided from explicit provenance above. Wait separately
  // for React to remove the node or for the imperative emergency escape to
  // set inline display:none, so the preloader's scroll lock cannot make later
  // menu checks pass. Computed CSS dead-man visibility is deliberately ignored.
  const remaining = Math.max(1, PRELOADER_EMERGENCY_MS - preloaderElapsed);
  await page
    .waitForFunction(
      () => {
        const state = window.__elevationPreloader;
        if (state?.sceneReady && !state.emergency && state.goneAfterScene) return true;
        const veil = document.querySelector(".preloader-veil, [data-preloader]");
        if (!veil) return true;
        return veil.style.display === "none";
      },
      { timeout: remaining },
    )
    .catch(() => {});
  const preloaderState = await page.evaluate(() => {
    const state = window.__elevationPreloader;
    if (!state) return null;
    // MutationObserver normally records this first. Repeat synchronously so
    // an inline escape and this DevTools poll cannot race by one microtask.
    const veil = document.querySelector(".preloader-veil, [data-preloader]");
    if (veil?.style.display === "none") {
      state.inlineEscape = true;
      state.emergency = true;
      state.emergencyReason ||= "inline-display-none";
    }
    return { ...state };
  });
  const normalSceneClearance =
    !!preloaderState &&
    preloaderState.sceneReady &&
    (preloaderState.goneAfterScene || preloaderState.removedAfterScene) &&
    !preloaderState.genericGone &&
    !preloaderState.emergency;
  check(
    size.name,
    `preloader proves scene-ready clearance within ${PRELOADER_BUDGET_MS}ms`,
    preloaderReady && normalSceneClearance && preloaderElapsed <= PRELOADER_BUDGET_MS + 50,
    preloaderState
      ? `elapsed=${preloaderElapsed}ms; scene=${preloaderState.sceneReady}, gone-after-scene=${preloaderState.goneAfterScene}, removed-after-scene=${preloaderState.removedAfterScene}, generic-gone=${preloaderState.genericGone}, emergency=${preloaderState.emergency}${preloaderState.emergencyReason ? ` (${preloaderState.emergencyReason})` : ""}`
      : `preloader readiness instrumentation missing at ${preloaderElapsed}ms`,
  );
  await sleep(450);
  await seek(page, "[data-runway-a]", 0);
  await sleep(250);

  const opening = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const width = Math.max(doc.scrollWidth, body?.scrollWidth || 0);
    const canvases = [...document.querySelectorAll("canvas")].map((canvas, index) => {
      const rect = canvas.getBoundingClientRect();
      const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const debug = context?.getExtension("WEBGL_debug_renderer_info");
      const renderer =
        context && debug
          ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))
          : "unreported renderer";
      return {
        index,
        context: canvas.__elevationContextType || "unknown",
        css: `${Math.round(rect.width)}×${Math.round(rect.height)}`,
        backing: `${canvas.width}×${canvas.height}`,
        renderer,
      };
    });
    const offenders = [];
    if (width > innerWidth + 1) {
      for (const element of document.querySelectorAll("body *")) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1)) {
          offenders.push(`${element.tagName.toLowerCase()}.${String(element.className).slice(0, 36)}`);
          if (offenders.length === 3) break;
        }
      }
    }
    return { scrollWidth: width, innerWidth, overflow: Math.max(0, width - innerWidth), canvases, offenders };
  });
  check(
    size.name,
    "no real document-level horizontal scrolling",
    opening.overflow <= 1,
    `scrollWidth ${opening.scrollWidth}px vs innerWidth ${opening.innerWidth}px; overflow ${opening.overflow}px` +
      (opening.offenders.length ? `; offenders ${opening.offenders.join(", ")}` : ""),
  );
  check(
    size.name,
    `opening film has 1–${MAX_CANVASES} instrumented WebGL canvas surfaces`,
    opening.canvases.length > 0 &&
      opening.canvases.length <= MAX_CANVASES &&
      opening.canvases.every((canvas) => /^(webgl2?|experimental-webgl)$/i.test(canvas.context)),
    opening.canvases.length
      ? `${opening.canvases.length} connected canvases: ${opening.canvases.map((c) => `#${c.index} ${c.context} ${c.css}/${c.backing} ${c.renderer}`).join("; ")}`
      : "WebGL instrumentation unavailable: 0 connected canvases",
  );
  const earlyDoorwayRequests = requests.filter((requestUrl) =>
    /\/shop\/opt\/shop-showroom-neon-(?:800|1600)\.webp(?:[?#]|$)/i.test(requestUrl),
  );
  check(
    size.name,
    "shop doorway photograph waits for the shop warm corridor",
    earlyDoorwayRequests.length === 0,
    earlyDoorwayRequests.length
      ? `early request(s): ${[...new Set(earlyDoorwayRequests)].join(", ")}`
      : "0 doorway-poster requests during the opening film",
  );

  if (!size.mobile) {
    const requestedPaths = new Set(
      requests.map((requestUrl) => {
        try {
          return new globalThis.URL(requestUrl).pathname;
        } catch {
          return requestUrl;
        }
      }),
    );
    const editorial = await page.evaluate((nearPx) =>
      [...document.querySelectorAll(".flashlight img")].map((img, index) => {
        const wrapper = img.closest(".flashlight");
        const section = wrapper?.closest("section") || wrapper;
        const rect = section?.getBoundingClientRect();
        const source = img.getAttribute("src");
        return {
          index,
          source,
          path: source ? new URL(source, location.href).pathname : null,
          sectionDistance: rect ? Math.round(rect.top - innerHeight) : null,
          near: !!rect && rect.top <= innerHeight + nearPx && rect.bottom >= -nearPx,
          section: section?.getAttribute("aria-labelledby") || section?.getAttribute("aria-label") || section?.id || section?.tagName || "unknown",
        };
      }),
    EDITORIAL_NEAR_PX);
    const early = editorial.filter(
      (entry) => entry.path && requestedPaths.has(entry.path) && !entry.near,
    );
    if (!editorial.length) {
      check(
        size.name,
        "desktop GL-image wrapper diagnostics are available",
        false,
        "no .flashlight img wrappers registered; early-texture budget cannot be measured",
      );
    } else {
      check(
        size.name,
        "editorial GL-image textures wait until their DOM section is near",
        early.length === 0,
        early.length
          ? `${early.length} early texture(s): ${early.map((entry) => `${entry.path} (${entry.section}, ${entry.sectionDistance}px beyond viewport)`).join("; ")}`
          : `${editorial.length} GL-image wrapper(s), no far-section texture request within the ${EDITORIAL_NEAR_PX}px activation margin`,
      );
    }
    await auditDesktopScroll(page);
  } else {
    await auditMenu(page, size);
  }

  for (const beat of EDGE_BEATS) {
    const location = await seek(page, beat.selector, beat.progress);
    if (!location.ok) {
      check(size.name, `${beat.name} publishes whole-car edge`, false, location.reason);
      continue;
    }
    const reachedExpectedAct = await page
      .waitForFunction(
        (expectedAct) => window.__film?.stage?.act === expectedAct,
        { polling: 50, timeout: 4_000 },
        beat.expectedAct,
      )
      .then(() => true)
      .catch(() => false);
    // A long shader task can complete at the same boundary as Puppeteer's
    // timeout. Sample once more after the polling promise settles so an act
    // that is demonstrably current is not reported as stale.
    const actAtBoundary = await page.evaluate(() => window.__film?.stage?.act ?? null);
    const observedExpectedAct = reachedExpectedAct || actAtBoundary === beat.expectedAct;
    // Preserve the original camera-damping settle after the act identity is
    // correct; identity prevents staleness, settle time keeps the edge honest.
    if (observedExpectedAct) await sleep(1_500);
    const film = await page.evaluate(() => {
      const edge = window.__film?.edge;
      const act = window.__film?.stage?.act;
      return {
        act: Number.isInteger(act) ? Number(act) : null,
        available: Number.isFinite(edge),
        edge: Number.isFinite(edge) ? Number(edge) : null,
      };
    });
    const actMatches = observedExpectedAct && film.act === beat.expectedAct;
    check(
      size.name,
      `${beat.name} publishes expected act index ${beat.expectedAct}`,
      actMatches,
      `expected act ${beat.expectedAct}; measured ${film.act ?? "missing"} at y=${location.y}px`,
    );
    if (!actMatches) continue;
    check(
      size.name,
      `${beat.name} whole-car edge <=${MAX_CAR_EDGE}`,
      film.available && film.edge <= MAX_CAR_EDGE,
      film.available
        ? `edge ${film.edge.toFixed(3)} at y=${location.y}px; threshold ${MAX_CAR_EDGE}`
        : `window.__film.edge missing or non-finite at y=${location.y}px`,
    );
    const exhaustedEffects = await page.evaluate(() => {
      const scene = window.__film?.three?.scene;
      if (!scene) return null;
      const effectivelyVisible = (object) => {
        for (let cursor = object; cursor; cursor = cursor.parent) {
          if (!cursor.visible) return false;
          if (cursor === scene) break;
        }
        return true;
      };
      let visibleGhostMeshes = 0;
      let visibleClouds = 0;
      scene.traverse((object) => {
        if (!effectivelyVisible(object)) return;
        if (object.isPoints && object.material?.isShaderMaterial) visibleClouds += 1;
        if (!object.isMesh) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (materials.some((material) => material?.isShaderMaterial && material.wireframe)) {
          visibleGhostMeshes += 1;
        }
      });
      return { visibleGhostMeshes, visibleClouds };
    });
    check(
      size.name,
      `${beat.name} parks exhausted lattice and particle submissions`,
      exhaustedEffects !== null &&
        !exhaustedEffects.error &&
        exhaustedEffects.visibleGhostMeshes === 0 &&
        exhaustedEffects.visibleClouds === 0,
      exhaustedEffects
        ? exhaustedEffects.error ||
          `${exhaustedEffects.visibleGhostMeshes} visible ghost mesh(es); ${exhaustedEffects.visibleClouds} visible cloud(s)`
        : "window.__film.three diagnostics missing",
    );
  }

  const webgl = await page.evaluate(() => {
    const errors = Array.isArray(window.__elevationWebGLErrors)
      ? [...window.__elevationWebGLErrors]
      : ["WebGL instrumentation missing"];
    for (const [index, canvas] of [...document.querySelectorAll("canvas")].entries()) {
      const type = canvas.__elevationContextType;
      if (!type) continue;
      try {
        const context = canvas.getContext(type);
        if (!context) errors.push(`canvas #${index} ${type} context unavailable`);
        else if (context.isContextLost()) errors.push(`canvas #${index} ${type} context lost`);
        else {
          const code = context.getError();
          if (code !== context.NO_ERROR) errors.push(`canvas #${index} ${type} getError=${code}`);
        }
      } catch (error) {
        errors.push(`canvas #${index} ${type} inspection failed: ${error.message}`);
      }
    }
    return errors;
  });
  const runtimeErrors = [...new Set([...pageErrors, ...consoleErrors, ...webgl])];
  check(
    size.name,
    "no page, console, or WebGL errors",
    runtimeErrors.length === 0,
    runtimeErrors.length ? `${runtimeErrors.length} error(s): ${runtimeErrors.slice(0, 5).join(" | ")}` : "0 errors",
  );

  await page.close();
}

let browser;
try {
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 240_000,
    args: [
      "--window-position=40,40",
      "--window-size=1600,1100",
      "--disable-backgrounding-occluded-windows",
      "--disable-features=CalculateNativeWinOcclusion",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--mute-audio",
      "--no-first-run",
    ],
  });
  if (FOCUS !== "shop" && !FOCUS.startsWith("phone")) await auditHeroBoot(browser);
  if (FOCUS !== "boot") {
    const sizes =
      FOCUS === "desktop" || FOCUS === "shop"
        ? SIZES.slice(0, 1)
        : FOCUS === "mobile"
          ? SIZES.filter((size) => size.mobile)
          : FOCUS.startsWith("phone")
            ? SIZES.filter((size) => size.name.toLowerCase() === FOCUS)
          : SIZES;
    for (const size of sizes) {
      let browserContext;
      try {
        browserContext = await browser.createBrowserContext();
        await auditSize(browserContext, size);
      } catch (error) {
        const message = `${size.name} · audit execution — ${error.stack || error.message}`;
        failures.push(message);
        console.error(`FAIL ${message}`);
      } finally {
        await browserContext?.close().catch(() => {});
      }
    }
  }
} catch (error) {
  failures.push(`browser launch · ${error.stack || error.message}`);
} finally {
  await browser?.close().catch(() => {});
}

if (failures.length) {
  console.error(`\nELEVATION AUDIT RED — ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nELEVATION AUDIT GREEN — all measured budgets passed");
}
