import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { brotliCompressSync, brotliDecompressSync } from "node:zlib";
import { decodeModelPacket } from "../components/shop/modelPackets.ts";

const builderUrl = new URL("./build-model-packets.mjs", import.meta.url);
assert.ok(await access(builderUrl).then(() => true, () => false), "Build deterministic packets from the original route and both full-quality shelves");
const { readModelCatalog, buildPacketShelf, buildModelPackets } = await import(builderUrl);
const catalog = await readModelCatalog();
assert.equal(catalog.names.length, 71);
assert.equal(new Set(catalog.names).size, 71);
assert.equal(catalog.openingCount, 11);
assert.deepEqual(catalog.names.slice(0, 3), ["car-dodge-charger.glb", "car-camaro.glb", "truck-pickup-classic.glb"]);
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const first = await buildModelPackets(), second = await buildModelPackets();
assert.deepEqual(first.manifest, second.manifest, "Manifest must be deterministic");
assert.ok(first.manifest.modelsVersion);
assert.equal(first.manifest.format, 1);
assert.deepEqual([...first.files.keys()], [...second.files.keys()]);
for (const [name, bytes] of first.files) {
  assert.deepEqual(bytes, second.files.get(name));
  assert.equal(name, `${sha(bytes)}.bin.br`, "Wire-byte hash owns the immutable name");
}
for (const [tier, shelf] of [["full", "models-opt"], ["lite", "models-mobile"]]) {
  const route = first.manifest.shelves[tier];
  const names = route.flatMap(resource => resource.individual ? [resource.individual] : resource.entries.map(entry => entry.name));
  assert.deepEqual(names, catalog.names, "Keep every original model in original first-use order");
  assert.deepEqual(route.slice(0, 3), catalog.names.slice(0, 3).map(individual => ({ individual })));
  let index = 0, packetCount = 0;
  for (const resource of route) {
    if (resource.individual) { index++; continue; }
    assert.ok(resource.entries.length > 1);
    assert.ok(index >= 3);
    assert.ok(index >= catalog.openingCount || index + resource.entries.length <= catalog.openingCount, "Packets cannot cross the opening priority boundary");
    const wire = first.files.get(resource.file);
    assert.equal(wire.length, resource.encodedLength);
    const decoded = brotliDecompressSync(wire);
    assert.equal(decoded.length, resource.decodedLength);
    assert.ok(decoded.length <= 1024 * 1024);
    const models = await decodeModelPacket(Uint8Array.from(decoded).buffer, resource);
    let individualWire = 0;
    for (const entry of resource.entries) {
      const original = await readFile(new URL(`../public/${shelf}/${entry.name}`, import.meta.url));
      const compressed = await readFile(new URL(`../public/${shelf}/${entry.name}.br`, import.meta.url));
      individualWire += compressed.length;
      assert.deepEqual(Buffer.from(models.get(entry.name)), original);
    }
    assert.ok(individualWire <= 128 * 1024, "Group transfer budget must be bounded");
    assert.ok(wire.length <= individualWire, "Packet must not increase network bytes");
    index += resource.entries.length; packetCount++;
  }
  assert.ok(packetCount > 0 && route.length < 71);
  console.log(`PASS ${tier}: 71 original models, ${route.length} requests, ${packetCount} bounded packets`);
}
// Small valid GLB containers exercise size boundaries without altering any asset.
const synthetic = (name, size, compressedLength) => {
  const bytes = Buffer.alloc(size, 3);
  bytes.writeUInt32LE(0x46546c67, 0); bytes.writeUInt32LE(2, 4); bytes.writeUInt32LE(size, 8);
  return { name, bytes, compressed: compressedLength ? Buffer.alloc(compressedLength) : brotliCompressSync(bytes) };
};
const tiny = [0, 1, 2].map(i => synthetic(`vehicle-${i}.glb`, 40));
const items = [...tiny, synthetic("large-decoded.glb", 1024 * 1024 + 4), synthetic("large-wire.glb", 40, 128 * 1024 + 1), synthetic("pair-a.glb", 40), synthetic("pair-b.glb", 40)];
const boundary = buildPacketShelf(items, { openingCount: 3 });
assert.deepEqual(boundary.route.slice(0, 5), items.slice(0, 5).map(item => ({ individual: item.name })));
assert.equal(boundary.route[5].entries.length, 2);
const changed = items.map(item => ({ ...item, bytes: Buffer.from(item.bytes), compressed: Buffer.from(item.compressed) }));
changed[5].bytes[20] ^= 1;
changed[5].compressed = brotliCompressSync(changed[5].bytes);
assert.notEqual(buildPacketShelf(changed, { openingCount: 3 }).route[5].file, boundary.route[5].file);
const split = buildPacketShelf([...tiny, synthetic("one.glb", 700 * 1024), synthetic("two.glb", 700 * 1024)], { openingCount: 3 });
assert.ok(split.route.every(resource => resource.individual), "Decoded sum forces separate resources");
const wireSplit = buildPacketShelf([...tiny, synthetic("one.glb", 40, 90 * 1024), synthetic("two.glb", 40, 90 * 1024)], { openingCount: 3 });
assert.ok(wireSplit.route.every(resource => resource.individual), "Compressed sum forces separate resources");
console.log(`model packet build contract: PASS (${first.files.size} deterministic packet assets, exact originals, priority and size boundaries)`);
