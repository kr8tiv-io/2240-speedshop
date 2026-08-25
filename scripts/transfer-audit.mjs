/**
 * What does a visitor actually DOWNLOAD, and when?
 *
 *   node scripts/transfer-audit.mjs http://localhost:PORT [phone]
 *
 * "The site is slow" needs splitting into its real parts before anything gets
 * optimised: initial payload, film-scroll payload, walk-through payload, and
 * frame pacing. This loads the page, then scrolls the film, then the shop
 * walk-through, snapshotting cumulative transfer + request list at each stage
 * and sampling rAF gaps for jank the whole way.
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2];
const phone = process.argv[3] === "phone";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ["--window-position=-2400,0", phone ? "--window-size=420,900" : "--window-size=1456,1020"],
});
const page = await browser.newPage();
if (phone) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
} else {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
}

const responses = [];
page.on("response", async (r) => {
  try {
    const h = r.headers();
    const len = Number(h["content-length"] || 0);
    responses.push({ url: r.url(), bytes: len, type: h["content-type"] || "?" });
  } catch {}
});

await page.evaluateOnNewDocument(() => {
  window.__gaps = [];
  let last = performance.now();
  const tick = (t) => {
    if (t - last > 100) window.__gaps.push({ at: Math.round(t), gap: Math.round(t - last) });
    last = t;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

const t0 = Date.now();
await page.goto(base, { waitUntil: "networkidle2", timeout: 180000 });
const loadMs = Date.now() - t0;

const snap = (label) => {
  const total = responses.reduce((s, r) => s + r.bytes, 0);
  const byKind = {};
  for (const r of responses) {
    const k = r.url.includes(".glb") ? "glb" : r.url.match(/\.(webp|jpe?g|png)/) ? "img"
      : r.url.includes(".js") ? "js" : r.url.match(/\.(txt)/) ? "rsc" : r.url.match(/\.(woff2)/) ? "font" : "other";
    byKind[k] = (byKind[k] || 0) + r.bytes;
  }
  console.log(`== ${label}: requests ${responses.length}, total ${(total / 1048576).toFixed(1)} MB ::`,
    Object.entries(byKind).map(([k, v]) => `${k} ${(v / 1048576).toFixed(1)}MB`).join("  "));
};
console.log(`load (networkidle2): ${loadMs} ms`);
snap("after load");

// Scroll the film at reading pace.
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const filmEnd = Math.min(total, phone ? 11000 : 12000);
for (let y = 0; y <= filmEnd; y += 300) {
  await page.evaluate((yy) => window.__lenis2240 ? window.__lenis2240.scrollTo(yy, { duration: 0.09 }) : scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 60));
}
await new Promise((r) => setTimeout(r, 2000));
snap("after film");

// Keep going into and through the walk-through / rest of page.
for (let y = filmEnd; y <= total; y += 300) {
  await page.evaluate((yy) => window.__lenis2240 ? window.__lenis2240.scrollTo(yy, { duration: 0.09 }) : scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 60));
}
await new Promise((r) => setTimeout(r, 2000));
snap("after full page");

const gaps = await page.evaluate(() => window.__gaps);
console.log(`rAF stalls >100ms: ${gaps.length}`);
for (const g of gaps.slice(0, 12)) console.log(`  t=${g.at}ms gap=${g.gap}ms`);

const heavy = [...responses].sort((a, b) => b.bytes - a.bytes).slice(0, 12);
console.log("heaviest transfers:");
for (const h of heavy) console.log(`  ${(h.bytes / 1024).toFixed(0).padStart(6)} kB  ${h.url.split("/").slice(-2).join("/")}`);
await browser.close();
