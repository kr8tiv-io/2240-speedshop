import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pipeline = await readFile(
  new URL("./compress-models.js", import.meta.url),
  "utf8",
);

assert.match(
  pipeline,
  /flatten,[\s\S]*join,[\s\S]*meshopt/,
  "The model pipeline must include the lossless flatten/join transforms before meshopt.",
);
assert.match(
  pipeline,
  /const JOIN_EXCLUDED = new Set\(\[[\s\S]*car-camaro\.glb[\s\S]*prop-droplight-pendant\.glb[\s\S]*car-prewar-hotrod-donor\.glb[\s\S]*prop-welding-cart\.glb[\s\S]*prop-wheel-rim-rusted-a\.glb[\s\S]*\]\)/,
  "Transparent and morph-target assets must remain outside the conservative join rollout.",
);

const cleanup = pipeline.indexOf("for (const mesh of document.getRoot().listMeshes())");
const flattenJoin = pipeline.indexOf("flatten(),", cleanup);
const texturePass = pipeline.indexOf("for (const texture of document.getRoot().listTextures())");
const meshoptPass = pipeline.indexOf("meshopt({ encoder: MeshoptEncoder", texturePass);

assert.ok(
  cleanup >= 0 && cleanup < flattenJoin && flattenJoin < texturePass && texturePass < meshoptPass,
  "Flatten/join must run after static attribute cleanup and before texture processing plus final meshopt.",
);
assert.match(
  pipeline,
  /listAnimations\(\)\.length === 0/,
  "Future animated assets must fail closed instead of entering the static join path.",
);
assert.match(
  pipeline,
  /if \(failures\.length\) \{[\s\S]*process\.exitCode = 1/,
  "A partial shelf conversion must fail the build instead of looking successful.",
);
assert.match(
  pipeline,
  /function assertLosslessJoin\(before, document, file\)[\s\S]*after\.triangleElements !== before\.triangleElements[\s\S]*after\.materials\.size !== before\.materials\.size/,
  "Every asset join must fail closed on triangle or authored-material changes.",
);

console.log("model pipeline contract: PASS");
