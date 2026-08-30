import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loaders = await readFile(
  new URL("../components/shop/Loaders.tsx", import.meta.url),
  "utf8",
);

assert.ok(
  /const CULL_MOVE_EPSILON_SQUARED = 0\.000625/.test(loaders),
  "Cull scheduling needs a tiny, explicit camera-motion threshold.",
);
assert.ok(
  (loaders.match(/const lastCullEye = useRef\(new THREE\.Vector3\(Infinity, Infinity, Infinity\)\)/g) ?? [])
    .length >= 2,
  "Both shell and station cullers must retain the last camera position they evaluated.",
);
assert.ok(
  (loaders.match(/distanceToSquared\(lastCullEye\.current\) < CULL_MOVE_EPSILON_SQUARED/g) ?? [])
    .length >= 2,
  "A stationary camera must skip both full visibility scans.",
);
assert.ok(
  /isInstancedMesh[\s\S]{0,240}computeBoundingSphere\(\)[\s\S]{0,180}boundingSphere/.test(loaders),
  "Manual detail culling must include every instance transform in an InstancedMesh bound.",
);

console.log("detail cull motion contract: PASS");
