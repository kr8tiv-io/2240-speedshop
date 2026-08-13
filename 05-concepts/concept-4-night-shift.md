# Concept 4 — "NIGHT SHIFT"

**Project:** 2240 Speed Shop rebuild (spec pitch) · **Prepared:** August 2, 2026
**Direction:** Cinematic video-first. Full-bleed looping footage, hard cuts synced to scroll, Metallica-energy condensed type, minimal UI chrome. The site feels like the best car reel ever made — IG-native energy converted to web. Their existing reel content IS the design system.
**Stack:** Next.js (SSR/SSG) + Framer Motion (scroll/cut engine) + Three.js/R3F used surgically (two shader effects, zero 3D models).
**Ship speed:** fastest of the five concepts. Heaviest dependency: media quality of the reel rips.

---

## 1. The pitch

**To Matt:** Terry already shot the website — ten shop-floor reels cut to Metallica, AC/DC, and GN'R, plus a professionally photographed D100 that made a photographer pull over in traffic; Night Shift just takes that footage, crushes it dark, and turns scroll into an edit deck, which means a pitch-ready demo in 4–5 days with zero 3D asset sourcing. **To Terry:** this is your Instagram turned into a machine that answers the phone — same shop, same energy, same footage, but now every scroll lands on a service, a build, or a "start your build" button, and Google finally finds you for "classic car restoration Edmonton." It's the only direction where the site gets better every time Terry posts a reel — his existing content habit becomes the content pipeline, no new discipline required.

---

## 2. Visual language

### 2.1 Palette (hex, with roles)

Built from verified brand anchors: manifest theme color **#a02d2d**, the rusted-steel storefront badge, and the dark-garage photography already on their site.

| Token | Hex | Role |
|---|---|---|
| `--asphalt` | `#0B0B0C` | Page background — near-black, never pure #000 (video blends into it) |
| `--iron` | `#161618` | Panels, cards, form fields |
| `--primer` | `#3A3A40` | Borders, dividers, disabled states |
| `--bone` | `#E9E6DF` | Primary type — warm off-white (matches sign patina, not sterile white) |
| `--smoke` | `#9B978F` | Secondary type, captions, spec-sheet labels |
| `--shop-red` | `#A02D2D` | THE brand red — CTAs, headline underlines, tach redline, active states |
| `--ember` | `#C7402E` | Hover/pressed states of shop-red only (never a standalone color) |
| `--rust` | `#7A4A21` | Texture accent pulled from the laser-cut badge — thin rules, star glyphs |

Rules: video is always under a `#0B0B0C` gradient scrim (30–55%) so bone type passes WCAG AA on every frame. Red never exceeds ~5% of any viewport — it reads as a strike, not a wash. No gradients except black scrims.

### 2.2 Typography (all Google Fonts, self-hosted with `font-display: swap`)

There is no clean digital logo — so **type is the brand** in this concept, with the vectorized badge as a stamp mark.

| Font | Weight | Role |
|---|---|---|
| **Anton** | 400 (only weight) | Display slams — hero, section title cards. All-caps, tight tracking (-0.01em), leading 0.9. This is the "Metallica-energy" condensed voice without imitating the band's mark |
| **Oswald** | 500/600 | Subheads, nav, service names, buttons. Caps, tracked +0.06em |
| **IBM Plex Mono** | 400/500 | Spec sheets, build data, NAP, form labels, torque-spec flavor text — the work-order voice |
| **Archivo** | 400/500 | Body copy and blog long-form. Neutral, high x-height, disappears behind the content |

Six font families on the current GoDaddy site was bloat; Night Shift ships exactly these four, subsetted, ~90KB total woff2.

### 2.3 Texture & material system

- **Film grain:** full-viewport shader-generated noise overlay (R3F fullscreen quad, animated per-frame, opacity 0.06). Hides phone-footage compression artifacts and unifies mixed-quality media — the single most important trick in this concept.
- **Rusted steel:** the badge photo (`storefront-sign-SOURCE.jpeg`) is vectorized into a 1-color SVG stamp; a Poly Haven CC0 rust/metal texture (`metal_plate` family) backs section dividers at low opacity.
- **Scan/static:** VHS-style static burst shader used only as a 200ms cut transition (see §4).
- **Hairline rules:** 1px `--primer` lines everywhere, like panel gaps on a body line. Crossed-wrench and star glyphs (redrawn from the badge) as the only ornament.
- **No rounded corners, no drop shadows, no glassmorphism.** Chrome stays out of the way of the footage.

