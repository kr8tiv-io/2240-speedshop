# Progressive Garage, Automotive Loader, and Social Wall Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the live garage appear progressively and reliably, replace the faint long-held opener with a short automotive loader, and present ten equal, unique, directly linked Instagram posts without lowering any 3D asset or effect quality.

**Architecture:** Keep the static Next.js export and both existing R3F worlds. Split garage readiness into a verified-shell phase and an opening-bay phase, retain the warm-station camera frontier, and use the existing photograph only as a dissolving safety layer. Give the hero a lightweight server-rendered vector loader and static image underlay so the overlay can leave quickly while the live canvas finishes honestly.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript, React Three Fiber, Three.js, postprocessing, Tailwind/global CSS, Node contract scripts, Puppeteer visual verification.

---

### Task 1: Add failing contracts for the three regressions

**Files:**
- Create: `scripts/garage-progressive-reveal-contract.mjs`
- Create: `scripts/preloader-automotive-contract.mjs`
- Create: `scripts/instagram-grid-contract.mjs`
- Modify: `package.json`

**Step 1: Write the failing garage contract**

Read `components/shop/Loaders.tsx` and `components/shop/WalkthroughWorld.tsx`. Assert that:

```js
assert.match(loaders, /const REVEAL_WARM_KEYS = \["shell", "0"\]/);
assert.match(loaders, /markShellWarm\(\)[\s\S]*reportWarm\("shell"\)/);
assert.match(walkthrough, /data-shop-stage=/);
assert.match(walkthrough, /preloadShopWorld\(\)/);
```

The existing source must fail because it waits for station 1, marks shell warm only inside the final reveal, exposes no progressive stage, and does not preload the split module.

**Step 2: Write the failing loader contract**

Read `components/home/Preloader.tsx`, `components/home/HeroRuntime.tsx`, `components/home/HomeCinema.tsx`, and `app/globals.css`. Assert that:

```js
assert.match(preloader, /LOADING/);
assert.match(preloader, /data-loader-car/);
assert.match(preloader, /PROGRESSIVE_CEILING_MS\s*=\s*1_200/);
assert.match(runtime, /sceneReady \? "opacity-100" : "opacity-0"/);
assert.match(cinema, /data-hero-still/);
assert.match(css, /loader-turntable/);
```

Also reject the old `14_000` cap and `opacity-[0.06]` mark.

**Step 3: Write the failing Instagram contract**

Read a new `lib/instagram-posts.json` if present and the grid source. Until it exists, fail with a clear missing-data message. Once present, require ten entries, unique `shortcode` values, unique `subject` values, valid `post`/`reel` kinds, existing local files, one square card ratio, a five-column desktop grid, and per-post URL construction.

**Step 4: Register the contracts**

Add:

```json
"test:garage-reveal": "node scripts/garage-progressive-reveal-contract.mjs",
"test:preloader-automotive": "node scripts/preloader-automotive-contract.mjs",
"test:instagram-grid": "node scripts/instagram-grid-contract.mjs"
```

**Step 5: Run tests to verify RED**

Run:

```powershell
npm run test:garage-reveal
npm run test:preloader-automotive
npm run test:instagram-grid
```

Expected: all three fail for the intended missing behaviour, not syntax or path errors.

**Step 6: Commit the red contracts**

```powershell
git add package.json scripts/garage-progressive-reveal-contract.mjs scripts/preloader-automotive-contract.mjs scripts/instagram-grid-contract.mjs
git commit -m "test: capture garage loader and social regressions"
```

### Task 2: Restore progressive garage visibility

**Files:**
- Modify: `components/shop/Loaders.tsx`
- Modify: `components/shop/WalkthroughWorld.tsx`
- Test: `scripts/garage-progressive-reveal-contract.mjs`

**Step 1: Split shell proof from world reveal**

Change the reveal keys to the building and first real subject:

```ts
const REVEAL_WARM_KEYS = ["shell", "0"];
```

Refactor the existing finalizer so the shell's full-size composer proof runs as soon as `shell` reports warm. On success, record the exact finalizer and call `markShellWarm()`. Call `markWorldReady()` only when both that proof exists and `REVEAL_PENDING.size === 0`.

**Step 2: Preload the dynamic garage runtime in the near corridor**

Use one cached import function at module scope and keep the explicit import path inside the `dynamic()` loader:

