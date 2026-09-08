import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import { Pass } from "postprocessing";

const source = await readFile(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8");
const parsed = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declaration = parsed.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "warmComposerPrograms");
assert.ok(declaration, "Exercise the actual production helper");
const executable = ts.transpileModule(declaration.getText(parsed) + "\nmodule.exports = warmComposerPrograms;", {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

async function scenario(name, options = {}) {
  const original = new THREE.ShaderMaterial();
  const originalGeometry = Pass.fullscreenGeometry;
  const mesh = new THREE.Mesh(originalGeometry, original);
  const passScene = new THREE.Scene();
  passScene.add(mesh);
  const passes = [{ scene: passScene }, { duplicate: original }];
  const hdr = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType });
  const composer = { current: options.late ? null : { passes, inputBuffer: options.fallback ? undefined : hdr } };
  const targets = new WeakMap();
  const gl = {};
  let originalDisposed = false;
  let sharedDisposed = false;
  let hdrDisposed = false;
  let temporaryDisposed = false;
  let fallbackDisposed = false;
  let compiled;
  let stale = Boolean(options.stale);
  const originalListener = () => { originalDisposed = true; };
  const sharedListener = () => { sharedDisposed = true; };
  original.addEventListener("dispose", originalListener);
  originalGeometry.addEventListener("dispose", sharedListener);
  hdr.addEventListener("dispose", () => { hdrDisposed = true; });
  const context = vm.createContext({
    module: { exports: {} }, THREE, DEBUG: false, COMPOSER_TARGETS: targets,
    wait: async () => {
      if (options.cancelWaiting) stale = true;
      else composer.current = { passes, inputBuffer: hdr };
    },
    compileProgramsWithin: async (renderer, scene, camera, targetScene, isStale, target) => {
      // Record first: production's fallback intentionally catches compile errors.
      compiled = { renderer, scene, camera, targetScene, stale: isStale(), target,
        meshes: [...scene.children], attributes: Object.keys(scene.children[0].geometry.attributes).sort() };
      scene.children[0].geometry.addEventListener("dispose", () => { temporaryDisposed = true; });
      if (target !== hdr) target.addEventListener("dispose", () => { fallbackDisposed = true; });
      if (options.cancelCompile) stale = true;
      if (options.compileFails) throw new Error("optional driver failure");
    },
  });
  vm.runInContext(executable, context);
  await context.module.exports(gl, composer, () => stale);
  try {
    if (options.stale || options.cancelWaiting) {
      assert.equal(compiled, undefined, `${name}: cancelled renderer never compiles`);
    } else {
      assert.ok(compiled, `${name}: prepare the actual original material`);
      assert.deepEqual(compiled.attributes, Object.keys(originalGeometry.attributes).sort(),
        `${name}: warm-up geometry must select the same shader features as the shipped fullscreen triangle`);
      assert.equal(compiled.renderer, gl);
      assert.equal(compiled.meshes.length, 1, "Deduplicate the same material without dropping it");
      assert.equal(compiled.meshes[0].material, original, "Use the exact original material, not a substitute");
      assert.equal(compiled.meshes[0].geometry === originalGeometry, false, "Never borrow shared geometry for disposal");
      assert.equal(compiled.targetScene, undefined);
      assert.equal(compiled.camera.isOrthographicCamera, true);
      assert.equal(compiled.stale, false);
      assert.equal(temporaryDisposed, true, "Dispose temporary geometry even on cancellation or driver failure");
      assert.equal(compiled.scene.children.length, 0, "Release temporary scene references");
      if (options.fallback) {
        assert.equal(compiled.target.texture.type, THREE.HalfFloatType);
        assert.equal(fallbackDisposed, true);
      } else {
        assert.equal(compiled.target, hdr);
        assert.equal(targets.get(gl), hdr);
      }
    }
    assert.equal(originalDisposed, false);
    assert.equal(sharedDisposed, false);
    assert.equal(hdrDisposed, false);
    assert.equal(mesh.parent, passScene);
    assert.equal(mesh.geometry, originalGeometry);
    assert.equal(mesh.material, original);
    console.log(`PASS ${name}`);
  } finally {
    original.removeEventListener("dispose", originalListener);
    originalGeometry.removeEventListener("dispose", sharedListener);
    original.dispose();
    hdr.dispose();
  }
}

let failures = 0;
for (const [name, options] of [
  ["exact fullscreen compile", {}],
  ["late composer ref", { late: true }],
  ["driver failure cleanup", { compileFails: true }],
  ["cancel during compile", { cancelCompile: true }],
  ["fallback target ownership", { fallback: true }],
  ["cancel before preparation", { stale: true }],
  ["cancel waiting for composer", { late: true, cancelWaiting: true }],
]) {
  try { await scenario(name, options); }
  catch (error) { failures++; console.error(error); }
}
assert.equal(failures, 0, "All original post-processing geometry and ownership cases must pass");
