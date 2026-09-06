import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequestPool, loadModelRequestAttempt } from "../components/shop/modelRequest.ts";
const module = await import("../components/shop/modelPackets.ts");
assert.equal(typeof module.createModelPacketStore, "function", "Share packet transport, demand priority, fallback and byte ownership through the real request pool");
const { createModelPacketStore } = module;
const names = ["prop-oil-drum.glb", "prop-fire-extinguisher.glb"];
const originals = await Promise.all(names.map(name => readFile(new URL(`../public/models-mobile/${name}`, import.meta.url))));
const wire = Buffer.concat(originals);
let offset = 0;
const descriptor = { url: "/model-packets/test.bin.br", modelBase: "/models-mobile-test/", decodedLength: wire.length, entries: originals.map((bytes, index) => {
  const entry = { name: names[index], offset, length: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") }; offset += bytes.length; return entry;
}) };
const urls = names.map(name => descriptor.modelBase + name);
const bytes = () => Uint8Array.from(wire).buffer;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const within = async promise => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Contract timed out (possible pool deadlock)")), 2000); })]); }
  finally { clearTimeout(timer); }
};
let checks = 0;
const test = async (name, work) => { await work(); checks++; console.log(`PASS ${name}`); };
function fixture({ packets = [descriptor], loadPacket = async () => bytes(), limit = 2 } = {}) {
  const pool = createRequestPool(limit), events = [], fallbackJobs = [];
  const store = createModelPacketStore({ packets, pool, loadPacket: async url => { events.push(`packet:${url}`); return loadPacket(url); },
    loadIndividual: (url, demanded) => {
      const job = pool.run(async () => { events.push(`individual:${url}`); return Uint8Array.from(originals[urls.indexOf(url)]).buffer; }, { demanded });
      fallbackJobs.push(job); return job;
    },
  });
  return { pool, store, events, fallbackJobs };
}
await test("shares in-flight and completed original model promises", async () => {
  const hold = deferred(), { store, events } = fixture({ loadPacket: () => hold.promise });
  const one = store.request(urls[0]), again = store.request(urls[0], true), two = store.request(urls[1]);
  assert.equal(one, again); assert.equal(events.length, 1);
  hold.resolve(bytes());
  const actual = await within(Promise.all([one, two]));
  actual.forEach((value, index) => assert.deepEqual(Buffer.from(value), originals[index]));
  assert.equal(store.request(urls[0]), one); assert.equal(events.length, 1);
});
await test("global two-slot pool includes ordinary individual transports", async () => {
  const holds = [deferred(), deferred()], { store, pool, events } = fixture();
  const busy = holds.map(hold => pool.run(() => hold.promise));
  const request = store.request(urls[0]);
  assert.equal(events.length, 0);
  holds[0].resolve(); await busy[0]; await within(request);
  assert.equal(events.length, 1);
  holds[1].resolve(); await busy[1];
});
await test("demand promotes the shared packet job ahead of speculative work", async () => {
  const hold = deferred(), { store, pool, events } = fixture({ limit: 1 });
  const active = pool.run(() => hold.promise);
  const speculative = pool.run(async () => { events.push("speculative"); });
  const request = store.request(urls[0]);
  assert.equal(store.demand(request), true);
  hold.resolve(); await active; await within(Promise.all([request, speculative]));
  assert.ok(events[0].startsWith("packet:"));
});
for (const failure of ["404", "abort", "timeout", "wrong-encoding", "truncated", "corrupt"]) {
  await test(`${failure} falls back through a single slot without deadlock`, async () => {
    const loadPacket = async () => {
      if (["404", "abort", "timeout"].includes(failure)) throw new Error(failure);
      if (failure === "wrong-encoding") return new Uint8Array([1, 2, 3, 4]).buffer;
      if (failure === "truncated") return bytes().slice(0, -4);
      const data = bytes(); new Uint8Array(data)[24] ^= 1; return data;
    };
    const { store, events } = fixture({ loadPacket, limit: 1 });
    const actual = await within(Promise.all(urls.map(url => store.request(url))));
    actual.forEach((value, index) => assert.deepEqual(Buffer.from(value), originals[index]));
    assert.equal(events.filter(event => event.startsWith("individual:")).length, 2);
  });
}
await test("missing manifest entry and missing digest support preserve individual path", async () => {
  const { store, events } = fixture();
  assert.equal(store.request("/models-mobile-test/unknown.glb"), undefined);
  const original = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
  try { assert.equal(store.request(urls[0]), undefined); }
  finally { Object.defineProperty(globalThis, "crypto", original); }
  assert.deepEqual(events, []);
});
await test("a genuinely stalled packet is aborted by the existing bounded request helper", async () => {
  let aborted = false;
  const { store, events } = fixture({ limit: 1, loadPacket: url => loadModelRequestAttempt({
    target: url, start: () => {}, abort: () => { aborted = true; }, idleTimeoutMs: 10, hardTimeoutMs: 20,
  }) });
  const data = await within(store.request(urls[0]));
  assert.equal(aborted, true);
  assert.deepEqual(Buffer.from(data), originals[0]);
  assert.equal(events.filter(event => event.startsWith("individual:")).length, 1);
});
await test("demand also promotes an individual fallback already queued behind speculation", async () => {
  const packet = deferred(), busy = deferred(), { store, pool, events } = fixture({ limit: 1, loadPacket: () => packet.promise });
  const request = store.request(urls[0]);
  const occupied = pool.run(() => busy.promise);
  const speculative = pool.run(async () => { events.push("late-speculative"); });
  packet.reject(new Error("temporary")); await tick();
  store.demand(request);
  busy.resolve(); await within(Promise.all([request, occupied, speculative]));
  assert.ok(events.indexOf(`individual:${urls[0]}`) < events.indexOf("late-speculative"));
});
await test("released models do not retain duplicate buffers or refetch unparsed siblings", async () => {
  const { store, events } = fixture();
  const one = store.request(urls[0]), two = store.request(urls[1]);
  await within(Promise.all([one, two]));
  store.release(urls[0], Promise.resolve()); // stale owner must do nothing
  assert.equal(store.request(urls[0]), one);
  store.release(urls[0], one); await tick();
  const retry = store.request(urls[0]);
  assert.notEqual(retry, one);
  assert.deepEqual(Buffer.from(await within(retry)), originals[0]);
  assert.equal(store.request(urls[1]), two);
  assert.equal(events.filter(event => event.startsWith("packet:")).length, 1);
  assert.equal(events.filter(event => event.startsWith("individual:")).length, 1);
  store.release(urls[0], retry); store.release(urls[1], two); await tick();
  await within(store.request(urls[0]));
  assert.equal(events.filter(event => event.startsWith("packet:")).length, 2);
});
await test("release during transport still settles old consumers and shares pending work", async () => {
  const hold = deferred(), { store, events } = fixture({ loadPacket: () => hold.promise });
  const one = store.request(urls[0]);
  store.release(urls[0], one);
  const two = store.request(urls[1]);
  hold.resolve(bytes());
  const actual = await within(Promise.all([one, two]));
  actual.forEach((value, index) => assert.deepEqual(Buffer.from(value), originals[index]));
  assert.equal(events.length, 1);
});
await test("transient packet failure is retryable after consumer release", async () => {
  let calls = 0;
  const { store, events } = fixture({ loadPacket: async () => { if (++calls === 1) throw new Error("temporary"); return bytes(); } });
  const one = store.request(urls[0]); await within(one); store.release(urls[0], one); await tick();
  const retry = store.request(urls[0]); await within(retry);
  assert.equal(calls, 2);
  assert.equal(events.filter(event => event.startsWith("individual:")).length, 1);
});
await test("failed individual fallback rejects without poisoning future consumers", async () => {
  const pool = createRequestPool(1);
  const store = createModelPacketStore({ packets: [descriptor], pool, loadPacket: async () => { throw new Error("packet-missing"); }, loadIndividual: () => pool.run(async () => { throw new Error("individual-missing"); }) });
  const one = store.request(urls[0]); await assert.rejects(within(one), /individual-missing/);
  store.release(urls[0], one); await tick();
  const retry = store.request(urls[0]); assert.notEqual(retry, one); await assert.rejects(within(retry), /individual-missing/);
});
console.log(`model packet store contract: PASS (${checks} checks)`);
