"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type Quote = { text: string; when: string };

/**
 * The reviews beat: on desktop the quotes become a pinned sequence — each one
 * wipes in through a mask, holds, and wipes away while a huge Fraunces
 * quotation mark burns in tungsten behind them and mono attribution plates
 * slide in from the rule. Server HTML (and touch / reduced motion) is the
 * plain stacked composition, so nothing is ever lost.
 */
export function ReviewsCinema({ quotes }: { quotes: Quote[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cinema, setCinema] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (wide && !reduced) setCinema(true);
  }, []);

  useGSAP(
    () => {
      if (!cinema) return;
      const wrap = wrapRef.current;
      if (!wrap) return;

      const figures = gsap.utils.toArray<HTMLElement>("[data-quote]", wrap);
      const STEP = 10;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      figures.forEach((fig, i) => {
        const plate = fig.querySelector<HTMLElement>("[data-plate]");
        const at = i * STEP;
        if (i === 0) {
          // The first quote is already on stage when the pin catches — no
          // empty frame at the top of the beat.
          gsap.set(fig, { autoAlpha: 1, y: 0, clipPath: "inset(0 0 -6% 0)" });
        } else {
          // wipe in — mask opens downward, the quote settles up into place
          tl.fromTo(
            fig,
            { autoAlpha: 0, y: 46, clipPath: "inset(0 0 100% 0)" },
            { autoAlpha: 1, y: 0, clipPath: "inset(0 0 -6% 0)", duration: 3, ease: "power2.out" },
            at,
          );
        }
        if (plate) {
          if (i === 0) {
            gsap.set(plate, { autoAlpha: 1, x: 0 });
          } else {
            tl.fromTo(
              plate,
              { autoAlpha: 0, x: -26 },
              { autoAlpha: 1, x: 0, duration: 2, ease: "power2.out" },
              at + 1.2,
            );
          }
        }
        // wipe away — everyone but the last, which holds until release
        if (i < figures.length - 1) {
          tl.to(
            fig,
            { autoAlpha: 0, y: -38, clipPath: "inset(100% 0 0 0)", duration: 2.6, ease: "power2.in" },
            at + STEP - 3,
          );
        }
      });

      // the quotation mark breathes across the whole beat
      tl.fromTo(
        "[data-qmark]",
        { scale: 0.92, autoAlpha: 0.55 },
        { scale: 1.06, autoAlpha: 1, duration: figures.length * STEP },
        0,
      );

      // mono index ticks 01 → 03
      const index = wrap.querySelector<HTMLElement>("[data-qindex]");
      if (index) {
        for (let i = 0; i < figures.length; i++) {
          tl.call(
            () => {
              index.textContent = String(i + 1).padStart(2, "0");
            },
            [],
            Math.max(0.001, i * STEP),
          );
        }
      }
    },
    { scope: wrapRef, dependencies: [cinema] },
  );

  /* ── static composition: SSR, touch, reduced motion ─────────────────── */
  if (!cinema) {
    return (
      <div className="mt-14 space-y-10">
        {quotes.map((q, i) => (
          <figure
            key={q.text}
            className={`max-w-2xl border-l border-tungsten/30 pl-6 sm:pl-8 ${
              i === 1 ? "sm:ml-[24%]" : i === 2 ? "sm:ml-[9%]" : ""
            }`}
          >
            <blockquote>
              <p className="font-display text-2xl uppercase leading-tight tracking-wide text-bone sm:text-4xl">
                &ldquo;{q.text}&rdquo;
              </p>
            </blockquote>
            <figcaption className="corner-note mt-3">{q.when}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  /* ── the pinned beat ────────────────────────────────────────────────── */
  return (
    <div ref={wrapRef} className="relative" style={{ height: `${quotes.length * 85 + 20}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* the tungsten quotation mark — Fraunces, the serif signature */}
        <span
          data-qmark
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-0 select-none leading-none text-tungsten/20"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(14rem, 30vw, 26rem)" }}
        >
          &ldquo;
        </span>

        {/* mono instrumentation */}
        <p className="corner-note absolute right-0 top-24">
          <span data-qindex className="text-tungsten">01</span> / {String(quotes.length).padStart(2, "0")} — VERBATIM
        </p>

        {quotes.map((q) => (
          <figure key={q.text} data-quote className="absolute inset-x-0 opacity-0 pl-10 sm:pl-16">
            <blockquote>
              <p className="max-w-4xl font-display text-[clamp(2.2rem,5.2vw,4.8rem)] uppercase leading-[0.95] tracking-wide text-bone">
                &ldquo;{q.text}&rdquo;
              </p>
            </blockquote>
            <figcaption
              data-plate
              className="mt-8 inline-block border-l-2 border-tungsten/60 bg-panel/80 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-steel"
            >
              {q.when}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default ReviewsCinema;
