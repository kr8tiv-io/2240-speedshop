import assert from "node:assert/strict";
import * as requests from "../components/shop/modelRequest.ts";

const pool = requests.createRequestPool(2);
assert.equal(typeof pool.setLimit, "function", "Resize one existing pool without replacing its promises or queue");
const starts = [], controls = new Map();
const buffers = Array.from({ length: 10 }, (_, index) => Uint8Array.of(index, 27).buffer);
const tick = () => new Promise(resolve => setImmediate(resolve));
let active = 0;
const pending = buffers.map((bytes, index) => pool.run(() => new Promise((resolve, reject) => {
  starts.push(index); active++;
  controls.set(index, failed => {
    active--;
    if (failed) reject(new Error("transient edge"));
    else resolve(bytes);
  });
})));
const settled = Promise.allSettled(pending);
const finish = async (index, failed = false) => {
  const callback = controls.get(index); assert.ok(callback); controls.delete(index);
  callback(failed); await tick();
};
assert.deepEqual(starts, [0, 1]);
pool.setLimit(4);
assert.deepEqual(starts, [0, 1, 2, 3], "Expansion immediately fills only the added slots");
pool.setLimit(2);
assert.equal(active, 4, "Narrowing must not abort or replace in-flight buffers");
assert.equal(pool.demand(pending[9]), true, "Demand promotion retains the original queued promise");
await finish(0); assert.equal(starts.length, 4, "Three in flight cannot admit more after narrowing");
await finish(1, true); assert.equal(starts.length, 4, "Two in flight still exhaust the narrower window");
await finish(2); assert.equal(active, 2); assert.equal(starts.at(-1), 9);
for (const invalid of [0, -1, 1.5, NaN, Infinity]) assert.throws(() => pool.setLimit(invalid), RangeError);
await finish(3); assert.equal(active, 2); assert.equal(starts.at(-1), 4, "Invalid limits do not change the valid window");
pool.setLimit(2); assert.equal(active, 2, "A repeated profile cannot create additional requests");
while (controls.size) { await finish(controls.keys().next().value); assert.ok(active <= 2); }
const results = await settled;
assert.equal(new Set(starts).size, 10, "Every original job ran once, despite reconfiguration");
for (const [index, result] of results.entries()) {
  if (index === 1) assert.equal(result.status, "rejected");
  else { assert.equal(result.status, "fulfilled"); assert.equal(result.value, buffers[index]); }
}
assert.equal(active, 0);
// Reconfiguration must not erase prefetch expiry or a demanded job's immunity.
const timers = new Map(); let timerId = 0;
const clock = { set(callback) { timers.set(++timerId, callback); return timerId; }, clear(id) { timers.delete(id); } };
const expiringPool = requests.createRequestPool(4, clock);
const expiryStarts = [], expiryControls = new Map();
const expiring = Array.from({ length: 6 }, (_, index) => expiringPool.run(() => new Promise(resolve => {
  expiryStarts.push(index); expiryControls.set(index, () => resolve(index));
}), { queueTimeoutMs: 10 }));
const expiryResults = Promise.allSettled(expiring);
assert.equal(timers.size, 2);
expiringPool.setLimit(2);
assert.equal(expiringPool.demand(expiring[5]), true);
assert.equal(timers.size, 1, "Promoted queued work retains its expiry exemption");
for (const [id, fire] of [...timers]) { timers.delete(id); fire(); }
assert.deepEqual(expiryStarts, [0, 1, 2, 3], "Queue expiry cannot oversubscribe a narrowed pool");
for (const index of [0, 1]) { expiryControls.get(index)(); await tick(); }
assert.equal(expiryStarts.length, 4);
expiryControls.get(2)(); await tick();
assert.deepEqual(expiryStarts, [0, 1, 2, 3, 5]);
expiryControls.get(3)(); expiryControls.get(5)();
const expiryOutcomes = await expiryResults;
assert.equal(expiryOutcomes[4].status, "rejected");
assert.equal(expiryOutcomes[4].reason.name, "ModelRequestQueueTimeoutError");
assert.equal(expiryOutcomes[5].status, "fulfilled");
assert.equal(expiryOutcomes[5].value, 5);
assert.equal(timers.size, 0);
console.log("transport expansion/narrowing, original promises, demand priority and failure recovery: PASS");
