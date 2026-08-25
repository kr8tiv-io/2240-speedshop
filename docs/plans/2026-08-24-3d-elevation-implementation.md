# 2240 Speed Shop 3D Elevation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate the existing 2240 cinematic 3D site while preserving every signature effect, removing invisible runtime/network work, fixing Apple/mobile composition, and replacing weak sales copy.

**Architecture:** Keep the DOM/server-rendered site and current hero/shop scenes, but insert a lightweight boot boundary before the Three.js runtime. Isolate progress ownership, content-address hero assets, schedule each WebGL canvas only when it can contribute visible pixels, and make continuity/mobile behavior explicit in the existing film state machine. Validate changes with production builds, an executable Puppeteer audit, WebKit/iPhone sweeps, and frame-by-frame screenshots.

**Tech Stack:** Next.js 16.2, React 19.2, TypeScript, React Three Fiber 9.7, Three.js r185, drei, postprocessing, GSAP, Lenis, Puppeteer, Playwright WebKit, Sharp, PowerShell/Hostinger Git deployment.

---

### Task 1: Preserve and document the authoritative baseline

**Files:**
- Create: `docs/plans/2026-08-24-3d-elevation-design.md`
- Create: `docs/plans/2026-08-24-3d-elevation-implementation.md`

**Step 1: Import the unversioned August 21 source**

Mirror `C:\Users\lucid\Desktop\2240-combined` into the isolated worktree while excluding `.git`, `node_modules`, `.next`, `out`, screenshot folders, and `*.tsbuildinfo`.

**Step 2: Verify the imported delta**

Run:

```powershell
git diff --cached --name-status
pnpm build
```

Expected: only the two known runtime fixes, the 22 unregistered article remnants, and `scripts/transfer-audit.mjs` differ from `combined-build`; production build exits 0 with 44 static routes and only the original 10 registered articles.

**Step 3: Commit and tag the source checkpoint**

```powershell
git commit -m "chore: checkpoint authoritative combined source"
git tag -a checkpoint-combined-source-2026-08-24 -m "Authoritative combined source imported before Codex 3D elevation"
git push --no-verify -u origin codex/3d-elevation-2026-08-24
git push --no-verify origin checkpoint-combined-source-2026-08-24
```

**Step 4: Commit the approved design and plan**

```powershell
git add docs/plans
git commit -m "docs: lock fidelity-preserving 3D elevation plan"
```

### Task 2: Add falsifiable visual/performance regression checks

**Files:**
- Create: `scripts/elevation-checks.mjs`
- Modify: `scripts/combined-shots.js`
- Modify: `package.json`

**Step 1: Write failing audit assertions**

Create a Puppeteer script that loads `BASE_URL/?tune=1`, samples desktop plus 320/375/390/430 phone widths, and fails when any of these are true:

- real horizontal scrolling is possible;
- more than two WebGL canvases exist during the opening film;
- any registered GL-image texture is requested before its DOM image is near the viewport;
- the mobile menu does not cover the viewport with an opaque isolated layer;
- menu-open does not lock scroll or exposes a target below 44x44 CSS pixels;
- preloader remains past its non-emergency readiness window;
- console/page/WebGL errors occur;
- the whole-car edge published by tuning mode exceeds the existing threshold;
- a scripted 0→7200 scroll produces a stall above 250 ms.

Use `node:assert/strict`; a budget violation exits nonzero and prints the measured value.

**Step 2: Run the audit and record the expected RED state**

```powershell
BASE_URL=https://steelblue-gaur-917651.hostingersite.com node scripts/elevation-checks.mjs
```

Expected: FAIL for three opening canvases, early GL-image transfers, 40px/transparent mobile menu, and current frame-stall budget.

**Step 3: Expand the film sweep**

Add 375 and 430 widths to `combined-shots.js`, open `/?tune=1`, collect per-beat car edges, capture menu-open and transition-gap frames, and preserve current 320/390 coverage.

**Step 4: Add scripts and commit**

