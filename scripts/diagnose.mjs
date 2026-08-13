/**
 * Continuous-scroll runtime diagnostic.
 *
 *   node scripts/diagnose.mjs http://localhost:4112 dark 1440 900
 *
 * WHY THIS EXISTS. film-shots.js jumps to ten discrete beats, settles, and
 * screenshots. It reported "0 failing beats, no console errors" on a build the
 * client described as flashing, pulsating, popping in late and flipping black
 * to white. Both were true: everything the client saw happens BETWEEN the
 * beats, during actual scrolling, and a harness that teleports past those
 * moments cannot see any of it.
 *
 * So this one scrolls the way a person does — continuously, at reading pace —
 * and samples every animation frame:
 *
 *   lum        mean luminance of the WebGL canvas. Frame-to-frame jumps are
 *              the "goes from black to white" flash, measured rather than
 *              guessed at. Sampling needs preserveDrawingBuffer, which the app
 *              does not set, so getContext is patched before any app code runs
 *              (evaluateOnNewDocument) — a diagnostic-only change.
 *   backing    canvas.width/height. The app drives dpr from a
 *              PerformanceMonitor, and every change reallocates the drawing
 *              buffer: a visible resolution pop. Repeated changes are the
 *              PULSATING.
 *   film       act / reveal / distance straight from window.__film.
 *   drawn      renderer.info.render.calls, if the app publishes it — an act
 *              whose model has not loaded still advances `act` while drawing
 *              almost nothing, which is "the model doesn't show up".
 *   xform      computed transform of elements that are supposed to animate in,
 *              to catch the ones that START ON AN ANGLE and stay there.
 *
 * Everything lands in one JSON file for offline analysis. Console messages,
 * page errors, failed requests and WebGL context loss are captured for the
 * whole run, not sampled.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, label, wArg, hArg, outArg] = process.argv.slice(2);
const W = Number(wArg || 1440);
const H = Number(hArg || 900);
const OUT = outArg || `C:\\tmp\\diag-${label}-${W}.json`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: [`--window-position=-2400,0`, `--window-size=${W + 16},${H + 120}`],
});
const page = await browser.newPage();
await page.setViewport({
  width: W,
  height: H,
  deviceScaleFactor: W < 768 ? 2 : 1,
  isMobile: W < 768,
  hasTouch: W < 768,
});

const console_ = [];
const errors = [];
page.on("console", (m) => {
  const t = m.type();
  if (t === "error" || t === "warning") console_.push({ t, text: m.text().slice(0, 400) });
});
page.on("pageerror", (e) => errors.push({ kind: "pageerror", text: String(e).slice(0, 600) }));
page.on("requestfailed", (r) => {
  const err = r.failure()?.errorText || "";
  // ERR_ABORTED is Chrome cancelling its own speculative prefetch documents.
  if (!err.includes("ABORTED")) errors.push({ kind: "requestfailed", text: `${r.url()} ${err}` });
});
page.on("response", (r) => {
  if (r.status() >= 400) errors.push({ kind: "http", text: `${r.status()} ${r.url()}` });
});

/* Force preserveDrawingBuffer so the canvas can be sampled, and install the
   per-frame recorder. Both must exist before the app's first line runs. */
