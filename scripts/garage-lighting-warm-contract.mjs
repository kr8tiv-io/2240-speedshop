import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let warmShell;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "warmShell") warmShell = node.initializer;
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(warmShell, "Exercise the production shell-startup sequence");
const executable = ts.transpileModule(`module.exports = ${warmShell.getText(ast)};`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

for (const hasLighting of [true, false]) {
  const calls = [];
  const gl = {}, camera = {}, scene = {}, shell = {}, fixtures = {};
  let releaseLighting;
  const lightingReady = new Promise(resolve => { releaseLighting = resolve; });
  const context = vm.createContext({
    module: { exports: {} }, DEBUG: false, performance,
    gl, camera, scene, composer: {}, target: { current: shell },
    lighting: { current: hasLighting ? fixtures : null },
    stale: () => false, get: () => ({ gl, camera, scene }),
    warmComposerPrograms: async () => { calls.push("post"); },
    primeEnvironment: async () => { calls.push("environment"); },
    waitForEnvironmentWarmup: async () => { calls.push("reflection-ready"); },
    releaseEnvironmentWarmup: () => { calls.push("reflection-release"); },
    warmUp: async (renderer, node, eye, world) => {
      assert.equal(renderer, gl); assert.equal(node, fixtures);
      assert.equal(eye, camera); assert.equal(world, scene);
      calls.push("lighting-start");
      await lightingReady;
      calls.push("lighting-ready");
    },
    warmSubtree: async (_renderer, node) => {
      assert.equal(node, shell, "Only the existing shell receives material unification");
      calls.push("shell");
      releaseLighting();
    },
    warmThroughComposer: async (node) => {
      assert.equal(node, shell);
      calls.push("first-use");
    },
  });
  vm.runInContext(executable, context);
  await context.module.exports();
  if (hasLighting) {
    assert.ok(calls.includes("lighting-start"), "Ambient fixture materials must be compiled before the final reveal");
    assert.ok(calls.indexOf("environment") < calls.indexOf("lighting-start"), "Compile with the finished reflection environment");
    assert.ok(calls.indexOf("lighting-start") < calls.indexOf("shell"), "Overlap fixture compilation with the shell startup");
    assert.ok(calls.indexOf("lighting-ready") < calls.indexOf("first-use"), "Wait for fixture shaders before verification frames");
  } else {
    assert.ok(!calls.includes("lighting-start"), "An absent optional lighting group remains safe");
  }
}

const world = await readFile(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8");
assert.match(world, /<group ref=\{lighting\}>\s*<Ambience\s*\/>\s*<\/group>/, "Register the actual unchanged ambient fixtures");
assert.match(world, /<WarmScene\b[^>]*lighting=\{lighting\}/, "Pass fixture ownership to the startup sequence");
console.log("PASS: original ambient fixtures warm in parallel with the shell, before first use; material-unification scope unchanged");
