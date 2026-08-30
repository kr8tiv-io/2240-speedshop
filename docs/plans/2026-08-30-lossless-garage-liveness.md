# Lossless Garage Liveness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the complete seven-stop 3D garage load early and progress past the engine without changing any visible asset, shader, effect, animation, copy, or quality setting.

**Architecture:** Keep the current Next.js/React Three Fiber scene and Hostinger CDN. Split lossless byte transfer from parked GPU preparation, replace per-model idle waits with a generation-scoped serial scheduler, require complete-route readiness before reveal, and make station gates advance monotonically across success, failure, and timeout paths.

**Tech Stack:** Next.js static export, React, TypeScript, React Three Fiber, Three.js, meshopt workers, Node.js contract tests, Hostinger CDN.

---

### Task 1: Pin the garage liveness regression in red

**Files:**
- Create: `scripts/garage-liveness-contract.mjs`
- Modify: `package.json`
- Test: `components/shop/Loaders.tsx`
- Test: `components/shop/WalkthroughWorld.tsx`
- Test: `components/shop/ShopWorld.tsx`

**Step 1: Write the failing contract**

Add `test:garage-liveness`. Make it assert the approved behavioral invariants:

- sustained motion cannot multiply the idle courtesy by the number of model parses;
- a fresh generation is isolated from an unresolved old-generation parse;
- the full route, not only shell/station 0, owns reveal readiness;
- approach readiness mounts the parked world without a 900 ms stillness prerequisite;
- meshopt worker decode is enabled with a bounded worker count and fallback;
- station completion, rejection, and timeout share an idempotent next-gate release;
- file attempts have a bounded timeout/retry path;
- the existing station-2 camera frontier clamp is retained.

Use a pure scheduler API for the first two behavioral tests. Before that module exists, let the test fail on the missing contract rather than weakening the assertion.

**Step 2: Run and observe the correct failure**

Run: `npm run test:garage-liveness`

Expected: FAIL because the generation scheduler and complete-route liveness contract are not implemented.

**Step 3: Commit the red test**

Commit: `test: pin garage liveness regression`

### Task 2: Replace per-model motion waits with an isolated parse generation

**Files:**
- Create: `components/shop/parseScheduler.ts`
- Modify: `components/shop/Loaders.tsx`
- Modify: `scripts/garage-liveness-contract.mjs`
- Modify: `scripts/model-byte-prefetch-contract.mjs`
- Modify: `scripts/loader-generation-contract.mjs`

**Step 1: Implement the minimal pure scheduler**

Create a serial scheduler whose generation owns a queue and one lazily-created courtesy promise. `enqueue()` captures its generation, shares the courtesy across all jobs in that generation, yields between parses, and never lets an older generation block the current one. Expose only the small API needed by `Loaders.tsx` and the behavioral test.

**Step 2: Integrate without parser changes**

Route `queueParse()` through the scheduler and call its generation reset from `beginLoaderStream()`. Retain exact GLTFLoader options, URL fallback, byte cache, logical progress, and serial parse behavior. Remove the old module-global promise chain and per-model `untilIdle(1200, true)`.

**Step 3: Enable bounded meshopt workers**

Call `MeshoptDecoder.useWorkers(2)` once behind feature detection. Keep the decoder singleton and current `setMeshoptDecoder` setup.

**Step 4: Run focused tests**

Run:

`npm run test:garage-liveness`

`npm run test:model-byte-prefetch`

`npm run test:loader-generation`

Expected: scheduler behavior passes; older contracts are updated only where they intentionally blessed the per-model delay.

**Step 5: Commit**

Commit: `perf: isolate and accelerate garage parsing`

### Task 3: Start the exact route earlier and reveal it complete

**Files:**
- Modify: `components/shop/Loaders.tsx`
- Modify: `components/shop/ShopWorld.tsx`
- Modify: `components/shop/WalkthroughWorld.tsx`
- Modify: `scripts/garage-liveness-contract.mjs`
- Modify: `scripts/garage-progressive-reveal-contract.mjs`
- Modify: `scripts/loader-ownership-contract.mjs`

**Step 1: Extend the failing contract**

Require a deterministic, tour-priority, deduplicated list of every current model URL, bounded prefetch concurrency, complete warm-key reveal ownership, and immediate parked mount after hero/approach/module readiness.

Run: `npm run test:garage-liveness`

Expected: FAIL on the current opening-only and 900 ms stillness behavior.

**Step 2: Prefetch every exact model in tour priority**

Expand the existing prefetch entry point to enqueue opening models first and every remaining current tier URL afterward, deduplicated, with the current bounded transport concurrency. Do not introduce alternate assets or change cache ownership.

