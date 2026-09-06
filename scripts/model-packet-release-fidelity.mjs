import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { brotliDecompressSync } from "node:zlib";
import { decodeModelPacket } from "../components/shop/modelPackets.ts";

const baseline = path.resolve("output/baseline-acce"), candidate = path.resolve("out");
const walk = async dir => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map(async entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat();
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const originals = (await walk(baseline)).filter(file => /^(?:models\/hero-|models-(?:opt|mobile)-|shop\/|fonts\/|social\/)/.test(path.relative(baseline, file).replaceAll("\\", "/")));
assert.equal(originals.length, 410, "Complete original deployment media inventory");
let originalBytes = 0;
for (const file of originals) {
  const relative = path.relative(baseline, file), bytes = await fs.readFile(file);
  assert.equal(hash(await fs.readFile(path.join(candidate, relative))), hash(bytes), `Original media changed: ${relative}`);
  originalBytes += bytes.length;
}
const manifest = JSON.parse(await fs.readFile("components/shop/modelPackets.generated.json", "utf8"));
const packets = new Set();
let extractedModels = 0;
for (const [tier, shelf] of [["full", "models-opt"], ["lite", "models-mobile"]]) {
  for (const item of manifest.shelves[tier]) {
    if (!item.file) continue;
    const wire = await fs.readFile(path.join(candidate, "model-packets", item.file));
    assert.equal(hash(wire) + ".bin.br", item.file, "Immutable filename is the full wire hash");
    const decoded = brotliDecompressSync(wire);
    const models = await decodeModelPacket(decoded.buffer.slice(decoded.byteOffset, decoded.byteOffset + decoded.byteLength), item);
    for (const [name, bytes] of models) {
      assert.equal(hash(Buffer.from(bytes)), hash(await fs.readFile(path.join(candidate, `${shelf}-${manifest.modelsVersion}`, name))), `Exact exported model ${tier}/${name}`);
      extractedModels++;
    }
    packets.add(item.file);
  }
}
const report = { status: "PASS", checkedAt: new Date().toISOString(), baseline: (await fs.readFile(path.join(baseline, ".well-known/2240-release.txt"), "utf8")).trim(), candidate: (await fs.readFile(path.join(candidate, ".well-known/2240-release.txt"), "utf8")).trim(), originalMediaFiles: originals.length, originalMediaBytes: originalBytes, verifiedPacketFiles: packets.size, extractedModels };
await fs.writeFile("output/model-packet-release-fidelity.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
