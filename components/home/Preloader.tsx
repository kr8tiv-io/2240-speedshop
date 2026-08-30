"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getHeroBootGeneration, useHeroBootSnapshot } from "./hero-boot";

/**
 * A lightweight brand plate in front of the lazy Three runtime. Progress and
 * compile readiness arrive through hero-boot, so importing this component can
 * never evaluate drei, R3F, Three, postprocessing, or the hero model preloads.
 */
const PROGRESSIVE_CEILING_MS = 1_200;
const ESCAPE_MS = 3_000;
const MIN_BRAND_MS = 500;
const IGNITION_MS = 250;
const EXIT_MS = 400;

type Phase = "loading" | "ignition" | "exit" | "gone";
type ReadyReason =
  | "scene"
  | "progressive-ceiling"
  | "emergency-failed"
  | "emergency-css-failsafe";
type LoaderState = { phase: Phase; reason: ReadyReason | null };

export function Preloader({ onDone }: { onDone?: () => void }) {
  const boot = useHeroBootSnapshot();
  const [loader, setLoader] = useState<LoaderState>({ phase: "loading", reason: null });
  const [visualProgress, setVisualProgress] = useState(4);
  const mounted = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    mounted.current = Date.now();
  }, []);

  /* The expensive hero runtime intentionally starts after this overlay has
     left, so its real asset tracker is still at zero during the brand beat.
     Give the small readout a smooth warm-up sweep without pretending that it
     is byte-accurate; genuine boot progress can only move it forward. */
  useEffect(() => {
    if (loader.phase !== "loading") return;
    const started = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const warmup = Math.min(92, 4 + 88 * (1 - Math.exp(-elapsed / 430)));
      setVisualProgress((current) => Math.max(current, warmup));
    }, 80);
    return () => window.clearInterval(timer);
  }, [loader.phase]);

  const beginHandoff = useCallback((reason: ReadyReason) => {
    setLoader((current) => {
      if (current.phase !== "loading" || current.reason !== null) return current;
      return { phase: "ignition", reason };
    });
  }, []);

  /* The normal path has one exact provenance: every tracked asset is in AND
     ScenePrimer has compiled/uploaded the film. Nothing timed may claim it. */
  useEffect(() => {
    if (loader.phase !== "loading" || loader.reason !== null) return;
    if (boot.failed) {
      const timer = window.setTimeout(() => beginHandoff("emergency-failed"), 0);
      return () => window.clearTimeout(timer);
    }
    if (boot.progress < 100 || !boot.sceneReady) return;
    const wait = Math.max(0, MIN_BRAND_MS - (Date.now() - mounted.current));
    const timer = window.setTimeout(() => beginHandoff("scene"), wait);
    return () => window.clearTimeout(timer);
  }, [beginHandoff, boot.failed, boot.progress, boot.sceneReady, loader]);

  /* A short visual ceiling is a normal progressive handoff, not an emergency:
     the server-rendered hero still is already underneath this plate and the
     verified live canvas will crossfade over it when its real first frame is
     ready. The raw-DOM timer remains the separate suspended-tree escape. */
  useEffect(() => {
    const delay = Math.max(0, PROGRESSIVE_CEILING_MS - performance.now());
    const progressiveCeiling = window.setTimeout(
      () => beginHandoff("progressive-ceiling"),
      delay,
    );
    const escape = window.setTimeout(() => {
      const veil = rootRef.current;
      if (!veil || !veil.isConnected || veil.style.display === "none") return;
      veil.dataset.readyReason = "emergency-escape";
      veil.dataset.state = "emergency-escape";
      veil.style.animation = "none";
      veil.style.display = "none";
      document.documentElement.style.overflow = "";
      doneRef.current?.();
    }, ESCAPE_MS);
    return () => {
      window.clearTimeout(progressiveCeiling);
      window.clearTimeout(escape);
    };
  }, [beginHandoff]);

  useEffect(() => {
    if (loader.phase === "ignition") {
      const timer = window.setTimeout(() => {
        setLoader((current) =>
          current.phase === "ignition" ? { ...current, phase: "exit" } : current,
        );
      }, IGNITION_MS);
      return () => window.clearTimeout(timer);
    }
    if (loader.phase === "exit") {
      const timer = window.setTimeout(() => {
        setLoader((current) =>
          current.phase === "exit" ? { ...current, phase: "gone" } : current,
        );
        /* Release the shader/model graph only after the compositor has
           finished lifting this plate. That prevents module evaluation and
           shader compilation from freezing a loader that is still visible. */
        doneRef.current?.();
      }, EXIT_MS);
      return () => window.clearTimeout(timer);
    }
  }, [loader.phase]);

  useEffect(() => {
    if (loader.phase === "exit" || loader.phase === "gone") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [loader.phase]);

  if (loader.phase === "gone") return null;

  const emergency = loader.reason?.startsWith("emergency-") ?? false;
  const state = emergency ? `emergency-${loader.phase}` : loader.phase;
  const displayedProgress = Math.round(
    loader.phase === "loading" ? Math.max(boot.progress, visualProgress) : 100,
  );

  return (
    <div
      ref={rootRef}
      data-preloader
      data-state={state}
      data-ready-reason={loader.reason ?? undefined}
      data-progress={displayedProgress}
      data-boot-generation={getHeroBootGeneration()}
      className={`preloader-veil fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bay-black transition-[opacity,transform] duration-[400ms] ease-out ${
        loader.phase === "exit" ? "-translate-y-6 opacity-0" : ""
      }`}
      /* Once genuine scene provenance exists, the CSS dead-man must not win
         a later race during the branded flicker/exit choreography. */
      style={loader.reason !== null ? { animation: "none" } : undefined}
      onAnimationStart={(event) => {
        if (event.animationName === "preloader-failsafe") {
          beginHandoff("emergency-css-failsafe");
        }
      }}
      aria-hidden="true"
    >
      <div
        data-loader-instrument
        className={`loader-instrument ${loader.phase === "ignition" ? "is-igniting" : ""}`}
      >
        <div className="loader-instrument__identity">
          <p className="loader-instrument__mark">2240</p>
          <p className="loader-instrument__meta">
            <span>EDMONTON / AFTER HOURS</span>
            <span>53.4818°N / 113.3773°W</span>
          </p>
        </div>

        <div className="loader-instrument__field" aria-hidden="true">
          <span>01</span>
          <span>SHOP SYSTEMS</span>
        </div>

        <div className="loader-instrument__rule" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.04, displayedProgress / 100)})` }} />
        </div>

        <div className="loader-instrument__status">
          <span>OPENING THE SHOP</span>
          <span className="tabular-nums">
            {String(Math.min(displayedProgress, 100)).padStart(3, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
