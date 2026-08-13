/**
 * Film verification: scrub the three-act hero and capture every beat that
 * matters, at desktop and at a real phone width.
 *
 *   node scripts/film-shots.js                        # local dev on :3112
 *   BASE_URL=https://... node scripts/film-shots.js   # the deployed site
 *
 * What this asserts, beyond "here is a screenshot":
 *
 *   1. HORIZONTAL OVERFLOW — documentElement.scrollWidth vs clientWidth.
 *   2. FRAMING — the page projects the live car's eight box corners and
 *      publishes the largest |NDC| as `edge`. Below 1 the whole car is in
 *      frame; above 1 it is cropped. This replaced a pixel-counting version
 *      that measured the lit floor and cheerfully reported the subject filled
 *      90% of every frame — an assertion that cannot fail is not an assertion.
 *   3. STATE — window.__film is read at every beat, so the act index, the
 *      reveal amount, the camera distance and the draw cost are checked
 *      rather than assumed.
 *   4. ERRORS — a silent pageerror leaves a half-rendered film that still
 *      screenshots fine.
 *
 * Two hard-won environment notes. Chrome runs HEADFUL (off-screen) because
 * headless falls back to SwiftShader, where this scene takes seconds per
 * frame and screenshots time out. And EVERY programmatic scroll goes through
 * Lenis (window.__lenis2240): a raw window.scrollTo leaves its internal
 * position stale and the page lurches back on the next frame.
 */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3112";
const OUT = path.join(__dirname, "..", process.env.SHOT_DIR || "shots");
const LABEL = process.env.SHOT_LABEL || "dark";

/** Progress through the FILM runway (not the page) worth a frame. */
/* Each act runs 0→1 locally: grid reveal 0.10–0.26, camera 0.22–0.80, dissolve
   0.78–0.90, then the WRITTEN INTERLUDE owns the empty stage from ~0.88 of one
   act to ~0.10 of the next. Film progress = (act + local) / 3. */
const BEATS = [
  ["00-title", 0.005],
  ["01-act1-grid", 0.057],
  ["02-act1-copy", 0.15],
  ["03-interlude-01", 0.317],
  ["04-act2-grid", 0.39],
  ["05-act2-copy", 0.507],
  ["06-interlude-02", 0.65],
  ["07-act3-grid", 0.723],
  ["08-act3-copy", 0.85],
  ["09-act3-close", 0.99],
];

/**
 * Every width a phone actually is. The 320 is the one that gets skipped and
 * the one that breaks: an iPhone SE 1 / 5s is 320 CSS px, and after the 20 px
 * gutters that leaves 280 px for a condensed display face set in vw units.
 * 430 is the other end (14/15 Pro Max) — cheap to check, and it catches copy
 * that was only ever tuned at 390.
 */
