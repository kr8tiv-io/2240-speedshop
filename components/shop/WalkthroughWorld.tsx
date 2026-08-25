"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { WebGLBoundary } from "@/components/gl/WebGLBoundary";
import { addMediaQueryChangeListener } from "@/components/home/hero-boot";
import { useUIOverlay } from "@/components/ui-overlay";
import { markWorldSkipped, noteMotion } from "./boot";
import {
  RUNWAY_ID,
  measureRunway,
  runwayMetrics,
  runwayScrollY,
} from "./runway";

/**
 * The gate in front of the walk-through — the combined-page version of the
 * original `ShopWorldMount`.
 *
 * Next 16 forbids `next/dynamic` with `ssr: false` inside a Server Component,
 * so this client boundary owns the client-only mount: it server-renders to a
 * veil, then decides on the client whether this machine should be running a
 * WebGL scene at all — and at which tier. Nothing is imported until it says
 * yes, so a machine that cannot run the shop never downloads three.js and
 * never pays for a decision it loses.
 *
 * COMBINED-PAGE DIFFERENCES from the original mount:
 *
 *   · The world no longer owns the document. The canvas mounts only once the
 *     `#walkthrough-runway` element is within ~2 viewports (warm silently in
 *     the background — the film's preloader already ran; there is no second
 *     plate), renders only around its runway (frameloop parks elsewhere), and
 *     overlaps the film across each doorway so neither world drops to black.
 *
 *   · z-index: the canvas sits at z-[5] with the graded veil above it; the
 *     page's DOM copy (the runway itself is `relative z-10`) reads over both.
 *
 *   · The veil is also the no-WebGL fallback, exactly as before: a machine
 *     that never mounts the canvas still gets a graded room — warm wash off
 *     the ceiling, cold spill at the floor — instead of flat black, and the
 *     server-rendered station copy reads perfectly on top of it.
 *
 * The site behind it is complete without this. Everything the reader — or an
 * answer engine — needs is server-rendered HTML in front of the canvas.
 */
const ShopWorld = dynamic(() => import("./ShopWorld").then((m) => m.ShopWorld), {
  ssr: false,
  loading: () => null,
});

type Verdict = "idle" | "run-full" | "run-lite" | "skip";

function hasWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    // Three r185 is WebGL2-only. Letting a WebGL1-only browser through this
    // gate merely defers the failure until Canvas construction.
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

