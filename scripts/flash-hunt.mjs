/**
 * Hunt for user-visible flash frames using the COMPOSITOR, not the GL context.
 *
 *   node scripts/flash-hunt.mjs http://localhost:4222 light C:\tmp\flash 1440 900
 *
 * WHY NOT THE PREVIOUS INSTRUMENT. diagnose.mjs samples the WebGL canvas from
 * its own rAF with preserveDrawingBuffer forced on. It reported black frames —
 * but those frames carried ~144 draw calls against ~49 on a normal frame, i.e.
 * the renderer was doing MORE work, not less. That is the signature of a probe
 * landing mid-render, not of a frame the user ever saw. Patching getContext
 * also changes the very thing being measured.
 *
 * Page.startScreencast is what the compositor actually presents. No page code
 * is touched. A uniformly black JPEG compresses to a tiny fraction of a
 * detailed one, so frame BYTE SIZE finds the candidates cheaply; the smallest
 * are then written out to be looked at, because "it compressed small" is not
 * the same claim as "it was black".
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, label, outDir, wA, hA] = process.argv.slice(2);
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

const client = await page.createCDPSession();
const frames = [];
client.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
  frames.push({ data, t: metadata.timestamp });
  try { await client.send("Page.screencastFrameAck", { sessionId }); } catch {}
});
await client.send("Page.startScreencast", { format: "jpeg", quality: 55, everyNthFrame: 1 });

const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const END = Math.min(total, 11000); // the film's own runway
for (let i = 0; i <= 300; i++) {
  await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.09 }), (END * i) / 300);
  await new Promise((r) => setTimeout(r, 60));
}
await client.send("Page.stopScreencast");

const sizes = frames.map((f, i) => ({ i, bytes: Buffer.from(f.data, "base64").length, t: f.t }));
sizes.sort((a, b) => a.bytes - b.bytes);
const median = sizes[Math.floor(sizes.length / 2)].bytes;

console.log(`${label}: ${frames.length} compositor frames, median ${median} bytes`);
console.log(`smallest 12: ${sizes.slice(0, 12).map((s) => s.bytes).join(", ")}`);

// Anything under a third of median is a candidate for a near-uniform frame.
const suspects = sizes.filter((s) => s.bytes < median / 3).slice(0, 10);
console.log(`suspect frames (< median/3): ${suspects.length}`);
for (const s of suspects) {
  const p = path.join(outDir, `${label}-suspect-${String(s.i).padStart(4, "0")}-${s.bytes}b.jpg`);
  fs.writeFileSync(p, Buffer.from(frames[s.i].data, "base64"));
  console.log(`  wrote ${path.basename(p)}`);
}
// A reference frame for comparison.
fs.writeFileSync(path.join(outDir, `${label}-median-${median}b.jpg`), Buffer.from(frames[sizes[Math.floor(sizes.length / 2)].i].data, "base64"));

await browser.close();
