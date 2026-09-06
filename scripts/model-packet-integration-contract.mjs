import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import http from "node:http";
import vm from "node:vm";
import { brotliCompressSync, brotliDecompressSync } from "node:zlib";
import ts from "typescript";
import * as THREE from "three";
import { createRequestPool, loadModelRequestAttempt } from "../components/shop/modelRequest.ts";
import { createModelPacketStore } from "../components/shop/modelPackets.ts";

const source = await readFile(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8");
assert.ok(/function getModelPacketStore\(/.test(source), "Connect verified packets to the existing exact-byte loader");
const manifest = JSON.parse(await readFile(new URL("../components/shop/modelPackets.generated.json", import.meta.url), "utf8"));
const packet = manifest.shelves.lite.find(item => item.entries);
const names = packet.entries.map(entry => entry.name);
const packetWire = await readFile(new URL(`../public/model-packets/${packet.file}`, import.meta.url));
const originals = new Map(await Promise.all(names.map(async name => [name, await readFile(new URL(`../public/models-mobile/${name}`, import.meta.url))])));
let mode = "normal";
const requests = [];
const server = http.createServer(async (req, res) => {
  const originalPath = new URL(req.url, "http://localhost").pathname;
  const pathname = originalPath.replace(/^\/preview\//, "/");
  requests.push({ pathname: originalPath, header: req.headers["x-packet-test"] });
  if (pathname.startsWith("/model-packets/")) {
    if (mode === "404") { res.writeHead(404); res.end(); return; }
    let body = packetWire;
    if (mode === "corrupt") { const changed = brotliDecompressSync(packetWire); changed[24] ^= 1; body = brotliCompressSync(changed); }
    res.writeHead(200, { "Content-Type": "application/octet-stream", "Content-Encoding": "br", "Content-Length": body.length }); res.end(body); return;
  }
  const name = pathname.split("/").at(-1).replace(/\.br$/, "");
  const bytes = originals.get(name);
  if (!bytes) { res.writeHead(404); res.end(); return; }
  const compressed = pathname.endsWith(".br"), body = compressed ? brotliCompressSync(bytes) : bytes;
  res.writeHead(200, { "Content-Type": "model/gltf-binary", "Content-Length": body.length, ...(compressed ? { "Content-Encoding": "br" } : {}) }); res.end(body);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

// Execute the actual loader transport seam, not a reimplementation. Only the
// browser event class is supplied; Three FileLoader, fetch, Brotli decoding,
// request pool, packet decoder, cache and ownership logic all remain real.
const ast = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const constants = new Set(["VERSION", "BASE", "MOBILE_BASE", "MODEL_BYTE_CACHE", "PREFETCH_CONCURRENCY", "modelTransport", "MODEL_PREFETCH_QUEUE_TIMEOUT_MS", "MODEL_REQUEST_TIMEOUT_MS", "MODEL_REQUEST_HARD_TIMEOUT_MS", "MODEL_REQUEST_TOTAL_TIMEOUT_MS", "MODEL_REQUEST_BR_BUDGET_MS", "MODEL_REQUEST_RETRY_DELAY_MS", "MODEL_PACKET_TIMEOUT_MS", "modelPacketStore"]);
const functions = new Set(["getModelPacketStore", "modelByteCacheKey", "releaseModelBytes", "fetchModelBytes", "fetchIndividualModelBytes"]);
const pieces = [];
ts.forEachChild(ast, node => {
  if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) {
    if (constants.delete(declaration.name.getText(ast))) pieces.push(`${node.declarationList.flags & ts.NodeFlags.Const ? "const" : "let"} ${declaration.getText(ast)};`);
  }
  if (ts.isFunctionDeclaration(node) && functions.delete(node.name?.text)) pieces.push(node.getText(ast));
});
assert.equal(constants.size, 0, `Missing transport constants: ${[...constants]}`);
assert.equal(functions.size, 0, `Missing transport functions: ${[...functions]}`);
const code = ts.transpileModule(`${pieces.join("\n")}\nmodule.exports = { fetchModelBytes, releaseModelBytes, cache: MODEL_BYTE_CACHE };`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const create = (data = manifest, version = manifest.modelsVersion, basePath = base) => {
  const context = vm.createContext({ module: { exports: {} }, THREE, createModelPacketStore, createRequestPool, loadModelRequestAttempt, packetManifest: data, process: { env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_MODELS_VERSION: version } }, setTimeout, clearTimeout, window: { setTimeout, clearTimeout } });
  vm.runInContext(code, context);
  return context.module.exports;
};
const originalProgressEvent = globalThis.ProgressEvent;
globalThis.ProgressEvent = class extends Event { constructor(type, values) { super(type); Object.assign(this, values); } };
let checks = 0;
const test = async (name, work) => { requests.length = 0; await work(); checks++; console.log(`PASS ${name}`); };
const url = name => `${base}/models-mobile-${manifest.modelsVersion}/${name}`;
const matches = (bytes, name) => assert.deepEqual(Buffer.from(bytes), originals.get(name));
try {
  await test("subdirectory base path applies to model and packet URLs", async () => {
    const api = create(manifest, manifest.modelsVersion, `${base}/preview`);
    matches(await api.fetchModelBytes(`${base}/preview/models-mobile-${manifest.modelsVersion}/${names[0]}`), names[0]);
    assert.equal(requests.length, 1);
    assert.ok(requests[0].pathname.startsWith("/preview/model-packets/"));
  });
  await test("actual loader shares one HTTP packet across original model cache entries", async () => {
    const api = create(), pending = names.map(name => api.fetchModelBytes(url(name)));
    assert.equal(api.fetchModelBytes(url(names[0]), { demanded: true }), pending[0]);
    (await Promise.all(pending)).forEach((bytes, index) => matches(bytes, names[index]));
    assert.equal(requests.length, 1); assert.ok(requests[0].pathname.startsWith("/model-packets/"));
    for (const [index, name] of names.entries()) api.releaseModelBytes(url(name), {}, pending[index]);
    assert.equal(api.cache.size, 0);
  });
  for (const failure of ["404", "corrupt"]) await test(`${failure} packet serves every original through real individual HTTP fallback`, async () => {
    mode = failure;
    const api = create(), pending = names.map(name => api.fetchModelBytes(url(name), { demanded: true }));
    (await Promise.all(pending)).forEach((bytes, index) => matches(bytes, names[index]));
    assert.equal(requests.filter(request => request.pathname.startsWith("/model-packets/")).length, 1);
    assert.equal(requests.filter(request => request.pathname.endsWith(".glb.br")).length, names.length);
    for (const [index, name] of names.entries()) api.releaseModelBytes(url(name), {}, pending[index]);
    mode = "normal";
    matches(await api.fetchModelBytes(url(names[0])), names[0]);
    assert.equal(requests.filter(request => request.pathname.startsWith("/model-packets/")).length, 2);
  });
  await test("stale manifest version cannot replace current model bytes", async () => {
    const api = create({ ...manifest, modelsVersion: "wrong-version" });
    matches(await api.fetchModelBytes(url(names[0])), names[0]);
    assert.equal(requests.length, 1); assert.ok(requests[0].pathname.endsWith(".glb.br"));
  });
  await test("unversioned source/dev assets retain the original direct path", async () => {
    const api = create(manifest, "");
    matches(await api.fetchModelBytes(`${base}/models-mobile/${names[0]}`), names[0]);
    assert.equal(requests.length, 1); assert.ok(requests[0].pathname.endsWith(".glb"));
  });
  await test("custom headers, credentials and paths bypass packet transport", async () => {
    const api = create();
    matches(await api.fetchModelBytes(url(names[0]), { requestHeader: { "x-packet-test": "preserved" } }), names[0]);
    matches(await api.fetchModelBytes(url(names[0]), { withCredentials: true }), names[0]);
    matches(await api.fetchModelBytes(names[0], { path: `${base}/models-mobile-${manifest.modelsVersion}/` }), names[0]);
    assert.equal(requests.length, 3); assert.equal(requests[0].header, "preserved");
    assert.ok(requests.every(request => request.pathname.endsWith(".glb.br")));
  });
  await test("missing digest support still loads exact individual bytes", async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "crypto");
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    try { matches(await create().fetchModelBytes(url(names[0])), names[0]); }
    finally { Object.defineProperty(globalThis, "crypto", original); }
    assert.equal(requests.length, 1); assert.ok(requests[0].pathname.endsWith(".glb.br"));
  });
  await test("custom LoadingManager retains balanced individual transport ownership", async () => {
    const manager = new THREE.LoadingManager();
    const starts = [], ends = [];
    const start = manager.itemStart.bind(manager), end = manager.itemEnd.bind(manager);
    manager.itemStart = url => { starts.push(url); start(url); };
    manager.itemEnd = url => { ends.push(url); end(url); };
    matches(await create().fetchModelBytes(url(names[0]), { manager }), names[0]);
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(ends, starts); assert.equal(starts.length, 1);
    assert.ok(starts[0].endsWith(".glb.br"));
    assert.equal(requests.length, 1);
  });
} finally {
  globalThis.ProgressEvent = originalProgressEvent;
  await new Promise(resolve => server.close(resolve));
}
console.log(`model packet HTTP integration contract: PASS (${checks} checks)`);
