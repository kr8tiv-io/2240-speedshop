# Lossless Cinema Priority Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce opening transfer, route contention, and 3D warmup long tasks without changing any visible model, texture, shader, effect, animation, or copy.

**Architecture:** Keep the static Next.js export and current Three.js scenes. Add deterministic lossless poster crops, user-intent route prefetch, act-segmented off-screen scene warming, and an optional credential-gated Hostinger cache purge. Treat the existing visual output as the golden master.

**Tech Stack:** Next.js static export, React, TypeScript, React Three Fiber, Three.js, postprocessing, Node.js contract tests, jpegtran, Playwright/browser audit scripts, Hostinger CDN.

---

### Task 1: Pin the lossless-performance contract

**Files:**
- Create: `scripts/lossless-cinema-priority-contract.mjs`
- Modify: `package.json`

**Step 1: Write the failing contract**

Assert that the repository contains:

- viewport-matched lossless poster files and a deterministic build script;
- a `<picture>`-based opening poster with desktop/mobile sources;
- `IntentLink` with `prefetch={false}` plus pointer, focus, and touch intent;
- named hero act roots, sequential warmup, browser yields, one composer warm, and off-screen subsequent passes;
- an optional Hostinger purge helper that validates environment variables and never prints the token.

**Step 2: Run the contract and confirm failure**

Run: `npm run test:lossless-cinema-priority`

Expected: FAIL because the implementation does not exist yet.

**Step 3: Commit the red contract**

Commit: `test: pin lossless cinema priority contract`

### Task 2: Generate exact-pixel opening poster crops

