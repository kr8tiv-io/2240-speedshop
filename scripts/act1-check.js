/* Act I turntable framing check: desktop + phones, beat p=0.3 of runway A.
   Reads window.__film.edge (largest |NDC| over the rotated corners — <1 means
   the whole car is in frame) and screenshots each. */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const OUT = path.join(__dirname, "..", "shots-act1");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SIZES = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "phone320", width: 320, height: 568, dsf: 2, mobile: true },
  { name: "phone390", width: 390, height: 844, dsf: 2, mobile: true },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 120000,
    args: ["--window-position=-2400,0", "--window-size=1500,1000", "--mute-audio", "--no-first-run"],
  });
  try {
    for (const size of SIZES) {
      const page = await browser.newPage();
      await page.setViewport({
        width: size.width, height: size.height, deviceScaleFactor: size.dsf,
        isMobile: !!size.mobile, hasTouch: !!size.mobile,
      });
      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120000 });
      await sleep(9000);
      for (const p of [0.22, 0.3, 0.38]) {
        await page.evaluate((frac) => {
          const a = document.querySelector("[data-runway-a]");
          const r = a.getBoundingClientRect();
          const y = r.top + window.scrollY + frac * Math.max(1, r.height - innerHeight);
          const lenis = window.__lenis2240;
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
          window.scrollTo(0, y);
        }, p);
        await sleep(3200);
        const film = await page.evaluate(() => {
          const f = window.__film;
          return f
            ? { act: f.stage.act, reveal: +f.stage.reveal.toFixed(2), edge: +f.edge.toFixed(3), cam: f.camera.map((v) => +v.toFixed(2)) }
            : null;
        });
        console.log(`${size.name} p=${p}:`, JSON.stringify(film));
        await page.screenshot({ path: path.join(OUT, `act1-${size.name}-${p}.png`) });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log("DONE");
})();
