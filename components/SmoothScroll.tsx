"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { advanceReveals, driveReveals } from "./StationReveal";
import { noteMotion } from "./shop/boot";

/**
 * Lenis smooth scroll + station snap.
 *
 * Motion principle §2.4.1 — heavy things move slowly. Lenis gives the page the
 * same weighted, damped feel the 3D camera has, so the DOM and the canvas share
 * one physics. Disabled entirely under `prefers-reduced-motion`, and torn down
 * on unmount so no rAF loop survives a route change.
 *
 * THE SNAP: the orbit tour reads as seven distinct shots, so when the reader
 * lets go of the wheel near a station, the page eases the last stretch onto
 * that orbit's centre — a settle, not a yank: it only fires once scrolling has
 * genuinely stopped, only within reach of a station, and it rides a long
 * quintic so it feels like the camera coming to rest on its mark.
 */

/* Phase layout mirror of shop/world.ts — keep in sync with the rail. */
const COUNT = 7;
const W_ORBIT = 1.4;
const W_TRAVEL = 1.0;
const CYCLE = W_ORBIT + W_TRAVEL;
const TOTAL = COUNT * W_ORBIT + (COUNT - 1) * W_TRAVEL;

/** Scroll progress of station i's orbit centre. */
const midOf = (i: number) => (i * CYCLE + W_ORBIT * 0.5) / TOTAL;

const inOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const nativeBehavior = root.style.scrollBehavior;

    let lenis: Lenis | null = null;
    let frame = 0;
    let idleTimer = 0;
    let snapping = false;
    let release: (() => void) | null = null;

    /* NO SNAP UNDER A FINGER.
       The settle is a lovely thing with a wheel: you stop turning, and the
       page eases the last few pixels onto the orbit's centre. Under a thumb it
       is a fight. A flick on a phone covers most of a station in one gesture,
       the reach that decides "near a station" is nearly eight hundred pixels
       of an eleven-thousand-pixel document, and so almost every swipe ends
       with the page pulling itself somewhere the reader did not put it. That
       is not a settle, it is the site arguing — and it reads as lag even when
       every frame is on time.
       Coarse pointers keep the platform's own momentum scrolling, which is
       the smoothest thing on any phone and always will be. */
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const trySnap = () => {
      if (!lenis || snapping || coarse) return;
      // The tour only exists on the homepage stage.
      if (!document.querySelector("[data-world-stage]")) return;
      const span = Math.max(root.scrollHeight - window.innerHeight, 1);
      const y = Math.max(window.scrollY || 0, root.scrollTop || 0);
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < COUNT; i++) {
        const target = midOf(i) * span;
        const d = Math.abs(target - y);
        if (d < bestDist) {
          bestDist = d;
          best = target;
        }
      }
      // Within reach of a station (just under half a station-cycle) and not
      // already parked on it.
      const reach = (CYCLE / TOTAL) * span * 0.44;
      if (bestDist > reach || bestDist < 4) return;
      snapping = true;
      lenis.scrollTo(best, {
        duration: 1.25,
        easing: inOutQuint,
        onComplete: () => {
          snapping = false;
        },
      });
      // Failsafe unlock — an interrupted tween must never wedge the snap.
      window.setTimeout(() => {
        snapping = false;
      }, 1600);
    };

    const onAnyScroll = () => {
      if (snapping) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(trySnap, 300);
    };

    const start = () => {
      if (lenis) return;
      // globals.css sets `scroll-behavior: smooth`; native smoothing fights
      // Lenis, so hand the wheel over while Lenis owns the scroll.
      root.style.scrollBehavior = "auto";
      lenis = new Lenis({
        // A notch longer than it was: the extra tail is what reads as
        // "buttery" between stations, and the snap owns the final settle.
        duration: 1.35,
        // Torque curve: quick off the line, long settle.
        easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        anchors: true,
        autoRaf: false,
      });

      lenis.on("scroll", ({ velocity }: { velocity: number }) => {
        // The world's streaming queue holds its compiling while this is true —
        // and in the first seconds, before the canvas has a frame loop of its
        // own, this is the only place that knows the reader is moving.
        noteMotion(Math.abs(velocity) > 0.05);
        // A user gesture cancels any settle in flight and re-arms the idle
        // timer; the snap fires only once the page has truly come to rest.
        if (Math.abs(velocity) > 0.08 && !snapping) {
          window.clearTimeout(idleTimer);
          idleTimer = window.setTimeout(trySnap, 240);
        }
      });

      // Belt and braces: some scroll paths (keyboard, scrollbar drag, browser
      // automation) move the page without passing through Lenis's wheel
      // capture — the native scroll event re-arms the same idle timer so the
      // settle works no matter how the page was moved.
      document.addEventListener("scroll", onAnyScroll, {
        passive: true,
        capture: true,
      });

      /* ONE LOOP. Lenis advances the scroll, then — in the same callback, in
         a guaranteed order — the station reveals resolve against the position
         it just wrote. They used to run in a rAF of their own, which lands
         either side of Lenis's depending on registration order: the panels
         were reading last frame's scroll roughly half the time, which is
         precisely the kind of one-frame disagreement that reads as stepping.
         (The canvas keeps its own loop — three's renderer must own that — but
         it reads the same damped rail from the same source of truth.) */
      release = driveReveals();
      const loop = (time: number) => {
        lenis?.raf(time);
        advanceReveals(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);

      // Every programmatic scroll on the page MUST go through this instance:
      // a bare window.scrollTo leaves Lenis's internal position stale, and
      // the next snap animates from the stale value — the page lurches back
      // to wherever Lenis last believed it was.
      (window as unknown as { __lenis2240?: Lenis }).__lenis2240 = lenis;
    };

    const stop = () => {
      if (!lenis) return;
      release?.();
      release = null;
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      document.removeEventListener("scroll", onAnyScroll, { capture: true });
      lenis.destroy();
      lenis = null;
      delete (window as unknown as { __lenis2240?: Lenis }).__lenis2240;
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
