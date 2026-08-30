import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [preloader, runtime, cinema, css] = await Promise.all([
  readFile(new URL("components/home/Preloader.tsx", root), "utf8"),
  readFile(new URL("components/home/HeroRuntime.tsx", root), "utf8"),
  readFile(new URL("components/home/HomeCinema.tsx", root), "utf8"),
  readFile(new URL("app/globals.css", root), "utf8"),
]);

assert.match(preloader, /PROGRESSIVE_CEILING_MS\s*=\s*1_200/);
assert.match(preloader, /MIN_BRAND_MS\s*=\s*500/);
assert.match(preloader, /data-loader-instrument/);
assert.match(
  preloader,
  /preloader-veil fixed inset-0 z-\[120\]/,
  "The opening plate must sit above navigation so the 2240 mark is not duplicated.",
);
assert.match(preloader, /OPENING THE SHOP/);
assert.match(preloader, /EDMONTON \/ AFTER HOURS/);
assert.doesNotMatch(
  preloader,
  /data-loader-car|loader-car-idle|<svg/,
  "The opening plate must not contain the illustrated car loader.",
);
assert.doesNotMatch(preloader, /14_000/, "A loader may not cover usable static content for 14 seconds.");
assert.doesNotMatch(preloader, /opacity-\[0\.06\]/, "The automotive mark must be readable immediately.");
assert.match(
  runtime,
  /sceneReady \? "opacity-100" : "opacity-0"/,
  "The opaque live canvas must crossfade only after its first verified frame.",
);
assert.match(cinema, /data-hero-still/);
assert.match(
  cinema,
  /motionEnabled\s*&&\s*runtimeProfile\s*&&\s*runtimeAllowed/,
  "The heavy hero runtime must not block the visible loader's exit choreography.",
);
assert.match(
  cinema,
  /if \(!ready \|\| runtimeAllowed \|\| uiOverlay !== null\) return/,
  "An early mobile-menu interaction must keep the heavy hero graph parked.",
);
assert.match(
  cinema,
  /runtimeProfile\?\.mobile\) graceTimer = window\.setTimeout\(scheduleRuntime, 1_800\)/,
  "Phones need a post-loader interaction window before model parsing and shader compilation.",
);
assert.match(css, /@keyframes loader-instrument-sweep/);
assert.match(css, /\.loader-instrument__rule/);
assert.doesNotMatch(
  css,
  /loader-car-|loader-wheel|loader-turntable/,
  "The instrument plate must not retain illustrated-car styling.",
);
assert.match(
  css,
  /preloader-failsafe 0\.4s ease 1\.8s forwards/,
  "The no-hydration CSS path must uncover the static hero within 2.2 seconds.",
);
assert.match(
  css,
  /@media \(max-width: 767px\)[\s\S]*animation-delay: 3\.6s/,
  "A throttled phone may retain the useful loader through hydration, but never beyond four seconds.",
);

console.log("instrument preloader contract: PASS");
