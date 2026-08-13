# 2240 SPEED SHOP — VERSION A: "THE COLLECTION" (gallery white)

You are rebuilding the 2240 Speed Shop site as a **super clean, white, museum-grade
gallery** — the custom-car equivalent of an RM Sotheby's auction catalogue crossed with
Polestar and Aesop. This folder is a full copy of the existing dark site; the CONTENT
stays, the SKIN is replaced entirely. The result must look like a $50k design-studio
site, not a template. It is a spec pitch to win the shop as a client.

## Non-negotiables (do not violate)

1. **Content honesty rule**: `lib/site.ts` and `lib/builds.ts` are the source of truth.
   Do not invent customers, prices, dates, specs. Keep all copy meaning intact (light
   editorial re-flow is fine; facts never change).
2. **Footer credit on every page**: `built with ♥ by kr8tiv` → https://kr8tiv.io
3. Keep ALL routes working: home, services + 6 details, builds + 5 details, about,
   reviews, faq, quote, contact, edmonton + 4 areas, guides + 3 guides, 404.
4. Keep `lib/schema.tsx` JSON-LD emission in layout/pages (server-rendered HTML).
5. `next build` must pass (static export config — keep `next.config.ts` and
   `lib/image-loader.ts` as they are). Dev runs on port 3111 (`pnpm dev`).
6. **READ `AGENTS.md`**: this Next.js version (16.2.12) has breaking changes — read the
   relevant guides in `node_modules/next/dist/docs/` before writing code.
7. Mobile iOS gotcha (learned the hard way on the old site): use `overflow-x: clip`,
   never plain `overflow-x: hidden` on body.
8. Honor `prefers-reduced-motion`: swap scrubbed/pinned scenes for static compositions.

## Design system (locked — build inside this)

- **Ground**: warm off-white `#FAFAF8` page, pure `#FFFFFF` reserved for the photo/3D
  stage so the "cyc" reads slightly brighter than the page. Ink `#141414`, secondary
  `#6b6b68`. Hairlines `#E5E5E3` are the ENTIRE structural system (spec tables, section
  tops, grid columns). No card shadows, no rounded corners, no gradient buttons, no
  boxes — structure from hairlines + the grid only.
- **Accent**: speed-red `#a02d2d` (the real brand color) used ALMOST NEVER — lot
  numbers, the active nav state, one hover moment. If a section has two red elements,
  remove one.
- **Type** (next/font/google, replace the current fonts): editorial serif display —
  **Fraunces** (opsz axis, use 72pt optical sizes for display) — + neutral grotesk
  **Archivo** for UI/body + **IBM Plex Mono** for spec labels/eyebrows. Scale extremes:
  body 16–18px, tracked 11–12px uppercase mono eyebrows (letter-spacing 0.14em),
  display jumps straight to `clamp(2.5rem, 6vw, 7rem)`. Almost nothing in between.
- **Layout**: 12-col grid, max ~1440px, 24–40px gutters, asymmetric placement (text
  col 2–5, image col 6–12). 120–200px vertical section padding desktop. Text measure
  capped ~640px even when images go full-bleed — that tension IS the editorial look.
  Footer = oversized type composition (huge serif wordmark, hairline-divided columns).
- **Nav**: wordmark left ("2240" serif + "Speed Shop" mono), 3–4 links right, no
  hamburger on desktop. Thin hairline bottom border on scroll.

## The signature moves (all of these, done well)

1. **Hero**: "the lot sheet opens." Off-white page, tracked mono eyebrow
   (`EDMONTON, ALBERTA — EST. CLASSICS & CUSTOMS`), giant Fraunces headline
   ("Customs and Classics." or a line built from real copy), then the hero car.
   Headline enters as line-masked reveals (spans in overflow:hidden wrappers,
   translateY 110%→0, stagger 0.08s, ease cubic-bezier(0.16,1,0.3,1)).
2. **R3F studio turntable** (the one WebGL moment): a car GLB from `public/models/`
   (test `car-dodge-charger.glb`, `car-muscle-challenger.glb`, `car-convertible-50s.glb`
   — pick whichever reads best on white) on an infinite white cyc:
   `<Environment preset="studio">`, ACESFilmicToneMapping, `<ContactShadows>` as the
   ONLY ground indication, canvas clearColor matched EXACTLY to the page hex so the car
   floats in the layout. Scroll-scrubbed rotation in a pinned section (GSAP
   ScrollTrigger scrub) + gentle damped pointer orbit. No gizmos, no grid, no HDRI sky,
   no colored reflections. One canvas on the page, ever.
3. **Build index as a text list** (minimal.gallery pattern): full-width rows
   (lot no. / name / era / stage) in ONE type size, hairline dividers; hovering a row
   fades in a fixed-position preview photo that follows the cursor with spring easing
   (Framer Motion, stiffness ~150 damping ~20). Rows link to build pages.
