import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import * as THREE from "three";
import ts from "typescript";

// Run the installed renderer's actual compile traversal, stopping only at its
// GPU material-preparation boundary. This catches changes in Three's contract
// without opening a second browser or allocating a WebGL context.
const rendererSource = await readFile(new URL("../node_modules/three/src/renderers/WebGLRenderer.js", import.meta.url), "utf8");
const rendererAst = ts.createSourceFile("WebGLRenderer.js", rendererSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
let rendererCompile;
function findCompile(node) {
  if (ts.isBinaryExpression(node) && node.left.getText(rendererAst) === "this.compile" && ts.isFunctionExpression(node.right)) rendererCompile = node.right.getText(rendererAst);
  ts.forEachChild(node, findCompile);
}
findCompile(rendererAst);
assert.ok(rendererCompile, "Installed Three compile implementation must be exercised");

const source = await readFile(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8");
const parsed = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const productionFunction = parsed.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === "compileProgramsWithin");
assert.ok(productionFunction);
const executable = ts.transpileModule(productionFunction.getText(parsed) + "\nmodule.exports = compileProgramsWithin;", {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

async function check({ detached = false, wholeScene = false, hidden = false, stale = false } = {}) {
  const scene = new THREE.Scene();
  const holder = new THREE.Group();
  const shell = new THREE.Group();
  scene.add(holder);
  holder.add(shell);
  const camera = new THREE.PerspectiveCamera();
  scene.add(new THREE.AmbientLight(), new THREE.HemisphereLight());
  for (let i = 0; i < 5; i++) scene.add(new THREE.PointLight(0xffffff, 0));
  for (let i = 0; i < 3; i++) shell.add(new THREE.PointLight(0xffaa55, i));
  const excludedLight = new THREE.PointLight();
  excludedLight.layers.set(2);
  shell.add(excludedLight);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: "#b5a793", roughness: 0.47, metalness: 0.9 });
  const secondMaterial = new THREE.MeshPhysicalMaterial({ clearcoat: 1 });
  const outsideMaterial = new THREE.MeshStandardMaterial();
  const model = new THREE.Mesh(geometry, [material, secondMaterial]);
  shell.add(model);
  scene.add(new THREE.Mesh(geometry, outsideMaterial));
  shell.visible = !hidden;
  if (detached) holder.remove(shell);
  const scope = wholeScene ? scene : shell;
  const lightingScene = wholeScene ? undefined : scene;
  const capture = (root) => {
    const objects = [];
    root.traverse((object) => objects.push({ object, parent: object.parent, visible: object.visible, children: [...object.children], intensity: object.intensity }));
    return objects;
  };
  const before = [...capture(scene), ...(detached ? capture(shell) : [])];
  const expectLights = [];
  const collect = (root) => root.traverseVisible((object) => { if (object.isLight && object.layers.test(camera.layers)) expectLights.push(object); });
  collect(scene);
  if (detached && !wholeScene) collect(shell);
  const compiledLights = [];
  const preparedMaterials = [];
  const state = { init() {}, pushLight(light) { compiledLights.push(light); }, pushShadow() {}, setupLights() {} };
  const compile = vm.runInNewContext(`(${rendererCompile})`, {
    renderStates: { get(target) { assert.equal(target, scene); return state; } },
    renderStateStack: [], currentRenderState: undefined,
    prepareMaterial(selectedMaterial, target, object) {
      assert.equal(target, scene, "Preserve the real environment/fog/light context");
      assert.ok(object === model || (wholeScene && object.material === outsideMaterial), "Prepare original object identities, never clones");
      preparedMaterials.push(selectedMaterial);
    },
  });
  const readerTarget = {};
  const hdrTarget = {};
  let currentTarget = readerTarget;
  let clock = 0;
  let uploads = 0;
  const gl = {
    compile,
    getRenderTarget: () => currentTarget,
    getActiveCubeFace: () => 2,
    getActiveMipmapLevel: () => 1,
    setRenderTarget(target) { currentTarget = target; },
    properties: { get: () => ({ currentProgram: { isReady: () => true } }) },
  };
  const context = vm.createContext({ module: { exports: {} }, THREE, performance: { now: () => clock }, PROGRAM_COMPILE_PATIENCE_MS: 100, wait: async (ms) => { clock += ms; } });
  vm.runInContext(executable, context);
  await context.module.exports(gl, scope, camera, lightingScene, () => stale, hdrTarget, async () => {
    uploads += 1;
    assert.equal(currentTarget, readerTarget, "Restore HDR target before asynchronous uploads");
  });
  assert.equal(currentTarget, readerTarget);
  assert.equal(uploads, stale ? 0 : 1);
  if (!stale) {
    assert.equal(compiledLights.length, expectLights.length,
      `Attached shell lights must compile exactly once (detached=${detached}, wholeScene=${wholeScene}, hidden=${hidden})`);
    assert.equal(new Set(compiledLights).size, compiledLights.length, "Never compile a doubled light-count shader variant");
    for (const light of expectLights) assert.ok(compiledLights.includes(light), "No real light may be removed from the compile context");
    assert.deepEqual(preparedMaterials, wholeScene ? [material, secondMaterial, outsideMaterial] : [material, secondMaterial], "Keep compilation scoped to exact original materials");
  } else assert.equal(compiledLights.length, 0);
  for (const entry of before) {
    assert.equal(entry.object.parent, entry.parent, "Do not detach or reparent live scene objects");
    assert.equal(entry.object.visible, entry.visible, "Do not hide any light or object");
    assert.equal(entry.object.intensity, entry.intensity, "Do not alter lighting intensity");
    assert.deepEqual(entry.object.children, entry.children, "Do not rewrite live scene ownership");
  }
  assert.equal(model.geometry, geometry);
  assert.equal(material.metalness, 0.9);
  assert.equal(secondMaterial.clearcoat, 1);
  geometry.dispose();
  for (const entry of [material, secondMaterial, outsideMaterial]) entry.dispose();
}

await check();
await check({ detached: true });
await check({ hidden: true });
await check({ wholeScene: true });
await check({ stale: true });
console.log("garage compile light scope contract: PASS (actual Three traversal, exact lights/materials, unchanged live tree)");
