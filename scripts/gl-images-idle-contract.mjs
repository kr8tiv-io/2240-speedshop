import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const runtime = await readFile(
  new URL("../components/gl/GLImagesRuntime.tsx", import.meta.url),
  "utf8",
);

assert.ok(
  /frameloop=\{active \? "demand" : "never"\}/.test(runtime),
  "The shared image-effects canvas must stop drawing once its visuals settle.",
);
assert.ok(
  /const invalidate = useThree\(\(s\) => s\.invalidate\)/.test(runtime) &&
    /window\.addEventListener\("scroll", wake/.test(runtime) &&
    /window\.addEventListener\("pointermove", onMove/.test(runtime),
  "Scroll and pointer input must explicitly wake the demand-rendered image canvas.",
);
assert.ok(
  /onUpdate: invalidate/.test(runtime),
  "GSAP-driven shader reveals must request every frame they visually change.",
);
assert.ok(
  /scene\.remove\(flowMesh\)/.test(runtime) &&
    /flowGeometry\.dispose\(\)/.test(runtime) &&
    /material\.dispose\(\)/.test(runtime),
  "Flowmap-owned GPU resources must be released on a route remount.",
);

console.log("GL image idle contract: PASS");
