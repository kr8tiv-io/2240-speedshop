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
 *   data-fx="h"     → masked line rise on arrival (H1s)
 *   data-fx="mask"  → clip-path sweep + scale settle on scroll-in (figures)
 * Plus: every .weld hairline draws itself in, and breadcrumbs settle.
 * Easing discipline: entrances power4.out ~1s; scroll reveals once-only.
 */
export function PageFx() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

      // Hairlines draw themselves in as they enter.
      for (const weld of gsap.utils.toArray<HTMLElement>(".weld")) {
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

      // Display echoes (outside the film): the outline layer drifts against
      // its bone face across the element's viewport traversal.
      for (const echo of gsap.utils.toArray<HTMLElement>("[data-echo]")) {
        gsap.fromTo(
          echo,
          { yPercent: 6 },
          {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: echo.parentElement ?? echo,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }
    });

    /* VELOCITY SKEW: REMOVED, deliberately and entirely.
       Gallery wrappers used to shear with Lenis velocity (±3°, sprung back
       through a lerp). The client's read, twice, was unambiguous: "the images
       come in on an angle... every time I scroll they turn into an angle and
       flutter. That whole effect does not work at all." He is right — with a
       mouse wheel the velocity arrives in spikes, so instead of one graceful
       shear the image RATTLES around zero at every wheel notch, and because
       the skew rides the wrapper, it also fights any entrance animation the
       image is mid-way through. If a shear ever comes back it must be driven
       by smoothed scroll DELTA, not instantaneous velocity — but default to
       images that simply hold their shape. */

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={ref} className="hidden" aria-hidden="true" />;
}

export default PageFx;
