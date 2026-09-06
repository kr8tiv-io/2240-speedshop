# Original garage photographs: earlier cache fill — 2026-09-06

Prepared release: `acce5c29994840cda346ff4e6119f2ea`.
Publication and final browser evidence are recorded below after verification.
Previous live release: `f89f11d92629434280962e1468514fcd`.
Exact rollback archive: `output/baseline-f89f.zip`, created from deployment
`8479a2663ebe3b8d5f390d9085558ee805b2d808` before preparing this candidate.
The previous source checkpoint is `32363d82ff09ba425d628bf22849b279247bcd57`.

## Cause and bounded change

The previous live cold tour waited for roughly 3 MB of office-wall photographs
requested only when station five mounted. Although they are in a later bay,
the final full-world reveal waits for that gallery. This added a late transfer
waterfall after earlier models and shaders were already preparing.

The only application-logic change is one call in the garage renderer's
`onCreated`: `useTexture.preload(Object.values(WALL_PHOTO))`. It starts the
existing seven full-resolution image requests after the existing hero and
garage-proximity gates. It is not a page-boot preload and it does not mount an
extra canvas, render a hidden second gallery, or upload a second GPU texture.

The installed drei/Fiber implementation uses the same ordered TextureLoader
cache key for this call and `OfficeGallery`'s existing `useTexture(WALL_PHOTO)`.
The existing gallery hook still owns GPU upload and the station warm-up still
owns its preparation. In-flight and completed cache entries are reused.

All original image files are byte-identical: seven files, **3,172,098 bytes**.
Browser-captured dimensions, sRGB colour space, anisotropy 8, min/mag filters
and mipmap generation match the previous build exactly. No model, resolution,
shader, lighting, reflection, effect, DPR, camera path, CSS, font, copy, CTA or
SEO metadata was changed. No lossy conversion or feature removal.

## Test-first evidence

- The renderer-preload contract failed before wiring the call, then passed.
- It runs the actual installed drei, Fiber, suspend-react and Three loaders;
  only the browser image transport is replaced. Two pending preloads start
  seven image loads, not fourteen. A completed preload reuses the exact seven
  decoded image/texture objects. Preview base paths and version keys are tested.
- The old exported build failed the browser assertion requiring the seven
  requests to start with the renderer. The candidate passes that assertion.
- `office-photo-equivalence-check.mjs` compares actual browser texture metadata,
  original export file bytes, SHA-256 hashes and exactly one full-size completed
  transfer per photo. The candidate passes.
- Existing ownership, lighting, reflection, warm-up overlap, mobile containment,
  canvas click-through, cached-fragment, quote and same-page-hash contracts pass.

## Sequential controlled comparisons

Old/new/new/old ordering, fresh Chrome contexts, cache disabled, 390×844 mobile
emulation on the same AMD Radeon 740M hardware GPU. Times start at navigation
and include the harness's six-second approach scroll and original reveal fade.
They are not physical iPhone measurements, field Core Web Vitals, or promises
for every connection. Both comparisons use the identical local no-store server.

| Scenario | Old A / B | New A / B | Old → new mean reveal |
| --- | ---: | ---: | ---: |
| Seven-second added latency on each exact office photo | 23.496 / 23.455 s | 18.882 / 18.760 s | 23.476 → 18.821 s |
| SDK Fast 4G network emulation | 21.763 / 21.715 s | 21.279 / 21.099 s | 21.739 → 21.189 s |

The artificial slow-photo case isolates the observed late-image bottleneck:
**4.655 s earlier (19.8%)**. It is not a full-network benchmark. In the separate
Fast 4G test (1,012,500 bytes/s down, 168,750 bytes/s up, 165 ms latency), the
mean improvement is **0.550 s (2.5%)**. There is no claim of a universal 20% gain.

The opening-scene observation was unchanged within run variation: 2.377 →
2.376 s in the photo-delay case and 4.474 → 4.459 s with network emulation.
Every run completed the same 74 model responses / 5,623,825 compressed model
bytes, seven photo responses / 3,172,098 photo bytes, and all original textures.
Observed CLS was identical old/new: 0 with photo delay, 0.006707 with Fast 4G.
No opening-scene regression was observed in these runs. This is not a claim
that image requests can never compete with models on another network/device.

Reports under `output/playwright/garage-performance-2026-09-06/`:
`office-preload-red`, `office-preload-green`, four `office-slow-*` runs and four
`office-network-*` runs. Scripts record network conditions and photo latency
separately, along with actual resource timings and texture settings.

## Prepared static checks

Production build and TypeScript passed. The exact prepared export and mirror
checks pass: 145 model/Brotli pairs decode byte-identically; 1,257 mirrored
files match; all current immutable manifests resolve. All 69 canonical/sitemap
pages have unique titles and descriptions; 327 JSON-LD blocks parse. Crawler,
AI discovery, feeds and social metadata checks pass. The required small
`Made with ♥ by KR8TIV` footer credit is present on all 69 public pages with
only KR8TIV linked. All 5,324 checked local href/src references resolve.

An additional baseline comparison found all 410 current files in the model,
shop-photo, font and social directories byte-identical to the previous live
export (67,356,286 bytes), beyond checking each model's lossless Brotli twin.

Full prepared mobile and desktop tours passed all seven stations. All seven
desktop station buttons moved the camera to the corresponding bay. There were
no browser errors or horizontal overflow; texture counts stayed at 131 mobile
and 159 desktop. Mobile engine-room and desktop metalwork screenshots were
visually inspected. Reports: `office-final-mobile` and `office-final-desktop`.
Hero and garage route-remount checks also passed: a fresh renderer-owned scene,
one populated garage canvas, and the remounted hero still reaches Act III.

All 47 prepared footer/menu/quote-fragment interaction cases passed with no
browser errors or unexpected mutation requests, including the KR8TIV credit
and Contact link after leaving the loaded garage on desktop and mobile.
Report: `output/playwright/site-actions-office-prepared/results.json`.

## Limits and remaining work

Cold startup is still several seconds; this change overlaps a late dependency,
not the total download or every rendering cost. Desktop steady-rendering cost
requires separate profiling without reducing the effects. SeaOcean 95+, search
rankings, Hostinger CDN activation, Search Console/Bing ownership, physical
Apple performance and real inbox delivery remain unverified. No purchase,
DNS/mail/SSL change, real client test lead, phone call or email was made.

## Publication and final browser checks

Pending; do not treat this candidate as published until this section records
the verified production marker, exact live bytes and final interaction results.
