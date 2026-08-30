import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

async function mustExist(path) {
  await assert.doesNotReject(
    access(new URL(path, root)),
    `${path} must be generated and committed`,
  );
}

await Promise.all([
  mustExist("scripts/build-hero-stills.mjs"),
  mustExist("public/shop/hero-still-desktop.jpg"),
  mustExist("public/shop/hero-still-mobile.jpg"),
  mustExist("components/IntentLink.tsx"),
  mustExist("scripts/purge-hostinger-cache.mjs"),
]);

const [cinema, intentLink, nav, hero, cropScript, purgeScript, deployScript] =
  await Promise.all([
    source("components/home/HomeCinema.tsx"),
    source("components/IntentLink.tsx"),
    source("components/Nav.tsx"),
    source("components/home/HeroScene.tsx"),
    source("scripts/build-hero-stills.mjs"),
    source("scripts/purge-hostinger-cache.mjs"),
    source("scripts/deploy-combined.ps1"),
  ]);

const [desktopStill, mobileStill] = await Promise.all([
  sharp(new URL("public/shop/hero-still-desktop.jpg", root)).metadata(),
  sharp(new URL("public/shop/hero-still-mobile.jpg", root)).metadata(),
]);
assert.deepEqual(
  [desktopStill.width, desktopStill.height],
  [1920, 1216],
  "desktop still must losslessly enclose the exact visible source crop",
);
assert.deepEqual(
  [mobileStill.width, mobileStill.height],
  [1184, 2560],
  "mobile still must preserve the exact visible source crop",
);
assert.match(cropScript, /jpegtran/i);
assert.match(cropScript, /1920x1216\+0\+672/);
assert.match(cropScript, /1184x2560\+368\+0/);
assert.match(cropScript, /-perfect/);

assert.match(cinema, /<picture/);
assert.match(cinema, /hero-still-mobile\.jpg/);
assert.match(cinema, /hero-still-desktop\.jpg/);
assert.match(cinema, /fetchPriority="high"/);

assert.match(intentLink, /prefetch=\{false\}/);
assert.match(intentLink, /router\.prefetch\(href/);
assert.match(intentLink, /onPointerEnter/);
assert.match(intentLink, /onFocus/);
assert.match(intentLink, /onTouchStart/);
assert.match(nav, /IntentLink/);
assert.match(cinema, /IntentLink/);

assert.match(hero, /name=\{`hero-act-\$\{index\}`\}/);
assert.match(hero, /yieldForHeroWarmup/);
assert.match(hero, /for \(const actRoot of actRoots\)/);
assert.match(hero, /gl\.compileAsync\(actRoot, camera, scene\)/);
assert.match(hero, /composer\.current\.render\(0\)/);
assert.match(hero, /gl\.setRenderTarget\(warmTarget\)/);

assert.match(purgeScript, /HOSTINGER_API_TOKEN/);
assert.match(purgeScript, /HOSTINGER_USERNAME/);
assert.match(purgeScript, /HOSTINGER_DOMAIN/);
assert.match(purgeScript, /method:\s*"DELETE"/);
assert.match(purgeScript, /Authorization:\s*`Bearer \$\{token\}`/);
assert.doesNotMatch(purgeScript, /console\.(?:log|error)\([^\n]*token/);
assert.match(deployScript, /purge-hostinger-cache\.mjs/);

console.log("lossless cinema priority contract: PASS");
