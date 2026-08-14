/* One-beat spot check: desktop, wt late beat (station 5 end-aligned copy). */
const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3213";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    protocolTimeout: 240000,
    args: ["--window-position=-2400,0", "--window-size=1600,1100", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--mute-audio", "--no-first-run"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await sleep(24000); // let the parked warm run behind the film
  const wt = await page.evaluate(() => {
    const r = document.querySelector("#walkthrough-runway").getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });
  const y = wt.top + 0.83 * (wt.height - 900);
  await page.evaluate((yy) => {
    const lenis = window.__lenis2240;
    if (lenis) lenis.scrollTo(yy, { immediate: true, force: true });
    window.scrollTo(0, yy);
  }, y);
  await sleep(4000);
  await page.screenshot({ path: path.join(__dirname, "..", "shots-combined7", "combined-desktop-11-wt-late-v2.png") });
  await browser.close();
  console.log("done");
})();