type CapableNavigator = Navigator & { deviceMemory?: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function WalkthroughWorld() {
  const [verdict, setVerdict] = useState<Verdict>("idle");
  /** Latched true once the runway has come within ~2 viewports: the scene
      mounts, downloads and compiles silently while the reader is still in the
      film above. Never unlatches — recompiling the shop is the single most
      expensive thing this page can do, so once built it only ever parks. */
  const [mounted, setMounted] = useState(false);
  /** True around the runway and its crossfades: the only time frames are
      actually drawn. */
  const [active, setActive] = useState(false);
  const uiOverlay = useUIOverlay();
  const host = useRef<HTMLDivElement>(null);
  const opacityWritten = useRef(-1);

  /* Tier detection — verbatim from the original mount. */
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1024px)");

    const decide = () => {
      const nav = navigator as CapableNavigator;
      const cores = nav.hardwareConcurrency ?? 4;
      // `deviceMemory` is Chromium-only; absence is not evidence of a weak
      // machine, so it defaults to "fine" rather than locking Safari out.
      const memory = nav.deviceMemory ?? 8;

      // Phones and tablets run the shop too. The only machines that keep the
      // graded veil are the ones that genuinely cannot run it (no WebGL, 2 GB
      // budget phones) or asked not to (prefers-reduced-motion).
      const capable = !motion.matches && cores >= 3 && memory >= 2 && hasWebGL2();

      // Everything under a desktop viewport — every phone, every tablet —
      // gets the LITE tier: same shop, same models, same rail, minus the
      // render passes a mobile GPU pays double for. Weak desktops get it too.
      const full = wide.matches && cores >= 6 && memory >= 4;

      const next = capable ? (full ? "run-full" : "run-lite") : "skip";
      if (window.location.search.includes("perf")) {
        console.log(`[shop] verdict ${next} @${Math.round(performance.now())} ms`);
      }
      if (next === "skip") markWorldSkipped();
      setVerdict(next);
    };

    decide();
    const removeMotionListener = addMediaQueryChangeListener(motion, decide);
    const removeWideListener = addMediaQueryChangeListener(wide, decide);
    return () => {
      removeMotionListener();
      removeWideListener();
    };
  }, []);

  /* EARLY, SILENT WARM — distance is the wrong trigger on this page.
     The film runway above the walk-through is ~1200vh, so the 2-viewport
     warm gate only fires near the END of the film — and the world then pays
     its whole cold start (downloads, parses, shader links) exactly while the
     reader is walking into it, which the probe caught as an empty blurred
     room. The film's preloader owns the page for the first seconds; after
     that the GPU is idle enough to warm a PARKED world behind it. So the
     canvas mounts on a short clock as well as on approach — whichever comes
     first — and stays parked until the runway is actually near. */
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  /* Runway gating + the edge fade. This effect also owns the shared runway
     measurement, so every consumer (camera rig, reveals, rail) reads fresh
     numbers even on machines where the canvas never mounts. */
  useEffect(() => {
    const runway = document.getElementById(RUNWAY_ID);
    if (!runway) return;

    measureRunway();

    /* Warm gate: ~2 viewports out. Latched — see `mounted`. */
    const warm = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          warm.disconnect();
        }
      },
      { rootMargin: "200% 0px 200% 0px" },
    );
    warm.observe(runway);

    /* Draw gate: cover the 1.5-viewport dissolve with a little compile-safe
       margin. Outside that corridor the expensive frameloop still parks. */
    const draw = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "170% 0px 170% 0px" },
    );
    draw.observe(runway);

    /* THE HANDOFF FADE — the shop starts rising half a viewport before the
       outgoing film releases its sticky room and remains present half a
       viewport into the finale. The 1.5-viewport envelope deliberately
       overlaps both canvases; their ambient light can never both be zero.
       Driven from the same capture-phase scroll read the camera rig uses;
       writes are quantised so idle frames cost nothing. */
    const fade = () => {
      /* The warm-up's pacing asks "is the reader moving?" through the boot
         channel. On the original page the scroll layer fed it; here nothing
         did, so `stillFor()` reported eternal stillness and the batches ran
         full-tilt mid-scroll. Every scroll event through this handler is the
         honest signal. */
      noteMotion(true);
      const node = host.current;
      if (!node) return;
      const m = runwayMetrics();
      if (!m.measured) return;
      const y = runwayScrollY();
      const vh = Math.max(window.innerHeight, 1);
      const edge = vh * 1.5;
      const fadeIn = clamp01((y - (m.top - edge)) / edge);
      const fadeOut = clamp01((m.top + m.height - vh + edge - y) / edge);
      const opacity = Math.round(Math.min(fadeIn, fadeOut) * 200) / 200;
      if (opacity !== opacityWritten.current) {
        opacityWritten.current = opacity;
        node.style.opacity = String(opacity);
      }
    };

    const measure = () => {
      measureRunway();
      fade();
    };

    fade();
    document.addEventListener("scroll", fade, { passive: true, capture: true });
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    observer.observe(runway);

    return () => {
      warm.disconnect();
      draw.disconnect();
      document.removeEventListener("scroll", fade, { capture: true });
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  const run = verdict === "run-full" || verdict === "run-lite";

  return (
    <div
      ref={host}
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ opacity: 0 }}
    >
      {/* The building. Mounted early (warm gate), drawn late (draw gate). */}
      {run && mounted ? (
        <WebGLBoundary onFailure={markWorldSkipped}>
          <ShopWorld
            tier={verdict === "run-full" ? "full" : "lite"}
            active={active && uiOverlay === null}
          />
        </WebGLBoundary>
      ) : null}

      {/* The graded veil — above the canvas, below the DOM copy. Also the
          whole show on machines that never mount WebGL: its gradients paint
          unconditionally, so the station copy always sits in a lit room. */}
      <div className="wt-world-veil absolute inset-0" />
    </div>
  );
}

export default WalkthroughWorld;
