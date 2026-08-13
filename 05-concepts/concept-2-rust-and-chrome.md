# Concept 2 — RUST & CHROME

**Project:** 2240 Speed Shop spec-pitch rebuild · **Prepared:** August 2, 2026
**Direction:** Retro-futurism built from their real physical identity — the corten laser-cut badge, rust and cream and shop-red, film grain — with a scrollytelling restoration journey where a truck goes from barn-find to show-ready as you scroll. Rust-to-chrome WebGL material transitions, before/after sliders as the centerpiece interaction, kinetic vintage type, and "your sign, digitized" as the brand system.
**Grounded in:** 00-brief.md · 01-research (site-audit, reviews-reputation, social-presence) · 02-assets/INVENTORY.md · 03-seo (keyword-universe, blog-keywords, ai-seo-playbook, competitor teardowns 1–3)

---

## 1. The Pitch

**To Matt:** Every competitor with a real site runs the same dark-garage-and-carbon-fiber template — this concept is the only direction nobody in Edmonton can copy, because it's built from the one asset only 2240 owns: that laser-cut rusted-steel sign bolted to the building, digitized into a full brand system and animated. **To Terry:** we took your sign, your truck, and your "customs and classics" line, and built the website version of what you already do for cars — the visitor watches a rusted-out pickup come back to show-ready as they scroll, the same journey every customer's car takes through your shop. It sells the work by *being* the work: before/after is the product, so before/after is the interface.

---

## 2. Visual Language

### 2.1 Palette (design tokens)

Anchored to verified brand reality: `#a02d2d` from their live PWA manifest (`manifest.webmanifest` in 02-assets — the one deliberate color decision they ever shipped), corten oxide sampled from `storefront-sign-SOURCE.jpeg`, cream pulled from vintage service-manual paper.

| Token | Hex | Role |
|---|---|---|
| `--cream` | `#F2E8D5` | Page background. Aged shop-manual paper, not white. |
| `--cream-deep` | `#E4D6BC` | Section alternation, card fills. |
| `--corten` | `#8A4B2A` | Primary rust. Headings on cream, borders, texture base. |
| `--corten-shadow` | `#4A2818` | Deep oxide. Body text on cream (warm near-black, never pure black). |
| `--shop-red` | `#A02D2D` | THE brand red (their manifest theme color). CTAs, the sign's stars, active states. Used sparingly so it always means "act." |
| `--oil-black` | `#171310` | Dark sections (hero canvas, teardown, footer). Warm black — engine oil, not #000. |
| `--chrome-hi` | `#EEF1F4` | Chrome gradient top / "after" state accents. |
| `--chrome-lo` | `#9AA3AB` | Chrome gradient base, metallic UI details. |
| `--patina-green` | `#5C6B4F` | Tertiary only — the green wood siding visible in the storefront photo and the olive Camaro (IMG_1954). Tags, footnotes. |

Rule: cream-dominant pages with oil-black "shop bay" sections for the 3D moments. Red never exceeds ~5% of any viewport — it's the star on the sign, not the wall paint. This instantly separates 2240 from SSS/Sideshow/every teardown competitor (all dark-site clones) *and* from the current GoDaddy template.

### 2.2 Typography (all free / Google Fonts)

