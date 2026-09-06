import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { brotliDecompressSync } from "node:zlib";
import path from "node:path";
import vm from "node:vm";
import http from "node:http";
import ts from "typescript";

const deploy = await readFile("scripts/deploy-combined.ps1", "utf8");
assert.ok(deploy.includes("node scripts/build-model-packets.mjs"), "Generate packets before the production build");
assert.ok(deploy.indexOf("node scripts/precompress.js") < deploy.indexOf("node scripts/build-model-packets.mjs"));
assert.ok(deploy.indexOf("node scripts/build-model-packets.mjs") < deploy.indexOf("next build --webpack"));
assert.ok(deploy.includes('"packet generation failed"'), "A failed generation must block release");
assert.ok(deploy.includes('$criticalAssets += "model-packets/$($packet.file)"'), "Verify each current packet after publication");
const apache = await readFile("public/.htaccess", "utf8");
const packetRules = [...apache.matchAll(/<FilesMatch "([^\n]+)">([\s\S]*?)<\/FilesMatch>/g)].filter(match => match[1].includes("bin"));
assert.ok(packetRules.some(match => /ForceType application\/octet-stream/.test(match[2])), "Packet MIME must override GLB-specific .br default");
assert.ok(packetRules.some(match => /Header set Content-Encoding br/.test(match[2])), "Browser must decompress packet transport");
assert.ok(packetRules.some(match => /max-age=31536000, immutable/.test(match[2])), "Content-addressed packet caching");
const serverSource = await readFile("scripts/serve-export.mjs", "utf8");
assert.ok(serverSource.includes('[".bin", "application/octet-stream"]'), "Local static host explicitly supports packet MIME");

// Exercise the real release verifier against an actual Brotli HTTP response.
// A packet intentionally has no decoded .bin twin on disk.
const source = await readFile("scripts/published-release-check.mjs", "utf8");
const ast = ts.createSourceFile("check.mjs", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
let checkSource;
ts.forEachChild(ast, node => { if (ts.isFunctionDeclaration(node) && node.name.text === "checkFile") checkSource = node.getText(ast); });
assert.ok(checkSource);
const manifest = JSON.parse(await readFile("components/shop/modelPackets.generated.json", "utf8"));
const packet = manifest.shelves.lite.find(item => item.file);
const relative = `model-packets/${packet.file}`;
const wire = await readFile(`public/${relative}`);
let encoding = true, cache = true, type = "application/octet-stream";
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": type, ...(encoding ? { "Content-Encoding": "br" } : {}), ...(cache ? { "Cache-Control": "public, max-age=31536000, immutable" } : {}) });
  res.end(wire);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const hash = data => createHash("sha256").update(data).digest("hex");
const context = vm.createContext({ assert, readFile, path, hash, brotliDecompressSync, root: path.resolve("public"), base: `http://127.0.0.1:${server.address().port}`, get: async url => { const response = await fetch(url); return { response, bytes: Buffer.from(await response.arrayBuffer()) }; } });
vm.runInContext(`${checkSource}\nglobalThis.check = checkFile;`, context);
try {
  const report = [];
  await context.check(relative, report);
  assert.equal(report[0].bytes, packet.decodedLength);
  assert.equal(report[0].sha256, hash(brotliDecompressSync(wire)));
  encoding = false;
  await assert.rejects(context.check(relative, []), /encoding/i);
  encoding = true; cache = false;
  await assert.rejects(context.check(relative, []), /cache/i);
  cache = true; type = "model/gltf-binary";
  await assert.rejects(context.check(relative, []), /MIME/i);
} finally { await new Promise(resolve => server.close(resolve)); }
console.log("model packet deployment contract: PASS (build order, explicit hosting, exact decompression and three bad-header rejections)");
