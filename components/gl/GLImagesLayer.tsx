"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getImageEntries, subscribeImages } from "./registry";

const LazyGLImagesRuntime = dynamic(
  () => import("./GLImagesRuntime").then((module) => module.GLImagesRuntime),
  { ssr: false, loading: () => null },
);

/**
 * Lightweight root observer. Three, R3F, the flowmap FBOs and image textures
 * stay outside the opening graph until a registered image is actually near.
 */
export function GLImagesLayer() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowEnd = memory !== undefined && memory <= 4;
    if (fine && wide && !reduced && !lowEnd) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let observer: IntersectionObserver | null = null;
    const near = new Set<Element>();

    const sync = () => {
      observer?.disconnect();
      near.clear();
      const entries = getImageEntries();
      if (entries.length === 0) {
        setActive(false);
        return;
      }
      observer = new IntersectionObserver(
        (records) => {
          for (const record of records) {
            if (record.isIntersecting) near.add(record.target);
            else near.delete(record.target);
          }
          const isNear = near.size > 0;
          setActive(isNear);
          if (isNear) setMounted(true);
        },
        { rootMargin: "280px 0px" },
      );
      for (const entry of entries) observer.observe(entry.el);
    };

    sync();
    const unsubscribe = subscribeImages(sync);
    return () => {
      unsubscribe();
      observer?.disconnect();
    };
  }, [enabled]);

  if (!enabled || !mounted) return null;
  return <LazyGLImagesRuntime active={active} onContextLost={() => setEnabled(false)} />;
}

export default GLImagesLayer;
