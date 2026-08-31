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