```json
{
  "scripts": {
    "audit:elevation": "node scripts/elevation-checks.mjs",
    "shots:combined": "node scripts/combined-shots.js"
  }
}
```

Run the audit once more to prove the assertions still fail for the intended reasons, then commit:

```powershell
git add scripts package.json
git commit -m "test: make 3D fidelity and mobile budgets executable"
```

### Task 3: Mount the correct hero runtime on the first commit

**Files:**
- Create: `components/home/hero-boot.ts`
- Create: `components/home/HeroRuntime.tsx`
- Modify: `components/home/HomeCinema.tsx`
- Modify: `components/home/Preloader.tsx`
- Modify: `components/home/HeroScene.tsx`
- Modify: `components/SmoothScroll.tsx`

**Step 1: Add a failing boot test**

Extend `elevation-checks.mjs` to emulate a touch/mobile media profile and assert that the first mounted canvas exposes the mobile renderer profile, while reduced-motion loads zero WebGL canvases and no hero GLBs. Confirm it fails because `HomeCinema` initially renders `mobile=false` and module-scope preloads run before the preference effect.

**Step 2: Add a lightweight external boot store**

Implement a small `useSyncExternalStore` store with this shape:

```ts
type HeroBootSnapshot = {
  progress: number;
  sceneReady: boolean;
  failed: boolean;
};
```

It must not import Three, drei, R3F, or postprocessing. `Preloader` reads this store. A progress bridge inside the dynamically imported runtime reads drei `useProgress` and publishes into it.

**Step 3: Resolve capability before mounting WebGL**

Use a tri-state profile in `HomeCinema`:

```ts
type RuntimeProfile = null | {
  mobile: boolean;
  reduced: boolean;
  webgl2: boolean;
};
```

Resolve it in a client layout effect using safe `matchMedia` helpers. Render the complete DOM shell while `null`; only mount `HeroRuntime` after the profile is known. Reduced-motion and no-WebGL2 profiles use the art-directed fallback and never import `HeroScene`.

**Step 4: Lazy-load the heavy runtime**

Move the static `HeroScene` import behind `next/dynamic` with client-only loading. Preserve all current model preloads, `ScenePrimer`, fixed DPR, composer settings, and the same motion-enabled visuals.

**Step 5: Add legacy Apple media-query cleanup**

Use `addEventListener("change")` when available and `addListener`/`removeListener` otherwise in `HomeCinema`, `SmoothScroll`, and the walkthrough gate.

**Step 6: Verify GREEN and commit**

```powershell
pnpm build
pnpm audit:elevation
git add components/home components/SmoothScroll.tsx
git commit -m "perf: boot the correct hero tier without loading Three early"
```

Expected: reduced-motion requests no hero GLB/Three chunk; first phone canvas uses the phone profile; all original film screenshots remain visually equivalent.

### Task 4: Isolate loader ownership and harden WebGL failure handling

**Files:**
- Modify: `components/shop/ShopWorld.tsx`
- Modify: `components/shop/WalkthroughWorld.tsx`
- Modify: `components/home/Preloader.tsx`
- Create: `components/gl/WebGLFallback.tsx`
- Modify: `scripts/elevation-checks.mjs`

**Step 1: Write the failing progress-ownership check**

Delay hero responses in the audit, allow the shop shell to mount, and assert hero progress continues after the shop progress hook attaches. Confirm RED: `ShopWorld` overwrites `THREE.DefaultLoadingManager.onProgress` and cleanup leaves a no-op.

**Step 2: Chain and restore the manager callback**

Capture the prior callback, publish shop progress only for shop model URLs, call the prior callback, and restore it only when the current handler is still the installed wrapper. Do not leave a no-op on cleanup.

**Step 3: Require WebGL2 and add recovery UI**

Make the capability predicate require `canvas.getContext("webgl2")`. Wrap each Canvas in an error boundary, listen for `webglcontextlost`, prevent endless remount loops, and show a dark branded still/continue-to-content fallback.

