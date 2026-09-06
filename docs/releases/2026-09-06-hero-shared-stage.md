# Original hero-stage shader preparation

## Candidate checkpoint

Prepared release **8f4ae7f5d545490e8ab580cb7ca5c7e3**. Not yet published.
Live baseline remains f33a4109f9ed40f4a730339010d3a6b1, deployment
0059bf04820ecf7be0af6e65255eb45b347410fd, source evidence d5d2cec.
Exact baseline archive output/verified-gallery-f33a4109.zip is preserved and
expanded as output/baseline-f33a4109 on local port 3201. SHA-256
A1A98D04A294A10A0597C0E4E17DB1FFF8D73DB7D653A7769602F81699F7D156;
68,803,153 bytes and 1,289 files, including the verified hidden marker.

## Root cause and narrow correction

Fresh private phone CPU/GL traces reproduced a 113.4 ms shared-stage shader
query. A subsequent ownership capture with the existing tune diagnostics
identified the original WorkLamp ConeGeometry / MeshStandardMaterial, with a
129.5 ms first uniform query and no readiness polling. The earlier capture
without tune did not have hero ownership data and is not attribution evidence.

ScenePrimer prepared each car act but omitted shared stage objects. The first
act now compiles a material-only view of its original car plus original lamp,
floor and particles. Other cars remain out of this pass. Objects are never
reparented or cloned; installed Three r185 takes the real scene's lights once.
Shared materials join the existing deferred-disposal guard. The normal HDR
composer, two renders per act, exact lighting, quality, choreography and copy
are unchanged. A post-build edit only corrected a misleading traversal comment.

The actual production-primer CPU regression failed before the application
change. Six cases now pass: exact originals once, shared disposal, cancellation,
driver rejection, disposal plus cancellation and disposal plus rejection.
Independent review found no critical/important application issue, but caught
an older environment test tied to `actRoot`. Its RED failure was reproduced,
then the assertion was repaired to require readiness before `compileScope`.
The reviewer also requested canary release/profile identity checks; those were
added and pass. The review itself does not establish performance.

## Exact shader proof

Phone diagnostic baseline hero-stage-owner-phone-f33 and candidate
hero-shared-stage-canary both pass with matching GPU/profile/network and exact
release identity. All **26 distinct hero vertex/fragment sources** match.
The metal lamp hash is
bf456e6291a214d4fb44e41c3ed190e81c1941933f78ee55d0ed7a013d995229.
Its query was 129.5 ms before and 0 ms at the timer's precision afterward;
asynchronous readiness completed at 3420 ms, before first query at 4003.8 ms.
This is private diagnostic evidence, not a total-load benchmark.
Report: output/hero-shared-stage-canary-program-verification.json.

The additional desktop baseline/candidate diagnostic also passes: all **32**
original hero shader sources match; metal lamp hash
a52385665a04ae758881cd8d292f060288fac7e66f111c62061eab7734b46a9c.
First query falls from 154.7 to 0.1 ms, with readiness at 2841.9 before first
query4052.6. Report: output/hero-shared-stage-desktop-canary-program-verification.json.

## Sequential eight-run ABBA

Predeclared gates: average actual hero-scene readiness and complete garage
reveal within 3%, entry-scroll p95 within 0.5 ms. Both desktop and phone Fast
4G pass. Actual readiness comes from `heroStages=true`, not the harness's older
`heroReadyAt` mount timestamp. Every run verifies the expected release, same
GPU/profile/network, exact 71 garage model hashes and three hero arrivals.
The second candidate runs complete all seven bays; desktop clicks all seven
rail buttons. No overlapping GPU intervals or diagnostic timings are accepted.

| Mean metric | Desktop before → after | Phone Fast 4G before → after |
| --- | --- | --- |
| Actual hero scene ready | 3.752 → 3.656 s | 6.293 → 6.275 s |
| Complete garage reveal | 16.542 → 16.493 s | 18.372 → 18.398 s |
| Entry p95 | 13.95 → 13.95 ms | 7.05 → 7.10 ms |
| Entry p99 | 27.70 → 24.30 ms | 13.95 → 8.80 ms |
| Entry maximum frame | 288.25 → 145.90 ms | 128.50 → 107.60 ms |
| Startup long-task total | 1915 → 1813.5 ms | 633.5 → 660 ms |
| Accumulated layout-shift score | 0.08117 → 0.09098 | 0.00671 unchanged |

The repeatable targeted result is preparing the original metal lamp before
first use. Total-load changes are small, and the phone garage mean is 27 ms
slower, not faster. Retain these adverse rows; do not imply universal gains.
The layout-shift accumulator is not field/session-window CLS. Report:
output/hero-shared-stage-comparison.json. Fresh driver67153 completed exit0:
three responsive compile-churn runs, a distinct hero route-remount with Act III
framing, a populated garage remount, real drawing-buffer/camera rotation at
844×390 and 390×844 with no horizontal overflow, 14 original curtain/fade cases,
and three prepared Guides/quote/back and desktop/phone KR8TIV/Contact cases.
No browser errors or real leads, calls or emails. The further sequential desktop
shader identity and missing-network-API phone check also pass (driver63960,
exit0). The missing-API phone retains two transfer slots and all seven bays;
16.493 s full reveal is compatibility evidence, not a comparative speed claim.

## Fidelity and SEO continuity

Fresh build, TypeScript and scoped script lint pass. The HeroScene file is NOT
lint-clean: baseline and candidate both have the same 28 existing React compiler
diagnostics, with the final diagnostic shifted by inserted source lines.
No unrelated compiler-rule refactor was made.

Static release checks pass: 69 canonical pages, 72 stamped HTML files, 327
JSON-LD blocks across all HTML, 145 byte-identical Brotli GLB twins, 21 packet
files, and 410 unchanged original media files totaling 67,356,286 bytes. Browser
garage hashes and three hero arrivals are separate from static hero byte proof.
5,324 local references resolve and all 72 files have the exact small KR8TIV
credit. The new continuity check additionally proves all 69 public pages retain
their published text and 321 public-page schema blocks, one H1 and en-CA/viewport
metadata each, 78 image alt attributes, 691 anchor fragment targets, no duplicate
IDs and all pages reachable within two internal link steps. These are presence,
continuity and graph checks, not editorial alt-quality or runtime activation.

Google's current AI-search guidance still relies on crawlable, snippet-eligible
content and accurate visible information; special AI markup is not required.
No ranking/indexing promise or synthetic SEO score follows from these checks.
Source rechecked 2026-09-06: [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).
SeaOcean's public landing-page extraction exposed no detailed check results in
this pass; no SeaOcean score is claimed. No new keyword/copy rewrite was made.

Do not claim physical iPhone/Safari, field CWV, separate CDN activation, search
account ownership or inbox delivery. Preserve DNS/SSL/Microsoft365 and the user's
browser/support tabs. The continuous optimization goal remains active.
