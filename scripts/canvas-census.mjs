/**
 * Every canvas on the page: size, position, context type, parent chain.
 *
 *   node scripts/canvas-census.mjs http://localhost:PORT 6050
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, yArg] = process.argv.slice(2);
const Y = Number(yArg || 0);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-position=-2400,0", "--window-size=1456,1020"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
if (Y) {
  for (let y = 0; y < Y; y += 300) {
    await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.08 }), y);
    await new Promise((r) => setTimeout(r, 45));
  }
  await new Promise((r) => setTimeout(r, 1200));
}

const census = await page.evaluate(() => {
  return [...document.querySelectorAll("canvas")].map((c) => {
    const r = c.getBoundingClientRect();
    const chain = [];
    for (let p = c.parentElement; p && chain.length < 5; p = p.parentElement) {
      chain.push(
        `${p.tagName.toLowerCase()}${p.className && typeof p.className === "string" ? "." + p.className.split(" ").slice(0, 3).join(".") : ""}`,
      );
    }
    return {
      backing: [c.width, c.height],
      css: [Math.round(r.width), Math.round(r.height), Math.round(r.left), Math.round(r.top)],
      ctx: c.getContext("webgl2") ? "webgl2" : c.getContext("2d") ? "2d" : "?",
      chain,
    };
  });
});
console.log(JSON.stringify(census, null, 1));
await browser.close();