**Step 4: Remove false watchdog recovery**

Do not reveal hundreds of incompletely warmed objects as a success path. Make scene-ready depend on completed visibility restoration for the required opening set, with later bays continuing their paced warm-up.

**Step 5: Verify and commit**

```powershell
pnpm build
pnpm audit:elevation
git add components/shop components/home/Preloader.tsx components/gl scripts/elevation-checks.mjs
git commit -m "fix: isolate 3D loading and recover cleanly from WebGL loss"
```

### Task 5: Content-address hero models without invalidating shop assets

**Files:**
- Create: `scripts/hero-version.js`
- Create: `scripts/hero-version.test.mjs`
- Modify: `next.config.ts`
- Modify: `components/home/HeroScene.tsx`
- Modify: `scripts/prepare-deploy.js`
- Modify: `scripts/deploy-combined.ps1`

**Step 1: Write the failing hash test**

The test copies two tiny fixture files into a temporary hero shelf and asserts:

1. stable bytes produce the same eight-character version;
2. changing one byte changes the version;
3. changing hero bytes does not change the existing shop shelf version.

Run:

```powershell
node --test scripts/hero-version.test.mjs
```

Expected: FAIL because no independent hero version exists.

**Step 2: Implement independent hero versioning**

Hash sorted `public/models/hero/*.glb` bytes. Export `NEXT_PUBLIC_HERO_VERSION` only for `EXPORT=1`. In dev, keep `/models/hero/`; in export, use `/models/hero-<hash>/`.

**Step 3: Stamp the export shelf**

After pruning raw authoring models, rename `out/models/hero` to `out/models/hero-<hash>` and make `prepare-deploy.js` fail if the compiled version and shelf name disagree.

**Step 4: Remove token-bearing push URLs**

Update the deployment script to use the configured GitHub credential helper and `git push --no-verify origin HEAD:main`, never a token embedded in a process command line.

**Step 5: Verify and commit**

```powershell
node --test scripts/hero-version.test.mjs
$env:EXPORT="1"; pnpm build
node scripts/prepare-deploy.js
git add scripts next.config.ts components/home/HeroScene.tsx
git commit -m "perf: content-address hero models independently"
```

### Task 6: Stop invisible GPU work and defer the editorial canvas

**Files:**
- Modify: `components/home/HeroScene.tsx`
- Modify: `lib/stage.ts`
- Modify: `components/gl/GLImagesLayer.tsx`
- Modify: `components/gl/registry.ts`
- Modify: `scripts/elevation-checks.mjs`

**Step 1: Write failing visibility/network assertions**

In tuning mode publish ghost/point visibility and renderer draw counts. Assert the ghost meshes and point cloud are hidden when their shader alpha envelope is zero. Assert the GL-image canvas/textures do not mount/fetch until the first registered DOM target is within 600px. Confirm current behavior fails.

**Step 2: Gate the grid and points with their exact envelopes**

Extract one shared envelope function used by both shader alpha and object visibility. Keep `ScenePrimer` able to force a warm frame, then restore live visibility. Do not change the visible portion of the reveal.

**Step 3: Gate production diagnostics**

Create `window.__film` only for development or `?tune=1`. Reuse a preallocated diagnostic object/arrays and update it only when the tuning harness is active.

**Step 4: Defer the GL-image Canvas**

Observe registered DOM nodes without mounting R3F. Latch `mounted=true` when the nearest target enters the prewarm margin, then retain the canvas and use the existing `frameloop="never"` parking outside the active range. Preserve the exact hover/flow shader when visible.

**Step 5: Verify and commit**

```powershell
pnpm build
pnpm audit:elevation
git add components/home/HeroScene.tsx lib/stage.ts components/gl scripts/elevation-checks.mjs
git commit -m "perf: render only 3D work that can reach the frame"
```

