"use client";

import { useRef } from "react";

const CHARS = ["2", "2", "4", "0"];

/**
 * The footer's giant wordmark, interactive: each numeral lifts and takes a
 * tungsten backlight as the pointer nears it — the site's backlit language
 * applied to type. Pure pointermove + CSS vars (four spans, no rAF loop);
 * touch simply sees the static wordmark.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLParagraphElement>(null);

  const setLifts = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    for (const span of el.querySelectorAll<HTMLElement>(".wordmark-char")) {
      const r = span.getBoundingClientRect();
      const dx = clientX - (r.left + r.width / 2);
      const dy = clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const lift = Math.max(0, 1 - d / (r.width * 1.9));
      span.style.setProperty("--lift", lift.toFixed(3));
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    for (const span of el.querySelectorAll<HTMLElement>(".wordmark-char")) {
      span.style.setProperty("--lift", "0");
    }
  };

  return (
    <p
      ref={ref}
      aria-label="2240"
      onPointerMove={(e) => e.pointerType === "mouse" && setLifts(e.clientX, e.clientY)}
      onPointerLeave={reset}
      className="font-display text-[clamp(4.5rem,14vw,13rem)] leading-[0.8] tracking-[0.01em] text-bone/[0.92]"
    >
      {CHARS.map((ch, i) => (
        <span key={i} aria-hidden="true" className="wordmark-char">
          {ch}
        </span>
      ))}
    </p>
  );
}

export default FooterWordmark;
