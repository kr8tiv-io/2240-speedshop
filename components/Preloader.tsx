"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeBoot } from "./shop/boot";

/**
 * THE COLD START, made visible.
 *
 * The plate holds for exactly one thing: the establishing shot and the hoist —
 * two bays, downloaded, transcoded and SHADER-COMPILED. The other five stream
 * in behind the reader while the cold start plays, so this is a readable beat
 * at the door rather than the ninety-megabyte wait it used to be.
 *
 * It reads `shop/boot`, a dependency-free module the world writes to: no
 * three, no drei, nothing that would drag the 3D chunk into first paint.
 * Machines that never mount a world say so and the plate lifts immediately;
 * a hard failsafe means a stalled fetch can never wall the reader off from the
 * page, which is complete server HTML underneath.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(Date.now());
  const shown = useRef(0);

  useEffect(
    () =>
      subscribeBoot((s) => {
        if (s.progress > shown.current) {
          shown.current = s.progress;
          setProgress(s.progress);
        }
        if (s.ready || s.skipped) setReady(true);
      }),
    [],
  );

  /* THE PLATE IS A BEAT, NOT A WAITING ROOM.
     It used to hold until the shop was ready to draw, which on an integrated
     GPU with a cold shader cache is ten to twenty seconds — Direct3D
     translating fifty-odd programs, a cost no amount of payload work removes.
     Nobody stares at a percentage for twenty seconds.
     So the plate holds for the length of the ritual and then lifts, whatever
     the GPU is doing. What is behind it is not an empty page: it is the hero
     photograph and the full server-rendered site, exactly as a reader without
     WebGL gets it. The shop dissolves in over the photograph when it is
     genuinely ready to run at frame rate (`--hero-reveal`, driven by the same
     boot channel), so the arrival is a cross-fade rather than a stall. */
  useEffect(() => {
    const beat = window.setTimeout(() => setReady(true), 4200);
    return () => window.clearTimeout(beat);
  }, []);

  useEffect(() => {
    if (!ready || leaving) return;
    // A minimum beat at the door: a plate that flashes past in 200 ms reads as
    // a glitch, and the breaker-panel moment is part of the film.
    const held = Date.now() - started.current;
    const hold = window.setTimeout(() => setLeaving(true), Math.max(260, 900 - held));
    return () => window.clearTimeout(hold);
  }, [ready, leaving]);

  useEffect(() => {
    if (!leaving) return;
    const done = window.setTimeout(() => setGone(true), 700);
    return () => window.clearTimeout(done);
  }, [leaving]);

  /* THE SCROLL LOCK IS GONE, AND IT WAS THE WORST BUG IN THE BUILD.
     While the plate held, `overflow: hidden` sat on the document — for four
     seconds of ritual plus the fade, which on a slower phone measured eight.
     A reader picks up their phone, swipes, and NOTHING MOVES. There is no
     spinner to explain it and no way to tell it from a site that has hung; it
     is indistinguishable from broken, and it is the first thing anyone does.
     The plate is a visual beat over a page that is already complete. If the
     reader scrolls through it, they arrive further down the film — which is
     exactly what scrolling is for. */

  if (gone) return null;

  const value = Math.min(Math.round((leaving ? 1 : progress) * 100), 100);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-bay-black transition-opacity duration-700 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-sub text-[11px] uppercase tracking-[0.4em] text-steel/70">
        2240 Speed Shop
      </p>
      <p className="mt-4 font-display text-7xl uppercase leading-none tracking-wide text-bone sm:text-8xl">
        {value}
        <span className="text-neon-bloom">%</span>
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-steel/60">
        Rolling up the door
      </p>
      <div className="mt-8 h-px w-56 overflow-hidden bg-steel/15">
        <div
          className="h-full bg-speed-red transition-[width] duration-300 ease-out"
          style={{ width: `${value}%`, boxShadow: "0 0 12px rgba(224,69,69,0.8)" }}
        />
      </div>
    </div>
  );
}

export default Preloader;