```ts
let shopWorldModule: ReturnType<typeof importShopWorld> | null = null;
const importShopWorld = () => import("./ShopWorld");
const preloadShopWorld = () => (shopWorldModule ??= importShopWorld());
```

Call `void preloadShopWorld()` as soon as the warm observer enters its existing five-viewport corridor. Keep the actual mount behind the hero-settled and reader-idle gate.

**Step 3: Expose the progressive stage**

Track `boot.warm` and `boot.ready` separately in `WalkthroughWorld`. Emit:

```tsx
data-shop-stage={worldReady ? "world" : worldWarm ? "shell" : "poster"}
```

At the shell stage, reduce the boot photograph to a protective partial opacity. At world-ready, fade it fully. Before shell proof, retain it fully.

**Step 4: Verify GREEN and existing ownership tests**

Run:

```powershell
npm run test:garage-reveal
npm run test:loader-ownership
npm run test:webgl-capability
```

Expected: all pass.

**Step 5: Commit**

```powershell
git add components/shop/Loaders.tsx components/shop/WalkthroughWorld.tsx
git commit -m "fix: reveal the verified garage progressively"
```

### Task 3: Replace the opener with a short automotive loader

**Files:**
- Modify: `components/home/Preloader.tsx`
- Modify: `components/home/HeroRuntime.tsx`
- Modify: `components/home/HomeCinema.tsx`
- Modify: `app/globals.css`
- Test: `scripts/preloader-automotive-contract.mjs`

**Step 1: Add the immediate static hero underlay**

Render `StaticBackdrop` inside the normal fixed film canvas with `data-hero-still`, beneath `LazyHeroRuntime`. Keep the local image's existing `priority` and full-viewport `sizes` values so the static export has a fast visual LCP candidate.

**Step 2: Hide the opaque live canvas until it has a verified frame**

In `HeroRuntime`, keep local `sceneReady` state. The existing ready callback sets it and publishes to `hero-boot`. Crossfade the runtime host from opacity zero to one only after ready:

```tsx
className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
  sceneReady ? "opacity-100" : "opacity-0"
}`}
```

This prevents the preloader's early exit from exposing an unprimed black canvas.

**Step 3: Build the zero-network automotive mark**

Replace the six-percent badge with inline SVG classic-car geometry, two wheel circles, a turntable/tach ring, a small `2240 SPEED SHOP` identifier, `LOADING`, and the existing percentage. Add `data-loader-car` to the stage.

Do not import Three.js, a GLB, an image, or another runtime.

**Step 4: Shorten the timing contract**

Use:

```ts
const PROGRESSIVE_CEILING_MS = 1_200;
const MIN_BRAND_MS = 500;
const IGNITION_MS = 250;
const EXIT_MS = 400;
const ESCAPE_MS = 3_000;
```

Scene readiness may exit earlier after the minimum. The progressive ceiling is a normal static-underlay handoff, not an error. Keep failed-render and raw-DOM emergency provenance distinct.

**Step 5: Add loader motion and reduced-motion CSS**

Create `loader-turntable`, `loader-car-idle`, and progress-sweep styles using transform/opacity only. Under `prefers-reduced-motion`, disable those animations while retaining the full-contrast car and loading text. Update the CSS dead-man to release by four seconds.

**Step 6: Verify GREEN**

Run:

```powershell
npm run test:preloader-automotive
npm run test:hero-runtime
npm run test:route-veil
```

Expected: all pass.

**Step 7: Commit**

```powershell
git add components/home/Preloader.tsx components/home/HeroRuntime.tsx components/home/HomeCinema.tsx app/globals.css
git commit -m "feat: add a fast automotive boot sequence"
```

### Task 4: Normalize and deduplicate the shop-floor gallery

**Files:**
- Create: `lib/instagram-posts.json`
- Modify: `components/InstagramGrid.tsx`
- Modify: `app/globals.css`
- Test: `scripts/instagram-grid-contract.mjs`

**Step 1: Add ten verified unique post records**

Store `file`, `alt`, `kind`, `shortcode`, `subject`, and optional `position`. Omit `ig-2024-01-31_photo_C2yORYaviUI.jpg` because it repeats the brown 1955 car and omit `ig-2024-12-24_reel_DD-OQFOy8Og.jpg` because it repeats the black Camaro.

All remaining direct URLs were verified as HTTP 200 on 2026-08-29.

**Step 2: Render equal direct-link cards**

Build each href as:

```ts
const href = `https://www.instagram.com/${post.kind}/${post.shortcode}/`;
```

Use `aspect-square` for every card and `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`. Apply `objectPosition` from the record and retain descriptive alt text, `target="_blank"`, and `rel="noopener noreferrer"`.

**Step 3: Add restrained hover/focus illumination**

Use transform and overlay-opacity transitions, a thin tungsten inset edge, and a subtle warm radial highlight. Keyboard focus must receive the same visual elevation. Reduced-motion mode keeps the highlight but removes scale animation.

**Step 4: Verify GREEN**

Run:

```powershell
npm run test:instagram-grid
npm run test:copy-layout
```

If `test:copy-layout` is not registered, run `node scripts/copy-layout-checks.mjs`.

Expected: ten unique valid entries, equal card classes, direct links, and clean copy layout.

**Step 5: Commit**

```powershell
git add lib/instagram-posts.json components/InstagramGrid.tsx app/globals.css
git commit -m "feat: refine the shop floor social wall"
```

### Task 5: Build and measure locally

**Files:**
- Modify if required by a discovered regression: only files already named above
- Artifacts: `output/playwright/garage-loader-social-local/`

**Step 1: Run every focused and existing contract**

Run the three new tests plus all scripts registered under `test:*` in `package.json`.

Expected: zero failures.

**Step 2: Build the static export**

Run:

```powershell
npm run build
```

Expected: successful Next.js webpack build and static export with no TypeScript error.

**Step 3: Serve the export**

Run `npm run serve:export` in a reusable terminal session and note its local URL.

**Step 4: Run garage matrices**

Run `scripts/combined-shots.js` with `SHOT_SCOPE=shop` for `desktop`, `phone320`, `phone375`, `phone390`, and `phone430`, writing under `output/playwright/garage-loader-social-local/`.

Expected: all stations contain visible geometry, no white/uninitialised composer, no page error, and `CLEAN`.

**Step 5: Add a focused loader/gallery browser probe**

Use Puppeteer to record loader disappearance time, hero static-to-live crossfade, gallery card rectangles, resolved direct links, hover screenshot, and horizontal overflow at desktop and phone390.

Expected: loader covering state is gone by roughly two seconds, all gallery rectangles at one viewport are equal, ten unique direct links, and zero overflow.

**Step 6: Inspect screenshots manually**

Verify the loader reads immediately, the car silhouette is crisp, the garage shell is visibly live before the final doorway dissolve, every station remains full-quality, gallery crops retain their subjects, and hover illumination is subtle.

### Task 6: Checkpoint, push, deploy, and verify production

**Files:**
- Source repository: current worktree
- Deployment repository: `C:\tmp\2240deploy\daylight`

**Step 1: Run final source status and diff review**

Confirm only intended tracked files changed. Preserve all pre-existing untracked visual artifacts.

**Step 2: Commit final verification adjustments if any**

Use a narrowly scoped message and do not amend unrelated history.

**Step 3: Push the source branch**

```powershell
git push kr8tiv-ai codex/3d-elevation-2026-08-24
```

Expected: GitHub branch advances to the verified source commit.

**Step 4: Deploy with immutable-chunk overlap**

```powershell
pwsh -NoProfile -File scripts/deploy-combined.ps1 -Repo 'C:\tmp\2240deploy\daylight' -Message 'Deploy: progressive garage loader and social wall'
```

Expected: deploy repository checkpoint, Hostinger upload success, and old/new static generation overlap retained.

**Step 5: Re-run the production browser matrix**

Use `BASE_URL=https://steelblue-gaur-917651.hostingersite.com`, rerun focused phone390 and desktop garage shots, then loader/gallery probes.

Expected: live garage progressive state, every station populated, loader under its ceiling, direct unique Instagram links, equal cards, and zero unique page errors.

**Step 6: Confirm deployed asset integrity**

Fetch the public HTML, referenced webpack runtime, dynamic garage chunk, CSS, hero shelves, and both garage model shelves. Expected: HTTP 200 for every referenced immutable asset during rollout.

**Step 7: Report the production result**

Provide source and deploy commit IDs, measured before/after garage and loader timing, browser/device coverage, and direct links to the live site and GitHub branch.

