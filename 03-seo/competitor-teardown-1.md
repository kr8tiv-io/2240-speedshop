# Competitor SEO Teardown — Part 1: The Big Three

**Project:** 2240 Speed Shop website rebuild — Edmonton, AB
**Date:** August 2, 2026
**Competitors covered:** SSS Motorsports · JBs Power Centre · Park Muffler (Park Performance / Player 3 group)
**Method:** Live fetches of homepages, service pages, and blogs (raw HTML for exact title tags, meta descriptions, H1s, and JSON-LD schema) + SERP sampling for the Edmonton money keywords.

---

## Executive Summary

| | SSS Motorsports | JBs Power Centre | Park Muffler group |
|---|---|---|---|
| **Tier** | Service-shop peer (closest rival) | Parts retail giant | General-repair volume shop |
| **Platform** | Squarespace | Shopify | WordPress (WPBakery + Slider Revolution, 2018-era) |
| **Founded** | Recent (JDM scene shop) | 1966 ("small Edmonton speed shop") | 1979 (family-owned) |
| **Google reviews** | 4.6 / ~105 | ~3.9–4.8 across locations, 1,200+ combined (Birdeye: 746 + 296 + 174) | 4.7 / ~1,818–1,939 (largest in metro) |
| **Blog** | 7 posts, 2 batch-dates, effectively dead | Active: 1–2/mo educational + near-daily "Featured Builds" | ~115 posts (23 pages) but ALL stamped Nov 5, 2025 (migration batch); currently ~stale |
| **Homepage HTML weight** | 1,577 KB (bloated) | 730 KB (heavy) | 288 KB |
| **Schema** | WebSite + Organization + LocalBusiness (thin, no hours/reviews) | Organization + WebSite/SearchAction only — **no LocalBusiness, no AutoRepair** | WebSite + WebPage + Organization + nested LocalBusiness w/ full PostalAddress |
| **Pricing transparency** | Merch/kits only ($64.99–$144.99); no service pricing | Product pricing (e-comm) but no install pricing | None anywhere |
| **Biggest weakness** | Thin copy, no reviews on site, dead blog, no service pricing, no online booking friction removed | No local service schema, generic H1s, blog is product-promo, mixed service reviews | Fragmented across 3 domains (parkmuffler / parkperformance / player3), dated tech, batch-dated blog, "muffler shop" brand ceiling |

**The headline for 2240:** Nobody in the Edmonton performance space combines (a) modern fast site, (b) real service-level SEO pages with pricing, (c) a living local-keyword blog, and (d) on-site review proof. Each competitor has at most one of these. All four together is an open lane.

---

# 1. SSS Motorsports — sssmotorsports.ca

**The closest direct rival.** Full-service performance: AWD dyno tuning, standalone ECU, engine builds, fabrication, restoration; JDM specialty (Subaru/Nissan/Toyota). 4.6★ / ~105 Google reviews. 9831 63 Ave NW, Edmonton, T6E 0G7 · 780-438-2638 · Mon–Thu 8–5, Fri 8–4.

## 1.1 Title tags & meta descriptions (exact, fetched Aug 2026)

| Page | Title tag | Meta description |
|---|---|---|
| Homepage `/` | `SSS motorsports` | "SSS Motorsports is Western Canada's leading automotive performance and tuning shop located in YEG. Run by drivers, for drivers, we are Edmonton…" (truncated in tag) |
| `/performance` | `Edmonton Automotive Performance — SSS motorsports` | "…we know performance better then anyone, bolt-ons to engine swaps, JDM to Euro, we got you covered…" (note the "then/than" typo shipped live) |
| `/dyno-tuning` | `Edmonton Dyno and Automotive Tuning — SSS motorsports` | "…top-tier dyno tuning services using our Dynocom AWD 15000 roller dyno to YEG. Measure horsepower, fine-tune your build…" |
| `/parts` | `Edmonton JDM Performance Parts and Fabrication — SSS motorsports` | "…nothing compares to the performance and reliability of genuine JDM (Japanese Domestic Market) auto parts…" |
| `/general` and `/services` | `Edmonton JDM General Mechanical — SSS motorsports` (duplicate title on two URLs) | "At SSS Motorsports, we're best known for being Edmonton…" (cut off) |
| `/contact` | `Contact | Get Expert Assistance Today — SSS motorsports` | Standard contact blurb |
| `/team` | `The Team | Explore Expert Car Tuning - Join the Team — SSS motorsports` | Team bios blurb |
| `/blog` | `Blog | Enhance Your Ride Today — Learn More — SSS motorsports` | **empty meta description** |

