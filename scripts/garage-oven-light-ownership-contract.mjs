import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import * as THREE from "three";
import { installLightPad, setStationLights, disposeLightPad } from "../components/shop/lights.ts";

const source = await fs.readFile("components/shop/Loaders.tsx", "utf8");
const ast = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const functions = ast.statements.filter(node => ts.isFunctionDeclaration(node) && ["firstUseKey", "pacedWarm"].includes(node.name?.text));
assert.equal(functions.length, 2);
let firstUse;
let stationFrame;
const visit = node => {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "firstUse") firstUse = node.getText(ast);
  ts.forEachChild(node, visit);
};
visit(ast);
assert.ok(firstUse);
const warmStation = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "WarmStation");
const findFrame = node => {
  if (ts.isCallExpression(node) && node.expression.getText(ast) === "useFrame") stationFrame = node.arguments[0].getText(ast);
  ts.forEachChild(node, findFrame);
};
findFrame(warmStation);
assert.ok(stationFrame);
const compile = text => ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;

function fixture() {
  disposeLightPad();
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera();
  for (let i = 0; i < 20; i++) scene.add(new THREE.PointLight(0xffaa55, 2 + i));
  installLightPad(scene, 5);
  const previous = new THREE.Group();
  for (let i = 0; i < 3; i++) previous.add(new THREE.PointLight(0xffffff, 4));
  scene.add(previous); setStationLights("prior", 3);
  const node = new THREE.Group(); node.name = "bay-4"; node.visible = false;
  node.add(new THREE.PointLight(0xffffff, 18));
  for (let i = 0; i < 5; i++) node.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ metalness: .4, roughness: .3 })));
  scene.add(node);
  const count = () => { let total = 0; scene.traverseVisible(object => { if (object.isPointLight) total++; }); return total; };
  const original = [];
  scene.traverse(object => original.push({ object, visible: object.visible, parent: object.parent, intensity: object.intensity, geometry: object.geometry, material: object.material }));
  const cleanup = () => {
    disposeLightPad();
    node.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
  };
  return { scene, camera, node, count, original, cleanup };
}

async function queuedOwnership() {
  const f = fixture();
  let resolveWarm;
  const queued = new Promise(resolve => { resolveWarm = resolve; });
  const context = vm.createContext({ module: { exports: {} },
    group: { current: f.node }, lights: { current: 1 }, station: 4, camera: f.camera,
    setStationLights, warmThroughComposer: () => queued, get: () => ({}),
    stale: () => false, stationAt: () => 0, drawSpan: () => 1, drawn: { current: false },
  });
  vm.runInContext(compile(`const ${firstUse}; module.exports = firstUse;`), context);
  try {
    const pending = context.module.exports();
    const whileQueued = f.count();
    resolveWarm(); await pending;
    assert.equal(whileQueued, 25, "A queued hidden bay must not borrow a padding light before its own draw starts");
    assert.equal(f.count(), 25);
  } finally { f.cleanup(); }
}

