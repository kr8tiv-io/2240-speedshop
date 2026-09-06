import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequestPool } from "../components/shop/modelRequest.ts";

const source = await fs.readFile("components/shop/Loaders.tsx", "utf8");
assert.match(source, /const PREFETCH_CONCURRENCY = 2;/,
  "The default window remains two; any expansion must pass the tier/network policy");

// Both pool sizes are behaviorally valid. That does NOT establish a speed
// benefit: the separate controlled comparison held four slots on desktop.
// The connection-aware candidate's source and regression test are archived
// under output/held-network-aware-*.bak for an explicitly scoped next trial.
for (const limit of [2, 4]) {
  const pool = createRequestPool(limit);
  const tick = () => new Promise(resolve => setImmediate(resolve));
  const starts = [], controls = new Map();
  const buffers = Array.from({ length: 8 }, (_, index) => Uint8Array.of(index, 7, 9).buffer);
  let active = 0, peak = 0;
  const jobs = buffers.map((buffer, index) => pool.run(() => new Promise((resolve, reject) => {
    starts.push(index);
    peak = Math.max(peak, ++active);
    controls.set(index, fail => { active--; if (fail) reject(new Error("one failed edge")); else resolve(buffer); });
  })));
  const results = Promise.allSettled(jobs);
  const finish = async (index, fail = false) => {
    const complete = controls.get(index);
    assert.ok(complete, `Job ${index} owns a live transport`);
    controls.delete(index); complete(fail); await tick();
  };
  await tick();
  assert.deepEqual(starts, Array.from({ length: limit }, (_, index) => index));
  assert.equal(pool.demand(jobs[7]), true, "Promote the same promise without another request");
  await finish(0);
  assert.equal(starts.at(-1), 7);
  await finish(1, true);
  assert.equal(starts.at(-1), limit, "A failed response releases its slot");
  while (controls.size) await finish(controls.keys().next().value);
  const settled = await results;
  assert.equal(peak, limit);
  assert.equal(active, 0);
  assert.equal(new Set(starts).size, 8, "One transport per original promise");
  for (const [index, outcome] of settled.entries()) {
    if (index === 1) assert.equal(outcome.status, "rejected");
    else { assert.equal(outcome.status, "fulfilled"); assert.equal(outcome.value, buffers[index], "Exact ArrayBuffer, no transforms"); }
  }
}
console.log("default two-slot application; two/four-slot pool demand, bounds and recovery: PASS");