await page.evaluateOnNewDocument(() => {
  window.__diag = { frames: [], gl: [], started: 0, draws: 0, clears: 0, binds: 0 };

  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (type !== "webgl2" && type !== "webgl") return orig.call(this, type, attrs);
    const ctx = orig.call(this, type, { ...(attrs || {}), preserveDrawingBuffer: true });
    if (ctx && !ctx.__diagWrapped) {
      ctx.__diagWrapped = true;
      /* Count real GPU work per frame. This is what separates "the renderer
         drew nothing" from "the renderer drew something that LOOKS black" —
         a distinction no screenshot can make, and the two have completely
         different fixes. Counting bindFramebuffer(null) too, because a frame
         that never binds the default framebuffer never reaches the screen. */
      for (const m of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"]) {
        const f = ctx[m];
        if (typeof f === "function") {
          ctx[m] = function (...a) { window.__diag.draws++; return f.apply(this, a); };
        }
      }
      const clear = ctx.clear;
      ctx.clear = function (...a) { window.__diag.clears++; return clear.apply(this, a); };
      const bindFb = ctx.bindFramebuffer;
      ctx.bindFramebuffer = function (t, fb) { if (fb === null) window.__diag.binds++; return bindFb.apply(this, arguments); };
    }
    return ctx;
  };

  addEventListener("DOMContentLoaded", () => {
    const sampler = document.createElement("canvas");
    sampler.width = 48;
    sampler.height = 30;
    const sctx = sampler.getContext("2d", { willReadFrequently: true });

    const tick = () => {
      const d = window.__diag;
      const canvas = document.querySelector("canvas");
      if (canvas && d.started) {
        let lum = -1;
        try {
          sctx.drawImage(canvas, 0, 0, sampler.width, sampler.height);
          const px = sctx.getImageData(0, 0, sampler.width, sampler.height).data;
          let s = 0;
          for (let i = 0; i < px.length; i += 4) {
            s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
          }
          lum = s / (px.length / 4);
        } catch {
          lum = -2; // tainted or lost context
        }
        /* Snapshot PRIMITIVES, never the object. __film.stage is a live
           singleton the render loop mutates in place, so `{...__film}` copies
           the reference and every recorded frame ends up showing the LAST
           frame's act — the timeline looked perfectly static when it was not. */
        const fl = window.__film;
        d.frames.push({
          t: Math.round(performance.now()),
          y: Math.round(scrollY),
          lum: Math.round(lum * 10) / 10,
          bw: canvas.width,
          bh: canvas.height,
          act: fl?.stage?.act ?? null,
          rev: fl?.stage ? Math.round((fl.stage.reveal ?? 0) * 1000) / 1000 : null,
          // Draw calls and triangles are the direct answer to "the model never
          // shows up": an act can advance while the renderer submits nothing.
          calls: fl?.calls ?? null,
          tris: fl?.triangles ?? null,
          // GPU work since the previous sample.
          draws: d.draws,
          clears: d.clears,
          binds: d.binds,
        });
        d.draws = 0;
        d.clears = 0;
        d.binds = 0;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // WebGL context loss would blank the scene outright.
    const hook = () => {
      const c = document.querySelector("canvas");
      if (!c || c.__diagHooked) return;
      c.__diagHooked = true;
      c.addEventListener("webglcontextlost", () => window.__diag.gl.push("lost"));
      c.addEventListener("webglcontextrestored", () => window.__diag.gl.push("restored"));
    };
    setInterval(hook, 500);
  });
});

await page.goto(base, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 5000));

// Snapshot which elements claim to be scroll-reveal targets, before scrolling.
const revealSel = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.transform && cs.transform !== "none" && el.getBoundingClientRect().height > 40) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 90),
        transform: cs.transform,
        opacity: cs.opacity,
      });
    }
  }
  return out.slice(0, 60);
});

await page.evaluate(() => {
  window.__diag.started = 1;
});

/* Scroll the WHOLE page continuously at reading pace. Lenis owns scroll, so
   drive it in small steps rather than one scrollTo — a single jump is exactly
   the teleport that hid these bugs in the first place. */
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const STEPS = 420;
for (let i = 0; i <= STEPS; i++) {
  const y = (total * i) / STEPS;
  await page.evaluate((yy) => {
    if (window.__lenis2240) window.__lenis2240.scrollTo(yy, { immediate: false, duration: 0.09 });
    else scrollTo(0, yy);
  }, y);
  await new Promise((r) => setTimeout(r, 55));
}
await new Promise((r) => setTimeout(r, 1500));

const diag = await page.evaluate(() => ({ frames: window.__diag.frames, gl: window.__diag.gl }));

// Post-scroll: anything still sitting on a transform is a reveal that never
// finished — the "starts on an angle and the transition is messed up".
const stuck = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.height < 40 || r.bottom < 0 || r.top > innerHeight * 3) continue;
    const cs = getComputedStyle(el);
    const m = cs.transform;
    if (!m || m === "none") continue;
    const nums = m.match(/matrix3?d?\(([^)]+)\)/)?.[1]?.split(",").map(Number);
    if (!nums) continue;
    // Rotation/skew shows up as non-zero off-diagonal terms.
    const skew = m.startsWith("matrix3d") ? Math.abs(nums[1]) + Math.abs(nums[4]) : Math.abs(nums[1]) + Math.abs(nums[2]);
    if (skew > 0.01 || Number(cs.opacity) < 0.98) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 90),
        transform: m.slice(0, 120),
        opacity: cs.opacity,
      });
    }
  }
  return out.slice(0, 40);
});

fs.writeFileSync(
  OUT,
  JSON.stringify({ label, W, H, console: console_, errors, revealSel, stuck, ...diag }, null, 1),
);
console.log(
  `${label} ${W}px — frames ${diag.frames.length}, console ${console_.length}, errors ${errors.length}, glEvents ${diag.gl.length}, stuck ${stuck.length} -> ${OUT}`,
);
await browser.close();
