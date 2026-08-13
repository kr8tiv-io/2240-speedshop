/**
 * Screenshot a scroll range WHILE MOVING, with no settle time.
 *
 *   node scripts/act-sweep.mjs http://localhost:4211 3300 6800 12 C:\tmp\sweep
 *
 * film-shots.js waits ~1.5 s at each beat before capturing, which is precisely
 * why it never reproduced "the models don't show up as you scroll": whatever is
 * missing has time to arrive. This sweeps a range and captures immediately, so
 * the frames are what a scrolling visitor actually sees.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, fromA, toA, nA, outDir, wA, hA] = process.argv.slice(2);
const from = Number(fromA), to = Number(toA), n = Number(nA || 12);
const W = Number(wA || 1440), H = Number(hA || 900);
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: [`--window-position=-2400,0`, `--window-size=${W + 16},${H + 120}`],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));

// Walk up to the range at reading pace so the run matches a real scroll.
for (let y = 0; y < from; y += 260) {
  await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.08 }), y);
  await new Promise((r) => setTimeout(r, 45));
}

for (let i = 0; i <= n; i++) {
  const y = from + ((to - from) * i) / n;
  await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.08 }), y);
  await new Promise((r) => setTimeout(r, 90)); // a few frames, not a settle
  const st = await page.evaluate(() => {
    const f = window.__film;
    return { act: f?.stage?.act ?? null, rev: Math.round((f?.stage?.reveal ?? 0) * 100) / 100 };
  });
  const name = `y${String(Math.round(y)).padStart(6, "0")}-act${st.act}-rev${st.rev}.png`;
  await page.screenshot({ path: path.join(outDir, name) });
  console.log(name);
}
await browser.close();
