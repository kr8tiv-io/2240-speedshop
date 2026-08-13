# 2240 Speed Shop — Master Research Report

**Prepared:** August 2, 2026 · **Project:** Full website rebuild + reputation and search-domination program
**Prepared by:** kr8tiv (kr8tiv.io)
**Sources:** Full site audit, reviews and reputation sweep, social-presence analysis, Edmonton keyword universe, blog keyword research, AI-SEO/GEO playbook, and three competitor SEO teardowns covering 9 shops in depth and 40+ in survey — all research performed live August 2, 2026.

---

## 1. Executive Summary — The One-Page Story

**Who they are.** 2240 Speed Shop is Terry Harmider's customs-and-classics shop at 2009 91 Ave NW, Edmonton (T6P 1L1), on the Sherwood Park boundary. The real business — visible in the socials, the legacy site, and every five-star review — is vintage restorations, hot rods, LS/diesel conversions, and custom builds. A photographer literally pulled over in traffic to shoot the shop's 1960s Dodge D100 truck. The craft is real. The brand is Terry.

**What's broken.** Almost everything digital:

- The website is a GoDaddy template one-pager (launched March 23, 2026) with typos in its own tagline ("Dont Save Your Dreams for sleep ...REVIVE YOU RIDE"), a "JOIN THE LAUNCH" button that links to itself, zero service pages, zero schema markup, zero analytics, a 3-word placeholder blog with a Getty stock photo, and a broken store URL in its own sitemap.
- Google shows **2.7 stars from 7 reviews** — the lowest-rated shop in its own "people also search for" carousel, where Google actively displays 4.5–5.0-star competitors beside the profile.
- **YellowPages flags the business as "permanently closed"** (it is not), and Google's index still serves a fragment of a deleted review accusing Terry of theft.
- The previous website (garagecar.ca) is dead but still indexed, the Instagram has been dormant since December 2024, Threads is private, and the site and socials do not link to each other anywhere.

**The opportunity.** The Edmonton market research says the door is wide open:

- Nobody in the metro owns 2240's exact position — vintage restoration + custom builds + performance under one "speed shop" brand. Restoration shops rank poorly for performance terms; performance shops ignore vintage.
- The core money SERPs are held by directories, Facebook pages, gallery pages, free Wix one-pagers, and a UK doorway site. "Restomod Edmonton," "LS swap Edmonton," and "classic truck restoration Edmonton" are effectively **unclaimed**.
- The three most relevant vintage-niche rivals have published a combined **two blog posts in ~50 years of operation**. A 50-post local content plan enters an empty field.
- Not one competitor in the entire set ships AutoRepair schema with ratings, transparent service pricing (one exception), online booking done well, or any AI-search optimization. Every one of those is a day-one feature of the rebuild.

**The play.** Ship a cinematic Next.js + Three.js site — a stylized 3D shop drift-through hero over rock-solid server-rendered SEO pages — carrying 2240's real identity: the rusted-steel badge vectorized into a proper logo, the D100 as the hero asset, the corrected tagline "Don't save your dreams for sleep — revive your ride," and Terry's terse, classic-rock, gearhead voice. Around the site: a reputation-rescue program (GBP takeover, review engine, citation repair), an AI-search entity build, and a content plan with 100+ researched topics. The site converts; the research compounds; the reputation heals. This document is the proof of depth behind the demo.

---

## 2. Business Intel — What the Research Found

### 2.1 The owner and the brand

- **Owner/principal: Terry Harmider**, posting as "Terry M" on Instagram and Threads; personal Facebook (facebook.com/terry.harmider) publicly posts the shop's reels. Every review — good and bad — is about Terry personally. The brand *is* Terry, and the rebuild should lean into that rather than hide it: an owner story converts in this niche.
- **Positioning (in their own words):** "2240 speed shop customs and classics" — the Instagram bio line, and a far stronger identity than the current website's generic "innovative automotive solutions" copy.
- **Voice:** terse, lowercase, working-man, lets-the-cars-talk. The real "voice" of the account is the music on the reels: Metallica (Sad But True, Enter Sandman), AC/DC (Thunderstruck), Guns N' Roses (Welcome to the Jungle). Old-school hard rock = old-school shop.
- **Visual identity:** brand color **#a02d2d** deep red (from the current site's own PWA manifest); the physical sign is a laser-cut rusted-steel circular badge — "SPEED SHOP 2240 — CLASSICS AND CUSTOMS" with crossed wrenches and red stars. No clean digital logo exists anywhere; the rebuild includes vectorizing the badge so the sign on the building and the mark on the site are finally the same brand.
- **Tagline raw material:** "Don't save your dreams for sleep — revive your ride" (the typo-corrected version of the line already on their site) is genuinely good. Supporting lines from the legacy site: "rolling works of art," "our shop makes ordinary cars into speed demons."

