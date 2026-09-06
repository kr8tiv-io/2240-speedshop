# Garage lighting warm-up — 2026-09-06

Application source: `51da8e8` (pushed to kr8tiv-io and kr8tiv-ai).
Published release: `a326bae4fc4f426b9561fdb9765a0cee`.
Deployment: `4926faa5` on `kr8tiv-io/2240-daylight-preview` main.
Previous live release: `5990422f1d8c4e88977473ad9a08e491`.
Hostinger published the exact marker; the subsequent cache purge succeeded.
All 69 queryless live canonical pages and 24 critical/crawl/social assets matched
the prepared bytes. Apex/www HTTPS and the four tested redirect variants passed;
the quote endpoint still rejects GET (405), without submitting a real lead.

## Root cause and scope

A CPU profile located large synchronous waits in Three's WebGLUniforms
constructor. Browser-level shader tracing then identified two ambient fixture
programs, for the cylindrical and conical light housings. Ambience was a sibling
of the warmed shell, so neither program was compiled until the final full-size
garage frame. Their measured query waits were 335.8 and 342.5 ms.

An identity-transform group now gives the warm-up ownership of those original
fixtures. Their exact shaders compile after the environment is available, in
parallel with the shell's existing settle/texture pass. Warm-up restores its
render target before yielding and waits for both preparations before first use.
The fixture materials are deliberately **not** passed through neutral-map
unification: their maps, normals, colours, roughness and lights stay unchanged.

No model, texture resolution, effect, light intensity, camera path, mobile DPR,
copy, stylesheet, contact destination or SEO metadata was modified.

The captured before/after vertex and fragment shader sources match exactly:

- Front-sided fixture: SHA-256 `424c0fdc12f5bd5359cf53d7da6070d5614cbdee2a960a5d07484751b2b21cfc`.
- Double-sided fixture: SHA-256 `1b22ef93283a0361598eb1306f51b269d3f48c1db824f76d9f7a954c540f0baf`.

The corresponding warmed query waits measured 0.3 and 0.4 ms. This changes when
the driver does the work, not shader complexity or image quality. Non-blocking
shader readiness polling follows the
[KHR_parallel_shader_compile contract](https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile).

## Measurements

Sequential old/new/new/old runs used fresh Chrome browser contexts, a 390×844
mobile viewport, browser cache disabled, a no-store local server, and AMD Radeon
740M hardware rendering. Each run included the same six-second scripted approach
to the garage. No CPU/network throttling; OS/GPU caches were not cleared. The
computer had substantial unrelated CPU load, so these are local comparisons,
not physical-iPhone, Safari, field-performance or bandwidth promises.

| Run | Renderer → world-ready | Complete reveal after navigation | Final verification frame |
| --- | ---: | ---: | ---: |
| Old A | 8.110 s | 19.628 s | 905 ms |
| New A | 7.360 s | 18.726 s | 46 ms |
| New B | 6.511 s | 17.877 s | 30 ms |
| Old B | 6.919 s | 18.202 s | 723 ms |

Means: renderer-to-ready 7.515 → 6.935 s (about 7.7% lower); complete reveal
18.915 → 18.301 s (0.614 s earlier); final verification 814 → 38 ms; startup
long-task total 3.282 → 2.722 s. Every run fetched the same 74 model responses /
5,623,825 compressed bytes. The comparison is small and subject to load variance.

The initial instrumented canary had a slower total reveal under heavy computer
load (24.326 s); that result is retained, not discarded. It demonstrated shader
equivalence and removal of the specific final-frame wait, but was not used as an
unprofiled speed comparison. The subsequent ABBA table includes every run in
that comparison sequence. Cold startup still takes several seconds; it is not
claimed to be instant or fully optimized.

## Verification and reproduction

- New regression contract observed RED before the fix, then GREEN: original
  fixture compilation, completed environment, overlap, unchanged unification
  scope, and absent optional lighting group.
- Existing exact-light, warm-up overlap/cancellation, renderer ownership,
  mobile containment, decorative-canvas click, cached-fragment, quote CTA and
  same-document-hash contracts passed.
- Production build/TypeScript: passed; 78 static routes generated.
- Export: all 145 model/Brotli pairs decoded byte-identically; all 1,257 mirrored
  files matched. No new lossy conversion.
- SEO/AI discovery: 69 canonical/sitemap pages, 69 unique titles/descriptions,
  327 parsed structured-data blocks, robots/llms/feed/social checks passed.
- Same footer credit on all 69 public pages; 5,324 local href/src references
  resolved with no missing targets.
- Full seven-station tours passed in mobile emulation and desktop, with zero
  browser errors or horizontal overflow. All seven desktop rail buttons moved
  to their intended stations. Texture counts remained stable through each tour
  (131 mobile, 159 desktop); model-response counts remained 74 for both.
- 47 prepared-site interaction checks passed: all shared footer destinations,
  KR8TIV and Contact after leaving the loaded garage on both layouts, mobile
  quote-menu actions, repeated menu use and the cached-fragment/back regression.
  No browser errors, unexpected mutations, real calls or client emails.

Reproducible browser harness: `scripts/garage-performance-check.mjs`.
Set `BASE_URL`, `QA_LABEL`, and `QA_PROFILE=phone-390` as appropriate. By default
it traverses all seven stations, checks rendered models/overflow/context count,
and saves screenshots. `QA_RAIL=1` additionally clicks the desktop station rail.
`QA_STARTUP_ONLY=1` limits a comparison run to startup. `QA_CPU_PROFILE=1` and
`QA_GL_PROFILE=1` enable separate diagnostic captures; do not compare their
timings as uninstrumented benchmarks.

Evidence under `output/playwright/garage-performance-2026-09-06/`:

- `startup-profile-599042/`, `shader-profile-599042/`, `shader-objects-599042/`.
- `lighting-canary/` (diagnostic), `lighting-baseline-a/` (exploratory).
- `lighting-abba-old-a/`, `lighting-abba-new-a/`, `lighting-abba-new-b/`,
  `lighting-abba-old-b/`.
- `lighting-final-mobile/`, `lighting-final-desktop/`.

Prepared interaction evidence: `output/playwright/site-actions-lighting-prepared/results.json`.

Final live checks also passed: the mobile-emulated production tour traversed all
seven stations with 131 textures, 74 model responses, no browser errors and no
overflow. Three live interaction cases verified KR8TIV/Contact after the garage
on both layouts plus quote fragment → Guides → quote → Back. Evidence:
`lighting-live-mobile/results.json` and
`output/playwright/site-actions-lighting-live/results.json`. No real lead,
email or phone call was sent. The exact publication report is
`output/published-release-check.json`.

## Recovery and external limits

Exact prior live deployment archived as `output/baseline-599042.zip` from
deployment commit `427cff2776a486a799a9a3e317bc17d2edfd1cca`. Source/deployment
history and earlier checkpoints remain available. The prepared export retains
the previous live immutable asset generation for existing tabs.

SeaOcean's actual audit remains paywalled on the Free account; no 95+ score is
claimed and no subscription was purchased. Hostinger CDN activation, Search
Console/Bing ownership, physical Apple-device performance, and real inbox
delivery remain unverified. DNS, Microsoft 365 records and SSL were untouched.
