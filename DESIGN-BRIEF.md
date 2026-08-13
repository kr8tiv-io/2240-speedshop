# 2240 SPEED SHOP — VERSION B: "AFTER HOURS" (cinematic)

You are rebuilding the 2240 Speed Shop site as a **cinematic, dramatic, backlit
night-shop experience** — the shop at 11pm, one halogen lamp burning, a finished car
rim-lit in the dark. References: Lusion's GEMINI car demo, K72.ca, Obys.agency, the
Lando Norris SOTY site, Zentry's clip-path choreography. This folder is a full copy of
the existing site; the CONTENT stays, the SKIN is replaced entirely.

**CRITICAL DIFFERENTIATION**: the OLD site is "Midnight Garage" — a persistent 3D shop
world living behind ALL content with a station-based camera walk. You must NOT rebuild
that. Version B is **cinematic chapters**: a black textured stage, ONE hero WebGL
scene, massive kinetic type, light with physical sources. Different fonts, different
accent, different structure. Someone seeing both should never guess they share code.

## Non-negotiables (do not violate)

1. **Content honesty rule**: `lib/site.ts` and `lib/builds.ts` are the source of truth.
   No invented customers, prices, dates, specs. Facts never change.
2. **Footer credit on every page**: `built with ♥ by kr8tiv` → https://kr8tiv.io
3. Keep ALL routes working: home, services + 6 details, builds + 5 details, about,
   reviews, faq, quote, contact, edmonton + 4 areas, guides + 3 guides, 404.
4. Keep `lib/schema.tsx` JSON-LD emission (server-rendered HTML).
5. `next build` must pass (keep `next.config.ts` + `lib/image-loader.ts` as-is).
   Dev runs on port 3112 (`pnpm dev`).
6. **READ `AGENTS.md`**: Next.js 16.2.12 has breaking changes — read the guides in
   `node_modules/next/dist/docs/` before writing code.
7. iOS gotcha: `overflow-x: clip` on body, never plain `hidden`.
8. `prefers-reduced-motion`: crossfades instead of scrub camera; static compositions.
   Mobile: cut particle counts, cap DPR ~1.5–2.

## Design system (locked — build inside this)

- **Stage**: near-black `#0a0a0b` — but NEVER flat: film grain overlay sitewide
  (SVG feTurbulence or shader, 4–8% opacity, mix-blend overlay) + soft vignette.
  Textured black reads as cinema; flat black reads as unfinished.
- **ONE accent**: tungsten halogen **`#ffb066` → hot core `#ffd9ad`** — every glow has
  a diegetic source (the work lamp, the Texaco neon, headlights). Speed-red `#a02d2d`
  exists ONLY as the car's paint and one CTA state — never as a UI glow. No other hues.
  Type in bone `#f2f0ec` / steel `#9a9ca0`. No neon rainbow, no purple, ever.
