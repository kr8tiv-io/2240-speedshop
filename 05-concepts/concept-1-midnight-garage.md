# Concept 1 — MIDNIGHT GARAGE
**Project:** 2240 Speed Shop spec-pitch rebuild · **Prepared:** August 2, 2026
**Direction:** A stylized neon-lit night garage interior built in React Three Fiber. As you scroll, the camera drifts through the shop — each station IS a service section. Futuristic cinematography wrapped around vintage iron. #a02d2d neon against near-black.

---

## 1. The Pitch

**To Matt:** This is the flagship — a scroll-driven 3D drift through a stylized night garage where the D100 sits on the hoist under neon, every camera stop is a keyword-owning service section, and the whole thing degrades to server-rendered HTML so the SEO play (per the AI-SEO playbook: no AI crawler except Googlebot executes JS) is never hostage to the art. **To Terry:** Nobody in Edmonton — not SSS, not Park Muffler, not Iron Garage — has anything within ten years of this; it's your shop after hours, lights humming, your truck on the lift, and it makes every competitor site look like the 2016 Dreamweaver relics they are. It's the demo that closes the deal in the first five seconds of the screen share: *this is what your brand looks like when someone takes it as seriously as you take the cars.*

---

## 2. Visual Language

### 2.1 Palette (hex)

