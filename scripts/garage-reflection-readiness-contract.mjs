import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import { startEnvironmentWarmup, waitForEnvironmentWarmup, releaseEnvironmentWarmup } from "../lib/environment-warmup.ts";

const source = await fs.readFile("components/shop/Loaders.tsx", "utf8");
const ast = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const names = ["warmUp", "compileProgramsWithin", "warmTextures"];
const functions = ast.statements.filter(n => ts.isFunctionDeclaration(n) && names.includes(n.name?.text));
assert.equal(functions.length, names.length);
const executable = ts.transpileModule(functions.map(n => n.getText(ast)).join("\n") + "\nmodule.exports = warmUp;", {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function exercise({ resolution = 64, cancel = false, missing = false, queryFailure = false, siblings = 1 } = {}) {
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera();
  const environment = new THREE.CubeTexture(); scene.environment = environment;
  const texture = new THREE.Texture(); texture.image = { width: 4096, height: 4096 };
  const nodes = Array.from({ length: siblings }, () => {
    const node = new THREE.Group(); node.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ map: texture })));
    scene.add(node); return node;
  });
  const original = [];
  scene.traverse(object => original.push({ object, parent: object.parent, visible: object.visible, geometry: object.geometry, material: object.material }));
  const readerTarget = {}, hdr = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType });
  const properties = new Map(), compiles = [], uploads = [], targets = [];
  let target = readerTarget, face = 3, mip = 2, driverReady = missing || queryFailure, stale = false, released = 0;
  const gl = { getContext: () => ({ isContextLost: () => false }),
    getRenderTarget: () => target, getActiveCubeFace: () => face, getActiveMipmapLevel: () => mip,
    setRenderTarget(next, nextFace = 0, nextMip = 0) { target = next; face = nextFace; mip = nextMip; targets.push(next); },
    properties: { get: material => properties.get(material) },
    compile(scope, eye, lighting) {
      const materials = new Set(); scope.traverse(object => { if (object.material) materials.add(object.material); });
      const reflection = [...materials].some(material => material.name === "PMREMGGXConvolution");
      if (!reflection) compiles.push({ ready: driverReady, scene: lighting, environment: lighting?.environment, eye,
        originals: [...materials], target, stale });
      for (const material of materials) {
        if (reflection) material.addEventListener("dispose", () => released++);
        properties.set(material, { currentProgram: { isReady: () => {
          if (reflection && queryFailure) throw new Error("optional driver query unavailable");
          return reflection ? driverReady : true;
        } } });
      }
      return materials;
    },
    initTexture: uploaded => uploads.push(uploaded),
  };
  if (!missing) startEnvironmentWarmup(gl, resolution);
  targets.length = 0;
  const context = vm.createContext({ module: { exports: {} }, THREE, DEBUG: false, performance,
    COMPOSER_TARGETS: new WeakMap([[gl, hdr]]), UPLOADED_TEXTURES: new WeakMap(),
    PROGRAM_COMPILE_PATIENCE_MS: 1000, wait: pause, nextUploadFrame: async () => undefined, waitForEnvironmentWarmup });
  vm.runInContext(executable, context);
  const running = Promise.all(nodes.map(node => context.module.exports(gl, node, camera, scene, () => stale)));
  try {
    if (!missing && !queryFailure) {
      await pause(20);
      assert.equal(compiles.length, 0, "No bay may trigger lazy reflection filtering while the original GGX program is pending");
      assert.equal(targets.length, 0, "Readiness waiting cannot borrow a framebuffer or begin material work");
    }
    if (cancel) { stale = true; releaseEnvironmentWarmup(gl); }
    else driverReady = true;
    await running;
    assert.equal(compiles.length, cancel ? 0 : siblings, "Only live original consumers compile after readiness/fallback");
    for (const compile of compiles) {
      assert.equal(compile.ready, true); assert.equal(compile.stale, false);
      assert.equal(compile.scene, scene); assert.equal(compile.environment, environment); assert.equal(compile.eye, camera);
      assert.equal(compile.target, hdr); assert.ok(nodes.some(node => node.children[0].material === compile.originals[0]));
    }
    assert.ok(uploads.every(uploaded => uploaded === texture));
    if (!cancel) assert.equal(uploads.length, 1, "The original texture remains uploaded once per renderer");
    assert.equal(target, readerTarget); assert.equal(face, 3); assert.equal(mip, 2);
    assert.equal(scene.environment, environment); assert.deepEqual(texture.image, { width: 4096, height: 4096 });
    for (const item of original) {
      assert.equal(item.object.parent, item.parent); assert.equal(item.object.visible, item.visible);
      assert.equal(item.object.geometry, item.geometry); assert.equal(item.object.material, item.material);
    }
  } finally {
    driverReady = true; releaseEnvironmentWarmup(gl); await running;
    assert.equal(released, missing ? 0 : 1, "Release the owned original filter holder exactly once");
    scene.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
    texture.dispose(); environment.dispose(); hdr.dispose();
  }
}
const failures = [];
for (const [name, options] of [["phone consumer waits for exact reflection", {}], ["desktop consumer waits", { resolution: 256 }],
  ["concurrent bays share readiness", { siblings: 3 }], ["cancelled renderer does not compile", { cancel: true }],
  ["missing optional preparation keeps original path", { missing: true }], ["driver query failure keeps original fallback", { queryFailure: true }]]) {
  try { await exercise(options); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, error: error.message.split("\n")[0] }); console.log(`FAIL ${name}: ${error.message.split("\n")[0]}`); }
}
assert.deepEqual(failures, [], "Every real garage material consumer must respect reflection readiness");
