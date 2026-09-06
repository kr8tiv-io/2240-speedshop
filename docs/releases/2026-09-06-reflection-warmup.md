# Exact reflection-shader prewarm — 2026-09-06

Published release: `f89f11d92629434280962e1468514fcd`.
Application source: `47d477b9ca61b528c586af25072560cfff5d1668`, pushed to both
kr8tiv-io and kr8tiv-ai. Deployment: `8479a2663ebe3b8d5f390d9085558ee805b2d808`
on kr8tiv-io/2240-daylight-preview main.
Previous live release: `a326bae4fc4f426b9561fdb9765a0cee`.
Exact rollback archive: `output/baseline-a326.zip`, created from deployment
`4926faa595a84fde470702087d4da413f59b6055` before preparing the new build.

## Change and safeguards

The preceding CPU/GL profiles located synchronous stalls in Three r185's
256-sample PMREM GGX reflection-filter program. It was linked only when the
first reflective material needed the environment. The same library-owned
program is now submitted when each renderer is created, before scene-material
compilation. This changes scheduling, not the reflection calculation.

`lib/environment-warmup.ts` is a deliberately version-guarded adapter for the
installed Three 0.185.1. It constructs Three's own material and LOD geometry,
compiles against a 2×2 HDR target, then restores the actual framebuffer, cube
face and mip level synchronously before yielding. It does not render a second
environment or allocate a full-size second reflection texture on the GPU.
Polling uses the program's existing readiness API with an eight-second bound.
Cancellation, context loss and failures resolve to the existing rendering path.
Owned temporary resources are released after real first use and on unmount.

The public conversion-shader precompile was tested, then removed: it created
an unused program variant. A browser regression test caught that duplicate.
The final adapter prepares **only GGX**; each of the two renderers compiles the
same single conversion program and single filtering program as before.