### 2.2 The real service list (far bigger than the website admits)

The current one-pager names only "restorations, custom builds, performance upgrades." The research recovered the true taxonomy from two sources:

**Legacy garagecar.ca site (their own service architecture, archived Aug 2025):**
Hand Built Customs & Classics · Repairs & Restoration · **LS/Diesel Conversions** · Motor Modifications · Hot Rods · Body Works · Paint · Classic Interior (period-correct materials, leather, wood trim, with discreet modern amenities) — plus capability copy covering aftermarket installs, ECU recalibration, dyno testing, custom turbo/supercharger systems, custom tuning, and classic-safety upgrades (disc brake conversions, radial tires, three-point belts, electronic ignition, backup cameras, structural reinforcement). Their old contact form's own dropdown: Restorations / Mechanical Services / Auto Body / Fabrication / Car Sales / Parts & Accessories.

**Alignable B2B profile (active, owner-listed as Terry Harmider) — the 10 service lines:**

1. Automotive Restoration
2. Automotive Window Tinting
3. Auto Detailing
4. Oil Change
5. Collision Repair
6. Brake Repair
7. Electrical System Repair
8. Engine Rebuilding
9. Interior Upholstery
10. Transmission Service

Alignable copy: "Does your MG or Mustang need a makeover? 2240speedshop specializes in restoring vintage and antique cars" — confirming a British-classic + muscle-car clientele. Every one of these ten lines is a website service page and a local keyword the current one-pager throws away.

### 2.3 The Radium connection

The shop road-trips annually to the **Columbia Valley Classics Show & Shine in Radium Hot Springs, BC** (1,000+ classic cars, third September weekend; next: Sept 19, 2026). Their "Road to Radium" reels and user content generated TikTok auto-created discover pages ("Sherwood Park 2240speed Shop Radium Car Show") — proof of organic search demand around the shop with **no branded account capturing it**. Radium is content gold: event recaps, "getting your classic show-ready" service angles, and a yearly emotional anchor for the brand.

### 2.4 The B2B referral network

Alignable reveals a working referral ecosystem invisible on the website:

- **Yesterdays Auto Gallery** (Ted Dakin) — "Always got great service from these guys. Three time customer." A repeat B2B classic-car customer.
- **Bright World Restoration** (Steve Querry) — "Great guy to do business with."
- Recommendations given to **Street Rod Warehouse** (Bud MacMurchy) and **Inline Automotive and Performance** (Denise Meier).

These are testimonial candidates, partner-page material, and local backlink targets on day one.

### 2.5 The signature asset: the D100

