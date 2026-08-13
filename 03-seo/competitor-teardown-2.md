# Competitor SEO Teardown #2 — The Iron Garage / Promax Performance / CCMR Performance

**Project:** 2240 Speed Shop website rebuild (Edmonton, AB)
**Prepared:** August 2, 2026
**Method:** Direct fetches of live pages (homepage, services, dyno, products, about, contact, reviews, booking), raw HTML head/source inspection (titles, metas, schema, tech stack), robots.txt + sitemap probes, Wayback Machine CDX forensics (Promax), and review/SERP sampling via web search.
**Caveats:** SERP samples ran through a US search endpoint — Google.ca local-pack results in Edmonton will differ (local pack is where Promax reportedly ranks "near top" for "performance shop Edmonton"). Promax's live site was unreachable from every modern client we tried during the audit window (details below); Promax content analysis is from Wayback captures (2015–2022), which match what Google currently indexes (same URLs, e.g. `Performance_Engines.html`).

---

## Executive summary

| | The Iron Garage | Promax Performance | CCMR Performance |
|---|---|---|---|
| **Location** | 83 Boulder Blvd., Stony Plain, AB | 9616 51 Ave NW, Edmonton, AB | 65 Alberta Avenue, Spruce Grove, AB |
| **Phone** | (780) 963-7120 | (780) 465-0770 | 780-616-6110 |
| **Positioning** | Custom classic hot rod/muscle builds + "Iron Edition" late-model packages + Dynojet 424xLC2 | CNC engine machining, street/race/marine engine builds, parts outlet | Dyno tuning specialists (carb + EFI), domestic gas V8, supercharger/turbo installs |
| **Tech stack** | Hand-rolled static/templated site, jQuery 1.12 (2016), Font Awesome 4.5, IE8/9 conditional CSS | Dreamweaver static .html, Adobe Edge fonts, dead Universal Analytics tag, IIS | WordPress 7.0.2 + Elementor 4.2.1, OceanWP-family theme |
| **Meta description** | Present but with "performace" typo (x2 sitewide) | Present, decent | **Missing entirely on homepage** |
| **Schema markup** | **None** (zero JSON-LD, zero microdata) | **None** | Theme microdata only (WPHeader/Brand/SiteNavigationElement) — **no LocalBusiness/AutoRepair** |
| **robots.txt / sitemap** | **Neither exists (404)** | Unverifiable (site down); none in archives | robots.txt with `crawl-delay: 60`; sitemap.xml **points to a dead legacy domain** |
| **Blog** | None | None | None (despite WordPress) |
| **Pricing transparency** | Yes — full dyno rate card | None | None |
| **Google reviews** | ~4.5★ / 32 (Birdeye mirror: 4.5/34) | 4.6★ / 25 (aggregate 4.62/52) | Facebook 92% / 19; mixed reputation on forums |
| **Local SEO signals** | Address only on Contact page; no map embed found on home; no GBP link; no social links on site | Address/phone in footer + contact page; nothing else | Footer NAP + embedded Google Map; no GBP link; no review widget |
| **Site status** | Live, dated but functional | **Effectively broken** (TLS drops; HTTP serves default IIS page) | Live; content last touched ~2022 |

**Headline finding: none of the three has a blog, none has LocalBusiness schema, none links its Google Business Profile, none has an "Edmonton" landing page — and two of the three are physically outside Edmonton (Stony Plain, Spruce Grove). 2240 Speed Shop is inside Edmonton city limits with an active Instagram. The entire local informational SERP for this niche is unclaimed.**

---

## 1. The Iron Garage — theirongarage.com

### 1.1 Identity
- Custom classic hot rod and muscle car builds; own-brand "Iron Edition" staged performance packages for late-model Challenger/Mustang/Camaro/Corvette; parts retail; service; Dynojet 424xLC2 dyno. AMVIC licensed.
- 10,000 sq ft facility + 800 sq ft retail space. Team: Bart VanRootselaar (Shop/Build Manager), Jordan VanRootselaar (Parts & Service), Dennis Ferland (Paint & Body).
- Located in Stony Plain (~35 km west of downtown Edmonton), fax number still published.

