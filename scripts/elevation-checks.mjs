/**
 * Falsifiable launch budgets for the combined 3D homepage.
 *
 * Chrome is deliberately headful and parked off-screen. Headless Chrome uses
 * SwiftShader on this machine, which turns a GPU frame-pacing audit into a CPU
 * emulation benchmark. Programmatic scrolling always goes through the page's
 * Lenis instance when it exists.
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
const URL = `${BASE}/?tune=1`;

const PRELOADER_BUDGET_MS = 12_000;
const PRELOADER_EMERGENCY_MS = 20_000;
const EDITORIAL_NEAR_PX = 280;
const MAX_CANVASES = 2;
const MAX_CAR_EDGE = 1;
const MAX_RAF_GAP_MS = 250;

const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone375", width: 375, height: 667, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "phone430", width: 430, height: 932, dsf: 3, mobile: true },
];

const EDGE_BEATS = [
  { name: "act-I", selector: "[data-runway-a]", progress: 0.3 },
  { name: "act-II", selector: "[data-runway-a]", progress: 0.8 },
  { name: "act-III", selector: "[data-runway-c]", progress: 0.62 },
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
    layer.isolation === "isolate";
  check(
    size.name,
    "mobile menu is a viewport-covering opaque isolated layer",
    isolatedOpaque,
    layer
      ? `rect ${layer.rect.left.toFixed(0)},${layer.rect.top.toFixed(0)}→${layer.rect.right.toFixed(0)},${layer.rect.bottom.toFixed(0)} ` +
          `vs ${layer.viewport.width}×${layer.viewport.height}; bg ${layer.background} (alpha ${alpha}); isolation ${layer.isolation}`
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

  await page.click('button[aria-controls="mobile-nav"]').catch(() => {});
  await sleep(350);
}

async function auditDesktopScroll(page) {
  await seek(page, "[data-runway-a]", 0);
  await sleep(300);
  await page.evaluate(() => {
    window.__elevationRaf = { active: true, gaps: [], last: null };
    const tick = (now) => {
      const sample = window.__elevationRaf;
      if (!sample?.active) return;
      if (sample.last !== null) sample.gaps.push(now - sample.last);
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

  const gaps = await page.evaluate(() => {
    const sample = window.__elevationRaf;
    if (!sample || !Array.isArray(sample.gaps)) return null;
    sample.active = false;
    return sample.gaps.filter((gap) => Number.isFinite(gap) && gap >= 0);
  });
  const worst = gaps?.length ? Math.max(...gaps) : null;
  const p95 = gaps ? percentile(gaps, 0.95) : null;
  check(
    "desktop",
    "controlled 0→7200 scroll worst rAF gap <=250ms",
    worst !== null && worst <= MAX_RAF_GAP_MS,
    worst === null
      ? "rAF sampler produced no finite samples"
      : `worst ${worst.toFixed(1)}ms; p95 ${p95.toFixed(1)}ms; ${gaps.length} frames; budget ${MAX_RAF_GAP_MS}ms`,
  );
}

async function auditSize(browser, size) {
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const requests = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    const text = message.text();
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
        const veil = document.querySelector(".preloader-veil, [data-preloader]");
        if (!veil) return true;
        const style = getComputedStyle(veil);
        return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.01;
      },
      { timeout: budgetRemaining },
    )
    .then(() => true)
    .catch(() => false);
  const preloaderElapsed = Date.now() - navigationStarted;
  check(
    size.name,
    `preloader clears within ${PRELOADER_BUDGET_MS}ms non-emergency window`,
    preloaderReady && preloaderElapsed <= PRELOADER_BUDGET_MS + 50,
    preloaderReady
      ? `cleared after ${preloaderElapsed}ms`
      : `still visible at ${preloaderElapsed}ms; emergency paths are intentionally not the readiness budget`,
  );
  if (!preloaderReady) {
    const remaining = Math.max(1, PRELOADER_EMERGENCY_MS - preloaderElapsed);
    await page
      .waitForFunction(
        () => {
          const veil = document.querySelector(".preloader-veil, [data-preloader]");
          if (!veil) return true;
          const style = getComputedStyle(veil);
          return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.01;
        },
        { timeout: remaining },
      )
      .catch(() => {});
  }
  await sleep(450);
  await seek(page, "[data-runway-a]", 0);
  await sleep(250);

  const opening = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const width = Math.max(doc.scrollWidth, body?.scrollWidth || 0);
    const canvases = [...document.querySelectorAll("canvas")].map((canvas, index) => {
      const rect = canvas.getBoundingClientRect();
      return {
        index,
        context: canvas.__elevationContextType || "unknown",
        css: `${Math.round(rect.width)}×${Math.round(rect.height)}`,
        backing: `${canvas.width}×${canvas.height}`,
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
      ? `${opening.canvases.length} connected canvases: ${opening.canvases.map((c) => `#${c.index} ${c.context} ${c.css}/${c.backing}`).join("; ")}`
      : "WebGL instrumentation unavailable: 0 connected canvases",
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
    await sleep(1_500);
    const film = await page.evaluate(() => {
      const edge = window.__film?.edge;
      return Number.isFinite(edge)
        ? { available: true, edge: Number(edge) }
        : { available: false, reason: "window.__film.edge missing or non-finite" };
    });
    check(
      size.name,
      `${beat.name} whole-car edge <=${MAX_CAR_EDGE}`,
      film.available && film.edge <= MAX_CAR_EDGE,
      film.available
        ? `edge ${film.edge.toFixed(3)} at y=${location.y}px; threshold ${MAX_CAR_EDGE}`
        : `${film.reason} at y=${location.y}px`,
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
      "--window-position=-2400,0",
      "--window-size=1600,1100",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--mute-audio",
      "--no-first-run",
    ],
  });
  for (const size of SIZES) {
    try {
      await auditSize(browser, size);
    } catch (error) {
      const message = `${size.name} · audit execution — ${error.stack || error.message}`;
      failures.push(message);
      console.error(`FAIL ${message}`);
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
