# Designer Type, Raw Metal, and Perceived-Speed Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the accent face with Instrument Serif, make the Station 03 shell read as raw steel, and remove dead opening latency without reducing 3D or animation fidelity.

**Architecture:** Keep the existing Next.js/React/Three architecture. Limit typography work to the root font registration and `.accent-serif`, introduce one explicit raw-metal vehicle material grade, and shorten only the loader/runtime scheduling gaps that currently perform no asset work. Preserve all model files and renderer-quality settings.

**Tech Stack:** Next.js 16, React 19, TypeScript, Three.js, React Three Fiber, `next/font/google`, Tailwind CSS 4, Puppeteer browser audits.

---

### Task 1: Add regression contracts

**Files:**
- Create: `scripts/designer-type-speed-contract.mjs`
- Create: `scripts/raw-metal-finish-contract.mjs`
- Modify: `package.json`

**Step 1: Write the failing typography and timing contract**

Assert that the root layout imports and registers `Instrument_Serif` with italic 400 only, Bodoni is absent, `.accent-serif` uses the new variable, the loader ceiling is no more than 800 ms, the full plate choreography is no more than 1.25 seconds, and the mobile runtime grace is no more than 900 ms.

**Step 2: Run the typography and timing contract**

Run: `npm run test:designer-type-speed`

Expected: FAIL because the site still registers Bodoni Moda and uses the old timing values.

**Step 3: Write the failing raw-metal contract**

Assert that `Finish` includes `raw-metal`, only the primer shell owns it, the raw-metal body uses physical metalness of at least 0.7, roughness between 0.25 and 0.58, no clearcoat, and a shared roughness-detail map.

**Step 4: Run the raw-metal contract**

Run: `npm run test:raw-metal-finish`

Expected: FAIL because the primer shell still uses the generic matte path.

**Step 5: Commit**

Commit message: `test: define designer type and raw metal contracts`

### Task 2: Install the approved accent face

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Test: `scripts/designer-type-speed-contract.mjs`

**Step 1: Replace the font registration**

Import `Instrument_Serif`, configure `weight: "400"`, `style: "italic"`, `subsets: ["latin"]`, and expose it as `--font-instrument-serif`. Remove Bodoni Moda and its two-weight registration.

**Step 2: Retune the accent class**

Point `--font-serif` to the new variable and adjust only optical size, baseline, letter spacing, and inline padding. Keep all words and colours unchanged.

**Step 3: Run the contract and production build**

Run: `npm run test:designer-type-speed`

Run: `npm run build`

Expected: PASS; all routes compile and generate.

**Step 4: Commit**

Commit message: `style: introduce the Instrument Serif signature`

### Task 3: Build the dedicated raw-steel finish

**Files:**
- Modify: `components/shop/Loaders.tsx`
- Test: `scripts/raw-metal-finish-contract.mjs`

**Step 1: Add the finish classification**

Extend `Finish` with `raw-metal`, place only `M.primerShell` in its own set, and keep rusted/prewar vehicles in `matte`.

**Step 2: Add one shared micro-roughness texture**

Create a small deterministic `DataTexture` once at module scope. Use directional bands and low-amplitude seeded variation, linear colour space, repeat wrapping, anisotropy set by the renderer when available, and no network request.

**Step 3: Grade raw-metal body materials**

Preserve glass/rubber/chrome branches. For remaining raw-metal panels, construct a physical material with a cool steel base, metalness around 0.82, roughness around 0.38–0.48, clearcoat zero, the shared roughness map, and controlled environment intensity. Derive subtle stable variation from the material name/UUID.

**Step 4: Verify the contract and model pipeline**

Run: `npm run test:raw-metal-finish`

Run: `npm run test:model-pipeline`

Expected: PASS; no source model changes.

**Step 5: Commit**

Commit message: `feat: give the fab shell a raw steel finish`

### Task 4: Remove dead opening latency

**Files:**
- Modify: `components/home/Preloader.tsx`
- Modify: `components/home/HomeCinema.tsx`
- Test: `scripts/designer-type-speed-contract.mjs`
- Test: `scripts/preloader-automotive-contract.mjs`
- Test: `scripts/hero-runtime-contract.mjs`
- Test: `scripts/mobile-menu-contract.mjs`

**Step 1: Tighten the instrument plate**

Reduce the progressive ceiling to 750 ms, ignition to about 160 ms, and exit to about 280 ms. Keep the emergency escape, progress sweep, states, and all visual elements.

**Step 2: Start mobile WebGL sooner without stealing interactions**

Reduce the mobile grace to 850 ms and the idle timeout to 500 ms. Preserve cancellation whenever the mobile menu or another overlay is open.

**Step 3: Run focused contracts**

Run: `npm run test:designer-type-speed`

Run: `npm run test:preloader-automotive`

Run: `npm run test:hero-runtime`

Run: `npm run test:mobile-menu`

Expected: PASS.

**Step 4: Commit**

Commit message: `perf: turn opening hold time into useful startup`

### Task 5: Build and perform full local verification

**Files:**
- Verify only; do not stage generated screenshots or `output/`.

**Step 1: Run all test contracts**

Run every `test:*` script in `package.json` against the exact static export.

Expected: all pass.

**Step 2: Build and prepare the deployment artifact**

Run: `npm run build`

Run: `node scripts/prepare-deploy.js`

Run: `node scripts/flatten-rsc.mjs out`

Expected: 44 static pages; all model transport twins verified byte-identical.

**Step 3: Run visual and performance audits**

Run: `npm run audit:copy-layout`

Run: `npm run audit:garage-loader-social`

Run: `npm run audit:cwv-live`

Expected: green device matrix, zero browser errors, copy unchanged and fitting, CWV in good thresholds.

**Step 4: Inspect screenshots**

Inspect desktop and iPhone loader/headline frames plus desktop and iPhone Station 03 frames. Confirm the accent face reads elegantly and the shell reads as raw steel without chrome-like glare.

### Task 6: Push, deploy, and verify production

**Files:**
- Source repository: current branch on `kr8tiv-ai`
- Deployment repository: `C:\tmp\2240deploy\daylight`

**Step 1: Push the verified source commits**

Push `codex/3d-elevation-2026-08-24` to the `kr8tiv-ai` remote without force.

**Step 2: Deploy the exact export**

Run `scripts/deploy-combined.ps1` into the daylight deployment repository and push its `main` branch.

**Step 3: Wait for the new immutable bundle**

Poll the public HTML until it references the new content-addressed page chunk.

**Step 4: Re-run public audits**

Run public CWV, loader/garage/social, copy-layout, and blog-navigation audits.

Expected: all green with zero console errors.

**Step 5: Report commit IDs and metrics**

Provide the public URL, source commit, deploy commit, device results, loader/hero timings, CWV, and model byte-integrity result.

