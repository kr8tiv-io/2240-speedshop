/* Ground truth on the split-film triggers: scroll into runway A, dump the
   ScrollTrigger table, shot.film via __film.stage, and chapter-0 opacity. */
const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 120000,
    args: ["--window-position=-2400,0", "--window-size=1500,1000", "--mute-audio", "--no-first-run"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await sleep(9000);

  const dump = async (label, frac) => {
    const state = await page.evaluate((p) => {
      const a = document.querySelector("[data-runway-a]");
      const r = a.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const y = Math.max(0, top + p * Math.max(1, r.height - innerHeight));
      const lenis = window.__lenis2240;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
      return { y, top, h: r.height };
    }, frac);
    await sleep(2500);
    const info = await page.evaluate(() => {
      const gsap = window.gsap;
      const ST = gsap?.core?.globals?.().ScrollTrigger;
      const triggers = ST
        ? ST.getAll().map((t) => ({
            trig: t.trigger?.getAttribute?.("data-runway-a") != null
              ? "A"
              : t.trigger?.getAttribute?.("data-runway-c") != null
                ? "C"
                : (t.trigger?.id || t.trigger?.className || "?").toString().slice(0, 40),
            start: Math.round(t.start),
            end: Math.round(t.end),
            progress: +t.progress.toFixed(3),
          }))
        : "no ST global";
      const ch0 = document.querySelector("[data-chapter='0']");
      return {
        scrollY: Math.round(window.scrollY),
        film: window.__film ? { act: window.__film.stage.act, reveal: +window.__film.stage.reveal.toFixed(3), t: +window.__film.stage.t.toFixed(2) } : null,
        ch0opacity: ch0 ? getComputedStyle(ch0).opacity : null,
        canvasAlpha: (() => { const c = document.querySelector("[data-film-canvas]"); return c ? getComputedStyle(c).opacity : null; })(),
        triggers,
      };
    });
    console.log(label, JSON.stringify({ target: state, info }, null, 1));
  };

  await dump("A@0.05", 0.05);
  await dump("A@0.40", 0.4);
  await dump("A@0.80", 0.8);
  console.log("ERRORS:", errors.slice(0, 8));
  await browser.close();
})();
