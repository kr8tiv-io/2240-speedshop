import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import * as THREE from "three";

const source = await fs.readFile("components/home/HeroScene.tsx", "utf8");
const ast = ts.createSourceFile("HeroScene.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const wanted = ["heroActRoots", "snapshotVisibility", "restoreVisibility", "collectSceneMaterials", "deferMaterialDisposal", "heroCompileScope"];
const helpers = ast.statements.filter(node => ts.isFunctionDeclaration(node) && wanted.includes(node.name?.text));
const primer = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "ScenePrimer");
let prime;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "prime") prime = node.getText(ast);
  ts.forEachChild(node, visit);
}
visit(primer); assert.ok(prime);
const executable = ts.transpileModule(helpers.map(node => node.getText(ast)).join("\n") +
  `\nconst ${prime}; module.exports = prime;`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

async function exercise({ disposeShared = false, cancel = false, rejectCompile = false } = {}) {
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera();
  const shared = new THREE.Group(), lamp = new THREE.Mesh(new THREE.ConeGeometry(), new THREE.MeshStandardMaterial());
  const floor = new THREE.Mesh(new THREE.CircleGeometry(), new THREE.MeshStandardMaterial());
  const motes = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial());
  shared.add(lamp, floor, motes, new THREE.SpotLight()); scene.add(shared, new THREE.DirectionalLight());
  const roots = [0, 1, 2].map(index => {
    const root = new THREE.Group(); root.name = `hero-act-${index}`; root.visible = index === 0;
    root.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial()));
    scene.add(root); return root;
  });
  const initial = [];
  scene.traverse(object => initial.push({ object, parent: object.parent, visible: object.visible,
    geometry: object.geometry, material: object.material }));
  const compiled = [], draws = [];
  const visibleTarget = { name: "visible target" }, hdr = { name: "original composer input" };
  let target = visibleTarget, ready = 0, disposed = 0, released = 0;
  lamp.material.addEventListener("dispose", () => disposed++);
  const gl = { getRenderTarget: () => target, setRenderTarget: value => { target = value; },
    async compileAsync(scope, eye, lighting) {
      assert.equal(eye, camera); assert.equal(lighting, scene); assert.equal(target, hdr);
      const meshes = [], lights = [];
      // Match Three r185's actual compile boundary: material traversal is
      // independent of visibility, lights come from target and supplied scope.
      scope.traverse(object => { if (object.material) meshes.push(object); });
      lighting.traverseVisible(object => { if (object.isLight) lights.push(object); });
      if (scope !== lighting) scope.traverseVisible(object => { if (object.isLight) lights.push(object); });
      compiled.push({ meshes, lights });
      if (disposeShared && compiled.length === 1) {
        lamp.material.dispose();
        assert.equal(disposed, 0, "Shared stage disposal must be held while its program is pending");
      }
      if (cancel) context.cancelled = true;
      if (rejectCompile) throw new Error("expected driver compile rejection");
    },
  };
  const context = vm.createContext({ module: { exports: {} }, THREE, scene, camera, gl,
    ACTS: [{}, {}, {}], cancelled: false, SCENE_PRIMER: { active: false },
    composer: { current: { inputBuffer: hdr, render: () => { draws.push(target); } } },
    waitForEnvironmentWarmup: async () => undefined, waitForParallelPrograms: async () => undefined,
    yieldForHeroWarmup: async () => undefined, releaseEnvironmentWarmup: () => released++,
    onReady: () => ready++, window: { location: { search: "" } },
  });
  vm.runInContext(executable, context);
  try {
    await context.module.exports();
    assert.deepEqual(compiled[0].meshes.map(object => object.uuid), [roots[0].children[0], lamp, floor, motes].map(object => object.uuid),
      "First act must prepare the unchanged shared lamp/floor/particles, not only the car");
    for (let index = 0; index < compiled.length; index++) {
      assert.equal(new Set(compiled[index].lights).size, 2, "Use the real scene lights exactly once");
      assert.equal(compiled[index].lights.length, 2, "No duplicate light context from attached shared roots");
      if (index > 0) assert.deepEqual(compiled[index].meshes.map(object => object.uuid), [roots[index].children[0].uuid], "Do not compile another act or repeat the stage");
    }
    if (cancel) { assert.equal(compiled.length, 1); assert.equal(ready, 0); assert.equal(draws.length, 0); }
    else { assert.equal(ready, 1); assert.equal(released, 1); assert.equal(draws.length, rejectCompile ? 0 : 6); }
    if (disposeShared) assert.equal(disposed, 1, "Replay the exact deferred dispose once");
    assert.equal(target, visibleTarget); assert.equal(context.SCENE_PRIMER.active, false);
    for (const item of initial) {
      assert.equal(item.object.parent, item.parent); assert.equal(item.object.visible, item.visible);
      assert.equal(item.object.geometry, item.geometry); assert.equal(item.object.material, item.material);
    }
  } finally {
    scene.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
  }
}
const failures = [];
for (const [name, options] of [["exact shared stage once", {}], ["shared disposal ownership", { disposeShared: true }],
  ["cancelled preparation restores original scene", { cancel: true }], ["driver rejection retains fallback", { rejectCompile: true }],
  ["shared disposal survives cancellation", { disposeShared: true, cancel: true }],
  ["shared disposal survives rejection", { disposeShared: true, rejectCompile: true }]]) {
  try { await exercise(options); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, message: error.message.split("\n")[0] }); console.log(`FAIL ${name}: ${error.message.split("\n")[0]}`); }
}
assert.deepEqual(failures, [], "Actual ScenePrimer must prepare its shared originals before first draw");
