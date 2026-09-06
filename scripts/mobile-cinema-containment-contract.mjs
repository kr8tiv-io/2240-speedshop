import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

assert.match(
  css,
  /html\s*\{[^}]*overscroll-behavior-x:\s*none/s,
  "The root must absorb sideways rubber-band travel on mobile browsers.",
);
assert.match(
  css,
  /\[data-film-runway\][^{]*#walkthrough-runway\s*\{[^}]*overflow-x:\s*clip[^}]*touch-action:\s*pan-y\s+pinch-zoom/s,
  "Film and garage runways must clip wide paint and accept only vertical one-finger travel.",
);
assert.match(
  css,
  /\[data-film-canvas\][^{]*\[data-shop-ready\]\s*\{[^}]*overflow:\s*clip/s,
  "Fixed WebGL hosts must not contribute visual overflow beyond the viewport.",
);

const stableHeroViewport = css.match(
  /@media\s*\(max-width:\s*767px\),\s*\(hover:\s*none\)\s+and\s+\(pointer:\s*coarse\)\s*\{\s*\[data-film-canvas\]\s*\{([^}]+)\}/,
)?.[1] ?? "";
assert.match(
  stableHeroViewport,
  /height:\s*100vh\s*;\s*height:\s*100lvh\s*;/,
  "Phone and touch-tablet hero canvases need a stable large-viewport height, with a legacy fallback, so browser toolbars cannot resize the camera projection.",
);
assert.match(
  stableHeroViewport,
  /bottom:\s*auto\s*;/,
  "The stable hero height must replace the dynamic bottom inset, retaining full-bleed coverage when browser controls collapse.",
);
assert.doesNotMatch(
  stableHeroViewport,
  /(?:height|block-size):\s*(?:100[sd]vh|\d+px)/,
  "Do not trade toolbar stability for a small-viewport gap, dynamic resizing, or a fixed pixel height that breaks rotation.",
);

const phonePlate = css.match(/@media \(max-width: 639px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
assert.match(phonePlate, /\.copy-plate::before\s*\{/);
assert.match(
  phonePlate,
  /\.copy-plate::before\s*\{[\s\S]*background:\s*linear-gradient\(\s*to bottom/s,
  "The existing top and bottom feather must remain intact.",
);
assert.match(
  phonePlate,
  /-webkit-mask-image:\s*linear-gradient\(\s*to right/s,
  "The phone copy plate must feather horizontally in Safari.",
);
assert.doesNotMatch(
  phonePlate,
  /mask-composite:/,
  "A single side mask avoids older iOS multi-mask compositor regressions.",
);

console.log("mobile cinema containment contract: PASS");