**Files:**
- Create: `scripts/build-hero-stills.mjs`
- Create: `public/shop/hero-still-desktop.jpg`
- Create: `public/shop/hero-still-mobile.jpg`
- Modify: `components/home/HomeCinema.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `scripts/lossless-cinema-priority-contract.mjs`

**Step 1: Add the deterministic crop pipeline**

Add `jpegtran-bin` as a development dependency. Invoke its binary from Node with `-copy none`, `-perfect`, the approved MCU-aligned crop geometry, and explicit output paths. Validate source existence and output dimensions.

**Step 2: Generate and verify the assets**

Run: `npm run build:hero-stills`

Expected: both outputs exist with dimensions `1920x1216` and `1184x2560`; the desktop cover trims eight source pixels per vertical edge and therefore presents the exact approved `1920x1200+0+680` composition without re-encoding.

**Step 3: Select the crop in markup**

Replace the opening poster's one-size `<Image>` request with an accessible decorative `<picture>` using mobile and desktop sources and the original master as fallback. Preserve grading, cover behavior, eager priority, and fetch priority.

**Step 4: Run focused checks**

Run: `npm run test:lossless-cinema-priority && npm run test:home-copy && npm run test:deferred-motion`

Expected: PASS.

**Step 5: Commit**

Commit: `perf: serve lossless viewport-matched hero stills`

### Task 3: Move navigation prefetch behind visitor intent

**Files:**
- Create: `components/IntentLink.tsx`
- Modify: `components/Nav.tsx`
- Modify: `components/home/HomeCinema.tsx`
- Test: `scripts/lossless-cinema-priority-contract.mjs`

**Step 1: Implement an accessible intent link**

Wrap Next.js `Link` with `prefetch={false}` and a deduplicated module-level prefetch function. Trigger `router.prefetch()` on pointer enter, focus, and touch start while composing any existing event handlers.

**Step 2: Replace opening-critical links**

Use `IntentLink` in desktop/mobile navigation, quote actions, and opening hero actions. Do not modify target URLs, copy, classes, or click behavior.

**Step 3: Prove behavior**

Run: `npm run test:lossless-cinema-priority && npm run test:blog-navigation && npm run test:mobile-menu`

Expected: PASS; opening waterfall contains no automatic route payloads before intent.

**Step 4: Commit**

Commit: `perf: prefetch routes on visitor intent`

### Task 4: Segment the complete 3D shader and model warmup

**Files:**
- Modify: `components/home/HeroScene.tsx`
- Test: `scripts/lossless-cinema-priority-contract.mjs`
- Test: existing hero runtime and ownership scripts

**Step 1: Name act roots and preserve visibility**

Give each act root a stable name/user-data marker. Add helpers that snapshot and restore visibility and the current render target.

**Step 2: Warm acts in priority order**

Compile the opening act and shared resources, warm the full composer once into its existing buffer, restore state, then yield. Warm the remaining acts sequentially into an off-screen target with a browser scheduling yield between them. Keep the elegant poster visible until the required warmup completes.

**Step 3: Prove ownership and race safety**

Run:

`npm run test:lossless-cinema-priority`

`npm run test:hero-runtime`

`npm run test:hero-scene-ownership`

`npm run audit:hero-compile-race`

Expected: PASS with no double renderer/composer ownership, no visible compile frame, and no missing garage acts.

**Step 4: Commit**

Commit: `perf: segment complete hero scene warmup`

### Task 5: Add a safe Hostinger cache purge path

**Files:**
- Create: `scripts/purge-hostinger-cache.mjs`
- Modify: `package.json`
- Modify: `scripts/deploy-combined.ps1`
- Test: `scripts/lossless-cinema-priority-contract.mjs`

**Step 1: Implement credential-gated purge**

Read `HOSTINGER_API_TOKEN`, `HOSTINGER_USERNAME`, and `HOSTINGER_DOMAIN` from the environment. When all exist, call the documented cache-clear endpoint with a bearer token after a successful deployment. When credentials are absent, exit successfully with a concise skip message. Never echo token content.

**Step 2: Keep HTML caching conservative**

Do not increase HTML cache lifetime unless the live deployment proves the purge path. Retain immutable cache rules for content-addressed assets and verify Hostinger CDN HIT behavior.

**Step 3: Test both safe paths**

Run the helper without credentials and assert a clean skip. Exercise its request formation with a mocked fetch in the contract rather than calling production.

Run: `npm run test:lossless-cinema-priority`

Expected: PASS.

**Step 4: Commit**

Commit: `ops: add safe Hostinger cache purge hook`

### Task 6: Full visual, functional, and performance verification

**Files:**
- Verify: all touched files and generated release output

**Step 1: Run the complete contract suite**

Run every `test:*` and relevant `audit:*` script in `package.json`, including garage reveal, loader ownership, Instagram grid, blog navigation, shop copy legibility, raw metal finish, model shelves, hero remount, and compile race.

Expected: PASS.

**Step 2: Produce the exact static export**

Run: `$env:EXPORT='1'; npm run build`

Expected: successful static export with no missing route or asset.

**Step 3: Inspect representative visual states**

Serve the export locally and capture desktop, iPhone-width, and tall/small mobile frames for the opening, every garage act, shop-floor cards, blog navigation, and loader handoff. Compare against current approved frames; accept no loss in model detail or effects.

**Step 4: Measure contention and Core Web Vitals**

Verify no route chunks arrive before navigation intent, poster transfer decreases, warmup long tasks are segmented, and LCP/CLS/INP remain good or improve.

**Step 5: Push source checkpoint**

Push the implementation branch and a new checkpoint tag to `kr8tiv-io/2240-speedshop`. Do not change `main` or force-push.

**Step 6: Deploy and verify publicly**

Deploy the exact export to `C:\tmp\2240deploy\daylight`, push its `main`, purge through the optional hook when credentials exist, and verify the live Hostinger URL across desktop/mobile, garage progression, blog clicks, social links, console, CDN headers, and fresh public performance.

**Step 7: Record final evidence**

Report source and deployment commit IDs, live verification results, measured performance changes, and any compression experiment deliberately held back for lack of proof.
