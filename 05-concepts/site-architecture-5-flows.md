# 2240 Speed Shop — 5 Site Architecture & Text-Flow Iterations

**Project:** 2240speedshop.com rebuild (spec pitch)
**Prepared:** August 2, 2026
**Purpose:** Five genuinely different information architectures + messaging hierarchies for the same site. These are IA/flow variants — independent of the 5 visual concepts. Any visual concept can be laid over any of these skeletons; the recommendation matrix at the end scores which skeleton to build.
**Grounding:** Every URL, keyword, and claim below traces to `01-research/site-audit.md`, `01-research/reviews-reputation.md`, `01-research/social-presence.md`, `03-seo/keyword-universe.md`, `03-seo/blog-keywords.md`, `03-seo/ai-seo-playbook.md`, and the three competitor teardowns.

---

## Shared invariants (every flow ships these — non-negotiable)

These are constants across all five architectures, so they're stated once:

1. **Voice:** gearhead authentic — terse, blue-collar, classic-rock energy (Terry's reels run Metallica/AC-DC/GN'R). No corporate speak, no "innovative automotive solutions." The cars talk; the copy stays out of the way.
2. **Brand line:** "customs and classics" (Terry's own IG bio) is the positioning everywhere. Tagline, typo-fixed: **"Don't save your dreams for sleep — revive your ride."**
3. **NAP frozen sitewide:** 2240 Speed Shop · 2009 91 Ave NW, Edmonton, AB T6P 1L1 · 780-999-6450 · footer on every page + `AutoRepair` JSON-LD with stable `@id`, per the AI-SEO playbook (§3).
4. **Review handling:** never surface the 2.7★ aggregate. Lead with the three named 5-star quotes (Kaitlyn Quesnelle's 2-year-customer quote, Matt Haynes' "nobody has the same passion" quote, David Steele's "terrific quality work"). No fabricated `aggregateRating` — real GBP-synced rating only after the review-generation program moves the number.
5. **Signature asset:** the 1960s Dodge D100 with the light-patch hood (professionally shot by @natlajphotography — a stranger pulled over for this truck) is the hero image / brand mascot in every flow.
6. **3D hero:** the R3F stylized shop drift-through lives in the homepage hero in all five flows; graceful static fallback on mobile/low-power. Every page below the hero is server-rendered raw HTML (AI crawlers don't execute JS — playbook §7.1).
7. **Sherwood Park is always claimed** alongside Edmonton (the shop physically borders it; Terry's own captions say "sherwood park alberta").
8. **Footer credit on every page:** tiny text — `built with ❤ by kr8tiv` — linking to https://kr8tiv.io.
9. **Conversion primitive:** quote/booking form (service picker + vehicle + photo upload) exists in every flow; only its prominence changes.
10. **What we never chase:** diesel-performance head terms (saturated), Subaru/JDM/BMW head terms (SSS/Eurotekk entrenched), lift-kit wars. 2240 is NOT an import tuner shop.

---
---

# FLOW 1 — SERVICE-LED ("The Local-SEO Tree")

**Model:** the classic local-services architecture — home → 9 service pages (the shop's own legacy taxonomy from garagecar.ca) → metro city pages → blog. This is the Park Muffler playbook (the market's most professionally executed SEO, per teardown 1) applied to a shop whose niche Park doesn't touch.

**Thesis:** every service the shop has ever actually sold gets its own ranking page, because the current one-pager throws all nine away. Maximum keyword coverage, minimum narrative risk.

## 1.1 Sitemap

| URL | Target keyword (primary) | Notes |
|---|---|---|
| `/` | speed shop Edmonton | Brand + head term; it's literally the shop's name and nobody optimizes for it |
| `/services/` | custom car shop Edmonton | Hub page; links all 9 with 80-word teasers |
| `/services/restorations/` | classic car restoration Edmonton | THE core page — $30K–$120K job value, directories rank #1 today |
| `/services/customs-hot-rods/` | hot rod shop Edmonton · custom car builds Edmonton | Facebook pages currently rank = wide open |
| `/services/ls-diesel-conversions/` | LS swap Edmonton · engine swap Edmonton | No shop ranks at all; forums beg for recommendations |
| `/services/motor-mods-tuning/` | performance upgrades Edmonton · carburetor rebuild Edmonton | Classic-service wedge; carb SERP is forums/mail-order |
| `/services/body-paint/` | auto body restoration Edmonton · classic car rust repair Alberta | Rust angle beats generic paint (Sideshow owns "custom paint") |
| `/services/classic-interiors/` | classic car interior restoration Edmonton | Period-correct materials copy from legacy site |
| `/services/fabrication/` | metal fabrication automotive Edmonton | Patch panels, floor pans, structural reinforcement |
| `/services/parts/` | hot rod parts Edmonton | Modest page; sourcing/consultation, not e-comm (JBs owns retail) |
| `/services/car-sales/` | restored classic cars for sale Edmonton | Only if inventory exists; else "completed builds for sale" trickle page |
| `/areas/` | classic car restoration near Edmonton | Areas hub — rural catchment proof (Muscle N' More model: demand drives 30–60 min) |
| `/areas/sherwood-park/` | classic car restoration Sherwood Park | SERP is YellowPages-only; shop borders it — flagship city page |
| `/areas/st-albert/` | classic car mechanic St. Albert | Directories only today |
| `/areas/spruce-grove-stony-plain/` | car restoration Spruce Grove | Kustom King is there but weak SEO |
| `/areas/leduc-nisku/` | performance shop Leduc | Only HD truck shops rank |
| `/areas/fort-saskatchewan/` | car restoration Fort Saskatchewan | Open |
| `/about/` | Terry Harmider · 2240 Speed Shop owner | Wikipedia-stub facts + Terry's story; entity anchor |
| `/gallery/` | muscle car shop Edmonton (supporting) | Keyword-titled photos; feeds image SEO |
| `/reviews/` | 2240 Speed Shop reviews | Owns the brand-reputation SERP; named quotes + review-generation CTA |
| `/quote/` | car restoration quote Edmonton | Nobody in the market offers an online estimate flow |
| `/faq/` | classic car restoration cost Edmonton (PAA capture) | FAQPage schema hub, 15–20 real questions |
| `/blog/` | — | Scaffold for the 50-post plan |
| `/blog/classic-car-restoration-cost-canada/` | classic car restoration cost Canada | Cornerstone #1 — zero Canadian content exists |
| `/blog/modified-car-laws-alberta/` | are exhaust mods legal in Alberta | Cornerstone #2 — pillar for the A-cluster hub |
| `/blog/winter-storage-classic-car-alberta/` | winter storage for classic cars | Cornerstone #3 — the −40 moat |
| `/contact/` | speed shop near me (GBP support) | NAP, map embed, hours |

## 1.2 Homepage text flow (section by section)

**S1 — HERO (3D drift-through, copy overlaid)**
- **Headline:** `EDMONTON'S SPEED SHOP FOR CUSTOMS AND CLASSICS`
- **Subhead:** `Restorations, hot rods, and LS swaps out of a working shop on the Sherwood Park line. Don't save your dreams for sleep — revive your ride.`
- **CTA pair:** `GET A QUOTE` (→ /quote/) · `SEE THE SERVICES` (scroll)

**S2 — SERVICES GRID (9 cards, the money section)**
- **Section head:** `WHAT WE DO`
- **Lead-in:** `Nine trades. One roof. From bare frame to first start-up.`
- Sample card copy (Restorations): `RESTORATIONS — Frame-off or rolling. Body, drivetrain, wiring, interior. Driver-quality to show-quality — you pick the finish line, we build to it.`
- Sample card copy (LS/Diesel Conversions): `LS & DIESEL CONVERSIONS — Old iron, modern heart. Mounts, harness, cooling, driveshaft, tune. Starts every morning, even in January.`
- Each card → its service page.

**S3 — PROOF STRIP (the D100)**
- **Headline:** `THE TRUCK THAT STOPS TRAFFIC`
- **Body:** `A photographer pulled over on her way home just to shoot our '60s Dodge D100 — the light patch on the hood did it. That truck is the shop's résumé. Yours can be next.`
- **CTA:** `SEE THE GALLERY`

**S4 — WHY 2240 (trust block)**
- **Headline:** `BUILT BY HAND. RUN BY TERRY.`
- **Body:** `2240 Speed Shop is Terry Harmider's outfit — customs and classics, no assembly line, no service advisors reading a script. You deal with the guy holding the wrench.`
- **Proof:** the three named review quotes, cited "Google review": `"I've dealt with Terry… for approximately 2 years now and I have had nothing but outstanding service." — Kaitlyn Q.` · `"Nobody has the same passion, drive, and quality of work." — Matt H.` · `"Terrific quality work being done here." — David S.`

**S5 — SERVICE AREA**
- **Headline:** `EDMONTON AND EVERYTHING AROUND IT`
- **Body:** `2009 91 Ave NW — east Edmonton, right on the Sherwood Park boundary. Customers haul in from St. Albert, Leduc, Spruce Grove, Fort Saskatchewan, and half the county roads in between.`
- Links → the 5 city pages.

**S6 — LATEST FROM THE BENCH (blog teaser, 3 posts)**
- **Headline:** `STRAIGHT ANSWERS`
- **Lead-in:** `What a restoration actually costs in Alberta. What the law actually says about your exhaust. What winter actually does to stored classics. No fluff — real numbers.`

**S7 — CLOSING CTA**
- **Headline:** `GOT A PROJECT SITTING?`
- **Body:** `Send photos. Tell us what it is and where you want it to end up. We'll tell you straight what it takes.`
- **CTA:** `START THE QUOTE` · phone number in big type: `780-999-6450`

## 1.3 Internal-linking logic

- **Silo model:** `/services/` hub → 9 children; each child links (a) 2 sibling services that co-sell (restoration ↔ interiors ↔ body-paint; conversions ↔ tuning ↔ fabrication), (b) the 2 most relevant blog posts, (c) `/quote/` in every closing block.
- City pages link UP to the 3 services most searched in that suburb + the nearest local event content (Sherwood Park Cruise Nights, St. Albert Rock'n August) — unique content, never doorway-spam.
- Blog posts link DOWN to exactly one owning service page per post (the money-page reinforcement rule from keyword-universe §14).
- Breadcrumbs sitewide (`BreadcrumbList` schema); footer carries all 9 services flat for crawl depth ≤ 2 clicks.

## 1.4 Pros / cons

**Pros**
- Maximum keyword surface from day one — all nine legacy services become rankable URLs; nothing in the market has more than ~8 service pages except Park Muffler (who ignores this niche).
- Proven model in this exact metro (Park Muffler's 40-service silo + review mass = durable rankings).
- Easiest to brief, build, and QA — no clever routing, pure template multiplication.
- City pages capture the wide-open suburb SERPs (Sherwood Park = YellowPages-only today).

**Cons**
- 9 services × real 800-word depth = the heaviest copywriting load of any flow; thin pages would replicate SSS's one-sentence-page failure.
- Undifferentiated shape — looks like every local-SEO site; weakest "wow" story for the pitch demo.
- Some legacy services are weak pages waiting to happen (parts, car sales) and risk diluting crawl focus, the exact mistake Sideshow made with merch.
- Narrative (Terry, the D100, the story) is squeezed into one homepage block; the brand's strongest asset is under-used.

## 1.5 SEO ceiling

**High (9/10) for local-transactional; medium for informational.** This tree can own every T/L cluster in the keyword universe (A–H) because each cluster gets a dedicated owning page. Ceiling caps only where the blog does the work (cost/education queries) — the blog here is bolted on rather than structural. Biggest ranking risk: page-quality dilution if all 9 services can't be written deep. Time-to-rank: fastest of the five for map-pack + suburb terms.

---
---

# FLOW 2 — AUDIENCE-LED ("Pick Your Lane")

**Model:** segmented landing pages per the brief — four owner tribes, each with its own tailored journey: **classic & muscle owners · British/Euro classics (MG, Triumph, Mustang-adjacent per the Alignable copy "Does your MG or Mustang need a makeover?") · truck guys · project-car dreamers.** Services exist as shared infrastructure underneath; the top layer of the site speaks each tribe's dialect.

**Thesis:** nobody searches "9 services." They search as *who they are* — "Mustang restoration Edmonton," "C10 restoration Alberta," "finish my project car." The SERPs for vehicle-specific and situation-specific terms are the most open ground on the whole board (keyword universe G1: nearly every domestic-classic vehicle term is "Open").

## 2.1 Sitemap

| URL | Target keyword (primary) | Notes |
|---|---|---|
| `/` | custom car shop Edmonton · speed shop Edmonton | Router homepage — sends each tribe down its lane |
| `/classic-muscle/` | muscle car restoration Edmonton | Tribe hub #1 — Kartunes ranks with a *gallery*; beatable with a real page |
| `/classic-muscle/mustang/` | Mustang restoration Edmonton | Only parts e-commerce ranks today — zero local shops |
| `/classic-muscle/camaro-chevelle/` | Camaro restoration Edmonton · Chevelle restoration Alberta | Open |
| `/classic-muscle/mopar/` | Mopar restoration Edmonton | Charger/Challenger/Cuda; open |
| `/classic-muscle/restomods/` | restomod Edmonton | Unclaimed in Edmonton — only R3 (Calgary) + US shops rank in AB |
| `/british-euro/` | British classic car restoration Edmonton · MG restoration Alberta | Tribe hub #2 — from the shop's own Alignable copy; All British Field Meet audience |
| `/british-euro/mg-triumph/` | MG restoration Edmonton | Long-tail; ties to Alberta All British society community content |
| `/classic-trucks/` | classic truck restoration Edmonton | Tribe hub #3 — Kijiji/eBay rank today; truck values booming |
| `/classic-trucks/c10-square-body/` | C10 restoration Alberta · square body Chevy restoration | Wide open per SERP sampling |
| `/classic-trucks/f100-obs-ford/` | Ford F100 restoration Alberta | Open |
| `/classic-trucks/the-d100/` | 1960s Dodge D100 (brand long-tail) | The shop truck's own page — proof + link magnet |
| `/project-cars/` | project car help Edmonton · finish my project car | Tribe hub #4 — forums only today; "we finish stalled projects" is a unique angle (Sideshow buries the same claim in body copy) |
| `/project-cars/barn-finds/` | barn find restoration Alberta | "Don't start it — call first" revival protocol |
| `/project-cars/estimate/` | car restoration quote Edmonton | Dedicated funnel entry for the dreamer segment |
| `/services/` | classic car restoration Edmonton (consolidated) | ONE deep shared services page, anchor-sectioned (restoration / engine & swaps / body & paint / interiors / fabrication) |
| `/about/` | Terry Harmider | Entity anchor |
| `/gallery/` | custom car builds Edmonton | Cross-tribe proof, filterable by tribe |
| `/areas/sherwood-park/` | classic car restoration Sherwood Park | Only the flagship suburb page in v1; rest deferred |
| `/quote/` | car restoration quote Edmonton | Shared funnel; pre-filled by originating tribe |
| `/faq/` | is it worth restoring a classic car (PAA) | FAQPage schema |
| `/blog/` | — | Posts tagged and routed per tribe |
| `/contact/` | — | NAP + map |

## 2.2 Homepage text flow

**S1 — HERO (3D drift-through; camera pauses on 4 different cars = the 4 tribes)**
- **Headline:** `WHAT'S SITTING IN YOUR GARAGE?`
- **Subhead:** `Muscle. British steel. Old trucks. Or a project that stalled five years ago. Whatever it is — don't save your dreams for sleep.`
- **CTA:** `PICK YOUR LANE` (scroll to S2)

**S2 — THE FOUR DOORS (segment picker; the structural heart of the page)**
- **Section head:** `PICK YOUR LANE`
- Card 1: `CLASSIC & MUSCLE — Camaros, Chevelles, Mopars, Mustangs. Numbers-matching restorations or restomods with modern iron underneath.` → `/classic-muscle/`
- Card 2: `BRITISH & EURO CLASSICS — MGs, Triumphs, old-world sports cars. Does your MG need a makeover? That's a real question we answer weekly.` → `/british-euro/`
- Card 3: `CLASSIC TRUCKS — C10s, F100s, square bodies. Ask about our D100 — a photographer stopped traffic for it.` → `/classic-trucks/`
- Card 4: `PROJECT CARS — Bought it, tore it down, life happened. We finish what other people started. No judgment, just a plan.` → `/project-cars/`

**S3 — PROOF (cross-tribe gallery strip)**
- **Headline:** `THE WORK SPEAKS`
- **Body:** `Every car below rolled out of 2009 91 Ave NW under its own power. Go meet with Terry, look at the work firsthand — that's what our customers tell people, word for word.` *(paraphrasing Matt Haynes' actual review into copy, with his quote cited beneath)*
- **Proof:** rotating named review quotes.

**S4 — ONE SHOP, EVERY TRADE**
- **Headline:** `EVERYTHING UNDER ONE ROOF`
- **Body:** `Body and paint. Engine builds and LS swaps. Wiring, interiors, fabrication. No sublet mystery — the same hands, start to finish.`
- **CTA:** `SEE WHAT WE DO` → `/services/`

**S5 — TERRY BLOCK**
- **Headline:** `RUN BY A BUILDER, NOT A FRONT DESK`
- **Body:** `Terry Harmider has been reviving Alberta iron for years — customs and classics, Edmonton and Sherwood Park. Call and the guy who answers is the guy who builds.`

**S6 — CLOSING CTA**
- **Headline:** `TELL US WHAT YOU'VE GOT`
- **Body:** `Year, make, model, photos, and where you want it to end up. Straight answer inside two business days.`
- **CTA:** `START THE QUOTE` · `780-999-6450`

## 2.3 Internal-linking logic

- **Hub-and-lane:** each tribe hub links only DOWN its own lane (vehicle pages, tribe-relevant blog posts) plus ACROSS to `/services/` and `/quote/`. Lanes never cross-link to each other above the footer — keeps topical clusters clean for engines.
- Vehicle pages (Mustang, C10…) each link to 1–2 matching builds in `/gallery/` and the tribe's cost-guide blog post ("What a Mustang restoration costs in Alberta").
- Blog posts carry a tribe tag; each post links up to its tribe hub AND to the single services anchor it sells.
- `/quote/` reads a `?lane=` param → pre-selects service picker; every tribe CTA passes it.

## 2.4 Pros / cons

**Pros**
- Owns the vehicle-specific SERPs (cluster G1) that literally no local shop targets — Mustang/C10/Mopar/restomod pages have zero real competition.
- Message-match conversion: a C10 owner lands on a page about C10s, not a generic services menu — highest copy resonance of any flow.
- "Project cars / we finish stalled builds" is a genuinely unique positioning wedge nobody else pages for.
- Matches the brief's explicit ask ("all segments with dedicated segmented landing pages… each SEO'd separately").

**Cons**
- Splits generic head terms: "classic car restoration Edmonton" has no single obvious owner (hub? services page?) — needs a deliberate canonical decision or the lanes cannibalize each other.
- 4 hubs + ~10 vehicle pages + shared services = second-heaviest copy load; each lane also needs its own imagery, and current asset rips skew domestic (British/Euro lane is photo-poor until a real shoot).
- Tribe taxonomy is a bet: if the shop's real work mix is 80% domestic classics, the Euro lane is a thin page waiting to happen.
- Suburb/local coverage is thinner than Flow 1 (only Sherwood Park in v1).

## 2.5 SEO ceiling

**High (8/10), differently shaped.** Lower on generic local heads than Flow 1 (fewer service/city URLs), but highest of all five on vehicle long-tail — and those SERPs are so empty that page-1 in weeks is realistic. Ceiling limited by cannibalization risk on core heads and by content honesty (E-E-A-T dies if the Euro lane claims work the gallery can't show). Best AI-answer fit for "who restores [vehicle] in Edmonton" prompts, because each answer has exactly one liftable page.

---
---

# FLOW 3 — STORY-LED ("The Build Journal")

**Model:** builds/portfolio as the spine of the site. Each build is a rich case-study page (vehicle, story, spec table, hours, photo series, verdict); services exist as thin-ish "capability" pages that hang off the proof rather than the other way around. The site reads like a shop journal you binge, not a brochure.

**Thesis:** every ranked competitor with weak pages still wins on photos (Kartunes ranks for "muscle car restoration Edmonton" with a *gallery page*), and the reviews say it out loud: "Go meet with Terry, look at the work that he does firsthand." This flow puts "look at the work" one click from everywhere. It's also the MHPD play — their blog alone ranks a semi-truck shop for "dyno tuning Edmonton" — applied as build logs.

## 3.1 Sitemap

| URL | Target keyword (primary) | Notes |
|---|---|---|
| `/` | speed shop Edmonton · custom car builds Edmonton | Journal-style homepage |
| `/builds/` | custom car builds Edmonton | The spine — index of every case study, filterable (era, make, job type) |
| `/builds/1960s-dodge-d100-light-patch/` | 1960s Dodge D100 restoration | Launch flagship — the traffic-stopping truck, natlajphotography shots |
| `/builds/[year-make-model-job]/` | "[year] [make] [model] restoration Edmonton" (one long-tail each) | Template: keyword-titled per keyword-universe §14 note 3 — e.g. "1972 Chevy C10 frame-off restoration — Edmonton." Launch with 4–6 from existing photo rips (matte-green vintage car, black classic, blue custom pickup, red Texaco pickup, stripped project frames) |
| `/builds/in-the-shop/` | — | "On the hoist now" — recurring freshness signal; feeds GBP posts |
| `/what-we-do/` | classic car restoration Edmonton | Capability overview — one deep page, anchor-sectioned to the 6 pillars |
| `/what-we-do/restoration/` | car restoration Edmonton | Short capability page: 300 words + auto-pulled strip of every restoration build |
| `/what-we-do/restomods-hot-rods/` | restomod Edmonton · hot rod builder Edmonton | Same pattern |
| `/what-we-do/engine-swaps/` | LS swap Edmonton · engine swap Edmonton | Same pattern |
| `/what-we-do/body-paint-metal/` | classic car rust repair Alberta | Same pattern |
| `/what-we-do/interiors/` | classic car interior restoration Edmonton | Same pattern |
| `/journal/` | — | Written posts between builds: lessons, teardowns, cost talk (the 50-blog plan lives here) |
| `/journal/what-a-restoration-costs-alberta/` | classic car restoration cost Canada | Cornerstone, journal-voiced |
| `/journal/barn-find-first-steps/` | barn find what to do first | "Don't crank it" — story-format content from real intakes (blog-keywords E14, brand-exact "revive your ride" tie) |
| `/the-shop/` | 2240 Speed Shop Edmonton · Terry Harmider | About + shop story + the road-to-Radium tradition (Columbia Valley Classics Show & Shine every September) |
| `/reviews/` | 2240 Speed Shop reviews | Named quotes + "come see the work firsthand" invite |
| `/quote/` | car restoration quote Edmonton | "Start your build" framing |
| `/areas/sherwood-park/` | classic car restoration Sherwood Park | Single suburb page v1 |
| `/contact/` | — | NAP + map + hours |

## 3.2 Homepage text flow

**S1 — HERO (3D drift-through that ENDS parked on the D100; the journal begins where the camera stops)**
- **Headline:** `EVERY CAR IN HERE HAS A STORY.`
- **Subhead:** `This is the journal of a working Edmonton speed shop — customs and classics, built by hand, written up one project at a time.`
- **CTA:** `READ THE LATEST BUILD`

**S2 — FEATURED BUILD (full-bleed case-study teaser — the D100)**
- **Kicker:** `FROM THE SHOP FLOOR`
- **Headline:** `THE D100 THAT STOPPED A PHOTOGRAPHER MID-COMMUTE`
- **Body:** `She was driving home. Saw the light patch on the hood. Pulled over, got the camera out. That's what a proper patina'd '60s Dodge does to people — and it's the standard every truck in this shop gets held to.`
- **Proof:** spec strip — `'60s DODGE D100 · SHOP TRUCK · SHOT BY NATLAJ PHOTOGRAPHY`
- **CTA:** `FULL BUILD PAGE`

**S3 — THE BUILD WALL (grid of case-study cards)**
- **Headline:** `RECENT WORK`
- Card format sample: `'50s CLASSIC, BLACK — full body, drivetrain, brightwork. Driver-quality finish, drives like it means it.` Each card = year/make/thumb/job-type tag.
- **CTA:** `ALL BUILDS`

**S4 — HOW A BUILD WORKS (process, journal-voiced)**
- **Headline:** `HOW IT GOES DOWN`
- **Body (4 numbered steps, terse):** `1. You send photos and the dream. 2. We scope it straight — phases, hours, honest numbers. 3. Deposit books your bay. 4. You get progress photos until the day you drive it out.`
- **CTA:** `START YOUR BUILD` → `/quote/`

**S5 — WHAT WE DO (capability strip — services subordinated to proof)**
- **Headline:** `THE TRADES BEHIND THE BUILDS`
- **Body:** `Restoration. Restomods and hot rods. Engine swaps. Metal, paint, interiors. Every capability page links to the builds that prove it — because saying it is cheap.`

**S6 — WORD GETS AROUND (reviews)**
- **Headline:** `WORD GETS AROUND`
- **Proof:** the three named quotes; then: `Don't take their word either. Come by the shop and look at what's on the hoist.`

**S7 — CLOSING CTA**
- **Headline:** `YOUR CAR BELONGS ON THIS WALL`
- **CTA:** `START YOUR BUILD` · `780-999-6450`

## 3.3 Internal-linking logic

- **Proof-outward model:** builds are the link hubs. Every build page links to (a) each capability page for work performed ("Full respray → Body, Paint & Metal"), (b) the next/previous build (binge loop), (c) `/quote/` with vehicle-type param.
- Capability pages auto-embed a filtered build strip (restoration page shows restoration builds) — the internal link graph literally makes services hang off proof.
- Journal posts cite specific builds inline (cost post references real hour counts from named builds — evidence density the AI-SEO playbook says wins citations).
- Homepage always links the newest build → crawl freshness path to the deepest content.

## 3.4 Pros / cons

**Pros**
- Perfectly matched to the niche's buying psychology — this is a portfolio purchase; the review corpus itself says "look at the work firsthand."
- Every completed build = a new long-tail landing page forever (compounding asset the competitor set structurally lacks: Iron Garage/Sideshow/Wadson's all have galleries with no text, no dates, no URLs).
- Freshness machine: "in the shop now" + build updates give the crawl-freshness signals Perplexity/AIO explicitly weight, with content Terry generates anyway by working.
- Strongest E-E-A-T of all five — first-hand experience is the entire architecture.
- Best story for the pitch walkthrough ("your Instagram reels become ranking pages").

**Cons**
- Cold-start problem: launch needs 5–6 real case studies written from rips + recovered captions; photo inventory is decent but hour counts/specs need Terry's memory — some detail will be thin until he's a client.
- Generic service heads ("classic car restoration Edmonton") sit on capability pages weaker than Flow 1's dedicated silo — slower to win the core T/L terms.
- No suburb coverage beyond Sherwood Park in v1 — concedes the metro-ring SERPs short-term.
- Depends on cadence: a journal that goes quiet looks like the shop died (the exact failure of Terry's IG — dormant since Dec 2024 — and of Park's frozen archive).

## 3.5 SEO ceiling

**Medium-high (7/10) at launch, highest long-run compounding.** Day-one keyword surface is the smallest of the SEO-serious flows, but every job the shop completes raises the ceiling — 20 builds in, this architecture out-ranks everything else on long-tail volume, image SEO, and freshness, and it is the most citation-liftable shape for AI engines ("show me restomod builds in Edmonton"). Ceiling risk is entirely operational: it needs a publishing habit.

---
---

# FLOW 4 — CONVERSION-LED ("One Page, One Job")

**Model:** single killer homepage + a progressive-disclosure quote funnel. Services exist as supporting detail (anchor sections + a handful of thin support pages), nav is minimal (Work · The Shop · Quote). The entire site is engineered around one metric: qualified quote requests.

**Thesis:** the win metric for this project is "close Terry as a client," and the win metric for Terry is booked jobs, not sessions. Nobody in the market has an online estimate flow (keyword-universe I: "quote/estimate — nobody offers an online estimate flow — conversion feature for the rebuild"; teardowns: best-in-market is a Shopmonkey form). A 2.7★ profile also means the site must convert *despite* Google — maximum persuasion density on one URL.

## 4.1 Sitemap

| URL | Target keyword (primary) | Notes |
|---|---|---|
| `/` | speed shop Edmonton · classic car restoration Edmonton (both — by design) | The one page: hero → segments → proof → process → price anchors → objections → funnel |
| `/#restoration` `/#customs` `/#swaps` `/#body-paint` | (anchor sections, not URLs) | Service detail lives in-page, progressive-disclosure accordions |
| `/quote/` | car restoration quote Edmonton | Step 1: what is it (year/make/model) → Step 2: what do you want done (service picker) → Step 3: photos (upload) → Step 4: name/phone/email. One question per screen, progress bar, "no spam, no pressure" microcopy |
| `/quote/booked/` | — | Thank-you: sets expectations ("Terry replies inside two business days"), review-ask groundwork, links the gallery |
| `/work/` | custom car builds Edmonton | Single scrolling proof page (lightbox gallery with captions) — supports the homepage, not a spine |
| `/the-shop/` | 2240 Speed Shop · Terry Harmider | Trust page: Terry, the D100, NAP, map, hours |
| `/privacy/` | — | Required by the photo-upload form (current site ships a file-upload form with no privacy policy — audit weakness #14) |
| `/contact/` | — | Phone-first fallback for the anti-form demographic |

*(Deliberately no blog, no city pages, no service URLs in v1 — that's the trade.)*

## 4.2 Homepage text flow (the whole game — longest flow of the five)

**S1 — HERO (3D drift-through; camera settles on an empty lift)**
- **Headline:** `DON'T SAVE YOUR DREAMS FOR SLEEP.`
- **Subhead:** `Revive your ride. Restorations, customs, and LS swaps — built by hand in east Edmonton, on the Sherwood Park line.`
- **CTA:** `GET YOUR QUOTE` (primary) · `SEE THE WORK` (ghost)

**S2 — THE GUT CHECK (problem/dream agitation)**
- **Headline:** `THAT CAR ISN'T GETTING YOUNGER IN YOUR GARAGE.`
- **Body:** `Every winter it sits is another season of rust, dried seals, and "next year." You already know what it could be. We turn could-be into keys-in-hand.`

**S3 — WHAT WE BUILD (4 accordion sections — progressive disclosure)**
- **Section head:** `WHAT WE BUILD`
- Accordion sample (closed state → one line; open state → 150 words + 3 photos + micro-CTA):
  - `RESTORATIONS — bare metal to better-than-new` → open: `Frame-off or rolling. Body, paint, drivetrain, wiring, interior — one shop, one standard. Driver-quality, show-quality, or somewhere honest in between; we scope it straight before a dollar moves.` → `QUOTE A RESTORATION`
  - `CUSTOMS & HOT RODS — rolling works of art` *(legacy line, reclaimed)*
  - `LS & DIESEL SWAPS — old iron, modern heart`
  - `BODY, PAINT & METAL — rust dies here`

**S4 — PROOF (D100 + gallery band + reviews interleaved)**
- **Headline:** `THE WORK DOES THE TALKING`
- **Body:** `A photographer stopped traffic to shoot our D100. Customers drive two hours past other shops to get here. Look at the work — then decide.`
- **Proof:** 6-photo band from the rips; named quotes woven between rows: `"Nobody has the same passion, drive, and quality of work." — Matt H., Google review`

**S5 — HOW IT WORKS (kill the fear of the unknown)**
- **Headline:** `NO MYSTERY. HERE'S THE PROCESS.`
- **Steps:** `1. PHOTOS IN — send what you've got, rough is fine. 2. STRAIGHT SCOPE — phases, hours, real numbers, in writing. 3. BAY BOOKED — deposit holds your slot; the calendar fills by March. 4. PROGRESS PICS — you watch it happen. 5. KEYS BACK — first start-up is yours.`

**S6 — WHAT IT COSTS (the section nobody in the market has the guts to publish)**
- **Headline:** `STRAIGHT TALK ON MONEY`
- **Body:** `A full restoration is real money — most run five figures, and 1,000-plus shop hours isn't rare. A budget-phased plan is how working people get it done. We'll tell you the honest number before you commit to anything, and we'll tell you if the car isn't worth it.`
- **CTA:** `GET YOUR NUMBER`

**S7 — OBJECTIONS / FAQ (accordion, FAQPage schema)**
- Sample Qs, answer-first: `How long does a restoration take? · Can I do it in phases? · Do you work on [make]? · What if my project's half-done from another shop? · Fresh paint in an Alberta winter — timing?`

**S8 — FINAL CTA (full-width, red #a02d2d band)**
- **Headline:** `TWO MINUTES. FOUR QUESTIONS. STRAIGHT ANSWER.`
- **CTA:** `START YOUR QUOTE` · `or call Terry: 780-999-6450`

## 4.3 Internal-linking logic

- Trivial by design: every section CTA → `/quote/` (with `?service=` param from the originating accordion); `/work/` and `/the-shop/` each link back only to `/quote/`. Anchor nav on-page. One canonical URL concentrates 100% of link equity.
- The funnel itself is client-side steps on one route (no crawl surface needed) with a `<noscript>` full-form fallback so the page still converts and parses as raw HTML.

## 4.4 Pros / cons

**Pros**
- Highest conversion density possible; the quote funnel is a genuine market first and the demo's most tangible "no one else has this" moment.
- Fastest build by far — 6 routes; pitch-ready in days, which matches the THIS-WEEK timeline.
- All motion/3D budget concentrates on one page = maximum wow per hour of work.
- Immune to thin-content risk — there are no thin pages because there are almost no pages.

**Cons**
- SEO ceiling is structurally capped: one URL cannot own "restoration" AND "hot rod" AND "LS swap" AND five suburbs — Google gets one title tag and the anchor sections can't rank independently. This repeats the *current site's* single-page failure (audit weakness #1) with better lipstick.
- No blog scaffold = the entire 50-post content plan (the research package's biggest weapon) has nowhere to live without a later re-architecture.
- No city pages, no vehicle pages — concedes every open SERP the research found.
- Fragile as a pitch: Terry's research package promises SEO depth; shipping a one-pager undercuts the story ("1 and 2" — demo + research — stop matching).

## 4.5 SEO ceiling

**Low (3/10).** Will win brand terms, GBP-adjacent "near me" (via the profile, not the site), and possibly "speed shop Edmonton" on exact-match domain + a strong single page. Everything else in the keyword universe stays on the table. This flow is a conversion layer, not an SEO architecture — its honest role is v0 launch shape or the `/quote/` module donated to whichever flow wins.

---
---

# FLOW 5 — HYBRID HUB ("One Keyword, One Owner") — the likely winner

**Model:** home + services + builds + Edmonton/areas hub + blog — engineered so **every high-value keyword cluster from the research has exactly one owning page**, and every page knows which cluster it owns. Six pillar service pages (consolidating the legacy 9 per keyword-universe §14 execution note 1), build case studies as the proof layer (Flow 3's engine, right-sized), the areas hub (Flow 1's suburb play, focused), the quote funnel (Flow 4's module, wholesale), and the three blog pillar hubs from blog-keywords structural rec #1.

**Thesis:** the research already ranked the 12 targets to win first (keyword-universe §13). This architecture is that shortlist turned into a site: no cannibalization, no orphan clusters, no page without a job.

## 5.1 Cluster → owner map (the design rule)

| Keyword cluster (research ref) | Owning page — the ONLY page targeting it |
|---|---|
| speed shop Edmonton / brand (A) | `/` |
| classic car restoration Edmonton (B — #1 target) | `/services/classic-car-restoration/` |
| restomod + custom builds + hot rods (C — #2, #5) | `/services/restomods-custom-builds/` |
| LS swap / engine swap / engine builds (D — #4, #12) | `/services/engine-swaps-builds/` |
| performance, tuning, carbs (E — #9, #10) | `/services/classic-performance-tuning/` |
| rust, body, paint, metal (F) | `/services/body-paint-metalwork/` |
| interiors + classic service (F/B adj.) | `/services/classic-interiors-service/` |
| muscle/truck/vehicle long-tail (G1 — #3, #7) | individual `/builds/…` pages (one vehicle keyword each) |
| suburb terms (H — #11) | `/areas/…` pages |
| cost/education informational (I/J — #8) | `/guides/…` blog hubs |
| reputation/brand-defense | `/reviews/` |
| quote intent | `/quote/` |

## 5.2 Sitemap

| URL | Target keyword (primary) | Notes |
|---|---|---|
| `/` | speed shop Edmonton · custom car shop Edmonton | Entity-dense, answer-first intro (who/what/where/since-when in the first 60 words) |
| `/services/` | classic car shop Edmonton | Hub; 6 pillar teasers |
| `/services/classic-car-restoration/` | classic car restoration Edmonton | #1 target; includes frame-off vs rolling table, cost-range table, FAQ block, filtered build strip |
| `/services/restomods-custom-builds/` | restomod Edmonton · hot rod shop Edmonton | #2 + #5 targets; "restomod shop Alberta" secondary |
| `/services/engine-swaps-builds/` | LS swap Edmonton · engine swap Edmonton | #4 target; performance engine build Edmonton secondary (#12) |
| `/services/classic-performance-tuning/` | carburetor rebuild Edmonton · ECU tuning Edmonton* | #9 + #10; *ECU claim only if capability verified with Terry — else carb/ignition-led |
| `/services/body-paint-metalwork/` | classic car rust repair Alberta · metal fabrication Edmonton | Alberta-salt angle |
| `/services/classic-interiors-service/` | classic car interior restoration Edmonton | Period-correct materials copy from legacy site; brakes/ignition "classic service" lives here |
| `/builds/` | custom car builds Edmonton (supporting) | Case-study index |
| `/builds/1960s-dodge-d100/` | 1960s Dodge D100 (brand flagship) | Launch flagship |
| `/builds/[vehicle-slug]/` ×4–6 at launch | one G1 vehicle keyword each (e.g. C10, Mustang, muscle car restoration Edmonton via a featured build) | #3 + #7 targets absorbed by keyword-titled builds; grows every job |
| `/edmonton/` | classic car restoration near me / Edmonton hub | The metro hub: shop location story, Radium/Castrol/RAD community ties, car-show calendar teaser, links to all areas |
| `/edmonton/sherwood-park/` | classic car restoration Sherwood Park | #11 target — flagship suburb |
| `/edmonton/st-albert/` | classic car mechanic St. Albert | Unique local content (Rock'n August) |
| `/edmonton/leduc-nisku/` | classic car shop Leduc | Passenger/classic gap vs HD truck shops |
| `/edmonton/spruce-grove/` | car restoration Spruce Grove | — |
| `/guides/` | — | Blog home |
| `/guides/costs/` | classic car restoration cost Canada | #8 target — pillar hub "Real Costs in Canada," spokes = B-cluster posts |
| `/guides/alberta-laws/` | modified car laws Alberta | Pillar hub — A-cluster spokes (exhaust legality, antique plates, OOP inspections) |
| `/guides/winter/` | winter storage classic cars Alberta | Pillar hub — D-cluster spokes (the −40 moat) |
| `/guides/[post-slug]/` | per 50-post plan | Article schema, named author, visible dates |
| `/about/` | Terry Harmider · 2240 Speed Shop | Wikipedia-stub facts + Person schema |
| `/reviews/` | 2240 Speed Shop reviews | Brand-defense page: named quotes, review invite, "come see the shop" |
| `/quote/` | car restoration quote Edmonton | Flow 4's progressive funnel, wholesale |
| `/faq/` | how much does it cost to restore a classic car (PAA umbrella) | FAQPage schema hub |
| `/contact/` | — | NAP, map, hours, service-area list |

## 5.3 Homepage text flow

**S1 — HERO (3D drift-through; camera glides past lift, dyno, toolboxes, settles wide on the shop)**
- **Headline:** `CUSTOMS AND CLASSICS. BUILT IN EDMONTON.`
- **Subhead:** `2240 Speed Shop — restorations, restomods, and engine swaps from a working shop on the Sherwood Park line. Don't save your dreams for sleep — revive your ride.`
- **CTA pair:** `START YOUR BUILD` · `SEE THE WORK`

**S2 — ENTITY BLOCK (answer-first, machine-liftable — 50 words, exactly what AI engines quote)**
- **Body:** `2240 Speed Shop is Terry Harmider's customs-and-classics shop at 2009 91 Ave NW, Edmonton — right on the Sherwood Park boundary. Full restorations, hot rods and restomods, LS and diesel conversions, body, paint, and classic interiors. Serving Edmonton, Sherwood Park, St. Albert, Leduc, and Spruce Grove.`

**S3 — SIGNATURE PROOF (the D100)**
- **Headline:** `THE TRUCK A PHOTOGRAPHER PULLED OVER FOR`
- **Body:** `The light patch on the hood of our '60s Dodge D100 stopped a passing photographer mid-drive. She shot it on the spot. That's the bar in this shop — build things people can't drive past.`
- **CTA:** `THE D100'S BUILD PAGE`

**S4 — SIX TRADES (pillar services grid)**
- **Section head:** `WHAT WE DO`
- Sample cards: `RESTORATION — Frame-off or rolling. Honest scope, real hours, one standard.` · `RESTOMODS & HOT RODS — Classic skin, modern spine. Rolling works of art with brakes that work.` · `ENGINE SWAPS & BUILDS — LS and diesel conversions. Old iron, modern heart — starts at minus thirty.` · `PERFORMANCE & TUNING — Carbs rebuilt and dialed. Points to electronic ignition. Horsepower you can feel.` · `BODY, PAINT & METAL — Rust dies here. Patch panels, floor pans, straight steel, deep paint.` · `INTERIORS & CLASSIC SERVICE — Period-correct materials, discreet modern comfort.`

**S5 — RECENT BUILDS (proof band, 3 cards + link)**
- **Headline:** `FRESH OFF THE HOIST`
- **CTA:** `ALL BUILDS`

**S6 — WORD GETS AROUND (reviews)**
- **Headline:** `WORD GETS AROUND`
- **Proof:** the three named quotes; closer: `Better yet — come by. Look at what's on the hoist. The work does the talking.`

**S7 — SERVING EDMONTON & THE RING (areas strip)**
- **Headline:** `EAST EDMONTON. SHERWOOD PARK LINE. WORTH THE DRIVE FROM ANYWHERE.`
- **Body:** `Customers haul projects in from St. Albert, Leduc, Spruce Grove, and county roads we couldn't name. Every September the shop runs the road to Radium for the Columbia Valley Classics Show & Shine — come find us there.`
- Links → `/edmonton/` hub + suburb pages.

**S8 — STRAIGHT ANSWERS (guides teaser)**
- **Headline:** `STRAIGHT ANSWERS, ALBERTA NUMBERS`
- **Body:** `What a restoration actually costs in Canada. What Alberta law actually says. What −40 actually does to stored classics. Nobody local publishes this. We do.`
- 3 pillar-hub cards.

**S9 — CLOSING CTA (red band)**
- **Headline:** `GOT A PROJECT? LET'S TALK STRAIGHT.`
- **Body:** `Photos in, honest scope out. Two business days.`
- **CTA:** `START YOUR QUOTE` · `780-999-6450`

## 5.4 Internal-linking logic

- **One-owner rule enforced in linking:** any page mentioning a cluster term links to that cluster's owning page — never targets it. (Blog post about LS-swap cost links to `/services/engine-swaps-builds/`; it competes with US content, not with its own money page.)
- **Three-layer flow:** guides (informational) → services (transactional) → quote (conversion). Builds link laterally into services (proof) and downward into quote. Areas pages link to the 3 services their suburb searches most.
- Pillar hubs (`/guides/costs/` etc.) interlink spokes tightly per blog-keywords structural rec #1; every spoke links up to its hub and across to exactly one service page.
- Breadcrumbs sitewide; footer: 6 services + 4 areas + 3 hubs + reviews/quote — full site reachable in ≤2 clicks.

## 5.5 Pros / cons

**Pros**
- Every one of the research's 12 highest-value targets has a designated owner — nothing on the shortlist is orphaned, nothing cannibalized.
- Consolidating 9 legacy services into 6 pillars keeps every page deep enough to actually win (avoids Flow 1's thin-page trap while conceding almost no keywords — parts/car-sales, the two weakest, fold into copy).
- Carries the best module of every other flow: Flow 3's build engine, Flow 4's funnel, Flow 1's suburbs, Flow 2's vehicle terms (absorbed by keyword-titled builds — no tribe-hub overhead).
- Blog architecture matches the delivered 50-post plan 1:1 (three hubs = the three clusters the research says to build) — the pitch's "here's the site AND the 12-month plan it's pre-wired for" story.
- Scales cleanly: after signing, city pages, vehicle hubs, or more pillars bolt on without re-architecture.

**Cons**
- Most design/build coordination of the five — four distinct template families (service pillar, build case study, area page, guide hub) before polish.
- Six pillar pages still need real depth at launch (~800 words each + tables + FAQ blocks) — copy is the critical path, not code.
- One-owner discipline requires editorial governance forever; a future blog post targeting "restomod Edmonton" head-on breaks the model.
- Slightly less conversion-obsessed homepage than Flow 4 (nine sections vs. a single funnel drive).

## 5.6 SEO ceiling

**Highest overall (9.5/10).** Matches Flow 1's transactional ceiling with less dilution risk, adds Flow 3's compounding build long-tail, and is the only flow whose informational layer is structural (three pillar hubs) rather than bolted on — which is where the research says the real moat is (zero Canadian competition on cost/law/winter content). Also the best GEO shape: one liftable, answer-first owner per query type is exactly what AI engines cite. Ceiling limited only by execution cadence and the review-mass gap (which no architecture fixes — the review-generation program does).

---
---

# RECOMMENDATION MATRIX

Scores 1–5. **SEO power** = realistic 12-month ranking ceiling across the keyword universe. **Conversion** = quote-request yield per visitor. **Build speed** = pitch-ready in days (higher = faster). **Wow compatibility** = how naturally the R3F drift-through hero + cinematic motion concepts sit on this skeleton.

| Flow | SEO power | Conversion | Build speed | Wow compat | Total | Verdict |
|---|---|---|---|---|---|---|
| 1 — Service-led | 5 | 3 | 3 | 2 | 13 | The safe local-SEO machine. Wins rankings, bores the demo. Backbone ideas survive inside Flow 5. |
| 2 — Audience-led | 4 | 4 | 2 | 4 | 14 | Best message-match and open vehicle SERPs, but heaviest copy load + cannibalization risk on core heads. Its vehicle keywords are absorbable via Flow 5's builds. |
| 3 — Story-led | 4 | 4 | 3 | 5 | 16 | The soul of the brand ("look at the work firsthand") and best long-run compounding — but cold-start thin and operationally dependent on publishing cadence. Donate its build engine. |
| 4 — Conversion-led | 1 | 5 | 5 | 5 | 16 | The fastest wow and the market's only quote funnel — but it re-creates the current site's one-page SEO failure. Donate its funnel; never ship it alone. |
| **5 — Hybrid hub** | **5** | **4** | **3** | **4** | **16** | **BUILD THIS.** Only flow where every high-value cluster has exactly one owner, the 50-post plan slots in natively, and the best module of every other flow is already integrated. |

**Recommendation: build Flow 5.** Tie-breaker over Flows 3 and 4: totals are close, but Flow 5 is the only one that maximizes the *pitch* ("demo + research package tell one story") while leaving no keyword cluster orphaned and no re-architecture needed after Terry signs.

**Sequencing for the this-week timeline:** ship Flow 5's skeleton with Flow 4's compression — day 1–2: homepage (full 9-section flow) + `/quote/` funnel + `/builds/1960s-dodge-d100/` + `/about/` + `/contact/`; day 3–4: the 6 service pillars + `/reviews/` + `/edmonton/` + Sherwood Park; day 5+: remaining areas, `/guides/` hubs with the 3 cornerstone posts, FAQ. Every page ships with the invariants (schema stack, NAP, footer credit) from the first commit.

**Steal list (what each losing flow donates to the build):**
- Flow 1 → the areas-page pattern + service-silo linking discipline.
- Flow 2 → vehicle-keyword titling for build pages; the "we finish stalled projects" wedge as a section on the restoration pillar.
- Flow 3 → the build case-study template, "in the shop now" freshness loop, and the D100 flagship page.
- Flow 4 → the progressive quote funnel, the "straight talk on money" section, and the objection-killing FAQ accordion.

*End of document. Companion piece: the 5 visual concepts (same folder) — any of which can skin Flow 5.*
