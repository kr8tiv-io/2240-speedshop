import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [loaders, walkthrough] = await Promise.all([
  readFile(new URL("components/shop/Loaders.tsx", root), "utf8"),
  readFile(new URL("components/shop/WalkthroughWorld.tsx", root), "utf8"),
]);

assert.match(
  loaders,
  /const REVEAL_WARM_KEYS = \["shell", "0"\]/,
  "The doorway may wait for the verified shell and first subject, not the unrelated second bay.",
);

const warmScene = loaders.slice(loaders.indexOf("export function WarmScene"));
assert.match(
  warmScene,
  /markShellWarm\(\)[\s\S]{0,240}reportWarm\("shell"\)/,
  "WarmScene must publish a verified shell before reporting the reveal key.",
);
assert.match(
  loaders,
  /finalizedWorld === worldFinalizer[\s\S]{0,180}REVEAL_PENDING\.size === 0[\s\S]{0,180}markWorldReady\(\)/,
  "The final doorway dissolve must require both a proved composer and the opening subject.",
);
assert.match(
  walkthrough,
  /const preloadShopWorld = \(\)/,
  "The split garage runtime needs a cached proximity preload.",
);
assert.match(
  walkthrough,
  /void preloadShopWorld\(\)/,
  "Entering the warm corridor must start the split runtime download immediately.",
);
assert.match(
  walkthrough,
  /data-shop-stage=\{worldReady \? "world" : worldWarm \? "shell" : "poster"\}/,
  "Production diagnostics must expose poster, verified-shell, and full-world stages.",
);

console.log("garage progressive reveal contract: PASS");
