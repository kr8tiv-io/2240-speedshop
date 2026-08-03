<div align="center">

# 2240 SPEED SHOP — *Midnight Garage*

### Most shop websites list services. This one turns the lights on and walks you through the bay.

A **spec-built rebuild** for [2240 Speed Shop](https://2240speedshop.com) — Terry Harmider's customs-and-classics garage on the Sherwood Park line in Edmonton, Alberta. A scroll-driven 3D night garage rendered in React Three Fiber, wrapped around **33 server-rendered pages** engineered so every high-value keyword in the Edmonton market has exactly one owning page.

> **The art never holds the SEO hostage.** No AI crawler except Googlebot executes JavaScript — so every word, every table, and every line of JSON-LD ships in the server payload. The WebGL is `aria-hidden` decoration over a photograph. Kill the canvas and the site still ranks.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-f2f0ec?style=flat-square&labelColor=0b0b0d)](https://nextjs.org)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.x-e04545?style=flat-square&labelColor=0b0b0d)](https://r3f.docs.pmnd.rs)
[![Pages](https://img.shields.io/badge/pages-33_prerendered-c7c9cc?style=flat-square&labelColor=0b0b0d)](#the-sitemap--one-keyword-one-owner)
[![Schema](https://img.shields.io/badge/schema-AutoRepair_+_FAQ_+_Service-ffb066?style=flat-square&labelColor=0b0b0d)](#the-machine-readable-layer)
[![Build](https://img.shields.io/badge/build-passing-a02d2d?style=flat-square&labelColor=0b0b0d)](#running-it)

[The concept](#the-concept) · [Why it's built this way](#why-its-built-this-way) · [Sitemap](#the-sitemap--one-keyword-one-owner) · [Research](#the-research-behind-it) · [Run it](#running-it) · [Deploy](#deploying)

</div>

---

## The concept

**Midnight Garage** was chosen from five written directions. The others — *Rust & Chrome*, *The Showroom Floor*, *Night Shift*, *The Build Sheet* — live in the research repo and were raided for parts.

The homepage opens on a photograph of the shop's 1960s Dodge D100 with the headline over it. Then the breaker thunks: three tungsten work lights bloom on in sequence, corrugated walls resolve out of the dark, and a red neon **2240** flickers alive over the bench. As you scroll, the camera drifts one continuous dolly path through the bays — it never cuts. Each station is a service section, and each section deep-links to the page that owns its keyword.

Every design decision traces to something real about the shop:

| Element | Where it came from |
|---|---|
| `#a02d2d` speed red | The live site's own PWA manifest `theme_color` — their actual brand colour |
| The steel badge | Their physical laser-cut, rusted-steel storefront sign. No digital logo existed anywhere |
| The D100 hero | A passing photographer pulled over mid-drive to shoot the light patch on its hood |
| Classic-rock energy | Terry's reels are scored to Metallica, AC/DC, Guns N' Roses |
| "Revive your ride" | Their own tagline, with the typos fixed |
| Copy voice | Terse gearhead. *"Rust dies here."* Not "innovative automotive solutions" |

## Why it's built this way

**The canvas is decoration. The HTML is the product.** The hero photograph is the LCP element — preloaded, dimensioned, graded. `GarageScene` mounts client-side only, absolutely positioned, `aria-hidden`, fading in behind it. Zero CLS. Phones, throttled connections, `prefers-reduced-motion` users, and every AI crawler get the photograph and the full copy.

**One keyword, one owner.** Research found the Edmonton market wide open — *"restomod Edmonton"* and *"LS swap Edmonton"* have **no ranking local shop at all**; forum threads beg for recommendations. Every cluster maps to exactly one page. No cannibalisation, no orphans, no page without a job.

**Answer-first everything.** Each page opens with a 40–60 word paragraph that directly answers what it is — the shape AI engines actually quote. Question-form H2s. Real tables. FAQ answers live in the HTML, not behind JS.

**Honest by construction.** [`lib/site.ts`](lib/site.ts) is the single source of truth for every business fact, and it carries only what was verified from live sources. No invented certifications, no fake years-in-business, no fabricated reviews, no aggregateRating gaming. Pricing appears as clearly-labelled indicative ranges — a market gap, since not one competitor publishes any.

## The sitemap — one keyword, one owner

```
/                                    speed shop Edmonton · custom car shop Edmonton
/services/                           classic car shop Edmonton
  ├─ classic-car-restoration/        classic car restoration Edmonton      <- #1 target
  ├─ restomods-custom-builds/        restomod Edmonton · hot rod shop      <- unclaimed
  ├─ engine-swaps-builds/            LS swap Edmonton · engine swap        <- no local shop ranks
  ├─ classic-performance-tuning/     carburetor rebuild Edmonton
  ├─ body-paint-metalwork/           classic car rust repair Alberta
  └─ classic-interiors-service/      classic car interior restoration Edmonton
/builds/                             custom car builds Edmonton
  └─ 1960s-dodge-d100/ + 4 more      one vehicle keyword each
/edmonton/                           classic car restoration near me
  └─ sherwood-park · st-albert · leduc-nisku · spruce-grove
/guides/                             the content pillars
  ├─ costs/                          classic car restoration cost Canada   <- zero Canadian content exists
  ├─ alberta-laws/                   modified car laws Alberta
  └─ winter/                         winter storage classic cars Alberta   <- the -40 moat
/about · /reviews · /faq · /quote · /contact
```

## The machine-readable layer

- **`AutoRepair` JSON-LD** with a stable `@id`, full `openingHoursSpecification`, `geo`, `areaServed`, `knowsAbout`, `sameAs`, and a `makesOffer` graph — every other node references the one entity.
- **`Service`, `FAQPage`, `BreadcrumbList`, `Person`** schema per page, from [`lib/schema.tsx`](lib/schema.tsx).
- **`robots.ts`** explicitly welcomes `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`. We *want* the citation.
- **`llms.txt`** stating the facts an answer engine should quote.
- **`sitemap.ts`** enumerating all 33 routes.

## The stack

| | |
|---|---|
| **Framework** | Next.js 16.2 App Router, Turbopack, TypeScript strict |
| **3D** | three.js · @react-three/fiber · drei · postprocessing (Bloom) |
| **Motion** | Framer Motion · Lenis smooth scroll |
| **Styling** | Tailwind v4 with `@theme` design tokens |
| **Fonts** | Bebas Neue · Archivo · Barlow · IBM Plex Mono, self-hosted via `next/font` |

The garage is built entirely from **three.js primitives** — no external model downloads, nothing to 404, works offline. Adaptive DPR, no shadows on narrow viewports, and a full static path under `prefers-reduced-motion`.

## Running it

```bash
pnpm install && pnpm dev
```

Then open <http://localhost:3240>. Production build:

```bash
pnpm build && pnpm start
```

## Deploying

Built to run anywhere Node runs. Target is a Hostinger VPS behind a reverse proxy on 443.

> **Note for that VPS:** `sshd` was found bound to port 443 *only*, which is both why SSH on 22 appeared dead and why nothing could ever serve HTTPS. Port 22 has been restored; free 443 before pointing a web server at it.

## The research behind it

This site is the second half of a two-part deliverable. The first half — competitor teardowns, the Edmonton keyword universe, an AI-SEO playbook, a 50-post content plan, and five written creative concepts — is what every design decision above is drawn from.

Headline findings that shaped the build:

- The existing site is a two-page GoDaddy template with **zero schema, zero analytics**, typos in its own tagline, and a call-to-action that links to itself.
- The shop's **real service taxonomy** (14 lines, including LS/diesel conversions) was recovered from their dead `garagecar.ca` domain via the Wayback Machine — the live site mentions almost none of it.
- **Reputation is the emergency**, not the design: 2.7 stars from 7 Google reviews, and a directory listing falsely flagging the business **permanently closed**.
- Three of the closest vintage-niche competitors have published **two blog posts between them** across roughly fifty years of trading.

---

<div align="center">

**A [kr8tiv](https://kr8tiv.io) build.**

<sub>Photography and brand marks belong to 2240 Speed Shop. This is unsolicited spec work built to earn the business.</sub>

</div>
