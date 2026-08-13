# Concept 3 — "THE SHOWROOM FLOOR"

**Project:** 2240 Speed Shop rebuild (spec pitch) · **Prepared:** August 2, 2026
**Direction:** Dealer-grade premium showcase. Porsche-museum restraint. One car at a time, in a beam of light, on black. Specs typeset like museum placards. Quiet luxury that makes a small east-Edmonton shop feel like a destination atelier for the clientele who never ask what it costs.

---

## 1. The Pitch

**To Matt:** Every competitor site in the Edmonton vintage/performance niche is either a cluttered parts catalogue, a 2016 Dreamweaver relic, or a dead IIS server — nobody presents *work* the way a $100K restoration deserves to be presented, so a black-void gallery treatment instantly makes 2240 the most expensive-looking shop in Alberta at zero incremental cost. **To Terry:** we put your cars on the floor the way Porsche puts a 917 on the floor — one at a time, lit, with a plate that says what's in it — because a photographer already pulled over in traffic to shoot your D100, and this site does what he did: stops people. **The close:** restoration buyers spend $30K–$120K per job (keyword research, Cluster B) and they buy on proof and taste, not price — this concept is proof and taste, weaponized.

---

## 2. Visual Language

### 2.1 Palette (design tokens)

| Token | Hex | Use |
|---|---|---|
| Void Black | `#050505` | Page ground — the "museum dark" everything floats in |
| Floor Black | `#0e0e10` | Elevated surfaces, exhibit bays, alternating sections |
| Case Anthracite | `#1a1a1d` | Cards, spec-plate backgrounds, form fields |
| Hairline | `#26262a` | 1px borders, dividers, plate frames |
| Shop Red | `#a02d2d` | THE brand color (verified: live site manifest `theme_color`). Underlines, active states, the badge, nothing else |
| Clearcoat Red | `#c23b3b` | Hover/pressed state of Shop Red only |
| Rust | `#8a4a2f` | Patina accent lifted from the laser-cut steel sign — exhibit numbers, small seals |
| The Patch | `#d8d2c4` | Primer-beige sampled from the D100's famous hood light patch — section eyebrows, spec-plate value highlights. This is the concept's ownable signature: the "unfinished honesty" tone becomes a brand color |
| Gallery White | `#ececee` | Headlines |
| Steel Gray | `#9a9aa2` | Secondary/body text |
| Bulb Warm | `#ffd9a0` @ 8–14% alpha | The light-beam gradient only — never flat UI |

Rule: red appears at most once per viewport. Luxury is restraint; the black does the work.

### 2.2 Typography (all free, Google Fonts, self-hosted via `next/font`, `font-display: swap`)

- **Display: Archivo** (variable) — Expanded width ~125%, weights 600–800, UPPERCASE, tracking 0.08–0.14em. Reads like the stamped letterforms on the physical steel sign; industrial but exact.
- **Data: IBM Plex Mono** (400/500) — every spec plate, nav index numbers (`01 / THE FLOOR`), phone number, prices-we-don't-show placeholders (`OWNER: PRIVATE`). Mono type is what makes a spec read like a build sheet instead of marketing.
- **Body: Archivo** normal width, 400/500, sentence case, max line length 68ch.

Two families total = small font payload = CWV win. No serif; the museum feel comes from spacing and light, not from Garamond.

### 2.3 Texture / material system

- **Polished concrete floor** — the one "set" of the whole site: a reflective dark floor plane under every exhibit (WebGL: `MeshReflectorMaterial`; static fallback: pre-baked reflection in the image crop).
- **Rusted steel** — reserved exclusively for the vectorized badge and exhibit-number seals. Patina texture sampled from `storefront-sign-SOURCE.jpeg` itself.
- **Lacquer sheen** — cards get a 1px top highlight + slow diagonal specular sweep on hover (CSS gradient, `transform: translateX`), like clearcoat catching light.
- **Film grain** — 1.5% monochrome noise overlay sitewide (tiny tiled PNG or postprocessing `Noise` on canvas). Critical: grain + dark grading is also what hides the fact that v1 photos are web-res rips.
- **Vignette** — every exhibit image is graded into black at the edges so photos of five different qualities read as one collection.

### 2.4 Motion principles

