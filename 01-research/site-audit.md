# 2240 Speed Shop — Full Site Audit
**Audit date:** August 2, 2026
**Live site:** https://2240speedshop.com
**Auditor method:** Raw HTML capture + rendered-DOM inspection (desktop browser) + sitemap/robots crawl + Wayback Machine + external corroboration (YellowPages, Instagram, Threads, web search).

---

## 1. Executive Summary

The current 2240speedshop.com is a **single-page GoDaddy Website Builder template site** launched around **March 23, 2026** (sitemap lastmod + only blog post date). It replaced a fuller WordPress site at **garagecar.ca** (BeTheme, live ~Mar 2024 – Aug 2025, domain now DNS-dead but still indexed in Google). The current site has essentially **zero SEO infrastructure**: no schema markup, no analytics, no service pages, a placeholder blog, a broken store URL in its own sitemap, typos in the hero copy, and no links to its own social profiles. Meanwhile **YellowPages flags the business as "permanently closed"** — a citation emergency for local SEO. The good news: the business has a real, distinctive identity (vintage/classic customs, hot rods, LS/diesel conversions), real photos, a real Edmonton address, and a nearly clean slate to build on.

**Owner/principal (from socials):** "Terry M" (Instagram & Threads display name).

---

## 2. Site Discovery & Page Inventory

### robots.txt (https://2240speedshop.com/robots.txt)
```
User-agent: *
Disallow: /404
```
- No `Sitemap:` directive (missing basic).

### Sitemap index (https://2240speedshop.com/sitemap.xml)
Child sitemaps:
- https://2240speedshop.com/sitemap.website.xml → 1 URL: `https://2240speedshop.com/` (lastmod **2026-03-23**)
- https://2240speedshop.com/sitemap.blog.xml → 1 URL: `https://2240speedshop.com/f/cutting-edge-automotive-solutions`
- https://2240speedshop.com/sitemap.ols.xml → 1 URL: `https://2240speedshop.com/ols/products` — **returns HTTP 404 ("Invalid Widget Data Requested")**. The online-store module is in the sitemap but disabled/broken.

**Total real pages: 2** (homepage + one placeholder blog post). No other internal pages exist (`/about`, `/services` etc. return hard 404s — correct status codes, at least).

### Redirect / protocol health
- `http://2240speedshop.com/` → **308** → `https://2240speedshop.com/` ✅
- `https://www.2240speedshop.com/` → **301** → `https://2240speedshop.com/` ✅ (apex is canonical host)
- `/favicon.ico` → **404** (no fallback favicon; only apple-touch-icon links)

---

## 3. Page-by-Page Detail

### 3.1 Homepage — https://2240speedshop.com/
- **`<title>`:** `Automotive Performance Enhancements at 2240 Speed Shop`
- **Meta description:** `Rev up your performance with 2240 Speed Shop - your go-to source for automotive performance enhancements and custom builds.`
- **Canonical tag:** **MISSING** on homepage (present on blog page).
- **og:title:** `2240speedshop.com` (weak — domain, not brand name)
- **og:description:** same as meta description
- **og:image:** `https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_1954.PNG`
- **og:locale:** `en_CA`; **twitter:card:** `summary`; twitter:description: `Rev Up Your Performance`
- **H1:** `Rev Up Your Performance`
- **Headings (rendered order):**
  - H1 "Rev Up Your Performance" (hero, over video-poster background)
  - H2 "Introducing 2240 Speed Shop" / H2 "COMPLETE RESTORATIONS AND SPECIALIZING IN CUSTOM BUILDS"
  - H2 "Contact Us" / H4 "Hours"
  - H2 "Dont Save Your Dreams for sleep ...REVIVE YOU RIDE" *(sic — two typos: "Dont" and "YOU RIDE")*
  - H2 "About 2240speedshop.com" with H3s "Our Mission", "Our Team", "Our Products"
  - H2 "Subscribe" / H2 "Blog"
