import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
const text = await fs.readFile("components/shop/Loaders.tsx", "utf8");
const ast = ts.createSourceFile("Loaders.tsx", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const fn = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "warmThroughComposer");
const executable = ts.transpileModule(fn.getText(ast) + "\nmodule.exports = warmThroughComposer;", {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const tick = () => new Promise(resolve => setImmediate(resolve));
function fixture() {
  const scopes = new WeakMap(), completed = new WeakMap(), controls = [], starts = [];
  const context = vm.createContext({ module: { exports: {} }, loaderGeneration: 1, warmQueue: Promise.resolve(),
    PACED: completed, PACING: new WeakMap(), WARM_STATION_LIGHTS: scopes,
    pacedWarm: (node, label, root, generation) => new Promise((resolve, reject) => {
      starts.push({ node, owner: scopes.get(node), generation }); controls.push({ resolve, reject });
    }),
  });
  vm.runInContext(executable, context);
  return { run: context.module.exports, context, scopes, completed, starts, controls };
}
const failures = [];
async function check(name, body) {
  try { await body(); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, message: error.message }); console.log(`FAIL ${name}: ${error.message}`); }
}
await check("same-owner pending work is shared, completed work reused", async () => {
  const f = fixture(), node = {}; f.scopes.set(node, { isStale: () => false });
  const first = f.run(node); await tick(); const second = f.run(node);
  const same = first === second; f.controls[0].resolve(); await first; await second;
  assert.ok(same, "A pending duplicate must await the actual first use, not resolve before it completes");
  await f.run(node); assert.equal(f.starts.length, 1);
});
await check("replacement waits for old scope then warms the same node", async () => {
  const f = fixture(), node = {}; let dead = false;
  f.scopes.set(node, { isStale: () => dead });
  const first = f.run(node); await tick(); dead = true;
  const newOwner = { isStale: () => false }; f.scopes.set(node, newOwner);
  let prematurelyDone = false; const second = f.run(node).then(() => { prematurelyDone = true; });
  await tick(); const early = prematurelyDone;
  f.controls[0].resolve(); await first; await tick();
  if (f.controls[1]) f.controls[1].resolve(); await second;
  assert.equal(early, false, "Cancelled work cannot be mistaken for a complete warm on the same node");
  assert.equal(f.starts.length, 2); assert.equal(f.starts[1].owner, newOwner);
  assert.equal(f.completed.get(node), 1);
});
await check("disposed queued scope never starts, successor still runs", async () => {
  const f = fixture(), blocker = {}, node = {}; let dead = false;
  const head = f.run(blocker); await tick(); f.scopes.set(node, { isStale: () => dead });
  let oldDone = false;
  const old = f.run(node).then(() => { oldDone = true; }); dead = true; const owner = { isStale: () => false }; f.scopes.set(node, owner);
  const next = f.run(node); f.controls[0].resolve(); await head; await tick();
  const skippedOld = oldDone;
  for (let i = 1; i < f.controls.length; i++) f.controls[i].resolve();
  await old; await tick(); for (let i = 1; i < f.controls.length; i++) f.controls[i].resolve(); await next;
  assert.equal(skippedOld, true, "The disposed queued owner resolves without starting a GPU job");
  assert.equal(f.starts.length, 2); assert.equal(f.starts[1].owner, owner);
});
await check("failed first use is retryable and never marked complete", async () => {
  const f = fixture(), node = {}; const first = f.run(node); const rejected = assert.rejects(first, /driver interrupted/);
  await tick(); f.controls[0].reject(new Error("driver interrupted")); await rejected;
  assert.equal(f.completed.has(node), false, "Failure must not leave a successful first-use latch");
  const next = f.run(node); await tick(); assert.equal(f.starts.length, 2); f.controls[1].resolve(); await next;
});
await check("old renderer completion cannot finish or remove its successor", async () => {
  const f = fixture(), node = {}; const old = f.run(node); await tick();
  f.context.loaderGeneration = 2; f.context.warmQueue = Promise.resolve();
  const next = f.run(node); await tick();
  f.controls[0].resolve(); await old;
  assert.equal(f.completed.has(node), false);
  assert.equal(f.run(node), next, "Old completion must not delete the successor's pending promise");
  f.controls[1].resolve(); await next;
  assert.equal(f.completed.get(node), 2); assert.equal(f.starts.length, 2);
});
assert.deepEqual(failures, [], "Warm completion belongs to completed, live work, not enqueue time");
