# Exact post-processing warm-up geometry

> Execute with superpowers:executing-plans, test-driven-development and independent review.

Baseline: live2703663354e549a59ad93ebf72bd2fdf, sourceaad4d98 (application98b788c).
The separate courtesy experiments are HOLD; neither is included here. This
worktree starts directly from the protected source commit. Dependencies are
shared read-only; no model, texture, effect, DPR, camera or copy edits.

## Root-cause evidence

The complete original baseline desktop GL diagnostic passed7bays/71garage/
3hero/7office with no page errors. Its first full-size composer proof took918ms.
Programs75,76,77,79 and92/93 first queried synchronously after shell warm; their
sources match previously prepared programs46,37,38,36,47/48 except HAS_NORMAL.
For these six programs alone the captured uniform-query cost totals470.2ms.
The current helper's temporary PlaneGeometry has a normal attribute. Installed
postprocessing6.39.4 Pass.fullscreenGeometry has only position/uv. Installed
Three r185 keys vertexNormals in its program cache and emits HAS_NORMAL. Thus
the helper prepares different variants; not all startup cost is explained.
Other late programs have precision/output-colour-space differences or were
not discovered. They remain unchanged in this bounded experiment.

Raw evidence lives in the courtesy worktree's output/playwright/
garage-performance-2026-09-06/reconciled-baseline-27036633-desktop-gl-20260908/.
Diagnostic instrumentation adds overhead and is not an A/B speed result.

## Implementation and gates

1. Extract the actual warmComposerPrograms in a CPU regression using installed
   Three and postprocessing geometry. Assert temporary compile attributes match
   the shipped fullscreen geometry, original materials/parents remain intact,
   and only temporary resources are disposed. Preserve expected RED first.
2. Remove only the temporary plane's normal attribute before compiling. Do not
   modify model geometry, pass geometry, shaders, effects, lighting or quality.
3. Run new and existing ownership/liveness/overlap/reflection/progressive tests,
   TypeScript, build, scoped lint and independent review.
4. Private export with original449 media/73page copy fidelity; instrumented
   canary must show exact former late shader sources now prepared in advance.
5. Complete uninstrumented desktop/phone ABBA tours with unchanged3% gates for
   hero/opening/entry p95,p99,max; no omitted adverse runs or relaxed thresholds.
6. Only if qualified: full rail, remount/rotation/footer and SEO continuity,
   review evidence, scoped Git integration/push, guarded deployment and exact
   public marker/assets validation. Otherwise checkpoint HOLD, never deploy.

No SeaOcean score, rankings, field CWV or physical Apple claim is implied.

Final update: driver10680 completed all8 full tours but failed desktop entryp99
and phone entryp95. Candidate17e7082a is HOLD despite the exact-shader diagnostic
passing and lower full-composer proof cost. No integration/deployment or
post-gate lifecycle followups. Preserve the evidence and inspect entry CPU
stacks next; see docs/releases/2026-09-08-post-geometry-qualification.md.
