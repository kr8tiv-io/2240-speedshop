# Elegant Loader and Garage Prewarm Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the illustrated loader and photographic garage placeholder with an elegant, zero-network instrument plate and an early-warmed photo-free 3D garage, while increasing walkthrough copy legibility without reducing final 3D quality.

**Architecture:** Keep the static Next.js export and the existing independent hero/shop R3F worlds. Preserve the short progressive hero handoff, request the split shop runtime after the hero's verified frame, allow a bounded idle deadline to mount the parked shop before proximity, and retain the station frontier and final effect tiers. Replace both temporary visual states with CSS/DOM treatments that share the site's after-hours light language.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript, React Three Fiber, Three.js, CSS/Tailwind, Node contract tests, Puppeteer/Chrome production probes.

---

### Task 1: Capture the new loader, preload, and typography contracts

**Files:**
- Modify: `scripts/preloader-automotive-contract.mjs`
- Modify: `scripts/garage-progressive-reveal-contract.mjs`
- Create: `scripts/shop-copy-legibility-contract.mjs`
- Modify: `scripts/garage-loader-social-check.mjs`
- Modify: `package.json`

**Step 1: Rewrite the loader contract to reject the illustrated car**

Require the instrument identifiers and explicitly reject the old SVG/car hooks:

```js
assert.match(preloader, /data-loader-instrument/);
assert.match(preloader, /OPENING THE SHOP/);
assert.match(preloader, /EDMONTON \/ AFTER HOURS/);
assert.doesNotMatch(preloader, /data-loader-car|loader-car-idle|<svg/);
assert.doesNotMatch(css, /loader-car-|loader-wheel|loader-turntable/);
```

Keep the existing bounded timing, static hero underlay, and runtime deferral assertions.

**Step 2: Extend the garage contract to reject the photograph and hard stillness gate**

Add assertions for a post-hero preload and a bounded idle warm deadline:

```js
assert.doesNotMatch(world, /shop-showroom-neon-|wt-world-boot-photo|<picture>/);
assert.match(world, /subscribeHeroBoot/);
assert.match(world, /void preloadShopWorld\(\)/);
assert.match(world, /window\.requestIdleCallback|window\.setTimeout/);
assert.doesNotMatch(world, /heroSettled && stillFor\(\) >= 900/);
```

**Step 3: Add a shop-copy legibility contract**

Read `components/shop/WalkthroughSections.tsx` and require named classes for station eyebrow, body, list, and glide body. Assert fluid body text has a 17 px mobile floor, metadata has at least a 12 px floor, and the generic 15 px/11 px definitions no longer drive the walkthrough.

**Step 4: Update the browser release probe**

Replace the `[data-loader-car]` expectation with `[data-loader-instrument]`. Track requests containing `shop-showroom-neon` and fail if any occur. Capture station copy computed sizes and require body ≥ 17 px, eyebrow/list ≥ 12 px, and glide copy ≥ 16 px on tested phone profiles.

**Step 5: Register the new contract**

Add:

```json
"test:shop-copy-legibility": "node scripts/shop-copy-legibility-contract.mjs"
```

**Step 6: Run the focused tests and verify RED**

Run:

```powershell
npm run test:preloader-automotive
npm run test:garage-reveal
npm run test:shop-copy-legibility
```

Expected: each fails for the intended old loader/photo/type behavior.

**Step 7: Commit the red contracts**

```powershell
git add package.json scripts/preloader-automotive-contract.mjs scripts/garage-progressive-reveal-contract.mjs scripts/shop-copy-legibility-contract.mjs scripts/garage-loader-social-check.mjs
git commit -m "test: capture loader and garage handoff regressions"
```

### Task 2: Build the instrument-panel opener

**Files:**
- Modify: `components/home/Preloader.tsx`
- Modify: `app/globals.css`
- Test: `scripts/preloader-automotive-contract.mjs`

**Step 1: Remove the illustrated-car DOM**

Replace the entire `data-loader-car` stage and inline SVG with one `data-loader-instrument` composition containing:

