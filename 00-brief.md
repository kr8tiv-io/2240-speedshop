# 2240 Speed Shop — Rebuild Brief (locked 2026-08-02)

## BUILD DECISIONS (Matt, 2026-08-02)
- **Concept:** #1 MIDNIGHT GARAGE (3D drift-through) — raid the other concepts for their best parts (esp. Rust & Chrome's badge animation)
- **IA/flow:** #5 HYBRID HUB (from site-architecture-5-flows.md)
- **Hosting:** VPS — Matt authorized full-access fix of the SSH lockout via his machine + Hostinger API

Answers from Matt's 24-question discovery round. This is the source of truth for all planning docs in this folder.

## Deal & delivery
- **Relationship:** Spec pitch — build it to WIN them as a client (like the Shelley listing play). They don't know yet.
- **Domain:** Demo domain first (Hostinger subdomain/temp), migrate to 2240speedshop.com with 301s after they sign.
- **Hosting:** Matt's Hostinger VPS. ⚠ As of July 2026 VPS 1277677 had SSH port 22 unreachable (Matt-only fix via Hostinger browser console / root reset). Fallback: managed Node hosting (proven via evolvedmcp.cloud + ops dashboard).
- **Timeline:** THIS WEEK — strike fast. Pitch-ready wow site in days, polish after.
- **Pitch format:** Live demo URL + walkthrough one-pager AND the full SEO research package ("1 and 2") — the demo does the talking, the research shows the depth behind it.
- **Win metric:** Close them as a client. Site + SEO story so strong they can't say no.

## Tech
- **Stack:** Next.js + Three.js (R3F). Server-rendered pages = SEO-perfect; 3D showpiece hero; graceful mobile fallback.
- **CMS:** None for now — developer-managed. Decide on CMS after they sign.
- **3D concept:** Stylized shop interior — dark neon-lit garage (lift, dyno, toolboxes, car on hoist) from free/purchased GLB assets. Not a replica of their real shop (no site visit needed). Camera "drifts" through it on scroll.
- **Features:** Quote/booking request form (service picker + vehicle + photo upload) and live Instagram build gallery. No e-commerce, no financing calc for v1.

## Brand
- **Logo:** Keep theirs as-is. Extract cleanest version, vectorize if needed. "This is YOUR brand, leveled up."
- **Vibe:** Futuristic but converts — cinematic 3D + slick motion, every scroll lands on services/reviews/quote CTA.
- **Colors:** Build from THEIR existing branding (extract from logo/IG) and amplify.
- **Copy voice:** Gearhead authentic — real shop talk, no fluff, torque specs over marketing speak.

## Non-negotiables
- **Footer credit on EVERY page:** tiny text — `built with ❤ by kr8tiv` — linking to https://kr8tiv.io

## Market
- **Lead services:** Follow the search data — keyword research decides page hierarchy.
- **Audience:** All segments with dedicated segmented landing pages (Euro, JDM, truck/diesel, classics) — each SEO'd separately.
- **Service area:** Edmonton metro — Edmonton + Sherwood Park, St. Albert, Leduc, Spruce Grove, Nisku. City pages for each.
- **Insider intel:** None — research finds everything.

## Content (50 blogs)
- **Scope now:** OUTLINES ONLY — full briefs + outlines for all 50, written later (likely after they sign).
- **Depth:** Mixed by intent — 1,500–2,500w authority pieces for big keywords, punchy 800w answers for question queries.
- **Local mix:** ~60% Alberta-angled (laws, winters, Castrol Raceway, local culture) / 40% evergreen how-to.
- **Cadence:** Decide at build time.

## Assets & data
- **Media:** Rips only for this phase (site + IG + Threads + anything public). Real shoot after they bite.
- **SEO data:** Free data only (SERP analysis, autocomplete, competitor teardowns). Ahrefs connector exists but stays unauthorized.

## Folder map
- `01-research/` — site audit, reviews, social presence (workflow output)
- `02-assets/` — website / instagram / threads / logos / videos rips
- `03-seo/` — keyword universe, blog keywords, AI-SEO playbook, competitor overview + teardowns (workflow output)
- `04-blog-plan/` — the 50-blog plan
- `05-concepts/` — 5 written site concepts + 5 text/flow iterations