On September 9, 2025, photographer Nathan Lajeunesse (@natlajphotography) was driving past the shop, got "distracted by the light patch on the hood," pulled over, and shot a professional carousel of 2240's **1960s Dodge D-Series (D100) pickup** — posted as a collab with the shop's account. That truck — patina, famous light-patch hood, professionally photographed — is the natural hero image and brand mascot for the new site. A second photographer relationship ("JG Photography," via Terry's TikTok) exists as a backup imagery source. Real shoot planned after the client signs; rips carry the demo.

### 2.6 Assets on hand

Ten real photos recovered at full resolution from the current site (matte-green vintage car, black classic, blue custom pickup, red pickup with Texaco neon, stripped project frames, vintage motorcycle with neon sign, a 3-person team photo), plus six background-removed car cutouts and the old logo from the Wayback archive, the D100 carousel via Instagram embeds, and 13 recoverable Instagram posts with captions, like counts, and music credits. One caution: the current blog's featured image is **Getty stock licensed only through GoDaddy — it cannot be reused** on the new site.

---

## 3. The Reputation Situation — And the Rescue Plan

This is a pitch pillar: we do not just build a site, we rescue the shop's name. The current picture is bad in a very specific, very fixable way.

### 3.1 What Google shows today

| Fact | Detail |
|---|---|
| Rating | **2.7 / 5 from 7 reviews** (3 five-star, 4 one-star) |
| The five-stars | All have text, all name Terry personally: "nobody has the same passion, drive, and quality of work" · "very attentive and friendly" (2-year repeat customer) · "Terrific quality work" |
| The one-stars | **All four are drive-by ratings with zero text** |
| Owner responses | **Zero — no review has ever been answered** |
| GBP category | "Auto bodywork mechanic" — wrong; undersells restoration entirely |
| Photos | Nearly none: no interior, no team, no builds |
| Q&A / description | None |
| Hours conflict | GBP says Mon–Sat 9–5; website says Mon–Fri — conflicting data fed to Google |

Google's own "people also search for" carousel puts 2240 (2.7) beside Speed Kraft (4.8/88), Acceleration Auto (4.5/70), SpeedWorks (5.0/6), and Custom Automotive Specialties (5.0/5) — the profile is actively steering searchers to competitors.

### 3.2 The "permanently closed" flag and the fossilized allegation

- **YellowPages.ca marks the business "permanently closed"** and deleted its detail page. The business is demonstrably open (active GBP with hours). If Google ingests this signal it can suppress or mis-flag the Business Profile — a citation emergency.
- Worse: Google's index still serves a snippet of a deleted YP review accusing "Terry" of stealing an engine from an employee's son's truck and cutting the wiring harness. The listing is gone; the fragment survives in search. It cannot be responded to or removed — **it can only be buried** under fresh positive content, reviews, and new authoritative pages about the shop.

### 3.3 Reading the pattern honestly

Three of the four 1-star ratings landed in the same ~2025 window as the theft-allegation review — consistent with **one aggrieved insider plus their circle review-bombing across platforms**, not four independent unhappy customers. Notably, *no complaint about pricing, timelines, or quality from an ordinary customer exists on any platform*. Meanwhile, two new five-stars appeared in late July 2026 — Terry has evidently started rallying supporters organically. The rebuild formalizes that instinct into a system.

### 3.4 Why this is winnable: the math

At 7 total reviews, every legitimate new five-star moves the average roughly 0.2–0.3:

- **+10 five-star reviews → ~4.1 average**
- **+20 five-star reviews → ~4.4+**

For a shop with a 2-year repeat customer, a three-time B2B client, and admirers who write "go meet Terry and look at the work firsthand," twenty honest reviews is a quarter's work with a system: a QR card at vehicle pickup, an SMS link after every job, staggered asks to the best past customers (velocity, never bursts — that's what Google rewards and what looks organic because it is).

### 3.5 The fix plan (priority order)

1. **Claim and rebuild the Google Business Profile:** unify the name to "2240 Speed Shop," fix the Saturday-hours conflict, change primary category to a restoration-appropriate one with performance secondaries, add a description, the full services list, 30+ real photos (builds, interior, Terry at work), seed 10–15 Q&A entries, enable messaging.
2. **Respond to every existing review:** warm thanks to the three fans; one calm, professional, non-defensive reply covering the 1-star cluster. Silence reads as unmanaged; a measured owner response reads as character.
3. **Dispute the YellowPages "permanently closed" flag** (or rebuild the listing fresh) with matching NAP.
4. **Kill the ghost domain:** garagecar.ca is dead but still indexed as "Home - 2240 Speedshop." Re-register and 301 it to the new site if recoverable; retire info@garagecar.ca.
5. **Build the missing citation network** — the shop is absent from Yelp, BBB, Bing Places, Apple Maps, Facebook (business), 411.ca, and every auto directory checked. That absence is also an advantage: a clean, controllable slate with only one toxic snippet to outrank. Identical NAP everywhere: "2240 Speed Shop, 2009 91 Ave NW, Edmonton, AB T6P 1L1, 780-999-6450."
6. **Launch the review engine** with the site: QR pickup card + SMS follow-up; target 20+ reviews; owner responds to 100% within 48 hours.
7. **Bury the snippet:** fresh site pages, build logs, citations, press-worthy builds, and review volume push the fossil off the first page of brand searches — the only mechanism that works on deleted-source content.