```tsx
<div data-loader-instrument className="loader-instrument">
  <div className="loader-instrument__identity">
    <span className="loader-instrument__mark">2240</span>
    <span>EDMONTON / AFTER HOURS</span>
  </div>
  <div className="loader-instrument__rule" aria-hidden="true"><span /></div>
  <div className="loader-instrument__status">
    <span>OPENING THE SHOP</span>
    <span>{String(displayedProgress).padStart(3, "0")}%</span>
  </div>
</div>
```

Retain the existing honest percentage and state provenance. Do not add an image, SVG, model, canvas, or imported asset.

**Step 2: Replace loader-car CSS with restrained instrument motion**

Delete `loader-turntable`, `loader-car-idle`, wheel, body, glass, and ignition selectors/keyframes. Add a near-black plate, a precise wordmark, a one-pixel tungsten rule with a transform-only sweep, subdued technical labels, and a reduced-motion static state.

**Step 3: Keep the bounded handoff unchanged**

Retain the current progressive ceiling, escape paths, and static hero crossfade. The new visual must not lengthen the covering state.

**Step 4: Run the loader and ownership tests**

```powershell
npm run test:preloader-automotive
npm run test:hero-runtime
npm run test:loader-ownership
npm run test:route-veil
```

Expected: all pass.

**Step 5: Commit**

```powershell
git add components/home/Preloader.tsx app/globals.css
git commit -m "feat: replace car loader with instrument plate"
```

### Task 3: Remove the garage photograph and warm the real world earlier

**Files:**
- Modify: `components/shop/WalkthroughWorld.tsx`
- Modify: `app/globals.css`
- Test: `scripts/garage-progressive-reveal-contract.mjs`

**Step 1: Remove the photographic doorway state**

Delete `doorwayNear`, the `<picture>`, both `shop-showroom-neon` paths, and `.wt-world-boot-photo`. Keep one `wt-world-boot-light` element with the existing boot-stage opacity transition.

**Step 2: Make the boot light architectural rather than photographic**

Use CSS gradients and pseudo-elements for an overhead tungsten pool, cool floor spill, lift-door seams, and faint perspective lines. Keep all animation on opacity/transform and ensure the fallback remains readable in reduced-motion and WebGL-failure modes.

**Step 3: Preload the split runtime after verified hero readiness**

Subscribe to `hero-boot`. When `sceneReady` or `failed` becomes true and `run` is true, schedule `void preloadShopWorld()` through `requestIdleCallback` with a short timeout and a timer fallback. Cancel the scheduled work on cleanup.

**Step 4: Convert reader stillness from a hard gate to a preference**

Track when the runway enters an expanded warm corridor and add a bounded post-hero deadline. Mount immediately when near and still; otherwise mount when the deadline expires even if scroll events continue. Never mount before the hero is settled. Keep the active/draw observer and frame parking unchanged.

**Step 5: Preserve model/effect ownership**

Do not change `ShopWorld`, loader shelves, model URLs, DPR decisions, effects, or camera/frontier logic in this task.

**Step 6: Run garage and WebGL contracts**

```powershell
npm run test:garage-reveal
npm run test:model-pipeline
npm run test:webgl-capability
npm run test:hero-scene-ownership
```

Expected: all pass.

**Step 7: Commit**

```powershell
git add components/shop/WalkthroughWorld.tsx app/globals.css
git commit -m "perf: prewarm the photo-free garage"
```

### Task 4: Increase walkthrough copy legibility

**Files:**
- Modify: `components/shop/WalkthroughSections.tsx`
- Test: `scripts/shop-copy-legibility-contract.mjs`

**Step 1: Give walkthrough text explicit semantic class hooks**

Add `wt-station-eyebrow`, `wt-station-body`, `wt-station-list`, and `wt-glide-body` class hooks so browser probes can distinguish the shop copy from site-wide corner notes.

**Step 2: Increase the fluid type scale and contrast**

Use:

