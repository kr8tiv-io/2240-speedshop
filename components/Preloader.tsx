"use client";

import { useEffect, useState } from "react";
import { subscribeBoot } from "./shop/boot";

/**
 * THE COLD START, made visible — AND UNABLE TO OUTSTAY ITS WELCOME.
 *
 * The plate is a two-second beat at the door: the shop's own ritual, over a
 * page that is already complete underneath it. Behind it is the hero
 * photograph and the full server-rendered site — exactly what a reader with no
 * WebGL gets — and the 3D shop cross-fades in over that photograph when it can
 * genuinely hold frame rate (`--hero-reveal`, driven by the same boot channel).
 *
 * THE FADE IS CSS, NOT JAVASCRIPT, AND THAT IS THE WHOLE POINT.
 * The previous version lifted the plate on a `setTimeout` and a React state
 * change. Both are main-thread work, and the main thread during those seconds
 * is exactly where the shop is compiling its shaders — so a screencast of the
 * live site on a phone caught the plate STILL UP AT TEN SECONDS, sitting on a
 * black screen counting "88%". The reader's verdict on that is "it's broken",
 * and they are right.
 *
 * A CSS animation runs on the compositor. It cannot be delayed by anything
 * JavaScript is doing, which means the worst case for the reader is now
 * bounded no matter how busy the GPU or the main thread gets. JavaScript still
 * unmounts the plate afterwards, but by then it has been invisible for a while
 * and nobody is waiting on it.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(
    () =>
      subscribeBoot((s) => {
        setProgress((current) => (s.progress > current ? s.progress : current));
      }),
    [],
  );

  // Purely bookkeeping: the plate is already invisible by CSS long before this.
  useEffect(() => {
    const timer = window.setTimeout(() => setGone(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (gone) return null;

  const value = Math.min(Math.round(progress * 100), 100);

  return (
    <div aria-hidden="true" className="preloader-plate" data-testid="preloader">
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
          className="preloader-bar h-full bg-speed-red"
          style={{ boxShadow: "0 0 12px rgba(224,69,69,0.8)" }}
        />
      </div>
    </div>
  );
}

export default Preloader;
