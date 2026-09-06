import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { brotliCompressSync, brotliDecompressSync, constants } from "node:zlib";
import assert from "node:assert/strict";
import ts from "typescript";
import modelVersion from "./model-version.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const MAX_WIRE_BYTES = 128 * 1024;
const MAX_DECODED_BYTES = 1024 * 1024;
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

/** The application is the only route catalog; no second filename list. */
export async function readModelCatalog() {
  const source = await fs.readFile(path.join(root, "components/shop/Loaders.tsx"), "utf8");
  const ast = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const needed = new Set(["M", "OPENING_MODELS", "ROUTE_MODEL_GROUPS", "ROUTE_PREFETCH_MODELS"]);
  const declarations = [];
  ts.forEachChild(ast, node => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (needed.delete(declaration.name.getText(ast))) declarations.push(`const ${declaration.getText(ast)};`);
    }
  });
  assert.equal(needed.size, 0, "Missing source model catalog declarations");
  const code = ts.transpileModule(`const BASE = ""; ${declarations.join("\n")} module.exports = { names: ROUTE_PREFETCH_MODELS, openingCount: OPENING_MODELS.length, library: Object.values(M) };`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const context = { module: { exports: {} } };
  vm.runInNewContext(code, context, { timeout: 1000 });
  const { names, openingCount, library } = context.module.exports;
  assert.deepEqual(new Set(Array.from(names)), new Set(Array.from(library)), "Route must cover the exact source library");
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.every(name => /^[a-z0-9][a-z0-9._-]*\.glb$/.test(name)));
  return { names: Array.from(names), openingCount };
}

/** Group transport only. Original files and their first-use order survive. */
export function buildPacketShelf(models, { openingCount }) {
  const route = [], files = new Map();
  let group = [], decodedLength = 0, wireLength = 0;
  const individual = model => route.push({ individual: model.name });
  const flush = () => {
    if (!group.length) return;
    if (group.length === 1) individual(group[0]);
    else {
      const bytes = Buffer.concat(group.map(model => model.bytes));
      const wire = brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: bytes.length } });
      if (wire.length > wireLength) group.forEach(individual);
      else {
        assert.deepEqual(brotliDecompressSync(wire), bytes);
        let offset = 0;
        const entries = group.map(model => {
          const entry = { name: model.name, offset, length: model.bytes.length, sha256: hash(model.bytes) };
          assert.equal(hash(bytes.subarray(offset, offset + entry.length)), entry.sha256);
          offset += entry.length;
          return entry;
        });
        const file = `${hash(wire)}.bin.br`;
        files.set(file, wire);
        route.push({ file, encodedLength: wire.length, decodedLength: bytes.length, entries });
      }
    }
    group = []; decodedLength = 0; wireLength = 0;
  };
  for (const [index, model] of models.entries()) {
    if (index === openingCount) flush();
    if (index < 3 || model.bytes.length > MAX_DECODED_BYTES || model.compressed.length > MAX_WIRE_BYTES) {
      flush(); individual(model); continue;
    }
    if (decodedLength + model.bytes.length > MAX_DECODED_BYTES || wireLength + model.compressed.length > MAX_WIRE_BYTES) flush();
    group.push(model); decodedLength += model.bytes.length; wireLength += model.compressed.length;
  }
  flush();
  return { route, files };
}

export async function buildModelPackets() {
  const catalog = await readModelCatalog();
  const manifest = { format: 1, modelsVersion: modelVersion(), shelves: {} };
  const files = new Map();
  for (const [tier, shelf] of [["full", "models-opt"], ["lite", "models-mobile"]]) {
    const models = await Promise.all(catalog.names.map(async name => {
      const filename = path.join(root, "public", shelf, name);
      const [bytes, compressed] = await Promise.all([fs.readFile(filename), fs.readFile(`${filename}.br`)]);
      assert.deepEqual(brotliDecompressSync(compressed), bytes, `Stale original Brotli twin: ${filename}`);
      return { name, bytes, compressed };
    }));
    const built = buildPacketShelf(models, catalog);
    manifest.shelves[tier] = built.route;
    for (const [file, bytes] of built.files) files.set(file, bytes);
  }
  return { manifest, files };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { manifest, files } = await buildModelPackets();
  const destination = path.join(root, "public/model-packets");
  await fs.mkdir(destination, { recursive: true });
  for (const [file, bytes] of files) {
    const target = path.join(destination, file);
    try { await fs.writeFile(target, bytes, { flag: "wx" }); }
    catch (error) {
      if (error.code !== "EEXIST") throw error;
      assert.deepEqual(await fs.readFile(target), bytes, `Existing hash-addressed packet changed: ${file}`);
    }
  }
  await fs.writeFile(path.join(root, "components/shop/modelPackets.generated.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ modelVersion: manifest.modelsVersion, packetAssets: files.size, packetBytes: [...files.values()].reduce((sum, bytes) => sum + bytes.length, 0), routes: Object.fromEntries(Object.entries(manifest.shelves).map(([tier, route]) => [tier, { models: route.reduce((sum, entry) => sum + (entry.individual ? 1 : entry.entries.length), 0), requests: route.length }])) }));
}
