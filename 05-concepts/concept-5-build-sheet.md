# Concept 5 — "THE BUILD SHEET"

**Direction:** Editorial-technical. Blueprint / spec-sheet aesthetic — engineering drawings of classic cars, dyno-chart motifs, torque-spec typography, build diaries presented as technical documents. Singer Vehicle Design's technical romanticism, priced for a shop on the Sherwood Park line.
**Project:** 2240 Speed Shop spec-pitch rebuild · **Prepared:** August 2, 2026
**Grounding:** 00-brief.md (locked), 01-research/site-audit + reviews + social, 03-seo/keyword-universe + blog-keywords + ai-seo-playbook + competitor teardowns 1–3.

---

## 1. The Pitch

**To Matt:** This is the one concept where the art *is* the SEO strategy — spec tables, evidence-dense copy, question-headed document sections, and per-build case-study pages are exactly the content patterns the AI-SEO playbook says earn 2.5–4.2x more AI citations, so the 50-blog engine and the keyword-owning service pages slot in natively instead of fighting the design. **To Terry:** Your website becomes a binder of build sheets — every car you touch gets a numbered drawing, a torque table, hours logged, and before/after photos, presented the way Singer presents a reimagined 911 — because "go meet Terry and look at the work firsthand" (his best Google review) should be what the website *does*, not what it asks people to do. It's the shop's own language — work orders, spec sheets, redline markups — leveled up to a $100K-restoration-client aesthetic that no shop in Edmonton, Sherwood Park, or anywhere in Alberta comes near.

---

## 2. Visual Language

### 2.1 Palette — "Redline Drafting"

