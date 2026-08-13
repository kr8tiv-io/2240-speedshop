"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom cursor: a small bone dot in mix-blend-difference that eases after the
 * pointer, plus a trailing hairline ring on a slower spring — the elastic lag.
 * Context morphs:
 *   - interactive targets → the dot swells (ring stands down)
 *   - [data-cursor="view" | "scroll" | ...] → ring swells and carries the word
 *   - text inputs → everything hides for the native caret
 *   - click → the ring compresses and springs back
 * Fine pointers only — the CSS hides both on touch, and this component never
 * mounts listeners there. Magnetic pull for `data-magnetic` lives here too.
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
    // The ring trails on a longer spring — slight elastic lag.
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power4.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power4.out" });

    const INTERACTIVE = "a, button, [role='button'], input, select, textarea, summary, label";
    const CARET = "input:not([type='button']):not([type='submit']), textarea, select, [contenteditable='true']";

    const setBoth = (cls: string, on: boolean) => {
      dot.classList.toggle(cls, on);
      ring.classList.toggle(cls, on);
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
      const target = e.target as Element | null;

      const caret = target?.closest?.(CARET);
      setBoth("is-caret", Boolean(caret));

      const ctx = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (ctx && !caret) {
        const word = ctx.getAttribute("data-cursor") || "";
        if (label.textContent !== word) label.textContent = word;
        setBoth("is-label", true);
        setBoth("is-hover", false);
        return;
      }
      setBoth("is-label", false);
      const hot = !caret && target?.closest?.(INTERACTIVE);
      setBoth("is-hover", Boolean(hot));
    };
    const onLeave = () => setBoth("is-hidden", true);
    const onEnter = () => setBoth("is-hidden", false);

    /* Click: the ring compresses, then springs back with a soft overshoot. */
    const onDown = () => {
      gsap.to(ring, { scale: 0.78, duration: 0.16, ease: "power3.out", overwrite: "auto" });
      gsap.to(dot, { scale: 0.85, duration: 0.16, ease: "power3.out", overwrite: "auto" });
    };
    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
      gsap.to(dot, { scale: 1, duration: 0.4, ease: "back.out(2.4)", overwrite: "auto" });
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
      <div ref={ringRef} className="cursor-ring is-hidden" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot is-hidden" aria-hidden="true" />
    </>
  );
}

export default Cursor;
