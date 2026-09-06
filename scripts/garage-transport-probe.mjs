import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { brotliCompressSync, brotliDecompressSync, constants } from "node:zlib";
import assert from "node:assert/strict";
import ts from "typescript";
import puppeteer, { PredefinedNetworkConditions } from "puppeteer-core";

// Transport-only hypothesis test. Nothing is written into public/ or the app.
// No renderer or asset encoder is involved. The in-memory packets concatenate
// exact existing GLBs, and the browser verifies every extracted SHA-256 hash.
const label = process.env.QA_LABEL || "transport-packets-probe";
const output = path.resolve(`output/playwright/garage-performance-2026-09-06/${label}`);
await fs.mkdir(output, { recursive: true });
const source = await fs.readFile("components/shop/Loaders.tsx", "utf8");
const ast = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const names = new Set(["M", "OPENING_MODELS", "ROUTE_MODEL_GROUPS", "ROUTE_PREFETCH_MODELS"]);
const declarations = [];
ts.forEachChild(ast, node => {
  if (!ts.isVariableStatement(node)) return;
  for (const declaration of node.declarationList.declarations) {
    if (names.has(declaration.name.getText(ast))) declarations.push(`const ${declaration.getText(ast)};`);
  }
});
const code = ts.transpileModule(`const BASE = ""; ${declarations.join("\n")} module.exports = ROUTE_PREFETCH_MODELS;`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const sandbox = { module: { exports: {} } };
vm.runInNewContext(code, sandbox);
const urls = Array.from(sandbox.module.exports);
assert.equal(urls.length, 71);
const shelf = process.env.QA_SHELF || "public/models-mobile";
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const models = await Promise.all(urls.map(async name => {
  const bytes = await fs.readFile(path.join(shelf, name));
  const compressed = await fs.readFile(path.join(shelf, `${name}.br`));
  assert.deepEqual(brotliDecompressSync(compressed), bytes);
  return { name, bytes, compressed, hash: digest(bytes) };
}));
const bodies = new Map();
const baseline = models.map(model => {
  const url = `/individual/${model.name}.br`;
  bodies.set(url, model.compressed);
  return { url, encodedBytes: model.compressed.length, entries: [{ name: model.name, offset: 0, length: model.bytes.length, hash: model.hash }] };
});
const packets = [];
let pending = [], wireBytes = 0, rawBytes = 0;
function flush() {
  if (!pending.length) return;
  if (pending.length === 1) packets.push(baseline[models.indexOf(pending[0])]);
  else {
    const bytes = Buffer.concat(pending.map(model => model.bytes));
    const compressed = brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } });
    assert.deepEqual(brotliDecompressSync(compressed), bytes);
    let offset = 0;
    const entries = pending.map(model => {
      const entry = { name: model.name, offset, length: model.bytes.length, hash: model.hash };
      assert.equal(digest(bytes.subarray(offset, offset + entry.length)), model.hash);
      offset += entry.length;
      return entry;
    });
    const url = `/packet/${digest(compressed).slice(0, 16)}.bin.br`;
    bodies.set(url, compressed);
    packets.push({ url, encodedBytes: compressed.length, entries });
  }
  pending = []; wireBytes = 0; rawBytes = 0;
}
for (const [index, model] of models.entries()) {
  // Preserve the first three vehicle requests exactly. Bound packets using
  // both transfer and decoded sizes; never turn the tour into one giant file.
  if (index < 3 || model.compressed.length > 128 * 1024 || model.bytes.length > 1024 * 1024) {
    flush(); packets.push(baseline[index]); continue;
  }
  if (wireBytes + model.compressed.length > 128 * 1024 || rawBytes + model.bytes.length > 1024 * 1024) flush();
  pending.push(model); wireBytes += model.compressed.length; rawBytes += model.bytes.length;
}
flush();
assert.deepEqual(packets.flatMap(packet => packet.entries.map(entry => entry.name)), urls);
const network = PredefinedNetworkConditions["Fast 4G"];
const report = { label, shelf, status: "RUNNING", network, models: models.length, baseline: { requests: baseline.length, bytes: baseline.reduce((sum, entry) => sum + entry.encodedBytes, 0) }, packets: { requests: packets.length, bytes: packets.reduce((sum, entry) => sum + entry.encodedBytes, 0), manifest: packets }, runs: [] };
console.log(JSON.stringify({ label, models: report.models, baseline: report.baseline, packets: { requests: report.packets.requests, bytes: report.packets.bytes } }));
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (pathname === "/") { res.writeHead(200, { "Content-Type": "text/html" }); res.end("<!doctype html><title>Private transport benchmark</title>"); return; }
  if (pathname === "/favicon.ico") { res.writeHead(204); res.end(); return; }
  const body = bodies.get(pathname);
  if (!body) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": "application/octet-stream", "Content-Encoding": "br", "Content-Length": body.length, "Cache-Control": "no-store" });
  res.end(body);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: false,
    args: ["--window-position=-2400,0", "--disable-features=CalculateNativeWinOcclusion", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--no-first-run"] });
  for (const mode of ["baseline", "packets", "packets", "baseline"]) {
    const context = await browser.createBrowserContext();
    try {
      const page = await context.newPage();
      await page.setCacheEnabled(false);
      await page.emulateNetworkConditions(network);
      await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: "load" });
      const run = await page.evaluate(async resources => {
        performance.setResourceTimingBufferSize(500);
        const start = performance.now(), completed = [];
        let index = 0;
        const worker = async () => {
          while (index < resources.length) {
            const resource = resources[index++];
            const response = await fetch(resource.url);
            if (!response.ok) throw new Error(`Transport ${response.status}`);
            const bytes = await response.arrayBuffer();
            for (const entry of resource.entries) {
              const original = bytes.slice(entry.offset, entry.offset + entry.length);
              const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", original))).map(n => n.toString(16).padStart(2, "0")).join("");
              if (hash !== entry.hash) throw new Error(`Changed original model ${entry.name}`);
              completed.push({ name: entry.name, at: performance.now() - start });
            }
          }
        };
        await Promise.all([worker(), worker()]);
        return { elapsedMs: performance.now() - start, completed, resources: performance.getEntriesByType("resource").filter(entry => /\/individual\/|\/packet\//.test(entry.name)).map(entry => ({ name: entry.name, start: entry.startTime - start, end: entry.responseEnd - start, encodedBytes: entry.encodedBodySize })) };
      }, mode === "baseline" ? baseline : packets);
      assert.equal(new Set(run.completed.map(model => model.name)).size, 71);
      assert.equal(run.resources.length, mode === "baseline" ? baseline.length : packets.length);
      report.runs.push({ mode, ...run });
      console.log(JSON.stringify({ mode, elapsedMs: run.elapsedMs, requests: run.resources.length, verifiedModels: run.completed.length }));
    } finally { await context.close(); }
  }
  const mean = mode => report.runs.filter(run => run.mode === mode).reduce((sum, run) => sum + run.elapsedMs, 0) / 2;
  report.summary = { baselineMeanMs: mean("baseline"), packetsMeanMs: mean("packets"), improvementMs: mean("baseline") - mean("packets"), improvementPercent: (1 - mean("packets") / mean("baseline")) * 100 };
  report.status = "PASS";
} catch (error) { report.status = "FAIL"; report.failure = String(error.stack || error); }
finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
  await fs.writeFile(path.join(output, "results.json"), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ label, status: report.status, summary: report.summary, failure: report.failure, output }));
if (report.status !== "PASS") process.exitCode = 1;
