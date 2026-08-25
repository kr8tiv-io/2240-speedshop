/**
 * Combined-page verification: the split film (Acts I–II), the shop
 * walk-through between the reels, the Act III finale, the DOM sections, and
 * the Journal — captured at desktop and four phone widths, with console and
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
const sharp = require("sharp");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const OUT = path.join(__dirname, "..", process.env.SHOT_DIR || "shots-combined");
const LABEL = process.env.SHOT_LABEL || "combined";
const FOCUS = (process.env.SHOT_FOCUS || "").trim().toLowerCase();
const SCOPE = (process.env.SHOT_SCOPE || "all").trim().toLowerCase();

const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone375", width: 375, height: 667, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 2, mobile: true },
  { name: "phone430", width: 430, height: 932, dsf: 3, mobile: true },
].filter((size) => !FOCUS || size.name.toLowerCase() === FOCUS);

/** [label, runway ("a"|"wt"|"c"), progress through that runway] */
const RUNWAY_BEATS = [
  ["00-title", "a", 0.004],
  ["01-act1-grid", "a", 0.1],
  ["02-act1-turntable", "a", 0.3],
  ["02a-act1-dark-handoff", "a", 0.445],
  ["03-interlude-01", "a", 0.5],
  ["03a-act2-dark-handoff", "a", 0.555],
  ["04-act2-grid", "a", 0.62],
  ["05-act2-copy", "a", 0.8],
  ["06-interlude-02", "a", 0.95],
  ["06a-film-shop-handoff", "a", 0.995],
  ["07-wt-doorway", "wt", 0.03],
  ["08-wt-early", "wt", 0.18],
  ["09-wt-mid", "wt", 0.42],
  ["10-wt-dyno", "wt", 0.62],
  ["11-wt-late", "wt", 0.83],
  ["12-wt-door-out", "wt", 0.97],
  ["12a-shop-film-handoff", "c", 0.005],
  ["13-act3-grid", "c", 0.28],
  ["14-act3-copy", "c", 0.62],
  ["15-act3-close", "c", 0.97],
].filter(([, runway]) => SCOPE !== "shop" || runway === "wt");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 240000,
    args: [
      "--window-position=40,40",
      "--window-size=1600,1100",
      "--disable-features=CalculateNativeWinOcclusion",
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
        if (SCOPE === "shop" && m.text().startsWith("[shop]")) console.log(`TRACE ${m.text()}`);
        if (m.type() === "error") errors.push(`console: ${m.text()}`);
      });
      await page.setViewport({
        width: size.width,
        height: size.height,
        deviceScaleFactor: size.dsf,
        isMobile: !!size.mobile,
        hasTouch: !!size.mobile,
      });

      await page.goto(`${BASE.replace(/\/+$/, "")}/?tune=1${SCOPE === "shop" ? "&perf=1" : ""}`, { waitUntil: "domcontentloaded", timeout: 120000 });
      if (SCOPE === "shop") {
        await page.evaluate(() => {
          const timer = window.setInterval(() => {
            const passes = window.__shop?.composer?.current?.passes;
            if (!Array.isArray(passes) || passes.length < 2) return;
            window.clearInterval(timer);
            console.log(
              `[shop] composer passes ${passes.map((pass) =>
                JSON.stringify({
                  name: pass?.name,
                  type: pass?.constructor?.name,
                  needsSwap: pass?.needsSwap,
                  needsDepthBlit: pass?.needsDepthBlit,
                  clearPass: Boolean(pass?.clearPass),
                  effects: Array.isArray(pass?.effects)
                    ? pass.effects.map((effect) => effect?.name || effect?.constructor?.name)
                    : [],
                }),
              ).join(" | ")}`,
            );
            for (const pass of passes) {
              if (!pass || typeof pass.render !== "function" || pass.__timedByAudit) continue;
              const render = pass.render;
              let calls = 0;
              pass.render = function (...args) {
                const started = performance.now();
                try {
                  return render.apply(this, args);
                } finally {
                  calls += 1;
                  const cost = performance.now() - started;
                  if (calls <= 2 || cost > 120) {
                    console.log(
                      `[shop] pass ${pass.constructor?.name || "Pass"} #${calls} ${Math.round(cost)} ms`,
                    );
                  }
                }
              };
              pass.__timedByAudit = true;
            }
          }, 40);
        });
      }
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
          overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
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
        if (SCOPE === "shop" && runway === "wt") {
          // A shop-only visual run is judging the world, not the compile-safe
          // photograph in front of it. Wait for the real world to complete its
          // own 1600 ms dissolve before capturing the first station.
          const ready = await page
            .waitForFunction(
              () => {
                const host = document.querySelector("[data-shop-ready]");
                const world = document.querySelector("[data-shop-world]");
                return host?.getAttribute("data-shop-ready") === "world" &&
                  world && Number.parseFloat(getComputedStyle(world).opacity) > 0.98;
              },
              { timeout: 75_000 },
            )
            .then(() => true)
            .catch(() => false);
          if (!ready) {
            problems.push(`${size.name}: ${label} SHOP WORLD NEVER BECAME GENUINELY READY`);
          }
          await sleep(2_000);
        } else {
          await sleep(label.includes("wt") ? 2600 : 2000);
        }
        const edge = await page.evaluate(() => {
          const value = window.__film?.edge;
          return Number.isFinite(value) ? Number(value) : null;
        });
        const filmBeat = runway === "a" || runway === "c";
        if (filmBeat && edge === null) {
          problems.push(`${size.name}: ${label} WHOLE-CAR EDGE MISSING/NON-FINITE`);
        } else if (filmBeat && edge > 1) {
          problems.push(`${size.name}: ${label} WHOLE-CAR EDGE ${edge.toFixed(3)} > 1`);
        }
        console.log(
          `${size.name}: ${label} edge=${edge === null ? "n/a" : edge.toFixed(3)}` +
            (filmBeat ? "" : " (shop beat; optional)"),
        );
        if (SCOPE === "shop" && runway === "wt") {
          const shop = await page.evaluate(() => {
            const runtime = window.__shop;
            const scene = runtime?.scene;
            const camera = runtime?.camera;
            if (!scene || !camera) return null;
            const rail = Number(camera.userData?.rail?.t);
            const station = Number.isFinite(rail) ? Math.max(0, Math.min(6, Math.round(rail * 6))) : null;
            const bays = [];
            scene.traverse((object) => {
              const match = /^bay-(\d+)$/.exec(object.name || "");
              if (!match) return;
              let renderables = 0;
              let visible = 0;
              object.traverse((child) => {
                if (!(child.isMesh || child.isPoints || child.isLine)) return;
                renderables++;
                let shown = child.visible;
                let parent = child.parent;
                while (shown && parent) {
                  shown = parent.visible;
                  parent = parent.parent;
                }
                if (shown) visible++;
              });
              bays.push({ station: Number(match[1]), renderables, visible });
            });
            return { station, bays };
          });
          if (!shop) {
            problems.push(`${size.name}: ${label} SHOP RUNTIME DIAGNOSTICS MISSING`);
          } else {
            const nearest = shop.bays.filter((bay) => bay.station === shop.station);
            const visible = nearest.reduce((sum, bay) => sum + bay.visible, 0);
            const renderables = nearest.reduce((sum, bay) => sum + bay.renderables, 0);
            console.log(`${size.name}: ${label} station=${shop.station} visible=${visible}/${renderables}`);
            if (!nearest.length || renderables === 0 || visible === 0) {
              problems.push(
                `${size.name}: ${label} EMPTY CURRENT BAY station=${shop.station} visible=${visible}/${renderables}`,
              );
            }
          }
        }
        const shotPath = path.join(OUT, `${LABEL}-${size.name}-${label}.png`);
        const screenshot = await page.screenshot({ path: shotPath });
        if (SCOPE === "shop" && runway === "wt") {
          const left = Math.round(size.width * 0.38 * size.dsf);
          const top = Math.round(size.height * 0.14 * size.dsf);
          const width = Math.max(1, Math.round(size.width * 0.42 * size.dsf));
          const height = Math.max(1, Math.round(size.height * 0.68 * size.dsf));
          const stats = await sharp(screenshot)
            .extract({ left, top, width, height })
            .removeAlpha()
            .stats();
          const mean = stats.channels.reduce((sum, channel) => sum + channel.mean, 0) / 3;
          const deviation =
            stats.channels.reduce((sum, channel) => sum + channel.stdev, 0) / 3;
          console.log(
            `${size.name}: ${label} visual mean=${mean.toFixed(1)} stdev=${deviation.toFixed(1)}`,
          );
          if (mean > 220 && deviation < 24) {
            problems.push(
              `${size.name}: ${label} WHITE/UNINITIALIZED COMPOSER mean=${mean.toFixed(1)} stdev=${deviation.toFixed(1)}`,
            );
          }
        }
      }

      if (size.mobile && SCOPE !== "shop") {
        await page.evaluate(() => {
          const lenis = window.__lenis2240;
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
          else window.scrollTo(0, 0);
        });
        await sleep(500);
        const trigger = await page.$('button[aria-controls="mobile-nav"]');
        if (!trigger) {
          problems.push(`${size.name}: mobile menu trigger missing`);
        } else {
          await trigger.click();
          await sleep(450);
          const open = await page.evaluate(
            () => document.querySelector('button[aria-controls="mobile-nav"]')?.getAttribute("aria-expanded") === "true",
          );
          if (!open) problems.push(`${size.name}: mobile menu did not open for capture`);
          await page.screenshot({
            path: path.join(OUT, `${LABEL}-${size.name}-mobile-menu-open.png`),
          });
          await trigger.click().catch(() => {});
          await sleep(350);
        }
      }

      // DOM sections + the journal.
      for (const [label, sel] of SCOPE === "shop" ? [] : [
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

      for (const [label, url] of SCOPE === "shop" ? [] : [
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
