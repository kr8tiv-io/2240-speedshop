import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [capability, home, walkthrough] = await Promise.all([
  readFile(new URL("lib/webgl-capability.ts", root), "utf8"),
  readFile(new URL("components/home/HomeCinema.tsx", root), "utf8"),
  readFile(new URL("components/shop/WalkthroughWorld.tsx", root), "utf8"),
]);

assert.match(
  capability,
  /getContext\("webgl2"/,
  "The shared capability gate must require WebGL2 for Three r185.",
);
assert.match(
  capability,
  /getExtension\("WEBGL_lose_context"\)\?\.loseContext\(\)/,
  "The disposable probe must explicitly release its WebGL context.",
);
assert.match(
  capability,
  /cachedWebGL2Support/,
  "Repeated media-query decisions must reuse one capability result.",
);
assert.match(home, /import \{ supportsWebGL2 \} from "@\/lib\/webgl-capability"/);
assert.match(walkthrough, /import \{ supportsWebGL2 \} from "@\/lib\/webgl-capability"/);
assert.doesNotMatch(home, /document\.createElement\("canvas"\)/);
assert.doesNotMatch(walkthrough, /document\.createElement\("canvas"\)/);

console.log("webgl capability contract: PASS");
