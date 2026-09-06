# Garage reflection readiness shared by every material consumer

## Candidate and rollback

Prepared candidate **a7fec4fb0a644f97b44a8ef794e0c861** is not yet published.
The live baseline is **8f4ae7f5d545490e8ab580cb7ca5c7e3**, deployment
**f2a0265888db05f0d513c7fb995f6a668ba4aebf**, application source
**48bdd7bdfaca371a35049b91741cfbca2ec6e354**, evidence **12b458a**.
Exact rollback output/verified-hero-stage-8f4ae7f5.zip contains 1,285 committed
files, 68,724,046 bytes, SHA-256
E71557DDC4572A67105214F348662E17F900E567ED196AFB9C893126840ED92F.
It was rehashed, expanded and its hidden release marker verified before this
pass. All previous backups and unrelated user artifacts are preserved.

## Root cause and bounded correction

The fresh phone diagnostic reflection-origin-phone-8f4ae reproduced a 96.4 ms
synchronous uniform query of the original PMREMGGXConvolution program. First
query was at 9,883.5 ms; readiness was not observed until 9,998.5 ms. Its full
first-use stack identifies warmSubtree → warmUp → compileProgramsWithin →
Three.compile → getParameters → lazy PMREM filtering. Concurrent bay material
preparation could therefore consume the environment while the shell's separate
readiness wait was still pending.

The earlier hypothesis of reordering warmShell was rejected. Early cubemap
capture is retained, together with the independent post-processing overlap.
The sole application change makes warmUp await the existing renderer-owned
environment preparation before allocating a target or compiling materials.
Cancellation is checked both before and after waiting. Existing bounded driver
polling, missing-query fallback and teardown ownership remain unchanged.

No models, textures, resolutions, shaders, lighting, effects, DPR, choreography
or page copy changed. This is scheduling of the same original material work.

## Exact shader and regression evidence

The actual-code readiness test failed before the guard in four relevant cases.
All six cases pass afterward: phone, desktop, concurrent bays, cancellation,
missing optional preparation and driver-query fallback. It executes production
warmUp, compileProgramsWithin and warmTextures with the real environment-warmup
module. It verifies original objects/materials/environment/camera and texture
dimensions, framebuffer/cubeface/mip restoration, shared readiness, exactly-once
texture upload and filter-holder disposal. Related overlap and environment
contracts, TypeScript, scoped script lint and the production build pass.

Independent read-only review found no actionable issue, conditional on the
fresh timing, shader and lifecycle gates below. Review is not a performance
measurement.

Phone diagnostic reflection-readiness-phone-canary matches the baseline GPU,
profile, network, model coverage and exact release identities. All **37**
distinct original garage vertex/fragment source pairs match exactly, including
the original GGX shader SHA-256
2bfab167625ec3b3c30045d2a5a98d0ea90e813760402682545148434e80e1b4.
Its query falls from **96.4 to 0.1 ms**, and readiness at 10,058.7 ms precedes
first use at 10,063 ms. Private stack capture is excluded from ordinary timing
runs and occurs after the measured native call. This establishes removal of
the reproduced first-use stall, not a total-load improvement. Report:
output/reflection-readiness-phone-canary-program-verification.json.

## Sequential eight-run ABBA

Eight sequential old/new/new/old desktop and phone Fast 4G runs compare this
candidate with the exact live archive. The unchanged predeclared gates require
average actual hero-scene readiness and full garage reveal within 3% of baseline,
and entry-scroll p95 within 0.5 ms. All runs must retain 71 exact garage resource
hashes and three hero arrivals; candidate second runs must complete all seven
bays and desktop all seven rail actions. Diagnostic runs and overlapping GPU
intervals are rejected. The complete fresh set passes all three gates for both
profiles. All seven bays and seven desktop rail actions pass.

| Mean metric | Desktop before → after | Phone Fast 4G before → after |
| --- | --- | --- |
| Actual hero scene ready | 3.605 → 3.634 s | 6.276 → 6.211 s |
| Complete garage reveal | 16.704 → 16.288 s | 18.383 → 18.334 s |
| Entry p95 | 13.90 → 13.95 ms | 7.10 unchanged |
| Entry p99 | 27.85 → 24.35 ms | 10.60 → 13.80 ms |
| Entry maximum frame | 149.35 → 225.85 ms | 121.55 → 104.20 ms |
| Startup long-task total | 1781 → 1418.5 ms | 643.5 → 571 ms |
| Accumulated layout-shift score | 0.09587 → 0.09115 | 0.00671 unchanged |

Total reveal improves modestly in this controlled set: about 416 ms desktop and
50 ms phone, not a dramatic overall loading gain. Desktop maximum entry frame
and hero readiness, and phone p99, are adverse rows and must not be hidden.
Layout-shift accumulation is not field/session-window CLS. Report:
output/reflection-readiness-comparison.json. Driver 29286 completed exit 0:
garage route remount, real drawing-buffer and camera rotation at 844×390 and
390×844 with no sideways overflow, 14 original curtain/fade cases and all seven
bays without the optional network API pass. The latter retains the original
two-slot fallback. Three prepared Guides → quote → Back and desktop/phone
KR8TIV/Contact-after-garage activation cases pass, with zero browser errors or
unexpected mutations. No real leads, calls or emails were sent. Fourteen
related CPU contract scripts also pass, including light ownership, warm queue,
hero ownership and interactive footer layers (driver 17167, exit 0).
Prepared desktop engine/exit-bay and phone exit-bay screenshots were inspected.
Fresh static verification was repeated after all timing runs and passes.
No publication claim yet; production correspondence must still be checked.

## Technical SEO and fidelity continuity

Prepared static checks pass: 69 unique canonicals, 72 HTML files, 327 all-HTML
schema blocks, 5,324 local references, 72 exact KR8TIV footer credits, 145
byte-identical Brotli model twins and 410 unchanged original media files
(67,356,286 bytes). All 21 packets and 73 extracted model entries pass fidelity
validation. The continuity contract preserves 69 pages' text and 321 public
schema blocks, single H1, en-CA/viewport metadata, 78 image alt attributes,
691 fragment targets, unique IDs and no orphan pages, maximum two link steps.
These static checks do not replace actual link activation or field assessment.
The technical SEO-audit review also confirms the same Edmonton business entity,
address, phone, service-area and service references are drawn from the existing
single source of truth. Public search crawling remains allowed while the quote
endpoint and uploaded customer files are excluded. No new business fact or
keyword rewrite is introduced.

Google's current AI-search guidance requires ordinary crawlable, indexable,
snippet-eligible content and matching visible structured data, not special AI
markup or an AI text file. Indexing and inclusion are not guaranteed. Rechecked
2026-09-06: [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).
The [SeaOcean landing page](https://seaocean.io/) again yielded no readable
individual checks or audit results through public extraction. No SeaOcean score
or complete third-party checklist coverage is asserted.

No SeaOcean score, ranking, physical Apple, field Core Web Vitals, inbox
delivery, separate CDN activation or search-account ownership is claimed.
DNS/SSL/Microsoft365 and the user's browser/support tabs remain untouched.
The continuous optimization goal remains active.
