# Full-quality garage: rendering and transport investigation

## Status

**Investigation checkpoint, not an application release.** The live site remains
`acce5c29994840cda346ff4e6119f2ea`, deployment `45bb7eb3`, application source
`ec8ce57`. No model, image, material, shader, light, effect, DPR, camera, copy,
SEO setting or production loader was changed in this investigation. All browser
experiments ran in isolated, owned Chrome contexts and were closed afterwards.

The current deployment was archived as `output/baseline-acce.zip` (67,250,890
bytes) and expanded to `output/baseline-acce/`. The archived marker matches
`acce5c29994840cda346ff4e6119f2ea`. Previous backups remain intact.

## Desktop bottleneck, measured on the hardware GPU

`scripts/garage-steady-profile.mjs` instruments the original renderer and
composer without changing their calls. Hardware: AMD Radeon 740M via Chrome,
1440 × 900 CSS viewport, 1424 × 900 canvas after scrollbar, DPR 1. Each station
settles for three seconds before six seconds of measurement. The existing
QualityRig had already disabled AO for sustained slow frames; no new quality
reduction was made. All remaining effects and four-sample HDR targets remain.

| Station | Mean frame interval | Main scene GPU time |
| --- | ---: | ---: |
| Opening vehicles (0) | 39.140 ms | 22.269 ms |
| Engine room (2) | 31.267 ms | 17.464 ms |
| Office (5) | 33.187 ms | 19.366 ms |

The main shaded scene dominates. DOF plus bloom costs about 6.4 ms/frame;
chromatic aberration about 2.3 ms. The reflection scene costs 0.6–1.3 ms and its
five blur draws about 0.14–0.19 ms each. Those figures are measurements of this
device, not universal FPS claims or physical iPhone results.

Per-mesh timing identifies the floor, corrugated walls, painted vehicle panels,
office wall and metal surfaces as expensive fragment-shading work. This does
not justify lowering their materials or resolutions. CPU wall times around a
renderer call may include GPU back-pressure; they are not pure JavaScript cost.

GPU timing uses asynchronous, non-nested queries and discards disjoint results
as required by the [Khronos timer-query specification](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/).
The baseline and per-mesh recordings completed with zero disjoint, skipped or
unresolved queries and no WebGL error. Results and CPU profiles are under
`output/playwright/garage-performance-2026-09-06/desktop-steady-baseline/` and
`desktop-steady-mesh-v2/`.

## Rendering experiments rejected, not shipped

1. **Near-first opaque sorting:** improved mean frame intervals in one private
   probe to 32.824 / 27.745 / 29.850 ms, but changed HDR pixels. Rejected.
2. **Structural shell drawn after models:** retained internal vehicle ordering
   but still changed up to 12 main-scene pixels at the tested poses. Some
   channel differences were materially larger than floating-point rounding.
   Rejected; no further draw-order variants were attempted.
3. **Skip zero-contribution point-light shading:** retained the original light
   values and surface equations, but changed 147 / 211 / 190 main-image pixels
   and 7 / 5 / 4 reflection pixels at the three tested stations. The captured
   samples mostly differ by one half-float step, but the strict equality gate
   failed. Rejected, with no performance claim for this shader experiment.

The tests freeze the real camera, animation and uniforms, render original →
experiment → original to matching HDR targets, and compare raw RGBA16F values.
Every repeated original was deterministic (zero changed channels). The failed
tests therefore must not be called passes or enabled in production. The two
sorting tests cover 13 poses; the light test covers three. These are raw scene
comparisons, not exhaustive final post-processed visual certification.

Diagnostic files:

- `scripts/garage-sort-fidelity.mjs`: `QA_SORT_EXPERIMENT=front-first` or
  `room-last`. Both currently produce an expected candidate-rejection exit 1.
- `scripts/garage-light-fidelity.mjs`: private shader candidate; likewise
  fails the quality gate. Preserves earlier `onBeforeCompile` hooks and restores
  them, with a distinct experimental program key.
- `scripts/garage-steady-profile.mjs`: `QA_QUERY_SCOPE=mesh` for per-mesh GPU
  timing; otherwise measures the full render chain. Do not enable its optional
  sort variants in app code.

The sorting harness's standalone reflection comparison did not hide the floor
as the real reflector normally does. Its main-scene rejection remains valid;
do not treat the reflection result as a complete pipeline proof. The subsequent
lighting harness explicitly hides/restores the original floor for that view.
Readback uses the asynchronous API documented by
[Three.js](https://threejs.org/docs/pages/WebGLRenderer.html).

## A transport-only path that keeps all model bytes

The prior controlled Fast 4G runs show the current 71-file garage queue still
finishing around 19.25–19.31 seconds after navigation. Many small files occupy
one of the two transport slots for roughly 184–213 ms each. Their bytes are
small; repeated latency consumes real time. The current unthrottled live run
finished those transfers before 8.9 seconds, so this is connection-dependent.

`scripts/garage-transport-probe.mjs` reads the exact route order from the source
AST and original GLBs/Brotli twins from disk. Its in-memory local server tests
small consecutive packets, keeping the first three vehicle requests and large
files individual. Packet caps: 128 KiB summed original compressed sizes and
1 MiB decoded bytes. It writes nothing to `public/` or the application.

The browser runs baseline / packets / packets / baseline, cold contexts,
two requests at a time, 1,012,500 bytes/s download and 165 ms simulated latency.
It checks every extracted model's SHA-256 against the original in every run.

| Original shelf | Requests, before → after | Mean transfer time, before → after | Improvement |
| --- | ---: | ---: | ---: |
| Existing mobile shelf | 71 → 43 | 9.989 → 7.820 s | 2.169 s / 21.7% |
| Existing desktop shelf | 71 → 49 | 13.768 → 12.459 s | 1.309 s / 9.5% |

Mobile wire bytes: 5,420,471 → 5,405,849. Desktop: 10,120,544 → 10,108,673.
All 71 original model hashes matched in each of eight runs. Neither shelf was
resized, simplified, retextured, re-encoded or substituted for the other.

**These are download-only results, not live-site or full-page improvements.**
The probe excludes hero traffic, office photographs, parsing, GPU warm-up,
the production cache, client fallback integration and physical Apple devices.
The full rollout is not implemented yet. End-to-end tests must show a benefit
without creating a burst of parse/upload work or delaying the opening vehicles.

Reports: `transport-packets-probe/results.json` and
`transport-packets-desktop-probe/results.json` in the same performance output
directory. The detailed next implementation is
`docs/plans/2026-09-06-lossless-model-packets.md`.

## Fresh verification and external limits

After these private experiments, all 69 published pages and 24 critical assets
still matched the prepared `acce` release. Trusted HTTPS, apex/www redirects,
and the legacy `/f/cutting-edge-automotive-solutions/` redirect passed with zero
errors. The quote endpoint returned its expected GET 405; no client lead was
submitted. Report: `output/published-release-check.json`.

Syntax checks passed for all four new diagnostic scripts. Existing exact-photo
preload, model byte-prefetch and garage liveness contracts passed. There was
no reason to rebuild or redeploy identical application bytes, so no deployment
or cache purge was performed for this evidence-only checkpoint.

SeaOcean 95+, rankings, separate Hostinger CDN activation, Search Console/Bing
ownership, physical Apple performance and real inbox delivery remain
unverified. No purchase, DNS/mail/SSL change, support-tab manipulation or real
client message occurred. The continuous optimization goal remains active.
