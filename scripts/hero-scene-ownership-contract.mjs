import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../components/home/HeroScene.tsx", import.meta.url), "utf8");

assert.match(source, /const \{ scene: sourceScene \} = useGLTF/, "cached GLTF source is not named explicitly");
assert.match(
  source,
  /useMemo\(\(\) => sourceScene\.clone\(true\), \[sourceScene\]\)/,
  "ActStage does not own a cloned scene graph",
);
assert.ok(
  !/fitStage\(sourceScene,/.test(source),
  "fit/material work still mutates the cached GLTF source",
);
assert.match(
  source,
  /for \(const material of built\.dissMats\) material\.dispose\(\)/,
  "owned replacement materials are not disposed on unmount",
);
assert.match(source, /<primitive object=\{scene\} \/>/, "render path does not use the owned scene clone");

console.log("hero scene ownership contract: PASS");