### 2.4 Motion principles

1. **Cut, don't tween.** Sections transition on hard cuts (0-frame opacity swaps) exactly like a reel edit. Crossfades are banned except on the D100 gallery.
2. **Slam, settle, stop.** Type enters at 1.15 scale + 2° skew and snaps to rest in 150–180ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Nothing floats, nothing drifts, nothing loops idly except video and grain.
3. **Scroll is the timeline.** Scroll position maps to edit points, not parallax. Between cut thresholds, the page is still — stillness makes the cuts hit.
4. **One thing moves at a time.** A cut OR a type slam OR the tach needle — never simultaneous.
5. **Respect the kill switches.** `prefers-reduced-motion` → static graded frames, no cuts, no grain animation. `Save-Data` → posters only. Full experience is an enhancement layer, per the AI-SEO playbook's SSR mandate.

---

## 3. The hero moment & scroll journey

### 3.1 First 5 seconds (precise)

| Time | What happens |
|---|---|
| 0.0s | Black page paints instantly. LCP element = AVIF poster frame (graded still from reel `C4PPpGzLyKp`, their best-performing post) already visible — **LCP fires here, under 1.8s on 4G** |
| 0.3s | Vectorized badge stamps in at center, 12% opacity, like a chalk mark on the floor |
| 0.8s | First muted reel loop takes over the poster full-bleed (seamless, same first frame). Grain overlay live |
| 1.2s | `2240 SPEED SHOP` slams in Anton, two stacked lines, left-anchored. Shop-red underline sweeps beneath in 200ms |
| 2.0s | Mono subline types on: `CLASSICS AND CUSTOMS — EDMONTON, AB` |
| 3.0s | **Hard cut** to a second angle from the loop pool. Tagline slams: `DON'T SAVE YOUR DREAMS FOR SLEEP.` then, 400ms later, in red: `REVIVE YOUR RIDE.` (their real line, typos fixed — the pitch walkthrough points this out to Terry) |
| 4.5s | CTA pair rises: `[ START YOUR BUILD ]` (red, solid) + `[ SEE THE WORK ]` (bone, outline). Bottom-left: tach dial at idle — the scroll cue |

The H1 is real server-rendered text (`Edmonton Speed Shop — Classic Car Restoration & Custom Builds` visually styled as the slam stack), so the keyword payload exists at 0.0s for every crawler that never runs JS.

### 3.2 Scroll journey, section by section (homepage)

1. **COLD OPEN** — the hero above. One loop pool of 3 clips cycling on scroll-triggered cuts.
2. **THE WORK** — four scroll-cuts, each pairing one reel clip with a full-screen title card: `RESTORATION` → `CUSTOM BUILDS & RESTOMODS` → `ENGINE & SWAPS` → `CLASSIC SERVICE`. Each card carries a one-line mono deck ("frame-off, rolling, or rescue — your call") and links to its pillar page. This section is the keyword architecture wearing a leather jacket.
3. **THE TRUCK** — full-bleed D100 feature. The natlaj full-res still (`ig-D100-slide1-fullres.jpg`), the Light Patch interaction (§4), and the true story in three terse lines: a photographer pulled over in traffic for this hood. Ends on `THIS IS WHAT LEAVING THE SHOP LOOKS LIKE.`
4. **BUILDS** — 2×3 grid of graded stills (`IMG_1954` matte green, `IMG_0052` Texaco pickup, `IMG_1949` blue pickup, `IMG_0434` muscle car, `IMG_0051` black classic, `IMG_0401` bare frame tagged `IN PROGRESS`). Build Sheet flip on hover/tap (§4). Each tile routes to a per-build page — the indexable, keyword-titled project pages the keyword research says win this niche (Kartunes ranks with a *gallery*).
5. **THE SHOP** — Terry. Cropped team photo (`IMG_0446`), the badge at full size, and pull quotes set in Anton from the real 5-star reviews: "TERRY BUILDS BEAUTIFUL CARS." / "NOBODY HAS THE SAME PASSION, DRIVE, AND QUALITY OF WORK." Attribution in mono. This is the reputation-repair section — burying the 2.7★ story under named, verbatim praise.
6. **ROAD TO RADIUM** — culture strip: Radium Show & Shine mention, IG grid (static ripped thumbs for v1, live feed post-sign), `@2240speedshop` follow CTA. Proof the shop lives in the scene.
7. **START YOUR BUILD** — quote form (service picker, year/make/model, photo upload), NAP block in mono (2009 91 Ave NW, Edmonton, AB T6P 1L1 · 780-999-6450), embedded map, hours. Tach needle hits redline as you arrive — the page "shifts" into the conversion.
8. **Footer** — canonical NAP, service-area list (Edmonton, Sherwood Park, St. Albert, Leduc, Spruce Grove, Nisku), social links, and on every page: `built with ❤ by kr8tiv` → https://kr8tiv.io.

