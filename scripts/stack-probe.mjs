/**
 * Who is painting at (x, y)? elementsFromPoint with computed backgrounds.
 *
 *   node scripts/stack-probe.mjs http://localhost:PORT 6050 700 700
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, yArg, pxArg, pyArg] = process.argv.slice(2);
const Y = Number(yArg), PX = Number(pxArg), PY = Number(pyArg);

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

const stack = await page.evaluate((px, py) => {
  return document.elementsFromPoint(px, py).slice(0, 14).map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 80),
      bg: cs.backgroundColor,
      bgImage: cs.backgroundImage === "none" ? "" : cs.backgroundImage.slice(0, 60),
      opacity: cs.opacity,
      z: cs.zIndex,
      blend: cs.mixBlendMode,
      rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
    };
  });
}, PX, PY);
console.log(JSON.stringify(stack, null, 1));
await browser.close();