**Step 3: Mount the parked world on approach**

Remove only the `stillFor() >= 900` prerequisite from Canvas mounting. Keep hero-settled and proximity/module guards, reduced-motion/WebGL decisions, and the hidden parked state.

**Step 4: Hand off only when the route is complete**

Make reveal readiness depend on shell, stations 0–5, and gallery warm keys. Preserve the camera frontier clamp and all visual transitions.

**Step 5: Run focused tests**

Run:

`npm run test:garage-liveness`

`npm run test:garage-reveal`

`npm run test:loader-ownership`

`npm run test:deferred-motion`

Expected: PASS.

**Step 6: Commit**

Commit: `perf: prepare the complete garage before handoff`

### Task 4: Make station and request liveness monotonic

**Files:**
- Modify: `components/shop/Loaders.tsx`
- Modify: `scripts/garage-liveness-contract.mjs`
- Modify: `scripts/loader-generation-contract.mjs`
- Modify: `scripts/loader-ownership-contract.mjs`

**Step 1: Extend the test with controlled failures**

Model success, rejection, timeout, repeated callbacks, and stale generation. Assert that the next gate opens exactly once for the live lifecycle and that stale work cannot mutate it.

Run: `npm run test:garage-liveness`

Expected: FAIL because current rejection/failsafe paths do not release the next gate.

**Step 2: Add bounded request attempts**

Wrap compressed and plain FileLoader attempts with an explicit timeout, guarded settlement, and the existing ordered fallback/retry policy. Ignore late callbacks and keep exact returned `ArrayBuffer` bytes.

**Step 3: Unify station release**

Add an idempotent live-generation release function inside `WarmStation`. Invoke it from successful warm completion, handled rejection, and the failsafe. Keep `finish()` idempotent and preserve progress reporting.

**Step 4: Run focused liveness and ownership tests**

Run:

`npm run test:garage-liveness`

`npm run test:loader-generation`

`npm run test:loader-ownership`

`npm run audit:garage-remount`

Expected: PASS; a slow or failed asset cannot permanently strand the route.

**Step 5: Commit**

Commit: `fix: guarantee garage station progression`

### Task 5: Prove quality, build integrity, and regression safety

**Files:**
- Verify: all touched source, test, public asset, and generated export files

**Step 1: Prove visual payload identity**

Record hashes for all source model and texture payloads before and after the code changes. Assert that no payload changed and that no URL was removed from the tour manifest.

**Step 2: Run the complete relevant contract suite**

Run every garage/loader/model/runtime/visual-quality/mobile/navigation contract in `package.json`, including model pipeline, model shelves, raw metal finish, copy legibility, progressive reveal, ownership, generation, hero runtime, deferred motion, blog navigation, Instagram grid, and Core Web Vitals structure.

Expected: PASS.

**Step 3: Build the exact static export**

Run: `$env:EXPORT='1'; npm run build`

Expected: successful static export with every route and model asset present.

**Step 4: Review the diff and production bundle**

Confirm no visual setting, content, asset byte, or animation was reduced. Confirm the obsolete per-model delay is absent and no stale-generation global queue remains.

**Step 5: Create the verified source checkpoint**

Commit any verification-only updates and create a post-repair checkpoint tag. Never add the existing untracked `output/` or `shots-*` directories.

### Task 6: Push, deploy, and verify Hostinger

**Files:**
- Deploy exact export to: `C:\tmp\2240deploy\daylight`

**Step 1: Push source history**

Push `codex/3d-elevation-2026-08-24` and the new checkpoint tag to `kr8tiv-io/2240-speedshop` as the authenticated user. Do not force-push or rewrite `main`.

**Step 2: Deploy the verified export**

Copy only the exact static export through the existing deployment script/process, review the deployment diff, commit the deploy repository, and push its `main`.

**Step 3: Verify production mechanics**

Verify the public release marker, routes, model responses, Brotli content encoding, immutable model caching, Hostinger CDN headers, and absence of missing assets. Run live performance checks that do not require changing production state.

**Step 4: Verify production experience**

When the Codex Chrome bridge is available, inspect desktop and representative iPhone/mobile widths through the complete garage route, confirm it progresses past the engine, and review console errors. If Chrome remains unavailable, report that limitation explicitly and provide the automated/live evidence without claiming visual sign-off.

**Step 5: Report exact evidence**

Report source commit, checkpoint tag, deploy commit, public release marker, test/build results, payload-identity proof, CDN headers, and the remaining Chrome-only visual check if applicable.
