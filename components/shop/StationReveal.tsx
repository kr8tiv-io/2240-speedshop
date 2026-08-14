"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { runwayProgress } from "./runway";

/* ─────────────────────────────────────────────────────────────────────────────
   PULLED OUT OF THE VEHICLE.

   The panel no longer fades in — it is EXTRACTED. As the camera comes around
   a station's subject, a callout dot ignites, a leader line draws down from
   the subject's side of the frame, and the panel scales up along it, blurred
   to sharp, like a spec sheet being pulled out of the car and snapped into
   focus. The whole move is CONTINUOUS with scroll (silky, no pop): eased off
   the same damped rail the camera rides, and latched once fully revealed so
   re-reading never makes the words retreat.

   It deliberately re-derives the rail from scroll instead of asking the
   canvas: the same maths runs on machines that never mount WebGL, so the
   choreography is identical with or without the 3D shop behind it. Before
   hydration — and for every crawler — the panels are fully visible server
   HTML; this only ever animates them IN.
   ────────────────────────────────────────────────────────────────────────── */

/* Mirror of the pure maths in `shop/world.ts`, restated so this ~1 KB client
   chunk does not pull three.js into the page bundle. Keep in sync with the
   ORBIT rail: seven orbits, six travels, same phase widths, same easing,
   same damping λ. */
const COUNT = 7;
const W_ORBIT = 1.4;
const W_TRAVEL = 1.0;
const TOTAL = COUNT * W_ORBIT + (COUNT - 1) * W_TRAVEL;
const ORBIT_SPAN = 0.35;
const LAMBDA = 1.35;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Station float for a raw scroll progress — identical to `pathAt`'s return. */
export function stationOf(progress: number) {
  const scaled = clamp01(progress) * TOTAL;
  const cycle = W_ORBIT + W_TRAVEL;
  const index = Math.min(Math.floor(scaled / cycle), COUNT - 1);
  const local = scaled - index * cycle;
  if (local <= W_ORBIT || index === COUNT - 1) {
    return index + smootherstep(clamp01(local / W_ORBIT)) * ORBIT_SPAN;
  }
  return index + ORBIT_SPAN + smootherstep((local - W_ORBIT) / W_TRAVEL) * (1 - ORBIT_SPAN);
}

/* ── One shared rAF loop, however many panels subscribe ─────────────────── */

type Listener = (station: number) => void;

const listeners = new Set<Listener>();
let frame = 0;
let eased = -1; // -1: uninitialised — first tick snaps to the target.
let last = 0;

function readTarget() {
  // SECTION-SCOPED: the rail runs 0 → 1 across #walkthrough-runway, not the
  // document. `runwayProgress` keeps the camera rig's three-way iOS scroll
  // read (scrollY / root / body — the wrong ones read 0) and its clamp.
  return runwayProgress();
}

/** Set while a master loop (Lenis, in `SmoothScroll`) owns the heartbeat. */
let driven = false;

function step(now: number) {
  const target = readTarget();
  const dt = Math.min(Math.max((now - last) / 1000 || 0, 1e-4), 0.1);
  last = now;

  // λ-damped toward the raw target, exactly as the camera is — a deep-link or
  // refresh mid-page starts ON target instead of replaying the whole rail.
  eased =
    eased < 0 ? target : eased + (target - eased) * (1 - Math.exp(-LAMBDA * dt));

  const station = stationOf(eased);
  for (const listener of listeners) listener(station);
}

function tick(now: number) {
  step(now);
  pump();
  frame = (listeners.size > 0 || readers.size > 0) && !driven ? requestAnimationFrame(tick) : 0;
}

/**
 * Hand the heartbeat to the page's master loop.
 *
 * Lenis already runs a rAF to advance the scroll; the reveals must resolve
 * AFTER it in the same frame, against the position it just wrote, and a second
 * independent rAF cannot promise that ordering — it lands either side of the
 * scroll write depending on registration order, which is one of the two ways
 * this page used to look like it was stepping. Called by `SmoothScroll`.
 */
