/**
 * Attribute the black rectangles over act II: canvas content or DOM layer?
 *
 *   node scripts/rect-hunt.mjs http://localhost:PORT 6050
 *
 * Shoots the same scroll position three ways: as shipped, with the GL-images
 * overlay (fixed z-30 layer) hidden, and with the film canvas hidden. Whichever
 * removal removes the rectangles names the culprit.
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, yArg] = process.argv.slice(2);
const Y = Number(yArg);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-position=-2400,0", "--window-size=1456,1020"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
for (let y = 0; y < Y; y += 300) {
  await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.08 }), y);
  await new Promise((r) => setTimeout(r, 45));
}
await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.2 }), Y);
await new Promise((r) => setTimeout(r, 1600));

await page.screenshot({ path: "C:\\tmp\\rect-A-shipped.png" });

const glInfo = await page.evaluate(() => {
  const layer = document.querySelector("div.pointer-events-none.fixed.inset-0.z-30");
  if (!layer) return { found: false };
  layer.style.setProperty("display", "none", "important");
  return { found: true };
});
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: "C:\\tmp\\rect-B-noGL.png" });

await page.evaluate(() => {
  const layer = document.querySelector("div.pointer-events-none.fixed.inset-0.z-30");
  if (layer) layer.style.removeProperty("display");
  const film = document.querySelector("canvas");
  if (film) film.style.setProperty("visibility", "hidden", "important");
});
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: "C:\\tmp\\rect-C-noFilm.png" });

console.log(JSON.stringify(glInfo), "wrote rect-A/B/C");
await browser.close();