| Token | Hex | Use |
|---|---|---|
| `--bay-black` | `#0b0b0d` | Page base, 3D scene fog/void |
| `--panel` | `#131316` | Cards, DOM overlay panels |
| `--speed-red` | `#a02d2d` | THE brand color (verified from the live site's manifest `theme_color`). Neon tube cores, underlines, CTAs, active states |
| `--neon-bloom` | `#e04545` | Emissive highlight / bloom halo around `--speed-red` neon (never used as flat UI color) |
| `--rust` | `#8a5433` | Patina accents, borders on "steel" cards — echoes the real rusted-steel sign |
| `--steel` | `#c7c9cc` | Secondary text, brushed-metal UI chrome, the vectorized badge fill |
| `--tungsten` | `#ffb066` | Warm work-light pools in the scene; hover-glow on secondary links |
| `--bone` | `#f2f0ec` | Body text (never pure white — keeps the CRT/night feel) |

Rule: red is scarce. One neon sign, one underline, one CTA per viewport. The near-black does the atmosphere; the red does the pointing.

### 2.2 Typography (all free / Google Fonts, self-hosted with `font-display: swap` per CWV playbook)

| Role | Font | Why |
|---|---|---|
| Display / headlines | **Bebas Neue** | Condensed all-caps, garage-poster DNA, huge at tiny file size |
| Subheads / nav | **Archivo** (SemiBold, tracked caps) | Continuity — Archivo Black is already on Terry's current site; Archivo family modernizes it |
| Body | **Barlow** | DIN-adjacent grotesque; reads "machine placard," excellent at 16px |
| Spec tables / prices / torque figures | **IBM Plex Mono** | Dyno-sheet energy for the pricing tables the SEO plan demands |

### 2.3 Texture / material system

- **Rust-first, neon-second.** Terry's real sign is laser-cut rusted steel, not a Vegas marquee — so every 3D and 2D surface starts from PBR rust/steel/concrete (Poly Haven + ambientCG CC0 texture sets: sealed concrete floor, corrugated steel walls, brushed metal, oxidized steel) and neon is applied *sparingly on top*, exactly like the Texaco neon in Terry's own red-pickup photo (IMG_0052) and the motorcycle-neon shot (IMG_2950). Indian-Motorcycles-style wall signs, not cyberpunk wallpaper.
- **The badge is the brand.** Vectorize `02-assets/logos/storefront-sign-SOURCE.jpeg` — the circular "SPEED SHOP 2240 — CLASSICS AND CUSTOMS" plate with crossed wrenches and red stars — into an SVG. In 3D it becomes a normal-mapped steel disc; in 2D it's the favicon, schema `logo`, and footer mark.
- **2D UI mirrors 3D materials:** cards have 1px `--rust` borders and subtle noise-grain overlays; dividers are thin "weld seam" gradients; buttons are steel plates with a red neon underglow on hover.
- **Photography treatment:** all real shop photos (the 12 ripped site images + IG grid) get a single consistent grade — lifted blacks to `#0b0b0d`, slight warm-tungsten cast — so Terry's iPhone shots and the natlajphotography D100 set sit in one world.

### 2.4 Motion principles

1. **Heavy things move slowly.** The camera behaves like it weighs 400 lb — long ease-in/outs (cubic-bezier ~ torque curve), no snap cuts, ever.
2. **The camera drifts; it never jumps.** One continuous dolly path. Sections change; the shot doesn't.
3. **Flicker is punctuation.** Neon flicker happens at load and on section arrival — never continuously (it's annoying and burns GPU).
4. **Degrade features, never frame rate.** Adaptive DPR and effect-stripping before dropping below 50 fps.
5. **`prefers-reduced-motion` = the mobile cinematic.** Full static experience, zero autonomous movement.

---

## 3. The Hero Moment

### 3.1 First 5 seconds (precisely)

| Time | What happens | Tech |
|---|---|---|
| 0.0–0.8 s | Server-rendered HTML paints instantly: headline "DON'T SAVE YOUR DREAMS FOR SLEEP." over a pre-rendered AVIF still of the 3D scene (this still IS the LCP element — preloaded, explicit dimensions, target LCP < 1.8 s) | Next.js SSG, `<link rel=preload>`, next/image |
| 0.8 s | The steel badge stamps in beside the headline with a 60 ms metallic settle | Framer Motion `spring`, SVG |
| ~1.5 s | WebGL canvas cross-fades in *behind* the still (scene was streaming via Suspense since 0 s). If WebGL is unavailable/slow, nothing happens — the still simply stays. Zero CLS either way | R3F `<Canvas>` opacity fade, drei `useGLTF.preload` |
| 2.0 s | Breaker thunk: three tungsten work-light pools bloom on in sequence across the dark shop, silhouetting the D100 on the hoist | Animated `emissiveIntensity` + point-light intensity in `useFrame`; Bloom from `@react-three/postprocessing` |
| 2.5–3.5 s | The wall neon flickers alive — two stutters, then hold: **SPEED SHOP 2240** in `--speed-red`, "CLASSICS AND CUSTOMS" beneath in steel | Emissive troika text, keyframed intensity array |
| 3.5–5.0 s | Camera begins a 6-inch push-in toward the truck. A small analog tach fades in bottom-right with "SCROLL" etched under it — the invitation | Curve position lerp; DOM overlay |

No sound by default (autoplay-audio is hostile); a tiny mute-styled toggle offers the shop-hum + neon-buzz ambience.

### 3.2 The scroll journey — station by station

The camera rides one `CatmullRomCurve3` through the garage. Scroll progress = position on the curve. Each station has a DOM overlay panel (real HTML, in the server payload) that pins while the camera holds, then releases. Every station deep-links to its full SSR service page.

| Scroll | Station | Scene focus | Service section (keyword it feeds) |
|---|---|---|---|
| 0–8% | **Cold Start** | Doorway view, lights-on sequence (above) | Hero + entity-dense intro paragraph ("Edmonton classic car and custom build shop…") |
| 8–24% | **The Hoist** | D100 on the two-post lift, camera orbits 40° under it, sparks of dust in the tungsten cone | **Restoration** → `/services/classic-car-restoration-edmonton` (Cluster B ★★★: "classic car restoration Edmonton", "classic truck restoration Edmonton") |
| 24–40% | **The Engine Room** | Crate V8 on an engine stand + engine crane; camera drops to bumper height and slides past | **Engine & Swaps** → `/services/ls-swap-engine-swap-edmonton` (Cluster D ★★★: "LS swap Edmonton", "engine swap Edmonton" — SERP is Kijiji/forums, wide open) |
| 40–56% | **The Fab Corner** | Workbench, toolboxes, welder; a 0.4 s TIG strobe fires as the camera arrives (the one "loud" beat) | **Restomods & Custom Builds** → `/services/restomod-custom-builds-edmonton` (Cluster C ★★★: "restomod Edmonton" is completely unclaimed in the city) |
| 56–70% | **The Tuning Bay** | Dyno rollers set in the floor, wall of gauges, second neon sign ("REVIVE YOUR RIDE") | **Performance & Classic Service** → `/services/performance-tuning-edmonton` (carburetor rebuild/tuning Edmonton ★★★ wedge; ECU tuning per capability check with Terry) |
| 70–84% | **The Office Wall** | Corkboard wall: framed build photos (real ripped images as textures), the steel badge, review cards | **Proof** — Google review embeds (Kaitlyn / Matt Haynes / David Steele quotes), AMVIC line, "meet Terry" link → `/about`. This station is the reputation-repair play made visible |
| 84–100% | **The Roll-Up Door** | The bay door rolls up onto a matte-painted Edmonton night skyline; cold air haze rolls in; the D100's headlights flick on behind you | **CTA** — quote/booking form (service picker + vehicle + photo upload) + NAP + hours + map link |

Below the canvas journey, the page continues as normal fast HTML: IG gallery grid, latest builds, footer with full NAP and `built with ❤ by kr8tiv` → https://kr8tiv.io (non-negotiable, every page).

---

## 4. Signature Interactions (named, feasible, with technique)

1. **Cold Start** — the lights-on entrance sequence described above. *Technique:* time-based (not scroll-based) intro timeline in `useFrame` clock; keyframed light/emissive intensities; `Bloom` (mipmapBlur, threshold ~1.1) so only true emissives glow. Runs once; skipped entirely under `prefers-reduced-motion`.
2. **The Drift** — scroll-driven camera dolly. *Technique:* Lenis smooth scroll → normalized progress → `curve.getPointAt(t)` for camera position + a second curve for lookAt targets; damped with `THREE.MathUtils.damp` so fast scrolling still renders as heavy, cinematic motion. DOM panels sync via the same progress value in Framer Motion `useTransform`.
3. **Redline** — the scroll indicator is an analog tachometer; scroll *velocity* sweeps the needle, hard flicks bounce it off the 6,000-rpm redline with a red flash. *Technique:* Framer Motion `useVelocity(scrollY)` → `useSpring` → SVG needle rotation. Pure DOM, ~40 lines, disproportionate delight.
4. **Light-Patch Reveal** — in the Restoration panel, a drag slider wipes between the D100's famous light-patch hood (natlajphotography shots, slides 1–3) and a full-restored color-grade mock. *Technique:* two stacked `next/image` layers + `clip-path: inset()` driven by Framer Motion drag; zero WebGL cost, works identically on mobile.
5. **Neon Menu** — nav items render as small neon tubes; hover = 120 ms buzz-flicker then steady glow; the active page stays lit. *Technique:* CSS `text-shadow` stack + a `@keyframes` flicker with `steps()`, `will-change: filter`. In-scene wall signs mirror the same states via emissive intensity for continuity.
6. **The Badge** — the vectorized rusted-steel sign floats in the footer/about as a 3D disc that tilts a few degrees toward the cursor and glints. *Technique:* single low-poly disc + normal map baked from the SOURCE photo, `useFrame` lerp of rotation toward pointer NDC; on mobile it responds to `deviceorientation` if permission-free, else static.

(If one must be cut for time: cut 6, keep 1–5.)

---

## 5. Mobile Experience — the Static Cinematic (first-class, not fallback)

Phones (and any device failing a quick GPU/`deviceMemory` heuristic, and all `prefers-reduced-motion` users) get **no WebGL at all** — they get the *film-still edit* of the same garage:

- **Same journey, same order, same copy.** Each station becomes a full-bleed pre-rendered 4K→responsive AVIF/WebP still exported from the actual Three.js scene (shot from the best camera angle of that station), with a subtle CSS parallax (`transform: translateY` on scroll, compositor-only) and the DOM panels sliding over. It reads as deliberate art direction, not a downgrade — closer to a lookbook than a lite site.
- **Interactions that survive:** Redline tach (DOM), Light-Patch Reveal (DOM), Neon Menu (CSS), full quote form, IG grid, review wall. Only The Drift and Cold Start are exclusive to WebGL clients.
- **Core Web Vitals targets (from the AI-SEO playbook §7.2, p75 field data, mobile-first):**
  - **LCP < 2.5 s, aiming < 1.8 s** — hero still preloaded, AVIF, explicit `width/height`, no render-blocking JS above it
  - **INP < 200 ms, aiming < 100 ms** — zero WebGL on mobile means main thread stays idle; Framer Motion springs run on compositor where possible
  - **CLS < 0.1, aiming < 0.05** — every image dimensioned, fonts `swap` with metric-compatible fallbacks, canvas never inserts into layout
- **Payload budget mobile:** < 250 KB JS gzip (no three.js shipped — R3F chunk is dynamically imported only after the desktop heuristic passes), images lazy below the fold.
- This is also the **AI-crawler experience**: GPTBot/ClaudeBot/PerplexityBot don't run JS, so the mobile-static HTML tree is literally what the answer engines ingest. Designing mobile first *is* designing for AI citation.

---

## 6. Sample Copy (terse gearhead voice — Terry's captions meet AC/DC liner notes)

### Hero headline options

1. **DON'T SAVE YOUR DREAMS FOR SLEEP. REVIVE YOUR RIDE.** *(their own tagline, typos fixed, given the marquee it deserved)*
2. **OLD IRON. NEW FIRE.** *(sub: Classics and customs, built in Edmonton.)*
3. **CLASSICS AND CUSTOMS. BUILT, NOT BOUGHT.** *(sub: 2240 Speed Shop — Edmonton, Alberta.)*

### Full service-section block (Station: The Hoist / Restoration)

> **CLASSIC CAR & TRUCK RESTORATION — EDMONTON**
>
> Frame-off or rolling. Rust cut out, not covered up. Panels hammered, drivetrains rebuilt, wiring done right the first time.
>
> We restore the cars people actually drive — Mustangs, Camaros, C10s, square-bodies, Mopars, the odd stubborn MG. Driver-quality to show-quality. You get photos at every stage and a straight answer on cost before we touch a bolt.
>
> Fresh paint. Numbers that check out. A truck your old man would nod at.
>
> **[SEE RESTORATION WORK →]**  **[WHAT A RESTORATION COSTS IN ALBERTA →]**

*(That second link feeds the "classic car restoration cost Canada/Alberta" cornerstone — the ★★★ blog keyword with zero Canadian competition.)*

### CTA block (Station: The Roll-Up Door)

> **GOT A PROJECT SITTING?**
>
> Barn find, stalled build, or a daily that deserves better. Send photos. Terry looks at everything himself.
>
> **[GET A QUOTE]** — pick a service, tell us the vehicle, attach pictures. We reply within two business days.
>
> 2240 Speed Shop · 2009 91 Ave NW, Edmonton, AB T6P 1L1 · On the Sherwood Park line · 780-999-6450 · Mon–Fri 9–5

---

## 7. SEO Integration (art and rankings, no tradeoff)

The concept's core architectural rule: **the 3D layer is decoration over a complete server-rendered site, never the container of content.**

1. **Everything crawlable is HTML.** Every station panel is a real `<section>` with an H2, a 40–60-word answer-first block (playbook §7.3), and a link to its pillar page — present in the raw HTML payload whether or not the canvas ever boots. The `<canvas>` is `aria-hidden`, injected after hydration. AI crawlers (which fetch raw HTML once, no JS) see a clean, fast, semantic page.
2. **Homepage owns the identity terms.** Title: `2240 Speed Shop | Classic Car Restoration & Custom Builds Edmonton`. H1 carries "Edmonton speed shop — classics and customs." Targets: **speed shop Edmonton** (★★★ — it's the literal name; JBs ranks with an About page), **custom car shop Edmonton**, **hot rod shop Edmonton** (★★★ — Facebook pages currently rank).
3. **Stations ship the pillar pages** (the keyword-universe §14 architecture): Restoration → *classic car restoration Edmonton / classic truck restoration Edmonton / muscle car restoration Edmonton*; Engine Room → *LS swap Edmonton / engine swap Edmonton / performance engine build Edmonton*; Fab Corner → *restomod Edmonton / restomod shop Alberta / custom car builds Edmonton*; Tuning Bay → *carburetor rebuild Edmonton / carburetor tuning Edmonton* (+ ECU tuning only if Terry confirms capability). Each pillar page is a conventional fast page — question-format H2s, pricing/timeline table, FAQ block, gallery — no 3D tax.
4. **Schema stack per the playbook:** sitewide `AutoRepair` node `@id: https://2240speedshop.com/#business` with verified NAP (2009 91 Ave NW, T6P 1L1), geo matching the GBP pin (53.5249595, -113.374974), `sameAs` (IG, Threads, GBP CID), `knowsAbout`, `hasOfferCatalog`; `Service` node per pillar with `provider → #business`; `FAQPage` on FAQ blocks (schema text = visible text); `Person` node for Terry Harmider on `/about`; `BreadcrumbList` everywhere; the vectorized badge SVG→PNG as `logo`.
5. **Suburb pages ride the same template minus 3D:** Sherwood Park first (★★★, the shop physically borders it and Terry's own captions say "sherwood park alberta"), then St. Albert, Leduc/Nisku, Spruce Grove, Fort Saskatchewan — unique local content, no doorway spam.
6. **The Office Wall station is on-page reputation repair:** real Google review quotes with names, owner-response promise, AMVIC/trust signals — while the off-site program (GBP fix, YellowPages "permanently closed" dispute, Bing Places, Yelp per the playbook day-one checklist) runs in parallel. No fabricated `aggregateRating` — synced to the real GBP number only.
7. **Ships with:** `robots.txt` allowing all AI agents + Sitemap line, `llms.txt` (playbook §2 template), XML sitemap to GSC + Bing WMT, OG cards using a rendered garage still, blog scaffold ready for the 50-post plan, `built with ❤ by kr8tiv` footer link on every page.

---

## 8. Asset Plan

### 8.1 From the 32 extracted assets (`02-assets/`) — what Midnight Garage uses

| Asset | Use in this concept |
|---|---|
| `logos/storefront-sign-SOURCE.jpeg` | **Vectorize** → SVG badge (hero mark, favicon, schema logo, 3D disc normal map). This is the pitch's "your brand, leveled up" moment |
| `instagram/ig-D100-slide1-fullres.jpg`, `-slide2-lightpatch.jpg`, `-slide3.jpg` | D100 modeling/texture reference for the hoist hero; Light-Patch Reveal slider; mobile Station-1 still fallback |
| `website/IMG_0052-red-pickup-texaco.jpeg` | Neon-sign art direction reference + Office Wall texture + gallery |
| `website/IMG_2950-original.jpeg` (motorcycle + neon) | Second neon-sign reference + Office Wall + gallery |
| `website/IMG_0401-stripped-blue-frame.jpeg`, `IMG_0402-covered-classic.jpeg` | Fab Corner set dressing (framed prints in-scene) + Restoration page process imagery |
| `website/IMG_1954-original.png` (matte-green wheel), `IMG_0051-mission-black-classic.jpeg`, `IMG_0434-black-muscle-car.jpeg`, `IMG_1949-blue-pickup.png` | Build gallery grid + OG image pool + Office Wall prints |
| `website/IMG_0446-team-photo.jpeg` | `/about` (Terry + crew) with `Person` schema |
| `website/hero-video-poster.jpg` | Grade/mood reference only |
| `instagram/ig-profile-pic.jpg` + 12 dated IG thumbs (`ig-2024-*`, `ig-2025-*`) | v1 "live" IG gallery — static grid linking to the real posts (no API dependency at pitch); swap to Behold/IG Basic Display feed post-signing |
| `videos/tiktok-thumb-*.jpg` (3) | Held in reserve for the social wall; low priority |
| `website/IMG_2943-original.jpeg` (822 KB logo photo) | Superseded by the sign vectorization; keep as source only |
| `website/manifest.webmanifest` | Already mined — source of truth for `#a02d2d` |

### 8.2 3D assets to source (free) — real sources

| Scene item | Source & plan |
|---|---|
| Two-post lift | Sketchfab, downloadable + CC-BY/CC0 filter (multiple free "2 post car lift" models exist); re-texture with Poly Haven painted-metal, credit per license |
| 1960s Dodge D100 stand-in | Sketchfab downloadable search "Dodge D100" / "60s pickup" — free CC options exist at varying quality; plan A: best free CC model re-textured to the light-patch patina from the natlaj photos; plan B (better, ~$15–40): a Sketchfab Store / CGTrader vintage D-series pickup. It's a stylized night scene — silhouette + patina sell it, not door handles |
| Toolboxes, workbench, engine stand, engine crane, jack, tires, oil drums, fire extinguisher | Sketchfab CC + **Poly Haven models** (CC0 props) + Quaternius (CC0 stylized packs) — deliberately mix; stylization hides pedigree differences |
| Crate V8 | Sketchfab free "V8 engine" CC models (several good ones); dressed with cables/hoist chain |
| Chassis dyno | **Build from primitives** (rollers flush in a floor pit + console box + screen texture) — 30 min, no purchase exists worth adapting |
| Neon signs | **Built in-app**: troika-three-text emissive faces + `TubeGeometry` outlines — infinitely editable, matches brand exactly, no asset cost |
| Floor/walls/environment | Poly Haven + ambientCG CC0 PBR (sealed concrete, corrugated steel, brushed/oxidized metal); Poly Haven industrial-night HDRI for ambient IBL |
| Edmonton night skyline (door reveal) | Matte painting: graded wide photo or AI-generated skyline plate on a curved plane behind volumetric haze — not geometry |

**Purchasable upgrade path (post-signing, ~$50–150 total):** hero-grade D100 model (CGTrader/TurboSquid, $30–80), garage-interior prop kit (CGTrader "garage workshop" packs, $20–60). KitBash3D is overkill for one interior — skip.

### 8.3 What needs Terry (post-pitch; none of it blocks the demo)

- Confirm service list (especially ECU/dyno capability before those pages go live), pricing ranges for the cost tables, hours (site vs GBP Saturday conflict), and the canonical NAP string
- The real sign photographed straight-on in daylight (cleaner vectorization source)
- 30 min walking the shop with a phone for real interior reference (v2 scene accuracy) + photo permissions for natlajphotography's D100 set (they tagged the shop publicly; a courtesy ask likely converts into the site photographer relationship the social research flagged)
- GBP access for the reputation-repair workstream

---

## 9. Build Estimate — pitch-ready at "this week" pace

**4½–5 focused days to a live demo URL** (Hostinger; managed-Node fallback per the brief's VPS caveat).

| Day | Deliverable |
|---|---|
| 1 | Next.js scaffold (SSG, fonts, palette tokens, layouts); badge vectorized; all 32 assets graded/optimized to AVIF; pillar-page templates with schema stack wired |
| 2 | Scene assembly: source + compress GLBs (Draco/meshopt, KTX2 textures), garage blockout, materials, lighting + baked AO, Bloom tuned; Cold Start sequence |
| 3 | The Drift: camera curves, Lenis scroll binding, DOM panel sync, all 7 stations; Redline tach; Neon Menu |
| 4 | Mobile static cinematic (render stills from scene, responsive pipeline, parallax); quote form (service picker + vehicle + photo upload → email); homepage + Restoration pillar fully written; remaining pillars templated with real H1/schema/answer blocks |
| 4.5–5 | CWV pass (Lighthouse mobile ≥ 90, LCP/INP/CLS green), cross-device QA, robots/llms/sitemap/OG, deploy, walkthrough one-pager |

**Performance budget enforced throughout:** desktop JS ≤ 450 KB gzip incl. three/R3F chunk (dynamically imported); mobile JS ≤ 250 KB (no three.js); total 3D payload ≤ 8 MB (Draco+KTX2), streamed after LCP; ≤ 300 k triangles; ≤ 12 lights with baked AO doing the heavy lifting; bloom-only post chain; adaptive DPR (drei `PerformanceMonitor`) stepping 1.75 → 1.0 before any frame-rate compromise.

**Corners safely cut for v1 (and restored post-signing):**
- 5 camera stations instead of 7 (merge Tuning Bay into Engine Room; Office Wall becomes a DOM section) — cuts a full day if needed
- Free/stand-in GLBs un-customized beyond re-texturing; hero D100 upgraded later
- Baked/faked lighting only — no real-time shadows, no volumetrics beyond haze sprites
- One pillar page fully copy-complete (Restoration); others live with structurally complete but shorter copy
- IG gallery = static ripped grid linking out (no API); form = email delivery (no CRM)
- Suburb pages and blog: scaffolded, not populated (they're the post-signing retainer story anyway)

---

## 10. Why This One Wins / When to Pick It

**Why it wins:** It's the maximum-differentiation play. The competitive set's best sites are a bloated Squarespace, a 2018 WPBakery WordPress, and a dead IIS box — a scroll-driven 3D garage doesn't just beat that field, it exits the category, and it hands Matt the strongest possible live-demo pitch: five silent seconds of screen share do the selling. It's also honest to the client: the scene is built *from* Terry's world (his sign, his truck, his Texaco neon, his classic-rock energy), so the futurism reads as "your shop, mythologized" rather than an agency aesthetic pasted on. And because the concept constitutionally separates art (canvas) from content (SSR HTML), the SEO/AI-SEO program ships at full strength on day one — the one combination (fast site + real service pages + schema + content plan) the teardowns show nobody in Edmonton has.

**Honest risks:** (1) It's the heaviest build of the five — the only concept where a day can vanish into asset wrangling; the station-merge cut in §9 is the pressure valve. (2) If the pitch lands with Terry on a phone in the shop rather than a screen share, he meets the (excellent but conventional) static cinematic first — the demo walkthrough must be steered to desktop. (3) Taste risk: if Terry turns out to be a pure rat-rod purist, neon-futurist framing could read imported — mitigated by the rust-first material rule, but a photography-led concept flatters that temperament more directly.

**Pick Midnight Garage when:** the pitch is a live desktop demo and the goal is an unanswerable wow; there are 5 clear build days; and we want one flagship that the other four concepts can be framed against ("and if you want something quieter, here are four more"). **Pick another concept when:** the runway compresses below 4 days, the demo will be phone-first, or discovery reveals Terry recoils from anything that isn't bare steel and film grain. Recommendation: build this one as the lead horse — it's the only concept of the five that makes the kr8tiv footer link a portfolio asset in its own right.