### 1.2 On-page SEO (verbatim)
- **Homepage title:** `The Iron Garage Performance Shop` — no geo modifier at all. Not "Edmonton," not "Stony Plain," not "Alberta."
- **Homepage meta description:** "The Iron Garage specialize in custom built classic hot rods, muscle cars, and their own line of Iron Edition **performace** packages. They also offer service and repair work… large selection of performance parts and accessories for classic and late model vehicles." — misspelled "performace," written in third person, no location, no CTA. The same typo appears in the on-page H2.
- **Other titles:** `Our Services - The Iron Garage` · `Dyno Services - The Iron Garage` · `Our Products & Performance Parts - The Iron Garage` · `The Iron Edition - The Iron Garage` — brand-first, keyword-light, zero geo.
- **Heading structure is broken:** multiple H1s per page (homepage has 3+ H1s: "Welcome to The Iron Garage," "Custom Dyno Tuning Services," "Past Muscle Car Inventory," plus every inventory card title is wrapped in an H1). H2 tags are used for paragraph body copy ("leadin" class). Decorative `headlineNumber`/`headlineVerbiage` spans split heading text.
- `<meta name="robots" content="index,follow">` present; **no canonical tags, no Open Graph, no Twitter cards.**
- Viewport uses `maximum-scale=1.0` — blocks pinch-zoom (accessibility + Lighthouse penalty).

### 1.3 Site architecture
`/` · `/about` · `/products` · `/services` · `/services/dyno` · `/ironEdition` · `/projects` (+ per-build pages, e.g. `/projects/view/1970-chevelle-ss`) · `/forSale` (past inventory with per-car pages) · `/shopShots` · `/contact`. Clean URLs, camelCase inconsistency (`/ironEdition`, `/forSale`).

