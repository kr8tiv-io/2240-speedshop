# Parked Garage Courtesy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce hidden garage startup wait without removing a single render, asset, texture upload, shader, effect, or visual readiness check.

**Architecture:** Keep the verified progressive-opening release as the baseline. Shorten only the preflight scroll-quiet courtesy before the parked, sliced HDR first-use path from its default 900 ms to 150 ms. Keep the full-size final-frame courtesy at 900 ms and all slices, yields, cancellation/ownership, shader readiness, and asset hashes unchanged.

**Tech Stack:** Next 16 static export, React 19, Three r185, existing Node/Puppeteer hardware-GPU QA.

**Revision after Candidate1 qualification:** the all-tier150ms variant is HOLD.
See docs/releases/2026-09-08-parked-courtesy-qualification.md. Candidate2 uses
`phoneTier ? 150 : 900` instead: preserve full desktop scheduling while testing
the measured mobile gain again. Extend both-tier ownership tests (14cases),
retain the original finalizer assertion, and repeat the complete ABBA comparison.

**Final qualification update:** Candidate2 also failed the unchanged performance
gate in driver73734. Both variants are HOLD and must not be integrated or
deployed. See the complete adverse results in the qualification report. Task3
is blocked by evidence, not approved merely because functional tours passed.
Next inspect original baseline GL startup without altering production behavior.

---

## Evidence and isolation

Current live release2703663354e549a59ad93ebf72bd2fdf, deployment1da0063d;
source98b788c + evidenceaad4d98. Phone log has shell composer warm953ms but
actual first-use40ms; its parked preflight can wait900ms on continuous scroll.
This is a scheduling hypothesis, not yet a measured improvement. Protect all
previous evidence and source/live backups. Experiment is isolated at
C:/tmp/2240-speedshop-courtesy-20260908; the Desktop source and live deployment
remain unchanged. Shared installed dependencies must not be upgraded or edited.

## Task1: Regression, then minimal implementation

Files:
- Modify scripts/garage-oven-light-ownership-contract.mjs
- Modify scripts/garage-liveness-contract.mjs (assert the new exact150ms call,
  keeping exactly one preflight and the finalizer's900ms courtesy)
- Modify components/shop/Loaders.tsx, parked pacedWarm preflight only

1. Extend the existing real-pacedWarm test fixture to record the patience passed
   to waitForReaderQuiet. Assert150ms while preserving all eight ownership,
   cancellation, failure-restoration and per-frame light-pad tests.
2. Run node scripts/garage-oven-light-ownership-contract.mjs and preserve expected
   RED: current implementation passes undefined (900ms default), not150ms.
3. Change only the parked preflight to `await waitForReaderQuiet(150);` and explain
   that each exact draw still yields. Do not alter finalizer's900ms default.
4. Run the extended contract, warm-queue, warmup-overlap, reflection-readiness,
   liveness, progressive-reveal, TypeScript, scoped lint and git diff --check.
5. Independently review before qualification/release.

## Task2: Controlled qualification

1. Serve the unchanged dedicated deployment read-only on localhost3205.
2. Build/prepare the isolated static export only, without mirroring or publishing;
   verify original assets and all current copy remain byte-identical.
3. Serve candidate on localhost3206. Use the same existing original harness with
   QA_PROGRESSIVE_REVEAL=1 and complete tours (never startup-only) in ABBA order
   on desktop and phone. Keep one GPU run at a time. Compare opening and hero
   readiness plus entry-scroll p95/p99 and worst frame; unchanged3% timing
   non-regression gate. Preserve adverse/failed results, never relabel them.
4. Require all7 bays,71 exact resources,3 hero arrivals,7 office photos, zero
   page errors, plus desktop rail, rotation/remount and footer interaction checks.
5. A regression holds the candidate: do not deploy just because its code is small.

## Task3: Delivery if qualified

1. Review complete evidence; verify current source/live has not changed.
2. Commit only intended source/test/docs and push the experiment branch.
3. Integrate into the current SoT branch without overwriting unrelated work.
4. Use the existing guarded release workflow; preserve current live backup and
   wait for exact new public marker/assets before cache invalidation.
5. Reverify public garage/actions and technical SEO continuity. Do not promise
   SeaOcean95+, field CWV, rankings, physical Apple testing or inbox delivery.

Existing user approval is to continue this scoped optimization; execute locally
with review checkpoints rather than opening another user task or asking again.