1. **Museum pace.** 500–900ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Nothing bounces. Ever.
2. **Light moves first.** Reveals are lighting changes (mask/gradient sweeps), not objects flying in.
3. **One focal point at a time.** Never two simultaneous animations in a viewport.
4. **Scroll scrubs, time doesn't.** All cinematics are tied to scroll position (Framer Motion `useScroll` + `useTransform`); the only autonomous animation is the hero beam sweep, once.
5. **Cars are heavy.** Drag interactions use damped lerp (~0.08 factor), no overshoot, no spring wobble.
6. **The kill switch is sacred.** `prefers-reduced-motion` collapses everything to opacity fades; no content or CTA ever depends on motion or WebGL.

---

## 3. The Hero Moment

### First 5 seconds (precisely)

- **0.0s — instant paint.** Server-rendered HTML: Void Black page, the D100 photo (`ig-D100-slide1-fullres.jpg`, AVIF ~90KB, `<link rel="preload">`, explicit dimensions) already present as a plain `<img>` — it IS the LCP element. Headline text is in the HTML from byte one (AI crawlers and Google get everything with zero JS).
- **0.2–1.2s — the beam.** A warm light cone (CSS radial-gradient mask, no JS required) sweeps left-to-right across the truck and *stops on the hood's light patch* — the sweep is choreographed to land there. The patch is the moment.
- **1.2–2.5s — the marque settles.** `2240 SPEED SHOP` (Archivo Expanded, tracked) fades up 12px; beneath it in Plex Mono: `CLASSICS AND CUSTOMS · EDMONTON, ALBERTA`.
- **2.5–4.0s — the plate.** A museum placard letterpresses in below the truck: `EXHIBIT 00 — DODGE D-SERIES · 1960s · STATUS: SHOP TRUCK · OWNER: THE HOUSE`.
- **4.0–5.0s — the invitation.** Scroll cue in Plex Mono: `WALK THE FLOOR ↓`. Meanwhile, off-thread, the R3F canvas has hydrated behind the static image; it cross-fades in and the D100 becomes a draggable 2.5D turntable. If WebGL is absent or slow: nothing breaks — the static hero with its CSS beam simply remains, and no user can tell they got the fallback.

### Scroll journey (homepage, section by section)

| # | Section | What happens |
|---|---|---|
| 00 | **THE MARQUE** | Hero exhibit above. D100, beam, plate. |
| 01 | **THE FLOOR** | The gallery: 5 exhibits, one full viewport each, dark until scrolled into the beam. Order: D100 → black Camaro (IMG_0434 — verify make/year with Terry before plates go final) → blue custom pickup (IMG_1949) → red pickup with the Texaco neon (IMG_0052) → black classic (IMG_0051). Between exhibits 2 and 3: a macro interstitial — the matte-green wheel shot (IMG_1954) full-bleed with one line of copy. Each exhibit: turntable interaction + spec plate + `VIEW THE BUILD →` link to its own indexable page. |
| 02 | **THE SERVICES WING** | Six numbered doors in a 2×3 grid (spec-plate styling): Restoration · Restomods & Custom Builds · Engine & Swaps · Performance & Tuning · Rust & Metalwork · Classic Service (carbs, brakes, ignition). Exactly the six-pillar architecture the keyword universe prescribes (§14.1). |
| 03 | **THE BUILDER** | Terry. Team photo (IMG_0446, cropped, graded dark), the story in four terse lines, the shop truck philosophy. Wikipedia-stub facts for entity SEO: name, location, specialty, the Radium run every September. |
| 04 | **THE PROCESS** | `CONSULT → TEAR-DOWN → BUILD → DELIVERY` as four plates on a horizontal rail, with the stripped-frame photos (IMG_0401, IMG_0402) as backdrops. Includes the two sentences about staged quoting that no Edmonton competitor publishes. |
| 05 | **THE WORD** | Three named, real Google review quotes typeset as placards (Kaitlyn Quesnelle, Matt Haynes, David Steele) + the Yesterdays Auto Gallery trade endorsement ("Three time customer" — Ted Dakin, via Alignable). No star numbers anywhere — the 2.7 never touches this site; text proof only, which is both honest and strategic. |
| 06 | **FROM THE SHOP FLOOR** | IG gallery — the 11 reel frames as a filmstrip strip, server-rendered `<img>` grid (crawlable), linking to instagram.com/2240speedshop. Caption: `METALLICA ON THE SPEAKERS SINCE 2024.` |
| 07 | **GET ON THE FLOOR** | Quote/booking form (service picker · vehicle year/make/model · photo upload · story field). Sticky CTA resolves here. |
| — | **FOOTER** | Full NAP (2009 91 Ave NW, Edmonton, AB T6P 1L1 — bordering Sherwood Park), hours, map link, tel/mailto, IG/Threads links, the rusted badge slowly swaying 1.5°, and the required credit: `built with ❤ by kr8tiv` → https://kr8tiv.io |

