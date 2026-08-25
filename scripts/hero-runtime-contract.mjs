import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../components/home/HeroScene.tsx", import.meta.url), "utf8");

const contracts = [
  [
    "ghost submissions stop once their shader envelope is visually exhausted",
    /ghostRef\.current\.visible\s*=\s*primerActive\s*\|\|\s*\(reveal\s*>\s*0\.002\s*&&\s*reveal\s*<\s*0\.995\)/,
  ],
  [
    "particle submissions stop after every point has landed",
    /cloudRef\.current\.visible\s*=\s*primerActive\s*\|\|\s*\(reveal\s*>\s*0\.002\s*&&\s*reveal\s*<\s*0\.997\)/,
  ],
  [
    "scene priming explicitly overrides runtime visibility gates",
    /const SCENE_PRIMER = \{ active: false \}/,
  ],
  [
    "production diagnostics are opt-in through the tune query",
    /window\.location\.search\.includes\("tune"\)/,
  ],
  [
    "the diagnostic object is reused rather than allocated every frame",
    /diagnostics\.current\.camera\[0\]\s*=\s*camera\.position\.x/,
  ],
  [
    "the primer readiness gate admits the 18-primitive third hero",
    /return n >= 10/,
  ],
  [
    "the full composer stays parked behind the preloader until priming commits",
    /frameloop=\{active && primed \? "always" : "never"\}/,
  ],
];

for (const [label, pattern] of contracts) {
  assert.match(source, pattern, label);
}

assert.doesNotMatch(
  source,
  /useFrame\([\s\S]*?window\.__film\s*=\s*\{/,
  "useFrame must not allocate a fresh diagnostics object every rendered frame",
);
assert.doesNotMatch(
  source,
  /return n > 20/,
  "Act III has 18 primitives; a >20 gate burns the full 240-frame timeout on every load",
);

console.log("hero runtime contract: PASS");
