# 2240 VERSION A — "DAYLIGHT" RELIGHT (white sibling of AFTER HOURS)

The client killed the editorial-minimal white version: "really boring." New direction:
Version A must be ESSENTIALLY THE SAME EXPERIENCE as the dark cinematic version —
same preloader-into-film structure, same scroll-as-camera chapters, same WebGL car
drama, reflections, kinetic type, flowmap hovers, marquee, process rail, route veil —
but re-lit as a BRIGHT WHITE STUDIO/GALLERY. The shop film at 10am with the bay door
open: airy, clean, expensive. Not a stripped minimal page — the full film, in daylight.

This folder now contains a full transplant of the dark codebase (app/, components/,
lib/, scripts/ mirrored from 2240-v-dark, postprocessing dep installed, port 3111).
Your job is the RE-LIGHT pass. Do not restructure the film — re-palette, re-light,
re-grade it. Someone who saw both versions should say "same site, opposite lighting."

## Palette (locked)
- Page/stage: paper `#FAFAF8`, pure `#FFFFFF` for the studio cyc. NEVER flat white —
  keep the grain overlay but re-tuned as PAPER grain (fine, ~3-4%, multiply/soft-light
  so it darkens slightly rather than lightens; kill the heavy dark vignette, replace
  with a barely-there edge falloff).
- Ink `#141414`, secondary `#6b6b68`, hairlines `#E5E5E3`.
- ONE accent: speed-red `#a02d2d` (the brand red) at <5% coverage — chapter labels,
  live nav state, CTA border, one glow moment. The tungsten amber system is retired
  on this version — sweep every `#ffb066`/`#ffd9ad`/tungsten token to the new system
  (map: tungsten accents → speed-red where it's a highlight, ink/secondary where it
  was just warm text). No amber remnants (grep to verify).
- Buttons/CTAs: ink text, hairline borders, red hover states. The "backlit" hover
  language inverts: instead of a warm pool of light behind, elements get a soft
  paper-shadow lift (translateY -2px + soft neutral shadow bloom) + red accent
  activation. Keep it as THE sitewide hover language, same timings.

## Hero scene re-light (components/home/HeroScene.tsx — the core of this job)
- White infinite cyc: scene background + fog to match `#FFFFFF`→`#FAFAF8` (fog fades
  the floor into the page, same trick as the dark version, inverted).
- Lighting: studio softboxes, not one lamp — re-rig the Lightformer Environment as a
  bright white light-box (big soft ceiling panel, two side strips, floor bounce) so
  the RED car paint carries the frame as the darkest, richest object on white.
  Clearcoat paint stays; push envMapIntensity so the body line gets long white
  streaks. On white, the car reads by SHADOW + reflection, not rim-light: strong soft
  contact shadow under the car (dark AO pool), reflective floor kept —
  MeshReflectorMaterial re-tuned as glossy white studio floor (white base color, low
  mixStrength ~8-15, mirror 0, same 512 res + mobile fallback plane in white).
- The volumetric lamp cone → a SOFT SKYLIGHT BEAM: near-white shaft (barely visible,
  large, soft-edged, maybe 4-6% opacity) angled like light through a high window;
  dust motes stay but re-colored to read as bright dust in the beam (dark specks
  won't work — use white sparks at low opacity against the slightly darker beam edge,
  or drop particle opacity so they only read inside the beam).
- Bloom: keep the composer but re-tune — on white, bloom only reads on speculars;
  lower strength, keep it on the paint highlights + one red emissive detail
  (taillights become the red bloom accents instead of headlights — red glow on white
  is the signature shot). Scroll-velocity chromatic aberration stays (subtle).
- Headlight first-scroll flare → taillight red pulse (same trigger, inverted color
  logic).
- The scroll-as-camera chapters, timings, and camera keyframes stay EXACTLY as they
  are. Chapter text: ink on white, red chapter numerals.

## Everything else (sweep, don't rebuild)
- globals.css: rewrite the token layer for the white system; keep every structural
  class/utility name so components keep working (backlit/plate/etc. get the inverted
  implementations described above). Kill `color-scheme: dark`.
- Preloader: white screen, mono ink counter, badge flicker in ink with one red
  stutter frame. Route veil: paper panel, ink wordmark (same flicker language, re-lit).
- Kinetic Anton type: ink on white. Where display type overlaps the canvas, verify
  contrast against the white scene (ink type over white cyc works; add a whisper of
  text-shadow only if needed — prefer none).
- GLImagesLayer: keep flowmap + velocity RGB shift + reveal; the in-shader night
  grade must become a bright editorial grade (lift shadows slightly, keep contrast,
  saturation ~0.9 — match a clean magazine look; update the CSS `.graded` twin to the
  same values). Flashlight hover inverts: images sit at full brightness; the cursor
  pool adds a subtle warm lift + the rest dims a TOUCH (0.92) — inverted flashlight.
- Marquee, process rail (outlined numerals → ink outlines), custom cursor
  (mix-blend-difference still works on white), magnetic CTAs: keep, re-color.
- Interior pages: same re-light sweep — dark plates → white plates with hairline
  borders + shadow-lift hovers; verify EVERY route renders in the new palette with
  zero dark remnants (systematically: home, services+6, builds+5, about, reviews,
  faq, quote, contact, edmonton+4, guides+3, 404).
- Metadata/theme-color/manifest hints that say dark → update.

## Performance (non-negotiable — the machinery you built stays)
- multisampling 0, antialias false, DPR caps, IO-gated GLImagesLayer frameloop,
  frozen car matrices, mobile composer = Bloom only, PerformanceMonitor quality
  ladder — all preserved through the re-light.
- Verify with the probe on the static export (targets: ≥55fps desktop hero+scroll,
  ≥40fps mobile scroll at 4x throttle):
  node "C:\Users\lucid\AppData\Local\Temp\claude\C--Users-lucid-Desktop\2b72fc5c-deb3-4e3f-99ea-c3955411ec25\scratchpad\fps-real.js" http://localhost:4114
  node "...same path..." http://localhost:4114 mobile
  (serve YOUR test export on 4114: `python -m http.server 4114 --directory out`;
  kill it when done. Ports 4111/4112 belong to the live preview servers — do NOT
  touch them or their processes.)
- 390px: zero horizontal overflow; touch fallbacks stay.

## Definition of done
- `pnpm build` AND `$env:EXPORT='1'; pnpm build` pass with zero errors; the final
  `out/` is the relit build (the port-4111 server serves it live — leave the fresh
  out/ in place, never restart that server).
- Real-browser check at 1440 + 390 of home, one build, one service, about.
- No tungsten/dark remnants (grep #ffb066, #0a0a0b, tungsten, etc.).
- Report: what changed per area, fps numbers, build results.
