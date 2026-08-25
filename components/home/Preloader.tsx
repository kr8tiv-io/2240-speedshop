"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Logo";
import { getHeroBootGeneration, useHeroBootSnapshot } from "./hero-boot";

/**
 * A lightweight brand plate in front of the lazy Three runtime. Progress and
 * compile readiness arrive through hero-boot, so importing this component can
 * never evaluate drei, R3F, Three, postprocessing, or the hero model preloads.
 */
const HARD_CAP_MS = 14_000;
const ESCAPE_MS = 18_000;
const MIN_BRAND_MS = 1_200;

type Phase = "loading" | "flicker" | "exit" | "gone";
type ReadyReason = "scene" | "emergency-failed" | "emergency-hard-cap" | "emergency-css-failsafe";
type LoaderState = { phase: Phase; reason: ReadyReason | null };

export function Preloader({ onDone }: { onDone?: () => void }) {
  const boot = useHeroBootSnapshot();
  const [loader, setLoader] = useState<LoaderState>({ phase: "loading", reason: null });
  const mounted = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    mounted.current = Date.now();
  }, []);

  const beginHandoff = useCallback((reason: ReadyReason) => {
    setLoader((current) => {
      if (current.phase !== "loading" || current.reason !== null) return current;
      return { phase: "flicker", reason };
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

  /* React and raw-DOM backstops remain honest emergency paths. A suspended
     tree cannot paint state, so the final timer stamps provenance on the node
     before bypassing React and releasing the document. */
  useEffect(() => {
    const hardCap = window.setTimeout(
      () => beginHandoff("emergency-hard-cap"),
      HARD_CAP_MS,
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
      window.clearTimeout(hardCap);
      window.clearTimeout(escape);
    };
  }, [beginHandoff]);

  useEffect(() => {
    if (loader.phase === "flicker") {
      const timer = window.setTimeout(() => {
        setLoader((current) =>
          current.phase === "flicker" ? { ...current, phase: "exit" } : current,
        );
        doneRef.current?.();
      }, 1_300);
      return () => window.clearTimeout(timer);
    }
    if (loader.phase === "exit") {
      const timer = window.setTimeout(
        () =>
          setLoader((current) =>
            current.phase === "exit" ? { ...current, phase: "gone" } : current,
          ),
        600,
      );
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

  const emergency = loader.reason !== null && loader.reason !== "scene";
  const state = emergency ? `emergency-${loader.phase}` : loader.phase;
  const displayedProgress = loader.phase === "loading" ? Math.round(boot.progress) : 100;

  return (
    <div
      ref={rootRef}
      data-preloader
      data-state={state}
      data-ready-reason={loader.reason ?? undefined}
      data-progress={Math.round(boot.progress)}
      data-boot-generation={getHeroBootGeneration()}
      className={`preloader-veil fixed inset-0 z-[80] flex flex-col items-center justify-center bg-bay-black transition-[opacity,transform] duration-[600ms] ease-out ${
        loader.phase === "exit" ? "-translate-y-6 opacity-0" : ""
      }`}
      /* Once genuine scene provenance exists, the CSS dead-man must not win
         a later race during the branded flicker/exit choreography. */
      style={loader.reason === "scene" ? { animation: "none" } : undefined}
      onAnimationStart={(event) => {
        if (event.animationName === "preloader-failsafe") {
          beginHandoff("emergency-css-failsafe");
        }
      }}
      aria-hidden="true"
    >
      <div className={loader.phase === "flicker" ? "tube-on" : "opacity-[0.06]"}>
        <Badge className="h-28 w-auto sm:h-36" hole="#0a0a0b" title="" />
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex items-end justify-between px-6 sm:px-10">
        <p className="corner-note">2240 SPEED SHOP · EDMONTON AB</p>
        <p className="font-mono text-4xl tabular-nums leading-none text-bone/80 sm:text-5xl">
          {String(Math.min(displayedProgress, 100)).padStart(3, "0")}
          <span className="text-tungsten">%</span>
        </p>
      </div>
    </div>
  );
}

export default Preloader;
