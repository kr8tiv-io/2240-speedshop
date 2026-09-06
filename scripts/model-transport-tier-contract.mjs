import assert from "node:assert/strict";
import fs from "node:fs/promises";
import * as requests from "../components/shop/modelRequest.ts";

assert.equal(typeof requests.getModelTransportConcurrency, "function", "Choose transport admission from the already-selected world tier");
const select = requests.getModelTransportConcurrency;
const healthy = { effectiveType: "4g", downlink: 8.4, rtt: 200, saveData: false };
assert.equal(select(true, healthy), 4, "Only a healthy lite world gets the measured wider transport window");
assert.equal(select(false, healthy), 2, "Desktop/full rendering keeps its measured two-slot behavior");
for (const hint of [undefined, null, {}, false, "4g",
  { effectiveType: "slow-2g" }, { effectiveType: "2g" }, { effectiveType: "3g", downlink: 1.5, rtt: 600 },
  ...[{ saveData: true }, { saveData: undefined }, { downlink: 0.4 }, { downlink: NaN }, { downlink: Infinity },
    { rtt: 301 }, { rtt: -1 }, { rtt: NaN }, { rtt: undefined }].map(overrides => ({ ...healthy, ...overrides })),
]) {
  assert.equal(select(true, hint), 2, `Unknown/weak hints are conservative: ${JSON.stringify(hint)}`);
  assert.equal(select(false, hint), 2, "No connection hint changes the full-tier window");
}
assert.equal(select(true, { ...healthy, downlink: 1.5, rtt: 300 }), 4);
assert.equal(select(true, { ...healthy, rtt: 0 }), 4);
const source = await fs.readFile("components/shop/Loaders.tsx", "utf8");
assert.match(source, /export function preloadOpeningModels\(lite: boolean\) \{[\s\S]{0,220}modelTransport\.setLimit\(getModelTransportConcurrency\(lite, connection\)\)/,
  "The existing immutable world tier, not a guessed viewport or network tier, owns admission");
assert.equal([...source.matchAll(/createRequestPool\(/g)].length, 1, "Tier changes never allocate a replacement pool");
console.log("tier-aware HTTP admission without changing rendering tier or asset quality: PASS");