| Slot | Font | Why |
|---|---|---|
| Display / headlines | **Abril Fatface** | Already loaded on their current site (site-audit §6) — it's the one good instinct the template had. We keep it and use it *right*: huge, tight-tracked, kinetic (see §4.4). High-contrast didone = vintage poster + modern scale. |
| Sub-display / numbers / badges | **Alfa Slab One** | Heavy slab for stat callouts, build years ("1962"), stage numbers. Hot-rod flyer energy. |
| Stencil accents | **Saira Stencil One** | Echoes the laser-cut sign letterforms for section eyebrows ("— TEARDOWN —"), never for body. |
| Body / UI | **Archivo** (variable) | Workhorse grotesque; Archivo Black weight for nav/buttons keeps continuity with their current font stack while cutting from 6 loaded families (site-audit weakness #12) to 4 self-hosted subsets. |
| Spec sheets / data | **IBM Plex Mono** | Torque-spec tables, build cards, pricing rows — reads like a work order. |

All self-hosted, subset, `font-display: swap`, preloaded — a direct CWV move (playbook §7.2).

### 2.3 Texture & material system

- **Corten steel** — the hero material. On the web layer: a tiling rust texture (ambientCG `Rust002`/Poly Haven `rust_coarse_01`, CC0) used inside SVG masks of the vectorized badge and as section-divider bars. In WebGL: PBR rust (albedo + roughness + normal) on the truck body.
- **Chrome** — the destination material. `MeshPhysicalMaterial` (metalness 1.0, roughness 0.04, clearcoat) lit by Poly Haven's free **`autoshop_01`** HDRI — an actual garage environment map, so reflections read "shop," not "showroom."
- **Film grain** — global, subtle (4–6% opacity), animated at 12fps for a projector feel: one 256px seamless grain tile animated via CSS `steps()`, or SVG `feTurbulence` on desktop. Killed entirely under `prefers-reduced-motion`.
- **Paper & stamp** — cards are work orders: 1px `--corten` rules, perforation-dot edges, red star "stamps" (from the sign's stars) as list bullets and completion marks.
- **Halftone** — photos in editorial sections get an optional CSS halftone-dot overlay on hover, tying photography into the print-era language.

### 2.4 Motion principles

1. **Everything moves like a tool, not a UI.** Springs with overshoot and a hard settle (torque-wrench click), no easey web-app floatiness. Framer Motion spring config baseline: `stiffness: 400, damping: 24`.
2. **Scroll is the timeline.** The homepage is one restoration told in scroll; scroll position = build progress. No autoplay carousels anywhere.
3. **Reveal by removal.** Transitions wipe with a grain-noise feathered edge — the visual language of media blasting — never a crossfade.
4. **Grain is the constant.** The film grain layer persists across all states so 3D, photo, and type feel like one filmstrip.
5. **Respect the exits.** `prefers-reduced-motion` gets a fully static, still-beautiful site; every scroll-linked scene has a static poster state.

---

## 3. The Hero Moment

### First 5 seconds (precisely)

- **0.0–0.4s** — Instant paint: cream background, film grain, and the static headline block (Abril Fatface, server-rendered HTML — this is the LCP element, no waiting on JS). Nav is a thin corten bar with the wordmark.
- **0.4–1.5s** — **The sign draws itself.** The vectorized badge ("SPEED SHOP 2240 — CLASSICS AND CUSTOMS", crossed wrenches, stars) renders as laser cut-lines: SVG paths animate `pathLength` 0→1 in cut order, with a tiny white-hot spark glint tracking the "cutting head." On completion the outlines flood-fill with corten rust texture (SVG mask reveal). The two stars stamp in red — *clack, clack* (visual only; no audio).
- **1.5–3.0s** — Behind the type, the WebGL canvas fades in from oil-black: a 1960s American pickup (D100-style) low-lit on a concrete pad, rendered in full rust patina, slow 4° dolly drift. The canvas was lazy-mounted after first paint, so this costs the LCP nothing.
- **3.0–5.0s** — A single **chrome sweep** previews the whole thesis: a feathered blast-line travels across the front fender, flashing rust→chrome→rust in 1.2s. Below the headline, the scroll cue is a **vintage dyno gauge** whose needle sits at 0 — labeled "SCROLL TO RESTORE."

Headline on screen the whole time: their own line, typo-fixed — **"DON'T SAVE YOUR DREAMS FOR SLEEP. REVIVE YOUR RIDE."** — with sub: *Classics and customs. Edmonton, borders Sherwood Park.*

### The scroll journey, section by section

Each section is a real semantic `<section>` with an H2 and server-rendered copy — the art plays *over* the content, never instead of it (playbook §7.1: AI crawlers don't execute JS).

| # | Section (H2) | What happens on screen | Real asset in play |
|---|---|---|---|
| S0 | Hero | Sign draws, rust truck idles, gauge at 0 | Vectorized badge; truck GLB |
| S1 | **The Find** | Scene dims to barn light-shafts; camera orbits to rear 3/4; dust motes. Copy: barn finds, stalled projects, "don't start it — call us first" (feeds blog E14) | `IMG_0402-covered-classic.jpeg` in a side panel |
| S2 | **Teardown** | Exploded view: hood, bed, wheels, bumpers drift apart on scroll (grouped GLB nodes translating outward), labels in Plex Mono pinning part names | `IMG_0401-stripped-blue-frame.jpeg` as the photographic proof panel |
| S3 | **Metal, Paint & Chrome** | THE moment: the rust-to-chrome scrub runs across the reassembled body, driven by scroll (§4.2). Centerpiece **before/after blast slider** with real shop photos sits beside it (§4.3) | Rust/chrome shader; photo pairs |
| S4 | **Drivetrain** | Camera drops to engine bay; copy block for LS/diesel conversions, carb rebuilds, engine swaps — the keyword-dense section (§7) | — |
| S5 | **The Reveal** | Truck fully chromed/painted under warm light, slow turntable — then a **match cut**: the render crossfades (grain-wipe) into the real @natlajphotography Dodge D100 photo. Caption: "A photographer pulled over for this hood. So did we." Gauge hits redline | `ig-D100-slide1-fullres.jpg` + `slide2-lightpatch.jpg` |
| S6 | **What We Do** | Six work-order cards → pillar service pages (§7). Cream section, fast scan | Gallery photos as card art |
| S7 | **Word Gets Around** | Review strip: the three real 5-star Google quotes (Kaitlyn Quesnelle, Matt Haynes, David Steele — reviews-reputation §2.1) + GBP link + Radium Show & Shine mention | — |
| S8 | **Start Your Build** | Quote/booking form: service picker, vehicle year/make/model, photo upload (brief requirement). NAP block, map | `IMG_2943` storefront photo |
| — | Footer | Full NAP (2009 91 Ave NW, Edmonton, AB T6P 1L1 · 780-999-6450), sameAs links, and the non-negotiable: `built with ❤ by kr8tiv` → https://kr8tiv.io | — |

---

## 4. Signature Interactions (named, feasible, with technique)

### 4.1 "The Sign, Struck" — badge laser-cut reveal
The digitized sign is the brand system's opening act. **Technique:** vector-trace the badge to SVG; animate each path's `pathLength` with Framer Motion (`motion.path`, staggered by cut order), a radial-gradient "spark" following via `offset-path`. Fill via animated SVG `<mask>` flood with the rust texture. Reused small: the crossed-wrench glyph draws itself as the loading state and section dividers. Cost: pure SVG/CSS — zero WebGL, runs anywhere including mobile.

### 4.2 "Rust-to-Chrome Scrub" — the WebGL material transition
The truck body transitions rust→bare-metal→chrome as S3 scrolls. **Technique:** one custom `ShaderMaterial` (drei `shaderMaterial` helper) holding both PBR looks; a `uProgress` uniform (0–1) driven by scroll (Lenis smooth scroll → Framer Motion `useScroll` → spring → uniform in `useFrame`). The mix mask = world-space gradient along the truck's length + 3-octave simplex noise, so the transition edge is a ragged, feathered "blast line" that travels front-to-back, with a 0.05-wide white-hot rim highlight at the boundary. One material, one mesh pass — cheap.

### 4.3 "The Blast Slider" — before/after, the centerpiece
Every before/after in the site uses this component, not a plain clip-path wipe. **Technique (photo version):** two stacked `<img>`, top one masked by `mask-image: linear-gradient` *composited with* an SVG `feTurbulence` noise map, handle position via Framer Motion `drag="x"` + `useMotionValue` → CSS custom property. The drag handle is a small blast-nozzle icon; grain "spits" at the edge (6-particle CSS burst on drag). Falls back to a hard-edge slider if mask compositing is unsupported. Fully touch-native — this is the interaction mobile users get at full fidelity. Also ships as an embeddable unit on every build page (each project = its own slider).

### 4.4 "Torque-Spec Type" — kinetic vintage headlines
Abril Fatface headlines assemble like fasteners being torqued. **Technique:** headline split into `motion.span` letters (SplitText-style util, ~20 lines, no GSAP license needed); `staggerChildren: 0.03`; each letter springs in from `rotate: ±7°, y: 0.4em, opacity 0` with the stiff spring from §2.4 — the overshoot-and-settle reads as a wrench click. On section H2s it re-fires once at 30% viewport entry (`whileInView`, `once: true`). Reduced-motion: instant render.

### 4.5 "Exploded Order" — scroll-driven teardown
S2's exploded view. **Technique:** the pickup GLB is grouped in Blender into 7 named nodes (cab, hood, bed, 4 wheels/bumpers); in R3F each node's position lerps outward along preset vectors mapped to section scroll progress (`useTransform(scrollYProgress, [0,1], [packed, exploded])` per axis). Plex Mono part labels are HTML (`drei <Html>` occluded), so the text stays crawlable and crisp. No physics, no per-bolt rigging — 7 transforms.

### 4.6 "Redline Progress" — the dyno-gauge scroll indicator
Persistent bottom-right gauge: needle sweeps 0→redline across the homepage story, section names ticking beneath like an odometer. **Technique:** one SVG needle, `rotate` bound to `useScroll().scrollYProgress` through `useTransform` (−120°→+120°), section label swapped via `IntersectionObserver`. It doubles as nav: click a tick, smooth-scroll to that chapter. ~3KB total; also present on mobile.

---

## 5. Mobile Experience (first-class, not a fallback)

Mobile is most local-intent traffic and where Google measures CWV (playbook §7.2) — so mobile gets a *different composition*, not a broken desktop one.

**What mobile users get:**
- **Full hero identity:** cream + grain + "The Sign, Struck" (pure SVG — identical to desktop) + Torque-Spec headline. The 3D canvas never mounts on mobile.
- **The restoration journey as a scrubbed image sequence:** the rust→chrome transformation is pre-rendered from the desktop scene into a **24-frame 640px WebP sequence (~350KB total)** drawn to a `<canvas>` scrubbed by scroll — Apple-product-page technique, butter-smooth at 60fps on a mid-tier Android, zero WebGL. Teardown becomes 3 keyframes with pinned labels.
- **Blast Sliders at full fidelity** — the centerpiece interaction is *better* on touch (thumb-drag is the native gesture). Every before/after works day one.
- **Redline gauge** persists as the scroll indicator; sticky bottom bar with `tel:7809996450` and "Start Your Build" (tap-to-call is the #1 mobile conversion for a shop).
- Form is 3 steps with photo upload from camera roll.

**How it ships fast:** the R3F/three bundle is a `next/dynamic` import gated on desktop viewport + `requestIdleCallback` — mobile never downloads three.js at all (~150KB gzip saved). Hero image preloaded AVIF/WebP with explicit dimensions; fonts subset + preloaded; all sections SSG HTML.

**Hard CWV budgets (from the AI-SEO playbook, p75 field data):**

| Metric | Playbook target | This build's budget |
|---|---|---|
| LCP | < 2.5s (aim < 1.8s) | **< 1.5s** — static cream hero + preloaded headline/badge, canvas deferred |
| INP | < 200ms (aim < 100ms) | **< 100ms** — no three.js on mobile, sliders on `transform`/mask only |
| CLS | < 0.1 (aim < 0.05) | **< 0.03** — every canvas/image slot has reserved aspect-ratio boxes |

Context: competitor homepages weigh 805KB–1.58MB of HTML alone (teardowns 1 & 3). A green-across-the-board mobile score is a measurable ranking weapon here, not hygiene.

---

## 6. Sample Copy (terse gearhead voice)

### Hero headline options
1. **DON'T SAVE YOUR DREAMS FOR SLEEP. REVIVE YOUR RIDE.** — their own tagline, typos fixed, finally set in type that deserves it. *(Recommended: Terry recognizes it instantly — "that's my line, done right" is the whole pitch in one glance.)*
2. **RUST IS JUST THE BEFORE PICTURE.**
3. **OLD IRON. DONE RIGHT.** — sub: *Classics and customs, built in Edmonton.*

### Service section block (Restoration — S6 card expanded / pillar page intro)

> **CLASSIC CAR RESTORATION — EDMONTON**
>
> Frame-off or rolling. Body, metal, paint, wiring, interior, drivetrain — one shop, one standard.
>
> We take barn finds, stalled projects, and the truck your dad should never have sold, and put them back on the road the way they were built to run. Every build is photographed, documented, and driven before it leaves.
>
> ★ Frame-off and rotisserie restorations
> ★ Rust repair — patch panels, floor pans, structural
> ★ Period-correct interiors, modern comforts hidden where they belong
> ★ Carb rebuilds, points-to-electronic ignition, drum-to-disc conversions
>
> Straight numbers on cost and timeline before we turn a wrench.
> **[SEE THE WORK]  [GET A QUOTE]**

### CTA block (S8)

> **GOT A PROJECT SITTING?**
>
> Barn find. Half-done build another shop gave up on. A truck that deserves better than a tarp.
>
> Send photos. Get a straight answer.
>
> **[START YOUR BUILD]** — two minutes, attach pictures from your phone.
>
> 780-999-6450 · 2009 91 Ave NW, Edmonton — borders Sherwood Park · Mon–Fri 9–5

*(Voice rules applied throughout: short declaratives, shop nouns, zero marketing adjectives, no exclamation points, humor dry and earned — matching Terry's own terse captions and the Metallica/AC-DC register of his reels.)*

---

## 7. SEO Integration (the art ships the keywords)

The scrollytelling homepage and the SEO architecture are the same object, because every scroll chapter is server-rendered HTML with a question-bearing H2 and a 40–60-word answer-first block (playbook §7.3) — the WebGL is a layer above the document, not a replacement for it. Next.js SSG output passes the playbook's non-negotiable render mandate (§7.1: no AI crawler but Googlebot executes JS).

**Page architecture → target keywords (from keyword-universe shortlist §13):**

| Page | Primary target (priority) |
|---|---|
| `/` (the scroll story) | speed shop Edmonton ★★★ · custom car shop Edmonton ★★★ · brand |
| `/services/classic-car-restoration-edmonton` | classic car restoration Edmonton ★★★ (#1 prize — Alignable directory ranks first today) |
| `/services/restomods-custom-builds` | restomod Edmonton / restomod shop Alberta ★★★ (completely unclaimed) |
| `/services/engine-swaps-ls-conversions` | LS swap Edmonton / engine swap Edmonton ★★★ (no shop ranks at all) |
| `/services/muscle-car-restoration` | muscle car restoration Edmonton ★★★ (a Kartunes *gallery* ranks today) |
| `/services/classic-truck-restoration` | classic truck restoration Edmonton / C10 & square body Alberta ★★★ (Kijiji ranks) |
| `/services/classic-service` | carburetor rebuild Edmonton ★★★ wedge + tune-ups, brakes, ignition |
| `/areas/sherwood-park` (first of the suburb set) | classic car restoration Sherwood Park ★★★ (YellowPages-only SERP; shop physically borders it) |
| `/builds/[slug]` (one URL per car) | long-tail: "1960s Dodge D100 restoration Edmonton" etc. — the Kartunes lesson: galleries rank, so ours are keyword-titled pages with specs, hours, dates, and a Blast Slider each |

**Schema stack (playbook §3, in raw HTML):** sitewide `AutoRepair` node `@id: /#business` with verified NAP (2009 91 Ave NW, T6P 1L1), geo matching the GBP pin (53.5249595, −113.374974), `openingHoursSpecification` Mon–Fri 9–5, `sameAs` → IG/Threads/GBP/Yelp/Bing, `knowsAbout` restoration/LS swaps/restomods; per-page `Service` nodes with `provider → #business` and `minPrice` offers; `FAQPage` blocks whose visible text = schema text ("How much does a classic car restoration cost in Alberta?" — the zero-Canadian-content query, ★★★ blog #8); `Person` node for Terry on About; `BreadcrumbList`; no fabricated `aggregateRating` (2.7★ stays off-site until the review program fixes it — reviews-reputation §2.2 math: ~10 legit 5-stars lifts 2.7→~4.1).

**Concept-specific SEO wins:**
- Every Blast Slider pair ships descriptive alt text per side ("1962 Dodge D100 before restoration — surface rust, Edmonton" / "…after frame-off restoration at 2240 Speed Shop") — image SEO both directions.
- The S4 Drivetrain chapter *is* the LS-swap answer block, on the highest-authority URL.
- Comparison **tables** (restoration tiers: driver / show / concours with CAD ranges — tables earn 2.5–4.2× AI citations, playbook §7.3) styled as work-order sheets in Plex Mono — the design system makes the highest-citing content format *look* on-brand instead of bolted on.
- `robots.txt` allowing all AI agents + `llms.txt` per playbook §2/§7.4; GSC + Bing Webmaster on day one.
- Footer on every page: full NAP string + `built with ❤ by kr8tiv` → kr8tiv.io.

Nothing about the art compromises this: view-source on any page shows a complete, readable, schema'd document.

---

## 8. Asset Plan

### From the extracted set (02-assets, 31 files — INVENTORY.md)

| Asset | Use in this concept |
|---|---|
| `logos/storefront-sign-SOURCE.jpeg` | **The brand system source.** Vector-trace to SVG (Inkscape trace + manual bezier cleanup, ~half day): full badge, wordmark lockup, crossed-wrench glyph, star bullet, favicon, OG image. Drives §4.1. |
| `instagram/ig-D100-slide1-fullres.jpg` | S5 Reveal match-cut hero + OG image candidate. Best image we own. |
| `instagram/ig-D100-slide2-lightpatch.jpg` | "The hood that stopped a photographer" detail panel; rust-texture reference for the shader. |
| `instagram/ig-D100-slide3.jpg` | Build-page gallery. |
| `website/IMG_0402-covered-classic.jpeg` | S1 The Find. |
| `website/IMG_0401-stripped-blue-frame.jpeg` | S2 Teardown proof panel + "before" side of a Blast Slider. |
| `website/IMG_1954-original.png` (crop black bars) | Olive Camaro — services card, gallery. |
| `website/IMG_0052-red-pickup-texaco.jpeg`, `IMG_1949-blue-pickup.png`, `IMG_0051-mission-black-classic.jpeg`, `IMG_0434-black-muscle-car.jpeg` | S6 work-order cards + `/builds` gallery seeds. |
| `website/IMG_2950-original.jpeg` (Triumph + neon) | About/culture strip. |
| `website/IMG_2943-original.jpeg` (storefront) | S8/Contact + About — proves the sign is real. |
| `website/IMG_0446-team-photo.jpeg` | About (held until Terry supplies names). |
| `instagram/` 13 reel thumbs + profile pic | "Live IG gallery" grid — demo phase: static grid of these thumbs linking to the real posts (embeds/API post-signing). |
| **Not used:** Getty blog image (license forbids reuse — INVENTORY warning) · TikTok thumbs (Terry's personal account, off-brand). |

Honest gap: we do **not** have true before/after pairs of the same car. Demo sliders pair process shots (stripped frame vs. finished cars) labeled as "in the shop / out the door"; the 3D rust-to-chrome carries the literal transformation until Terry's real build archives arrive.

### To build or buy (named sources)

| Asset | Source | Cost/effort |
|---|---|---|
| 1960s American pickup GLB (D100-style) | **Sketchfab** free CC-BY (search "Dodge D100", "vintage pickup"); fallbacks: **market.pmndrs.com** (CC0, R3F-ready), **Poly Pizza**; if free options are too high-poly/ugly, buy on Sketchfab Store/CGTrader ($15–40). Then Blender: decimate <80k tris, group 7 teardown nodes, bake AO, re-UV the body for the transition gradient | 0.5–1 day incl. Blender prep |
| Garage HDRI | **Poly Haven `autoshop_01`** (free CC0 — an actual auto-shop environment) | minutes |
| Rust/concrete/metal PBR textures | **ambientCG** `Rust002`/`Metal032`/`Concrete034`, **Poly Haven** `rust_coarse_01` (all CC0) | minutes |
| Rust→chrome `ShaderMaterial` | Written for this build (GLSL, ~80 lines) | 0.5 day |
| Film-grain tile + noise masks | Generated (Photoshop/ImageMagick turbulence) | 1 hour |
| Optional set props (toolbox, tires, jack) | market.pmndrs.com / Sketchfab CC0 — used sparingly; the set is a lit vignette, deliberately NOT a full garage replica (that's the other concept's fight) | 0.5 day |

### Needs Terry (post-signing, none block the demo)
Raw reel mp4s · per-build before/after photo archives (turns every Blast Slider real) · team names for IMG_0446 · the sign fabricator's cut file if it exists (perfect vectors free) · license/commission of the D100 shoot from @natlajphotography (relationship already documented, social-presence §3.8) · confirmation of AMVIC license number + Red Seal certs for the E-E-A-T layer.

---

## 9. Build Estimate ("this week" pace → pitch-ready demo)

| Day | Ship |
|---|---|
| **1** | Next.js scaffold, design tokens, self-hosted fonts, badge vectorized, "The Sign, Struck" hero live (static-complete, LCP-safe), full homepage copy in place |
| **2** | Truck GLB sourced + Blender prep; R3F scene, lighting, HDRI; Lenis scroll rig; S0–S2 (Find, Teardown/exploded view) |
| **3** | Rust-to-chrome shader + scroll binding (S3–S5 incl. D100 match cut); Blast Slider component; Torque-Spec type; Redline gauge |
| **4** | S6–S8: service cards, review strip, quote form (server action → email w/ photo upload); 2 pillar pages fully written (Restoration, Restomod); schema stack + llms.txt + robots; mobile image-sequence path |
| **5** | Mobile pass against §5 budgets, Lighthouse/PSI verification, deploy to Hostinger subdomain (VPS if SSH is back, managed Node fallback per brief), walkthrough one-pager |

**4–5 focused days to demo.** Realistic risk buffer: the truck-model hunt and shader tuning (days 2–3) can each slip half a day — the cut order below absorbs it.

**Corners safely cut for v1 (and restored post-signing):**
- Exploded view = 7 grouped nodes, not per-part rigging.
- 2 of 6 pillar pages fully written; other 4 designed as cards with 150-word stubs (still indexed, still schema'd).
- Suburb pages: Sherwood Park only; St. Albert/Leduc/Spruce Grove after signing.
- IG gallery = static ripped-thumb grid linking out; oEmbed/API integration needs their account access anyway.
- Blog = scaffold + 3 cornerstone outlines (playbook §8E), not written posts.
- Form → email only; CRM/booking later.
- Reduced-motion + static fallbacks shipped; exotic-browser polish deferred.

---

## 10. Why This One Wins / When to Pick It

**Why it wins:** It's the only concept that is *unfakeable*. Every competitor teardown found the same visual market — dark templates, dead blogs, zero brand systems — and any of them could commission a neon 3D garage next year. None of them owns a laser-cut corten sign, a photographer-magnet D100, or "customs and classics" as an earned identity. Rust & Chrome converts 2240's actual physical assets into the digital brand, which makes the pitch to Terry emotional ("that's MY sign") rather than technical — and per the brief, closing Terry is the win metric. It's also the *cheapest credible wow*: one truck model + one shader + one slider component, versus a full 3D environment build; the centerpiece interaction (before/after) doubles as the conversion argument for a shop whose whole value is before/after; and its mobile story is genuinely first-class because the signature interaction is touch-native. Reputation-wise, the warm, documentary tone directly counters the 2.7★ insider-dispute cluster — this looks like a shop with nothing to hide.

**Honest risks:** cream + vintage can drift "museum" instead of "speed" if the motion isn't aggressive — the torque-click springs and blast wipes are load-bearing, not decoration. The rust-to-chrome shader is the one piece of real technical risk (budgeted, with the image-sequence fallback ready). And it deliberately delivers *less raw 3D spectacle* than a full garage drift-through — if Matt's pitch theater needs maximum "how is this a local shop's website," this isn't the flashiest option.

**Pick Rust & Chrome when:** the pitch audience is Terry himself; the D100/sign assets land as strongly in the room as they do in research; the week is tight and you want the highest wow-per-build-day; or the strategy leads with reputation repair and heritage. **Pick another concept when:** the demo's job is a pure tech flex for Matt's portfolio (the stylized 3D garage drift-through from the brief out-spectacles this), or if Terry — against all observed evidence of his rusted-steel sign, patina'd trucks, and classic-rock reels — says he wants to look "futuristic." Everything we know about the man says he won't.
