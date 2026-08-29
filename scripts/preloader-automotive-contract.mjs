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
assert.match(preloader, /data-loader-car/);
assert.match(preloader, />LOADING</);
assert.doesNotMatch(preloader, /14_000/, "A loader may not cover usable static content for 14 seconds.");
assert.doesNotMatch(preloader, /opacity-\[0\.06\]/, "The automotive mark must be readable immediately.");
assert.match(
  runtime,
  /sceneReady \? "opacity-100" : "opacity-0"/,
  "The opaque live canvas must crossfade only after its first verified frame.",
);
assert.match(cinema, /data-hero-still/);
assert.match(css, /@keyframes loader-turntable/);
assert.match(css, /@keyframes loader-car-idle/);

console.log("automotive preloader contract: PASS");