- **Type** (next/font/google — must differ from the old site's Bebas): **Anton** for
  massive display (10–16vw uppercase, tight tracking, kinetic), **Archivo** (incl.
  Expanded weights) for subheads/UI, **IBM Plex Mono** for labels/spec data.
- **Light logic**: large areas stay genuinely dark. Ambient near 0.3, one key from
  above-behind, cool fill. Selective bloom ONLY on 2–3 emissive meshes (headlights,
  lamp tube, sign). Full-scene bloom = instant fail.
- **Structure**: no cards with borders. Content separation via pools of light —
  radial gradients rising behind panels on hover (the "backlight" hover language:
  element lifts 2px and a warm glow blooms BEHIND it, like a lamp switched on).

## The signature moves (all of these, done well)

1. **Preloader as brand moment**: black screen, mono percentage counter tied to real
   `useProgress`, the 2240 sign-badge silhouette flickers ON like a neon tube
   (2–3 stutters, then hold) — min 1.2s, max 2.5s, hands off directly into the hero.
2. **Hero — "one lamp on"**: single R3F canvas. A car GLB (`car-dodge-charger.glb` or
   `car-muscle-challenger.glb` — pick what rim-lights best) in a black void,
   readable by EDGE HIGHLIGHT only: rim/backlight key, near-zero ambient, fog
   (THREE.Fog near 12 / far 28 scale), drifting dust particles with scroll-velocity
   inertia (factor 0.15, decay 0.92) inside an analytical volumetric light cone
   (transparent cone + fresnel-falloff shader — NOT raymarching). Selective bloom
   (layers + UnrealBloomPass): headlights + lamp tube only. On first scroll the
   headlights flare once.
3. **Scroll-as-camera chapters**: 500–900vh pinned runway, ONE master GSAP
   ScrollTrigger timeline, scrub:1, ease:'none' between camera keyframes; each chapter
   = one camera move + one text reveal + one light change, SEQUENCED (text fades out
   before the next camera segment; never simultaneous). 3–4 chapters max, then the
   page continues as normal DOM sections (all copy lives in DOM — SEO).
4. **Kinetic type over WebGL**: huge Anton uppercase in the DOM layered above the
   canvas, revealed with char/line staggers (0.01–0.02s SplitText-style — build a
   small splitter, SplitText is Club GSAP) synced to the same scroll ranges.
5. **Zentry clip-path masks**: builds/services imagery revealed by animated
   `clip-path: polygon()` from a small tilted frame to full-bleed on scroll —
   DOM + GSAP only, no extra canvas.
6. **Horizontal pinned process timeline** (Hispano Suiza pattern): the shop's 4-step
   process as a pinned horizontal track — huge outlined numerals, photos sliding at
   parallax offsets, mono captions.
7. **Ink-reveal image hovers** (Obys): build cards sit dim (brightness .55); hover
   swells a soft radial "flashlight" that follows the cursor inside the image and
   lifts it to full brightness. Custom cursor: small dot, scales + inverts
   (mix-blend-difference) over interactive elements; magnetic CTA buttons
   (GSAP quickTo on pointermove).
8. **Marquee**: one continuous K72-style marquee strip (mono: `RESTORATION —
   RESTOMODS — LS SWAPS — PAINT — INTERIORS —`) at a seam between chapters. One, not
   five.
9. **Backlit panels**: services/nav items glow from behind on hover (radial tungsten
   gradient scaling up behind the element), consistent everywhere — this is THE hover
   language of the site.
10. **Real photography as cinema**: the Texaco red-stepside shot, the steel sign, the
    D100 — full-bleed, graded dark (contrast up, shadows crushed slightly, warm cast),
    with grain unifying DOM and canvas.

## AI-slop anti-checklist (instant fail if violated)

- No purple/indigo/cyan neon, no multiple saturated accents, no gradient orbs,
  no glassmorphism, no bento reflex, no centered pill-badge hero, no
  three-cards-with-icons row, no rounded-2xl shadow-lg, no Inter/Poppins/
  Space Grotesk, no sparkle/emoji icons, no fake testimonials (3 real Google quotes
  with their honest context), no uniform fade-ins, no glow on body text, no
  autoplay audio.
- Copy stays gearhead-specific. Ban: Unlock/Elevate/Seamless/Empower/Supercharge/
  "not just X, it's Y".

## Asset gotchas (verified)

- `ig-2025-09-09_model-kit-sprues-a/b.jpg` + `ig-D100-slide2-lightpatch.jpg`/
  `ig-D100-slide3.jpg` are NOT car photos — never use.
- `IMG_1954-original.png` has baked-in bars — needs zoom ~1.35 (prefer
  `car-green-coupe.jpg`).
- Old homepage "Fresh off the hoist" cards link to WRONG slugs — use real
  `lib/builds.ts` slugs.
- Cinematic-grade photos: `IMG_0052-red-pickup-texaco.jpeg` (neon!),
  `IMG_2943-original.jpeg` (steel sign), `ig-D100-slide1-fullres.jpg`,
  `shop-showroom-neon.jpg`, `IMG_0434-black-muscle-car.jpeg`.
- GLB cars available in `public/models/` (9 cars + ~100 garage props — a lamp GLB
  like `prop-lamp-caged-hanging.glb` can BE the diegetic light source).

## Taste markers (from studying aura.build's most-remixed work + Awwwards winners)

- **Extreme type-scale contrast**: 10–16vw display vs 10–12px tracked mono
  micro-labels, almost nothing in between. Never let a page live at 24–40px.
- **Mono corner annotations**: `53.4818°N -113.3773°W`, `EST. EDMONTON`, `CH. 02 —
  THE HOIST` in corners/margins. Product-code the brand voice: "2240", slashes, dots.
- **Real numbers as instrument readouts**: cost bands, hours, temperatures
  (`STARTS AT -30°C`) as mono spec strips — the gauge-cluster aesthetic is native here.
- **Headlines interact with imagery**: type clipped by the car photo, masked behind
  it, or overlapping the canvas — never just stacked above.
- **Section rhythm varies deliberately**: chapter → full-bleed still → spec strip →
  timeline. Equal blocks with equal padding = generated tell.
- **Accent at <5% coverage.** One focal object per viewport. WebGL is a background
  layer behind DOM content, never foreground spectacle competing with copy.
- **One radius language**: square corners everywhere; no pill buttons.

## Scope strategy

Homepage (preloader → hero chapters → services → builds → process timeline → reviews →
CTA) is the film. Builds index + detail and services hub + detail get the full
treatment (clip-path reveals, flashlight hovers). Interior pages (about, reviews, faq,
quote, contact, edmonton, guides) get the design system — grain, type, backlit hovers,
dark grade — with simpler layouts, never half-skinned. Rewrite `globals.css` from
scratch; rebuild Nav/Footer and components; DELETE the old shop-world components
(ShopWorld*, GarageScene, StationReveal, world-veil system) — one new hero canvas
component replaces them. Keep QuoteForm functionality.

Definition of done: `pnpm build` passes clean; `pnpm dev` (port 3112) renders every
route; desktop AND ~390px mobile both look intentional; reduced-motion works; 60fps
scroll on desktop (one canvas, capped DPR, compressed assets).
