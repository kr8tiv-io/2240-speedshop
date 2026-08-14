/* Sample bay visibility/mark state every 2 s while parked mid-runway. */
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const OUT = path.join(__dirname, "..", "shots-wt-diag");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 240000,
    args: ["--window-position=-2400,0", "--window-size=1600,1100", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--mute-audio", "--no-first-run"],
  });
  const page = await browser.newPage();
  const logs = [];
  page.on("console", (m) => { const t = m.text(); if (t.includes("[shop]")) logs.push(`${Math.round(performance.now() / 1000)}s ${t}`); });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/?perf`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await sleep(5000);

  const wt = await page.evaluate(() => {
    const n = document.querySelector("#walkthrough-runway");
    const r = n.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });
  // Park at the dyno beat and watch the stream come in.
  const y = wt.top + 0.62 * (wt.height - 900);
  await page.evaluate((yy) => {
    const lenis = window.__lenis2240;
    if (lenis) lenis.scrollTo(yy, { immediate: true, force: true });
    window.scrollTo(0, yy);
  }, y);

  const rows = [];
  for (let i = 0; i < 32; i++) {
    const s = await page.evaluate(() => {
      const shop = window.__shop;
      if (!shop || !shop.scene) return null;
      const now = performance.now();
      const bays = [];
      shop.scene.traverse((n) => {
        if (!/^bay-/.test(n.name)) return;
        let m = 0, vis = 0, paced = 0, minAge = Infinity, maxAge = 0;
        n.traverse((c) => {
          if (c.isMesh || c.isPoints || c.isLine) {
            m++;
            if (c.visible) vis++;
            const mark = c.userData && c.userData.pacedHidden;
            if (mark) {
              paced++;
              const age = mark === true ? -1 : Math.round(now - mark);
              if (age >= 0) { minAge = Math.min(minAge, age); maxAge = Math.max(maxAge, age); }
            }
          }
        });
        bays.push(`${n.name} v=${n.visible ? 1 : 0} ${vis}/${m} p=${paced}${paced ? ` age=${minAge === Infinity ? "?" : Math.round(minAge / 1000)}-${Math.round(maxAge / 1000)}s` : ""}`);
      });
      const rail = shop.camera.userData.rail;
      return `t=${Math.round(now / 1000)}s st=${rail ? (rail.t * 6).toFixed(2) : "-"} | ${bays.join(" | ")}`;
    });
    rows.push(s || "no shop");
    await sleep(2000);
  }
  fs.writeFileSync(path.join(OUT, "timeline.txt"), rows.join("\n") + "\n\nLOGS:\n" + logs.join("\n"));
  console.log(rows.join("\n"));
  await page.screenshot({ path: path.join(OUT, "timeline-final.png") });
  await browser.close();
})();
