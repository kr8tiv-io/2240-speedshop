# Gallery first-use light ownership — candidate qualification

## Review correction after cc85 qualification

Neither initial849 nor cc85 was published. Independent production review found
that the first reader courtesy still awaited while holding temporary visibility
and light slots. Two new actual-code regressions reproduced (1) cleanup leaving
26 instead of 25 lights, and (2) the real station frame hiding the private draw's
subject. Both failed first, then passed after moving the one bounded courtesy
before snapshots or scene/light mutations and checking staleness immediately
afterward. No courtesy duration, draw batch, material or visible effect changed.
All eight light-ownership and five queue tests pass. The older source-shape
liveness assertion was updated from its old `index === 0` location to require
exactly one courtesy before ownership; its full behavioral suite passes too.
Independent re-review found no remaining critical or important code findings.

The replacement export is **f33a4109f9ed40f4a730339010d3a6b1**, prepared and
unpublished. Build, TypeScript, scoped lint, static SEO and original-media checks
pass. Its exact shader diagnostic measured 0.2 ms lookup versus 476.3 ms, with
readiness completed before use. It uses new gallery-owner-reviewed-*
reports and fresh unchanged qualification gates; cc85 results below remain
historical evidence and cannot be reported as the replacement build's results.

## Reviewed f33 controlled results

Eight new sequential desktop/phone Fast 4G ABBA runs passed the unchanged gates.
The desktop gallery's original first-use shader stall was **451/459 ms before,
2/2 ms after**. The instrumented exact-source proof separately measured
476.3 to 0.2 ms uniform lookup, with asynchronous readiness complete beforehand.

| Mean metric | Desktop before → after | Phone Fast 4G before → after |
| --- | --- | --- |
| Complete reveal | 16.686 → 16.591 s | 18.445 → 18.302 s |
| Entry p95 | 14 → 13.95 ms | 7.1 → 7.1 ms |
| Entry p99 | 27.8 → 24.45 ms | 13.8 → 13.85 ms |
| Startup long-task total | 2353 → 1921 ms | 662.5 → 639 ms |
| Accumulated layout-shift score | 0.08906 → 0.09921 | 0.00671 → 0.00671 |

The small complete-reveal changes (-96 ms desktop, -144 ms phone) are not
strong general speed claims. The repeatable result is removing the roughly
half-second desktop gallery stall without changing its shader or visuals.
Retain adverse desktop layout-shift and phone p99 rows. The harness accumulates
non-recent-input layout shifts; this is not field CWV or a SeaOcean score.
Seven-bay tours, all seven desktop rail buttons, real drawing-buffer phone
rotation and a fresh populated renderer after route return pass. Exact garage
response hashes, three hero arrivals and independent original-media byte
fidelity pass. Fourteen original curtain/fade cases and all three focused
quote/footer cases pass with zero browser errors or real submissions. Driver
14669 completed exit0. These include Guides → quote form → Back and desktop/
phone KR8TIV plus Contact links after the fully loaded garage. Publication
and fresh live-domain verification remain pending.

## Earlier checkpoints

Live baseline: cf744f55f22b43ec955394ea0df4fd6d / deployment e92b1ec7,
application 10d6619, evidence checkpoint eb5b9d3. Its exact committed rollback
archive is output/verified-lite-cf744f5.zip, expanded without modification to
output/baseline-cf744f5 and served on port 3200. Initial candidate export
8490226f10c2431e8a0fa96259bce9c5 completed qualification below but was not
published. Subsequent export **cc85b8d0612d45a0801b0a0e30fb3629** also included
the queue ownership correction below. Its build, TypeScript, scoped lint,
static SEO/media and browser checks passed, but review held it for the further
courtesy correction. It is no longer the prepared candidate.

## Evidence and root cause

The baseline desktop gallery first-use showed a 494 ms worst slice. Fresh
private CPU/GL profiling reproduced a 476.3 ms uniform-discovery wait for its
emissive-map shader. That program was linked only 0.1 ms before first use and
never received a non-blocking readiness check. The prior prepared gallery
variant had 24 point lights; actual first use had 25. The other shader inputs
matched. A second actual light/scene trace confirmed why: bay four was hidden
between private draw slices while still reserving its one padding-light slot.
The gallery compiled in that asynchronous interval, then required a new program
when the full 25-light count was restored. No texture compression problem was
involved in this particular stall.

## Bounded correction and regression proof

Each real station registers its existing light count and effect ownership in
a WeakMap. Private warm visibility claims/restorations reconcile the same
zero-intensity light pad on the same synchronous stack. A queued bay no longer
reserves slots before its own drawing begins. Real frame reconciliation also
runs when the cached visibility choice is unchanged, because a temporary warm
may have used slots in the meantime. Stale renderer or superseded same-renderer
bay ownership cannot change a successor's light state.

The regression runs actual firstUse, pacedWarm and useFrame callback code with
real Three scenes, materials, lights and the production light pad. Five tests
first failed with 24 instead of 25 lights; the added same-renderer replacement
test failed at 26 instead of 25. All six pass after correction, including draw
errors, yielded state restoration and cancellation. Original geometry, materials,
visibility, parentage and nonzero light intensity remain unchanged. Existing
compile traversal, texture/compile overlap, fixture warm-up, loader ownership,
generation, liveness and progressive readiness contracts also pass.

Further test-first review reproduced four queue bugs: an enqueued job was
already recorded as complete, same-owner duplicates resolved prematurely,
disposed queued work still started, and failures could not retry. Pending work
now shares its actual Promise per node/generation/effect owner. Only completed
live work latches success. Superseded work cannot clear its successor's entry;
cancelled queued work skips GPU preparation. Four RED/GREEN tests plus a renderer
generation-handover regression pass on extracted production queue code. No
application test hook or new renderer is introduced. This correction was built
first into cc85, so initial849 browser results do not qualify subsequent source.