**Read:** Someone did one deliberate SEO pass — every service page leads with "Edmonton" + keyword, which is why they're the strongest service-tier site in the SERPs. But the **homepage title is just "SSS motorsports"** — zero keywords on their highest-authority page. Duplicate titles on `/general` vs `/services`, an empty blog meta, AI-flavored filler titles ("Enhance Your Ride Today — Learn More"), and a live grammar typo show it was a one-time pass, not a program.

## 1.2 Structure & content

- **H1s:** Home: "Edmonton's automotive performance experts." / "FOR DRIVERS, BY DRIVERS". Service pages: bare one-worders — "Performance", "Dyno Tuning", "General Maintenance" (keyword-thin H1s).
- **Nav:** General · Performance · Dyno and Tuning · Parts and Fabrication · Store · Gallery · Contact · Team.
- **Copy depth: extremely thin.** The entire `/performance` page body is ~2 sentences ("From lowering springs to engine swaps and builds… let's make your dream build a reality."). `/dyno-tuning` is ~3 sentences plus a personality bio (tuner "Ali / KingTuner," 10+ yrs, "home garage builds to twin turbo exotics"). No process explanation, no FAQ, no platform lists on-page, no pricing.
- **Services (from copy):** fluid changes (Motul, Liqui Moly, Red Line), JDM/USDM diagnosis, inspections, alignments, engine replacement/rebuilds, brakes, exhaust, wheels/tires; aftermarket installs, engine builds/swaps, custom wiring, fabrication, forced induction, restoration, body work, suspension, standalone ECU (Link, Haltech, ECU Master, Cobb, HP Tuners, Hondata, AEM, MS3 Pro); Dynocom AWD 15000 roller dyno, flash/street tuning, pre-dyno inspections; JDM parts sourcing, rare/classic used parts. Engine-code fluency signalled: EJ, FA, 2J, RB, SR, 3S.
- **Store:** small e-comm — GM IAT Sensor Kit $64.99, Subaru Cyl-4 Cooling Mod $99.99, Boost Solenoid Kit $144.99, crewneck $59.99. The only pricing on the whole site is merch/kits.
- **Booking:** Shopmonkey quote-request form behind "Book now"; otherwise "give us a call."

## 1.3 Blog

