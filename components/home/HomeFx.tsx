"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

declare global {
  interface Window {
    /** Current section tone (hex) — the GL hero tracks it for fog/background. */
    __tone?: string;
  }
}

const BASE_TONE = "#0a0a0b";

/**
 * Homepage scroll choreography outside the film:
 *
 * 1. SECTION TONE HANDOFFS — sections carry `data-tone="#0d0b09"`; entering
 *    one tweens the page's `--tone` var (body background) so pools of warmth
 *    follow the scroll. `window.__tone` mirrors the value for the GL scene.
 *
 * 2. SERVICES INDEX — rows arrive with a drawn rule, numbers counting up from
 *    00, a brief backlit pool warming behind the row, and two-speed column
 *    parallax (title vs blurb drifting at different rates).
 */
export function HomeFx() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* ── 1. tone handoffs ────────────────────────────────────────────── */
      const root = document.documentElement;
      const setTone = (tone: string) => {
        window.__tone = tone;
        gsap.to(root, {
          "--tone": tone,
          duration: 1.1,
          ease: "sine.inOut",
          overwrite: "auto",
        });
      };
      for (const section of gsap.utils.toArray<HTMLElement>("[data-tone]")) {
        const tone = section.dataset.tone || BASE_TONE;
        ScrollTrigger.create({
          trigger: section,
          start: "top 52%",
          end: "bottom 48%",
          onEnter: () => setTone(tone),
          onEnterBack: () => setTone(tone),
          onLeave: () => setTone(BASE_TONE),
          onLeaveBack: () => setTone(BASE_TONE),
        });
      }

      /* ── 2. services rows ────────────────────────────────────────────── */
      const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]");
      rows.forEach((row, i) => {
        const rule = row.querySelector<HTMLElement>(".row-rule");
        const num = row.querySelector<HTMLElement>("[data-count]");
        const target = Number(num?.dataset.count ?? i + 1);

        // Progressive enhancement: the server ships drawn rules and final
        // numbers; JS rewinds them so they can perform on arrival.
        if (rule) gsap.set(rule, { scaleX: 0 });
        if (num) num.textContent = "00";

        ScrollTrigger.create({
          trigger: row,
          start: "top 88%",
          once: true,
          onEnter: () => {
            // the rule draws itself in
            if (rule) {
              gsap.to(rule, { scaleX: 1, duration: 1.05, ease: "power3.inOut", delay: 0.05 });
            }
            // the number counts from 00
            if (num) {
              const proxy = { v: 0 };
              gsap.to(proxy, {
                v: target,
                duration: 0.9,
                ease: "power2.out",
                onUpdate: () => {
                  num.textContent = String(Math.round(proxy.v)).padStart(2, "0");
                },
              });
            }
            // the pool behind the row warms, then lets go
            row.classList.add("row-warm");
            gsap.delayedCall(1.15, () => row.classList.remove("row-warm"));
          },
        });

        // two-speed column parallax — title lags, blurb leads, both subtle
        const colA = row.querySelector<HTMLElement>("[data-col-a]");
        const colB = row.querySelector<HTMLElement>("[data-col-b]");
        if (colA) {
          gsap.fromTo(colA, { y: 10 }, {
            y: -10,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.9 },
          });
        }
        if (colB) {
          gsap.fromTo(colB, { y: 22 }, {
            y: -22,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.9 },
          });
        }
      });
    });

    return () => {
      window.__tone = BASE_TONE;
      document.documentElement.style.removeProperty("--tone");
      ctx.revert();
    };
  }, []);

  return <div ref={ref} className="hidden" aria-hidden="true" />;
}

export default HomeFx;
