"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/Logo";
import { PageFx } from "@/components/fx/PageFx";

/**
 * Route veil — every navigation opens on a black panel with the tungsten
 * badge flickering once (the preloader's language, compressed to 150ms),
 * then the panel lifts. Entrance-only: App Router templates remount per
 * navigation, so this plays on arrival without holding the old page hostage.
 * The veil never wraps the page in a transform (fixed/sticky children of the
 * film must keep their containing block).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  // Safety: never let the veil outlive its welcome.
  useEffect(() => {
    const id = window.setTimeout(() => setGone(true), 1400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      {children}
      <PageFx />
      {!gone && !reduced && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => setGone(true)}
          className="route-veil pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-bay-black"
          aria-hidden="true"
        >
          <div className="tube-on" style={{ animationDuration: "150ms" }}>
            <Badge className="h-20 w-auto opacity-90" hole="#0a0a0b" title="" />
          </div>
        </motion.div>
      )}
    </>
  );
}