The browser shader regression failed on a second baseline capture, then passed
on the candidate: the exact original combined vertex/fragment SHA-256 is
d5b36f55e018afb9f6d9de0285d5125e9e8648d52f7c8067169ade015f3ed058.
Its query wait fell from 476.3 to 0.1 ms; non-blocking readiness completed before
first uniform discovery and gallery preparation sees 25 lights. These are
instrumented diagnostic measurements, not an overall speed comparison.

No model, texture resolution, material equation, shader source, real light,
effect, camera choreography, DPR, copy or CSS changes. All-seven-bay readiness
remains the reveal contract. The GL/CPU/light diagnostic flags now explicitly
mark reports diagnosticOnly so comparisons cannot accidentally use their times.

## Gates declared before ordinary timing

Eight fresh sequential old/new/new/old runs cover full desktop and phone Fast
4G. Both baseline desktop gallery worst slices must reproduce >400 ms; both
candidate gallery slices must be <50 ms. Complete mean reveal must remain
within 3% and entry p95 within 0.5 ms on both profiles. Original model hashes,
GPU/viewport/network and office texture settings must match. Both candidate
second runs cover seven bays and desktop clicks all seven rail buttons. Then
rotation/remount, original curtain fades, quote/footer actions, prepared media
and SEO checks must pass before any commit/deploy decision. The exact shader
proof is required in addition to ordinary timing, not a substitute for it.

## cc85 controlled results (superseded after review, not published)

Eight fresh sequential cc85 ABBA runs passed the same predeclared gates.
The exact original shader still completed asynchronous readiness before use;
diagnostic uniform lookup was 0.1 ms against 476.3 ms in the baseline. Ordinary
desktop gallery worst slices were **489/457 ms before and 2/5 ms after**.

| Mean metric | Desktop before → after | Phone Fast 4G before → after |
| --- | --- | --- |
| Complete reveal | 16.9025 → 17.1537 s | 18.468 → 18.428 s |
| Entry p95 | 13.95 → 14 ms | 7.1 → 7.1 ms |
| Entry p99 | 24.35 → 24.45 ms | 10.5 → 13.85 ms |
| Startup long-task total | 2545 → 2045 ms | 691.5 → 765 ms |
| CLS | 0.04717 → 0.09095 | 0.00671 → 0.00671 |

Retain the adverse rows: desktop complete reveal rose 251 ms (1.49%), still
within the declared 3% tolerance, and desktop CLS plus phone p99/long tasks
increased. The 40 ms phone reveal difference is not a meaningful speed gain.
This is a measured desktop blocking-stall and cancellation-correctness repair,
**not an overall cold-load speedup claim**. Do not substitute initial849's
faster totals for the actual cc85 results. All seven bays and seven
desktop rail clicks passed; phone rotation kept the same populated scene and
correct drawing buffer/camera without overflow, then route return produced one
fresh populated renderer. Fourteen original curtain/fade cases and all three
quote/footer cases passed. Qualification driver90707 ended exit0; review then
held this export for the initial-courtesy correction above.

Static cc85 checks passed for 69 canonical pages, 327 structured-data
blocks, 5324 local references, 72 exact footer credits, 145 lossless GLB twins,
21 packets and 410 byte-identical original media files (67,356,286 bytes).
Browser runs hash all 71 garage resources and count all three hero arrivals;
hero fidelity is supported by the separate static media check. Desktop gallery
screenshots were compared with the prior live-release capture, and the phone
engine capture was inspected: original models, framing and copy remain intact.

## Initial849 qualification (historical, not the final export)

Eight uninstrumented sequential ABBA runs passed the declared gates. Desktop
gallery worst slices 475/508 ms became 3/2 ms. Mean complete reveal was
17.044 to 16.291 s (-752 ms, 4.4%); entry p95 14 to 13.95 ms, p99 34.5 to
27.8 ms, startup long tasks 2624 to 1851.5 ms, CLS 0.08753 to 0.08494.
Phone Fast 4G mean reveal was 18.535 to 18.302 s (-233 ms, 1.3%), p95
unchanged at 7.1 ms, p99 11.7 to 8.95 ms, long tasks 801 to 651.5 ms,
CLS unchanged at 0.00671. The small phone difference is not a universal gain.
All 71 garage response hashes and texture settings matched, and all three hero
resources arrived. Hero byte fidelity is proved separately by the static
410-original-media comparison, not by the browser's hero URL counter. Full
seven-bay tours and seven desktop rail clicks, drawing-buffer rotation/remount,
14 original curtain cases and three quote/footer cases passed without errors.
Initial evidence remains separately labelled and is not overwritten by final
qualification, which repeats the same gates with fresh runs and its own marker.

Reports: gallery-program-cost-cf744f5, gallery-light-scope-cf744f5 and
gallery-light-owner-canary under output/playwright/garage-performance-2026-09-06;
output/gallery-program-initial-verification.json. Initial controlled timing uses
gallery-owner-{desktop,4g}-{old-1,new-1,new-2,old-2} and
output/gallery-owner-comparison.json. Historical cc85 reports use gallery-owner-final-*
and output/gallery-owner-final-comparison.json; f33 reports use gallery-owner-reviewed-*
and output/gallery-owner-reviewed-comparison.json. No publication or universal speed claim
has been made. SeaOcean score, rankings, field CWV, physical Apple validation,
CDN activation, search ownership and actual inbox delivery remain unverified.