---

## 4. Signature Interactions (named, feasible, with technique)

1. **THE TURNTABLE** — Each exhibit rotates ±14° following pointer drag, with parallax depth, as if the car sits on a dealer turntable. *Technique:* not true photogrammetry (that needs 100+ angles per car we don't have) — 2.5D layering: rembg cutout of the car (Matt's proven rembg pipeline from the Xenia project) on a foreground R3F plane, blurred original as midground, baked contact shadow on the floor plane; planes offset in Z, group rotation lerped toward pointer in `useFrame`. At museum pace, 3 layers read 90% as good as a scan.
2. **THE BEAM** — Exhibits sit in darkness until scrolled into view; a volumetric-feel light cone swings onto each one. *Technique:* desktop WebGL — drei `SpotLight` with attenuation + a scroll-driven target position; everywhere else — a CSS `radial-gradient` mask whose center is driven by `useScroll`→`useTransform`. One implementation contract, two renderers.
3. **THE SPEC PLATE** — Museum placard under every car: Plex Mono rows (YEAR / ENGINE / WORK PERFORMED / HOURS / STATUS), values counting up on first view (`animate()` on a motion value). Hover flips the plate to the work-done list (CSS 3D flip, `backface-visibility`). Plates show `OWNER: PRIVATE` and `STATUS: COMMISSIONED` where true — the quiet-luxury flex for the don't-ask-prices clientele. **Rule: plates carry only Terry-verified data; unverified rows ship as `SPEC SHEET IN PROGRESS`, never invented numbers.**
4. **WALK THE FLOOR** (desktop homepage only) — Between hero and services, the camera dollies through a dark hall: reflective concrete floor, light cones, the five builds hung as framed "prints" along the walls. *Technique:* the canonical R3F showroom recipe — `MeshReflectorMaterial` floor + camera on a `CatmullRomCurve3` spline scrubbed by scroll offset; car photos are textured planes in steel frames, so no 3D car models are needed (nobody has to fake Terry's actual cars badly).
5. **THE PATINA SLIDER** — A draggable divider wipes between bare-metal/tear-down state and finished car. *Technique:* two stacked images, `clip-path: inset()` driven by a Framer Motion `useMotionValue` drag handle. v1 honest version: one demo instance pairing IMG_0401 (stripped blue frame) with the finished blue pickup (IMG_1949) labeled `SAME SHOP. DIFFERENT DAY.` — true before/after pairs are a Terry ask (§8).
6. **THE SIGN** — The vectorized rusted-steel badge as a living seal: header mark is static SVG; footer version hangs and sways ±1.5° on a slow sine (CSS keyframes); on hover a specular sweep crosses the steel (SVG gradient mask). On the 404 page it spins like a dropped hubcap — the one permitted joke.

---

## 5. Mobile Experience (first-class, not a fallback)

Mobile users get **a different, equally deliberate show**, not a degraded desktop:

- **No three.js on the phone.** R3F is behind `next/dynamic` + a `matchMedia`/device-capability gate; the mobile bundle never downloads it. Mobile budget: Next.js base (~90KB gz) + Framer Motion (~32KB gz) + page code — under ~180KB gz JS total.
- **The gallery becomes a swipe.** THE FLOOR is a snap-scroll vertical exhibit reel — one car per screen, beam rendered as the CSS gradient mask (identical art direction, cheaper physics). The Turntable becomes a horizontal swipe between 3 pre-rendered angles/crops of each car.
- **Spec plates identical.** They're HTML — nothing to degrade.
- **Thumb-first conversion:** persistent bottom bar — `CALL · TEXT · GET A QUOTE` (tel:7809996450 / sms / #07 anchor). A shop's mobile visitors convert by phone tap; this is the highest-value UI element on the site.
- **Core Web Vitals targets (from the AI-SEO playbook §7.2, p75 field, mobile-first):**
  - **LCP < 2.5s, aiming < 1.8s** — preloaded AVIF hero with explicit dimensions, no carousel, no JS-gated imagery
  - **INP < 200ms, aiming < 100ms** — minimal JS, no hydration-blocking canvas, passive listeners
  - **CLS < 0.1, aiming < 0.05** — reserved aspect-ratio boxes for every exhibit and plate, `next/font` with size-adjust, zero layout-shifting embeds
- Every page fully readable in raw HTML (SSG/SSR) — the playbook's hard mandate, since no AI crawler except Googlebot executes JS. The art is a coat over the content, never the container of it.

---

## 6. Sample Copy (terse gearhead voice)

### Hero headline options

1. `DON'T SAVE YOUR DREAMS FOR SLEEP.` / sub: `Revive your ride. Classics and customs, built in Edmonton.` *(their own tagline, typos fixed, given the dignity it deserved)*
2. `BUILT, NOT BOUGHT.` / sub: `Vintage restorations, hot rods, and custom builds. One car on the floor at a time.`
3. `THE FLOOR IS YOURS.` / sub: `Edmonton's customs and classics shop. Bring the car, or the story.`

### Service-section block (Restoration — the core money page)

> **RESTORATION**
> `01 / FRAME-OFF & ROLLING`
>
> A proper restoration isn't a parts list. It's hours — metal, panel fit, block sanding, assembly, in the right order. We quote in stages, photograph everything, and you sign off each phase before the next one starts.
>
> - Frame-off and rolling restorations, classic cars and trucks
> - Rust repair, patch panels, floor pans — Alberta cars hide it, we find it
> - Period-correct interiors with modern pieces where they earn their place
> - Brakes, wiring, and ignition brought up to driver standard
>
> Classic car restoration for Edmonton and Sherwood Park. Fresh concrete cures. So do good decisions — book a walk-through before you buy the car, not after.
>
> `[ BOOK A SHOP VISIT ]`

### CTA block

> **GET ON THE FLOOR**
>
> The bay list is short on purpose. Tell us what you've got and what it should be. Terry reads every request.
>
> `[ REQUEST A QUOTE ]`  ·  `780-999-6450`
>
> No deposit to talk. Bring photos, a VIN, or just the story.

---

## 7. SEO Integration (the art ships the keywords)

The museum conceit maps 1:1 onto the SEO architecture — nothing is compromised, because **the exhibit IS the landing page and the spec plate IS the table** AI engines cite (playbook §7.3: comparison tables earn 2.5–4.2× more citations).

- **Homepage** targets `speed shop Edmonton` + `custom car shop Edmonton` (Cluster A ★★★, SERPs held by Facebook pages and directories). Title: `2240 Speed Shop | Classics and Customs — Edmonton Speed Shop`. Entity-dense intro block in section 03 (who/what/where/since-when), answer-first.
- **The six Services Wing doors = the six pillar pages** from keyword-universe §14.1, each server-rendered with question-format H2s, 40–60-word answer-first blocks, a pricing/timeline table styled as a spec sheet, an FAQ block styled as placards, and gallery: `/services/restoration` (classic car restoration Edmonton — the #1 target, currently won by Alignable), `/services/restomods` (restomod Edmonton — completely unclaimed in Alberta), `/services/engine-swaps` (LS swap / engine swap Edmonton — no shop ranks at all), `/services/performance` (performance engine build Edmonton), `/services/rust-metalwork` (rust repair classic car Edmonton), `/services/classic-service` (carburetor rebuild Edmonton — the wedge service, forums currently rank).
- **Every exhibit gets its own indexable build page** (`/builds/1960s-dodge-d100-edmonton`), keyword-titled like the research prescribes ("Kartunes ranks with a *gallery*" — keyword universe §14.3): muscle car restoration Edmonton, classic truck restoration Edmonton / C10-square-body Alberta all get owned through build pages, which no competitor in all three teardowns does (Sideshow, Wadson's, Iron Garage all dump images with zero text).
- **Suburb floors:** `/sherwood-park` first (`classic car restoration Sherwood Park` — YellowPages-only SERP, and the shop physically borders it), then St. Albert / Leduc / Spruce Grove, each reusing the exhibit componentry with unique local copy — satellite galleries, not doorway spam.
- **The Logbook (blog)** styled as archive drawers; launches with the playbook's three cornerstones, led by "Classic Car Restoration in Edmonton: Cost, Timeline & Process (2026)" — the `classic car restoration cost Canada` query has zero Canadian answers today and is the AI-answer magnet.
- **Schema stack per the playbook:** sitewide `AutoRepair` node with stable `@id`, full NAP (2009 91 Ave NW, T6P 1L1), geo, hours, `sameAs`, `knowsAbout`; `Service` node per pillar; `FAQPage` on placard blocks (visible text = schema text, exactly); `Person` for Terry; `BreadcrumbList`; `ImageObject` on signature build photos; **no `aggregateRating`** — the playbook forbids fabrication and the honest number (2.7) must never be volunteered; it returns only after the review-generation program does its work.
- **Plumbing:** robots.txt allowing all AI retrieval/training bots, `llms.txt` at root, XML sitemap to GSC + Bing Webmaster, OG/Twitter cards per page, IG gallery server-rendered as real `<img>` tags (crawlable) instead of a JS embed widget.

---

## 8. Asset Plan

### From the 32 extracted assets (what this concept uses)

| Asset(s) | Role |
|---|---|
| `ig-D100-slide1-fullres.jpg`, `ig-D100-slide2-lightpatch.jpg`, `ig-D100-slide3.jpg`, `ig-2025-09-09_natlaj-photo_DOZCypFjzTm.jpg` | Hero exhibit + D100 build page. The light-patch frame is the brand moment. ⚠ Shot by @natlajphotography — Terry should secure usage permission (photographer is already in the shop's orbit) |
| `logos/storefront-sign-SOURCE.jpeg` + `website/IMG_2943-original.jpeg` | Vectorization sources for the badge (the pitch includes delivering the clean SVG mark) + patina texture sampling |
| `IMG_0434-black-muscle-car.jpeg` | Exhibit 02 — "the Camaro" (verify make/model/year with Terry before the plate goes final) |
| `IMG_1949-blue-pickup.png` | Exhibit 03 + finished side of the Patina Slider |
| `IMG_0052-red-pickup-texaco.jpeg` | Exhibit 04 (the Texaco neon reads beautifully in the beam treatment) |
| `IMG_0051-mission-black-classic.jpeg` | Exhibit 05 |
| `IMG_1954-original.png` | Matte-green wheel macro — full-bleed interstitial between exhibits |
| `IMG_0401-stripped-blue-frame.jpeg`, `IMG_0402-covered-classic.jpeg` | THE PROCESS backdrops + tear-down side of the Patina Slider |
| `IMG_0446-team-photo.jpeg` | THE BUILDER section (cropped, dark grade) |
| `IMG_2950-original.jpeg` (motorcycle + neon) | Services Wing divider image |
| `hero-video-poster.jpg` | Texture/backdrop reserve; og:image fallback |
| 11 × `ig-*_reel/photo_*.jpg` thumbnails + `ig-profile-pic.jpg` | FROM THE SHOP FLOOR filmstrip (server-rendered grid) |
| 3 × `tiktok-thumb-*.jpg` | Low-res; internal reference/mood only — not published |
| `manifest.webmanifest` | Color verification (`#a02d2d`) only |

### Must be built or bought

- **Badge vector** — trace `storefront-sign-SOURCE.jpeg` in Inkscape/Illustrator (~2h). Build. This is also a named pitch deliverable ("your sign, digitized").
- **Concrete floor + environment** — Poly Haven, free CC0: a dark concrete texture set for the reflector floor + a studio HDRI (e.g. `studio_small_08`) for material sheen. No purchase needed.
- **Set dressing** — deliberately none. The concept is a black void with light cones and framed prints; the "walk the floor" hall needs only floor, frames (built in Blender in an hour), and light. This is the concept's structural advantage: **zero Sketchfab/KitBash3D spend and no risk of generic-looking garage props** — if a stanchion or two is ever wanted, Sketchfab CC-BY freebies cover it with a colophon credit.
- **Grain/vignette** — `@react-three/postprocessing` (Noise, Vignette) on canvas; tiled PNG overlay elsewhere. Build, trivial.
- **Cutouts** — rembg passes on D100 + Camaro + blue pickup for the 2.5D turntable layers. Build, existing pipeline.

### Needs Terry (post-pitch, pre-launch)

1. Make/model/year + real spec rows for all five exhibit plates (nothing invented — plates ship `SPEC SHEET IN PROGRESS` until then).
2. High-res originals of the five cars (current rips are ≤822KB web-res — the grain/dark grade hides it for the demo; a real shoot with Nathan Lajeunesse or JG Photography is the v2 unlock).
3. Permission for the natlaj D100 photos; before/after pairs from his archive for the Patina Slider.
4. AMVIC licence number, Red Seal certs, years in business — E-E-A-T rows for THE BUILDER and the schema.
5. The sign photographed straight-on in daylight for a cleaner vector trace.

---

## 9. Build Estimate ("this week" pace)

**4 working days to a pitch-ready demo** on the Hostinger demo subdomain, +0.5 day for the walkthrough one-pager.

| Day | Ship |
|---|---|
| 1 | Next.js scaffold (App Router, SSG), design tokens, fonts, badge vectorized, images processed (AVIF pipeline + rembg cutouts), static hero with CSS beam + spec plate, homepage content server-rendered end to end |
| 2 | THE FLOOR (5 exhibits, turntable cards, beam reveals, plates), six pillar service pages with real keyword copy, full schema stack validated in Rich Results Test |
| 3 | Desktop-only WALK THE FLOOR dolly scene (reflector floor + camera spline), mobile exhibit reel + sticky call bar, THE BUILDER / PROCESS / WORD sections, quote form (API route → email), IG grid, footer + kr8tiv credit |
| 4 | CWV pass to green on mobile (Lighthouse + real device), FAQ placards, robots/llms.txt/sitemap, OG images, deploy, cross-device QA — **verified in a real browser before "done" is said** |

### Corners safely cut for v1 (and why they're safe)

- **2.5D turntables, not photogrammetry** — indistinguishable at museum pace; true scans need a shoot that happens after signing.
- **Dolly scene on desktop homepage only** — every other page is fast static art; the wow lives where the pitch demo happens.
- **IG gallery is the ripped grid, not a live API feed** — live feed needs their IG Business token (post-signing); the static grid is actually *better* for SEO anyway.
- **Form emails only** — no scheduling backend; a shop this size books by conversation.
- **Blog ships 3 cornerstones + scaffold**, not 50 posts; suburb pages ship Sherwood Park only.
- **No CMS** (per brief — developer-managed until they sign).
- **Spec plates partially blank** rather than invented — blanks read as intentional (`SPEC SHEET IN PROGRESS`) in this design language.

---

## 10. Why This One Wins / When to Pick It

**Why it wins:**

- **It matches the money.** The keyword research says the prize is $30K–$120K restoration and restomod work; those buyers choose on taste and proof. Every teardown competitor — 805KB Wix (Sideshow), no-H1 Divi (Wadson's), `<title>Home</title>` ShoutCMS (Acceleration), dead IIS box (Promax) — looks like a repair shop. This looks like where you take a car you love.
- **Restraint is a ranking factor here.** Black space + few moving parts + photo-led sections = the fastest possible "showpiece" site — the CWV lane the teardowns identified as open scores itself.
- **It solves the reputation problem by composition.** A 2.7★ shop can't lead with ratings; a museum leads with the work and lets three named humans speak. Nothing on the site is spin, and nothing invites the star question.
- **It fits the assets we actually have.** Twelve usable car photos, no shoot, no 3D car models — this concept needs black, light, type, and those photos. The weakest input (mixed-quality rips) is absorbed by the strongest treatment (grain, vignette, one-at-a-time).
- **The D100 light patch is an ownable art direction** — no shop on earth has it, and Terry's own story (a stranger pulled over to photograph it) is the pitch narrative in miniature.

**When to pick something else (honest):**

- **If Terry flinches at "fancy."** His voice is Metallica reels and lowercase captions; this is the most curated of the five directions. If the read on him is pride-through-grit rather than pride-through-polish, the louder rock-and-roll treatment or the brief's default neon-garage drift-through will land better in the room.
- **If the pitch needs maximum first-3-seconds spectacle.** The full 3D shop-interior concept out-wows this on a projector; the Showroom Floor out-classes it on a phone and out-lives it in year two. Pick by audience: wow-Matt's-demo → garage; win-the-$80K-customer → showroom.
- **If breadth is the message.** One-car-at-a-time pacing deliberately shows less volume than a busy-garage or portfolio-wall concept. A heritage/story direction also tells "more" — this one tells "better."
- **Cost of wrongness is low:** the exhibit/plate componentry, schema stack, pillar pages, and asset pipeline all transfer to any of the other four directions — the museum styling is a skin over the same chassis, so picking it for the demo doesn't strand work if Terry steers elsewhere.

**Verdict:** the strongest concept for the stated clientele and the only one whose look *is* its performance strategy. Pick it if the goal is to make 2240 the destination atelier of Alberta customs; pick the garage drift-through if the goal is to make Terry say "whoa" in the first five seconds — and note only one of those goals compounds for three years.

---

*Footer credit on every page, non-negotiable: `built with ❤ by kr8tiv` → https://kr8tiv.io*