### Task 7: Fix the mobile menu, Safari viewport, and film continuity

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `components/home/HomeCinema.tsx`
- Modify: `components/home/ProcessRail.tsx`
- Modify: `components/home/ReviewsCinema.tsx`
- Modify: `app/globals.css`
- Modify: `lib/stage.ts`
- Modify: `scripts/combined-shots.js`

**Step 1: Preserve the failing screenshots**

Keep the WebKit 320 menu collision and black transition frames as before images. Add automated assertions for opaque menu coverage, scroll lock, minimum 44px targets, and no copy behind the menu.

**Step 2: Make mobile navigation a real modal layer**

Render an opaque fixed layer above every canvas, apply safe-area padding, give the trigger and links 48px minimum targets, lock document/Lenis scroll, trap focus, close on Escape, and mark the covered page inert/aria-hidden while open. Park canvases while the menu is open.

**Step 3: Add Safari viewport fallbacks**

Place `h-screen`/`min-h-screen` before `h-[100svh]`/`min-h-[100svh]`; add `env(safe-area-inset-*)` where navigation/copy touches screen edges.

**Step 4: Remove full-black handoff frames**

Overlap outgoing and incoming ambient/lamp contribution across the existing cuts. Keep the car/grid act boundaries and camera cuts intact; only the zero-light gap is removed. Verify at the exact current black beats around desktop 6800–7200 and 17600–18000 plus mobile ~4500.

**Step 5: Re-author mobile text/car separation**

Adjust the existing aspect-aware camera/copy keys so no car or lamp covers body copy/header at 320/375/390/430. Do not scale down the model or remove an effect.

**Step 6: Verify and commit**

Run Chromium and Playwright WebKit sweeps, then:

```powershell
pnpm build
pnpm audit:elevation
git add components/Nav.tsx components/home app/globals.css lib/stage.ts scripts/combined-shots.js
git commit -m "fix: make the cinematic flow continuous and iPhone-safe"
```

### Task 8: Elevate materials, lighting, grid energy, and grain

**Files:**
- Modify: `components/home/HeroScene.tsx`
- Modify: `lib/stage.ts`
- Modify: `components/shop/Effects.tsx`
- Modify: `components/shop/ShopWorld.tsx`
- Modify: `app/globals.css`
- Create: `public/fx/grain-tile.webp`

**Step 1: Establish visual goldens**

Capture each act at desktop/320/390 and the seven shop stations before changing visual parameters. Record luminance/histogram and car-edge metrics so a brighter result cannot hide crushed detail or clipping.

**Step 2: Tune only evidence-backed materials**

Adjust existing physical materials by semantic role: clear-coated paint, oxidized/primer body, chrome/metal, glass, rubber, and emissive lamps. Preserve geometry, AO, color identity, and material count. Clamp energy so bloom does not erase panel lines.

**Step 3: Improve the lighting hierarchy**

Strengthen shaped tungsten keys and cool rim separation, contact grounding, and shop practical falloff without raising the entire black level. Keep the same number of narrative lights where possible; reuse lights instead of adding broad full-scene cost.

**Step 4: Refine the lattice reveal**

Keep quantized cells, wire ghost, and scan sheet. Tighten scan-edge falloff and give the emissive energy a cleaner build/settle curve while preserving the lattice-through-car signature.

**Step 5: Replace oversized procedural grain**

Generate a small seamless monochrome WebP tile, render it on a modest repeated surface, and animate transform offsets. Match the existing grain at desktop and iPhone while removing the 200%×200% SVG turbulence blend layer.

**Step 6: Compare, verify, and commit**

Reject any change that loses visible geometry, panel highlights, lattice density, bloom character, or shop atmosphere. Then run the full film sweep and commit:

```powershell
git add components lib/stage.ts app/globals.css public/fx
git commit -m "feat: elevate the midnight materials and light choreography"
```

### Task 9: Replace weak copy with accountable shop proof

**Files:**
- Modify: `components/home/HomeCinema.tsx`
- Modify: `components/shop/WalkthroughSections.tsx`
- Modify: `app/services/page.tsx`
- Modify: `app/page.tsx`
- Modify: other files only when the live inventory proves a line is visible and weak

