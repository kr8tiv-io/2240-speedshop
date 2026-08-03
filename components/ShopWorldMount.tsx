"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The gate in front of the shop.
 *
 * Next 16 forbids `next/dynamic` with `ssr: false` inside a Server Component,
 * so the client boundary owns the client-only mount: this component
 * server-renders to `null`, then decides on the client whether this machine
 * should be running a WebGL scene at all. Nothing is imported until it says
 * yes, so phones never download three.js and never pay for a decision they lose.
 *
 * The site behind it is complete without this. Everything the reader — or an
 * answer engine — needs is server-rendered HTML in front of the canvas.
 */
const ShopWorld = dynamic(() => import("./ShopWorld").then((m) => m.ShopWorld), {
  ssr: false,
  loading: () => null,
});

type Verdict = "idle" | "run" | "skip";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

type CapableNavigator = Navigator & { deviceMemory?: number };

export function ShopWorldMount() {
  const [verdict, setVerdict] = useState<Verdict>("idle");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const width = window.matchMedia("(min-width: 768px)");

    const decide = () => {
      const nav = navigator as CapableNavigator;
      const cores = nav.hardwareConcurrency ?? 4;
      // `deviceMemory` is Chromium-only; absence is not evidence of a weak
      // machine, so it defaults to "fine" rather than locking Safari out.
      const memory = nav.deviceMemory ?? 8;

      const capable =
        width.matches &&
        !motion.matches &&
        cores >= 4 &&
        memory >= 4 &&
        hasWebGL();

      // Phones, low-core laptops and anyone who asked for less motion keep the
      // photographic site exactly as it is today. That is the first-class
      // experience, not a fallback.
      setVerdict(capable ? "run" : "skip");
    };

    decide();
    motion.addEventListener("change", decide);
    width.addEventListener("change", decide);
    return () => {
      motion.removeEventListener("change", decide);
      width.removeEventListener("change", decide);
    };
  }, []);

  if (verdict !== "run") return null;
  return <ShopWorld />;
}

export default ShopWorldMount;