Interior pages (services, suburbs, builds, about, FAQ, blog) reuse the system at lower media intensity: one loop or still per page, title-card header, then answer-first text blocks per the AI-SEO playbook.

---

## 4. Signature interactions (named, feasible, with technique)

| # | Name | What it does | Technique |
|---|---|---|---|
| 1 | **THE COLD OPEN** | Poster→video hero handoff with badge stamp and type slams, exactly per §3.1 | `<video muted playsinline loop preload="none">` promoted after LCP; Framer Motion `variants` + `staggerChildren` for the slam sequence; poster and video share frame 1 so the swap is invisible |
| 2 | **SCROLL CUTS** | Scrolling drives hard cuts between clips like scrubbing an edit timeline — the core mechanic | Framer Motion `useScroll` + threshold array; 2–3 stacked `<video>` elements per section with instant opacity swap (no source switching = no decode hiccup); next clip preloads via `IntersectionObserver` one viewport early; offscreen videos `.pause()`ed for battery |
| 3 | **REDLINE SCRUBBER** | Page progress rendered as a tachometer needle sweeping toward redline; section boundaries are marked as shift points and each "shift" fires the section cut | SVG dial, needle rotation bound to `useScroll` progress via `useTransform`; shift-point ticks in `--shop-red`; doubles as nav — click a tick to jump sections |
| 4 | **STATIC SHIFT** | 200ms analog-static burst masking each major section cut (the "channel change") | R3F fullscreen quad, fragment shader: white noise + slight RGB split, opacity spiked by a spring on cut events; ~40 lines of GLSL, no textures, no models; skipped entirely under `prefers-reduced-motion` |
| 5 | **THE LIGHT PATCH** | The D100 hood sits in near-dark; the pointer (gyroscope tilt on mobile) is a flashlight that reveals the famous light patch | v1: CSS `mask-image: radial-gradient()` following pointer — zero WebGL cost. v2 (post-sign polish): R3F plane with radial-reveal uniform + subtle normal-map sheen from a Poly Haven metal map |
| 6 | **BUILD SHEET FLIP** | Build tiles flip to a mono-type work order on hover/tap: YEAR / ENGINE / WORK PERFORMED / STATUS — specs over marketing speak, literally | Framer Motion `rotateY` 3D flip (or opacity swap under reduced motion); back face is semantic HTML (real text, crawlable), not an image |

All six run on the two libraries already mandated by the brief. Total custom shader surface: two fullscreen quads. Nothing here requires a 3D artist.

---

## 5. Mobile experience (first-class, not fallback)

**The unfair advantage: the source footage is vertical.** Terry's reels are 9:16 phone video — on mobile this concept displays its media at native aspect with zero cropping, while every desktop-first concept crops or letterboxes. Mobile is where Night Shift is *most* itself: it literally feels like his Instagram, plus buttons that book work.

- **Feed mechanics:** sections use CSS `scroll-snap-type: y mandatory` — each section is a full-viewport "post." Cuts fire on snap, not on free-scroll thresholds (fewer mid-cut states, better INP).
- **Tap replaces hover:** Build Sheet flips on tap; Light Patch follows `deviceorientation` tilt with a thumb-drag fallback (iOS permission-gated, so drag is default).
- **One live video at a time:** the active section's clip plays; neighbors hold their poster frame. 720p vertical clips, 3–6s loops, AV1 + H.264 fallback, target ≤1.2MB per loop.
- **Desktop treatment of vertical footage:** center-crop to frame with graded still side-gutters — the reverse problem, handled on the big screen where it belongs.
- **Sticky micro-CTA:** after the hero, a slim bottom bar: `START YOUR BUILD` + tap-to-call `780-999-6450` (the audience for a customs shop calls).

**Core Web Vitals — the AI-SEO playbook targets, engineered in, measured p75 mobile:**