The brand red (#a02d2d, from the live site's PWA manifest) is repositioned as the **redline** — the color engineers use to mark up revision drawings, and the color on a tach where the fun starts. Everything else is paper, ink, and carbon.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#f2ede3` | Bond-paper cream — spec-sheet sections, light mode base |
| `--carbon` | `#0e0f11` | Shop-floor black — hero, dark sections, photo backdrops |
| `--ink` | `#1a1a1a` | Body text on paper; drawing linework |
| `--redline` | `#a02d2d` | THE brand red — rule lines, stamps, section numbers, links, CTAs |
| `--redline-hot` | `#c73a3a` | Hover/active states, focus rings, the tach needle |
| `--gauge` | `#e8e4da` | Text/linework on carbon |
| `--annotation` | `#8a877f` | Dim gray — dimension labels, captions, metadata |
| `--steel` | `#3d4b5c` | Secondary chart strokes, table zebra tint, subtle only |
| `--manila` | `#d8c9a3` | Folder-tab accents, "IN PROGRESS" stamps — sparing |

Rule: red never exceeds ~10% of any viewport. It reads as a markup color, so every use carries meaning (this is interactive / this is approved / this is the number that matters).

### 2.2 Typography (all free, Google Fonts, self-hosted subsets)

| Role | Font | Treatment |
|---|---|---|
| Display / headlines | **Archivo** (Black + Expanded, variable) | Uppercase, tracked +2–4%, huge. Continuity: Archivo Black is already on the current site — "your brand, leveled up" per the brief |
| Body | **IBM Plex Sans** | 16–18px, 1.6 line height, max 68ch measure |
| Spec data / tables / part numbers | **IBM Plex Mono** | The torque-spec voice. Tabular numerals. Every number on the site is Mono |
| Stamps | **Saira Stencil One** | Rubber-stamp marks only: APPROVED, IN PROGRESS, SOLD, REVIVED |
| Margin notes | **Architects Daughter** | Engineer's pencil annotations — max one per section, or it turns into scrapbooking |

IBM Plex is literally an engineering-document family; pairing it with Archivo's industrial weight gives "drafting office attached to a fab shop."

### 2.3 Texture & material system

- **Grid paper:** faint 8px minor / 40px major grid on `--paper` sections (pure CSS gradients, zero image weight).
- **Title blocks:** every page and every "sheet" section carries an engineering-drawing title block — bordered box, bottom-right: `DWG NO · SHEET · REV · DATE · DRAWN BY: T. HARMIDER · 2240 SPEED SHOP, EDMONTON AB`. This is the design system's signature *and* a crawlable NAP/E-E-A-T block.
- **Dimension lines:** arrowed measurement lines with Mono labels frame photos and diagrams.
- **Halftone photo treatment:** shop photos screened like old service-manual plates (CSS `filter` + SVG feTurbulence duotone, or pre-processed in build step). Full-color reserved for hero reveals and the featured-build money shots — the contrast makes real photography land harder and flatters the candid phone shots we actually have.
- **Dyno-printout motif:** charts rendered on tractor-feed paper (perforated edge strips) in Mono.
- **Stamps:** red rubber-stamp marks, slightly rotated, slightly inked-out — the only "distressed" element allowed. No fake rust, no grunge overlays; the badge sign carries all the patina this brand needs.
- **The badge:** the laser-cut rusted-steel "SPEED SHOP 2240 — CLASSICS AND CUSTOMS" circular sign, vectorized, used two ways — flat one-color ink stamp version (favicon, title blocks, footer) and the photographic rusted-steel version (hero, about).

### 2.4 Motion principles

1. **Mechanical, never bouncy.** Ease `cubic-bezier(0.2, 0, 0, 1)`, 150–300ms. Parts snap into alignment like they've been torqued to spec.
2. **Things draw, then fill.** Linework animates first (SVG stroke), reality fades in second. The whole site rehearses one metaphor: drawing → machine.
3. **Numbers count.** Any stat enters as an odometer-style count-up.
4. **One thunk per section.** Stamps land with a single high-stiffness spring + 2px paper shake. Never two animations competing.
5. **`prefers-reduced-motion` honored globally** — every draw/count/stamp has an instant-state fallback (also the SSR/no-JS state, which keeps crawlers happy).

---

## 3. The Hero Moment

### First 5 seconds (desktop)

- **0.0–0.5s** — Instant paint: cream grid paper, the title block (`SHT-01 · REV A · 2240 SPEED SHOP · EDMONTON, AB`), and the H1 are server-rendered text/CSS. LCP is the headline — target **< 1.0s**. No spinner, no black screen, ever.
- **0.5–2.5s** — **The truck draws itself.** The 1960s Dodge D100 — the shop's photographed-by-a-stranger signature truck — renders as an ink-line engineering side-elevation, SVG paths animating stroke-by-stroke (wheels → cab → the hood).
- **2.5–3.5s** — Dimension lines extend off the drawing; Mono callouts stamp in: `WHEELBASE 114 IN` · `V8 · 4-SPD` · `HOOD: ORIGINAL LIGHT PATCH — DO NOT REPAINT`. That last annotation is the brand in one line.
- **3.5–4.5s** — A soft clip-path wipe sweeps left-to-right and the drawing becomes the **real photograph** — the professionally shot D100 with the famous light-patch hood. Red stamp slams bottom-right: **REVIVED**.
- **4.5–5.0s** — Tagline settles under the H1; scroll cue appears as a vertical dimension arrow labeled `SCROLL — SHT 02 OF 09`.

The one-time intro never replays on navigation (sessionStorage flag); returning visitors land on the finished photo state instantly.

### Scroll journey — homepage as a numbered drawing set

| Sheet | Section | Content |
|---|---|---|
| **SHT-01** | Cover | Hero above. H1 + tagline + primary CTA `START A WORK ORDER` |
| **SHT-02** | Drawing index — services | The six service pillars as a bill-of-materials table: `2240-REST-001 RESTORATIONS · 2240-CUST-002 CUSTOMS & HOT RODS · 2240-SWAP-003 LS & DIESEL CONVERSIONS · 2240-ENG-004 ENGINE & CARBURETOR · 2240-BODY-005 BODY, PAINT & INTERIOR · 2240-CLAS-006 CLASSIC SERVICE`. Each row: drawing number, service, one-line spec, `VIEW SHEET →` |
| **SHT-03** | Featured build | The D100 as a full spec-sheet case study teaser: halftone photo trio, spec table, hours logged, the light-patch story in 60 words, link to the build page |
| **SHT-04** | The Teardown | Signature Three.js moment — exploded small-block V8, scroll-scrubbed (see §4.2) |
| **SHT-05** | Inspection report — proof | Reviews reframed as QC sign-offs: the three real 5-star Google reviews (Kaitlyn, Matt H., David — all name Terry) as stamped inspection cards; live GBP link; `LEAVE A REVIEW` CTA feeding the reputation-repair program |
| **SHT-06** | Drawn by — about | `DRAWN BY: T. HARMIDER`. Terry's block: customs and classics, the badge sign photo, halftone team photo, Radium Show & Shine mention, B2B endorsements (Yesterdays Auto Gallery, three-time customer) |
| **SHT-07** | Site plan — service area | Drafting-style plan map: shop pin at 2009 91 Ave NW on the Sherwood Park boundary line, radius rings to St. Albert / Leduc / Spruce Grove / Fort Saskatchewan; links to suburb pages |
| **SHT-08** | The log — latest entries | Blog teaser as a revision-history table: date, sheet number, title, `READ →`. This is where the 50 posts live natively |
| **SHT-09** | Work order — quote form | Service picker, year/make/model, photo upload, phone/email. Footer: full NAP, hours, IG embed link, badge stamp, and the locked credit `built with ❤ by kr8tiv` → https://kr8tiv.io |

---

## 4. Signature Interactions (all named, all buildable this week)

### 4.1 "Redline Reveal" — hero drawing-to-photo
**Tech:** Trace the D100 photo to SVG (vtracer/Inkscape auto-trace + 1–2h manual cleanup to ~40–60 clean paths). Framer Motion `motion.path` animating `pathLength` 0→1 with staggered delays; dimension lines are separate paths with their own stagger group; photo reveal is a `clip-path: inset()` animation on the stacked `<img>`. Pure SVG + one image — no WebGL, so it runs identically on a 3-year-old Android. Reused smaller on every service page (each pillar gets one traced element: a crankshaft, a carb, a body shell from the six legacy background-removed cutout PNGs).

### 4.2 "The Teardown" — scroll-scrubbed exploded V8
**Tech:** React Three Fiber + drei. One small-block V8 GLB (Sketchfab, see §8). Scroll progress via `useScroll` (Framer Motion) mapped to per-part positions along pre-authored explode vectors (`THREE.Vector3.lerpVectors` in `useFrame` — no physics, just lerp). Line-art look: `EdgesGeometry` overlay in `--ink` on `--paper` background so the 3D reads as a living technical drawing, not a game asset. Part labels via drei `<Html>` anchors that draw leader lines as parts separate. Canvas is `next/dynamic` lazy-loaded below the fold — zero impact on hero LCP. **Mobile/low-power fallback:** pre-rendered 40-frame WebP sequence scrubbed on scroll from the same scene — identical story, ~600KB lazy-loaded.

### 4.3 "Work Lamp" — cursor-lit photography
**Tech:** On featured-build photos, the image sits in duotone/halftone; a radial CSS `mask-image` gradient follows the pointer (`onPointerMove` → Framer Motion `useMotionValue` + `useTransform`, applied as mask position) revealing full color under the "lamp." Directly quotes the origin story — a photographer pulled over because of how light hit that hood. Desktop-only enhancement; mobile gets a slow auto-pan of the mask (CSS animation) or plain full-color.

### 4.4 "Torque Table" — spec tables that tighten into place
**Tech:** Semantic `<table>` (SSR'd, crawlable — this is a load-bearing SEO element, §7). Framer Motion `whileInView` staggered row reveals (clip + 4px slide, 40ms stagger); numeric cells count up via `animate()` on a motion value. On build pages, hovering a row cross-highlights the matching part on the adjacent SVG drawing (shared ids, CSS `:has()`/data-attr toggle). Tables collapse to stacked definition-list cards under 640px.

### 4.5 "Stamp & Sign-off" — the one allowed thunk
**Tech:** Framer Motion variant: `initial {scale: 1.6, rotate: -4, opacity: 0}` → spring `{stiffness: 600, damping: 28}`, plus a 2px translate shake on the parent "paper" — used for section approvals, review cards, and the quote-form success state (`WORK ORDER RECEIVED — WE'LL CALL YOU`). One stamp per section, enforced.

### 4.6 "Sheet Turn" — route transitions
**Tech:** Next.js App Router + Framer Motion `AnimatePresence`: outgoing page lifts 12px with a paper-edge drop shadow (clipboard page flip), incoming page's title-block border draws in (SVG `pathLength`, 300ms). Cheap, distinctive, and it makes the "binder of drawings" metaphor hold across the whole site.

**Honesty guard:** the dyno-printout chart motif is decoration and shop-stat display (builds completed, hours logged, years) unless Terry supplies real dyno sheets or timeslips — 2240 has no dyno on record (keyword research: dyno tuning is partner/blog territory only). We never fabricate performance numbers; charts without a source get a `REFERENCE ONLY` watermark.

---

## 5. Mobile Experience (first-class, not fallback)

A spec sheet is already a phone-native format — a single-column document you scroll. Mobile isn't a degraded 3D scene; it's the *most natural* reading of this concept.

- **Hero:** identical drawing→photo reveal, compressed to ~1.5s, SVG cropped to a tighter elevation. SVG line animation costs almost nothing on mobile GPUs.
- **The Teardown:** scroll-scrubbed WebP frame sequence (§4.2) with tap-to-highlight part labels — no WebGL context on mobile, no thermal throttling, no jank.
- **Tables:** stacked spec cards; wide tables get `overflow-x` scroll inside their own container with a visible ruled edge (never body-level horizontal scroll).
- **Sticky work-order bar:** bottom-fixed `START A WORK ORDER` + tap-to-call `780-999-6450` (research: this demographic phones the shop). 48px minimum targets throughout.
- **Forms:** service picker as native `<select>`, photo upload via `capture`-friendly input, 3 fields visible per step.
- **Core Web Vitals (targets straight from ai-seo-playbook §7.2, p75 mobile field data):**

| Metric | Playbook target | This concept's budget |
|---|---|---|
| LCP | < 2.5s (aim < 1.8s) | **< 1.2s** — LCP is server-rendered headline text + CSS grid; hero photo preloaded AVIF/WebP with explicit dimensions |
| INP | < 200ms (aim < 100ms) | **< 100ms** — R3F bundle lazy-loaded below fold; interaction JS is Framer Motion only; no heavy hydration above fold |
| CLS | < 0.1 (aim < 0.05) | **< 0.02** — every image/chart/embed box has reserved dimensions; fonts self-hosted, `font-display: swap`, metric-matched fallbacks |

Every competitor fails this bar (teardowns: SSS 1.58MB Squarespace, Sideshow 805KB Wix, JBs 730KB Shopify, Iron Garage on 2016 jQuery). A paper-and-SVG site makes speed a visible brand feature — and the playbook makes CWV a ranking input.

---

## 6. Sample Copy (terse gearhead voice — torque specs over marketing speak)

### Hero headline options

**A (their line, typos fixed — recommended):**
> **DON'T SAVE YOUR DREAMS FOR SLEEP. REVIVE YOUR RIDE.**
> Customs and classics. Built, documented, and driven out of Edmonton.

**B (the concept's thesis):**
> **EVERY CAR LEAVES HERE WITH A BUILD SHEET.**
> Frame-off restorations, hot rods, LS and diesel conversions. Every bolt torqued to spec. Every spec written down.

**C (the flex):**
> **TORQUE SPECS, NOT SALES TALK.**
> Edmonton's customs-and-classics shop. The work speaks. We just document it.

### Service-section block — SHT / DWG 2240-REST-001 · RESTORATIONS

> **DWG 2240-REST-001 · REV C · DRAWN BY: T. HARMIDER**
>
> **CLASSIC CAR RESTORATION — EDMONTON**
>
> We restore classic cars and trucks in Edmonton — frame-off or rolling, driver-quality to show-quality. Bodywork, paint, drivetrain, wiring, brakes, interior. You get a build sheet at every stage: hours logged, parts fitted, decisions documented. No surprises at invoice.
>
> **SCOPE OF WORK**
> ◆ Frame-off and rolling restorations — muscle, trucks, British classics
> ◆ Rust triage and metal repair — patch panels, floor pans, structural
> ◆ Drivetrain revival or upgrade — points to electronic ignition, drum-to-disc, radials
> ◆ Period-correct interiors with discrete modern amenities
> ◆ Stalled project rescue — we finish what other garages started
>
> **REFERENCE DATA**
> | Item | Spec |
> |---|---|
> | Full frame-off | 800–1,200 shop hours, typical |
> | Driver-quality refresh | Scoped by the sheet, not the calendar |
> | Fresh concrete note | New paint and Alberta cold don't mix — we schedule around it |
>
> **Q: WHAT DOES A RESTORATION COST IN ALBERTA?**
> Depends on the car, the rust, and how far you want to go. We quote in writing, in stages, with a number for each sheet. Read the cost guide, then bring us the truck.
>
> `[READ THE COST GUIDE]` `[START A WORK ORDER]`

### CTA block — the work order

> **START A WORK ORDER**
>
> Tell us what's sitting in the garage. Year, make, what it needs, a couple of photos.
> Terry reads every sheet. You'll get a call, not a form letter.
>
> `[SERVICE ▾]` `[YEAR / MAKE / MODEL]` `[PHOTOS +]` `[SEND IT]`
>
> 780-999-6450 · 2009 91 Ave NW, Edmonton — right on the Sherwood Park line. Mon–Fri 9–5.

---

## 7. SEO Integration — the concept IS the strategy

This is the section that separates Concept 5 from the other four: the build-sheet format and the AI-SEO playbook's citation patterns are the same thing.

### 7.1 Aesthetic = citation format (playbook §7.3, Princeton GEO study)
- **Tables earn 2.5–4.2x more AI citations** → this design is *made of tables*. Every spec table is a semantic, server-rendered `<table>`.
- **Statistics boost visibility up to 40%** → evidence density (hours, dollar ranges, years, dimensions) is the concept's decorative language. "800–1,200 shop hours" is both a design element and a liftable answer.
- **Question-format H2s are 3.4x more extractable** → every service sheet carries stamped Q-blocks ("WHAT DOES A FRAME-OFF RESTORATION COST IN ALBERTA?") answered in the first 40–60 words.
- **Standalone liftable sections** → sheets are self-contained by design; the title block on each restates business name + city, so any lifted passage carries the entity.
- **Freshness** → every sheet displays `REV` + date; content updates are literally revision bumps — a visible, honest freshness signal Perplexity weights.

### 7.2 Page architecture → target keywords (from keyword-universe shortlist)
| Page (sheet) | Primary target | SERP status today |
|---|---|---|
| Home | **speed shop Edmonton** (★★★ — it's the name; JBs holds it with an About page) | Winnable, long game |
| /services/restoration | **classic car restoration Edmonton** (★★★, #1 shortlist) | Alignable directory ranks #1 — beatable |
| /services/customs-hot-rods | **custom car builds / hot rod shop Edmonton** + **restomod Edmonton** (unclaimed in all of Edmonton) | Facebook pages rank — wide open |
| /services/ls-diesel-conversions | **LS swap Edmonton / engine swap Edmonton** (★★★) | *No shop ranks at all* — forums and Kijiji |
| /services/engine-carburetor | **carburetor rebuild Edmonton** (★★★ wedge) + performance engine build | Mail-order and forums rank |
| /services/body-paint-interior | rust repair / classic car interior Edmonton | Low-med |
| /services/classic-service | classic truck restoration Edmonton, C10/square-body Alberta (★★★) | Kijiji ranks — open |
| /builds/[slug] | Long-tail per build: "1968 Dodge D100 patina preservation Edmonton", "muscle car restoration Edmonton" proof pages | Kartunes ranks with a *gallery* — build sheets crush galleries |
| /areas/sherwood-park (first of the suburb set) | **classic car restoration Sherwood Park** (★★★ — YellowPages-only SERP; shop physically borders it) | Open |
| /pricing (SHOP RATES sheet) | classic car restoration cost Edmonton/Canada queries | **Zero shops publish pricing** (teardown finding); Iron Garage's dyno card is the only precedent |
| /log (blog hub) | The 50-post plan | Competitors published ~2 posts in 30 months combined |

### 7.3 The 50 blogs slot in natively
Every post is a numbered sheet in the same template — title block, REV date, author block (`DRAWN BY: T. HARMIDER` or credited writer with Person schema), spec tables, Q&A blocks. The three hub pillars from blog-keywords land as tabbed binders: **"Modified Car Laws in Alberta"** (cluster A), **"Real Costs in Canada"** (cluster B — the CAD cost-guide series that has zero Canadian competition), **"Performance Car Winter Survival — Edmonton"** (cluster D). Cornerstone at launch per the playbook: *Classic Car Restoration in Edmonton: Cost, Timeline & Process (2026)* + *How to Choose a Restoration Shop* + the Alberta exhaust-law guide.

### 7.4 Schema stack (playbook §3, all SSR'd in raw HTML — AI crawlers don't execute JS)
- Sitewide `AutoRepair` node, stable `@id`, full NAP (2009 91 Ave NW, Edmonton, AB T6P 1L1), geo matching the GBP pin, hours, `sameAs` (IG, Threads, GBP, future Yelp/Bing), `knowsAbout` (restoration, restomod, LS swaps, carburetors), `slogan` (the fixed tagline).
- `Service` node per pillar with `provider → #business` and `minPrice` where Terry approves ranges.
- `FAQPage` on every service sheet — the stamped Q-blocks are the visible text, so schema-matches-page is automatic.
- `Person` (Terry Harmider) on About; `Article` + author on every log entry; `ImageObject` with descriptive captions on build photos ("1968 Dodge D100 light-patch hood at 2240 Speed Shop, Edmonton"); `BreadcrumbList` everywhere.
- **No fabricated `aggregateRating`** — with a 2.7★/7 GBP, we ship review *generation* (SHT-05 inspection report + QR flow), not review markup, until the real number is worth syncing (playbook §3.4 rule; reviews-reputation math: ten legit 5-stars lift 2.7 → ~4.1).
- robots.txt allowing all AI agents + llms.txt at root (playbook §2 template) + sitemap to GSC and Bing Webmaster — Bing feeds ChatGPT/Copilot.

Nothing above compromises the art: the schema is invisible, the tables and Q-blocks *are* the aesthetic, and SSG keeps it all in raw HTML.

---

## 8. Asset Plan

### From the 32 extracted assets (02-assets rips)
| Asset | Use in this concept |
|---|---|
| natlaj D100 carousel (3 frames, re-pull via `instagram.com/p/DOZCypFjzTm/embed/captioned/`) | Hero trace source + SHT-03 featured build + Work Lamp demo. Credit @natlajphotography on the build page; flag for licensed hi-res after Terry signs |
| IMG_1954 (matte green vintage car — their og:image) | Build sheet #2, restoration page hero |
| IMG_1949 + blue pickup variants | Build sheet #3 (customs page) |
| IMG_0052 (red pickup, Texaco neon) | SHT-06 shop-culture strip |
| IMG_0051 (black classic in garage) | Restoration service sheet |
| IMG_0434 (black muscle car, cartoon-eye intake) | Customs & hot rods sheet |
| IMG_0401 / IMG_0402 (stripped frames in shop) | Process/teardown credibility — "in progress" sheets with IN PROGRESS stamps; these two are gold for this concept |
| IMG_2950 (vintage motorcycle + neon) | About sheet |
| IMG_0446 (3-person team photo) | About — halftone treatment dignifies the candid |
| IMG_2943 (badge sign photo, 822KB) | Vectorize the circular badge (vtracer + manual cleanup, 2–3h) → ink-stamp logo, favicon, title blocks |
| 6 legacy garagecar.ca background-removed car cutouts (Wayback) | Pre-isolated = ideal SVG trace sources for per-service line drawings |
| 13 IG post/reel embeds (verified embed endpoints in social-presence §5) | Live gallery on /builds — reels keep their Metallica/AC-DC audio on IG's side |
| **Getty 2156517235** | **EXCLUDED — licensed to GoDaddy only, do not reuse** (site-audit flag) |

### To build or buy (named sources)
- **Small-block V8 GLB** for The Teardown: Sketchfab has multiple downloadable V8 engine models (filter: downloadable, CC-BY — credit in site colophon); paid fallback CGTrader/TurboSquid $20–$60 if the free ones are too heavy. Budget 2–3h for decimation in Blender (target < 3MB Draco-compressed) and authoring explode vectors.
- **Poly Haven (CC0):** studio HDRI for the R3F scene lighting; concrete/metal textures if we dress the Teardown backdrop.
- **Paper grain/noise:** procedural (SVG `feTurbulence` + CSS) — no downloads, no weight.
- **Fonts:** Archivo, IBM Plex Sans, IBM Plex Mono, Saira Stencil One, Architects Daughter — Google Fonts, self-hosted subsets.
- **Optional stretch (skip v1):** Dodge D100 3D model exists on Sketchfab for a wireframe hero upgrade — the SVG hero makes it unnecessary.

### Needs Terry (post-pitch, none blocks the demo)
1. Real specs/hours/decisions for 2–3 signature builds (turns seeded sheets into true case studies — the E-E-A-T payload).
2. Hi-res straight-on photo of the steel badge sign for a cleaner vector pass.
3. Confirmation of the service list (Alignable shows 10 lines the website never mentioned: tinting, upholstery, transmission, electrical…).
4. Any dyno sheets/timeslips he's kept — unlocks the dyno-chart motif with real numbers.
5. Intro to Nathan Lajeunesse / JG Photography for licensed originals and the eventual real shoot.

---

## 9. Build Estimate — pitch-ready at "this week" pace

| Day | Deliverable |
|---|---|
| **1** | Next.js scaffold (App Router, SSG, TS, Tailwind tokens from §2.1), font subsets, grid-paper + title-block components, badge vectorized, D100 traced |
| **2** | Hero (Redline Reveal) + SHT-01–03; motion primitives (stamp, draw, count-up, Torque Table) |
| **3** | Six service sheets from one template with real keyword copy; schema stack (AutoRepair/Service/FAQ/Breadcrumb); 3 seeded build-sheet pages |
| **4** | The Teardown (R3F + mobile frame-sequence fallback); work-order form (serverless email post); IG embed gallery; SHT-05–07 |
| **5** | Sherwood Park suburb page; /log scaffold + 3 cornerstone stubs; llms.txt/robots/sitemap/OG; CWV pass (Lighthouse mobile ≥ 95); deploy to Hostinger demo subdomain; walkthrough one-pager |

**Total: 5 working days to pitch-ready.** Realistic with Matt + Claude at the pace the brief demands.

**Corners safely cut for v1 (all reversible):**
- Teardown ships as the frame-sequence on *all* devices if GLB wrangling eats Day 4 — identical story, zero WebGL risk in the demo.
- 3 build sheets, not a full gallery; 1 suburb page (Sherwood Park), template ready for the other five.
- Blog = hub + 3 stubs, not 50 posts (brief scopes outlines-only anyway).
- Form posts to email — no CRM until they sign. No CMS (brief: developer-managed, decide post-signing).
- Work Lamp desktop-only. Review section links out to GBP rather than live-API embeds.

---

## 10. Why This One Wins / When To Pick It

**Why it wins:**
1. **It's the only concept where the SEO play and the art direction are one object.** The pitch to Terry is "demo + research package" (brief: "1 and 2") — this concept lets Matt hold up the keyword research and the homepage and show they're the same document. Tables, spec density, Q-blocks, per-build pages: the playbook's citation patterns are the visual identity.
2. **It compounds.** Every future build is a new sheet; all 50 blogs are sheets; suburb pages are sheets. No other direction absorbs 60+ pages of content without design debt — this one gets *better* as content grows, and the content engine is the whole point of the rebuild.
3. **It's Terry's native language, elevated.** Work orders, torque specs, redline markups — the shop already thinks in this format. "Rolling works of art" (their own legacy copy) presented like Singer presents theirs. It flatters the trade instead of decorating it.
4. **It wins on speed by design.** Paper + SVG + one lazy 3D scene demolishes every competitor's bloated builder site on Core Web Vitals — a measurable ranking edge, not a taste opinion.
5. **Nobody in the market can copy it quickly.** A neon dark-mode template is a Wix theme away for any rival; a coherent engineering-document design system with real spec content requires the research this project already did.

**Honest risks / when to pick something else:**
- **Lower first-5-seconds spectacle than a full 3D garage drift-through.** If Matt's read on Terry is that the deal closes on jaw-drop cinema in the first meeting, the brief's dark neon-lit 3D shop-interior concept demos harder on a big screen. The Build Sheet impresses on the second minute, not the fifth second.
- **Paper can read "quiet."** A client expecting Metallica energy might see cream and grids before he sees the redline. Mitigation is the carbon-black sections and the hero reveal — but it's a real taste risk.
- **It's copy-dependent.** A spec-sheet site with vague copy collapses instantly; this concept demands the terse, numbers-forward writing in §6 be maintained everywhere, forever.
- **Tracing labor is front-loaded.** The drawings must be good; bad auto-trace linework would sink the premium read on Day 1.

**Verdict:** Pick The Build Sheet if the pitch leads with the SEO-domination story and the long game — it is the strongest compounding asset of the five and the one a $30K–$120K restoration client trusts most. Pick the cinematic-3D direction if the bet is pure first-impression spectacle. And whichever concept wins, **steal this one's build-sheet case-study template** — it's the highest-value single component in the whole set.

---
*End of Concept 5. Companion iteration doc (text/flow variant) to follow in this folder per the brief's 05-concepts scope.*
