"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Kinetic } from "@/components/fx/Kinetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ReviewQuote = { text: string; when: string };

/**
 * The reviews section as a pinned beat: the three Google quotes swap with
 * mask-wipes under a huge Fraunces quotation mark; mono attribution plates
 * slide with each quote. The server HTML is the honest stacked list — GSAP
 * matchMedia upgrades it to the pinned stage on desktop only, so touch,
 * reduced-motion, crawlers, and no-JS all read three verbatim quotes.
 */
export function ReviewsBeat({ quotes }: { quotes: ReviewQuote[] }) {
  const wrapRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = wrap.querySelector<HTMLElement>("[data-beat-stage]");
        const figures = gsap.utils.toArray<HTMLElement>("[data-beat-quote]", wrap);
        if (!stage || figures.length < 2) return;

        wrap.classList.add("beat-on");

        // All quotes stacked; only the first visible.
        gsap.set(figures, { clipPath: "inset(0% 0% 0% 0%)" });
        figures.forEach((f, i) => {
          if (i > 0) gsap.set(f, { clipPath: "inset(100% 0% 0% 0%)" });
        });

        // One scrubbed timeline: wipe i out upward while i+1 wipes in from
        // below — the mask never shows paper between quotes.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        for (let i = 0; i < figures.length - 1; i++) {
          const at = i * 10 + 4; // hold 4 beats, swap over 5
          tl.to(figures[i], { clipPath: "inset(0% 0% 100% 0%)", duration: 5 }, at);
          tl.to(figures[i], { y: -34, duration: 5 }, at);
          tl.fromTo(
            figures[i + 1],
            { clipPath: "inset(100% 0% 0% 0%)", y: 34 },
            { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 5 },
            at + 1.2,
          );
        }
        tl.to({}, { duration: 4 }); // exit hold

        // The quotation mark drifts slower than the quotes — depth.
        gsap.fromTo(
          wrap.querySelector("[data-beat-mark]"),
          { yPercent: -6 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top top", end: "+=220%", scrub: 1.2 },
          },
        );

        return () => {
          wrap.classList.remove("beat-on");
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef },
  );

  return (
    <section
      ref={wrapRef}
      aria-labelledby="reviews-heading"
      data-tone="#f4f3ef"
      className="reviews-beat relative overflow-hidden px-5 py-28 sm:px-8"
    >
      {/* the giant serif quotation mark — Fraunces, barely-there ink */}
      <span
        aria-hidden="true"
        data-beat-mark
        className="pointer-events-none absolute -top-10 left-2 select-none font-serif text-[clamp(14rem,34vw,30rem)] italic leading-none text-[#141414]/[0.055] sm:left-6"
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-[92rem]">
        <p className="corner-note text-tungsten">WORD GETS AROUND</p>
        <Kinetic
          as="h2"
          id="reviews-heading"
          className="mt-4 font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-wide text-bone"
        >
          Car people are not essayists.
        </Kinetic>
        <p className="mt-5 max-w-2xl font-body text-sm leading-relaxed text-steel">
          Three Google reviews with words in them, verbatim. The rest of the honest picture is on
          the{" "}
          <Link
            className="text-tungsten underline decoration-tungsten/40 underline-offset-4 hover:text-ember"
            href="/reviews"
          >
            reviews page
          </Link>
          .
        </p>

        {/* Stacked by default (SSR / touch); grid-stacked stage when pinned. */}
        <div data-beat-stage className="mt-14 space-y-10">
          {quotes.map((q, i) => (
            <figure
              key={q.text}
              data-beat-quote
              className={`max-w-3xl border-l border-tungsten/30 pl-6 sm:pl-8 ${
                i === 1 ? "sm:ml-[24%]" : i === 2 ? "sm:ml-[9%]" : ""
              }`}
            >
              <blockquote>
                <p className="font-display text-2xl uppercase leading-tight tracking-wide text-bone sm:text-4xl lg:text-5xl">
                  &ldquo;{q.text}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-5 inline-flex items-baseline gap-3 border border-[#141414]/14 bg-panel/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
                <span className="text-tungsten">0{i + 1}</span>
                {q.when}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsBeat;
