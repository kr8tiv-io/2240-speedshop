import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = (process.env.BASE_URL || "https://steelblue-gaur-917651.hostingersite.com").replace(
  /\/+$/,
  "",
);
const OUT = path.resolve(process.env.CWV_SHOT_DIR || "output/playwright/cwv");

const profiles = [
  { name: "desktop-live", width: 1440, height: 900, dsf: 1 },
  {
    name: "iphone-390-fast4g",
    width: 390,
    height: 844,
    dsf: 3,
    mobile: true,
    cpu: 4,
    network: {
      latency: 80,
      downloadThroughput: (5 * 1024 * 1024) / 8,
      uploadThroughput: (1.5 * 1024 * 1024) / 8,
    },
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 180_000,
  args: [
    "--window-position=-2400,0",
    "--window-size=1600,1100",
    "--disable-features=CalculateNativeWinOcclusion",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--no-first-run",
  ],
});

try {
  await fs.mkdir(OUT, { recursive: true });
  for (const profile of profiles) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({
      width: profile.width,
      height: profile.height,
      deviceScaleFactor: profile.dsf,
      isMobile: !!profile.mobile,
      hasTouch: !!profile.mobile,
    });

    const session = await page.createCDPSession();
    if (profile.network) {
      await session.send("Network.enable");
      await session.send("Network.emulateNetworkConditions", {
        offline: false,
        connectionType: "cellular4g",
        ...profile.network,
      });
    }
    if (profile.cpu) {
      await session.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
    }

    await page.evaluateOnNewDocument(() => {
      window.__cwvAudit = {
        cls: 0,
        lcp: null,
        lcpElement: null,
        longTasks: [],
        events: [],
      };
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__cwvAudit.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch {}
      try {
        new PerformanceObserver((list) => {
          const entry = list.getEntries().at(-1);
          if (!entry) return;
          window.__cwvAudit.lcp = entry.startTime;
          const element = entry.element;
          window.__cwvAudit.lcpElement = element
            ? `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
                element.className && typeof element.className === "string"
                  ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}`
                  : ""
              }`
            : null;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch {}
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__cwvAudit.longTasks.push({
              start: Math.round(entry.startTime),
              duration: Math.round(entry.duration),
            });
          }
        }).observe({ type: "longtask", buffered: true });
      } catch {}
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.interactionId) continue;
            window.__cwvAudit.events.push({
              name: entry.name,
              duration: entry.duration,
              interactionId: entry.interactionId,
            });
          }
        }).observe({ type: "event", buffered: true, durationThreshold: 16 });
      } catch {}
    });

    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForFunction(
      () => {
        const loader = document.querySelector("[data-preloader]");
        return !loader || getComputedStyle(loader).visibility === "hidden" || getComputedStyle(loader).opacity === "0";
      },
      { polling: 50, timeout: 10_000 },
    );
    // A human cannot tap before the first painted frame. Starting the host
    // timer at CSS visibility alone over-counts time where no pixels exist.
    await page.waitForFunction(
      () => performance.getEntriesByName("first-contentful-paint").length > 0,
      { polling: 50, timeout: 10_000 },
    );

    const mobileTrigger = profile.mobile
      ? await page.$eval('[aria-controls="mobile-nav"]', (element) => {
          const rect = element.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })
      : null;
    const interactionStarted = Date.now();
    if (profile.mobile) {
      await session.send("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: mobileTrigger.x,
        y: mobileTrigger.y,
        button: "left",
        clickCount: 1,
      });
      await session.send("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: mobileTrigger.x,
        y: mobileTrigger.y,
        button: "left",
        clickCount: 1,
      });
      await page.waitForFunction(
        () => {
          const trigger = document.querySelector('[aria-controls="mobile-nav"]');
          return trigger?.closest("details")?.open || trigger?.getAttribute("aria-expanded") === "true";
        },
        { timeout: 10_000 },
      );
    } else {
      await page.hover('a[href="/services/"]');
    }
    const interactionMs = Date.now() - interactionStarted;
    if (profile.mobile) {
      await page.screenshot({
        path: path.join(OUT, `${profile.name}-menu.png`),
        captureBeyondViewport: false,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 6_000));
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const paints = Object.fromEntries(
        performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime]),
      );
      const resources = performance.getEntriesByType("resource");
      const longTasks = window.__cwvAudit.longTasks;
      const events = window.__cwvAudit.events;
      return {
        ttfb: navigation?.responseStart ?? null,
        domContentLoaded: navigation?.domContentLoadedEventEnd ?? null,
        load: navigation?.loadEventEnd ?? null,
        fcp: paints["first-contentful-paint"] ?? null,
        lcp: window.__cwvAudit.lcp,
        lcpElement: window.__cwvAudit.lcpElement,
        cls: window.__cwvAudit.cls,
        longTaskCount: longTasks.length,
        longTaskTotal: longTasks.reduce((sum, task) => sum + task.duration, 0),
        longestTask: Math.max(0, ...longTasks.map((task) => task.duration)),
        longTasks,
        inp: Math.max(0, ...events.map((event) => event.duration)),
        interactionEvents: events,
        transferKb: Math.round(
          resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0) / 1024,
        ),
        requests: resources.length,
        heroState: document.querySelector("[data-hero-runtime]")?.getAttribute("data-hero-runtime") || null,
        menu: (() => {
          const panel = document.getElementById("mobile-nav");
          const rect = panel?.getBoundingClientRect();
          return panel && rect
            ? {
                open: Boolean(panel.closest("details")?.open),
                width: rect.width,
                height: rect.height,
                viewportWidth: innerWidth,
                viewportHeight: innerHeight,
                background: getComputedStyle(panel).backgroundColor,
                bodyPosition: getComputedStyle(document.body).position,
                shellInert: document.getElementById("site-shell")?.inert ?? false,
              }
            : null;
        })(),
      };
    });

    console.log(
      JSON.stringify(
        {
          profile: profile.name,
          interactionMs,
          ...Object.fromEntries(
            Object.entries(metrics).map(([key, value]) => [
              key,
              typeof value === "number" ? Math.round(value * 100) / 100 : value,
            ]),
          ),
        },
        null,
        2,
      ),
    );
    assert.ok(metrics.cls <= 0.1, `${profile.name}: CLS is ${metrics.cls}`);
    if (profile.mobile) {
      assert.ok(metrics.inp > 0, `${profile.name}: Event Timing did not record the test interaction`);
      assert.ok(
        metrics.inp <= 200,
        `${profile.name}: measured interaction-to-next-paint was ${metrics.inp} ms`,
      );
      assert.ok(metrics.menu?.open, `${profile.name}: native disclosure closed unexpectedly`);
      assert.ok(
        metrics.menu.width >= metrics.menu.viewportWidth &&
          metrics.menu.height >= metrics.menu.viewportHeight,
        `${profile.name}: mobile panel does not cover the viewport`,
      );
      assert.equal(metrics.menu.bodyPosition, "fixed", `${profile.name}: iOS body lock is missing`);
      assert.equal(metrics.menu.shellInert, true, `${profile.name}: underlying page is not inert`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
