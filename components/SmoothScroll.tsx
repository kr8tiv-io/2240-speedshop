"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    __lenis2240?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;

    const start = () => {
      if (lenis) return;
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
        ScrollTrigger.update();
      });

      window.__lenis2240 = lenis;

      onTick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (!lenis) return;
      if (onTick) gsap.ticker.remove(onTick);
      lenis.destroy();
      lenis = null;
      window.__lenis2240 = undefined;
      window.__lenisVelocity = 0;
    };

    if (!query.matches) start();

    const onPreferenceChange = () => {
      if (query.matches) stop();
      else start();
    };

    query.addEventListener("change", onPreferenceChange);
    return () => {
      query.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