The [Three PMREM documentation](https://threejs.org/docs/pages/PMREMGenerator.html)
describes early shader compilation and reflection filtering. Its disposal
warning required checking the installed implementation: r185's disposable
materials, targets and LOD geometries are instance-owned. The adapter never
calls the shared rendering/cleanup path, retains its program holder until the
actual generator uses it, and has teardown tests. Future revisions deliberately
skip the adapter until revalidated. Readiness polling follows
[KHR_parallel_shader_compile](https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile).

Unchanged: all model files, texture resolutions, effect shaders, environment
resolutions (hero 128/256; shop 64/256), GGX samples (256), lighting, DPR, camera
choreography, copy, fonts, CSS, CTAs and SEO metadata. No new lossy conversion.

## Exact shader evidence

Browser-captured vertex/fragment pairs match byte-for-byte, with no unused or
duplicate reflection program in the final candidate:

| Program | Pair SHA-256 | Before query wait | After query wait |
| --- | --- | ---: | ---: |
| Hero GGX, 128 | `3ea6e2c5f05b1d7d8e4f83b66f220531583d7a73324e5e94a6c3575b2d0710db` | 459 ms | 0 ms |
| Shop GGX, 64 | `45eb687077de957a701b87e403dbf8eee4ed54c2953ccbca2dcc9ad5fcb772fa` | 414.4 ms | 64.7 ms |
| Conversion, both renderers | `6ef6734f76206c79bb7f9b6348da42ad22d3ddc2fd59df28c14b3c53249b624b` | 29.7 / 0.7 ms | 7.4 / 1.0 ms |

These are instrumented diagnostic query timings, not total loading promises.
Reproduce with `scripts/reflection-shader-check.mjs`, passing the baseline and
candidate `startup-programs.json` paths. The unit contract also compares the
actual installed material/defines at 64, 128 and 256 resolution.

## Sequential timing comparison

Fresh headed Chrome contexts, cache disabled, local no-store server, 390×844
mobile emulation, AMD Radeon 740M hardware rendering. No network/CPU throttle;
OS/GPU caches were not cleared. Every run includes the same six-second scripted
approach to the garage. This is not physical-iPhone or Safari evidence.

| Run | Renderer → world-ready | Fully revealed after navigation | Startup long-task total |
| --- | ---: | ---: | ---: |
| Old A | 5.914 s | 16.993 s | 1.910 s |
| New A | 5.780 s | 16.723 s | 1.157 s |
| New B | 5.891 s | 16.684 s | 1.075 s |
| Old B | 6.074 s | 16.897 s | 1.908 s |

Means: renderer-to-ready 5.994 → 5.835 s (2.65% lower); full reveal
16.945 → 16.703 s (0.242 s earlier); startup main-thread long-task total
1.909 → 1.116 s (41.5% lower). The main benefit is less blocking, not a dramatic
wall-clock improvement. All four runs fetched the same 74 model responses /
5,623,825 compressed bytes. This small sample does not establish field CWV.

An earlier ABBA sequence is retained in full. Its first candidate run took
26.219 s to reveal; resource timing shows 9–10.4 s waits for localhost JS
responses before the renderer existed. Rather than discard only that result,
the entire comparison was repeated after serving stabilized. The table above
contains every run in that second sequence. Earlier new B was 16.987 s; old
A/B were 17.100/16.937 s. No server-delay run is represented as a renderer win.

## Verification

- Integration assertions observed RED before wiring the callers, then GREEN.
- Redundant conversion-program test observed RED, then GREEN after removal.
- Real Three material equivalence, restoration, deduplication, readiness,
  cancellation, context loss, compile/query exceptions and deadline passed.
- Existing fixture/light-scope, warm-up overlap, ownership, mobile containment,
  canvas click-through, cached fragments, quote and same-page hash tests passed.
- Production build and TypeScript passed; 78 static routes generated.
- All 145 packaged model/Brotli twins decode byte-identically; all 1,257 export
  files match the deployment mirror.
- 69 unique canonical/sitemap pages, 69 titles/descriptions, 327 parsed JSON-LD
  blocks, crawler/AI discovery/feed/social metadata checks passed.
- Required footer credit present on all 69 pages. All 5,324 checked local
  href/src references resolve without missing files.
- Full prepared mobile and desktop tours passed all seven stations; all seven
  desktop rail buttons worked; no browser errors or horizontal overflow.
  Mobile engine-room and desktop metalwork screenshots inspected. Texture counts
  stayed at 131 mobile / 159 desktop through the entire tour.
- Hero and garage route-remount audits passed with fresh renderer-owned scenes,
  one canvas and no errors; the remounted hero reached Act III with 117 owned
  materials and a framing edge of 0.924. The garage remount harness now runs in
  hardware-capable headed Chrome, off-screen, without disabling its sandbox.
- 47 prepared-site footer/menu/quote-fragment interaction cases passed, with
  zero browser errors or unexpected mutation requests, including KR8TIV/Contact
  after the loaded garage on both layouts. Report:
  `output/playwright/site-actions-reflection-prepared/results.json`.

Evidence under `output/playwright/garage-performance-2026-09-06/`:
`reflection-canary` (initial diagnostic), `reflection-baseline-profile`,
`reflection-final-profile`, all four `reflection-abba-*` runs, all four
`reflection-confirm-*` runs, `reflection-final-mobile`, `reflection-final-desktop`.

## Limits and next work

Cold startup still takes several seconds. Desktop steady rendering remains
around 29 fps on this integrated GPU and needs separate profiling. This pass
does not claim improved steady FPS, universal device performance, a SeaOcean
95+ score, rankings, CDN activation, Search Console/Bing ownership, physical
Apple testing or real inbox delivery. No purchase, DNS/mail/SSL change, client
test lead, call or email was made.

## Publication and final live evidence

Hostinger published the exact release marker and accepted the subsequent cache
purge. All 69 queryless canonical HTML pages and 24 critical/crawl/social assets
matched the prepared bytes. Trusted HTTPS, apex/www and legacy blog redirects
passed. The quote endpoint rejects GET (405); no real lead was submitted.
Report: `output/published-release-check.json`.

The live mobile-emulated tour passed all seven stations with 131 textures,
74 model responses, no browser errors or overflow. Three live interaction
checks passed (desktop/mobile KR8TIV + Contact after the loaded garage, and
quote fragment → Guides → quote → Back), with no unexpected mutation requests.
Reports: `reflection-live-mobile/results.json` in the performance directory and
`output/playwright/site-actions-reflection-live/results.json`.

That first live cold tour revealed at **27.936 s**, much slower than the local
comparison, despite the shell warming in 1.709 s and final full-composer proof
taking 23 ms. Its waterfall identifies six late office-photo/sign requests at
14.743 s, taking 7.6–11.1 s; they finish before the late gallery warm and final
world-ready at 26.570 s. Model requests were much shorter. Do not describe the
entire live cold-load problem as solved. Later live footer tests reached and
left a loaded garage in 14.1/14.3 s, demonstrating substantial run variance.

Next investigation: `WALL_PHOTO` / `OfficeGallery` in `ShopWorld.tsx` deliberately
defer ~3 MB of full-resolution photos until station 5, yet the final reveal
waits for that gallery. Test an earlier, deduplicated preload after the opening
model/hero network work (not unconditional page-boot preloading). Preserve every
original image and texture; verify cache reuse, network priority, cancellation,
and no duplicate transfers before any next release. Separately profile desktop
steady rendering without reducing effects.