- **CTA:** "JOIN THE LAUNCH" button — **links to `/` (itself, does nothing)**.
- **Body copy (verbatim, complete):**
  - Intro/Mission (used twice on the page, word-for-word duplicate): *"At 2240 Speed Shop, we are committed to providing innovative automotive solutions, including Complete Vehicle Restorations and custom builds. Our emphasis is on improving performance and efficiency through performance upgrades for automotive enthusiasts and professionals, especially those who have a passion for Vintage vehicles."*
  - Our Team: *"Our team comprises experienced professionals who are passionate about providing top-notch automotive solutions. We are dedicated to delivering exceptional service in Complete Vehicle Restorations, custom builds, performance upgrades, and enhancements for Vintage cars."*
  - Our Products: *"We provide a diverse range of high-quality automotive solutions tailored to meet our customers' needs. Whether you're looking for basic performance upgrades, Complete Vehicle Restorations, or unique custom builds, we have options for everyone, especially Vintage enthusiasts."*
- **Contact block:** name shown as "2240speedshop.com", address, phone (tel: link), email (mailto: link), collapsible hours widget, "DROP US A LINE!" contact form (Name, Email*, file attachments, reCAPTCHA-protected, Send), "GET DIRECTIONS" link.
- **Photo gallery carousel** (no heading): 5 images (see asset table).
- **Subscribe:** email newsletter signup ("Email" + "SIGN UP").
- **Blog feed:** shows the single post — "March 23, 2026 / Cutting-Edge Automotive Solutions / Continue Reading".
- **Footer:** `Copyright © 2026 2240speedshop.com - All Rights Reserved.` + "Powered by GoDaddy" link. Cookie banner ("This website uses cookies… ACCEPT").
- **External links on page:** Google privacy/terms (reCAPTCHA notices), GoDaddy promo link, `tel:7809996450`, `mailto:2240speedshop@gmail.com`. **No social media links anywhere.**

### 3.2 Blog post — https://2240speedshop.com/f/cutting-edge-automotive-solutions
- **`<title>`:** `Cutting-Edge Automotive Solutions`
- **Meta description:** `Innovative Automotive Insights`
- **Canonical:** present, self-referencing.
- **og:image / featured image:** `https://img1.wsimg.com/isteam/getty/2156517235` — **licensed Getty stock photo via GoDaddy** (cannot be reused off-platform).
- **Post data (from embedded `window._BLOG_DATA`):** date `2026-03-23T21:46:34.177Z`, slug `cutting-edge-automotive-solutions`, commenting hidden/disabled, categories: none.
- **Entire post content (verbatim, complete):** `Innovative Automotive Insights` — **a 3-word placeholder. The blog is empty in practice.**
- The page otherwise server-renders the same one-page content as the homepage (GoDaddy renders post content client-side into an overlay).

### 3.3 Store — https://2240speedshop.com/ols/products
- **HTTP 404**, body: "Invalid Widget Data Requested". Listed in sitemap.ols.xml. Either an abandoned "Online Store" trial or a disabled module. Should be removed from the sitemap or built out.

---

## 4. NAP & Business Facts

| Field | Value | Source |
|---|---|---|
| Business name | 2240 Speed Shop (site sometimes shows "2240speedshop.com") | site |
| Address | 2009 91 Avenue, Edmonton, AB, Canada | site contact block |
| Full address w/ postal | 2009 91 Ave NW, Edmonton, AB **T6P 1L1** | YellowPages listing + legacy garagecar.ca footer |
| Phone | **780-999-6450** (`tel:7809996450`) | site, legacy site, YellowPages |
| Email (current) | **2240speedshop@gmail.com** | site |
| Email (legacy, dead domain) | info@garagecar.ca | archived garagecar.ca |
| Hours | **Mon–Fri 09:00 a.m. – 05:00 p.m.; Sat & Sun Closed** | rendered hours widget (expanded in browser) |
| Owner/principal | "Terry M" (display name on IG & Threads) | instagram.com/2240speedshop, threads.com/@2240speedshop |
| Instagram | @2240speedshop — bio "2240 speed shop customs and classics", 242 followers, following 3,858, posts Dec 2024–Sep 2025 | Instagram |
| Threads | @2240speedshop (Terry M) | Threads |
| Facebook (legacy link) | https://www.facebook.com/sherwoodparkclassics ("View more on Facebook" on old site) | archived garagecar.ca |
| Years in business | **Not stated anywhere.** Earliest digital footprint: garagecar.ca captures from Mar 19, 2024 | Wayback |
| Certifications / team names | **None published anywhere** | — |
| Pricing | **None published anywhere** (current or legacy site) | — |

