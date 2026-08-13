# AI SEO / GEO Playbook — 2240 Speed Shop (2026)

**Prepared:** August 2026 · **Project:** 2240speedshop.com rebuild · **Market:** Edmonton, Alberta, Canada
**Goal:** Dominate BOTH classic Google (organic + Local Pack) AND AI answer engines (Google AI Overviews / AI Mode, ChatGPT search, Perplexity, Gemini, Copilot) for automotive performance, restoration, and custom-build queries in Edmonton and greater Alberta.

**Current-site context (verified Aug 2026):** 2240speedshop.com is a GoDaddy site-builder page. NAP shown on site: 2009 91 Avenue, Edmonton, AB · 780-999-6450 · 2240speedshop@gmail.com · 9:00 a.m.–5:00 p.m. Positioning: complete vehicle restorations, custom builds, performance upgrades for vintage cars. Tagline: "Don't Save Your Dreams for Sleep...Revive Your Ride." No visible schema markup, thin content, single-page-style structure. **Action: verify exact legal name, street address format (NW quadrant?), postal code, and hours with the owner before shipping any NAP anywhere — every citation must match character-for-character.**

---

## 1. The 2026 AI Search Landscape — Why This Playbook Exists

The numbers that justify treating AI answer engines as a first-class channel:

- **ChatGPT crossed ~900M weekly active users** (Feb 2026); ~59% of ChatGPT queries that trigger a live web lookup are **local-intent** — roughly 350M local AI searches per day ([Technijian](https://technijian.com/ai/ai-search/chatgpt-search-is-now-the-fastest-growing-local-discovery-channel-heres-what-oc-businesses-need-to-do-about-it)).
- **45% of consumers now use AI tools to find local businesses**, up from 6% a year earlier (BrightLocal 2026 Local Consumer Review Survey, via [ALM Corp](https://almcorp.com/blog/how-ai-is-impacting-local-search/)).
- **AI visibility is scarce:** SOCi's 2026 Local Visibility Index found AI platforms recommend only **1.2% of business locations on ChatGPT** and **7.4% on Perplexity**, vs 35.9% appearing in Google's local 3-pack ([SOCi](https://www.soci.ai/blog/how-to-rank-in-chatgpt-perplexity-and-google-ai-overview/)). Fewer than half of brands winning traditional local search also appear in AI recommendations.
- **AI referrals convert ~9x better:** ChatGPT referral traffic converts at ~15.9% vs ~1.76% for Google organic ([Formula Won Labs](https://www.formulawonlabs.com/blog/chatgpt-search-local-businesses)).
- **AI Overviews now appear on a large share of local queries** (estimates range from ~7% of classic local queries to 68–80%+ of local *service* queries depending on methodology), and the **AI Overview local pack often features only 1–2 businesses** instead of three — some businesses have seen 50%+ visibility drops ([Whitespark](https://whitespark.ca/guides/whitesparks-guide-to-googles-ai-mode-for-local-businesses/), [OnPurpose Media](https://onpurposemedia.com/ai-overview-local-packs-impacting-visibility/), [ALM Corp](https://almcorp.com/blog/how-ai-is-impacting-local-search/)).
- **Each engine has different citation logic:** only ~11% of domains are cited by both ChatGPT and Perplexity; a 34,234-response study found a 46x difference in brand citation rates between platforms ([AuthorityTech](https://authoritytech.io/curated/ai-citation-11-percent-platform-overlap-per-engine-audit-2026), [Pressonify](https://pressonify.ai/blog/ai-search-platform-comparison-2026)).
- **The moat is open:** the vast majority of local businesses have taken zero deliberate GEO steps ([GrowthPro AI](https://growthproai.com/ai-search-statistics-local-businesses-2026)). No Edmonton speed shop is doing this. First mover in the "performance shop Edmonton" entity space wins a compounding advantage.

### Who answers what (engine-by-engine)

| Engine | Index / data source | What it favors for local "best X" answers |
|---|---|---|
| **Google AI Overviews / AI Mode** | Google index + Knowledge Graph + Google Business Profile + Maps reviews | GBP completeness, review sentiment, entity recognition, sites already ranking top-10, Reddit/Yelp/directories ([Whitespark](https://whitespark.ca/guides/whitesparks-guide-to-googles-ai-mode-for-local-businesses/)) |
| **ChatGPT search** | **Bing index** (Microsoft partnership) + **Yelp licensed data (July 2026 deal)** + crawled HTML | Bing Places listing, Yelp reviews/ratings/photos, Wikipedia, established media, listicles ([Search Engine Land](https://searchengineland.com/how-does-chatgpt-conduct-local-searches-454894), [Axios](https://www.axios.com/2026/07/23/yelp-reviews-chatgpt-geo-partnership)) |
| **Perplexity** | Own crawler (PerplexityBot) + curated source pool + **Yelp Places API** | Freshness, structured Q&A formatting, query-to-heading match, citation density, presence across Google/Yelp/industry directories ([Leapd](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026), [beSpacific](https://www.bespacific.com/perplexity-brings-yelp-data-to-its-chatbot/)) |
| **Gemini** | Google index + Knowledge Graph | Entity recognition first, content quality second ([Digital Applied](https://www.digitalapplied.com/blog/entity-seo-knowledge-graph-optimization-guide-2026)) |
| **Copilot** | Bing index (ships inside Windows/Edge) | Bing Places, Bing-indexed content ([Osprey](https://osprey.solutions/blog/bing-places-for-business-2026)) |

**Strategic takeaway:** Google-only local SEO now covers roughly half the discovery surface. The rebuild must ship Bing Places, Yelp, and entity infrastructure on day one — not as afterthoughts.

---

## 2. llms.txt — Spec, Reality Check, and What To Ship

### The spec ([llmstxt.org](https://llmstxt.org/))

`/llms.txt` is a Markdown file at the site root that gives LLMs a curated map of your best content. Format:

1. **H1** with the site/business name (only required element)
2. **Blockquote** — one-paragraph summary with key facts
3. Optional body paragraphs/lists (no headings)
4. **H2-delimited sections** containing Markdown link lists: `- [Page name](url): one-line description`
5. An **`## Optional`** section for secondary URLs that can be skipped when context is short

Companion convention: serve clean Markdown versions of key pages at `same-url.md` (and `llms-full.txt` with full inlined content).

### Reality check (honest, current)

- Adoption is ~10% of domains (SE Ranking, 300k-domain survey), and ~40% of those files are auto-generated plugin stubs ([aeo.press](https://ai.aeo.press/the-state-of-llms-txt-in-2026)).
- **No major AI company (OpenAI, Google, Anthropic, Meta, Mistral) has committed to reading llms.txt in production** as of Q1 2026. Log analyses show GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot overwhelmingly skip the file and crawl HTML directly ([Codersera](https://codersera.com/blog/llms-txt-complete-guide-2026/)).
- Google's Gary Illyes said on record (July 2025) that Google doesn't support it and isn't planning to; John Mueller: no AI crawler has claimed to extract info via llms.txt. 8 of 9 sites in a Search Engine Land test saw no measurable traffic change ([LinkBuildingHQ](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/), [Derivatex](https://derivatex.agency/blog/llms-txt-guide/)).

### Verdict for 2240: ship it anyway (30 minutes, zero risk, option value)

It costs nothing, does no harm, future-proofs against adoption, and some smaller agents/tools do fetch it. But **never prioritize it above HTML content, schema, GBP, or Bing Places.** Matt already ships llms.txt on evolveecoblasting.com — same play here.

**Template to ship at `https://2240speedshop.com/llms.txt`:**

```markdown
# 2240 Speed Shop

> Edmonton, Alberta automotive performance and restoration shop. Complete vehicle
> restorations, custom builds, engine and performance upgrades for classic, vintage,
> and modern performance vehicles. Located at [VERIFIED ADDRESS], Edmonton, AB.
> Phone: 780-999-6450. Serving Edmonton, Sherwood Park, St. Albert, Leduc, and
> greater Alberta since [YEAR].

## Services
- [Vehicle Restoration](https://2240speedshop.com/services/restoration): frame-off and rolling restorations for classic cars and trucks
- [Custom Builds](https://2240speedshop.com/services/custom-builds): restomods, pro-touring, engine swaps
- [Performance Upgrades](https://2240speedshop.com/services/performance): tuning, forced induction, suspension, brakes
- [Pricing & Process](https://2240speedshop.com/pricing): how quoting and build stages work

## About
- [About the Shop](https://2240speedshop.com/about): team, certifications, shop history
- [Project Gallery](https://2240speedshop.com/builds): completed builds with photos and specs
- [FAQ](https://2240speedshop.com/faq): common questions on cost, timelines, insurance, storage

## Optional
- [Blog](https://2240speedshop.com/blog): guides on restoration, tuning, and classic car care in Alberta
```

---

## 3. Schema.org / JSON-LD Stack (the concrete build spec)

JSON-LD is Google's preferred format and is parsed heavily by ChatGPT, Perplexity, and Gemini when answering "best auto shop near me" queries ([dataclean.to](https://dataclean.to/use-cases/auto-repair-local-business-schema-generator), [Gatilab](https://gatilab.com/local-business-schema-markup/)). Rules of engagement:

- Use the **most specific subtype**: `AutoRepair` (subtype of `AutomotiveBusiness` → `LocalBusiness`), not generic `LocalBusiness` ([Schema App](https://www.schemaapp.com/schema-markup/how-to-do-schema-markup-for-local-business/)).
- Give every entity a **stable `@id`** (e.g. `https://2240speedshop.com/#business`) and reference it from every page — this is how you build a machine-readable entity graph ([Digital Applied](https://www.digitalapplied.com/blog/entity-seo-knowledge-graph-optimization-guide-2026)).
- Emit JSON-LD **in the raw server-rendered HTML** (see §7 — AI crawlers don't execute JS).
- Validate with Google Rich Results Test + Schema.org validator before launch.

### 3.1 Master business node (every page, sitewide)

```json
{
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": "https://2240speedshop.com/#business",
  "name": "2240 Speed Shop",
  "alternateName": "2240 Speed Shop Edmonton",
  "description": "Automotive performance and restoration shop in Edmonton, Alberta specializing in complete vehicle restorations, custom builds, and performance upgrades for classic and modern vehicles.",
  "url": "https://2240speedshop.com",
  "logo": "https://2240speedshop.com/img/logo.png",
  "image": [
    "https://2240speedshop.com/img/shop-exterior.jpg",
    "https://2240speedshop.com/img/shop-floor.jpg",
    "https://2240speedshop.com/img/build-example.jpg"
  ],
  "telephone": "+1-780-999-6450",
  "email": "2240speedshop@gmail.com",
  "priceRange": "$$-$$$$",
  "currenciesAccepted": "CAD",
  "paymentAccepted": "Cash, Debit, Visa, Mastercard, E-transfer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2009 91 Avenue NW",
    "addressLocality": "Edmonton",
    "addressRegion": "AB",
    "postalCode": "[VERIFY]",
    "addressCountry": "CA"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "[VERIFY]", "longitude": "[VERIFY]" },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "17:00"
  }],
  "areaServed": [
    { "@type": "City", "name": "Edmonton" },
    { "@type": "City", "name": "Sherwood Park" },
    { "@type": "City", "name": "St. Albert" },
    { "@type": "City", "name": "Leduc" },
    { "@type": "City", "name": "Spruce Grove" },
    { "@type": "AdministrativeArea", "name": "Alberta" }
  ],
  "founder": { "@type": "Person", "name": "[OWNER NAME]", "@id": "https://2240speedshop.com/about#owner" },
  "foundingDate": "[YEAR]",
  "knowsAbout": [
    "classic car restoration", "engine swaps", "restomod builds",
    "performance tuning", "custom fabrication", "vintage vehicle repair"
  ],
  "slogan": "Don't Save Your Dreams for Sleep... Revive Your Ride",
  "sameAs": [
    "https://www.instagram.com/2240speedshop/",
    "https://www.threads.com/@2240speedshop",
    "https://www.facebook.com/[if-exists]",
    "https://www.youtube.com/@[if-exists]",
    "https://maps.google.com/?cid=[GBP-CID]",
    "https://www.yelp.ca/biz/[listing]",
    "https://www.bing.com/maps?[bing-places-listing]"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://2240speedshop.com/services/restoration#service", "name": "Complete Vehicle Restoration", "serviceType": "Auto restoration" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://2240speedshop.com/services/custom-builds#service", "name": "Custom Builds & Restomods", "serviceType": "Custom vehicle fabrication" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "@id": "https://2240speedshop.com/services/performance#service", "name": "Performance Upgrades & Tuning", "serviceType": "Auto performance tuning" } }
    ]
  }
}
```

Key property notes ([Unhead](https://unhead.unjs.io/docs/schema-org/api/schema/local-business), [jsonld.com](https://jsonld.com/local-business/), [Whitespark](https://whitespark.ca/blog/how-to-use-aggregate-review-schema-to-get-stars-in-the-serps/)):
- `openingHoursSpecification` with 24-h times; separate objects per differing day; `validFrom`/`validThrough` for seasonal hours.
- `geo` coordinates should match the GBP pin exactly.
- `sameAs` is the single most important entity-SEO property — every profile you control goes in it.
- `knowsAbout` feeds entity topical association for AI engines.

### 3.2 Service schema (one per service page)

Each service page gets its own `Service` node with `provider` pointing at `#business`, plus `areaServed`, and an `offers` block with a **price range if at all possible** (AI engines love concrete prices; "restorations from $X" beats silence):

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://2240speedshop.com/services/restoration#service",
  "name": "Classic Car Restoration in Edmonton",
  "serviceType": "Vehicle restoration",
  "provider": { "@id": "https://2240speedshop.com/#business" },
  "areaServed": { "@type": "City", "name": "Edmonton" },
  "description": "Frame-off and rolling restorations for classic and vintage vehicles, including bodywork, paint, drivetrain, wiring, and interior.",
  "offers": { "@type": "Offer", "priceCurrency": "CAD", "priceSpecification": { "@type": "PriceSpecification", "minPrice": "[X]", "priceCurrency": "CAD" } }
}
```

### 3.3 FAQPage schema — still ship it, know why

Google **deprecated FAQ rich results entirely** (restricted to gov/health Aug 2023; deprecation notice added May 7, 2026 — no more visible FAQ snippets for anyone) and killed HowTo rich results in 2023 ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/), [getpassionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)). **But the FAQPage type itself is not deprecated** and remains one of the cleanest, most extractable signals for AI citation across ChatGPT, Perplexity, and Gemini ([The HOTH](https://www.thehoth.com/blog/google-faq-rich-results-deprecated/), [seostrategy.co.uk](https://www.seostrategy.co.uk/learn/faq-schema-deprecation-2026-rich-result-vs-schema/)).

Ship `FAQPage` JSON-LD on the FAQ page and per-service FAQ blocks. **Critical rule: the Q&A text in schema must match visible on-page text exactly.** Question wording should mirror real prompts ("How much does a frame-off restoration cost in Alberta?", "How long does a full restoration take?", "Do you work on [make/model]?").

`HowTo` schema: skip it (no SERP feature, low AI value vs cost). Write how-to *content* as numbered steps instead.

### 3.4 Review / AggregateRating — the rules (don't get this wrong)

- Since 2019, Google **does not show star rich results for self-serving reviews** — `AggregateRating` on your own `LocalBusiness`/`AutoRepair` markup will never earn stars in organic results ([BrightLocal](https://www.brightlocal.com/learn/review-schema/), [Whitespark](https://whitespark.ca/blog/how-to-use-aggregate-review-schema-to-get-stars-in-the-serps/)).
- Reviews must originate from independent third parties (Google, Yelp, Facebook); marking up snippets of third-party reviews on your own site does not earn stars either.
- **Still worth including `aggregateRating` in the business node once you have real Google reviews** — it doesn't earn Google stars, but AI engines parse it as a trust signal. Keep it truthful and synced to the real GBP number; never fabricate.
- Real leverage is off-site: review **velocity** (steady stream, not bursts), review **recency**, keyword-rich review content ("they rebuilt the 350 in my '72 C10"), and **owner responses to 100% of reviews** ([KD Interactive](https://www.kdinteractive.com/how-to-get-star-ratings-in-google-search-the-2026-local-business-guide)).

### 3.5 VideoObject — build videos are a weapon

YouTube is consistently a **top-10 most-cited domain in AI search responses** (OtterlyAI YouTube Citation Study 2026, via [Yotpo](https://www.yotpo.com/blog/optimize-youtube-for-ai-citations/)); pages with VideoObject schema index up to 3x faster ([Swarmify](https://swarmify.com/blog/video-schema-markup/)). For a speed shop, build videos + dyno pulls + before/afters are natural content. Per video page:

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "1969 Camaro Restomod Build — Part 3: LS Swap",
  "description": "Installing an LS3 into a 1969 Camaro at 2240 Speed Shop in Edmonton...",
  "thumbnailUrl": "https://2240speedshop.com/img/camaro-part3.jpg",
  "uploadDate": "2026-08-01",
  "duration": "PT12M40S",
  "embedUrl": "https://www.youtube.com/embed/[ID]",
  "contentUrl": "https://www.youtube.com/watch?v=[ID]",
  "publisher": { "@id": "https://2240speedshop.com/#business" }
}
```

YouTube-side SOP for AI citability: edited captions, chapters, a 30–60-word description summary, pinned timestamp comment, and a transcript page on 2240speedshop.com ([GreenBanana](https://greenbananaseo.com/make-youtube-videos-easy-to-cite-a-simple-sop-for-video-ai-search-visibility-article-and-video-50/)).

### 3.6 Supporting types

- **`BreadcrumbList`** on every page (helps engines map site structure).
- **`WebSite`** node with `publisher` → `#business`.
- **`Person`** nodes for owner/lead techs on the About page (`jobTitle`, `worksFor` → `#business`, `knowsAbout`, `sameAs` to personal Instagram if public) — feeds E-E-A-T.
- **`ImageObject`** with `caption`/`creator` for signature build photos.
- **Article/BlogPosting** on every blog post with `author` → a real `Person`, `datePublished`, `dateModified`.

---

## 4. Entity SEO — Make "2240 Speed Shop" a Thing Machines Know

In 2026, AI engines pick citations based on **entity recognition first, content quality second**; ~82% of local queries are processed through Google's Knowledge Graph before web results are generated ([Digital Applied](https://www.digitalapplied.com/blog/entity-seo-knowledge-graph-optimization-guide-2026), [Search Engine Zine](https://searchenginezine.com/off-page/gbp-audit/local-entity-seo/)). Typical timelines: knowledge-panel-grade recognition in 60–180 days, AI citation lift in 90–120 days.

### 4.1 The entity home base
- The website is the canonical entity record: stable `@id`, complete `AutoRepair` node, `sameAs` array linking every profile (§3.1).
- An **About page that reads like a Wikipedia stub**: founded [year] by [name], located at [address], specializes in X/Y/Z, notable builds, certifications. Facts, dates, numbers — machine-checkable claims.

### 4.2 NAP consistency (non-negotiable)
One canonical string for Name / Address / Phone, reproduced identically everywhere: site footer, schema, GBP, Bing Places, Apple Business Connect, Yelp, Facebook, Instagram bio, directories. Mismatches ("2009 91 Ave" vs "2009-91 Avenue NW") fragment the entity and depress AI confidence ([Semrush](https://www.semrush.com/blog/how-to-build-local-citations/)).

### 4.3 Google Business Profile — the #1 local AI input
2026 GBP priorities ([Reviewly](https://reviewly.ai/2026/01/07/google-business-profile-optimization/), [PagePros](https://www.pagepros.io/blog/google-business-profile-optimization-complete-feature-guide-2026), [AgencyJet](https://www.agencyjet.com/blog/google-business-profile-optimization-guide/)):
- **Primary category:** Auto repair shop (or Auto restoration service if available); add up to 9 secondaries: Auto machine shop, Car repair and maintenance, Auto tune up service, Auto body shop, Racing car parts store — test quarterly.
- **Attributes are weighted more heavily in 2026 relevance calculations** — fill every applicable one.
- **Services section:** list every service with descriptions (these feed AI summaries directly).
- **Photos:** profiles with 100+ photos get ~520% more calls (Google data). Real shop/build photos, updated monthly — never stock.
- **Posts:** 1–2/week (build updates, before/afters, seasonal: winter storage, spring startup).
- **Q&A:** seed 10–15 real questions with owner answers (cost ranges, timelines, makes serviced, towing/storage).
- Products area: showcase completed builds as "products."
- Respond to every review within 48h; AI reads review sentiment and owner responsiveness.

### 4.4 Bing Places + the second-index problem
ChatGPT search and Copilot run on **Bing's index**. If 2240 isn't in Bing Places with complete data, it is invisible to the fastest-growing local discovery channel ([Osprey](https://osprey.solutions/blog/bing-places-for-business-2026), [PushLeads](https://pushleads.com/ai-search-visibility-for-local-service-businesses-why-your-google-page-one-ranki/)). Bing Places lets you **import your GBP** — 15 minutes. Also: verify the site in **Bing Webmaster Tools** and submit the sitemap (also feeds ChatGPT/Copilot retrieval).

### 4.5 Yelp is suddenly strategic again (July 2026)
Yelp's licensing deal with OpenAI (announced July 23, 2026) puts Yelp listings, ratings, reviews, and photos **directly inside ChatGPT answers with links**; Perplexity already uses Yelp's Places API ([Axios](https://www.axios.com/2026/07/23/yelp-reviews-chatgpt-geo-partnership), [MarTech](https://martech.org/yelp-brings-reviews-and-local-leads-to-chatgpt/), [beSpacific](https://www.bespacific.com/perplexity-brings-yelp-data-to-its-chatbot/)). Claim/complete the Yelp.ca listing (photos, services, hours) and politely cultivate a handful of genuine Yelp reviews. This was optional in 2024; it is not optional now.

### 4.6 The wider citation graph
- **Apple Business Connect** (Siri/Apple Maps; Yelp data also feeds Apple).
- Canadian/local directories: 411.ca, YellowPages.ca, Edmonton Chamber of Commerce, Alberta business directories.
- **Automotive-vertical citations:** CarDomain-style build registries, Hagerty community, classic-car club directories (Northern Alberta chapter sites, EACC-type clubs), event listings (Edmonton Motor Show, local show-and-shines, Castrol Raceway event pages).
- **Wikidata entry** once there's third-party press to cite — cheap, legitimate, feeds every knowledge graph ([Jottler](https://jottler.co/blog/knowledge-graph-seo)).
- **Local press = Wikipedia-adjacent authority:** a single Edmonton Journal / CTV Edmonton / CBC Edmonton feature about a notable build outweighs 50 directory listings for ChatGPT (which favors established news sources — [Pressonify](https://pressonify.ai/blog/ai-search-platform-comparison-2026)). Pitch story angles: rare barn find restored, father-son build, car headed to auction.

---

## 5. Becoming the Cited Answer for "Best Performance Shop in Edmonton"

What AI engines actually cite for "best X in [city]" ([Technical Kalyan](https://technicalkalyan.com/rank-local-businesses-on-chatgpt/), [EvolveAMZ](https://evolveamz.com/local-business-ai-search-guide/), [SOCi](https://www.soci.ai/blog/how-to-rank-in-chatgpt-perplexity-and-google-ai-overview/)):

1. **Listicles are the #1 cited page type in ChatGPT — 43.8% of citations.** Engines lift from "best [service] in [city]" round-ups that already rank on Google.
2. **Reddit + Wikipedia dominate cross-engine.** User-generated discussion occupies top citation slots on every surface.
3. **Review platforms** (Google reviews, Yelp — now licensed data) and **industry directories**.
4. **Citation concentration is extreme:** top 10 domains take ~46% of ChatGPT citations per topic; top 30 take ~67%. You need to be ON those domains, not just have your own site.

### The tactics, in priority order

1. **Get into existing round-ups.** Find every page ranking for "best auto shop Edmonton", "best mechanic Edmonton", "car restoration Edmonton" (ThreeBestRated, Yelp collections, local blogs, "top 10 mechanics Edmonton" posts). Pitch inclusion with a value angle; paid placement on legitimate publications also counts — ChatGPT doesn't distinguish organic vs paid mentions ([EvolveAMZ](https://evolveamz.com/local-business-ai-search-guide/)).
2. **Publish your own comparison/round-up content** — honest category explainers: "Performance Shops vs. General Mechanics in Edmonton: Who Do You Need?", "Classic Car Restoration in Edmonton: Costs, Shops, and What to Expect (2026)". Listicle format, comparison tables, named entities, updated dates. These become citable sources for category queries even when generic "best" round-ups exclude you.
3. **Seed Reddit legitimately.** r/Edmonton and r/projectcar threads asking "who does restorations in Edmonton?" get scraped by every engine. Genuine participation (owner flair, helpful answers, posting finished builds) plants durable citations. Never astroturf — Reddit's moderation and AI-era scrutiny make fake advocacy a brand risk.
4. **Structure your own pages to be liftable** (§7.3) so when engines synthesize "best" answers from multiple sources, your facts (address, specialties, price ranges, years in business) are the ones quoted.
5. **Win classic Google first.** AI Overviews and Perplexity both draw disproportionately from pages already ranking top-10. Traditional local SEO remains the foundation GEO stands on.

---

## 6. E-E-A-T for a Trade Business

Google's raters and AI engines both reward demonstrated first-hand experience — which a real shop generates naturally if the site surfaces it ([Ranking Lens](https://blog.rankinglens.com/eeat-checklist-2026), [LocalDominator](https://localdominator.co/eeat-for-local-seo/), [Softtrix](https://www.softtrix.com/blog/eeat-for-usa-service-businesses/)):

- **Named humans with credentials.** Tech bios with photo, job title, years of experience, Red Seal Automotive Service Technician certification (Alberta's journeyman cert), specialties. "Written by [name], Red Seal technician, 15 years building small-block Chevys" on every blog post. `Person` schema for each.
- **Experience proof:** build galleries with dates, specs, hour counts; before/during/after photo series; case-study pages per major build ("1972 C10 — 400 hours, full frame-off"). Real photos only — algorithms and customers both detect stock.
- **Certifications & compliance visible:** Red Seal, AMVIC licensing (mandatory for Alberta automotive businesses — display the license number), WCB coverage, insurance. AMVIC licensure is a uniquely strong Alberta trust signal.
- **Trust infrastructure:** real street address + embedded map, phone in header, About page with faces and history, HTTPS, privacy policy, warranty/guarantee terms in writing.
- **Review corpus:** steady velocity on Google + Yelp + Facebook, 100% owner-response rate, photos in reviews. Third-party reviews are the trust signal; on-site testimonials are decoration.
- **Off-site footprint:** sponsorships (local racing, car clubs, charity show-and-shines), event participation, media mentions — each generates a crawlable, citable trust breadcrumb.

---

## 7. Technical Foundation

### 7.1 Render strategy — the single most important build decision

**No AI crawler except Googlebot executes JavaScript.** Vercel's analysis of 500M+ GPTBot fetches found zero evidence of JS execution; GPTBot, ClaudeBot, and PerplexityBot fetch raw HTML once and move on. Bing has partial rendering ([Vercel data via SearchOptimo](https://searchoptimo.com/blog/do-ai-crawlers-render-javascript), [Radiant Elephant](https://www.radiantelephant.com/server-side-rendering-ai-crawlers/)).

**Mandate for the rebuild:** every page must be fully readable in raw HTML — static generation (SSG) or server-side rendering (SSR). Astro / Next.js SSG / Eleventy / plain HTML all fine; client-side-rendered SPA is disqualified. All JSON-LD, nav, content, FAQs in the initial HTML payload. (The current GoDaddy builder likely passes this bar but fails on everything else.)

### 7.2 Core Web Vitals targets (2026)

| Metric | Target (p75, field data) | Notes |
|---|---|---|
| **LCP** | < 2.5 s (aim < 1.8 s) | Hero image: preloaded, AVIF/WebP, explicit dimensions |
| **INP** | < 200 ms (aim < 100 ms) | Replaced FID in March 2024; ship minimal JS |
| **CLS** | < 0.1 (aim < 0.05) | Reserve space for images/embeds/fonts |

Measured at the 75th percentile of real Chrome users, mobile-first ([corewebvitals.io](https://www.corewebvitals.io/core-web-vitals), [Meteora](https://meteoraweb.com/en/analisi-dei-dati-e-metriche/core-web-vitals-2026-lcp-inp-cls-thresholds-and-seo-impact)). For a mostly-static shop site there is no excuse not to be green across the board: ship less JavaScript, compress images, self-host fonts with `font-display: swap`, no layout-shifting ad/booking widgets.

### 7.3 Content patterns that win AI citations

Backed by the Princeton/IIT GEO study (~10k queries: statistics +up-to-40% visibility, citations +30–40%, quotations +30–40%; best combo = fluency + statistics — [arXiv](https://arxiv.org/pdf/2311.09735), [Blck Alpaca](https://blckalpaca.at/en/knowledge-base/seo-geo/geo-generative-engine-optimization/the-princeton-geo-study-methodology-results-and-critique)) and 2026 field studies ([AirOps](https://www.airops.com/blog/question-based-headings-ai-citations), [SERPs.io](https://serps.io/blog/content-structure-ai-citations), [Animalz](https://www.animalz.co/blog/ai-aeo-answer-engine-citation)):

- **Answer-first (BLUF):** every section answers its implicit question in the first **40–60 words**, then elaborates.
- **Question-format H2/H3 headings** — 3.4x more likely to be extracted than statement headings. Match real prompt phrasing.
- **Tables:** comparison tables earn 2.5–4.2x more citations. Use for pricing tiers, service comparisons, timeline expectations, "stock vs stage 1 vs stage 2".
- **Standalone sections:** each H2 block must make sense with zero surrounding context — engines lift passages, not pages.
- **Evidence density:** concrete numbers (hours, HP gains, dollar ranges, years), named sources, dates. "A frame-off restoration typically runs 800–1,200 shop hours" is citable; "restorations take a long time" is not.
- **Definitions:** short "What is X?" definition blocks (restomod, frame-off, LS swap, dyno tune) — these win definition-style AI answers.
- **Freshness:** visible updated dates; refresh money pages every 7–14 days initially, then monthly; Perplexity weights freshness explicitly.
- **One idea per paragraph, ≤ 4 lines**, bulleted lists for anything enumerable.

### 7.4 robots.txt / crawler policy

Recommended stance for a business that wants maximum AI visibility: **allow everything** — both search/retrieval agents and training crawlers (training exposure is how models "know" the entity exists for non-search answers) ([Pixis](https://pixis.ai/blog/robots-txt-for-ai-crawlers-gptbot-perplexitybot-geo-audit/), [SearchScore](https://searchscore.io/guides/technical-geo/ai-crawlers-robots-txt/)):

```
# Search engines
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /

# AI retrieval / search (must-allow for AI answer visibility)
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /

# AI training (allow = entity awareness inside future models)
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: https://2240speedshop.com/sitemap.xml
```

Key distinction: GPTBot/ClaudeBot/Google-Extended = training; OAI-SearchBot/ChatGPT-User/PerplexityBot/Claude-SearchBot = live retrieval for cited answers ([Soar](https://www.soar.sh/blog/ai-bots-robots-txt-guide)). Blocking training bots is a legitimate choice for publishers monetizing content; for a local shop trying to be recommended, allow all.

### 7.5 Other technical items
- XML sitemap + submit to **both** Google Search Console and Bing Webmaster Tools.
- Clean semantic HTML5 (`<main>`, `<article>`, `<section>`, proper heading hierarchy) — this is what non-rendering crawlers parse.
- Descriptive `alt` text on every build photo (make/model/work performed — "1969 Camaro SS during LS3 swap at 2240 Speed Shop Edmonton").
- Canonicals, no orphan pages, footer NAP on every page.
- OpenGraph/Twitter cards (AI engines use OG data for entity cards).
- Serve real 404s; avoid soft-404 JS redirects (invisible to AI crawlers).

---

## 8. DAY-ONE CHECKLIST — What the New Site Ships With

### A. Technical shell
- [ ] SSG/SSR build — 100% of content + JSON-LD in raw HTML (no client-side-only content)
- [ ] CWV green on mobile: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 (test with PageSpeed Insights + real device)
- [ ] robots.txt allowing all AI agents (§7.4) + XML sitemap
- [ ] `llms.txt` at root (§2 template)
- [ ] HTTPS, canonicals, semantic HTML5, OG tags
- [ ] Google Search Console + **Bing Webmaster Tools** verified, sitemaps submitted

### B. Schema stack (validated in Rich Results Test)
- [ ] Sitewide `AutoRepair` node with stable `@id`, full NAP, geo, hours, `sameAs`, `knowsAbout`, `hasOfferCatalog` (§3.1)
- [ ] `Service` schema on each service page with `provider` → `#business` (§3.2)
- [ ] `FAQPage` schema on FAQ page + service-page FAQ blocks (visible text = schema text) (§3.3)
- [ ] `Person` schema for owner + lead techs on About page
- [ ] `BreadcrumbList` sitewide; `WebSite` node; `VideoObject` wherever video embeds exist (§3.5)
- [ ] NO fabricated `aggregateRating`; add real GBP-synced rating only once reviews exist (§3.4)

### C. Page architecture (each page = a liftable answer)
- [ ] Home: entity-dense intro (who/what/where/since when), answer-first
- [ ] Service pages (min. 4): Restoration · Custom Builds/Restomods · Performance & Tuning · [Maintenance/Repair] — each with question H2s, 40–60-word answer blocks, a pricing/timeline **table**, FAQ block, gallery, CTA
- [ ] About: Wikipedia-stub facts + tech bios with certs (Red Seal, AMVIC license number displayed)
- [ ] Builds/gallery: individual case-study pages per signature build (specs, hours, photos, dates)
- [ ] FAQ hub: 15–20 real questions, answer-first, FAQPage schema
- [ ] Contact: NAP, embedded Google map, hours, service-area list (Edmonton, Sherwood Park, St. Albert, Leduc, Spruce Grove, Fort Saskatchewan, greater Alberta)
- [ ] Blog scaffold ready for the 50-post content plan (Article schema, author `Person`, visible dates)

### D. Entity infrastructure (same week as launch)
- [ ] Canonical NAP string verified with owner and frozen
- [ ] Google Business Profile: claimed, primary + secondary categories, all attributes, services list, 25+ real photos, Q&A seeded (10+), booking/quote link
- [ ] **Bing Places** — import from GBP, complete every field
- [ ] **Yelp.ca** listing claimed + completed (feeds ChatGPT via July 2026 OpenAI deal, and Perplexity)
- [ ] Apple Business Connect claimed
- [ ] Facebook page NAP synced; Instagram + Threads bios: NAP + site link
- [ ] `sameAs` array updated with every live profile URL
- [ ] 10 core citations: 411.ca, YellowPages.ca, Edmonton Chamber, ThreeBestRated submission, key Alberta directories
- [ ] Review engine started: ask 5 best past customers for Google reviews (staggered, not same-day); QR review card printed for the counter

### E. Launch content (minimum citable corpus)
- [ ] 3 cornerstone guides live at launch: "Classic Car Restoration in Edmonton: Cost, Timeline & Process (2026)" · "Performance Upgrades in Alberta: What's Legal, What's Worth It" · "How to Choose a Restoration Shop (Questions to Ask)"
- [ ] Each: question headings, stats, tables, named entities, updated date, author bio

---

## 9. ONGOING TACTICS (the compounding layer)

### Weekly
- 1–2 GBP posts (build progress, before/after, seasonal)
- Review requests to every completed job (target: 2–4 new Google reviews/month steady velocity; never bursts)
- Respond to all reviews < 48 h
- 1 blog post from the 50-post plan (answer-first format, §7.3)
- Instagram/Threads posts cross-linked to site build pages (social content is crawled and cited)

### Monthly
- 10+ new real photos to GBP
- Refresh one cornerstone page (update stats/dates — freshness signal for Perplexity/AIO)
- One outreach action: pitch a listicle inclusion, a local blog, a club newsletter, or an event page link
- Reddit presence: genuinely answer 2–3 relevant r/Edmonton / r/projectcar / r/classiccars threads
- Publish/optimize 1 YouTube build video (captions, chapters, VideoObject + transcript page on site)

### Quarterly
- **AI visibility audit:** manually run 20 target prompts ("best performance shop Edmonton", "who restores classic cars in Edmonton", "LS swap shop near me") across ChatGPT, Perplexity, Gemini, AI Overviews; log who gets cited and from which sources; chase those exact sources. Tools if budget allows: Otterly.ai / Peec AI (lightweight) or Profound (enterprise) ([Frase](https://www.frase.io/blog/the-10-best-ai-visibility-tools-in-2026)).
- GBP category/attribute test; citation audit (NAP consistency sweep)
- CWV re-check after any site change
- Press pitch: one story-worthy build to Edmonton Journal / CTV / CBC / driving.ca

### Annually
- Full schema validation pass; refresh all cornerstone dates/stats
- Wikidata entry (once 2+ press citations exist)
- Sponsor a car show / racing event for the backlink + entity mention

### Measurement stack
- GSC + Bing Webmaster Tools (impressions/queries)
- GBP insights (calls, direction requests)
- Server logs or Cloudflare AI-crawler analytics: track GPTBot/PerplexityBot/OAI-SearchBot hits (proof of AI ingestion)
- GA4 referral segment for chat.openai.com / perplexity.ai / gemini.google.com / copilot.microsoft.com
- Quarterly prompt-audit spreadsheet (the real KPI: cited or not, per engine, per prompt)

---

## 10. Priority Logic (if forced to sequence)

1. **GBP + Bing Places + Yelp complete** — the data feeds AI engines actually license/read (days 1–7)
2. **SSR/SSG site with full schema stack + answer-first service pages** (launch)
3. **Review velocity engine** (week 1, forever)
4. **3 cornerstone guides + FAQ hub** (launch month)
5. **Listicle/round-up inclusion outreach** (months 1–3)
6. **50-blog content plan execution** (months 1–12)
7. **YouTube + press + Reddit entity building** (months 2–12)
8. llms.txt, Wikidata, Apple Business Connect (cheap, do early, low ceiling)

---

## Sources

**llms.txt:** [llmstxt.org spec](https://llmstxt.org/) · [Codersera honest guide](https://codersera.com/blog/llms-txt-complete-guide-2026/) · [aeo.press adoption data](https://ai.aeo.press/the-state-of-llms-txt-in-2026) · [LinkBuildingHQ](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/) · [Derivatex](https://derivatex.agency/blog/llms-txt-guide/)
**GEO fundamentals:** [Princeton GEO paper (arXiv)](https://arxiv.org/pdf/2311.09735) · [Blck Alpaca critique](https://blckalpaca.at/en/knowledge-base/seo-geo/geo-generative-engine-optimization/the-princeton-geo-study-methodology-results-and-critique) · [Firebrand GEO 2026](https://www.firebrand.marketing/2025/12/geo-best-practices-2026/) · [Digital Applied GEO guide](https://www.digitalapplied.com/blog/geo-guide-generative-engine-optimization-2026) · [GoMega local playbook](http://www.gomega.ai/blog/ai-seo-for-local-business-playbook/) · [Brandify AEO](https://brandify.io/blog/aeo-for-local-businesses/)
**Citations/engines:** [SOCi Local Visibility Index](https://www.soci.ai/blog/how-to-rank-in-chatgpt-perplexity-and-google-ai-overview/) · [Leapd sourcing study](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026) · [AuthorityTech 11% overlap](https://authoritytech.io/curated/ai-citation-11-percent-platform-overlap-per-engine-audit-2026) · [Pressonify platform guide](https://pressonify.ai/blog/ai-search-platform-comparison-2026) · [Search Engine Land — ChatGPT local](https://searchengineland.com/how-does-chatgpt-conduct-local-searches-454894) · [Technical Kalyan listicle data](https://technicalkalyan.com/rank-local-businesses-on-chatgpt/) · [EvolveAMZ](https://evolveamz.com/local-business-ai-search-guide/)
**Yelp/OpenAI deal:** [Axios exclusive](https://www.axios.com/2026/07/23/yelp-reviews-chatgpt-geo-partnership) · [MarTech](https://martech.org/yelp-brings-reviews-and-local-leads-to-chatgpt/) · [Search Engine Land](https://searchengineland.com/openai-yelp-deal-483326) · [beSpacific — Perplexity+Yelp](https://www.bespacific.com/perplexity-brings-yelp-data-to-its-chatbot/)
**Schema:** [Schema App LocalBusiness how-to](https://www.schemaapp.com/schema-markup/how-to-do-schema-markup-for-local-business/) · [jsonld.com sub-types](https://jsonld.com/local-business/) · [Gatilab 2026 guide](https://gatilab.com/local-business-schema-markup/) · [dataclean.to AutoRepair](https://dataclean.to/use-cases/auto-repair-schema-generator) · [Unhead reference](https://unhead.unjs.io/docs/schema-org/api/schema/local-business)
**FAQ/HowTo deprecation:** [Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/) · [getpassionfruit May 2026 change](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now) · [The HOTH](https://www.thehoth.com/blog/google-faq-rich-results-deprecated/) · [seostrategy.co.uk](https://www.seostrategy.co.uk/learn/faq-schema-deprecation-2026-rich-result-vs-schema/)
**Reviews:** [BrightLocal review schema rules](https://www.brightlocal.com/learn/review-schema/) · [Whitespark aggregate schema](https://whitespark.ca/blog/how-to-use-aggregate-review-schema-to-get-stars-in-the-serps/) · [KD Interactive star ratings 2026](https://www.kdinteractive.com/how-to-get-star-ratings-in-google-search-the-2026-local-business-guide)
**Entity SEO:** [Digital Applied entity guide](https://www.digitalapplied.com/blog/entity-seo-knowledge-graph-optimization-guide-2026) · [Jottler knowledge graph](https://jottler.co/blog/knowledge-graph-seo) · [Search Engine Zine local entity](https://searchenginezine.com/off-page/gbp-audit/local-entity-seo/) · [Navoto](https://navoto.com/blog/entity-seo/)
**GBP:** [Reviewly checklist](https://reviewly.ai/2026/01/07/google-business-profile-optimization/) · [PagePros 2026 features](https://www.pagepros.io/blog/google-business-profile-optimization-complete-feature-guide-2026) · [AgencyJet AI evolution](https://www.agencyjet.com/blog/google-business-profile-optimization-guide/)
**Bing/ChatGPT local:** [Technijian](https://technijian.com/ai/ai-search/chatgpt-search-is-now-the-fastest-growing-local-discovery-channel-heres-what-oc-businesses-need-to-do-about-it) · [Osprey Bing Places](https://osprey.solutions/blog/bing-places-for-business-2026) · [Formula Won Labs](https://www.formulawonlabs.com/blog/chatgpt-search-local-businesses) · [PushLeads](https://pushleads.com/ai-search-visibility-for-local-service-businesses-why-your-google-page-one-ranki/)
**AI Mode/AIO local:** [Whitespark AI Mode guide](https://whitespark.ca/guides/whitesparks-guide-to-googles-ai-mode-for-local-businesses/) · [OnPurpose Media AIO local packs](https://onpurposemedia.com/ai-overview-local-packs-impacting-visibility/) · [ALM Corp data](https://almcorp.com/blog/how-ai-is-impacting-local-search/)
**E-E-A-T:** [Ranking Lens 23 signals](https://blog.rankinglens.com/eeat-checklist-2026) · [LocalDominator checklist](https://localdominator.co/eeat-for-local-seo/) · [Softtrix service businesses](https://www.softtrix.com/blog/eeat-for-usa-service-businesses/) · [DreamHost small business](https://www.dreamhost.com/blog/eeat-for-small-businesses/)
**Technical/CWV/rendering:** [corewebvitals.io](https://www.corewebvitals.io/core-web-vitals) · [Meteora thresholds](https://meteoraweb.com/en/analisi-dei-dati-e-metriche/core-web-vitals-2026-lcp-inp-cls-thresholds-and-seo-impact) · [SearchOptimo JS rendering](https://searchoptimo.com/blog/do-ai-crawlers-render-javascript) · [Radiant Elephant SSR](https://www.radiantelephant.com/server-side-rendering-ai-crawlers/) · [Lantern](https://www.asklantern.com/blogs/ai-crawlers-do-not-render-javascript)
**robots.txt:** [Pixis](https://pixis.ai/blog/robots-txt-for-ai-crawlers-gptbot-perplexitybot-geo-audit/) · [SearchScore](https://searchscore.io/guides/technical-geo/ai-crawlers-robots-txt/) · [Soar](https://www.soar.sh/blog/ai-bots-robots-txt-guide) · [DataImpulse](https://dataimpulse.com/blog/robots-txt-ai-crawlers/)
**Content structure:** [AirOps question headings](https://www.airops.com/blog/question-based-headings-ai-citations) · [SERPs.io structure](https://serps.io/blog/content-structure-ai-citations) · [Animalz 20 techniques](https://www.animalz.co/blog/ai-aeo-answer-engine-citation) · [Onely LLM-friendly](https://www.onely.com/blog/llm-friendly-content/) · [Writesonic AEO checklist](https://writesonic.com/blog/aeo-checklist)
**Video:** [Yotpo YouTube AI citations](https://www.yotpo.com/blog/optimize-youtube-for-ai-citations/) · [Swarmify video schema](https://swarmify.com/blog/video-schema-markup/) · [GreenBanana SOP](https://greenbananaseo.com/make-youtube-videos-easy-to-cite-a-simple-sop-for-video-ai-search-visibility-article-and-video-50/)
**Monitoring tools:** [Frase 10 best AI visibility tools](https://www.frase.io/blog/the-10-best-ai-visibility-tools-in-2026) · [Omnia monitoring](https://www.useomnia.com/blog/ai-search-monitoring-tools)