**Step 1: Write the copy acceptance list**

Assert the production HTML no longer contains:

- “Tell me what it’s worth to you.”
- “Six trades, one roof.”
- “Car people do not write essays.”
- “Three Google reviews with words in them, verbatim.”
- “One finished car, doing slow circles.”
- “The wall keeps the receipts.”
- “East Edmonton. Worth the drive from anywhere.”
- time-sensitive “going home this week” language.

**Step 2: Replace the Act III close**

Use:

```text
Bring us the car you refuse to give up on.
Barn find, stalled project, or the one you kept too long to hand to the wrong shop.
Terry reads every build request himself. Send the photos; get a straight answer.
```

Primary CTA: `Show us the car` where the action opens the build request.

**Step 3: Replace the repeated one-roof claim**

Walk-through headline:

```text
One build. One shop. One name on the line.
```

Services proof:

```text
Metal, powertrain, paint, trim, and final tuning stay with one team.
The person who takes the car in is accountable for the car that leaves.
```

**Step 4: Rewrite the remaining weak live lines**

Keep facts, service keywords, Edmonton/location language, and genuine review text. Replace self-conscious quips with mechanical proof, ownership, turnaround expectations, or project evidence. Reduce repeated use of “honest.”

**Step 5: Verify copy and mobile wrapping**

```powershell
rg -n -i "worth to you|six trades|car people do not|three google reviews|slow circles|wall keeps the receipts|going home this week" app components lib
pnpm build
```

Expected: no live matches; all replacement blocks remain clear at 320px and are present in server-rendered HTML.

**Step 6: Commit**

```powershell
git add app components lib
git commit -m "copy: make the shop voice specific and accountable"
```

### Task 10: Production proof, full export, and Hostinger deployment

**Files:**
- Modify only if verification exposes a defect.
- Output: `out/`
- Deployment mirror: `C:\tmp\2240deploy\daylight`

**Step 1: Run code/build gates**

```powershell
pnpm build
pnpm audit:elevation
node --test scripts/hero-version.test.mjs
```

Run ESLint on every touched TypeScript/TSX file. Record the inherited full-repo lint baseline separately rather than claiming it is clean.

**Step 2: Build and inspect the static export**

```powershell
$env:EXPORT="1"
pnpm exec next build
node scripts/precompress.js
node scripts/prepare-deploy.js
node scripts/flatten-rsc.mjs out
```

Verify payload sizes, Brotli twins, hero/shop shelf names, immutable headers, no raw authoring model leakage, exactly 10 registered articles, and no missing request from a local static server.

**Step 3: Run the complete visual matrix**

- Chromium: 1440×900, 320×568, 375×812, 390×844, 430×932.
- WebKit: compact 320 and iPhone 13/15 class 390.
- Reduced motion and WebGL2-unavailable fallbacks.
- Every film act, black-gap beat, shop station, menu-open state, DOM section, Journal, and article template.

**Step 4: Create the pre-deploy tag**

```powershell
git tag -a checkpoint-pre-hostinger-elevation-2026-08-24 -m "Verified elevation before Hostinger deploy"
git push --no-verify origin codex/3d-elevation-2026-08-24
git push --no-verify origin checkpoint-pre-hostinger-elevation-2026-08-24
```

**Step 5: Deploy through the established full-site path**

```powershell
pwsh scripts/deploy-combined.ps1 -Repo C:\tmp\2240deploy\daylight -Message "Elevate the 2240 cinematic site without sacrificing fidelity"
```

Do not call the destructive Hostinger static-site API with a partial archive.

**Step 6: Verify production, not just the push**

Wait for the webhook, confirm the live deployment commit/content hash, rerun `audit:elevation`, `combined-shots.js`, WebKit screenshots, headers, and key user flows against `https://steelblue-gaur-917651.hostingersite.com/`.

Only after those live checks pass may the result be called complete.
