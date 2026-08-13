# Competitor SEO Teardown — Edmonton Vintage/Performance Shops (Batch 3 of 3)

**Project:** 2240 Speed Shop website rebuild — SEO strategy input
**Competitors covered:** Sideshow Fabrication & Paint · Wadson's Hot Rods · Acceleration Auto & Performance
**Method:** Raw-HTML head/schema extraction (Invoke-WebRequest), full sitemap crawls, page-by-page content fetches, review-platform and SERP research
**Date compiled:** August 2, 2026

---

## Executive summary (read this first)

| | Sideshow Fab & Paint | Wadson's Hot Rods | Acceleration Auto & Performance |
|---|---|---|---|
| **URL** | sideshowpaint.com | wadsons.com | accelerationauto.ca |
| **Platform** | Wix | WordPress 6.x + Divi + Rank Math | ShoutCMS (Mediashaker) |
| **Homepage title tag** | "Sideshow Fabrication & Paint \| Custom Paint & Restoration" | "Welcome to Wadson's Hot Rods - Your Source for Classic & Muscle" (truncated mid-phrase) | **"Home"** (that's the whole title) |
| **Meta description** | Yes — keyword-rich, Edmonton-targeted | Yes — generic, no city name | **Empty string** |
| **H1 discipline** | Proper H1s + city-suffixed titles sitewide | **Zero H1 on homepage** (Divi slider outputs H2) | One decent H1, reused verbatim on Services page |
| **Schema** | Wix auto: LocalBusiness + WebSite (no reviews, no services, no geo/hours) | Rank Math: AutomotiveBusiness + WebSite (no address, wrong hours) | **None at all** |
| **Blog** | 2 posts, both Jan–Feb 2024, abandoned | None | None (two "test-article" stubs live in sitemap) |
| **Reviews** | 4.7★ / 45 (Birdeye-syndicated), BBB A+ | Near-invisible: no meaningful Google/Yelp footprint found; YellowPages 5/5 (tiny n), BBB profile exists | 4.6★ / ~66 Google, 4.68★ / 12 Facebook — thicker than expected |
| **Pricing transparency** | None | None | **Yes — Hellcat packages $3,795–$9,995 with parts lists** |
| **Site size** | ~16 content pages + merch | 9 pages total | ~60 URLs (half are used-parts listings) |
| **Design era** | Modern Wix (2022-ish), heavy (805 KB HTML) | 2023 Divi template, slider hero | ~2014 ShoutCMS, "Print This Page" link, fax number |
| **Biggest weakness** | Dead blog, no review schema, Wix weight | Whole digital presence is an afterthought | Zero on-page SEO whatsoever |

**One-line takeaway:** all three competitors combined publish effectively **zero fresh content** and hold **zero blog moat**. The 50-post content plan alone can out-publish the entire Edmonton vintage/performance niche. Sideshow wins on on-page basics, Wadson's wins on legacy reputation, Acceleration wins on capability + pricing transparency — nobody does all three, and nobody does content, review schema, service-area pages, or modern performance-optimized builds.

---

## 1. Sideshow Fabrication & Paint — sideshowpaint.com

**Position:** Downtown (Chinatown) family-run boutique hot rod/restoration shop, est. 2016. The strongest digital operator of the three and the shop currently ranking #1 for "hot rod shop Edmonton."

### 1.1 Head metadata (extracted from raw HTML)

- **Title:** `Sideshow Fabrication & Paint | Custom Paint & Restoration`
- **Meta description:** `Edmonton's choice hot rod and paint shop. Get started on your next restoration or finally get that dream custom paint job. Check us out!`
- **og:site_name:** `Sideshow Fab & Paint`
- **Generator:** `Wix.com Website Builder`
- Subpage titles follow a consistent, city-suffixed pattern — this is deliberate SEO work:
  - `Custom Paint | Sideshow Fabrication & Paint | Edmonton`
  - `BUILDS & RESTORATIONS | Sideshow Fabrication & Paint | Edmonton`
  - `WELDING & FABRICATION | Sideshow Fabrication & Paint | Edmonton`
  - `About Us | Restoration Hot Rod | Sideshow Fabrication & Paint | Edmonton`

### 1.2 Heading structure & keyword targeting

- Homepage H1: **"Restorations, Hotrods, Custom Paint and More."**
- Homepage H2s: "Located in downtown Edmonton, Sideshow Fabrication and Paint is your premier, boutique hot rod shop." / "We Offer:"
- Service-page H1s: "Custom Paint & Refinishing", "Builds & Restorations", "Welding & Fabrication"
- Explicit keyword targets: *hot rod shop Edmonton, restoration, custom paint, refinishing, welding, fabrication, resto mods, frame-off build*. About page title stuffs "Restoration Hot Rod."
- Notable copy-level keywords: pinstriping, lettering, leafing, metal flake, candy paint, waterborne paint system, **Cerakote** (ceramic coating — a differentiated service), MIG/TIG, stainless/carbon steel/aluminum/silicone bronze, engine swaps, exhaust fabrication, paint protective film, "one-stop shop," takes over **unfinished projects from other shops**.

### 1.3 Site inventory (from pages-sitemap.xml)

Core: `/` · `/custom-paint` · `/custom-builds-rebuilds` · `/fabrication` · `/projects` · `/about-us` · `/book-online` · `/trusted-partners` · `/blog` — plus a full merch store (`/shop`, `/tees`, `/hoodies`, `/sweatshirts`, `/accessories`, `/new-in`). All lastmod 2026-01-11 (bulk Wix re-render, not real updates).

### 1.4 Blog (the headline finding)

**Two posts. Ever. Both by Christa Spelten, both winter 2024, then silence for 2.5 years:**
1. "Finding the Restoration Shop for You: Tips for Selecting the Perfect Partner" — Feb 3, 2024, ~850 words, tagged *classic car restoration, project car restoration, choosing a hot rod shop, custom car*
2. "Choosing the Perfect Project Car" — Jan 2024, 3-min read, Alberta-rust angle

Quality is decent (practical, locally flavoured), which proves intent — they knew blogging mattered, started, and quit. The tags show exactly which keywords they *wanted*: those are now uncontested.

### 1.5 Schema & local SEO

- JSON-LD present (Wix auto): `WebSite` + `LocalBusiness` with name, image, full postal address (10977 98 St NW, T5H 2P7), phone (+17802364465).
- **Missing from schema:** no `AutoRepair`/`AutoBodyShop` subtype, no `geo`, no `openingHours`, no `aggregateRating`, no `Service`/`OfferCatalog`, no `sameAs` social links.
- Map embed on site; AMVIC-licensed badge in footer; one on-page testimonial ("~ Mark"); reviews live on Birdeye (4.7/45) and Facebook — **none surfaced with review schema**, so no stars in SERPs.
- No service-area/city pages (no Sherwood Park / St. Albert / Leduc / Alberta-wide pages).

### 1.6 Site quality / tech

- Wix build, modern look, consistent branding, functional online booking (Wix Bookings) — the only competitor with self-serve booking.
- **Heavy:** homepage HTML alone is ~805 KB before assets; Wix hydration JS on top. Core Web Vitals almost certainly mediocre (LCP/TBT). Mobile renders fine (Wix responsive) but slow on cellular.
- `/projects` page is thin: navigation and partner blurbs but no actual case-study content per build — gallery without storytelling. Their three flagship builds (Bricklin fiberglass resto, 1938 Dodge frame-up, 1971 Mustang "Nitro Militia" funny car) get one-line mentions instead of dedicated URLs.
- Legacy domain sideshowpaint.net appears in Google's index but **no longer resolves** (DNS dead) — stale index entries and any old backlinks to .net are being wasted.

### 1.7 Weaknesses

1. Blog abandoned after 2 posts — zero informational-intent coverage since Feb 2024.
2. No pricing signals of any kind ("how much does a restoration cost" queries unanswered).
3. No review/rating schema, no aggregateRating → no SERP stars despite 4.7/45.
4. No per-project build pages → misses long-tail ("Bricklin restoration", "1938 Dodge build") and image SEO.
5. No city/service-area pages; "Edmonton" only, nothing for the metro ring or rural Alberta car community.
6. Wix ceiling: heavy pages, limited technical control, no advanced internal linking.
7. Keywords ignored: *restomod* (they say "resto mods" once), *engine swap Edmonton*, *classic car appraisal/storage*, *car show prep*, *rust repair Edmonton*, *cerakote Edmonton* (they offer it but never built a page for it), *vintage truck restoration*.
8. Merch store dilutes crawl focus; product pages compete with service pages for authority.

### 1.8 Verdict

- **Likely ranks for:** hot rod shop Edmonton (#1), custom paint Edmonton, car restoration shop Edmonton, welding & fabrication Edmonton (brand + proximity + the only city-optimized titles in the niche).
- **Left on the table:** the entire informational funnel (they proved the intent then quit), SERP stars, restomod/engine-swap terms, per-build long-tail, Cerakote, metro-area geography.
- **How 2240 beats them:** out-publish (2 posts in 30 months is the bar); ship `AutoRepair` + `aggregateRating` + `Service` schema from day one; build a real project/build-log section with one URL per car; own *restomod*, *engine swap*, and *speed shop* language they don't use; win on speed (any modern static/Next build will demolish an 800 KB Wix page); add transparent pricing guidance content they refuse to publish.

---

## 2. Wadson's Hot Rods — wadsons.com

**Position:** The legacy name — street rod/classic/muscle fabrication since **1979**, west Edmonton (17354 108 Ave NW). Founder Wayne Wadson co-owned the Wheeler Dealer speed shop with Terry Capp; their top fuel dragster is in the Reynolds-Alberta Museum. Sons Cory & Noel run it now with third-generation Dakota. Deep word-of-mouth equity, near-zero digital execution.

### 2.1 Head metadata (extracted from raw HTML)

- **Title:** `Welcome to Wadson's Hot Rods - Your Source for Classic & Muscle` — wastes 11 chars on "Welcome to", then **truncates mid-phrase** ("...Classic & Muscle" *what?*). No "Edmonton" anywhere in it.
- **Meta description:** `Explore our portfolio of custom-built dream cars and learn about our passion for high-performance vehicles. Join our community of Hot Rod enthusiasts today.` — zero geo terms, zero service terms.
- **Canonical:** clean, `https://wadsons.com/`.
- **Stack:** WordPress + **Divi** theme + **Rank Math** SEO plugin (installed but barely configured).

### 2.2 Heading structure & keyword targeting

- **Homepage has NO H1 at all** (confirmed: zero `<h1>` in source). The hero is a Divi slider whose title — "Make your dreams a reality" — renders as an `<h2>` linking to the contact page. Other H2s: "Check out our merch!", "Our Location".
- Services page (`/what-we-do/`) H1: "Full custom builds from the ground up is what we are known for." — emotional, not keyword-bearing.
- Effective keyword targeting: essentially **brand-only**. The site targets "Wadson's" and nothing else.

### 2.3 Site inventory (page-sitemap.xml — the whole site is 9 URLs)

`/` (lastmod 2024-05) · `/team/` (**2026-07-21** — only recently touched page) · `/contact-us/` (2024-12) · `/merch/` (2024-03) · `/wadsons-history/` (2024-03) · `/what-we-do/` (2024-03) · `/portfolio/` (2023-12) · `/privacy-policy/` · `/about/` (2023-08). **No blog, no posts sitemap, no service detail pages.**

### 2.4 Services & content

- `/what-we-do/`: full custom ground-up builds, small repairs/parts replacement, paint, bodywork, metalwork, and **parts dealing for "almost every notable name in the industry"** (they are also Wadson's Hot Rod Parts Ltd — a parts counter competitor, contact email is parts@wadsons.com). No pricing, no process, no timeline info. One 1952 pickup case mention.
- `/portfolio/`: ~40+ vehicles (1932 Ford 3- and 5-window coupes, '34 Ford, '38 Ford, '46 Anglia gasser, '55 Austin "Bobby Orr" tribute, '67 Cougar, '72 Chevelle SS, Novas, Power Wagon…) — **~90% images / 10% text**, no per-car pages, no alt-text discipline, closing CTA literally sends visitors *off-site*: "check out our Facebook and Instagram."
- `/wadsons-history/`: genuinely great raw material (1960s fabrication roots, Wheeler Dealer, museum dragster, three generations) — buried on one page with no keyword framing.
- `/team/`: 6 people incl. two fabricators; recently updated (July 2026), so someone still tends the site occasionally.

### 2.5 Schema & local SEO

- Rank Math outputs `AutomotiveBusiness` + `WebSite` + `ImageObject` + `WebPage` @graph. **But:** no street address in schema, no geo, no phone, and `openingHours` claims **"Monday–Sunday 09:00–17:00"** while the site itself says **Mon–Fri 8:00–4:30** — conflicting NAP data fed straight to Google.
- Google Maps *link* (not rich embed) in footer; address inconsistency in the wild: site says 17354 108 Ave, Yelp/BBB say 17350 108 Ave.
- **Review desert:** no visible Google review mass surfaced, no testimonials on site, no review widgets. BBB lists "Wadson's Hot Rod Parts Ltd" (A+ region rating per directory listings); YellowPages 5/5 on a handful of reviews. For a 47-year-old shop, the online proof layer is astonishingly absent — the reputation lives entirely offline.

### 2.6 Site quality / tech

- 2023-era Divi template: slider hero, stock layout, ~215 KB HTML plus Divi's notoriously heavy CSS/JS. Mobile works but is template-generic. No booking, no forms beyond basic contact, merch store bolted on.
- Homepage effectively unchanged since May 2024.

### 2.7 Weaknesses

1. No H1, no geo-optimized title, no Edmonton in metadata — invisible for every non-brand query.
2. 9-page site; zero content marketing; zero informational coverage.
3. NAP/hours conflicts between schema, site, and directories — actively hurts local pack trust.
4. 40-car portfolio with no text = a massive long-tail asset earning nothing.
5. Sends traffic off-site to Meta platforms instead of capturing it.
6. The single best story in Edmonton hot-rodding (1979, Wheeler Dealer, museum dragster, 3 generations) is not leveraged for E-E-A-T, PR, or links.
7. Keywords ignored: literally all of them — *street rod builder Edmonton, muscle car restoration Edmonton, classic car repair Edmonton, hot rod parts Edmonton* (their actual parts business!), *chassis fabrication, metal shaping*.
8. No reviews strategy despite decades of happy customers.

### 2.8 Verdict

- **Likely ranks for:** "Wadson's" brand terms and residual map-pack visibility from age/citations; The Edmontonite listicle puts them #1 editorially, confirming offline reputation > online execution.
- **Left on the table:** everything. They rank on reputation and domain age alone; any query the customer phrases as a *service* rather than the brand name is up for grabs — including "hot rod parts Edmonton," an entire revenue line with zero landing page.
- **How 2240 beats them:** simply doing baseline on-page SEO wins every non-brand vintage query against them; publish the content their customers search for; capture the "heritage" positioning gap online — 2240 can *tell* Edmonton's hot-rod story (era-correct speed-shop brand voice) while Wadson's leaves theirs untold; aggressively build Google reviews, where their multi-decade head start counts for nothing.

---

## 3. Acceleration Auto & Performance — accelerationauto.ca

**Position:** North-central Edmonton (11650 120 St NW) performance/service facility — the restomod-drivetrain competitor. In-shop **Mustang dyno rated to 3,000 hp**, Hemi/LS swaps, fabrication, suspension, nitrous install + refills, gas **and diesel** tuning, financing. Formerly listed as "DKW Gas & Diesel Performance Inc" in directories.

### 3.1 Head metadata (extracted from raw HTML) — the worst of the three

- **Title:** `Home` — nothing else. Subpages: `Services`, `Performance`, `Packages`, `Media`. Not one title contains "Edmonton," a service term, or even the business name.
- **Meta description:** `content=""` (empty). **Meta keywords:** `content=""` (empty). The fields exist in the CMS; nobody ever filled them.
- **Generator:** `Shoutcms` (local Mediashaker product). **No JSON-LD schema anywhere on the site — zero structured data.**
- Sitemap contains `/test-article-01` and `/test-article-02` — test pages left live and indexed. Also a typo'd URL: `/finacing`.

### 3.2 Heading structure & keyword targeting

- Homepage H1: "Edmonton's Premier Automotive Service & Performance Facility." (decent!) — then **reused verbatim as the Services page H1** (duplicate H1 across pages).
- Performance page H1: "We Live and Breathe Performance"; H2s: "Uncover your Vehicles Hidden Performance", "Scale Your Vehicle", "Service Work Performed".
- Packages page: H1 "Hellcat Packages", price points marked up *as H2s* ("Starting at $3,795.00" is a heading).
- Effective keyword targeting: accidental at best. The body copy is keyword-rich (dyno, LS, Hemi, nitrous, supercharger, turbo, EFI/carb tuning, roll cages, tubs, race prep, diesel) but none of it is structurally surfaced to search engines.

### 3.3 Services & pricing (their genuine strength)

- Deepest capability list in this teardown: chassis dyno tuning (EFI **and carb**), heads/cam packages, ground-up restorations, engine rebuilds R&R, power adders (nitrous/supercharger/turbo fab + install), wiring harnesses, diff service, transmission rebuilds, suspension, cooling, custom exhaust/tubs/roll cages, race-car scaling, full race prep, gas + diesel maintenance.
- **Only competitor with published pricing:** Hellcat Stage 1 $3,795 (60–80 whp, with full parts list: Griptech 2.85 pulley, Gates belt, JLT separator, crank pin, PCM unlock, HP Tuners custom tune) / Stage 2 $5,995 (90–110) / Stage 3 $9,995 (120–140) / Stage 4 call. Financing offered (rare trust-builder).
- Classic-car project pages exist ('33 Ford, '55 Chevy pickup, '56 F100, '56 Bel Air, '63 gasser, '66 Corvette, '69 Camaro, '69 Firebird) plus modern muscle (Hellcat, ZL1, CTS-V, Viper) — proof they straddle vintage and modern, directly overlapping 2240's restomod drivetrain niche.
- ~20 used-parts listings (OEM driveshafts, rotors, McLeod twin-disc clutch, ROE supercharger manifold…) — an ad-hoc classifieds section with no e-commerce.

### 3.4 Schema & local SEO

- **No structured data at all.** No LocalBusiness, no Product/Offer markup on priced packages (free rich-result wins ignored), no reviews markup.
- No map embed found on homepage; NAP in footer text only; fax number still listed.
- Reviews: **4.6★ across ~66 Google reviews** (plus 4.68★/12 Facebook, ~4.61 aggregate on directories) — a real footprint, but zero of it surfaced on-site: no testimonials page, no widgets, no schema. (Brief assumed "thin"; actual count is moderate — the *on-site* review presence is what's thin.)
- Active YouTube channel promoted via Media page (only competitor investing in video).

### 3.5 Site quality / tech

- ShoutCMS build, ~2014 design era: dated typography/layout, "Print This Page" link, fax number, no booking system (appointments via email link), inline-JS content injection (H1 built via JS string concatenation in places). Lightweight (~48 KB HTML) so it loads fast, but looks a decade old on mobile and screams "small shop" while their dyno room says "serious facility."
- No blog/news despite the CMS supporting articles (the test-article stubs prove the feature exists).

### 3.6 Weaknesses

1. On-page SEO is effectively absent: "Home" titles, empty descriptions, duplicate H1s, no schema. They are invisible for *dyno tuning Edmonton*-class queries they should own (Horsepower Solutions, SSS Motorsports, CCMR, Player 3, PSR currently soak up that SERP).
2. No content engine; YouTube effort never repurposed into indexable pages.
3. Only Hellcat gets packaged/priced — no LS, LT, Coyote, diesel, or classic-car packages despite doing the work.
4. Restoration/classic capability hidden under "Projects" with no service page targeting *classic car restoration Edmonton* or *restomod Edmonton*.
5. 66 Google reviews earning nothing on-site (no schema, no display).
6. Dated design undermines a 3,000-hp dyno story — trust gap between capability and presentation.
7. Test pages and typo URLs in the sitemap signal neglect.

### 3.7 Verdict

- **Likely ranks for:** brand name, some residual "performance shop Edmonton" long-tail via body text and citations, Hellcat package queries (they're nearly alone publishing Hellcat stage pricing in Alberta). Excluded from editorial "best hot rod shop" lists (not in The Edmontonite top 10).
- **Left on the table:** the entire dyno-tuning SERP, LS/engine-swap informational queries, restomod positioning, Product schema stars on priced packages, their own review equity.
- **How 2240 beats them:** basic titles/descriptions/schema alone leapfrogs them on every non-brand query; own *restomod*, *engine swap*, and *LS swap Edmonton* content before they wake up; match their one genuine innovation — transparent staged pricing — but for 2240's platforms, with `Product`/`Offer` schema for SERP rich results; present equal-or-better capability inside a modern brand experience they can't match without a full rebuild.

---

## 4. Cross-competitor gap matrix (what nobody in the niche is doing)

| Opportunity | Sideshow | Wadson's | Acceleration | 2240 play |
|---|---|---|---|---|
| Active blog / info content | Dead (2 posts, 2024) | Never existed | Never existed | 50-post plan = instant category monopoly |
| Review schema / SERP stars | No | No | No | aggregateRating + review display day one |
| Per-build project pages | No (thin gallery) | No (image dump) | Partial (thin pages, no SEO) | Build-log URLs per car: long-tail + image SEO + social fuel |
| Service-area / city pages | No | No | No | Sherwood Park, St. Albert, Leduc, Spruce Grove, "serving Alberta" pages |
| Restomod keyword | One passing mention | Absent | Absent | **Uncontested head term in Edmonton** |
| Engine swap landing page | Mentioned in copy only | Absent | Copy only, no page | Dedicated LS/engine-swap service page |
| Pricing content | None | None | Hellcat only | "What does a restoration/build cost" content + staged packages |
| Modern fast site (CWV) | No (Wix, 805 KB) | No (Divi) | Fast but ancient | Performance budget as ranking + brand asset |
| Video → indexable content | No | No | YouTube only, unindexed | Embed + transcribe + schema (VideoObject) |
| Booking online | Yes (Wix) | No | No | Match or beat Sideshow's booking UX |
| Heritage storytelling for E-E-A-T | Partial | Massive story, unused | None | 2240's era-authentic speed-shop brand = ownable narrative |

**Adjacent SERP occupants to monitor** (surfaced during ranking research, outside this teardown's scope): Horsepower Solutions (ProHub dyno), SSS Motorsports, CCMR Performance, Player 3 (LS/Hemi parts), PSR Performance, Custom Automotive Specialties, Frank's Auto Body, plus listicle gatekeepers The Edmontonite and Yelp/Yably aggregation pages — worth outreach for list inclusion since 2240 currently appears on none of them.

---

## 5. Raw reference data

### Title / meta / schema snapshot (fetched 2026-08-02)

```
sideshowpaint.com
  <title>Sideshow Fabrication & Paint | Custom Paint & Restoration
  meta description: "Edmonton's choice hot rod and paint shop. Get started on your next
    restoration or finally get that dream custom paint job. Check us out!"
  generator: Wix.com Website Builder
  JSON-LD: WebSite + LocalBusiness (name, image, address 10977 98 St NW T5H 2P7,
    tel +17802364465) + WebSite(name) — 3 blocks

wadsons.com
  <title>Welcome to Wadson's Hot Rods - Your Source for Classic & Muscle
  meta description: "Explore our portfolio of custom-built dream cars and learn about our
    passion for high-performance vehicles. Join our community of Hot Rod enthusiasts today."
  stack: WordPress + Divi + Rank Math; canonical OK; NO <h1> on homepage
  JSON-LD @graph: AutomotiveBusiness/Organization (no address; openingHours
    "Monday…Sunday 09:00-17:00" — contradicts stated Mon-Fri 8:00-4:30) + WebSite +
    ImageObject + WebPage (datePublished 2023-07-20, dateModified 2024-05-…)

accelerationauto.ca
  <title>Home
  meta description: ""   meta keywords: ""
  generator: Shoutcms; robots: index,follow
  JSON-LD: none (0 blocks)
  sitemap oddities: /test-article-01, /test-article-02, /finacing (typo)
```

### Key page URLs consulted

- Sideshow: `/` · `/custom-paint` · `/custom-builds-rebuilds` · `/fabrication` · `/about-us` · `/projects` · `/blog` · `/post/finding-the-restoration-shop-for-you-tips-for-selecting-the-perfect-partner` · sitemaps (`/sitemap.xml`, `/pages-sitemap.xml`, `/blog-posts-sitemap.xml`)
- Wadson's: `/` · `/what-we-do/` · `/portfolio/` · `/team/` · `/wadsons-history/` · `/sitemap_index.xml` · `/page-sitemap.xml`
- Acceleration: `/home` · `/services` · `/performance` · `/packages` · `/hellcat-stage-1-package` · `/media` · `/sitemap.xml`
- Third-party: Birdeye (Sideshow 4.7/45) · BBB profiles (Sideshow A+; Wadson's Hot Rod Parts Ltd; Acceleration Auto & Performance) · Yably/autoyas/Canpages (Acceleration ≈4.6/66 Google, 4.68/12 Facebook; former name DKW Gas & Diesel Performance) · YellowPages (Wadson's 5/5, small n) · The Edmontonite "10 Best Hotrod Shop in Edmonton" (Wadson's #1, Sideshow #7; Acceleration and 2240 absent) · Yelp Edmonton dyno/restoration category pages