| Metric | Target (playbook) | How Night Shift hits it |
|---|---|---|
| LCP | < 2.5s (aim < 1.8s) | LCP is always an AVIF poster `<img>` with explicit dimensions, preloaded; video attaches after load event; no video is ever the LCP element |
| INP | < 200ms (aim < 100ms) | Scroll-snap cuts (compositor-driven), no scroll-jacking, shaders on rAF outside input handlers, Framer Motion on transform/opacity only |
| CLS | < 0.1 (aim < 0.05) | Every media box reserves space via `aspect-ratio`; fonts preloaded with `swap` + metric-matched fallbacks; no late-injected embeds |

`Save-Data: on` or reduced-motion → the entire site serves graded stills; it degrades to a very good photography site, never a broken video site.

---

## 6. Sample copy (terse gearhead voice)

### Hero headline options

1. `DON'T SAVE YOUR DREAMS FOR SLEEP.` / `REVIVE YOUR RIDE.` — their own line, typos fixed. The pitch move: "we didn't replace your words, we tightened the bolts."
2. `CLASSICS AND CUSTOMS.` / `BUILT IN EDMONTON.` — straight off the badge, plus the geo signal.
3. `THE CARS YOU GREW UP WANTING.` / `BUILT RIGHT. BUILT HERE.` — for the walkthrough A/B; leads with the customer's memory, lands on the shop.

### Full service-section block (Engine & Swaps pillar — targets "LS swap Edmonton" / "engine swap Edmonton," both wide open per the keyword research)

> **ENGINE & SWAPS**
> `LS SWAPS · CRATE INSTALLS · CARB REBUILDS · TUNE-UPS`
>
> Your straight-six was honest work in 1968. An LS makes it honest at highway speed.
> We swap, rebuild, and wake up drivetrains for classics and customs — mounts, cooling,
> wiring, fuel, driveshaft, the whole job, one shop. Numbers-matching car? We'll tell you
> to keep the block before you ask. Carbureted? We still speak Holley.
>
> Straight answers on cost before a wrench comes off the wall.
>
> `[ TALK ENGINES ]`

### CTA block (site-wide closer)

> **START YOUR BUILD**
> Tell us what's in the garage. Year, make, what it needs, a couple photos.
> We'll come back with a straight answer — what it takes, what it costs, when it can start.
> No pressure. The car's waited this long.
>
> `[ GET A QUOTE ]`   `[ 780-999-6450 ]`
> `2009 91 AVE NW, EDMONTON — ON THE SHERWOOD PARK LINE. MON–FRI 9–5.`

---

## 7. SEO integration (art and rankings, no compromise)

Night Shift's rule: **video is paint, HTML is steel.** Every crawlable signal lives in server-rendered markup; the cinematic layer is progressive enhancement — which is exactly the playbook's §7.1 mandate (no AI crawler except Googlebot executes JS).

