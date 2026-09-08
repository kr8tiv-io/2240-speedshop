# Post-processing geometry qualification — 2026-09-08

## Status: diagnostic PASS; full qualification pending; unpublished

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