export function driveReveals() {
  driven = true;
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
  return () => {
    driven = false;
    if (listeners.size > 0 && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };
}

/* ── Read, then write ───────────────────────────────────────────────────────
   Every panel needs to know where it is on screen, and asking the document
   that question after another panel has just written a transform forces a
   synchronous layout. Seven panels interleaving reads and writes is seven
   layouts a frame — on a throttled phone that is most of the frame.

   So the tick has two halves: every panel measures, then every panel paints.
   One layout, however many panels. */

type Phase = () => void;
const readers = new Set<Phase>();
const writers = new Set<Phase>();

export function registerPanel(read: Phase, write: Phase) {
  readers.add(read);
  writers.add(write);
  // Panels mount before `SmoothScroll` claims the heartbeat (child effects run
  // first), and on a reduced-motion machine nothing ever claims it. Either way
  // the panels have to be pumped by something.
  if (!frame && !driven) {
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
  return () => {
    readers.delete(read);
    writers.delete(write);
    if (listeners.size === 0 && readers.size === 0 && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

function pump() {
  for (const read of readers) read();
  for (const write of writers) write();
}

/** One tick of the reveal rail, called from the master loop. */
export function advanceReveals(now: number) {
  if (listeners.size > 0) step(now);
  if (readers.size > 0) pump();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  if (!frame && !driven) {
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/* ── The extraction ─────────────────────────────────────────────────────────

   WHY THIS IS DRIVEN BY THE PANEL AND NOT BY THE CAMERA RAIL.

   It used to key off the shop's station float: the panel rose as the camera
   came around its orbit. That works on the layout it was tuned on and nowhere
   else. The rail is a fraction of TOTAL SCROLL, and a phone stacks the same
   copy into a document nearly twice as tall — so station 4's orbit and station
   4's paragraph stop landing at the same scroll position. Add the on-screen
   check the reveal also required, and the two conditions could simply never be
   true at once: the reader scrolled past a panel that had already decided it
   was not its turn, and the text never appeared at all. Which is exactly what
   was reported from a real phone.

   The panel's own position on screen is the honest signal. It cannot disagree
   with the layout, because it IS the layout: the pull begins as the panel
   crosses up through the bottom of the viewport and completes as it reaches
   reading height, on any width, at any document length. The choreography is
   unchanged — on desktop the camera is still coming around its orbit at that
   moment, because that is where the section sits. */

/** Viewport fractions the pull runs between: bottom edge → reading height. */
const PULL_FROM = 0.94;
const PULL_TO = 0.42;

export function StationReveal({
  station,
  children,
  className = "",
}: {
  /** The shop station this panel belongs to — same contract as `Section`. */
  station: number;
  children: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const latched = useRef(false);
  /* When the finish-latch began, 0 while the pull is still purely positional. */
  const latchFrom = useRef(0);
  const applied = useRef(-1);
  const wanted = useRef(0);
  const hasRisen = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      latched.current = true;
      setRisen(true);
      return;
    }

    /* PHASE ONE — measure. No style is written in here, by anybody, so the one
       layout the browser does at the top of the frame serves every panel. */
    const read = () => {
      if (latched.current) {
        wanted.current = 1;
        return;
      }
      const node = host.current;
      if (!node) return;
      const height = window.innerHeight || 1;
      const top = node.getBoundingClientRect().top;
      const raw = (height * PULL_FROM - top) / (height * (PULL_FROM - PULL_TO));
      wanted.current = smootherstep(clamp01(raw));
      // A panel that has been fully read never retreats — scrolling back up to
      // re-read a paragraph must not dissolve it.
      if (wanted.current >= 0.999) {
        wanted.current = 1;
        latched.current = true;
      }
    };

    /* PHASE TWO — paint. */
    const write = () => {
      const node = host.current;
      if (!node) return;
      let r = wanted.current;

      /* FINISH WHAT YOU START. The pull is positional — it completes as the
         panel reaches reading height — which means a scroll that STOPS with a
         panel low in the viewport used to park it mid-blur, half-read,
         indefinitely (the probe caught exactly that at the dyno beat). Once a
         pull is half way it now finishes on a clock: the entry choreography
         is unchanged, and no panel can ever rest blurred. One-way, like the
         read latch — re-reading must not dissolve the words. */
      if (r >= 0.05 && latchFrom.current === 0) latchFrom.current = performance.now();
      if (latchFrom.current > 0) {
        r = Math.max(r, Math.min(1, (performance.now() - latchFrom.current) / 700));
        if (r >= 1) latched.current = true;
      }

      // One write per change of ~1/300th — cheap, and skips idle frames.
      const quantised = Math.round(r * 300);
      if (quantised === applied.current) return;
      applied.current = quantised;

      // THE PULL: small, high and soft at the subject; full-size, seated and
      // sharp in the document. Origin sits up where the leader line lands.
      node.style.opacity = String(0.02 + 0.98 * r);
      node.style.transform = `translateY(${(1 - r) * 54}px) scale(${0.72 + 0.28 * r})`;
      node.style.transformOrigin = "18% -80px";
      node.style.filter = r >= 1 ? "" : `blur(${(1 - r) * 10}px)`;
      node.style.willChange = r >= 1 ? "auto" : "opacity, transform, filter";

      // The leader draws ahead of the panel — the point of contact first.
      const lead = clamp01(r * 1.9);
      if (line.current) line.current.style.transform = `scaleY(${lead})`;
      if (dot.current) dot.current.style.opacity = String(clamp01(r * 3));

      if (r > 0.55 && !hasRisen.current) {
        hasRisen.current = true;
        setRisen(true);
      }
    };

    // Paint once immediately: a panel that is already on screen at load — or
    // one the reader lands on from a deep link — must not wait for a scroll.
    read();
    write();

    return registerPanel(read, write);
  }, [station]);

  return (
    <div className="relative">
      {/* The callout: dot at the subject's edge of the frame, line drawn down
          to the panel. Decorative — hidden from the tree. */}
      <span className="callout" aria-hidden="true">
        <span ref={dot} className="callout-dot" />
        <span ref={line} className="callout-line" />
      </span>
      <div
        ref={host}
        className={className}
        data-rise={!mounted ? "ssr" : risen ? "risen" : "held"}
      >
        {children}
      </div>
    </div>
  );
}

export default StationReveal;
