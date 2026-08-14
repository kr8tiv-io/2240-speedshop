# 2240 "AFTER HOURS" — COUTURE PASS (round 3)

Client verdict: good bones — now take it to absolute top-tier agency craft. The bar is
K72 / Obys / Lusion / OFF+BRAND site-of-the-year work: layered, haute-couture,
obsessed-over. This is an ELEVATION of the existing cinematic night-shop site in
C:\Users\lucid\Desktop\2240-v-dark — do not restructure the film or the routes;
enrich every layer. Its white sibling (2240-v-white) gets a parallel pass from another
agent — do NOT touch that folder. Read C:\Users\lucid\Desktop\2240-ELEVATION-RESEARCH.md
for shader/motion recipes; read AGENTS.md + node_modules/next/dist/docs before coding.

## MUST NOT BREAK (verify all still work when you finish)
- Preloader + route-veil layered failsafes (React cap, raw-DOM escape, CSS dead-man),
  CarBoundary, Draco car + /draco/ self-hosted decoder.
- PerformanceMonitor quality ladders, IO-gated GLImagesLayer, multisampling 0,
  frozen matrices, mobile Bloom-only composer, DPR caps.
- Honesty rule content (lib/site.ts, lib/builds.ts verbatim), JSON-LD, kr8tiv credit.

## REQUIRED PORT — mobile car-fit (currently only in the white sibling)
At 390-430px the car crops at the viewport edges. Port the exact fix from
C:\Users\lucid\Desktop\2240-v-white\components\home\HeroScene.tsx into this version's
HeroScene (read that file first — same structure): MOBILE_FOV 42 (Canvas fov
mobile?42:32), MOBILE_CAR_SCALE 0.62 wrapping the car+AO group, MOBILE_CAM_PUSH 1.6
along the look axis in Rig, MOBILE_MIN_DIST 9.4 radius clamp around FIT_POINT
(0,0.7,0). Then verify the whole car is visible with breathing room through the
ENTIRE orbit at 390px via scratchpad\orbit-check.js (5 frames). Desktop framing
must not change.

## ART DIRECTION — "atelier midnight"
The shop at night, couture tier: black, bone, one tungsten. Richness from LAYERING
and LIGHT, not more color. An italic serif accent (Fraunces via next/font) may appear
as ONE word inside select Anton headlines — the couture signature — set in tungsten.
Everything else stays Anton/Archivo/Plex Mono.

## THE UPGRADE LIST (do all; adapt with taste)

### Typography & layout depth
1. Display interplay: key headlines get a layered treatment — bone face with an
   offset 1px-stroke outline echo that parallax-drifts on scroll, and the one italic
   Fraunces accent word in tungsten. Hero + chapter titles + closing CTA.
2. Char-roll hovers on ALL nav/text links (stacked duplicate label, letters roll up,
   0.02s stagger). Kill plain color-change hovers.
3. The footer becomes a destination: giant interactive wordmark (chars lift/glow on
   pointer proximity — the backlit language), oversized page-links with char-roll,
   mono coordinates strip, one slow tungsten pool drifting behind.
4. Mono annotation layer sitewide: corner coordinates, chapter codes, drawn hairline
   rules in-view, FIG. numbers on images with sliding caption plates.
5. Chapter HUD on the home film: fixed mono "CH. 00 / 03" ticking with a 1px
   progress rule, top-right under the nav. Tungsten tick on chapter change.

### WebGL richness (hero scene)
6. Paint, couture tier: two-tone candy shift on the red — deeper oxblood at grazing
   angles, hotter red face-on (fresnel-driven hue mix via onBeforeCompile), plus fine
   flake sparkle from tiled noise normal-perturbation catching the rim light
   (desktop, top two quality levels only). The rim highlight should glitter faintly.
7. Chapter light states: GSAP-tween light/beam/env intensities per chapter on the
   master timeline — ch0 one lamp, ch1 the lamp swings warmer/tighter, ch2 a cool
   moonlight fill rises from the bay door side, ch3 lamp dims + taillight glow leads.
   The room breathes with the scroll.
8. Particles: layered two-depth embers/dust — near motes (larger, soft, slow) + far
   dust (small, sharp), size attenuation, drifting through the cone, velocity stir
   kept. Desktop max 2x current; mobile stays 0.
9. One NEW set-piece beat mid-film (ch.1→ch.2): "x-ray of the build" — wireframe
   ghost overlay on the car (tungsten-tinted lines, opacity 0→0.5→0 across the
   transition) while mono measurement callouts flash. One extra draw of the same
   geometry, desktop + top two quality levels only.
10. Post: anamorphic whisper on the emissives — a subtle horizontal streak on the
    headlight/lamp blooms (cheap: low-strength second bloom with elongated kernel or
    a tiny streak sprite at the light sources); refine grain; keep velocity-CA and
    vignette. Nothing new on mobile.

### Scroll choreography
11. Section tone handoffs: the darkness shifts subtly per section (#0a0a0b →
    #0d0b09 warm pool → back) via ScrollTrigger-tweened CSS var — pools of light
    follow the scroll. GL fog/bg must track the same var.
12. Build gallery velocity-skew: flowmap planes/wrappers get subtle skewY from Lenis
    velocity (clamp ±3deg, spring back).
13. Reviews section: pinned beat — quotes swap with mask-wipes, huge serif quotation
    mark in tungsten, mono attribution plates.
14. Services index: rows enter with drawn rules + numbers counting from 00, backlit
    pools warming as each row arrives, two-speed column parallax.

### Micro-interactions
15. Cursor: context morphs — VIEW/DRAG/caret-hide; trailing ring with elastic lag;
    click pulse. Tungsten ring over interactive elements.
16. Buttons: fill-sweep hover (tungsten fills from left, label swaps to black, arrow
    slides in), pressed 0.98. All CTAs sitewide.
17. Nav: after 100px scroll, compact hairline bar (black at 90% blur + hairline);
    active underline draws; char-roll hovers.
18. Images: unified plate treatment — mono caption plates slide on hover, FIG
    numbers, consistent masked entries.

## PERFORMANCE GATES (hard)
- No new fullscreen passes on mobile; every new effect gated by quality level/desktop.
- Verify on the STATIC EXPORT (test server port 4122, kill after; NEVER touch
  4111/4112):
  node "C:\Users\lucid\AppData\Local\Temp\claude\C--Users-lucid-Desktop\2b72fc5c-deb3-4e3f-99ea-c3955411ec25\scratchpad\fps-real.js" http://localhost:4122
  node "...same..." http://localhost:4122 mobile
  Targets: ≥55/55 desktop, ≥40 mobile scroll @4x throttle.
- node "...scratchpad\orbit-check.js" http://localhost:4122 orbit-dark-couture →
  whole car visible at 390px on every frame.
- Zero horizontal overflow at 390/768/1440. Touch fallbacks for every new hover.
- `pnpm build` AND `$env:EXPORT='1'; pnpm build` both pass; EXPORT LAST so out/ is
  final (live 4112 server serves it — do not restart it).

Report: per-item what shipped (honest skips + why), fps + orbit results, build
results.