### 1.4 Services & pricing
Custom builds ('69 Camaros, '67 Mustang Fastbacks, '32 Fords, licensed reproduction bodies, modern drivetrain/suspension/brakes); service and repair (powertrain/trans swaps, fabricated rear-ends, custom exhaust, brakes, suspension, electrical, AC, welding/fab, software tuning, **nitrous refill station**); Iron Edition Stages 1–4 (cold air intake + catback + Stage 1 tune → headers/custom dyno tune → supercharger + suspension + wheels + badge → cam/ported heads/forged assemblies); parts retail (GM Performance, ATK, Blueprint crate engines, Tremec, Vortech, Procharger, Edelbrock, Ridetech, Kooks, Dynacorn, OER, Scott Drake, Fuse Race Fuels + ~300-brand access claim); merch line.

**Dyno rate card is public — best pricing transparency of the three:**
- 2WD pulls $200 · AWD/4WD pulls $300 (3 pulls, up to 1 hr)
- Carburetor dyno tuning from $200
- GM/Dodge/Ford ECM tuning from $800 + licensing
- Standalone tuning $200/hr · extra dyno time $125/hr · daily/group rates
- Dyno specs marketed well: Dynojet 424xLC2 Linx, dual 24" linked drums, eddy-current load, 2,000 HP capacity, 98"–140" wheelbase, 2WD/AWD.

### 1.5 Blog / content
**No blog.** The `/projects` build pages are the raw material of a content program (1969 Camaro RS Convertible, 1970 Chevelle SS, 1981 "LS Bandit" Trans Am) but are photo galleries, not narrative build logs — near-zero crawlable text, no keywords, no dates.

### 1.6 Schema & local SEO
- **Zero structured data.** No LocalBusiness, no AutoRepair, no Product, no Vehicle, no FAQ, no Review schema.
- **No robots.txt, no XML sitemap** (both 404). Google is crawling this site blind.
- NAP appears only on `/contact`. No embedded map iframe on the homepage (contact page has a JS `map-canvas`). No GBP link, no reviews shown anywhere on the site, no social icons — despite active Instagram (@theirongarage) and Facebook pages.
- YouTube channel exists and is embedded (dyno videos) — their one modern content asset.

### 1.7 Site quality / tech
- Hand-built (Dreamweaver-lineage markup, "DH" author comments), jQuery 1.12.0 (2016), Font Awesome 4.5 (2015), IE8/IE9 conditional stylesheets still shipping in 2026, instafeed.js (Instagram feed lib), custom `site.editable.js` mini-CMS. Umami analytics (recent, privacy-friendly — someone still touches this site).
- Design era: ~2015–2016. Responsive after a fashion (hamburger nav) but fixed-scale viewport, heavy imagery, no lazy-loading beyond a class name, no modern image formats.
- Copyright 2026 — maintained, not rebuilt.

### 1.8 Reviews & social
Google ~4.5★/32; Birdeye mirror 4.5★/34; Nicelocal 4.4★/23. Positive reputation, modest volume. Instagram + Facebook active but not linked from the website.

### 1.9 Weaknesses
1. No geo keyword anywhere in any title/meta — invisible for "Edmonton" queries except via GBP proximity (and they're in Stony Plain, outside the core).
2. Typo in the sitewide meta description and homepage H2 ("performace").
3. No schema, no sitemap, no robots.txt, no OG tags, no canonicals.
4. Chaotic heading hierarchy (multiple H1s, H2 body copy).
5. No blog; build pages are text deserts.
6. No reviews, GBP link, or social proof on-site.
7. No online booking, no quote form — phone/email only.
8. 2016-era front-end will lose Core Web Vitals to any modern build.
9. Merch and crate-engine lines have no ecommerce.

### 1.10 Verdict
**Likely ranks for:** brand ("Iron Garage"), "Iron Edition," hot-rod/classic-build queries where the field is thin (it surfaced in our "hot rod shop Edmonton muscle car restoration" sample), Stony Plain local pack, and dyno queries via GBP + the 424xLC2's uniqueness.
**Left on the table:** every "Edmonton" modifier; all informational content (restomod cost, LS swap, staged-package education); structured data; reviews; booking; ecommerce for parts/merch.
**How 2240 beats them:** an Edmonton-city address + geo-loaded titles wins the metro map-pack and organic geo queries they can't touch from Stony Plain; publish narrative build logs (their Projects section proves demand, then abandons the SEO); match their dyno-pricing transparency and exceed it with online booking; ship LocalBusiness/Service/FAQ schema and review widgets on day one; out-modern them on Core Web Vitals with a current-stack site. Their model (staged proprietary packages à la "Iron Edition") is worth copying with a 2240-branded package line — it's their smartest marketing asset and it's locked in a 2016 website.

---

## 2. Promax Performance — promaxperformance.com

### 2.1 Identity
- Speed/performance shop ~3 km from 2240. Street, race, and marine performance engines; in-house CNC machining (Rottler F68A machining centre, Rottler HP6A hone); retail discount parts outlet ("over 300 manufacturers"); EFI install/setup/service (FAST, Holley, Accel); installs and full mechanical work.
- Principals per site: Marty Cochrane (ex-Dana Corporation; ran one of only 4 PER production-engine-rebuilder facilities in Canada) and Gene Kucera (35+ years performance industry). "Over 40 years of experience… licensed Interprovincial Red Seal Certified Technicians." Copyright "©1029974 AB Ltd."
- Google 4.6★/25 (aggregate across platforms ~4.62/52). Solid word-of-mouth reputation, per review themes: diagnosis of complex mechanical issues, engine builds, competitive pricing.

### 2.2 CRITICAL FINDING — the website is effectively dead
Verified during this audit (Aug 2, 2026):
- **HTTPS:** TLS handshake dropped ("Socket is closed" / EOF) from multiple independent clients and TLS versions. No modern browser-crawler pairing that behaves like ours can load it.
- **HTTP:** returns the **default "IIS Windows Server" placeholder page** at the root (the blue IIS logo page), 404 on real pages.
- **Wayback confirms decay:** the March 16, 2026 Common Crawl capture is the IIS default page. The last full-content homepage capture is **August 17, 2022**. Every 2023–2025 capture is sub-1KB (broken). Content pages were last meaningfully captured 2015 (`Services.html`, `Performance_Engines.html`, `Parts_and_Accessories.html`) and 2019 (`EFI FAST.html`, `Employment.html`).
- An exposed `ftp.promaxperformance.com` subdomain was also archived (2023) — sloppy server hygiene.
- Google still indexes the old URLs and serves cached snippets, and the business still appears in directory/best-of listicles — meaning **their residual rankings run on ~20 years of domain age and citations, not on a working website.** Any searcher who clicks through hits a handshake error or an IIS page. This is a total conversion black hole.

### 2.3 On-page SEO (from archived site = what Google has indexed)
- **Homepage title:** `Promax Performance` — brand only, no keywords, no geo.
- **Homepage meta description:** "High Performance Engines for street or strip, Performance Parts and Accessories, CNC engine machining, installations and service" — decent keyword coverage for its era.
- **Page set:** `default.html` (Home) · `Performance_Engines.html` ("High Performance Engines for street or strip. We build all makes using modern CNC engine machining equipment…") · `Parts_and_Accessories.html` · `Pontiac_Products.html` · `Fuel_Injection.html` · `Services.html` ("We can service your Muscle Car, Hot Rod or Race Car. Installations and Custom Work. Electrical, Engine, Trans, Brakes, Suspension, Exhaust and More.") · `Gallery.html` · `Contact_Us.html`. Space-containing filenames elsewhere (`EFI FAST.html`, `Sale and Clearance.html`) produce %20 URLs.
- **Heading structure:** no H1 anywhere we inspected — pages start at `<h3>` ("Our Performance Engines," "Machine Shop Services Offered," "we also offer" in lowercase). Nav labels inconsistently cased ("services," "Pontiac products").
- **No schema, no OG, no canonicals.** Google Analytics tag is Universal Analytics (`UA-56564149-1`) — UA was switched off in July 2024, so they have collected **zero analytics for 2+ years** even when the site worked.

### 2.4 Services (deepest machining menu of the three — from Services.html)
Engine balancing; align boring mains / 4-bolt cap conversion; bore & hone; blueprint bore; blueprint/parallel decking; CNC stroker clearancing; torque-plate honing; cylinder-wall brushing; upper/lower cylinder chamfer; rod work; head work (valve jobs, guides/seats, surfacing, spring setup); engine assembly; crank grinding & polishing; cleaning/glass beading; crack detection (mag particle, pressure testing); engine run-up/test stand. Plus: engine R&R, trans/converter R&R, differential overhaul, chassis/suspension, disc conversions, custom exhaust, wiring, EFI (FAST/Holley/Accel). Crate-engine counter-positioning copy ("not a generic cookie cutter special") with named-expert quotes — genuinely good sales copy, marooned on a dead site.
**Pricing:** none published, anywhere, ever.

### 2.5 Blog, local SEO, social
No blog (a 2003-era "News and Views" page died decades ago). No map embed, no GBP link, no review display, **no social media links at all** — no Instagram or Facebook presence surfaced in searches. `mailto:mail@promaxperformance.com`.

### 2.6 Verdict
**Likely ranks for:** "Promax Performance" brand, residual placement in "engine machine shop / engine builder Edmonton" organic and local pack (it appeared in our engine-builder SERP sample even now), directory-driven visibility (Yelp, YellowPages, best-of lists).
**Left on the table:** literally everything — the business is running on reputation and a phone number. Every click from their residual rankings is lost. No EFI/dyno-era content depth (their EFI page ends at FAST/Holley/Accel carb-replacement systems; nothing on modern OEM ECM tuning). No marine-engine content despite offering marine builds ("marine performance engine Edmonton" = uncontested). No machining-service landing pages despite the deepest machining menu in the metro.
**How 2240 beats them:** immediately — a working website outranks a dead one on every quality signal Google has; target their money terms ("performance engine builder Edmonton," "engine machining Edmonton," "stroker engine build," "crate engine Edmonton," "marine performance engine") with real service pages while their domain decays; capture their orphaned clickstream (searchers who click Promax and bounce off an IIS error will search again — be the next result); publish the pricing they never did. Watch for: if they ever fix hosting or launch a rebuild, their domain age + citation profile makes them dangerous again; also watch whether their machining niche gets scooped by TBS Engines (which publishes shop pricing) before 2240 can.

---

## 3. CCMR Performance — ccmrmobiledyno.com

### 3.1 Identity
- Spruce Grove (15 min west of Edmonton) dyno-tuning specialist. Owners: Chris and Kari Leslie. Hours Tue–Fri 7–6, closed weekends. "YOUR DOMESTIC GAS V8 SPECIALISTS!"
- **Two mobile Dynojet 224x dynos** — the "mobile dyno" angle (dyno days at shows/club events across Alberta) is unique in the market and baked into the domain name.
- Tuning software breadth is their moat: HP Tuners, DiabloSport, SCT, Holley, Big Stuff, EFI Live — carbureted classics AND modern muscle. Squarely overlaps 2240's vintage/muscle clientele.
- Dealer for Whipple, Kenne Bell ("Kennebell"), ProCharger, Garrett, Precision, Comp.

### 3.2 On-page SEO
- **Homepage title:** `CCMR Performance – Custom Dyno Tuning Full Service Performance Shop` — best keyword-loaded title of the three, still no geo term.
- **Meta description: MISSING on the homepage.** Google composes its own snippet.
- **H structure:** multiple H1s ("Full Service Muscle Car Performance & Custom Build Facility" + "YOUR DOMESTIC GAS V8 SPECIALISTS!"); H2s: "WE ARE DYNO TUNING EXPERTS," "High Performance Tuning Shop," "**Edmonton & Area Vehicle Performance**" (their only geo heading), "Ask About Our Modern Muscle Car Dyno Power Upgrade Packages!"
- Canonical tag present (WordPress default). **Zero JSON-LD**; only theme microdata (WPHeader/Brand/SiteNavigationElement) — no LocalBusiness/AutoRepair/Review schema despite a whole reviews page.

### 3.3 Technical / crawl findings (all verified)
- WordPress 7.0.2 + Elementor 4.2.1 (software kept updated — but content is frozen; the newest content-dated asset is a stylesheet named `styleSite-2025-01-27` equivalent… actually CSS `2025-01-27` shows maintenance touches, while sitemap lastmods stop in **March 2022**).
- **robots.txt sets `crawl-delay: 60`** — asks crawlers to wait 60s between requests. Pointless for Google (ignores it) but throttles Bing and others on an 11-page site.
- **sitemap.xml is rotted:** every URL in it points to `ccmrperformance.ca` — a legacy domain that now returns **404 with no redirect**. So (a) their sitemap gives Google a list of dead URLs on the wrong domain, and (b) any backlinks pointing at ccmrperformance.ca are evaporating un-301'd. The sitemap also exposes junk (`?elementor_library=` templates, orphan page `/1174-2/`).
- WordPress attack surface exposed: `xmlrpc.php`, `wp-json` user/pages endpoints publicly listed.

### 3.4 Services & pricing
Custom dyno tuning (carb & EFI, with transmission & drivability); supercharger/turbo/nitrous installation; complete engine/trans/driveline builds & modern engine swaps; parts supply & build consultation; design/fabrication (headers, chassis, cages); TIG welding (aluminum/stainless); wheel & tire sales; suspension upgrades; electrical & diagnostics; tune-up & maintenance. Remote "E-Tune" service with a proper booking form (name/email/phone/device brand/model/serial) — the only online booking flow among the three.
**Pricing:** none published. (A forum complaint cites "$1,100+ for a dyno tune" — pricing opacity feeds that resentment.)

### 3.5 Blog / content
**None — despite running WordPress**, the platform built for blogging. Two vehicle-for-sale posts (1986 Chevrolet, 1975 C20) in the legacy sitemap were the closest thing to posts, dated 2022, on the dead domain.

### 3.6 Local SEO & reviews
- Footer NAP (65 Alberta Avenue, Spruce Grove AB T7X 3A7) + embedded Google Map (zoom 9) — best on-site local signals of the three, but no GBP profile link and no review widget.
- `/5-star-reviews/` page: 22+ testimonials **manually pasted as text**, no source attribution, no schema, page last modified 2020. Feels curated, not verified — a trust liability rather than an asset in 2026.
- Facebook 92% recommend (19 reviews). **Reputation is genuinely mixed off-site:** LX Forums threads ("CCMR vs Inertia email," modern-truck tune complaints — "3 trucks… screwed up on all three," defensive responses) sit in searchable positions. Their curated "5 Star" page vs. visible forum criticism is an exploitable credibility gap.
- Social: Twitter, Facebook, Instagram (@ccmr__performance), YouTube — linked sitewide (only competitor that does this).

### 3.7 Weaknesses
1. No meta description on the homepage; no geo term in any title.
2. Sitemap points at a dead domain; legacy-domain backlinks lost (404, no 301).
3. `crawl-delay: 60` throttling non-Google crawlers.
4. No schema at all despite reviews, services, events, and products to mark up.
5. No blog on a WordPress install; content frozen since ~2022.
6. Zero pricing; "5 Star Reviews" framing contradicted by visible forum disputes.
7. Closed weekends — a scheduling gap 2240 can exploit for enthusiast customers.
8. Elementor page weight (70KB+ HTML before assets, render-blocking builder CSS/JS) = mediocre Core Web Vitals.
9. Mobile-dyno differentiator is underexploited: no events calendar, no "book a dyno day" page, no city pages for the Alberta towns they visit.

### 3.8 Verdict
**Likely ranks for:** "CCMR," "mobile dyno Alberta/Edmonton" (exact-match domain), "dyno tuning Spruce Grove," domestic-V8/Mopar tuning queries via community reputation, plus Spruce Grove/Parkland local pack.
**Left on the table:** all Edmonton-city geo terms; all educational tuning content (what is dyno tuning, carb vs EFI tuning, HP Tuners vs DiabloSport, supercharger vs turbo — they are the local authority and have written nothing); event/mobile-dyno SEO; verified review schema; every keyword behind their booking form (e-tune landing pages per device platform).
**How 2240 beats them:** own "dyno tuning Edmonton" from inside Edmonton with a real content cluster (they only gesture at "Edmonton & Area" in one H2); publish transparent tuning pricing next to authentic embedded Google reviews — directly counter-programming their curated-testimonial page and mixed forum reputation; open Saturdays and say so in the GBP; if 2240 has or adds dyno capability, target per-platform pages (HP Tuners tuning Edmonton, Holley EFI tuning, carburetor dyno tuning for classics) that CCMR's frozen 11-page site can never answer.

---

## 4. Cross-competitor keyword map

### Keywords they collectively target (fight zones)
| Keyword theme | Iron Garage | Promax | CCMR |
|---|---|---|---|
| dyno tuning / dyno pulls | strong (424xLC2 pages + pricing) | no | strong (title + domain) |
| custom hot rod / muscle car builds | strong | weak (copy only) | moderate |
| performance engine building / machining | weak | strong (indexed but dead) | moderate |
| performance parts retail | moderate | strong (dead) | weak (inquiry only) |
| supercharger/turbo installs | moderate (Iron Edition) | no | strong |
| EFI / ECM tuning software brands | moderate | weak (FAST/Holley only) | strong |

### Keywords NOBODY targets (open field for 2240's 50-blog plan)
- Every "**Edmonton**"-modified commercial term in titles/H1s ("performance shop Edmonton," "dyno tuning Edmonton," "muscle car restoration Edmonton," "classic car repair Edmonton," "engine builder Edmonton") — zero of the three put a geo term in a title tag.
- All informational/educational queries: what does dyno tuning cost, carbureted vs EFI conversion, LS swap guide, restomod vs restoration, cam selection, supercharger vs turbo for street cars, winter storage/spring startup for classics, ethanol fuel in classic engines, break-in procedure for fresh engines.
- "Marine performance engine Edmonton" (Promax offers it, dead site), "race engine builder Alberta," "carburetor tuning Edmonton," "nitrous refill Edmonton" (Iron Garage offers it, never landing-paged), "mobile dyno event Alberta" (CCMR's own differentiator, unexploited), crate engine comparisons, Pontiac/Mopar specialty terms.
- Voice/AI-search phrasing and FAQ schema — none of the three has a single FAQ block.

### Adjacent Edmonton competitors observed in SERP samples (for the wider strategy doc)
SSS Motorsports (Dynocom AWD dyno, strong dyno-tuning page), Horsepower Solutions (est. 2008, Mainline ProHub), Unlimited Automotive & Performance, Park Performance (Sherwood Park), ProWest Motorsports (hot rod/drag), Wadson's Hot Rods (since 1979), South Sound Hot Rods (sshotrod.com — ranks via keyword-stuffed URL), TBS Engines (**publishes machine-shop pricing** — the only one), TRAC Engine Services, Autobahn (Euro), Ronin (Subaru), Cody's Dyno Tuning (motorcycle), MHPD/Big Rig Power (diesel).

---

## 5. The shared-weakness playbook (what the rebuild must ship)

1. **Geo-loaded titles/metas** on every page ("… | Edmonton Speed Shop") — instantly differentiated; no competitor does it.
2. **LocalBusiness + AutoRepair + Service + FAQPage + Review JSON-LD** — the entire competitive set has zero valid structured data.
3. **robots.txt + clean XML sitemap on day one** (Iron Garage has neither; CCMR's is toxic).
4. **Blog with build logs + educational clusters** — a 50-post plan enters a market where the three most relevant rivals have published zero articles in a combined ~50 years of operation.
5. **Transparent pricing pages** — only Iron Garage's dyno card exists; extend the concept to services 2240 offers (pricing transparency is also the antidote to CCMR-style reputation disputes).
6. **Embedded live Google reviews + GBP deep link** — nobody does it; CCMR's hand-pasted testimonials show why authenticity wins.
7. **Online booking/quote flow** — only CCMR has even a basic form.
8. **Modern Core Web Vitals build** — beating jQuery-1.12 static sites, a dead IIS box, and an Elementor stack is a low bar; make speed a visible brand feature.
9. **Social integration** — 2240's active Instagram/Threads embedded on-site beats Iron Garage (active socials, unlinked) and Promax (none).
10. **Weekend hours + response speed in GBP** if operationally true — CCMR closes weekends; enthusiasts wrench on weekends.

---

## Appendix — source URLs consulted
- https://www.theirongarage.com/ (+ /about, /services, /services/dyno, /ironEdition, /products, /contact, robots.txt 404, sitemap.xml 404)
- https://ccmrmobiledyno.com/ (+ /about-us/, /services/, /parts/, /5-star-reviews/, /request-a-tune/, /contact-us/, /robots.txt, /sitemap.xml) · legacy https://ccmrperformance.ca/ (404, no redirect)
- https://www.promaxperformance.com/ (live: TLS failure; HTTP: IIS default page) · Wayback captures: homepage 2022-08-17, default.html 2022-10-05, Services.html 2015-02-19, Performance_Engines.html 2015-02-19, Parts_and_Accessories.html 2015-02-19, EFI FAST.html 2019-10-17; CDX domain survey 2003–2026 (105 captures)
- Reviews/ratings: reviews.birdeye.com (Iron Garage 4.5/34), yably.ca, yelp.ca (all three), cylex-canada.ca (Promax 4.60/25 Google, 4.62/52 aggregate), facebook.com/CCMRPerformance (92%/19), lxforums.com threads (CCMR disputes; Iron Garage mention), bestinedmonton.com listicles
- SERP samples (US endpoint, Aug 2026): "performance shop Edmonton," "dyno tuning Edmonton," "engine machine shop Edmonton performance engine builder," "hot rod shop Edmonton muscle car restoration"