7 posts total, no pagination. Five stamped **2025-01-23** and two **2024-01-23** — two annual batch drops, almost certainly agency/AI filler. Titles: ZF 8HP transmissions, daily-driver maintenance, "Ultimate Guide to Finding Quality JDM Auto Parts," Subaru engine reliability, rise of drifting, **"Out of Province Inspections for JDM and Domestic Vehicles in Alberta"** (their only local-keyword post — and it's a genuinely good keyword), dyno tuning explainer. No Edmonton in any title. Effectively a dead blog.

## 1.4 Schema & local SEO

Three JSON-LD blocks: `WebSite`, `Organization` (address, phone, socials), `LocalBusiness` — but the LocalBusiness has **`openingHours: ""`** (empty), no geo, no priceRange, no aggregateRating, and the generic type instead of `AutoRepair`. Squarespace defaults, not crafted. No embedded map found on home, no city/suburb pages, **zero reviews or testimonials anywhere on the site** despite a 4.6/105 GBP. Secondary domain **sssjdm.com 301-redirects correctly** to sssmotorsports.ca (done right — no split authority).

## 1.5 Site quality

Squarespace; modern dark aesthetic, strong real shop/build photography, active socials (IG/FB/YouTube/TikTok). But homepage HTML alone is **1.58 MB** — Squarespace bloat plus heavy imagery = sluggish mobile LCP. Mobile layout is fine (Squarespace responsive), but the thin copy means mobile users get almost nothing per page.

## 1.6 Weaknesses inventory

1. Homepage title tag carries no keywords at all.
2. One-sentence service pages — nothing for Google to rank beyond the title tag; nothing for a shopper to compare.
3. No service pricing, no packages, no "dyno pull $X" hook.
4. Zero on-site review proof; no aggregateRating schema.
5. Dead, unlocalized blog; empty blog meta description.
6. Keywords ignored: turbo kit install Edmonton, Subaru specialist Edmonton (they own the reality but not the phrase as a page), Nissan Skyline/GTR service Edmonton, drift car build, roll cage fabrication Edmonton, standalone ECU tuning Edmonton (as its own page), out-of-province inspection Edmonton (one blog post, no service page), winter storage/spring dyno prep.
7. No FAQ content anywhere → no PAA/featured-snippet capture, no AI-answer surface.
8. Broken/empty LocalBusiness hours in schema; generic business type.
9. JDM branding is a moat *and* a ceiling — a Euro or domestic owner reading "Edmonton JDM General Mechanical" self-deselects.

## 1.7 Verdict — SSS Motorsports

**Likely ranks for:** "dyno tuning Edmonton" (page 1 confirmed in SERP sample), "JDM parts Edmonton," "JDM mechanic Edmonton," Subaru/Nissan performance queries, brand name. Their title-tag pass + genuine topical authority (JDM) + only AWD roller dyno positioning in the enthusiast tier carries them.

**Left on the table:** everything below the title tag. Thin pages rank on weak-competition terms but collapse the moment anyone publishes real content. No reviews on site, no pricing, no FAQ, no living blog, no non-JDM positioning.

**How 2240 beats them:** Out-write them page-for-page — 800+ word service pages with process, platform lists, FAQs, and at least anchor pricing ("dyno pulls from $X"). Put review proof + `AutoRepair` schema with `aggregateRating` on every page. Ship the 50-post local blog they never built ("out of province inspection Edmonton" alone is a free win they signposted). Position wider than JDM — take Euro + domestic performance queries they structurally can't touch. Their 1.5 MB Squarespace vs. a sub-500 KB fast build is a Core-Web-Vitals gap Google can measure.

---

# 2. JBs Power Centre — jbspowercentre.com

**The SERP-dominating incumbent.** Parts/diesel giant, founded **1966 by Jim Bell as "a small speed shop in Edmonton"** — they own the literal phrase "speed shop Edmonton" in Google's understanding via their About page and 60 years of citations. Today: 3 retail stores (South Edmonton, West Edmonton, NE Calgary), 3 wholesale DCs, **200,000 sq ft combined warehousing**, e-commerce, install centres (Edmonton 780-406-7030 / Calgary 403-520-7658), fleet division (jbsfleet.com), Proworx crate-engine brand.

## 2.1 Title tags & meta descriptions (exact)

| Page | Title tag | Meta description |
|---|---|---|
| Homepage `/` | `Performance Auto Parts & Installation Centers | JBs Power Centre` | "JBs Power Centre specializes in high performance automotive, diesel performance, truck accessories, car audio, radar detectors and remote car starters." |
| `/pages/diesel-performance` | `Diesel Performance Parts: Duramax, Powerstroke, Cummins, EcoDiesel – JBs Power Centre` | "Shop here for diesel performance parts for Duramax, Powerstroke, Cummins, Ecodiesel & more. Expert support, installations & top brands…" |
| `/pages/jbs-power-centre-installation-centers` | `JBs Power Centre Installation Centers, Edmonton and Calgary` | "Our aftermarket accessory, audio & 12-volt electronics installation centers in Edmonton and Calgary…" |
| `/pages/jbs-power-centre-south-edmonton` | `South Edmonton Auto Repair | Aftermarket Parts Installation & Remote Start – JBs Power Centre` | "Come visit our brand new JBs Power Centre location in South Edmonton…" |
| `/pages/about-us` | `JBs Power Centre About Us` | "Our History In 1966 JBs Power Centre was founded by Jim Bell as a small speed shop in Edmonton, Alberta…" |
| `/pages/proworx-performance-engines-v2` | `Proworx Engines: Short Blocks, Long Blocks, Fully Dressed Crate Engines – JBs Power Centre` | Turnkey crate engine pitch |
| `/pages/store-locator` | `Store Locator - JBs Power Centre` | (widget placeholder text leaked into the meta: "Store locator is loading from CBMaps Store Locator Widget..") |

**Read:** Competent Shopify SEO on commercial pages — model-family keywords (Duramax/Powerstroke/Cummins/EcoDiesel) right in titles, per-location pages with city keywords. But sloppiness shows: About page title is bare, the store-locator meta is literally widget boilerplate, and several pages ship **empty H1 tags** (homepage and diesel page H1s are blank in the raw HTML — heading structure is carried by styled divs, which wastes the strongest on-page signal).

## 2.2 Structure & content

- **Homepage H2-level sections:** "NEED ASSISTANCE?", "POPULAR CATEGORIES", "From Our Blog", "JBs Featured Builds", "Let customers speak for us" (319-review Shopify widget), newsletter. **No H1.**
- **Nav:** Brands · Categories · DIESEL (mega-menu: Duramax ×6 model-years, Cummins ×9, Power Stroke ×6 generations, Jeep EcoDiesel, Mercedes Bluetec, Nissan Cummins) · Catalog · Deals · Financing · Fleet & Commercial · Proworx Engines · Installation Centers · Blogs · Events · Resources.
- **Categories:** radar detectors, car audio, diesel maintenance, engine assemblies, tonneau covers, interior, performance tuning (gas/diesel), oils, towing, intakes, suspension, exhaust, chassis, lighting.
- **Brands:** Holley, Quick Fuel, Brian Tooley Racing, Gearstar, K&N, MBRP, HP Tuners, Demon, Driven Racing Oil, KBS, ZAMP, Noco, Orion, Big Country, PPE, Aeromotive, Wilwood.
- **Services:** installs by phone quote only (no online booking, no pricing), online + in-store financing, price-match guarantee, purchase protection plans, fleet services, Proworx custom engines ("Not a Crate Engine. A Proworx Engine.").
- **E-comm stack:** cart, wishlists, gift cards, VIN/SKU search, back-in-stock alerts, Shop Pay/Apple Pay/Google Pay/PayPal.

## 2.3 Blog

Two-track:
- **/blogs/news ("JBs Power Blog"):** ~1–2/mo, 4+ pages. Recent: "Everything You Need to Know About High Performance Transmission Coolers" (Jun 19 2026), "Not a Crate Engine. A Proworx Engine." (May 7 2026), "Fuel Economy Guide" (May 6 2026), winterizing guides, "Why Professional Installation Matters," Yukon Gear crush-sleeve kits. Educational-promotional hybrid, no authors, minimal local targeting.
- **/blogs/jbs-featured-builds:** near-daily bursts (8 posts May–Jun 2026): '53 International, C6/C8 Corvettes (Wilwood brakes), Hellcat MBRP exhaust, Porsche Cayenne radar, multiple Harley audio builds. Pure showcase/portfolio, not keyword content — but excellent social proof and long-tail image real estate.
- Plus "Staff Picks" and "Staff Rides" blogs. **The only competitor actively publishing.**

## 2.4 Schema & local SEO

JSON-LD: `Organization` (logo, socials — with empty strings polluting `sameAs`) + `WebSite`/`SearchAction`. **No LocalBusiness, no AutoRepair, no Product review schema at page level, no store-location schema on the location pages.** For a 3-store retailer this is a glaring miss — their local pack presence rides on GBP alone. Location pages exist (good) but are thin. Reviews: on-site widget "from 319 reviews"; Birdeye aggregates 746 + 296 + 174 across locations with a spread of **3.9 to 4.8** — service-counter complaints ("cold, unwelcoming," an install "sounds the same as stock") sit next to praise. Volume is huge; sentiment is uneven.

## 2.5 Site quality

Shopify — fast enough infrastructure but a **730 KB homepage** stuffed with carousels. Retail-catalogue design, competent but charmless; zero Edmonton personality on the homepage (it reads like a national mail-order house, because it is one). Mobile works (Shopify themes) but mega-menus are heavy.

## 2.6 Weaknesses inventory

1. **Identity: parts store, not a shop.** Installs are an afterthought ("call for a quote"). Anyone searching for *work done* — tuning, fab, engine building as a service — finds product grids.
2. No LocalBusiness/AutoRepair schema; empty H1s on key pages; widget text leaking into metas.
3. No service-level landing pages: no "dyno tuning" (they don't promote a dyno at all), no custom fabrication, no custom exhaust bending, no ECU-tuning service page (HP Tuners is sold as a *product*).
4. Blog never targets "Edmonton + service" queries; Featured Builds are un-optimized showcase posts.
5. Mixed review sentiment on service/installs = attackable trust gap for a service-first brand.
6. Gas/import performance is diluted — diesel, audio, radar, tonneau covers dominate. A Subaru or BMW owner has no home here.
7. No pricing on installs; no online booking of any kind.
8. Heritage story ("small speed shop, 1966") is buried on an untitled About page — emotionally powerful, structurally wasted.

## 2.7 Verdict — JBs Power Centre

**Likely ranks for:** "speed shop Edmonton" (heritage + citations + exact-phrase About copy), "performance parts Edmonton," all diesel platform-part terms (Duramax/Cummins/Power Stroke + Edmonton), "car audio Edmonton," "remote starter Edmonton," brand + product long-tail via 1000s of Shopify product pages. Domain authority from 60 years of history and e-comm scale makes them unbeatable on *parts retail* terms.

**Left on the table:** the entire *service* SERP. They rank for buying things, not doing things. No dyno, no tuning-service page, no fab page, no local service schema, no bookable anything.

**How 2240 beats them:** Don't fight the parts catalogue — flank it. Own every "service verb + Edmonton" query: dyno tuning, ECU calibration, engine building, custom fabrication, turbo install, corner balancing. Be the shop where JBs customers take the parts they just bought (a real blog angle: "Bought a kit from JBs? Here's what proper installation looks like"). Exploit the trust gap: their install reviews are mixed and anonymous; 2240 can publish named-tech build stories with review schema. And steal their best move — the Featured Builds cadence — but with SEO titles ("Hellcat MBRP catback install Edmonton") instead of scrapbook titles.

---

# 3. Park Muffler / Park Performance / Player 3 — parkmuffler.com

**The review fortress.** Sherwood Park family shop since 1979. Custom exhaust, full general repair, diesel, performance upgrades; in-house domestic ECM tuning via the **Player 3** division (Chris Zelinsky, certified tuner — Texas Speed dealer, LS/Hemi specialty, remote calibration across Canada); parts arm **Park Performance** at 141 Seneca Rd. 101 Seneca Rd, Sherwood Park, T8A 4G6 · (780) 464-7887 · Mon–Fri 7:30–6, Sat 7:30–3. **4.7★ / ~1,818–1,939 Google reviews — the largest review mass in the metro.** BBB "five-star" member, Chamber of Commerce, Three Best Rated badges.

## 3.1 Title tags & meta descriptions (exact)

| Page | Title tag | Meta description |
|---|---|---|
| Homepage `/` | `Sherwood Park Auto Repair Shop | Park Muffler Radiator Brakes & Tires` | "Park Muffler has over 40 years experience in providing Sherwood Park & surrouning areas with expert auto repair services including, exhaust, radiator, brakes and more!" (**"surrouning" typo live in the meta**) |
| `/services/` | `Automotive Repair Services Sherwood Park & Edmonton | Car, Truck & Vehicle Repair & Maintenance | Park Muffler` | Full-service pitch |
| `/services/exhaust-muffler/` | `Edmonton Custom Exhaust | Custom Exhaust Systems & Repairs | Park Muffler Exhaust Shop` | Brands: Black Widow, Magnaflow, Flowpro, Flowmaster, Pacesetter |
| `/services/performance-upgrades/` | `Edmonton Vehicle Performance Upgrades at Park Muffler` | Chips/tuners/programmers pitch |
| `/services/exhaust-muffler/dpf-egr-deletes/` | `DPF & EGR Deletes Edmonton & Sherwood Park | Park Muffler | Vehicle Performance Upgrades` | Openly marketing delete kits (note: legally grey in Canada — an exposure, and a reason big fleets keep distance) |
| `/services/performance-upgrades/suspension-lift-kits/` | `Lift Kits & Levelling Kits Edmonton | Suspension Leveling | Park Muffler Performance Upgrades` | Lift/leveling install |
| `/services/mechanical/diesel/` | `Taking Care of a Diesel Vehicle | Diesel Car Tips | Park Muffler Edmonton` | Diesel maintenance tips |
| `/about/` | `About Us | Park Muffler Auto Repair Shop | Edmonton, Sherwood Park, Fort Saskatchewan` | Since-1979 story |
| `/blog/` | `Custom Auto Maintenance Blog, Advice & Articles | Park Muffler` | Generic blog pitch |

**Read:** This is the most *professionally executed* SEO of the three — every page double-targets "Edmonton + Sherwood Park," service pages exist for ~40 distinct services in an 8-category silo (`/services/[category]/[service]/`), and titles stack keyword variants ("Lift Kits & Levelling Kits… Suspension Leveling"). Classic local-SEO-agency work, circa 2018–2020, still compounding with their review mass.

## 3.2 Structure & content

- **Homepage H1:** "Sherwood Park's Top Auto Repair Shop". H2s: services overview, "What Our Customers Say About Our Auto Repair Services" (Google 4.7/1,818 review widget), "Auto Repair Services Blog."
- **Performance-upgrades page H1:** **"Custom Tuning Shop Edmonton & Sherwood Park"** — they are explicitly claiming the tuning keyword. FAQ-styled H3s ("How much HP will a tune add?" — "5 to 30% more horsepower", "Can I tune my ECU myself?") built for featured snippets.
- **Service silo (8 categories):** Exhaust & Muffler (custom systems, DPF/EGR deletes, cat theft prevention/repair) · Cooling/Radiator/AC · Tires & Wheels (alignment) · Maintenance/Diagnostics (battery, CEL, electrical, oil, tune-ups, windshield) · Mechanical (brakes, diesel, engine swaps, fuel pumps, head gaskets, transmission) · Commercial (fleet, heavy-duty truck) · Performance Upgrades (exhaust, deletes, lift kits) · Inspections (**out-of-province, insurance**) · RV maintenance.
- **Pricing:** none, anywhere.
- **The group fragmentation:** performance identity is split across **three weak-to-mediocre domains** — parkmuffler.com (WordPress, main authority), **parkperformance.ca** (separate WordPress site, "Sherwood Park's leading full service automotive performance parts shop," LayerSlider-era) and **player3.ca** (GoDaddy Website Builder, title "Player 3 Performance Tuning," homepage H1 is literally **"Photo Gallery"**). The actual crown jewel — in-house domestic ECM calibration, Texas Speed dealership, custom cam packages — lives on the weakest site of the three and is barely mentioned on the strong domain (performance page says only "chips, tuners, programmers"; no Texas Speed, no LS/Hemi, no cam installs, no Player 3 link found in main content).

## 3.3 Blog

**23 pages ≈ 115 posts** — by far the deepest archive — BUT every sampled post across page 1 and page 2 carries the identical date **November 5, 2025** (CMS migration re-stamp). Titles are properly localized ("Rear Differential Problems? What Edmonton Drivers Should Know," "What is a Catalytic Converter and Why is Theft on the Rise in Edmonton?") with benefit-driven phrasing. Categories: Seasonal Tips, Tires, Mufflers, Exhausts, Vehicle Maintenance, Performance Upgrades, Belts, Batteries. Topics are 90% *maintenance* — performance content is thin. No visible fresh posts since the re-stamp → the archive is an asset in decay: date-less freshness signals, no 2026 content observed.

## 3.4 Schema & local SEO

Best schema of the three: `WebSite` + `WebPage` + `Organization` with nested **`LocalBusiness`** including full `PostalAddress` (101 Seneca Rd, Sherwood Park, AB, T8A 4G6, CA). Still generic `LocalBusiness` rather than `AutoRepair`, and no visible `aggregateRating` markup in the sampled block despite 1,800+ reviews (leaving rich-result stars unclaimed). Live Google review widget on-site, trust badges (BBB, Chamber, Three Best Rated), Facebook/Google/Yelp links. Geographic copy targets Edmonton, Sherwood Park, Fort Saskatchewan, and even Fort McMurray/Northern Alberta on the performance page.

## 3.5 Site quality

WordPress with **WPBakery + Slider Revolution 5.4 + LayerSlider** — a 2018-era page-builder stack kept alive by WP Rocket caching. Homepage HTML is a lean 288 KB (best of the three) but the design *looks* its age: slider hero, dense nav, utilitarian. Mobile responsive but dated. Player3.ca and parkperformance.ca are visibly worse (GoDaddy builder / old sliders).

## 3.6 Weaknesses inventory

1. **Brand ceiling:** the name says muffler-radiator-brakes-tires. Enthusiasts don't think "1000-hp LS build" when they read it — and the main site actively hides that capability.
2. Performance authority scattered across 3 domains; the tuning story (Player 3, Texas Speed, custom cams) sits on a GoDaddy site with "Photo Gallery" as its H1. Link equity split three ways.
3. Blog: huge but re-dated, maintenance-skewed, apparently unmaintained — zero 2026 velocity observed.
4. No pricing anywhere; no online booking beyond a form.
5. No import/Euro/JDM performance story at all — domestic V8 + diesel only.
6. DPF/EGR delete marketing is a compliance exposure (federal tampering enforcement climate) and a page 2240 should NOT copy — but it shows the demand.
7. No dyno mentioned anywhere in the group — tuning without a chassis dyno story.
8. Sherwood Park address = weaker proximity signal for Edmonton-proper map-pack queries; they compensate with "Edmonton" title spam but can't win the pack inside the city.
9. Aging tech stack; typo in the homepage meta description shipped for years.

## 3.7 Verdict — Park Muffler group

**Likely ranks for:** "custom exhaust Edmonton" (confirmed page 1), "muffler shop Sherwood Park," "auto repair Sherwood Park" (H1 + review mass + 40-year citations), DPF/EGR delete queries, lift kits, catalytic converter repair/theft, plus broad maintenance long-tail from ~115 localized posts. The 1,900-review GBP makes them near-unmovable in *Sherwood Park* map results.

**Left on the table:** the entire enthusiast/performance identity. Their tuning division is invisible to Google; import performance doesn't exist; the blog is a decaying archive; rich-result stars unclaimed; no dyno narrative.

**How 2240 beats them:** Concede "auto repair Sherwood Park" — irrelevant. Take "custom exhaust **Edmonton**" with a dedicated, portfolio-backed, schema'd page from an Edmonton address (proximity beats their keyword-stuffed titles inside city limits). Take every tuning query they fumbled by burying Player 3: "LS tuning Edmonton," "Texas Speed dealer Alberta"-adjacent terms, "custom cam install Edmonton," "ECM calibration Edmonton." Publish fresh, dated 2026 performance content against their frozen archive. Match their review-widget play from day one (embed GBP reviews + aggregateRating markup) and out-modernize a 2018 page-builder site with a fast rebuild.

---

# 4. Cross-Cutting Findings & the 2240 Opening

## 4.1 SERP reality check (sampled Aug 2026)

- **"speed shop Edmonton / performance parts":** YellowPages, Promax Performance, JBs (via DieselVille citation + own site), Dix Performance North, SSS, Park Muffler's performance page, Big West Performance. 2240speedshop.com did **not** surface — despite having "Speed Shop" in the exact-match domain.
- **"dyno tuning Edmonton":** a Wix one-pager ("Dyno Tuning Edmonton" EMD-style site), MHPD (diesel/semi), Cody's (motorcycles, Facebook page), SSS `/dyno-tuning`, Yelp roll-up, Horsepower Solutions (Mainline ProHub, est. 2008), Big Rig Power (diesel). **The gas/street-car dyno SERP is a patchwork of niche players and thin sites — highly winnable.**
- **"ECU tuning Edmonton":** fragmented by vertical — Superior Performance (diesel deletes), CRC (Euro), Autobahn/Eurotekk (German cars), BMW-remapping microsites, Big Rig (diesel), Park Muffler. **Nobody owns the generic + multi-platform tuning position.**
- **"custom exhaust Edmonton":** Tichi (a 2024 blog post ranking!), Thrifty, Advanced Auto, Park Muffler, ABC Muffler, Alta Custom Exhaust. Old-school shops with old-school sites — a blog post is outranking established shops, proving content wins here.
- Secondary competitor set worth tracking in teardown part 2: Promax Performance, Dix Performance North, Horsepower Solutions, Big West/DA Performance, Alta Custom Exhaust, Eurotekk, Autobahn, Superior Performance & Tuning.

## 4.2 Nobody in the market has:

1. **Service pricing transparency** — zero shops publish even "from $X" (massive differentiator + "dyno tuning cost Edmonton" query capture).
2. **Online booking** — best-in-market is SSS's Shopmonkey quote form; the rest are phone-only.
3. **`AutoRepair` schema with `aggregateRating`** — rich-result stars are unclaimed across the entire competitive set.
4. **A living, localized performance blog** — SSS: dead (7 posts). JBs: product-promo. Park: frozen archive. 50 fresh Edmonton-targeted performance posts would face effectively no direct content competition.
5. **Multi-platform positioning** — the market is balkanized: JDM (SSS), diesel/domestic parts (JBs), domestic V8/diesel (Park), Euro (Eurotekk/Autobahn). A shop credibly serving JDM + Euro + domestic performance has no incumbent.
6. **A modern fast site** — the three tier-leaders run bloated Squarespace (1.6 MB), heavy Shopify (730 KB), and 2018 WPBakery WordPress respectively. Core Web Vitals is an open scoring lane.
7. **FAQ/answer-engine content** — only Park has embryonic FAQ H3s. PAA boxes, featured snippets, and AI-search answers for Edmonton performance queries are up for grabs.

## 4.3 Threat ranking for 2240

1. **SSS Motorsports** — same tier, same customer, real dyno, decent titles, strong socials. Beatable on content depth, reviews-on-site, speed, and breadth beyond JDM. Watch their title-tag discipline; if they ever add real copy, the window narrows.
2. **Park Muffler** — review mass + service-silo architecture makes them durable, but they're aimed at repair customers, not builders; their performance story is self-sabotaged across three domains.
3. **JBs** — unbeatable on parts retail, irrelevant on service SERPs. Treat as a channel/partner-shaped object, not a target: "we install what they sell."

## 4.4 Keyword lanes 2240 can take first (lowest resistance → highest value)

| Lane | Current holder | Resistance |
|---|---|---|
| "out of province inspection Edmonton" (enthusiast angle) | SSS (1 blog post) | Very low |
| "dyno tuning Edmonton" (street/gas) | SSS thin page + Wix microsite | Low |
| "standalone ECU tuning / Haltech Edmonton" | Nobody (SSS mentions brands, no page) | Very low |
| "custom exhaust Edmonton" (performance angle) | Park (repair angle), old shops | Medium |
| "engine build / engine builder Edmonton" | Promax (dated site) | Low-medium |
| "turbo install Edmonton," "supercharger install Edmonton" | Nobody with a dedicated page | Very low |
| "LS swap / engine swap Edmonton" | Park (repair-framed page), SSS (a phrase) | Low |
| "car tuning shop Edmonton" (generic) | Park's H1 claim, fragmented | Medium |
| "speed shop Edmonton" | JBs (60-yr heritage) | High — long game; EMD + service angle differentiates |

---

## Appendix: Raw technical observations

- **Homepage HTML payloads (fetched Aug 2, 2026):** sssmotorsports.ca 1,577 KB · jbspowercentre.com 730 KB · parkmuffler.com 288 KB · player3.ca 172 KB · parkperformance.ca 87 KB · 2240speedshop.com 148 KB.
- **Platforms:** SSS = Squarespace (images.squarespace-cdn.com) · JBs = Shopify (cdn/shop, myshopify refs) · Park Muffler = WordPress + WPBakery + Slider Revolution 5.4.6.3.1 + WP Rocket 3.23.1 · Park Performance = WordPress + LayerSlider 6.6.7 · Player 3 = GoDaddy Website Builder 8 · **2240 current site = GoDaddy Website Builder 8** (title: "Automotive Performance Enhancements at 2240 Speed Shop"; H1: "Rev Up Your Performance" — no Edmonton keyword anywhere in title/H1/desc, same weak builder as Player 3; the rebuild is justified on tech grounds alone).
- **SSS JSON-LD (verbatim excerpts):** `{"@type":"LocalBusiness","address":"9831 63 Avenue Northwest\nEdmonton, AB, T6E 0G7\nCanada","openingHours":"",...}` — empty hours; `Organization` lists IG/FB/YouTube/TikTok.
- **JBs JSON-LD:** `Organization` with empty strings inside `sameAs` array; `WebSite` + `SearchAction`. No local schema.
- **Park JSON-LD:** `Organization` → `location: [{"@type":"LocalBusiness","@id":"...#loc-0","name":"Park Muffler","address":{"@type":"PostalAddress","streetAddress":"101 Seneca Rd","addressLocality":"Sherwood Park","addressRegion":"AB","postalCode":"T8A 4G6","addressCountry":"CA"}}]`.
- **Redirect check:** sssjdm.com → 301 → sssmotorsports.ca (clean consolidation).
- **Review sources:** SSS 4.6/105 (Google, via Yably/BeepForService); JBs Birdeye 746 @ ~4.0 + 296 @ 3.9 + 174 @ 4.8, on-site widget "from 319 reviews"; Park 4.7–4.8 across Google (~1,818 shown on-site, ~1,939 cited), Yelp 32, BBB five-star, Three Best Rated.