async function pacedOwnership({ throwDraw = false, cancel = false, cancelOwner = false, cancelCourtesy = false, frameCourtesy = false } = {}) {
  const f = fixture();
  let target = { name: "visible target" }, draws = 0, yields = 0, cancelledTouches = 0;
  const readerTarget = target;
  const gl = { getRenderTarget: () => target, setRenderTarget(next) { target = next; },
    render(scene, camera) {
      assert.equal(scene, f.scene); assert.equal(camera, f.camera);
      assert.equal(f.node.visible, true, "The representative bay is actually visible for its private draw");
      assert.equal(f.count(), 25, "Each private draw includes the original lights plus the correct zero-intensity pad");
      draws++;
      if (throwDraw) throw new Error("expected private draw failure");
    },
  };
  const root = { gl, scene: f.scene, camera: f.camera, get: () => ({ frameloop: "never" }) };
  const hdr = new THREE.WebGLRenderTarget(24, 24, { type: THREE.HalfFloatType, samples: 4 });
  const ovens = new Map();
  let ownerCancelled = false;
  const lightOwner = { key: "4", count: 1, isStale: () => ownerCancelled };
  const context = vm.createContext({ module: { exports: {} }, THREE, DEBUG: false, phoneTier: false,
    loaderGeneration: 1, performance, COMPOSER_TARGETS: new WeakMap([[gl, hdr]]), COMPOSER_OVENS: ovens,
    WARM_STATION_LIGHTS: new WeakMap([[f.node, lightOwner]]),
    setStationLights: (key, count) => { if (context.loaderGeneration !== 1 || ownerCancelled) cancelledTouches++; setStationLights(key, count); },
    waitForReaderQuiet: async () => {
      if (cancelCourtesy) {
        ownerCancelled = true;
        setStationLights("4", 0);
        assert.equal(f.count(), 25, "Effect cleanup during the initial courtesy must not leave a visible unowned bay light");
      }
      if (frameCourtesy) {
        const frameContext = vm.createContext({ module: { exports: {} }, group: { current: f.node },
          warm: { current: false }, drawn: { current: false }, lights: { current: 1 }, station: 4,
          stationAt: () => 0, drawSpan: () => 1, phoneTier: false, setStationLights });
        vm.runInContext(compile(`module.exports = ${stationFrame};`), frameContext);
        frameContext.module.exports({ camera: f.camera });
        assert.equal(f.count(), 25);
      }
    },
    nextFrameWithin: async () => {
      yields++;
      assert.equal(f.count(), 25, "Yielded work must return the missing bay light to the pad before another subtree compiles");
      assert.equal(f.node.visible, false, "The original hidden scene state is restored before yielding");
      if (cancel) context.loaderGeneration = 2;
      if (cancelOwner) {
        ownerCancelled = true;
        const successor = new THREE.Group(); successor.add(new THREE.PointLight(0xffffff, 18));
        f.scene.add(successor); setStationLights("4", 1);
      }
    },
  });
  vm.runInContext(compile(functions.map(node => node.getText(ast)).join("\n") + "\nmodule.exports = pacedWarm;"), context);
  // Reproduce the original firstUse handoff: the pad was claimed before the
  // async queue. The actual paced function must reconcile after every release.
  if (!cancelCourtesy && !frameCourtesy) setStationLights("4", 1);
  try {
    if (throwDraw) await assert.rejects(context.module.exports(f.node, "station 4", root, 1), /expected private draw failure/);
    else await context.module.exports(f.node, "station 4", root, 1);
    if (cancelCourtesy) { assert.equal(draws, 0); assert.equal(ovens.size, 0); }
    else { assert.ok(draws > 0); if (!throwDraw) assert.ok(yields > 0); }
    assert.equal(f.count(), 25);
    assert.equal(target, readerTarget);
    assert.equal(cancelledTouches, 0, "A disposed renderer cannot change its successor's light pad");
    for (const before of f.original.filter(entry => !entry.object.userData.pad)) {
      assert.equal(before.object.visible, before.visible); assert.equal(before.object.parent, before.parent);
      assert.equal(before.object.intensity, before.intensity); assert.equal(before.object.geometry, before.geometry);
      assert.equal(before.object.material, before.material);
    }
  } finally {
    for (const oven of ovens.values()) oven.dispose(); hdr.dispose(); f.cleanup();
  }
}

function frameOwnership() {
  const f = fixture();
  const context = vm.createContext({ module: { exports: {} }, group: { current: f.node },
    warm: { current: false }, drawn: { current: false }, lights: { current: 1 }, station: 4,
    stationAt: () => 0, drawSpan: () => 1, phoneTier: false, setStationLights,
  });
  vm.runInContext(compile(`module.exports = ${stationFrame};`), context);
  try {
    setStationLights("4", 1);
    context.module.exports({ camera: f.camera });
    assert.equal(f.count(), 25, "The real frame reconciles temporary warm light claims even when its show decision has not changed");
  } finally { f.cleanup(); }
}

const failures = [];
for (const [name, check] of [["queued ownership", queuedOwnership], ["paced release", () => pacedOwnership()],
  ["draw failure restoration", () => pacedOwnership({ throwDraw: true })], ["cancelled owner", () => pacedOwnership({ cancel: true })],
  ["superseded bay in same renderer", () => pacedOwnership({ cancelOwner: true })],
  ["cancellation during initial courtesy", () => pacedOwnership({ cancelCourtesy: true })],
  ["actual station frame during initial courtesy", () => pacedOwnership({ frameCourtesy: true })],
  ["live frame ownership", frameOwnership]]) {
  try { await check(); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, message: error.message }); console.log(`FAIL ${name}: ${error.message}`); }
}
assert.deepEqual(failures, [], "Original station lights and pad must remain paired across async warm-up ownership");
