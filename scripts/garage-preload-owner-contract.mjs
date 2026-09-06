import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await fs.readFile("components/shop/WalkthroughWorld.tsx", "utf8");
const ast = ts.createSourceFile("WalkthroughWorld.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let declaration;
const calls = [];
const walk = node => {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "preloadGarageRoute") declaration = node.getText(ast);
  if (ts.isCallExpression(node) && node.expression.getText(ast) === "preloadGarageRoute") calls.push(node);
  ts.forEachChild(node, walk);
};
walk(ast);
assert.ok(declaration, "Exercise the actual async module-to-prefetch boundary");
const code = ts.transpileModule(`const ${declaration}; module.exports = preloadGarageRoute;`,
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
for (const cancelled of [true, false]) {
  let resolveImport;
  const imported = new Promise(resolve => { resolveImport = resolve; });
  const dispatched = [];
  const context = vm.createContext({ module: { exports: {} }, preloadShopWorld: () => imported });
  vm.runInContext(code, context);
  let current = true;
  const pending = context.module.exports("lite", () => current);
  if (cancelled) current = false;
  const loaded = { preloadOpeningGarage: tier => dispatched.push(tier) };
  resolveImport(loaded);
  assert.equal(await pending, loaded, "The module promise remains usable without a second import");
  assert.deepEqual(dispatched, cancelled ? [] : ["lite"], "A disposed route must not change its successor's transport admission");
}
assert.equal(calls.length, 3, "Check both hero-idle schedules and the proximity schedule");
assert.ok(calls.every(call => call.arguments.length === 2), "Every caller supplies its effect ownership guard");
assert.ok(calls.every(call => call.arguments[1].getText(ast) === "() => !cancelled"), "Callers consult their live effect ownership, not a captured constant");
console.log("deferred garage prefetch retains module promise and ignores disposed route owners: PASS");