- **Page architecture ships the keyword map** (keyword-universe §14): homepage owns `speed shop Edmonton` + `custom car shop Edmonton`; six pillar pages own `classic car restoration Edmonton` (★★★, 150–300/mo, directories rank #1 today), `restomod Edmonton` / `restomod shop Alberta` (unclaimed in the entire city), `LS swap Edmonton` / `engine swap Edmonton` (no shop ranks at all), `muscle car restoration Edmonton`, `hot rod shop Edmonton` (Facebook pages rank), and `carburetor rebuild Edmonton` (the classic-service wedge). Suburb pages start with `classic car restoration Sherwood Park` (YellowPages-only SERP; the shop physically borders Sherwood Park).
- **Title cards ARE the headings.** The Anton slams render from real `<h1>`/`<h2>` text — question-format H2s on service pages ("How much does a frame-off restoration cost in Alberta?") with 40–60-word answer-first blocks and comparison tables, per playbook §7.3. The art direction styles the SEO; it never replaces it.
- **Per-build pages = long-tail machine.** Each Build Sheet flip routes to a real URL ("1960s Dodge D100 — Edmonton") with specs, dates, and photos — the exact "Kartunes ranks with a gallery" play, done properly, feeding `classic truck restoration Edmonton` / C10-class terms.
- **Video-native schema advantage:** this is the one concept where `VideoObject` markup is structural, not bolted on — every reel section ships `VideoObject` (thumbnail, duration, uploadDate) + an on-page transcript/caption block, the playbook's §3.5 weapon. Plus the full stack: sitewide `AutoRepair` node with stable `@id`, `sameAs` (IG/Threads/GBP), `knowsAbout`; `Service` per pillar; `FAQPage` with visible-text parity; `Person` for Terry; `BreadcrumbList`.
- **Cornerstone content at launch:** "Classic Car Restoration in Edmonton: Cost, Timeline & Process (2026)" (zero Canadian content exists for restoration-cost queries — instant AI-answer magnet), plus the FAQ hub. Blog scaffold ready for the 50-post plan with `BlogPosting` schema.
- **Technical hygiene from the audit's fix list:** canonical NAP everywhere ("2240 Speed Shop, 2009 91 Ave NW, Edmonton, AB T6P 1L1"), robots.txt allowing all AI agents + sitemap line, `llms.txt` at root, OG image = graded D100 still (replacing the bare-domain og:title embarrassment), real favicon from the vectorized badge, GA4 + GSC + Bing Webmaster.
- **CWV as a ranking feature:** competitors run a 1.58MB Squarespace, a 730KB Shopify, and 2018 WordPress builders. A disciplined Night Shift ships <500KB of HTML/CSS/JS before media, posters-first — green vitals against a field that can't measure up.

---

## 8. Asset plan

### 8.1 From the 32 extracted assets (02-assets/)

| Asset(s) | Use in Night Shift |
|---|---|
| 12 IG thumbs (`ig-2024-*` … `ig-2025-09-09_natlaj*`) | Poster frames, IG grid in ROAD TO RADIUM, cut-preview frames |
| `ig-D100-slide1-fullres.jpg` (765KB full-res) | THE TRUCK hero still + site OG image |
| `ig-D100-slide2-lightpatch.jpg` | The Light Patch reveal target |
| `ig-D100-slide3.jpg` | D100 gallery third frame |
| `logos/storefront-sign-SOURCE.jpeg` | Vectorization source → SVG badge (stamp mark, favicon, footer seal) |
| `website/IMG_1954-original.png` (matte green) | Builds grid + service-page headers |
| `website/IMG_0052` (Texaco pickup), `IMG_1949` (blue pickup), `IMG_0434` (muscle car), `IMG_0051` (black classic) | Builds grid tiles |
| `website/IMG_0401`, `IMG_0402` (stripped frames) | "IN PROGRESS" tiles — proof of real work in flight |
| `website/IMG_0446-team-photo.jpeg` | THE SHOP section (cropped/graded — it's a candid; treat, don't feature raw) |
| `website/IMG_2950-original.jpeg` (motorcycle + neon) | Section divider / about-page texture |
| `website/hero-video-poster.jpg` | Fallback poster in the hero pool |
| `website/IMG_2943-original.jpeg` | Badge vectorization cross-reference (same sign, different light) |
| `ig-profile-pic.jpg`, 2 usable TikTok thumbs | Reference only. **Not shipped:** 512-byte broken TikTok thumb; the Getty blog image (license-prohibited, flagged in the audit) |

### 8.2 To acquire — step 1 of the build (the load-bearing item)

**Rip the actual reel MP4s.** The concept needs motion, and the thumbs aren't it. The ten public reels pull via the verified embed endpoints in social-presence.md §5 (`instagram.com/reel/<SHORTCODE>/embed/captioned/`): priority order `C4PPpGzLyKp` (top post, 46 likes), `DEQGInoPZmO`, `DD8e1tFp0Em`, `DD-OQFOy8Og`, `DD8j7EKJnZY`, `DD8jkUPpfS6`, `C10w-QarnW8`, `C10tzN3Ll5v`, `C_7F1LIpggd` ("Road to radium"), `C_7GCo4R_iK`. Brief authorizes rips for this phase. Then an ffmpeg grade pass: crush blacks, desaturate 15%, unify white balance, export 3–6s loops, AV1+H.264, 720p vertical + 1080p center-crop horizontal. **Music does not come with them and doesn't need to:** browser autoplay is muted by policy, and the licensed Metallica/AC-DC audio can't ship on a website anyway — the rock energy is carried by type, cut rhythm, and grade. Say this in the pitch before anyone asks.

### 8.3 To build or source (named sources, all free)

| Asset | Source | Effort |
|---|---|---|
| Vectorized badge SVG | Trace/redraw from `storefront-sign-SOURCE.jpeg` in Figma or Inkscape | 2–4h |
| Rust/steel textures | **Poly Haven** (polyhaven.com, CC0 — `metal_plate`, `rusty_metal` families) | download |
| Film grain + static | Shader-generated (no asset) | in §4 budget |
| Fonts | Google Fonts (Anton, Oswald, IBM Plex Mono, Archivo), self-hosted | download |
| Tach dial | Custom SVG | 2h |

Deliberately **zero** Sketchfab/KitBash3D/GLB spend — this concept's whole economic argument is that the media already exists.

### 8.4 Needs Terry (all post-sign — none blocks the demo)

Pro 4K b-roll shoot (Nathan Lajeunesse and JG Photography are already in his orbit): slow push-throughs of the shop, grinder sparks, engine starts, the D100 rolling. Verified facts: founding year, certs/AMVIC number, Red Seal status. Full-res originals of the site photos. GBP access + IG Graph API connection for the live gallery. The demo needs none of it — that's the point.

---

## 9. Build estimate ("this week" pace)

**4–5 working days to pitch-ready demo on the Hostinger demo domain.**

| Day | Work |
|---|---|
| 1 | Asset pipeline: rip 10 reels, ffmpeg grade/loop/compress; vectorize badge; Next.js scaffold, tokens, fonts; deploy pipeline to demo subdomain |
| 2 | COLD OPEN + Scroll Cuts engine + Redline Scrubber + type system — the hero demo is watchable by end of day |
| 3 | Remaining homepage sections (THE WORK, TRUCK + Light Patch CSS version, BUILDS + flip, SHOP, RADIUM), quote form (posts to email/Sheet), footer + kr8tiv credit |
| 4 | Service pillar pages ×4 from one template with real copy; 2 suburb pages; full schema stack; llms.txt/robots/sitemap; Static Shift shader |
| 5 | Mobile snap-scroll pass, CWV tuning to green (Lighthouse + real device), cross-browser QA, content proof pass, walkthrough one-pager |

**Corners safely cut for v1 (all reversible post-sign):** live IG feed → static ripped grid linking out (Graph API needs their account); Light Patch → CSS mask version (shader is a polish item); suburbs → Sherwood Park + St. Albert only, others stubbed; blog → scaffold + 1 cornerstone guide, the other two follow within the pitch window; form → email/Sheet, no CRM; booking calendar → quote form only; FAQ hub → 8 questions, not 20. **Not cut, ever:** SSR text on every page, schema stack, NAP consistency, CWV green, footer credit.

---

## 10. Why this one wins / when to pick it

**Why it wins:** It's the only concept that is *already true.* Terry's brand isn't a 3D render — it's handheld footage of real iron shot to Sad But True, and Night Shift ships that identity instead of replacing it. Fastest build (no 3D asset sourcing, no scene lighting, no GLB budget), cheapest to maintain, and the only direction with a built-in content flywheel: every future reel is a site update. On mobile — where the local, 45–65 classic-car audience actually is — vertical source footage makes it the best mobile experience of the five by default. And because the media is real, it converts the audit's biggest trust gap (2.7★, an indexed theft allegation) with the strongest counter-evidence there is: unfakeable footage of the actual work, wrapped in named 5-star quotes.

**Honest risks:** the ceiling is set by ten phone-shot reels from a dormant account. The grade+grain pipeline raises the floor a lot — dark and grainy *is* the aesthetic — but if the rips come out rough after Day 1's pass, this concept has no second engine; a 3D-led concept keeps its wow regardless of Terry's footage. Vertical footage on desktop always costs a treatment step. And the "Metallica energy" must survive with no audio at all — if the walkthrough demo needs sound to feel right, it's built wrong.

**Verdict vs the other four:** pick Night Shift if the deadline is truly this week, if the Day-1 rip test grades well, or if the pitch strategy is "this is already YOU, leveled up" — it's the concept most likely to make *Terry* say yes, because he'll recognize himself in it. Pick the 3D shop drift-through direction if the pitch strategy is maximum spectacle independent of his media, or if the rip test fails. The honest hybrid worth keeping in pocket: Night Shift's cut engine, type system, and CWV discipline are all portable — if another concept wins the pitch, the Scroll Cuts + Build Sheet mechanics should survive into it.

---

*Every claim above is grounded in: 00-brief.md (locked), 01-research/site-audit.md, reviews-reputation.md, social-presence.md, 03-seo/keyword-universe.md, blog-keywords.md, ai-seo-playbook.md, competitors-overview.md, competitor-teardown-1/2/3.md, and the 02-assets/ inventory (32 files verified on disk Aug 2, 2026).*
