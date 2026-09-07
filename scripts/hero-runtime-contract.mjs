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
    "the primer readiness gate uses stable named act roots",
    /scene\.getObjectByName\(`hero-act-\$\{index\}`\)/,
  ],
  [
    "the full composer stays parked behind the preloader until priming commits",
    /frameloop=\{active && primed \? "always" : "never"\}/,
  ],
  [
    "hero canvas ignores scroll remesure so iOS chrome cannot resize the buffer",
    /resize=\{STABLE_CANVAS_RESIZE\}/,
  ],
  [
    "hero canvas sizes itself with svh/lvh instead of stretching to a jumping parent",
    /style=\{STABLE_CANVAS_FRAME_STYLE\}/,
  ],
  [
    "hero canvas is top-locked, not inset-0, so bottom:0 cannot re-derive height",
    /className="!absolute !inset-x-0 !top-0"/,
  ],
  [
    "hero rig does not apply pointer parallax on phones",
    /if \(!mobile\) \{\s*desired\.x \+= pointer\.x \* 0\.18;/,
  ],
  [
    "hero fit uses a chrome-locked aspect on phones",
    /aspectIgnoringChrome\(camera, gl\.domElement\.clientWidth, chromeAspect\.current\)/,
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
assert.match(
  source,
  /for \(const actRoot of actRoots\)/,
  "hero acts must warm in discrete passes",
);

console.log("hero runtime contract: PASS");
