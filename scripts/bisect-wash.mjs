/**
 * Is the daylight wash coming from the WebGL render or from a DOM layer on top
 * of it? Capture the same beat twice — once as shipped, once with every DOM
 * sibling of the canvas hidden — and let the pair answer it.
 */
import puppeteer from "puppeteer-core";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2];
const OUT = process.argv[3];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-position=-2400,0", "--window-size=420,900"],
});
const page = await browser.newPage();
await page.setViewport({ width: 320, height: 690, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(BASE, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 3500));

// Act II copy beat: film progress (1 + 0.62) / 3.
const target = (1 + 0.62) / 3;
await page.evaluate((t) => {
  const doc = document.documentElement;
  window.__lenis2240?.scrollTo((doc.scrollHeight - window.innerHeight) * t * 0.62, { immediate: true });
}, target);
await new Promise((r) => setTimeout(r, 2500));

await page.screenshot({ path: path.join(OUT, "wash-A-shipped.png") });

// Hide EVERY element that is not the canvas or one of its ancestors.
const hidden = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return -1;
  const keep = new Set();
  for (let n = canvas; n; n = n.parentElement) keep.add(n);
  let n = 0;
  for (const el of document.body.querySelectorAll("*")) {
    if (keep.has(el) || el.contains(canvas)) continue;
    el.style.setProperty("visibility", "hidden", "important");
    n++;
  }
  // Ancestors may themselves carry the wash (mask-image, ::before, background).
  for (const el of keep) {
    if (el === canvas) continue;
    el.style.setProperty("mask-image", "none", "important");
    el.style.setProperty("-webkit-mask-image", "none", "important");
    el.style.setProperty("background", "none", "important");
  }
  return n;
});
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: path.join(OUT, "wash-B-canvas-only.png") });

console.log(`hid ${hidden} elements; wrote wash-A-shipped.png and wash-B-canvas-only.png`);
await browser.close();
