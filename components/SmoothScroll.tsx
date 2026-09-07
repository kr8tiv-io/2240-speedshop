"use client";

import { useEffect, type ReactNode } from "react";
import { addMediaQueryChangeListener } from "@/components/home/hero-boot";
import { getUIOverlay, subscribeUIOverlay } from "@/components/ui-overlay";

type LenisRuntime = import("lenis").default;
type GSAPRuntime = typeof import("gsap").gsap;
type ScrollTriggerRuntime = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/**
 * Lenis smooth scroll, synced to GSAP's ticker so ScrollTrigger scrubbing and
 * the wheel share one clock. The measured scroll VELOCITY is published on
 * `window.__lenisVelocity` for the hero's dust inertia — cheap, no context.
 *
 * Disabled entirely under `prefers-reduced-motion`; torn down on unmount.
 */
declare global {
  interface Window {
    __lenisVelocity?: number;
    /** The live Lenis instance. Any programmatic scroll MUST go through this:
        a raw window.scrollTo leaves Lenis's internal position stale and the
        page lurches back on the next frame. Verification scripts use it. */
    __lenis2240?: LenisRuntime;
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: LenisRuntime | null = null;
    let gsapRuntime: GSAPRuntime | null = null;
    let scrollTriggerRuntime: ScrollTriggerRuntime | null = null;
    let onTick: ((time: number) => void) | null = null;
    let generation = 0;

    const syncOverlay = () => {
      if (!lenis) return;
      if (getUIOverlay()) lenis.stop();
      else lenis.start();
    };

    const start = () => {
      if (lenis) return;
      const requested = ++generation;
      /* Native scroll works from the first byte. The luxury interpolation and
         GSAP clock join after first paint, before the preloader can hand off,
         so hydration never parses motion code it cannot display yet. */
      void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")])
        .then(([lenisModule, gsapModule, triggerModule]) => {
          if (requested !== generation || query.matches || lenis) return;
          const Lenis = lenisModule.default;
          gsapRuntime = gsapModule.gsap;
          scrollTriggerRuntime = triggerModule.ScrollTrigger;
          gsapRuntime.registerPlugin(scrollTriggerRuntime);
          lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
            anchors: true,
            autoRaf: false,
          });

          lenis.on("scroll", () => {
            window.__lenisVelocity = lenis?.velocity ?? 0;
            scrollTriggerRuntime?.update();
          });
          window.__lenis2240 = lenis;
          onTick = (time: number) => lenis?.raf(time * 1000);
          gsapRuntime.ticker.add(onTick);
          gsapRuntime.ticker.lagSmoothing(0);
          syncOverlay();
        })
        // Native scrolling is already active; a blocked enhancement chunk
        // must never become an unhandled page error or a scrolling failure.
        .catch(() => {});
    };

    const stop = () => {
      generation += 1;
      if (!lenis) return;
      if (onTick) gsapRuntime?.ticker.remove(onTick);
      lenis.destroy();
      lenis = null;
      onTick = null;
      window.__lenis2240 = undefined;
      window.__lenisVelocity = 0;
    };

    const touch = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    /* iOS Safari scrolls on a compositor thread. Lenis + GSAP ticker on top
       of native touch is the GSAP/Lenis jitter recipe (syncTouch is already
       false, so this was interpolating nothing and still fighting the clock).
       Native scroll + ScrollTrigger's own listener is the stable path. */
    if (!query.matches && !touch.matches) start();

    const onPreferenceChange = () => {
      if (query.matches || touch.matches) stop();
      else start();
    };

    const removePreferenceListener = addMediaQueryChangeListener(query, onPreferenceChange);
    const removeTouchListener = addMediaQueryChangeListener(touch, onPreferenceChange);
    const removeOverlayListener = subscribeUIOverlay(syncOverlay);
    return () => {
      removePreferenceListener();
      removeTouchListener();
      removeOverlayListener();
      stop();
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
