"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The footer's giant wordmark: each character lifts toward the pointer with a
 * gaussian falloff and settles back on leave — paper being teased off the
 * desk. Fine pointers only; on touch it is simply the wordmark.
 */
export function FooterWordmark() {
  const wrapRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const chars = Array.from(wrap.querySelectorAll<HTMLElement>(".wordmark-char"));
    const tos = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.45, ease: "power3.out" }));

    const onMove = (e: PointerEvent) => {
      const lift = Math.min(28, wrap.offsetHeight * 0.14);
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(e.clientX - cx) / Math.max(r.width * 1.6, 1);
        tos[i](-lift * Math.exp(-d * d));
      });
    };
    const onLeave = () => tos.forEach((to) => to(0));

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      tos.forEach((to) => to(0));
    };
  }, []);

  return (
    <p
      ref={wrapRef}
      aria-label="2240"
      className="select-none font-display text-[clamp(5.5rem,17vw,16rem)] leading-[0.82] tracking-[0.01em] text-bone/[0.92]"
    >
      {["2", "2", "4", "0"].map((c, i) => (
        <span key={i} aria-hidden="true" className="wordmark-char">
          {c}
        </span>
      ))}
    </p>
  );
}

export default FooterWordmark;
