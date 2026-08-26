"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { splitChars } from "@/lib/split";
import { useDeferredGSAP } from "./useDeferredGSAP";

type KineticProps = {
  as?: ElementType;
  className?: string;
  id?: string;
  /** Per-char stagger in seconds. */
  stagger?: number;
  /** Delay before the reveal, seconds. */
  delay?: number;
  /** "scroll" reveals when the element enters the viewport; "mount" plays immediately. */
  trigger?: "scroll" | "mount";
  /** ONE word rendered as the italic Fraunces signature (post-split). */
  accent?: string;
  children: ReactNode;
};

/**
 * Kinetic display type: chars rise out of clipped lines with a tight stagger.
 * Text stays plain in the server HTML — the split happens client-side after
 * hydration, so crawlers and reduced-motion readers always get the real words.
 */
export function Kinetic({
  as: Tag = "h2",
  className = "",
  id,
  stagger = 0.016,
  delay = 0,
  trigger = "scroll",
  accent,
  children,
}: KineticProps) {
  const ref = useRef<HTMLElement>(null);

  useDeferredGSAP(
    (gsap, ScrollTrigger) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const chars = splitChars(el);
      if (chars.length === 0) return;

      const tween = gsap.to(chars, {
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger,
        delay,
        paused: trigger === "scroll",
      });

      if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => tween.play(),
        });
      }
    },
    { scope: ref },
  );

  // React accepts this object ref on both intrinsic and forwarded element
  // types; the hook rule cannot infer that through createElement's dynamic tag.
  // eslint-disable-next-line react-hooks/refs
  return createElement(Tag as string, { ref, id, className, "data-accent-word": accent }, children);
}

export default Kinetic;