---

## 4. Market & Competitor Landscape

### 4.1 The strategic headline

Across 40+ shops surveyed and 9 torn down page-by-page: **nobody in the Edmonton metro cleanly owns 2240's combined position** — vintage restoration + custom builds + performance under a "speed shop" brand. The market is balkanized: JDM (SSS), diesel (six dedicated shops), Euro (Eurotekk/Autobahn), parts retail (JBs), general repair (Park group), and a vintage niche full of shops with 2015-era websites and zero content.

### 4.2 Who actually holds the SERPs (sampled live, Aug 2, 2026)

| Query | Who ranks | Read |
|---|---|---|
| classic car restoration Edmonton | Alignable directory #1, Yelp, a gallery page, weak shop pages | **The biggest prize on the board** — directories rank #1 for 2240's core $30K–$120K service |
| restomod Edmonton / Alberta | Only R3 (Calgary) + US shops | **Completely unclaimed in Edmonton** |
| LS swap / engine swap Edmonton | Kijiji, forums, Facebook groups — **no shop at all** | Forums literally beg for recommendations; high-ticket work |
| hot rod shop Edmonton | Facebook pages in the top 5, Sideshow | Facebook pages ranking = wide open |
| speed shop Edmonton | JBs Power Centre via a bare *About Us* heritage page | It is 2240's literal name; JBs is a retailer, not a builder |
| muscle car restoration Edmonton | A competitor's *gallery page* at #1 | No optimized page exists in the city |
| classic truck restoration / C10 Alberta | Kijiji and eBay listings | Wide open; classic-truck values booming |
| dyno tuning Edmonton | A **free Wix one-pager at #1** | Flashing weak-SERP signal |
| ECU tuning Edmonton | **Two Wix sites + a UK doorway page** | Embarrassingly weak |
| carburetor rebuild Edmonton | Forums and mail-order | The classic-service wedge nobody claims |
| restoration cost/worth-it questions | **100% US content; zero Canadian answers** | Every prospect researching costs finds no Alberta answer — yet |

### 4.3 Skip zones (deliberate non-fights)

