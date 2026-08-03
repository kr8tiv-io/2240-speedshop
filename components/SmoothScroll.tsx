"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll.
 *
 * Motion principle §2.4.1 — heavy things move slowly. Lenis gives the page the
 * same weighted, damped feel the 3D camera has, so the DOM and the canvas share
 * one physics. Disabled entirely under `prefers-reduced-motion`, and torn down
 * on unmount so no rAF loop survives a route change.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const nativeBehavior = root.style.scrollBehavior;

    let lenis: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (lenis) return;
      // globals.css sets `scroll-behavior: smooth`; native smoothing fights
      // Lenis, so hand the wheel over while Lenis owns the scroll.
      root.style.scrollBehavior = "auto";
      lenis = new Lenis({
        duration: 1.15,
        // Torque curve: quick off the line, long settle. No snap, ever.
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

      const loop = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!lenis) return;
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenis = null;
      root.style.scrollBehavior = nativeBehavior;
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
