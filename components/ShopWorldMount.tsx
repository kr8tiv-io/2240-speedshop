"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The gate in front of the shop.
 *
 * Next 16 forbids `next/dynamic` with `ssr: false` inside a Server Component,
 * so the client boundary owns the client-only mount: this component
 * server-renders to `null`, then decides on the client whether this machine
 * should be running a WebGL scene at all — and at which tier. Nothing is
 * imported until it says yes, so a machine that cannot run the shop never
 * downloads three.js and never pays for a decision it loses.
 *
 * The site behind it is complete without this. Everything the reader — or an
 * answer engine — needs is server-rendered HTML in front of the canvas.
 */
const ShopWorld = dynamic(() => import("./ShopWorld").then((m) => m.ShopWorld), {
  ssr: false,
  loading: () => null,
});

type Verdict = "idle" | "run-full" | "run-lite" | "skip";

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
    const wide = window.matchMedia("(min-width: 1024px)");

    const decide = () => {
      const nav = navigator as CapableNavigator;
      const cores = nav.hardwareConcurrency ?? 4;
      // `deviceMemory` is Chromium-only; absence is not evidence of a weak
      // machine, so it defaults to "fine" rather than locking Safari out.
      const memory = nav.deviceMemory ?? 8;

      // Phones and tablets run the shop too — that is a hard requirement, not
      // a nice-to-have. The only machines that keep the photographic site are
      // the ones that genuinely cannot run it (no WebGL, 2 GB budget phones)
      // or asked not to (prefers-reduced-motion).
      const capable = !motion.matches && cores >= 3 && memory >= 2 && hasWebGL();

      // Everything under a desktop viewport — every phone, every tablet — gets
      // the LITE tier: same shop, same models, same rail, minus the render
      // passes a mobile GPU pays double for. Weak desktops get it too.
      const full = wide.matches && cores >= 6 && memory >= 4;

      setVerdict(capable ? (full ? "run-full" : "run-lite") : "skip");
    };

    decide();
    motion.addEventListener("change", decide);
    wide.addEventListener("change", decide);
    return () => {
      motion.removeEventListener("change", decide);
      wide.removeEventListener("change", decide);
    };
  }, []);

  if (verdict !== "run-full" && verdict !== "run-lite") return null;
  return <ShopWorld tier={verdict === "run-full" ? "full" : "lite"} />;
}

export default ShopWorldMount;
