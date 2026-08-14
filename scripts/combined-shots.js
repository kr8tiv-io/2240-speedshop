/**
 * Combined-page verification: the split film (Acts I–II), the shop
 * walk-through between the reels, the Act III finale, the DOM sections, and
 * the Journal — captured at desktop and two phone widths, with console and
 * page errors collected rather than assumed absent.
 *
 *   node scripts/combined-shots.js                        # dev on :3213
 *   BASE_URL=https://... node scripts/combined-shots.js   # deployed site
 *
 * Chrome runs HEADFUL (off-screen) — headless falls back to SwiftShader and
 * this scene takes seconds per frame there. Every programmatic scroll goes
 * through Lenis when present (window.__lenis2240): a raw scrollTo leaves its
 * internal position stale and the page lurches back on the next frame.
 */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const OUT = path.join(__dirname, "..", process.env.SHOT_DIR || "shots-combined");
const LABEL = process.env.SHOT_LABEL || "combined";

const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 2, mobile: true },
];

/** [label, runway ("a"|"wt"|"c"), progress through that runway] */
const RUNWAY_BEATS = [
  ["00-title", "a", 0.004],
  ["01-act1-grid", "a", 0.1],
  ["02-act1-turntable", "a", 0.3],
  ["03-interlude-01", "a", 0.5],
  ["04-act2-grid", "a", 0.62],
  ["05-act2-copy", "a", 0.8],
  ["06-interlude-02", "a", 0.95],
  ["07-wt-doorway", "wt", 0.03],
  ["08-wt-early", "wt", 0.18],
  ["09-wt-mid", "wt", 0.42],
  ["10-wt-dyno", "wt", 0.62],
  ["11-wt-late", "wt", 0.83],
  ["12-wt-door-out", "wt", 0.97],
  ["13-act3-grid", "c", 0.28],
  ["14-act3-copy", "c", 0.62],
  ["15-act3-close", "c", 0.97],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 240000,
    args: [
      "--window-position=-2400,0",
      "--window-size=1600,1100",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--mute-audio",
      "--no-first-run",
    ],
  });

  const problems = [];
  try {
    for (const size of SIZES) {
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`console: ${m.text()}`);
      });
      await page.setViewport({
        width: size.width,
        height: size.height,
        deviceScaleFactor: size.dsf,
        isMobile: !!size.mobile,
        hasTouch: !!size.mobile,
      });

      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120000 });
      // Let the preloader hand off (it gates on shader compilation).
      await page
        .waitForFunction(
          () => !document.querySelector("[data-preloader]") ||
            getComputedStyle(document.querySelector("[data-preloader]")).opacity === "0" ||
            document.querySelector("[data-preloader]")?.getAttribute("data-done") != null,
          { timeout: 30000 },
        )
        .catch(() => {});
      await sleep(4000);

      const metrics = await page.evaluate(() => {
        const el = (sel) => document.querySelector(sel);
        const rect = (n) => {
          if (!n) return null;
          const r = n.getBoundingClientRect();
          return { top: r.top + window.scrollY, height: r.height };
        };
        return {
          overflow:
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
          doc: document.documentElement.scrollHeight,
          a: rect(el("[data-runway-a]")),
          wt: rect(el("#walkthrough-runway")),
          c: rect(el("[data-runway-c]")),
        };
      });
      if (metrics.overflow > 0)
        problems.push(`${size.name}: HORIZONTAL OVERFLOW ${metrics.overflow}px`);
      if (!metrics.a || !metrics.wt || !metrics.c)
        problems.push(
          `${size.name}: missing runway (a=${!!metrics.a} wt=${!!metrics.wt} c=${!!metrics.c})`,
        );

      for (const [label, runway, p] of RUNWAY_BEATS) {
        const r = metrics[runway];
        if (!r) continue;
        const y = Math.max(0, r.top + p * Math.max(1, r.height - size.height));
        await page.evaluate((yy) => {
          const lenis = window.__lenis2240;
          if (lenis) lenis.scrollTo(yy, { immediate: true, force: true });
          window.scrollTo(0, yy);
        }, y);
        // Damped camera + reveals need real time to settle.
        await sleep(label.includes("wt") ? 2600 : 2000);
        await page.screenshot({
          path: path.join(OUT, `${LABEL}-${size.name}-${label}.png`),
        });
      }

      // DOM sections + the journal.
      for (const [label, sel] of [
        ["16-entity", "[aria-labelledby='entity-heading']"],
        ["17-services", "[aria-labelledby='services-heading']"],
        ["18-reviews", "[aria-labelledby='reviews-heading']"],
        ["19-cta", "[aria-labelledby='cta-heading']"],
      ]) {
        const ok = await page.evaluate((s) => {
          const n = document.querySelector(s);
          if (!n) return false;
          const y = n.getBoundingClientRect().top + window.scrollY - 80;
          const lenis = window.__lenis2240;
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
          window.scrollTo(0, y);
          return true;
        }, sel);
        if (!ok) {
          problems.push(`${size.name}: section ${sel} missing`);
          continue;
        }
        await sleep(1200);
        await page.screenshot({ path: path.join(OUT, `${LABEL}-${size.name}-${label}.png`) });
      }

      for (const [label, url] of [
        ["20-journal", "/blog/"],
        ["21-article", "/blog/what-is-a-restomod/"],
      ]) {
        await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded", timeout: 90000 });
        await sleep(1500);
        await page.screenshot({
          path: path.join(OUT, `${LABEL}-${size.name}-${label}.png`),
        });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
        await sleep(900);
        await page.screenshot({
          path: path.join(OUT, `${LABEL}-${size.name}-${label}-body.png`),
        });
      }

      const uniq = [...new Set(errors)];
      if (uniq.length) problems.push(`${size.name}: ${uniq.length} errors — ${uniq.slice(0, 6).join(" | ")}`);
      await page.close();
      console.log(`${size.name}: done (${uniq.length} unique errors)`);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(OUT, "problems.json"), JSON.stringify(problems, null, 2));
  console.log(problems.length ? `PROBLEMS:\n${problems.join("\n")}` : "CLEAN");
})();
