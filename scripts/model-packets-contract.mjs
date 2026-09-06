import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const moduleUrl = new URL("../components/shop/modelPackets.ts", import.meta.url);
assert.ok(await access(moduleUrl).then(() => true, () => false), "Implement verified extraction of exact original GLBs from bounded packets");
const { decodeModelPacket } = await import(moduleUrl);
assert.equal(typeof decodeModelPacket, "function", "Packet decoder must be available before transport integration");
const names = ["prop-fire-extinguisher.glb", "prop-oil-drum.glb"];
const originals = await Promise.all(names.map(name => readFile(new URL(`../public/models-mobile/${name}`, import.meta.url))));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const concat = Buffer.concat(originals);
const payload = () => Uint8Array.from(concat).buffer;
let offset = 0;
const descriptor = {
  decodedLength: concat.length,
  entries: originals.map((bytes, index) => {
    const entry = { name: names[index], offset, length: bytes.length, sha256: hash(bytes) };
    offset += bytes.length;
    return entry;
  }),
};
let checks = 0;
const run = async (name, work) => { await work(); checks++; console.log(`PASS ${name}`); };
await run("extracts byte-identical GLBs without retaining or modifying the packet", async () => {
  const input = payload(), before = new Uint8Array(input).slice();
  const result = await decodeModelPacket(input, descriptor);
  assert.deepEqual([...result.keys()], names);
  for (const [index, name] of names.entries()) {
    assert.ok(result.get(name) instanceof ArrayBuffer);
    assert.notEqual(result.get(name), input);
    assert.deepEqual(Buffer.from(result.get(name)), originals[index]);
  }
  new Uint8Array(result.get(names[0]))[0] = 0;
  assert.deepEqual(new Uint8Array(input), before);
  assert.deepEqual(Buffer.from(result.get(names[1])), originals[1]);
});
const invalid = async (name, edit, bytes = payload()) => run(name, async () => {
  const changed = structuredClone(descriptor);
  edit(changed);
  await assert.rejects(decodeModelPacket(bytes, changed), /packet|GLB|hash|SHA|verification/i);
});
for (const value of [-1, 0.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER]) {
  await invalid(`rejects invalid offset ${value}`, d => { d.entries[0].offset = value; });
  await invalid(`rejects invalid length ${value}`, d => { d.entries[0].length = value; });
  await invalid(`rejects invalid total ${value}`, d => { d.decodedLength = value; });
}
await invalid("rejects duplicate names", d => { d.entries[1].name = d.entries[0].name; });
await invalid("rejects path-like names", d => { d.entries[0].name = "../car.glb"; });
await invalid("rejects overlapping segments", d => { d.entries[1].offset -= 4; });
await invalid("rejects gaps", d => { d.entries[1].offset += 4; });
await invalid("rejects wrong total length", d => { d.decodedLength += 4; });
await invalid("rejects a truncated payload", () => {}, payload().slice(0, -4));
await invalid("rejects an empty manifest", d => { d.entries = []; });
await invalid("rejects trailing unclaimed bytes", d => { d.entries.pop(); });
await invalid("rejects a malformed hash", d => { d.entries[0].sha256 = "not-a-hash"; });
await invalid("rejects excessive decoded allocation", d => { d.decodedLength = 1024 * 1024 + 4; });
for (const [field, value] of [[0, 0], [4, 1], [8, 12]]) {
  const bytes = payload();
  new DataView(bytes).setUint32(field, value, true);
  await invalid(`rejects GLB header field at ${field}`, () => {}, bytes);
}
const corrupt = payload();
new Uint8Array(corrupt)[Math.min(30, originals[0].length - 1)] ^= 1;
await invalid("rejects corrupted original bytes before returning any models", () => {}, corrupt);
await run("missing browser digest support rejects the packet safely", async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
  try { await assert.rejects(decodeModelPacket(payload(), descriptor), /verification.*unavailable/i); }
  finally { if (original) Object.defineProperty(globalThis, "crypto", original); else delete globalThis.crypto; }
});
console.log(`model packet decoder contract: PASS (${checks} checks)`);
