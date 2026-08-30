import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../components/shop/Loaders.tsx", import.meta.url),
  "utf8",
);

assert.match(source, /type Finish = [^;]*"raw-metal"/);
assert.match(
  source,
  /const RAW_METAL[^=]*= new Set[^\[]*\[\s*M\.primerShell,?\s*\]/,
  "Only the Station 03 primer shell should receive the raw-steel treatment.",
);
assert.match(source, /if \(RAW_METAL\.has\(url\)\) return "raw-metal"/);
assert.match(source, /const rawMetal = finish === "raw-metal"/);
assert.match(source, /RAW_STEEL_ROUGHNESS/);
assert.match(source, /metalness:\s*chromeish \? 1 : rawMetal \? 0\.(?:[7-9]\d*)/);
assert.match(source, /roughness:\s*chromeish \? 0\.09 : rawMetal \? 0\.(?:[2-5]\d*)/);
assert.match(source, /clearcoat:\s*chromeish \? 0 : rawMetal \? 0/);
assert.match(source, /roughnessMap:\s*rawMetal \? RAW_STEEL_ROUGHNESS/);
assert.match(source, /envMapIntensity:\s*chromeish \? 1\.35 : rawMetal \? 1\.(?:[1-5]\d*)/);

console.log("raw metal finish contract: PASS");

