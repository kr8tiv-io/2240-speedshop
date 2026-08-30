# Designer Type, Raw Metal, and Perceived-Speed Design

## Objective

Make the opening experience feel materially faster, replace the tungsten accent words with a more elegant designer face, and make the Station 03 vehicle read as worked raw steel. Preserve every line of copy, model, texture source, animation, camera move, shader effect, and station.

## Guardrails

- Do not remove, decimate, simplify, or replace any 3D asset.
- Do not reduce renderer quality, lighting, post-processing, model visibility, or animation fidelity.
- Do not rewrite copy.
- Do not hide loading behind a longer loader.
- Preserve the existing static-to-live crossfade and the instant mobile-menu path.
- Keep the previous production state recoverable at `checkpoint/pre-performance-type-metal-2026-08-30`.

## Typography

Replace Bodoni Moda Italic with Instrument Serif Italic, using the single Latin 400 italic face supplied through `next/font/google`. The new face remains limited to `.accent-serif`; Anton, Archivo, and IBM Plex Mono remain unchanged.

Instrument Serif is a contemporary editorial face with a sharper calligraphic rhythm than Bodoni Moda. It provides the requested designer quality without requiring an unlicensed commercial font. Its single weight also removes the second Bodoni variant from the font payload.

The tungsten colour and all words remain unchanged. Optical sizing, baseline, line-height, and padding will be retuned so the accent remains integrated with Anton at every existing headline size.

## Station 03 raw-steel finish

The Camaro shell currently enters the generic `matte` vehicle path, where it receives low metalness, high roughness, muted colour, and almost no environment response. That accurately describes primer but cannot read as metal.

Add a dedicated `raw-metal` finish used only by `car-camaro-primer-shell.glb`. The source model, geometry, maps, transforms, shadows, camera choreography, and draw-call topology remain unchanged.

The finish will use:

- a cool neutral steel base;
- physically metallic response with moderate roughness;
- no automotive clearcoat;
- stronger but controlled environment response;
- a tiny shared procedural roughness texture for directional scuffing and panel breakup;
- deterministic panel variation derived from the existing source-material identity, avoiding animation shimmer and new network requests;
- the existing glass, rubber, and bright-trim classification before the raw-metal body treatment.

The result should read as unfinished worked steel under a fabrication lamp, not chrome, silver paint, or a uniformly grey shell.

## Perceived-speed architecture

Current measured public Core Web Vitals are already within the good range, but the opening feels slower because two deliberate waits are serialized before the animated hero begins:

1. the instrument plate may remain for 1.2 seconds, then spends 250 ms in ignition and 400 ms exiting;
2. mobile waits another 1.8 seconds before even scheduling the hero runtime.

Shorten only those non-productive waits. Preserve the plate choreography, still image, live-canvas crossfade, full model load, and shader verification.

- Lower the progressive plate ceiling to roughly 700–800 ms.
- Tighten ignition and exit motion while retaining their full visual sequence.
- Reduce the mobile grace period to roughly 750–900 ms.
- Keep runtime scheduling cancellable while navigation or another UI overlay is open.
- Continue using an idle callback with a bounded timeout so immediate taps win over WebGL startup.
- Leave model compression, geometry, renderer DPR, reflection resolution, shader definitions, and post-processing untouched.

This converts dead waiting into useful background startup instead of trading image quality for speed.

## Failure behavior

- The loader retains its emergency escape and CSS dead-man path.
- WebGL/reduced-motion fallbacks remain unchanged.
- If Instrument Serif cannot load, the existing Didot/Bodoni/Georgia serif stack remains available.
- If a material is not compatible with the raw-metal path, it remains on the current material path instead of failing the scene.

## Verification

- Add source contracts for the font family, single font variant, loader timing budget, mobile runtime grace, and raw-metal finish ownership.
- Build the complete static export and verify all 145 model transports remain byte-identical.
- Run the existing 18 regression contracts.
- Run the copy-layout audit to prove unchanged copy still fits with the new face.
- Run the garage/loader/social matrix on desktop, iPhone SE, iPhone 375, iPhone 390, iPhone 430, and iPad 768.
- Capture and inspect the opening loader, hero headline, Station 03 shell, and garage frames.
- Measure public LCP, INP, CLS, transfer, long tasks, loader exit, and hero readiness before declaring completion.

