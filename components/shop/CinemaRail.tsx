"use client";

import { useEffect, useRef, useState } from "react";
import { subscribe } from "./StationReveal";
import { RUNWAY_ID, measureRunway } from "./runway";

/* ─────────────────────────────────────────────────────────────────────────────
   FILM FURNITURE — the letterbox and the station index.

   Two pieces of cinema language for the orbit tour, both driven by the same
   shared scroll loop the reveals use. The LETTERBOX rides in while the camera
   is genuinely travelling between subjects and lifts as an orbit begins — the
   frame literally goes widescreen for the glides. The STATION RAIL is a
   seven-tick index down the right edge: where you are in the film, and a way
   to jump straight to any orbit. Desktop gets labels; phones get nothing at
   all — on a small screen the rail is clutter, and the scroll IS the index.
   ────────────────────────────────────────────────────────────────────────── */

const ORBIT_SPAN = 0.35;
const W_ORBIT = 1.4;
const W_TRAVEL = 1.0;
const COUNT = 7;
const TOTAL = COUNT * W_ORBIT + (COUNT - 1) * W_TRAVEL;

const STOPS = [
  "The Turntable",
  "The Hoist",
  "The Engine Room",
  "The Fab Corner",
  "The Dyno",
  "The Office",
  "The Door",
] as const;

/** Scroll progress that lands mid-orbit for station `i`. */
function progressFor(i: number) {
  return (i * (W_ORBIT + W_TRAVEL) + W_ORBIT * 0.5) / TOTAL;
}

export function CinemaRail() {
  const [active, setActive] = useState(0);
  const [travelling, setTravelling] = useState(false);
  /* The rail is film furniture for the walk-through only: it fades away while
     the hero film or the DOM sections own the viewport. */
  const [near, setNear] = useState(false);
  const lastS = useRef(0);
  const activeRef = useRef(0);
  const travelRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return subscribe((s) => {
      // Which orbit owns this stretch of the film.
      const near = Math.min(Math.floor(s + (1 - ORBIT_SPAN) * 0.5 + 0.325), COUNT - 1);
      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
      // Letterbox: in a travel phase AND actually moving.
      const frac = s - Math.floor(s);
      const inTravel = frac > ORBIT_SPAN + 0.04 && frac < 0.97 && s < COUNT - 1;
      const moving = Math.abs(s - lastS.current) > 0.0008;
      lastS.current = s;
      const on = inTravel && moving;
      if (on !== travelRef.current) {
        travelRef.current = on;
        setTravelling(on);
      }
    });
  }, []);

  useEffect(() => {
    const runway = document.getElementById(RUNWAY_ID);
    if (!runway) return;
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "-15% 0px -15% 0px" },
    );
    io.observe(runway);
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    // Runway-relative: progress 0 → 1 spans #walkthrough-runway alone.
    const m = measureRunway();
    const top = m.top + progressFor(i) * m.span;
    // Through Lenis when it drives the page — a bare window.scrollTo leaves
    // its internal position stale and the next settle lurches backward.
    const lenis = (
      window as unknown as {
        __lenis2240?: { scrollTo: (t: number, o?: object) => void };
      }
    ).__lenis2240;
    if (lenis) {
      lenis.scrollTo(top, {
        duration: 1.6,
        easing: (t: number) =>
          t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
      });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className={travelling ? "cine-on" : ""}>
      {/* The letterbox */}
      <div className="cine-bar cine-bar-top" aria-hidden="true" />
      <div className="cine-bar cine-bar-bottom" aria-hidden="true" />

      {/* The station rail */}
      <nav
        aria-label="Shop tour stations"
        data-near={near}
        className={`station-rail fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-4 transition-opacity duration-700 lg:flex ${
          near ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {STOPS.map((name, i) => (
          <button
            key={name}
            type="button"
            data-active={active === i}
            onClick={() => jump(i)}
            aria-label={`Go to ${name}`}
          >
            <span className="label font-sub text-[10px] uppercase tracking-[0.28em] text-steel">
              {name}
            </span>
            <span className="tick" aria-hidden="true" />
          </button>
        ))}
      </nav>
    </div>
  );
}

export default CinemaRail;
