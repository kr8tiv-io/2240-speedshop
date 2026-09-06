import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import * as THREE from "three";

const moduleUrl = new URL("../lib/environment-warmup.ts", import.meta.url);
assert.ok(existsSync(moduleUrl), "Reflection filtering shaders must have an explicit pre-warm lifecycle");
const { startEnvironmentWarmup, waitForEnvironmentWarmup, releaseEnvironmentWarmup } = await import(moduleUrl);

for (const resolution of [64, 128, 256]) {
  const readerTarget = {};
  let target = readerTarget;
  let ready = false;
  const compiled = [];
  const properties = new Map();
  const gl = {
    getContext: () => ({ isContextLost: () => false }),
    getRenderTarget: () => target,
    getActiveCubeFace: () => 3,
    getActiveMipmapLevel: () => 2,
    setRenderTarget(next, face, mip) {
      target = next;
      if (next === readerTarget) { assert.equal(face, 3); assert.equal(mip, 2); }
    },
    compile(root) {
      assert.equal(target.texture.type, THREE.HalfFloatType);
      assert.equal(target.texture.colorSpace, THREE.LinearSRGBColorSpace);
      const materials = new Set();
      root.traverse(object => {
        if (!object.material) return;
        compiled.push({ material: object.material, geometry: object.geometry });
        properties.set(object.material, { currentProgram: { isReady: () => ready } });
        materials.add(object.material);
      });
      return materials;
    },
    properties: { get: material => properties.get(material) },
  };
  startEnvironmentWarmup(gl, resolution);
  assert.equal(target, readerTarget, "Never hold the warm framebuffer over an await");
  startEnvironmentWarmup(gl, resolution);
  assert.equal(compiled.length, 1, "Compile only the expensive filter; the public conversion precompile creates an unused variant");
  const actual = compiled.find(entry => entry.material.name === "PMREMGGXConvolution");
  assert.ok(actual, "Prepare the expensive GGX filter, not just cubemap conversion");

  // Compare against the installed generator's unmodified material construction.
  const reference = new THREE.PMREMGenerator(gl);
  reference._setSize(resolution);
  const referenceTarget = reference._allocateTargets();
  assert.equal(actual.material.vertexShader, reference._ggxMaterial.vertexShader);
  assert.equal(actual.material.fragmentShader, reference._ggxMaterial.fragmentShader);
  assert.deepEqual(actual.material.defines, reference._ggxMaterial.defines);
  assert.equal(actual.material.defines.GGX_SAMPLES, 256);
  assert.deepEqual(Object.keys(actual.geometry.attributes), Object.keys(reference._lodMeshes[1].geometry.attributes));
  referenceTarget.dispose(); reference.dispose();

  let resolved = false;
  const waiting = waitForEnvironmentWarmup(gl).then(() => { resolved = true; });
  await new Promise(resolve => setTimeout(resolve, 25));
  assert.equal(resolved, false, "Do not treat a submitted program as ready");
  ready = true;
  await waiting;
  const disposed = [];
  for (const { material } of compiled) material.addEventListener("dispose", () => disposed.push(material));
  releaseEnvironmentWarmup(gl);
  releaseEnvironmentWarmup(gl);
  assert.equal(new Set(disposed).size, 1, "Release only the owned filtering program holder, once");
  await waitForEnvironmentWarmup(gl);
}

// A context lost before startup must not submit GL work or leave a polling job.
const lost = { getContext: () => ({ isContextLost: () => true }) };
startEnvironmentWarmup(lost, 64);
await waitForEnvironmentWarmup(lost);
releaseEnvironmentWarmup(lost);

// Exercise cancellation, driver exceptions and context loss at the GL boundary,
// while keeping the real generator's allocation/disposal implementation.
for (const failure of ["cancel", "context-loss", "compile-throw", "query-throw", "deadline"]) {
  const originalTarget = {};
  let target = originalTarget, contextLost = false, disposalCount = 0;
  const compiled = [];
  const gl = {
    getContext: () => ({ isContextLost: () => contextLost }),
    getRenderTarget: () => target,
    getActiveCubeFace: () => 0, getActiveMipmapLevel: () => 0,
    setRenderTarget: next => { target = next; },
    compile(root) {
      root.material.addEventListener("dispose", () => { disposalCount++; });
      compiled.push(root.material);
      if (failure === "compile-throw") throw new Error("GPU compilation unavailable");
    },
    properties: { get: () => ({ currentProgram: { isReady: () => {
      if (failure === "query-throw") throw new Error("GPU query unavailable");
      return false;
    } } }) },
  };
  startEnvironmentWarmup(gl, 64);
  assert.equal(target, originalTarget, `${failure}: restore the current render target`);
  const waiting = waitForEnvironmentWarmup(gl);
  if (failure === "cancel") releaseEnvironmentWarmup(gl);
  if (failure === "context-loss") contextLost = true;
  let guard;
  try {
    await Promise.race([waiting, new Promise((_, reject) => {
      guard = setTimeout(() => reject(new Error(`${failure}: stranded startup`)), failure === "deadline" ? 10_000 : 1000);
    })]);
  } finally { clearTimeout(guard); }
  releaseEnvironmentWarmup(gl);
  releaseEnvironmentWarmup(gl);
  assert.equal(disposalCount, compiled.length, `${failure}: dispose every owned program holder once`);
}

const hero = readFileSync(new URL("../components/home/HeroScene.tsx", import.meta.url), "utf8");
const shop = readFileSync(new URL("../components/shop/ShopWorld.tsx", import.meta.url), "utf8");
const loader = readFileSync(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8");
assert.ok(hero.includes('startEnvironmentWarmup(gl, mobile ? 128 : 256)'), "Hero must submit the exact existing environment resolution at renderer creation");
assert.ok(shop.includes('startEnvironmentWarmup(gl, tier === "lite" ? 64 : 256)'), "Garage must submit the exact existing environment resolution at renderer creation");
assert.ok(hero.includes("await waitForEnvironmentWarmup(gl)") && hero.indexOf("await waitForEnvironmentWarmup(gl)") < hero.indexOf("await gl.compileAsync(actRoot"), "Hero reflection filtering must be ready before material compilation");
assert.match(loader, /await primeEnvironment\(get\(\), stale\);\s*await waitForEnvironmentWarmup\(gl\)/);
assert.match(hero, /releaseEnvironmentWarmup\(gl\)/);
assert.match(loader, /releaseLoaderRenderer\(gl: THREE.WebGLRenderer\) \{\s*releaseEnvironmentWarmup\(gl\)/);
console.log("PASS: exact 64/128/256 reflection shaders, HDR state restoration, readiness, deduplication, cancellation, context loss and exception cleanup");