- **Diesel performance Edmonton** — six entrenched specialists (Big Rig, Superior, Adrenaline, Revolution, OCDiesel, Steve's). One exception worth keeping: *classic* diesel truck restoration (7.3 IDI, 12-valve) is the single diesel angle nobody owns and matches "LS/diesel conversions."
- **Subaru/WRX/JDM** — SSS Motorsports and Ronin own it; importer ecosystem entrenched.
- **BMW/Audi/Euro tuning** — Eurotekk dominates with dedicated pages.
- **Lift kits** — a truck-shop war with no vintage angle.

These stay long-tail/blog-only. Fighting specialists on their head terms burns months; taking unclaimed ground takes weeks.

### 4.4 The competitors that matter, and their exploitable weaknesses

**Tier leaders (the "big three"):**

- **JBs Power Centre** (since 1966, "founded as a small Edmonton speed shop") — SERP giant on parts retail; owns the "speed shop Edmonton" narrative via heritage. But: empty H1 tags, no LocalBusiness schema, installs are phone-quote-only, mixed service reviews, and they rank for *buying things, not doing things*. Flank, don't fight: own every "service verb + Edmonton" query and be the shop that installs what JBs sells.
- **Park Muffler / Park Performance / Player 3** (Sherwood Park, 4.7 stars / ~1,900 reviews) — the review fortress with real service-silo SEO. But: the brand ceiling says muffler-radiator-brakes; the performance crown jewel (Player 3's LS/Hemi tuning, Texas Speed dealership) is buried on a GoDaddy site whose homepage H1 is "Photo Gallery"; the 115-post blog was batch re-dated Nov 2025 and is frozen; no dyno story; Sherwood Park address weakens Edmonton-proper map-pack reach.
- **SSS Motorsports** (4.6/105) — the closest full-service rival and the model to beat: dyno + fabrication + builds + restoration. But: one-to-three-sentence service pages, homepage title tag with zero keywords, dead blog (7 posts, two batch dates), zero on-site reviews, no pricing, no FAQ, 1.58 MB homepage, and JDM branding that self-deselects every classic/domestic owner.

**The vintage-niche direct rivals:**

- **The Iron Garage** (Stony Plain) — the closest whole-business analogue (classic builds + "Iron Edition" packages + Dynojet dyno + published dyno pricing). But: not one geo keyword in any title, "performace" typo shipped sitewide, zero schema, no robots.txt or sitemap, no blog, 2016 front-end, and a location outside the Edmonton core. Their staged-package concept is their smartest asset — worth adapting as a 2240-branded package line.
- **Sideshow Fabrication & Paint** (4.7/45, ranks #1 for "hot rod shop Edmonton") — the strongest digital operator in the niche, and they still: abandoned their blog after two posts in early 2024, show no review schema, have no per-build pages, no pricing, and an 805 KB Wix homepage.
- **Wadson's Hot Rods** (since 1979; the best story in Edmonton hot-rodding — Wheeler Dealer speed shop roots, a dragster in the Reynolds-Alberta Museum) — reputation moat, digital afterthought: no H1 on the homepage, no geo terms, 9 pages total, schema hours that contradict the site, a 40-car portfolio with no text, and near-zero visible Google reviews after 47 years.
- **Acceleration Auto & Performance** (4.6/~66) — deep capability (3,000 hp dyno, LS/Hemi swaps) and the market's only real published pricing (Hellcat stages $3,795–$9,995). But: homepage title is literally "Home," empty meta description, zero schema, test pages in the sitemap, 2014-era design.
- **Promax Performance** — cautionary tale and immediate opening: the website is **effectively dead** (TLS handshake failures; HTTP serves the default IIS page; last full capture Aug 2022; analytics dark since 2024). Their residual rankings run purely on 20 years of citations — every click is a conversion black hole. Their machining/engine-build demand is claimable now.
- **Horsepower Solutions** — premier hub-dyno tuner whose domain repeatedly failed DNS in Aug 2026. If it stays dark, their tuning equity is up for grabs.
- **CCMR Performance** (Spruce Grove) — the one tuner marketing *carbureted classic* packages (2240's clientele). But: sitemap points at a dead legacy domain, crawl-delay 60 throttling crawlers, no meta description, hand-pasted testimonials contradicted by visible forum disputes, closed weekends.

### 4.5 What nobody in the entire market has (the seven-gap opening)

1. Service pricing transparency (Iron Garage's dyno card and Acceleration's Hellcat stages are the only exceptions).
2. Online booking done well (one Wix Bookings install; otherwise phone-only).
3. AutoRepair schema with aggregate ratings — **rich-result stars are unclaimed across the whole competitive set**.
4. A living, localized blog — the three most relevant vintage rivals have published two posts, combined, ever.
5. Multi-segment positioning (every incumbent is locked in one vertical).
6. A modern fast site — the tier leaders run a 1.6 MB Squarespace, a 730 KB Shopify, and 2018 WordPress builders; Core Web Vitals is an open scoring lane.
7. FAQ/answer-engine content — one embryonic FAQ block exists in the entire market; AI-search answers for Edmonton are up for grabs.

The rebuild ships all seven on day one.

---

## 5. Keyword Strategy — Clusters Mapped to Pages

Volumes are directional estimates for the Edmonton CMA pending Search Console validation; competition ratings come from live SERP sampling, not tool guesses.

### 5.1 Site architecture (search data decides the hierarchy, per the brief)

```
Homepage ............... speed shop Edmonton · customs and classics (identity terms)
├── /restoration ....... classic car restoration Edmonton (CORE — biggest prize)
├── /restomods ......... restomod Edmonton/Alberta + custom builds + hot rods (UNCLAIMED)
├── /engine-swaps ...... LS swap / engine swap / performance engine builds (UNCLAIMED)
├── /classic-service ... carburetor rebuild/tuning, brakes, ignition, electrical (WEDGE)
├── /performance ....... performance upgrades, tuning, exhaust (secondary, capability-true)
├── /body-interior ..... rust repair, metal fab, paint, classic upholstery
├── /builds/[slug] ..... one URL per project — "1972 Chevy C10 frame-off — Edmonton"
├── /areas/[city] ...... Sherwood Park first, then St. Albert, Leduc/Nisku, Spruce Grove,
│                        Fort Saskatchewan — unique local content, never doorway spam
├── /segments/[lane] ... segmented audience pages (below)
└── /blog .............. 50-post plan from a 104-topic researched bench
```

### 5.2 The 12 keywords to win first (fit × SERP weakness × job value)

| # | Target | Why now |
|---|---|---|
| 1 | classic car restoration Edmonton (+ GBP "near me") | Core service, $30K–$120K jobs, directories rank #1 today |
| 2 | restomod Edmonton / restomod shop Alberta | Zero Edmonton incumbents; premium buyers; on-trend |
| 3 | muscle car restoration Edmonton | A gallery page holds #1 |
| 4 | LS swap / engine swap Edmonton | No shop ranks; forums beg for recommendations |
| 5 | custom car builds + hot rod shop Edmonton | Facebook pages rank; identity terms |
| 6 | speed shop Edmonton | The shop's literal name; only JBs' About page competes |
| 7 | classic truck restoration / C10 & square-body Alberta | Kijiji ranks; values booming |
| 8 | classic car restoration cost Canada/Alberta (content) | Zero Canadian content exists; AI-answer magnet |
| 9 | carburetor rebuild/tuning Edmonton | Weak SERP; pulls classic owners into the shop |
| 10 | ECU tuning Edmonton | Wix sites at #1 — claim only if capability is real |
| 11 | classic car restoration Sherwood Park (+ suburb set) | Shop physically borders Sherwood Park; SERP is YellowPages-only |
| 12 | performance engine build Edmonton | Bridges classics and performance; one weak incumbent page |

### 5.3 The segmented-audience pages (brief requirement, research-tuned)

The brief calls for dedicated, separately-SEO'd segment landing pages. The SERP data refines how each is fought:

- **Classics & muscle (the lead segment):** full pillar treatment — this is the shop's identity and the weakest SERP. Vehicle-specific pages where SERPs are open: Mustang restoration Edmonton (only parts e-commerce ranks today), Camaro, Mopar, C10/square-body, F100, Bronco/Blazer.
- **Truck/diesel:** lead with *classic* trucks and classic-diesel restoration (the one diesel angle nobody owns); modern diesel performance stays blog-only — six specialists own those heads.
- **Euro:** a "classic European" page (MG, restoration for vintage Euro — the Alignable copy literally opens with MG) rather than fighting Eurotekk on modern German tuning.
- **JDM:** long-tail only (cold-climate JDM care content); SSS owns the head terms. The page exists to catch the segment, not to fight the specialist.

This honors the brief's all-segments mandate while spending effort where the research says it pays.

### 5.4 The content moat (blog fuel)

104 researched topics/families feed the 50-post plan with headroom. The four defensible clusters:

1. **Alberta legal & regulatory** (18 topics) — exhaust noise laws and Edmonton's $1,000 fine, lift rules, tint, insurance declaration, out-of-province inspections, antique plates, salvage-to-rebuilt. SERPs are 2005 forum archives and news stories; the answers are provincial, so national content *cannot* compete.
2. **Real costs in CAD** (14 topics) — restoration cost, LS swap cost, engine build cost, respray cost. Every cost SERP checked was US-priced; publishing honest Edmonton ranges wins the query and pre-qualifies leads.
3. **Winter × classics** (14 topics) — storage, spring startup, carbureted cold-start, block heaters, salt/calcium-chloride protection. National content cannot credibly speak to minus-40; this cluster is 2240's unfair advantage and recycles annually.
4. **Local culture & motorsport** (12 topics) — Edmonton car-meet calendar, RAD Torque Raceway first-timer guides (capture "Castrol Raceway" legacy searches too), Radium show content, Edmonton speed-scene history. Link magnets that no aggregator serves.

Proven locally: a diesel shop's blog ranks for generic "dyno tuning Edmonton" and a competitor blog post outranks established exhaust shops — content demonstrably wins these SERPs.

---

## 6. AI-SEO Day-One Checklist

Search is now two surfaces: classic Google and AI answer engines (AI Overviews, ChatGPT, Perplexity, Gemini, Copilot). 45% of consumers now use AI tools to find local businesses; ChatGPT referrals convert ~9x better than organic; and AI platforms recommend only ~1.2–7.4% of business locations — scarce visibility, and no Edmonton shop is pursuing it. The rebuild ships both surfaces from day one.

**A. Technical shell**
- Server-rendered/static pages — no AI crawler except Googlebot executes JavaScript; all content and JSON-LD in raw HTML (the Next.js build satisfies this by design; the 3D hero degrades gracefully)
- Core Web Vitals green on mobile: LCP < 2.5s, INP < 200ms, CLS < 0.1 — trivially beats every competitor's bloated builder stack
- robots.txt explicitly allowing AI retrieval and training agents (OAI-SearchBot, PerplexityBot, GPTBot, ClaudeBot, Google-Extended) + clean XML sitemap submitted to **both** Google Search Console and Bing Webmaster Tools
- `llms.txt` at the root (30 minutes, zero risk, option value)

**B. Schema stack (validated pre-launch)**
- Sitewide `AutoRepair` node with stable `@id`, full NAP, geo matching the GBP pin, hours, `sameAs` to every profile, `knowsAbout` (classic car restoration, engine swaps, restomod builds…), and an `OfferCatalog` of services
- Per-page `Service` schema with price anchors where possible — AI engines favor concrete numbers
- `FAQPage` on the FAQ hub and service pages (visible text = schema text, worded as real prompts)
- `Person` schema for Terry on the About page; `BreadcrumbList` sitewide; `VideoObject` for any build video; truthful GBP-synced `aggregateRating` only once real reviews exist — never fabricated

**C. Entity infrastructure (same week as launch)**
- Canonical NAP frozen and reproduced character-for-character everywhere
- GBP rebuilt (Section 3); **Bing Places** imported from GBP — ChatGPT and Copilot run on Bing's index, and 2240 currently does not exist there
- **Yelp.ca claimed and completed** — Yelp's July 2026 licensing deal puts its listings directly inside ChatGPT answers, and Perplexity already uses Yelp's API; this went from optional to mandatory this summer
- Apple Business Connect, Facebook business page, 411.ca, and ~10 core citations; Alignable profile linked into the graph
- An About page that reads like a Wikipedia stub: founded, owner, address, specialties, notable builds — machine-checkable facts

**D. E-E-A-T for a trade business**
- Terry named, pictured, credentialed; AMVIC licensing displayed (a uniquely strong Alberta trust signal); build galleries with dates, specs, and hour counts; real photos only
- Answer-first content patterns: question-format headings (3.4x more likely to be extracted), comparison tables (2.5–4.2x more citations), 40–60-word answer blocks, concrete numbers, visible updated dates
- Ongoing: weekly GBP posts and review velocity, monthly photo drops and one outreach action (listicle inclusions — the #1 cited page type in ChatGPT at ~44% of citations), genuine Reddit participation, and a quarterly AI-visibility audit running 20 target prompts across engines

---

## 7. The Pitch Narrative — Why Terry Says Yes

### 7.1 Before / after

| Today | With the rebuild |
|---|---|
| GoDaddy template with typos in its own tagline | Cinematic 3D shop drift-through over server-rendered pages that load instantly |
| One page; services invisible; blog is 3 words and a stock photo | Pillar pages for every service line, per-build project pages, 50-post content plan researched and ready |
| 2.7 stars, zero responses, "permanently closed" on YellowPages | Managed profile, review engine, citation network, the flag disputed, the average climbing with every job |
| Logo is an 822 KB photo of a JPEG; the real badge lives only on the building | The rusted-steel badge vectorized — sign and site finally the same brand |
| Site and Instagram don't know each other exists | Live IG build gallery on-site; every channel feeding the entity graph |
| Invisible to ChatGPT, Perplexity, and AI Overviews | Schema, Bing, Yelp, and answer-first pages engineered for the surface where 45% of customers now look |
| Nothing to send a lead | A quote/booking form with service picker, vehicle details, and photo upload |

### 7.2 What Terry actually gets

1. **Deliverable 1 — the live demo site.** Not a mockup: a working site on a real URL, built on his actual brand — the badge, the D100, the corrected tagline, his voice. The demo does the talking.
2. **Deliverable 2 — this research package.** The full audit, reputation sweep, keyword universe, AI-SEO playbook, and nine competitor teardowns. Even before signing, Terry holds a document no Edmonton competitor has ever commissioned about themselves.
3. **A reputation rescue**, not just a website — the GBP takeover, review engine, and citation repair that turn 2.7 into 4+ and bury the one toxic snippet.
4. **A market claim:** restomod Edmonton, LS swap Edmonton, classic truck restoration Alberta — unclaimed today, his if he moves first. The research shows the door open; the site walks through it.
5. **His brand, leveled up — never replaced.** The play is explicitly "this is YOUR brand": same badge, same voice, same shop; finally presented at the level of the work.

### 7.3 The honest close

Terry's work already sells itself in person — "go meet with Terry, look at the work firsthand" is a real review. The internet is the only place the shop loses. Every competitor with worse craft and a better website is taking leads that should be his. The demo shows exactly what fixing that looks like; this report shows the depth behind it; and the reputation plan fixes the one thing a website alone cannot.

---

## 8. Risks & Open Questions

**Operational / delivery**

1. **Hostinger VPS SSH unreachable** — VPS 1277677 had port 22 down as of July 2026; fix is Matt-only via the Hostinger browser console/root reset. Fallback (proven): managed Node hosting. Decide before demo deploy day.
2. **Timeline is THIS WEEK** — pitch-ready wow site in days, polish after. Scope discipline: hero + core pages + quote form + gallery; the 50 blogs ship as outlines, not posts (per the locked brief).
3. **No CMS for v1** — developer-managed by design; CMS decision deferred until after they sign.

**Brand & assets**

4. **No clean logo exists** — the vectorization of the physical badge is unbudgeted design work inside the sprint; the badge photo quality determines effort.
5. **Getty stock image** on the current blog is licensed only through GoDaddy — must not be reused. All other imagery verified as the shop's own.
6. **Media are rips for this phase** (site, IG, Threads, public sources) — a real photo shoot (Nathan Lajeunesse / JG Photography are warm contacts) happens after they bite.
7. **Tagline typo fix must be pitched with care** — it's Terry's line; the pitch frames it as polishing his words, not correcting them.

**Reputation & platform access (all need Terry's cooperation post-signing)**

8. **GBP access** — the entire reputation plan gates on Terry granting or claiming Google Business Profile management. Without it we can fix the website but not the 2.7.
9. **The insider dispute** — the theft allegation reads as a personal fallout, not a customer complaint. Never engage it publicly, never mention it in the pitch unprompted; the strategy is exclusively burial by volume. If Terry raises it, we have the plan ready.
10. **YellowPages dispute** requires the owner's participation to prove the business is open.
11. **Threads is private** (30 followers) — invisible social proof; switch to public or retire it. One-minute fix, needs Terry's thumb.
12. **Name variants in the wild** ("2240 Speed Shop" / "2240 Speedshop" / customer typo "2440") — canonical form must be frozen with Terry before any citation work.
13. **Hours conflict** (GBP says Saturday open; site says closed) — verify the truth with Terry; competitors close weekends, so if Saturday is real, it's a differentiator worth advertising.

**Domains & technical unknowns**

14. **garagecar.ca re-registration** — dead but still indexed with residual brand equity and possible stray backlinks. Check availability; re-register and 301 if cheap. Risk: a squatter takes it first.
15. **2240speedshop.com migration** — demo runs on a Hostinger subdomain; post-signing migration to the real domain needs GoDaddy access from Terry and clean 301s.
16. **Verify before shipping NAP anywhere:** exact legal name, address format, postal code, and hours — every citation must match character-for-character.
17. **ECU/dyno capability check** — the "ECU tuning Edmonton" SERP is winnable, but the page ships only if the service is real. The site must never claim capability the shop can't deliver; E-E-A-T and Terry's reputation both depend on it.
18. **Watch-list:** if Promax fixes its dead site or Horsepower Solutions' domain returns, their citation-aged domains become dangerous again; if SSS ever adds real copy to its thin pages, the content window narrows. First-mover speed is itself the mitigation.

---

*End of master report. Companion documents: 00-brief.md (locked brief) · 01-research/ (site audit, reviews, social) · 03-seo/ (keyword universe, blog keywords, AI-SEO playbook, competitor overview + teardowns 1–3) · 04-blog-plan/ · 05-concepts/.*
