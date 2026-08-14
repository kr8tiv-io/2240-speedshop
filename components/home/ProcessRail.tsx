"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Horizontal pinned process timeline (Hispano Suiza pattern): the shop's four
 * steps as a sideways track inside a sticky stage — huge outlined numerals,
 * photos sliding at parallax offsets, mono captions. Under reduced motion the
 * track simply stacks and scrolls vertically; nothing is lost.
 */
const STEPS = [
  {
    n: "01",
    title: "Talk it through",
    body: "Send photos. Tell us what the vehicle is and where you want it to end up. No sales pitch.",
    image: "/shop/IMG_0402-covered-classic.jpeg",
    alt: "A covered classic and a masked coupe sharing a bay at 2240 Speed Shop in Edmonton",
  },
  {
    n: "02",
    title: "Real scope",
    body: "Honest scope, real hours. What it needs, what it does not, and where the cost sits before a bolt moves.",
    image: "/shop/IMG_0401-stripped-blue-frame.jpeg",
    alt: "Stripped blue project shell with the front clip off on the shop floor in Edmonton",
  },
  {
    n: "03",
    title: "Build",
    body: "Metal first, then mechanical, then paint and trim. Photos as it moves, so nothing is a surprise at pickup.",
    image: "/shop/IMG_0052-red-pickup-texaco.jpeg",
    alt: "Red 1950s stepside pickup with the hood up under the Texaco neon in the 2240 bay",
  },
  {
    n: "04",
    title: "Shakedown",
    body: "Nothing leaves on a trailer of hope. It gets driven, sorted, and driven again.",
    image: "/shop/ig-D100-slide1-fullres.jpg",
    alt: "The 1960s Dodge D100 out on the road near Edmonton",
  },
];

export function ProcessRail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Below md the steps stack vertically and just scroll — no pin, no track.
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Photos drift slower than the track — parallax inside the rail.
      for (const img of gsap.utils.toArray<HTMLElement>("[data-rail-img]", wrap)) {
        gsap.fromTo(
          img,
          { x: 0 },
          {
            x: 90,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1.4,
            },
          },
        );
      }
    },
    { scope: wrapRef },
  );

  return (
    <section
      ref={wrapRef}
      aria-labelledby="process-heading"
      data-cursor="drag"
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute left-5 top-24 z-10 sm:left-8">
        <p className="corner-note text-tungsten">CH. 04 — THE PROCESS</p>
        <h2
          id="process-heading"
          className="mt-3 font-display text-3xl uppercase leading-none tracking-wide text-bone sm:text-4xl"
        >
          How a build actually goes
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex min-h-[100svh] w-full flex-col gap-14 overflow-hidden px-5 pb-16 pt-44 md:w-max md:flex-row md:items-center md:gap-0 md:overflow-visible md:py-0 md:pl-[16vw] md:pr-[12vw]"
      >
        {STEPS.map((step) => (
          <article key={step.n} className="relative flex w-full shrink-0 items-center md:w-[62vw] lg:w-[46vw]">
            <span aria-hidden="true" className="outline-num select-none text-[clamp(7rem,22vw,19rem)]">
              {step.n}
            </span>
            <div className="relative -ml-8 md:-ml-14">
              <div data-rail-img className="relative aspect-[4/3] w-[min(66vw,340px)] overflow-hidden md:w-[24vw] md:min-w-[280px]">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 66vw"
                  className="graded object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-2xl uppercase leading-none tracking-wide text-bone sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs font-mono text-[12px] leading-relaxed text-steel">
                {step.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProcessRail;
