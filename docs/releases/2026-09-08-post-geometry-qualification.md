# Post-processing geometry qualification — 2026-09-08

## Status: HOLD after full qualification; unpublished

Protected live2703663354e549a59ad93ebf72bd2fdf/application98b788c/evidenceaad4d98.
Private candidate17e7082a7aa64ee3bfbb49d802498d7c is isolated on
codex/garage-post-geometry-20260908. Both previous courtesy experiments remain
HOLD in their own worktree/branch; this starts fromaad4d98 without either edit.

Only runtime change: delete the normal attribute of the disposable compile
plane inside warmComposerPrograms. No visible/model/pass geometry, original
materials/shaders, effects, targets, textures, DPR, cameras or copy changed.
Installed Three r185 includes vertexNormals in its shader cache key. Installed
postprocessing6.39.4 and N8AO fullscreen geometry has no normals, so the helper
previously submitted different variants. Both original900ms courtesies remain.

## Tests and build

The new actual-helper regression produced five expected RED normal-attribute
mismatches, then all7 scenarios GREEN. It covers matching installed fullscreen
attribute features, exact original material identity, deduplication, late ref,
cancellation, driver failure, temporary disposal and shared resource ownership.
Existing8ownership/5queue/6reflection-readiness/overlap/liveness/progressive
contracts pass, as do scoped new-test ESLint and diff whitespace checks.
Independent read-only review confirmed full parsed source equivalence after
removing only the new call/comments and approved qualification, not deployment.

Normal code build62681 passed TypeScript/build but was not a static export.
An initial private-export fidelity attempt consequently failed on absent files;
no browser qualification ran against that incomplete output. Correct explicit
EXPORT=1 build75673 then passed. The existing local export preparation pruned
generated authoring copies, content-addressed unchanged shelves, and flattened
129 RSC payload names. Source originals remain untouched. Fidelity passed449
original media files/69,051,840bytes and all73HTML pages' visible copy.
An old reflection-program report checker failed ENOENT because its historic
8f4ae files are not in this new worktree; it is not claimed as a passing test.

## Instrumented diagnostic

Driver78503 passed the complete hardware AMD740M Chromium desktop tour:
7bays,71exact garage resources,3hero arrivals,7office textures,0page errors.
Evidence: output/playwright/garage-performance-2026-09-06/
postgeometry-20260908-desktop-gl/ and output/postgeometry-canary-attribution.json.

The six baseline late shaders are byte-identical in the candidate after only
ignoring blank source lines. Each now has a recorded async readiness result
before actual first use; there is one matching variant per shader.

| Baseline late ID | Candidate ID | Baseline → candidate query time |
| --- | --- | --- |
| 75 | 47 | 44.1 →0ms |
| 76 | 38 | 185.7 →0ms |
| 77 | 39 | 51.2 →0ms |
| 79 | 37 | 159.3 →0.1ms |
| 92 | 48 | 16.7 →0.1ms |
| 93 | 49 | 13.2 →0ms |

Total470.2 →0.2ms at browser timer resolution. This establishes the specific
duplicate shader-work correction, not a controlled overall speed gain. Other
late variants and startup costs remain. Instrumentation adds overhead; do not
compare total opening times as a qualification result. The fresh uninstrumented
ABBA, lifecycle, interactions and release checks in the plan remain mandatory.

No deployment, SeaOcean95+, field-CWV, rankings or physical Apple claim.

## Export SEO continuity

The private read-only comparison passed all73 exported HTML pages (including
system pages),406parseable JSON-LD blocks, and exact metadata/canonical/language/
H1/link-destination equivalence against the protected deployment. robots.txt,
sitemap.xml and llms.txt are byte-identical. llms-full.txt has70 CRLF line endings
from the Windows checkout instead of LF; its complete text and line structure
match after normalizing only CRLF. The initial raw-byte assertion failed for
that difference and is recorded, not misrepresented as exact byte fidelity.
No export content was modified during qualification. These are continuity
checks, not rich-result eligibility, ranking or an external SeaOcean score.
Evidence: output/postgeometry-seo-continuity.json and its private checker.
Additional external reference follow-up is recorded separately; remaining
anti-bot/refused destinations are still explicitly unresolved.

## Complete controlled comparison: HOLD

Driver10680 is TERMINAL HOLD. Eight sequential uninstrumented hardware-GPU
fresh-browser tours completed in ABBA order per desktop/phone profile. Every
tour passed7bays/71exact garage resources/3hero arrivals/7office textures with
zero page errors. The unchanged3% non-regression gate failed two measures.

| Metric (mean of2) | Desktop baseline → candidate | Phone baseline → candidate |
| --- | --- | --- |
| Opening reveal | 14418 →14371.2ms (−0.32%) | 12579.3 →12167.8ms (−3.27%) |
| Hero ready | 6563.5 →5860.55ms | 5707.7 →5142.45ms |
| Entry p95 | 55.65 →55.8ms (+0.27%) | 28.1 →35ms (+24.56%, FAIL) |
| Entry p99 | 121.6 →170.35ms (+40.09%, FAIL) | 69.55 →69.6ms (+0.07%) |
| Entry worst | 410.55 →410.45ms | 198.4 →139.15ms |

The specific compiler correction remains supported: uninstrumented desktop
first full-composer proof was1059/965ms on baseline and599/552ms on candidate.
But its overall smoothness gate did not pass. Faster shader preparation and
411.5ms earlier mean phone opening do not establish a safe release. Preserve
all runs, keep the candidate isolated, and do not integrate or deploy it.
No post-gate lifecycle followups ran. Evidence: output/postgeometry-qualification.json
and all output/playwright/garage-performance-2026-09-06/postgeometry-20260908-*
reports; the GL-labelled directory is separate diagnostic evidence.

Next diagnostic target: entry-scroll stalls on the protected baseline, including
hero work and streaming/parse scheduling, independently of the now-attributed
post-shader duplicate. Current long-task entries expose timing/phase but not
CPU stacks. Attribute those tasks before another runtime change. Do not relax
the gate, combine the held courtesy changes, or report this as deployed.
