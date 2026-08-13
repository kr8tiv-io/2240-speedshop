"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The interior-page choreography, mounted once per route from template.tsx.
 * Opt-in via data attributes so it never fights the homepage film or the
 * Kinetic headings:
 *   data-fx="h"      → masked line rise on arrival (H1s)
 *   data-fx="mask"   → clip-path sweep + scale settle on scroll-in (figures)
 *   data-rule        → hairline draws itself in (scaleX; .weld gets it free)
 *   data-count="NN"  → mono numeral counts up from 00 when it enters
 *   data-drift="24"  → slow parallax drift (±px) against neighbouring column
 *   data-echo-scrub  → outline-echo ghost drifts on scroll for depth
 *   data-tone="#hex" → section hands the page paper tone to --paper
 *   data-skew        → wrapper leans with scroll velocity (clamped, springs back)
 * Easing discipline: entrances power4.out ~1s; scroll reveals once-only.
 */
export function PageFx() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // The paper tone is route-scoped state — always reset on arrival.
    document.documentElement.style.setProperty("--paper", "#fafaf8");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      // H1 masked rise — arrival moment, after the veil starts lifting.
      const heads = gsap.utils.toArray<HTMLElement>('[data-fx="h"]');
      if (heads.length) {
        gsap.fromTo(
          heads,
          { y: 44, clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
          {
            y: 0,
            clipPath: "inset(0 0 -12% 0)",
            autoAlpha: 1,
            duration: 1.05,
            delay: 0.3,
            ease: "power4.out",
          },
        );
      }

      // Breadcrumbs + eyebrows settle in just before the H1 lands.
      const crumbs = gsap.utils.toArray<HTMLElement>('nav[aria-label="Breadcrumb"], [data-fx="eyebrow"]');
      if (crumbs.length) {
        gsap.fromTo(
          crumbs,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.24, ease: "power3.out" },
        );
      }

      // Hairlines draw themselves in as they enter — .weld and any [data-rule].
      for (const weld of gsap.utils.toArray<HTMLElement>(".weld, [data-rule]")) {
        gsap.fromTo(
          weld,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: weld, start: "top 94%", once: true },
          },
        );
      }

      // Masked image moments.
      for (const fig of gsap.utils.toArray<HTMLElement>('[data-fx="mask"]')) {
        gsap.fromTo(
          fig,
          { clipPath: "inset(12% 8% 12% 8%)", scale: 0.965, autoAlpha: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            autoAlpha: 1,
            duration: 1.3,
            ease: "power4.out",
            scrollTrigger: { trigger: fig, start: "top 86%", once: true },
          },
        );
      }

      // Index numerals count up from 00 as their row enters.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
        const target = parseInt(el.dataset.count ?? "0", 10);
        if (!Number.isFinite(target)) continue;
        const state = { v: 0 };
        el.textContent = "00";
        gsap.to(state, {
          v: target,
          duration: 0.9,
          ease: "power2.out",
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(state.v)).padStart(2, "0");
          },
        });
      }

      // Two-speed column drift — image cells lag their text neighbours.
      if (desktop) {
        for (const el of gsap.utils.toArray<HTMLElement>("[data-drift]")) {
          const amp = parseFloat(el.dataset.drift ?? "24");
          gsap.fromTo(
            el,
            { y: amp },
            {
              y: -amp,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        }
      }

      // Outline-echo ghosts drift a hair on scroll — the layered-depth tell.
      for (const ghost of gsap.utils.toArray<HTMLElement>("[data-echo-scrub]")) {
        const trigger = ghost.closest("[data-echo-zone]") ?? ghost.parentElement ?? ghost;
        gsap.fromTo(
          ghost,
          { yPercent: 4 },
          {
            yPercent: -5,
            ease: "none",
            scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      }

      // Section tone handoffs — the light follows the scroll. One source of
      // truth: --paper on :root; body paints it, veils reset with the route.
      for (const section of gsap.utils.toArray<HTMLElement>("[data-tone]")) {
        const tone = section.dataset.tone;
        if (!tone) continue;
        const apply = () =>
          gsap.to(document.documentElement, {
            "--paper": tone,
            duration: 0.85,
            ease: "sine.inOut",
            overwrite: "auto",
          });
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: apply,
          onEnterBack: apply,
        });
      }

    });

    /* VELOCITY SKEW: REMOVED, deliberately and entirely — same call as the
       dark build. Image wrappers used to lean with scroll velocity (±3°,
       sprung back through a lerp). The client's read, twice, was unambiguous:
       images "come in on an angle... every time I scroll they turn into an
       angle and flutter. That whole effect does not work at all." With a
       mouse wheel the velocity arrives in spikes, so instead of one graceful
       lean the image RATTLES around zero at every notch, and because the skew
       rides the wrapper it also fights any entrance animation mid-flight. If
       a lean ever returns it must be driven by smoothed scroll DELTA, not
       instantaneous velocity — but the default is images that hold their
       shape. */

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={ref} className="hidden" aria-hidden="true" />;
}

export default PageFx;