### ⚠ Critical citation problem
YellowPages.ca listing (2240 Speed Shop, 2009 91 Ave NW, T6P 1L1) is flagged **"This merchant is permanently closed"** and its detail page has been removed (https://www.yellowpages.ca/bus/Alberta/Edmonton/2240-Speed-Shop/104369727.html now 403/redirects to search). If Google has ingested this signal, it can suppress or mark the Google Business Profile. Reclaiming/correcting citations is a P0 for local SEO.

---

## 5. Services

### 5.1 Current site (exact wording — this is ALL it says)
- "Complete Vehicle Restorations"
- "custom builds"
- "performance upgrades" / "Automotive Performance Enhancements"
- "enhancements for Vintage cars" / passion for "Vintage vehicles"

No pricing, no service detail, no individual service pages.

### 5.2 Legacy garagecar.ca (archived Aug 15, 2025) — the real service taxonomy, in their own words
Hero/slider services list:
- "Hand Built Customs & Classics"
- "Repairs & Restoration"
- "LS/Diesel Conversions"
- "Restoration"
- "Motor Modifications"
- "Hot Rods"
- "Body Works"
- "Paint"
- "Classic Interior" (period-correct materials, leather upholstery, wood trim, vintage fabrics + discrete modern amenities)

Body-copy capabilities (verbatim phrases):
- "installing aftermarket parts, recalibrating ECU settings, and dyno testing"
- "custom turbocharger and supercharger systems to dramatically boost horsepower"
- "engine tuneups to give major horsepower gains", "Custom tuning", "Revised fueling, boost, timing"
- Safety upgrades for classics: "Upgrading brake systems, converting to radial tires, adding three-point belts, and installing electronic ignition and backup cameras", "Structural reinforcements"
- Positioning lines: "Classic cars hold a special place in the hearts of auto enthusiasts", "rolling works of art", "Our shop makes ordinary cars into speed demons", "From vintage muscle to modern sport sedans"

Contact-form "Service Type" dropdown (their own service categories):
1. Restorations
2. Mechanical Services
3. Auto Body
4. Fabrication
5. Car Sales
6. Parts & Accessories

**Nav on legacy site:** Home / About us / Gallery / Contact (subpages not captured by Wayback).

---

## 6. Tech Stack

### Current site (2240speedshop.com)
- **Platform:** GoDaddy Website Builder 8.0 — `<meta name="generator" content="Starfield Technologies; Go Daddy Website Builder 8.0.0000"/>`; widget bundle `UX.4.51.17.js`. Template look/feel; not exportable.
- **Hosting/CDN:** GoDaddy DPS (`Server: DPS/2.0.0-beta+sha-cb8eafb`, `X-SiteId: us-west-2`), AWS Global Accelerator IPs (13.248.243.5 / 76.223.105.230); all media on `img1.wsimg.com` CDN with on-the-fly transforms (`/:/rs=…/cr=…/qt=…`).
- **Analytics:** **GoDaddy's internal tracker only** (`tccl` data attributes + `scc-c2.min.js` "signals"). **No Google Analytics, no GTM, no Meta pixel, no Search Console verification tag visible.**
- **Schema.org markup:** **NONE. Zero JSON-LD, zero microdata.** No LocalBusiness/AutoRepair entity, no Organization, no logo markup.
- **Forms:** GoDaddy contact widget with Google reCAPTCHA; supports file attachments. Newsletter subscribe widget.
- **PWA manifest:** `/manifest.webmanifest` — name `2240speedshop.com`, `theme_color`/`background_color`: **#a02d2d** (dark red), icons generated from IMG_2943.jpeg.
- **Fonts loaded (6 families — bloated):** Abril Fatface, Archivo Black, Droid Sans, Montserrat, Muli, Source Sans Pro (all via wsimg gfonts).
- **Hero:** "video" background is served **only as static poster JPEG** (`/isteam/videos/uGbA6v1EwwF20VGXJ/…`) — no `<video>` element ever renders; no mp4/webm exists on the page.
- **HTML weight:** ~152 KB homepage document (inline CSS-heavy builder output).

### Legacy site (garagecar.ca — dead, still Google-indexed as "Home - 2240 Speedshop")
- WordPress **6.8.2**, theme **BeTheme 27.3.3**, plugins: **Slider Revolution 6.6.18**, **Forminator 1.29.0** (form ID 135), **WP WhatsApp** chat.
- Meta description was never set: "Just another WordPress site".
- 21 Wayback captures, Mar 19 2024 – Aug 15 2025. Domain now NXDOMAIN.

---

## 7. SEO State

### Strengths (few)
- Clean HTTPS with correct 301/308 host canonicalization to apex.
- Mobile viewport + responsive srcset images via CDN transforms.
- Images all have descriptive alt text (GoDaddy AI-generated, e.g., "Custom blue vintage pickup truck with lowered suspension and shiny rims.").
- Hard 404s return real 404 status codes.
- `en_CA` locale set; unique brandable domain; blog canonical present.
- Legitimately distinctive niche (vintage customs/restorations in Edmonton) with almost no on-site competition for their own brand terms.

### Weaknesses (extensive)
1. **One-page site** — no service pages, no about page URL, no gallery page, no location page. Nothing to rank for "engine rebuild Edmonton", "classic car restoration Edmonton", "LS swap Edmonton", etc.
2. **No structured data whatsoever** — no LocalBusiness/AutoRepair schema, no openingHours, no geo. (GBP-critical.)
3. **No analytics** (no GA4/GTM), so no measurement baseline; no Search Console evidence.
4. **Homepage missing canonical tag**; og:title is the bare domain; twitter:card only `summary`.
5. **Empty blog**: 1 post, 3 words of content, Getty stock image (unlicensed for reuse), created same day the site launched.
6. **Broken sitemap entry**: /ols/products 404s from their own sitemap; robots.txt lacks Sitemap line.
7. **Copy defects**: hero tagline typos — "Dont Save Your Dreams for sleep ...REVIVE YOU RIDE"; mission paragraph duplicated verbatim twice on the page; brand rendered as "2240speedshop.com" instead of "2240 Speed Shop" in headings.
8. **Dead CTA**: "JOIN THE LAUNCH" links to the homepage itself.
9. **No social links on the site** despite active Instagram/Threads; no Facebook/GBP links; socials likewise don't link back to the domain (IG bio has no website link) — zero link equity flowing either way.
10. **NAP gaps/conflicts**: site address omits "NW" and postal code T6P 1L1; **YellowPages says "permanently closed"**; legacy domain garagecar.ca dead but still indexed (its old title/desc still in SERPs), losing any accumulated equity — no redirect possible while DNS is dead (re-register & 301 if recoverable).
11. **Hours only render client-side** — server-rendered HTML shows a stale "Open today 09:00 a.m. – 05:00 p.m." even on weekends when the shop is closed; crawlers see the stale version.
12. **Asset hygiene**: logo/favicon is an 822 KB JPEG photo; `favicon.ico` 404s; 6 font families; hero "video" that never plays.
13. **No E-E-A-T signals**: no team names, no years in business, no certifications, no reviews/testimonials, no pricing, no FAQ, no portfolio pages (photos exist only in an unlabeled carousel).
14. **Newsletter + file-upload contact form with no privacy policy page** on-site (only Google's reCAPTCHA links).

### Quick-win list for the rebuild
1. Fix YellowPages "permanently closed" + claim/verify GBP; standardize NAP to "2240 Speed Shop, 2009 91 Ave NW, Edmonton, AB T6P 1L1" everywhere.
2. Ship AutoRepair/LocalBusiness JSON-LD with openingHoursSpecification, geo, sameAs (IG/Threads/FB).
3. Build out service pages from the legacy taxonomy (Restorations, Customs & Hot Rods, LS/Diesel Conversions, Motor Modifications & Tuning, Body & Paint, Classic Interiors, Fabrication, Parts & Accessories, Car Sales).
4. GA4 + Search Console; submit corrected sitemap; add Sitemap line to robots.txt.
5. Replace Getty stock with their own shop photography (they have real photos); fix typos; add owner story ("Terry M", customs and classics).

---

## 8. Design Notes (for the 5 concepts)
- Current palette anchor: manifest theme color **#a02d2d** (deep red) over dark garage photography.
- Display font: Abril Fatface / Archivo Black (template defaults, mixed).
- Real brand ingredients available: matte-green vintage car (IMG_1954 — their signature og:image), vintage black classic car, blue custom pickup, red vintage pickup with Texaco neon, stripped project-car frames, vintage motorcycle with neon sign, 3-person team photo (IMG_0446).
- Tagline raw material: "Don't save your dreams for sleep — revive your ride" (fix the typos and it's a genuinely good line), "customs and classics" (IG bio), "Rev Up Your Performance", legacy lines "rolling works of art" / "speed demons".

---

## 9. Complete Downloadable Asset List

All assets confirmed live (HTTP 2xx) on Aug 2, 2026 unless noted. Base URLs below return the **original full-resolution file**; the site serves resized variants by appending GoDaddy transform paths (`/:/rs=w:…,h:…/cr=…/qt=…`).

| Asset | Role on site | Approx size |
|---|---|---|
| IMG_2943.jpeg | Header logo, favicon/apple-touch icons, manifest icons ("2240speedshop.com" alt) | 822 KB |
| IMG_1954.PNG | Hero image + og:image + twitter:image — "matte green finish" vintage car wheel | 95 KB |
| uGbA6v1EwwF20VGXJ (isteam/videos) | Hero background "video" poster (JPEG only; no mp4 exists) | 73 KB |
| IMG_2950 (2).jpeg | Mid-page banner — vintage motorcycle with neon sign | 735 KB |
| IMG_0051.jpeg | "Our Mission" image + gallery — vintage black classic car in garage | 704 KB |
| IMG_0446.jpeg | "Our Team" image — three men, celebration table (candid team photo) | 758 KB |
| IMG_0434-e809ae1.jpeg | "Our Products" image — black muscle car, cartoon eyes on air intake | 647 KB |
| IMG_0401.jpeg | Gallery — stripped blue car frame in workshop | 663 KB |
| IMG_0402.jpeg | Gallery — classic car partially covered next to stripped frame | 572 KB |
| IMG_1949.PNG | Gallery — custom blue vintage pickup, lowered, shiny rims | 192 KB |
| IMG_0052.jpeg | Gallery — red vintage pickup, Texaco neon sign | 709 KB |
| getty/2156517235 | Blog featured image — **Getty stock, licensed via GoDaddy only, do NOT reuse** | 392 KB |
| Legacy (Wayback) | Old logo + 6 background-removed car cutout PNGs from garagecar.ca | various |

```
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_2943.jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_1954.PNG
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_2950%20(2).jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0051.jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0446.jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0434-e809ae1.jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0401.jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0402.jpeg
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_1949.PNG
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0052.jpeg
https://img1.wsimg.com/isteam/videos/uGbA6v1EwwF20VGXJ
https://img1.wsimg.com/isteam/getty/2156517235
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_1954.PNG/:/cr=t:0.25%25,l:0%25,w:99.5%25,h:99.5%25/rs=w:1177,h:2560,cg:true,m
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_2943.jpeg/:/rs=h:320,cg:true,m/qt=q:95
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_2943.jpeg/:/rs=w:180,h:180,m
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_2950%20(2).jpeg/:/cr=t:31.25%25,l:0%25,w:100%25,h:37.5%25/rs=w:1800,h:900,cg:true
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0051.jpeg/:/rs=w:1095,h:1095,cg:true,m/cr=w:1095,h:1095
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0446.jpeg/:/cr=t:12.5%25,l:0%25,w:100%25,h:75%25/rs=w:1095,h:1095,cg:true
https://img1.wsimg.com/isteam/ip/e71189ab-46a8-4c06-829c-d6b827151e47/IMG_0434-e809ae1.jpeg/:/cr=t:12.5%25,l:0%25,w:100%25,h:75%25/rs=w:1095,h:1095,cg:true
https://img1.wsimg.com/isteam/videos/uGbA6v1EwwF20VGXJ/:/rs=w:1920,m
https://img1.wsimg.com/isteam/ip/static/transparent_placeholder.png/:/rs=w:365,h:365,cg:true,m,i:true/qt=q:1/ll=n:true
https://2240speedshop.com/manifest.webmanifest
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/cropped-cropped-Screenshot-2024-01-20-172235-Copy-1-192x192.png
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/IMG_1476-removebg.png
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/IMG_1477-removebg.png
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/IMG_1480-ai-brush-removebg-vrave4k8-1.png
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/IMG_1487-removebg.png
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/IMG_1491-removebg.png
http://web.archive.org/web/20250815003452im_/https://garagecar.ca/wp-content/uploads/2024/01/IMG_1552-removebg-1.png
```