```ts
const STATION_BODY = "wt-station-body mt-5 max-w-[34rem] font-body text-[clamp(1.0625rem,2.2vw,1.125rem)] leading-[1.68] text-bone/78 ...";
const STATION_LIST = "wt-station-list ... text-[clamp(0.75rem,1.45vw,0.8125rem)] ... text-bone/72";
```

Style the eyebrow at a 12 px minimum and the glide paragraph at 16 px. Reduce uppercase tracking enough to improve reading without changing the industrial voice.

**Step 3: Run the source contract**

```powershell
npm run test:shop-copy-legibility
```

Expected: PASS.

**Step 4: Commit**

```powershell
git add components/shop/WalkthroughSections.tsx
git commit -m "style: improve garage copy legibility"
```

### Task 5: Build and verify the exact export

**Files:**
- Modify only if a verified regression requires it: files already listed above
- Artifacts: `output/playwright/elegant-loader-garage/`

**Step 1: Run every registered `test:*` contract**

Enumerate `package.json` scripts beginning with `test:` and run them sequentially. Expected: zero failures.

**Step 2: Build the static export**

```powershell
$env:EXPORT='1'; npm run build
node scripts/prepare-deploy.js
node scripts/flatten-rsc.mjs out
```

Expected: compilation, TypeScript, and all 44 static pages succeed.

**Step 3: Serve the prepared export**

```powershell
npm run serve:export
```

Expected: `http://127.0.0.1:3117`.

**Step 4: Run Core Web Vitals and the release matrix**

```powershell
$env:BASE_URL='http://127.0.0.1:3117'; npm run audit:cwv-live
$env:BASE_URL='http://127.0.0.1:3117'; npm run audit:garage-loader-social
$env:BASE_URL='http://127.0.0.1:3117'; npm run audit:copy-layout
```

Expected: mobile INP ≤ 200 ms, CLS ≤ 0.1, loader under its bounded ceiling, photo requests = 0, live garage geometry at desktop and phone390, larger shop type floors, equal unique social cards, and zero page errors.

**Step 5: Add a continuous-scroll reproduction to the release probe**

Drive the page from the hero toward the garage without a 900 ms pause. Record the first shop-stage transition, module/network timing, and doorway frame. Expected: the shop is mounted/warming without requiring scroll stillness and the only interim visual is the abstract bay light.

**Step 6: Inspect the screenshots manually**

Inspect loader, garage doorway, engine station, shop body copy, and gallery frames at desktop, 320, 375, 390, 430, and 768 px. Confirm Apple safe-area padding, no overflow/collision, no stale photograph, and consistent visual integrity.

### Task 6: Checkpoint, push, deploy, and prove production

**Files:**
- Source repository: current worktree
- Deployment repository: `C:\tmp\2240deploy\daylight`

**Step 1: Review the intended diff**

Run `git diff --check`, `git diff --stat`, and `git status --short`. Preserve existing untracked screenshots and `output/`.

**Step 2: Commit final audit adjustments if needed**

Use a narrow commit message and stage only intended tracked source/test files.

**Step 3: Push the source checkpoint**

Push `codex/3d-elevation-2026-08-24` to the `kr8tiv-ai` remote using the verified hook-safe Windows invocation.

**Step 4: Deploy the exact source**

```powershell
pwsh -NoProfile -File scripts/deploy-combined.ps1 -Repo 'C:\tmp\2240deploy\daylight' -Message 'Deploy: elegant loader and early garage prewarm'
```

Expected: immutable export committed and pushed to the Hostinger deployment repository.

**Step 5: Wait for the new public generation**

Poll the public HTML for the new page/CSS chunk identifiers. Do not treat the webhook push alone as deployment success.

**Step 6: Run the public release probes**

Run public Core Web Vitals, garage/loader/social, and focused copy-layout checks against `https://steelblue-gaur-917651.hostingersite.com/`.

Expected: the public build matches local results, zero old-photo requests, loader and copy screenshots are visually approved, full garage integrity remains, and zero browser errors occur.

**Step 7: Report the verified result**

Provide the live URL, source/deploy commit IDs, measured public LCP/INP/CLS, model transport integrity, tested viewport list, garage state evidence, and loader/copy screenshots.

