# 2240 "DAYLIGHT" — COUTURE PASS (round 3)

Client verdict: good bones — now take it to absolute top-tier agency craft. The bar is
K72 / Obys / Lusion / OFF+BRAND site-of-the-year work: layered, haute-couture,
obsessed-over. This is an ELEVATION of the existing cinematic white-studio site in
C:\Users\lucid\Desktop\2240-v-white — do not restructure the film or the routes;
enrich every layer of it. Its dark sibling (2240-v-dark) gets a parallel pass from
another agent — do NOT touch that folder. Read C:\Users\lucid\Desktop\2240-ELEVATION-RESEARCH.md
for shader/motion recipes; read AGENTS.md + node_modules/next/dist/docs before coding.

## MUST NOT BREAK (verify all still work when you finish)
- Preloader + route-veil layered failsafes (React cap, raw-DOM escape, CSS dead-man),
  CarBoundary, Draco car + /draco/ self-hosted decoder.
- The MOBILE CAR-FIT dials in HeroScene (MOBILE_FOV 42, MOBILE_CAR_SCALE 0.62,
  MOBILE_CAM_PUSH 1.6, MOBILE_MIN_DIST 9.4 clamp) — whole car must stay visible with
  breathing room through the ENTIRE orbit at 390px. Re-verify with
  scratchpad\orbit-check.js after any hero change.
- PerformanceMonitor quality ladders, IO-gated GL layers, multisampling 0,
  frozen matrices, mobile Bloom-only composer, DPR caps.
- Honesty rule content (lib/site.ts, lib/builds.ts verbatim), JSON-LD, kr8tiv credit.

## ART DIRECTION — "atelier daylight"
White studio couture: paper, ink, one red. The richness comes from LAYERING and
CRAFT, not more color. Fraunces (the serif from v1) may return as an ACCENT ONLY —
one italic serif word inside select Anton headlines (e.g. "Customs and *Classics*."),
the couture signature. Everything else stays Anton/Archivo/Plex Mono.

## THE UPGRADE LIST (do all; adapt with taste)

### Typography & layout depth
1. Display interplay: key headlines get a layered treatment — solid ink face with an
   offset 1px-stroke outline echo (transform-offset on scroll for depth), and the one
   italic Fraunces accent word. Hero + chapter titles + closing CTA.
2. Char-roll hovers on ALL nav/text links: stacked duplicate label, letters roll up
   with 0.02s char stagger on hover (GSAP or CSS). Kill any plain color-change hovers.
3. The footer becomes a destination: giant interactive wordmark (chars lift/settle on
   pointer proximity), hairline-divided columns, oversized page-links with char-roll,
   mono coordinates strip. On white this should feel like the colophon of a monograph.
4. Mono annotation layer sitewide: corner coordinates, chapter codes, drawn hairline
   rules (scaleX in-view — exists, extend to all sections), figure numbers on images
   (FIG. 01 — plates that slide in).
5. A chapter HUD on the home film: fixed mono indicator "CH. 00 / 03" that ticks as
   chapters pass, with a 1px progress rule. Tiny, elegant, top-right under the nav.

### WebGL richness (hero scene)
6. Paint, couture tier: two-tone candy shift — subtle fresnel-driven hue shift on the
   red (deeper oxblood at grazing angles, brighter red face-on) via onBeforeCompile
   tweak or a cheap custom lighting mix; add a very fine flake sparkle using a tiled
   noise normal-perturbation (desktop only, gate by quality level).
7. Chapter light states: each chapter gets its own lighting mood — GSAP-tween 2-3
   scene uniforms/light intensities with the master timeline (e.g. ch0 full studio,
   ch1 warmer key + tighter beam, ch2 cooler rim + higher contrast, ch3 bright
   overhead). Subtle — the room breathes as you scroll.
8. Particles: layered two-depth system — near motes (larger, softer, slight DOF-blur
   sprite) + far dust (small, sharp), both with size attenuation, drifting through
   the skylight beam, scroll-velocity stir kept. Desktop 2x current count max;
   mobile stays 0.
9. One NEW set-piece beat mid-film (ch.1→ch.2 transition): the car briefly renders a
   "blueprint ghost" — a wireframe/x-ray overlay pass (second wireframe material,
   opacity 0→0.5→0 over the transition, ink-blue-grey lines on white) as mono
   annotations flash measurement callouts. The workshop-drawing moment. Cheap:
   one extra draw of the same geometry, gated to desktop + top two quality levels.
10. Post: add a gentle large-radius vignette-of-focus — screen-edge softness via the
    existing composer (cheap blur mix at edges) desktop-only; refine grain to 0.028;
    keep velocity-CA.

### Scroll choreography
11. Section tone handoffs: page background subtly shifts between paper tones per
    section (#FAFAF8 → #F4F3EF → #FFFFFF stage) via ScrollTrigger-tweened CSS var —
    the light follows the scroll. Ensure GL cyc + veils still match (single source
    of truth for the hex).
12. Build gallery velocity-skew: the flowmap image planes (or their DOM wrappers) get
    a subtle skewY from Lenis velocity (clamp ±3deg, spring back) — the K72 signature.
13. Reviews section: pinned beat — the three Google quotes swap with mask-wipes and
    huge serif quotation mark, mono attribution plates.
14. Services index: rows enter with drawn rules + numbers counting from 00, image
    plane reveals stagger against text (two-speed parallax between columns).

### Micro-interactions
15. Cursor: context morphs — VIEW (gallery), DRAG (any horizontal rail), text-caret
    hide over inputs; trailing ring with slight elastic lag; scale-pulse on click.
16. Buttons: fill-sweep hover (ink fills from left, label swaps to paper, arrow
    glyph slides in), pressed state compresses 0.98. All CTAs sitewide.
17. Nav: after 100px scroll, morphs to a compact hairline bar (backdrop paper at
    92% + hairline bottom); active-page underline draws; hover = char-roll.
18. Images: unified plate treatment — mono caption plates slide up on hover,
    FIG numbers, hairline offset frame on the mat (exists — refine consistency).

## PERFORMANCE GATES (hard)
- No new fullscreen passes on mobile. Every new effect gated by quality level and/or
  desktop check. Set-piece + flake + focus-edge = desktop only.
- Verify on the STATIC EXPORT with the probe (test server on port 4121, kill after;
  NEVER touch ports 4111/4112):
  node "C:\Users\lucid\AppData\Local\Temp\claude\C--Users-lucid-Desktop\2b72fc5c-deb3-4e3f-99ea-c3955411ec25\scratchpad\fps-real.js" http://localhost:4121
  node "...same..." http://localhost:4121 mobile
  Targets: ≥55/55 desktop hero/scroll, ≥40 mobile scroll @4x throttle.
- node "...scratchpad\orbit-check.js" http://localhost:4121 orbit-white-couture →
  inspect all 5 frames: whole car visible at 390px every beat.
- Zero horizontal overflow at 390/768/1440. Touch fallbacks for every new hover.
- `pnpm build` AND `$env:EXPORT='1'; pnpm build` both pass; run EXPORT LAST so out/
  is the final build (the live 4111 server serves it — do not restart it).

Report: per-item what shipped (honest list of any skipped + why), fps + orbit
results, build results.
