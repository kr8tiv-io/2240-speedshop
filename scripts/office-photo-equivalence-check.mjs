import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const [beforeReport, afterReport, beforeRoot, afterRoot = "out"] = process.argv.slice(2);
assert.ok(beforeReport && afterReport && beforeRoot, "Pass baseline report, candidate report and baseline export root");
const [before, after] = await Promise.all([beforeReport, afterReport].map(async file => JSON.parse(await readFile(file, "utf8"))));
assert.equal(after.status, "PASS");
assert.equal(before.officeTextures.length, 7);
assert.deepEqual(after.officeTextures, before.officeTextures, "Keep every original image dimension, filtering/mipmap and colour-space setting");
const images = [];
for (const texture of before.officeTextures) {
  const relative = texture.path.replace(/^\//, "");
  const [oldBytes, newBytes] = await Promise.all([beforeRoot, afterRoot].map(root => readFile(path.join(root, relative))));
  assert.ok(oldBytes.equals(newBytes), `Original image bytes unchanged: ${relative}`);
  const requests = after.officeResources.filter(r => new URL(r.name).pathname === texture.path);
  assert.equal(requests.length, 1, `Exactly one completed transfer: ${relative}`);
  assert.equal(requests[0].encodedBodySize, newBytes.length, `Transfer preserves the full image: ${relative}`);
  images.push({ path: relative, bytes: newBytes.length, sha256: createHash("sha256").update(newBytes).digest("hex"), dimensions: [texture.width, texture.height] });
}
console.log(JSON.stringify({ status: "PASS", images, totalOriginalBytes: images.reduce((sum, image) => sum + image.bytes, 0) }, null, 2));
