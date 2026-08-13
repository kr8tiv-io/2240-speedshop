"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Badge } from "@/components/Logo";

/**
 * The preloader as brand moment: black screen, a mono percentage tied to REAL
 * asset progress, and the 2240 sign-badge stuttering ON like a cold neon tube.
 * Minimum 1.2 s so the flicker lands, hard cap 2.5 s so nobody waits on a
 * stuck loader — then it hands off directly into the hero.
 *
 * Failsafes, layered (a flaky tunnel taught us): (1) a 4 s wall-clock timeout
 * armed on mount that force-completes regardless of what useProgress reports;
 * (2) a 6 s React-BYPASSING escape hatch — a hung GLB request wedges React's
 * commits entirely (the % freezes, no setState paints), so this one hides the
 * veil and hands off with raw DOM calls; (3) `.preloader-veil` in globals.css
 * — a pure-CSS dead-man fade at ~6.5 s that lifts the overlay even if
 * hydration itself never happens (a hung JS chunk must not brick the page).
 */
/* Backstops, not the normal path. Raised from 4 s / 6 s: at those values a
   legitimate cold load tripped the failsafe and handed off mid-compile, which
   is the very stutter this is meant to prevent. They still bound the worst
   case — a hung GLB cannot brick the page. */
const HARD_CAP_MS = 14000;
const ESCAPE_MS = 18000;

export function Preloader({ onDone, sceneReady }: { onDone?: () => void; sceneReady?: boolean }) {
  const { progress } = useProgress();
  const [phase, setPhase] = useState<"loading" | "flicker" | "exit" | "gone">("loading");
  const mounted = useRef(Date.now());
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Displayed number never goes backwards even if the manager resets.
  const shown = useRef(0);
  shown.current = Math.max(shown.current, Math.round(progress));

  useEffect(() => {
    if (phase !== "loading") return;
    const tryFinish = () => {
      const elapsed = Date.now() - mounted.current;
      if ((progress >= 100 && sceneReady && elapsed >= 1200) || elapsed >= HARD_CAP_MS) {
        shown.current = 100;
        setPhase("flicker");
      }
    };
    tryFinish();
    const id = window.setInterval(tryFinish, 100);
    return () => window.clearInterval(id);
  }, [progress, phase, sceneReady]);

  // HARD WALL-CLOCK FAILSAFE — armed once on mount, zero dependency on
  // useProgress or any loader event. Whatever a flaky network does (a GLB
  // request that hangs forever, a manager that never reports), the preloader
  // force-completes at 4 s flat. The scene renders whatever it has.
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setPhase((p) => {
        if (p !== "loading") return p;
        shown.current = 100;
        return "flicker";
      });
    }, HARD_CAP_MS);
    // ESCAPE HATCH — bypasses React entirely. Measured failure mode: a GLB
    // request that HANGS (no error, no bytes) leaves the scene suspended
    // forever and React stops committing — the % freezes and the setPhase
    // above never paints. Raw timers still run, and GSAP + the canvas loop
    // live outside React, so at 6 s we imperatively hide the veil, restore
    // scroll, and hand off to the film. `display` is not React-managed on
    // this node, so a late React recovery still reconciles cleanly.
    const t2 = window.setTimeout(() => {
      const veil = rootRef.current;
      if (!veil || !veil.isConnected || veil.style.display === "none") return;
      veil.style.display = "none";
      document.documentElement.style.overflow = "";
      doneRef.current?.();
    }, ESCAPE_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase === "flicker") {
      // tube-on runs 1.05 s; hold the lit sign a beat, then hand off.
      const id = window.setTimeout(() => {
        setPhase("exit");
        doneRef.current?.();
      }, 1300);
      return () => window.clearTimeout(id);
    }
    if (phase === "exit") {
      const id = window.setTimeout(() => setPhase("gone"), 600);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  // Scroll stays locked while the loader owns the screen.
  useEffect(() => {
    if (phase === "exit" || phase === "gone") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      ref={rootRef}
      className={`preloader-veil fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bay-black transition-[opacity,transform] duration-[600ms] ease-out ${
        phase === "exit" ? "-translate-y-6 opacity-0" : ""
      }`}
      aria-hidden="true"
    >
      <div className={phase === "flicker" ? "tube-on" : "opacity-[0.06]"}>
        <Badge className="h-28 w-auto sm:h-36" hole="#fafaf8" title="" />
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex items-end justify-between px-6 sm:px-10">
        <p className="corner-note">2240 SPEED SHOP · EDMONTON AB</p>
        <p className="font-mono text-4xl tabular-nums leading-none text-bone/80 sm:text-5xl">
          {String(Math.min(shown.current, 100)).padStart(3, "0")}
          <span className="text-tungsten">%</span>
        </p>
      </div>
    </div>
  );
}

export default Preloader;
