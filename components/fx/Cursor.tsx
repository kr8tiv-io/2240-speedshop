"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom cursor, couture grade: the bone difference-dot, plus a tungsten
 * hairline ring trailing on an elastic lag. Context morphs via `data-cursor`
 * on any ancestor — "view" / "drag" turn the dot into a labelled plate; text
 * fields hide the pair entirely (caret territory). Pointerdown fires a click
 * pulse on both layers. Fine pointers only — touch never sees any of this.
 * Magnetic pull for `data-magnetic` elements lives here too.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.28, ease: "power3.out" });
    // The ring runs on a longer clock — the elastic lag IS the luxury.
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.62, ease: "power4.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.62, ease: "power4.out" });

    const INTERACTIVE = "a, button, [role='button'], input, select, textarea, summary, label";
    const CARET = "input, textarea, select, [contenteditable='true']";

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
      const target = e.target as Element | null;
      const hot = target?.closest?.(INTERACTIVE);
      const caret = target?.closest?.(CARET);
      const ctx = (target?.closest?.("[data-cursor]") as HTMLElement | null)?.dataset.cursor;

      dot.classList.toggle("is-hover", Boolean(hot) && !ctx);
      ring.classList.toggle("is-hover", Boolean(hot));
      dot.classList.toggle("is-caret", Boolean(caret));
      ring.classList.toggle("is-caret", Boolean(caret));
      const hasLabel = Boolean(ctx) && !caret;
      dot.classList.toggle("has-label", hasLabel);
      ring.classList.toggle("has-label", hasLabel);
      if (hasLabel && ctx) label.textContent = ctx.toUpperCase();
    };

    const onLeave = () => {
      dot.classList.add("is-hidden");
      ring.classList.add("is-hidden");
    };
    const onEnter = () => {
      dot.classList.remove("is-hidden");
      ring.classList.remove("is-hidden");
    };

    // Click pulse: the dot bites down, the ring blooms once.
    const onDown = () => {
      gsap.to(dot, { scale: 0.72, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      gsap.fromTo(
        ring,
        { scale: 1 },
        { scale: 1.45, duration: 0.38, ease: "power3.out", overwrite: "auto" },
      );
    };
    const onUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.34, ease: "power3.out", overwrite: "auto" });
      gsap.to(ring, { scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    };

    /* Magnetic CTAs: the element leans toward the pointer, snaps back on exit. */
    const magnets = new Map<HTMLElement, { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> }>();
    const getMagnet = (el: HTMLElement) => {
      let m = magnets.get(el);
      if (!m) {
        m = {
          x: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }),
        };
        magnets.set(el, m);
      }
      return m;
    };

    const onMagnetMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-magnetic]") as HTMLElement | null;
      // Release every magnet the pointer is no longer inside.
      for (const [node, m] of magnets) {
        if (node !== el) {
          m.x(0);
          m.y(0);
        }
      }
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const m = getMagnet(el);
      m.x((e.clientX - rect.left - rect.width / 2) * 0.28);
      m.y((e.clientY - rect.top - rect.height / 2) * 0.28);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointermove", onMagnetMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointermove", onMagnetMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      for (const [, m] of magnets) {
        m.x(0);
        m.y(0);
      }
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring is-hidden" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot is-hidden" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}

export default Cursor;