const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone375", width: 375, height: 667, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "phone430", width: 430, height: 932, dsf: 3, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 180000,
    args: [
      "--window-position=-2400,0",
      "--window-size=1600,1100",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--no-sandbox",
    ],
  });
  const problems = [];
  let failures = 0;

  for (const size of SIZES) {
    const page = await browser.newPage();
    page.on("pageerror", (e) => problems.push(`${size.name}: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`${size.name}: ${m.text().slice(0, 200)}`);
    });
    await page.setViewport({
      width: size.width,
      height: size.height,
      deviceScaleFactor: size.dsf,
      isMobile: !!size.mobile,
      hasTouch: !!size.mobile,
    });

    // domcontentloaded, not networkidle0: a dev server's HMR socket never
    // goes idle, and the preloader wait below is the real readiness signal.
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120000 });
    // The preloader owns the scroll lock until it lifts — scrolling under it
    // does nothing, which is a great way to screenshot ten identical frames.
    await page
      .waitForFunction(() => !document.querySelector(".preloader-veil"), { timeout: 40000 })
      .catch(() => problems.push(`${size.name}: preloader never lifted`));
    await sleep(1200);

    const seek = (progress) =>
      page.evaluate((p) => {
        const film = document.querySelector("[data-film]");
        const top = film.getBoundingClientRect().top + window.scrollY;
        const y = top + (film.offsetHeight - window.innerHeight) * p;
        if (window.__lenis2240) window.__lenis2240.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      }, progress);

    for (const [name, p] of BEATS) {
      await seek(p);
      // The scrubbed timeline has a 1 s ease and the first seeks after load
      // also pay for shader compilation — settle generously or the frame is
      // captured mid-catch-up and every assertion is measured on the wrong
      // beat.
      await sleep(2600);

      const shot = await page.screenshot({ fullPage: false });
      fs.writeFileSync(path.join(OUT, `${LABEL}-${size.name}-${name}.png`), shot);

      const dom = await page.evaluate(() => {
        const doc = document.documentElement;
        const f = window.__film;
        /* THE TEST, third attempt, and this one is passive on purpose.
           v1 compared scrollWidth to clientWidth: fires on the 15px scrollbar
           whenever any 100vw box exists, so it cried wolf on every desktop
           beat. v2 wrote documentElement.scrollLeft and checked whether it
           moved: Lenis ALSO writes scroll positions on that element, so
           straight after a programmatic seek the value reads back non-zero
           and it cried wolf again — measuring the smooth-scroll library's
           bookkeeping rather than the layout.
           v3 touches nothing: compare scrollWidth against innerWidth, which
           INCLUDES the scrollbar, so a 100vw element is not overflow and a
           genuine spill still is. Verified by hand against the live page:
           scrollWidth 1425, innerWidth 1440, neither html nor body able to
           scroll sideways. */
        const overflow = Math.max(0, doc.scrollWidth - window.innerWidth);

        const blame = [];
        if (overflow > 1) {
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== "fixed") {
              blame.push(`${el.tagName}.${String(el.className).slice(0, 40)}@${Math.round(r.right)}`);
              if (blame.length > 2) break;
            }
          }
        }
        /* Text clipping is the small-phone failure that a "no horizontal
           scroll" check misses entirely: a headline inside an
           overflow-hidden sticky stage can run off the side, or a mono line
           with wide tracking can spill its own box, and the document still
           reports zero overflow. So measure the copy itself — anything whose
           content is wider than its box, or that pokes past the viewport. */
        const clipped = [];
        const header = document.querySelector("header");
        const navBottom = header ? header.getBoundingClientRect().bottom : 0;
        // Scoped to the FILM. The first version swept the whole document and
        // dutifully reported that the footer sat 7000px below the fold — true,
        // useless, and it buried the one real hit under fifty fake ones.
        const film = document.querySelector("[data-film]");
        const copy = film
          ? film.querySelectorAll(
              "[data-chapter] h1, [data-chapter] h2, [data-chapter] p, [data-chapter] li," +
                "[data-chapter] a, [data-slate] p, .corner-note",
            )
          : [];
        for (const el of copy) {
          // checkVisibility walks ANCESTORS. An element's own opacity is 1
          // inside a faded-out chapter, which is exactly how a hidden block
          // gets reported as broken.
          if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          // Only judge what is on screen at this beat.
          if (r.bottom < 0 || r.top > window.innerHeight) continue;
          // Only a box that CLIPS can clip. scrollWidth > clientWidth on an
          // `overflow: visible` element just means ink paints outside the
          // padding box — which is what a stroked echo headline and a tracked
          // button do by design, and neither loses a pixel. 3px of slack on
          // top of that, because letter-spacing leaves a trailing gap after
          // the last glyph.
          const clips = getComputedStyle(el).overflowX !== "visible";
          const spills = clips && el.scrollWidth > el.clientWidth + 3;
          const offRight = r.right > window.innerWidth + 1;
          const offLeft = r.left < -1;
          // Vertical is the one that actually bit: on a 320x568 the title
          // card grew UP through the fixed nav and the headline came out on
          // top of the wordmark, with the document reporting zero overflow
          // the whole time. Anything overlapping the header, or hanging off
          // the bottom of a sticky full-height stage, is a fail.
          const underNav = r.top < navBottom - 2 && r.bottom > 4;
          const offBottom = r.bottom > window.innerHeight + 2;
          if (spills || offRight || offLeft || underNav || offBottom) {
            clipped.push(
              `${el.tagName}"${(el.textContent || "").trim().slice(0, 22)}"` +
                `${spills ? `+spill${el.scrollWidth - el.clientWidth}` : ""}` +
                `${offRight ? `+right${Math.round(r.right - window.innerWidth)}` : ""}` +
                `${offLeft ? `+left${Math.round(-r.left)}` : ""}` +
                `${underNav ? `+nav${Math.round(navBottom - r.top)}` : ""}` +
                `${offBottom ? `+below${Math.round(r.bottom - window.innerHeight)}` : ""}`,
            );
            if (clipped.length > 3) break;
          }
        }

        return {
          overflow,
          blame,
          clipped,
          film: f
            ? {
                act: f.stage.act,
                reveal: +f.stage.reveal.toFixed(2),
                dist: +Math.hypot(
                  f.camera[0],
                  f.camera[1] - f.centreY[f.stage.act],
                  f.camera[2],
                ).toFixed(2),
                edge: +f.edge.toFixed(3),
                calls: f.calls,
                tris: f.triangles,
              }
            : null,
        };
      });

      const overflowBad = dom.overflow > 1;
      // The car is cropped iff any of its eight box corners projects outside
      // NDC. Exact, and it does not care how dark the room is.
      const cropped = !dom.film || dom.film.edge > 1;
      const clipBad = dom.clipped.length > 0;
      if (overflowBad || cropped || clipBad) failures++;

      console.log(
        `${size.name.padEnd(9)} ${name.padEnd(20)} ` +
          `act ${dom.film ? dom.film.act + 1 : "?"} rev ${dom.film ? dom.film.reveal : "?"} ` +
          `dist ${dom.film ? dom.film.dist : "?"}  ` +
          `xscroll ${overflowBad ? `FAIL ${dom.overflow}px [${dom.blame.join(",")}]` : "none"}  ` +
          `inframe ${dom.film ? dom.film.edge.toFixed(2) : "?"}${cropped ? " CROPPED" : ""}` +
          (clipBad ? `  CLIP ${dom.clipped.join(" | ")}` : "  copy ok"),
      );
    }
    await page.close();
  }

  await browser.close();
  if (problems.length) {
    console.log(`\n${problems.length} PROBLEM(S):`);
    for (const e of [...new Set(problems)].slice(0, 15)) console.log(`  ${e}`);
  } else {
    console.log("\nNo JS errors.");
  }
  console.log(`${failures} failing beat(s). Frames in ${OUT}`);
  process.exitCode = failures ? 1 : 0;
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