4. **Build detail = RM Sotheby's lot page**: mono eyebrow "LOT 03 — 1950s", serif
   display title, hairline two-col spec table from `facts`, the lede as a
   narrow-measure provenance paragraph, then full-bleed gallery with clip-path curtain
   reveals (inset(0 0 100% 0)→inset(0)) + inner image settling 1.12→1.0.
5. **Image hover = crossfade to a second frame** (alternate photo), 0.4s — not zoom.
   Where only one photo exists, zoom caps at scale(1.03).
6. **Underline system**: every text link gets the 1px pseudo-element scaleX(0)→1
   origin-left enter / origin-right exit wipe, 0.3s.
7. **Lenis smooth scroll** (already installed) as the base layer; subtle ≤8% image
   parallax inside overflow-hidden frames; never parallax text.
8. **Services** as an editorial numbered index (01–06): mono number, serif title,
   two-line blurb, hairline dividers, asymmetric image placement alternating sides.
9. **Photography treatment**: the shop's iPhone shots get a consistent grade via CSS
   filter (slight contrast + desaturation, unify warm/cool) so they sit like a
   commissioned shoot. Full-bleed where they're strong (D100 shots, red stepside
   Texaco, steel sign), small and precise where they're weak.
10. **Motion vocabulary is ONE thing sitewide**: same ease
    `cubic-bezier(0.16,1,0.3,1)`, durations 0.6–1.1s, reveals animate ONCE at
    `top 80%`. Repetition reads as intention.

## AI-slop anti-checklist (instant fail if violated)

- No purple/indigo, no gradient orbs/blobs, no glassmorphism, no bento reflex,
  no centered pill-badge-above-H1 hero, no three-cards-with-Lucide-icons row,
  no rounded-2xl shadow-lg anything, no Inter/Poppins/Space Grotesk,
  no sparkle/emoji icons, no fake testimonials (use the 3 real Google quotes with
  their honest context from /reviews), no uniform fade-in-on-everything,
  no hover states that do nothing, no stock photography.
- Copy stays gearhead-specific and falsifiable. Ban: Unlock/Elevate/Seamless/
  Empower/Supercharge/"not just X, it's Y".

## Asset gotchas (from the previous build — real, verified)

- `ig-2025-09-09_model-kit-sprues-a/b.jpg` are NOT car photos (model-kit sprues).
  `ig-D100-slide2-lightpatch.jpg`/`ig-D100-slide3.jpg` are misnamed sprue photos too.
- `IMG_1954-original.png` has baked-in phone-screenshot bars — needs zoom ~1.35 crop
  (prefer `car-green-coupe.jpg` landscape instead).
- Homepage "Fresh off the hoist" cards in the old page.tsx link to WRONG slugs
  (`blue-pickup-restomod` etc.) — link to the real `lib/builds.ts` slugs.
- Hero-grade photos: `ig-D100-slide1-fullres.jpg`, `IMG_0052-red-pickup-texaco.jpeg`,
  `IMG_2943-original.jpeg` (steel sign), `IMG_1949-blue-pickup.png` (bars solved by
  aspect), `car-green-coupe.jpg`.

## Taste markers (from studying aura.build's most-remixed work + Awwwards winners)

- **Extreme type-scale contrast**: 100px+ display vs 10–12px tracked mono micro-labels,
  almost nothing in between. Never let a page live at 24–40px.
- **Mono corner annotations**: est. year, location, lot numbers in corners/margins
  (`EST. EDMONTON / 53.4818°N`, `LOT 01 — DRIVEN`). Product-code the brand voice:
  "2240", slashes, dots, edition numbers. Spec-sheet copy, no exclamation points.
- **Real numbers as instrument readouts**: cost bands, hours, drive times as mono spec
  strips with tracked labels.
- **Headlines interact with imagery**: behind, overlapping, or clipped by the photo —
  never just stacked above it.
- **Section rhythm varies deliberately**: full-bleed → editorial split → spec strip.
  Equal blocks with equal padding = generated tell.
- **Accent at <5% coverage.** One focal object per viewport.
- **One radius language**: here that means NONE — square corners everywhere.

## Scope strategy

Homepage, builds index, one build detail template, services hub + detail template =
the deep wow. Interior pages (about, reviews, faq, quote, contact, edmonton, guides)
get the full design system (fonts, hairlines, measures, reveals) with simpler layouts —
consistent, never half-skinned. Rewrite `globals.css` from scratch for this system;
rebuild Nav/Footer/Section/ServiceCard etc.; delete the old 3D shop-world components
(ShopWorld*, GarageScene, StationReveal, world-veil) — this site has ONE clean canvas
component instead. Keep QuoteForm functionality.

Definition of done: `pnpm build` passes clean; `pnpm dev` (port 3111) renders every
route; desktop AND ~390px mobile both look intentional; reduced-motion works.
