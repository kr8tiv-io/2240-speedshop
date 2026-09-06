"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { WebGLBoundary } from "@/components/gl/WebGLBoundary";
import { supportsWebGL2 } from "@/lib/webgl-capability";
import {
  getHeroBootSnapshot,
  subscribeHeroBoot,
} from "@/components/home/hero-boot";
import { useUIOverlay } from "@/components/ui-overlay";
import { beginWorldBoot, markWorldSkipped, noteMotion, subscribeBoot } from "./boot";
import {
  RUNWAY_ID,
  lockRunwayViewport,
  measureRunway,
  runwayMetrics,
  runwayScrollY,
  runwayViewHeight,
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
 *     `#walkthrough-runway` element is within ~5 viewports and scrolling has
 *     paused (warm silently in
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
let shopWorldModule: Promise<typeof import("./ShopWorld")> | null = null;
const preloadShopWorld = () => {
  if (!shopWorldModule) {
    shopWorldModule = import("./ShopWorld").catch((error) => {
      // A transient CDN/chunk error must not poison every later attempt for
      // the lifetime of this tab.
      shopWorldModule = null;
      throw error;
    });
  }
  return shopWorldModule;
};

const POST_HERO_PRELOAD_TIMEOUT_MS = 1_200;
const preloadGarageRoute = (tier: "full" | "lite", isCurrent: () => boolean) =>
  preloadShopWorld().then((module) => {
    if (isCurrent()) module.preloadOpeningGarage(tier);
    return module;
  });

/** Start transferring the split shop shortly after the hero proves its first
 * frame. Mounting remains separately scheduled so download never implies a
 * competing WebGL context during the opening interaction window. */
const ShopWorld = dynamic(() => preloadShopWorld().then((m) => m.ShopWorld), {
  ssr: false,
  loading: () => null,
});

type Verdict = "idle" | "run-full" | "run-lite" | "skip";

type CapableNavigator = Navigator & { deviceMemory?: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function WalkthroughWorld() {
  const [verdict, setVerdict] = useState<Verdict>("idle");
  // A Canvas is constructed for one immutable model shelf and DPR. Crossing a
  // width breakpoint during rotation must never reset loader generations under
  // that still-live renderer or enqueue a second 71-model tier behind it.
  const verdictRef = useRef<Verdict>("idle");
  /** Latched true once the runway has come within ~5 viewports and the reader
      pauses: the scene
      mounts, downloads and compiles silently while the reader is still in the
      film above. Never unlatches — recompiling the shop is the single most
      expensive thing this page can do, so once built it only ever parks. */
  const [mounted, setMounted] = useState(false);
  /** True around the runway and its crossfades: the only time frames are
      actually drawn. */
  const [active, setActive] = useState(false);
  const [worldWarm, setWorldWarm] = useState(false);
  const [worldReady, setWorldReady] = useState(false);
  const uiOverlay = useUIOverlay();
  const host = useRef<HTMLDivElement>(null);
  const opacityWritten = useRef(-1);

  useEffect(() => {
    // Parsed model bytes can remain cached; these flags belong to the new GPU
    // context and must always begin behind the safety light.
    beginWorldBoot();
    return subscribeBoot((boot) => {
      setWorldWarm(boot.warm);
      setWorldReady(boot.ready || boot.skipped);
    });
  }, []);

  /* Tier detection — chosen once for the life of this mounted world. */
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1024px)");

    let deferId = 0;
    let deferKind: "idle" | "raf" | null = null;
    const cancelDefer = () => {
      if (!deferId) return;
      if (deferKind === "idle") {
        const cic = (
          window as Window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback;
        if (typeof cic === "function") cic(deferId);
      } else if (deferKind === "raf") {
        window.cancelAnimationFrame(deferId);
      }
      deferId = 0;
      deferKind = null;
    };

    const decide = () => {
      if (verdictRef.current !== "idle") return;
      cancelDefer();
      const nav = navigator as CapableNavigator;
      const cores = nav.hardwareConcurrency ?? 4;
      // `deviceMemory` is Chromium-only; absence is not evidence of a weak
      // machine, so it defaults to "fine" rather than locking Safari out.
      const memory = nav.deviceMemory ?? 8;

      // Phones and tablets run the shop too. The only machines that keep the
      // graded veil are the ones that genuinely cannot run it (no WebGL, 2 GB
      // budget phones) or asked not to (prefers-reduced-motion).
      const capable = !motion.matches && cores >= 3 && memory >= 2 && supportsWebGL2();

      // Everything under a desktop viewport — every phone, every tablet —
      // gets the LITE tier: same shop, same models, same rail, minus the
      // render passes a mobile GPU pays double for. Weak desktops get it too.
      const full = wide.matches && cores >= 6 && memory >= 4;

      const next = capable ? (full ? "run-full" : "run-lite") : "skip";
      if (window.location.search.includes("perf")) {
        console.log(`[shop] verdict ${next} @${Math.round(performance.now())} ms`);
      }
      verdictRef.current = next;
      // Tell the plate at the door there is nothing coming, so it lifts at once
      // rather than sitting through its grace timer on a machine that opted out.
      if (next === "skip") {
        markWorldSkipped();
        setVerdict(next);
        return;
      }
      // Still-first defer on lite (phones): let the hero LCP plate paint one
      // idle/frame before we pull three.js. Full desktop stays immediate.
      if (next === "run-lite") {
        const go = () => setVerdict(next);
        const ric = (
          window as Window & {
            requestIdleCallback?: (
              cb: () => void,
              opts?: { timeout: number },
            ) => number;
          }
        ).requestIdleCallback;
        if (typeof ric === "function") {
          deferId = ric(go, { timeout: 140 });
          deferKind = "idle";
        } else {
          deferId = window.requestAnimationFrame(go);
          deferKind = "raf";
        }
        return;
      }
      setVerdict(next);
    };

    decide();
    return () => {
      cancelDefer();
    };
  }, []);

  const run = verdict === "run-full" || verdict === "run-lite";

  /* Network overlap starts from verified hero provenance, not from garage
     proximity. The import only fetches/evaluates the split runtime; the
     separate mount gate below still owns models, shaders and the WebGL
     context. This gives the browser useful work during a quiet hero frame
     without letting the shop compete with first paint. */
  useEffect(() => {
    if (!run) return;
    let cancelled = false;
    let scheduled = false;
    let idle = 0;
    let timer = 0;
    const schedule = () => {
      if (scheduled) return;
      const hero = getHeroBootSnapshot();
      if (!hero.sceneReady && !hero.failed) return;
      scheduled = true;
      const tier = verdict === "run-full" ? "full" : "lite";
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(
          () => void preloadGarageRoute(tier, () => !cancelled).catch(() => undefined),
          { timeout: POST_HERO_PRELOAD_TIMEOUT_MS },
        );
      } else {
        timer = window.setTimeout(
          () => void preloadGarageRoute(tier, () => !cancelled).catch(() => undefined),
          180,
        );
      }
    };
    schedule();
    const unsubscribe = subscribeHeroBoot(schedule);
    return () => {
      cancelled = true;
      unsubscribe();
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [run, verdict]);

  /* Runway gating + the edge fade. This effect also owns the shared runway
     measurement, so every consumer (camera rig, reveals, rail) reads fresh
     numbers even on machines where the canvas never mounts. */
  useEffect(() => {
    const runway = document.getElementById(RUNWAY_ID);
    if (!runway) return;

    measureRunway();

    /* Warm gate: five viewports out, after the hero has settled. The Canvas is
       parked and hidden, so proximity supplies maximum lead time while its
       scheduler continues to pace exact parse/upload/compile work. */
    let warmTimer = 0;
    let warmNear = false;
    let warmLatched = false;
    let cancelled = false;
    let heroSettled = (() => {
      const boot = getHeroBootSnapshot();
      return boot.sceneReady || boot.failed;
    })();
    const mountWorld = () => {
      if (!run || warmLatched || !heroSettled) return;
      if (!warmNear) return;
      warmLatched = true;
      warm?.disconnect();
      window.clearTimeout(warmTimer);
      void preloadShopWorld()
        .then((module) => {
          if (cancelled) return;
          module.prepareGarageMount();
          setMounted(true);
        })
        .catch(() => {
          if (cancelled) return;
          warmLatched = false;
          if (warmNear) warmTimer = window.setTimeout(mountWorld, 500);
        });
    };
    const unsubscribeHero = subscribeHeroBoot(() => {
      const boot = getHeroBootSnapshot();
      heroSettled = boot.sceneReady || boot.failed;
      if (heroSettled && warmNear && !warmLatched) {
        window.clearTimeout(warmTimer);
        warmTimer = window.setTimeout(mountWorld, 150);
      }
    });
    // Percentage vertical root margins are resolved against root WIDTH by the
    // IntersectionObserver spec. On a portrait iPhone `700%` was only about
    // three viewport heights. Use physical viewport-height pixels so every
    // phone and tablet receives the full seven-screen runway.
    let warm: IntersectionObserver | null = null;
    let observedWarmLeadPx = 0;
    const observeWarm = () => {
      if (warmLatched) return;
      const warmLeadPx = Math.ceil(Math.max(window.innerHeight, 1) * 7);
      if (warm && Math.abs(observedWarmLeadPx - warmLeadPx) < 32) return;
      observedWarmLeadPx = warmLeadPx;
      warm?.disconnect();
      warm = new IntersectionObserver(
        ([entry]) => {
          warmNear = entry.isIntersecting;
          if (warmNear) {
            if (run) {
              // Seven viewports of approach is enough to fill the shared model
              // cache without charging the landing page for garage bytes a
              // visitor may never request.
              void preloadGarageRoute(verdict === "run-full" ? "full" : "lite", () => !cancelled)
                .catch(() => undefined);
            }
          }
          window.clearTimeout(warmTimer);
          if (warmNear) warmTimer = window.setTimeout(mountWorld, 150);
        },
        { rootMargin: `${warmLeadPx}px 0px ${warmLeadPx}px 0px` },
      );
      warm.observe(runway);
    };
    observeWarm();

    /* Draw gate: cover the 1.5-viewport dissolve with a little compile-safe
       margin. Outside that corridor the expensive frameloop still parks. */
    let draw: IntersectionObserver | null = null;
    let observedDrawLeadPx = 0;
    const observeDraw = () => {
      const drawLeadPx = Math.ceil(Math.max(window.innerHeight, 1) * 1.7);
      if (draw && Math.abs(observedDrawLeadPx - drawLeadPx) < 16) return;
      observedDrawLeadPx = drawLeadPx;
      draw?.disconnect();
      draw = new IntersectionObserver(
        ([entry]) => setActive(entry.isIntersecting),
        { rootMargin: `${drawLeadPx}px 0px ${drawLeadPx}px 0px` },
      );
      draw.observe(runway);
    };
    observeDraw();

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
      const vh = runwayViewHeight();
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
    let viewportResizeFrame = 0;
    const refreshViewportLeads = () => {
      window.cancelAnimationFrame(viewportResizeFrame);
      viewportResizeFrame = window.requestAnimationFrame(() => {
        measure();
        observeWarm();
        observeDraw();
      });
    };

    fade();
    document.addEventListener("scroll", fade, { passive: true, capture: true });
    window.addEventListener("resize", refreshViewportLeads);
    // Deliberately NOT listening to visualViewport.resize — that is the iOS
    // chrome show/hide vector. measureRunway already freezes view height on
    // coarse/iOS after lockRunwayViewport; chrome-only height flips must not
    // rebuild IntersectionObservers either.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    observer.observe(runway);
    const settle = window.setTimeout(() => {
      measure();
      lockRunwayViewport();
    }, 480);

    return () => {
      cancelled = true;
      unsubscribeHero();
      warm?.disconnect();
      window.clearTimeout(warmTimer);
      window.clearTimeout(settle);
      draw?.disconnect();
      window.cancelAnimationFrame(viewportResizeFrame);
      document.removeEventListener("scroll", fade, { capture: true });
      window.removeEventListener("resize", refreshViewportLeads);
      observer.disconnect();
    };
  }, [run, verdict]);

  return (
    <div
      ref={host}
      data-shop-ready={worldReady ? "world" : "poster"}
      data-shop-stage={worldReady ? "world" : worldWarm ? "shell" : "poster"}
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-[100svh] w-full"
      style={{ opacity: 0 }}
    >
      {/* The building. Mounted early (warm gate), drawn late (draw gate). */}
      {run && mounted ? (
        <WebGLBoundary onFailure={markWorldSkipped}>
          <ShopWorld
            tier={verdict === "run-full" ? "full" : "lite"}
            active={active && worldReady && uiOverlay === null}
            revealed={worldReady}
          />
        </WebGLBoundary>
      ) : null}

      {/* The graded veil — above the canvas, below the DOM copy. Also the
          whole show on machines that never mount WebGL: its gradients paint
          unconditionally, so the station copy always sits in a lit room. */}
      <div className="wt-world-veil absolute inset-0" />
      {/* A fast scroller can reach the doorway before a slow mobile GPU has
          finished linking the shop. Hold a real tungsten/cool room there,
          then dissolve it away once the full world is ready. */}
      <div
        className={`wt-world-boot-light absolute inset-0 transition-opacity duration-1000 ${
          worldReady ? "opacity-0" : "opacity-100"
        }`}
        data-shop-doorway={worldReady ? "open" : worldWarm ? "warming" : "dark"}
      />
    </div>
  );
}

export default WalkthroughWorld;
