import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

// Exercise the production scheduler without mounting a second GPU renderer.
const source = await readFile(new URL("../components/shop/Loaders.tsx", import.meta.url), "utf8");
const parsed = ts.createSourceFile("Loaders.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const names = ["warmSubtree", "warmTextures", "warmUp", "compileProgramsWithin"];
const functions = parsed.statements.filter(
  (statement) => ts.isFunctionDeclaration(statement) && names.includes(statement.name?.text),
);
assert.equal(functions.length, names.length, "The actual warm-up scheduler functions must remain testable.");
const executable = ts.transpileModule(
  functions.map((statement) => statement.getText(parsed)).join("\n") +
    "\nmodule.exports = { warmSubtree, warmUp, compileProgramsWithin };",
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText;

function fixture(options = {}) {
  let clock = 0;
  let stale = Boolean(options.initiallyStale);
  const events = [];
  const readerTarget = { name: "reader" };
  const hdrTarget = { name: "composer HDR" };
  const afterFrameTarget = { name: "next visible frame" };
  let activeTarget = readerTarget;
  let face = 3;
  let mip = 2;
  let readyAt = Infinity;
  let uploads = 0;
  let queries = 0;
  let disposals = 0;
  const textures = Array.from({ length: 6 }, (_, index) => ({
    isTexture: true, name: `exact texture ${index}`, image: { width: 4096, height: 4096 },
  }));
  const material = Object.fromEntries(textures.map((texture, index) => [`map${index}`, texture]));
  const node = { traverse(visit) { visit({ isMesh: true, material }); } };
  const scene = {};
  const camera = {};
  const gl = {
    getRenderTarget: () => activeTarget,
    getActiveCubeFace: () => face,
    getActiveMipmapLevel: () => mip,
    setRenderTarget(target, cubeFace = 0, mipLevel = 0) {
      activeTarget = target;
      face = cubeFace;
      mip = mipLevel;
      events.push(["target", target?.name, face, mip]);
    },
    compile(compiledNode, compiledCamera, targetScene) {
      events.push(["compile", clock]);
      assert.equal(activeTarget, hdrTarget, "Compile uses the exact shipped HDR variant.");
      assert.equal(compiledNode, node);
      assert.equal(compiledCamera, camera);
      assert.equal(targetScene, scene);
      readyAt = clock + 100;
      if (options.compileFails) throw new Error("optional compile failure");
      return new Set([material]);
    },
    initTexture(texture) {
      assert.notEqual(activeTarget, hdrTarget, "Uploads cannot retain the private compile framebuffer.");
      assert.equal(texture, textures[uploads], "Upload must preserve exact texture identity and order.");
      uploads += 1;
      events.push(["upload", clock]);
      if (options.uploadFails) throw new Error("optional upload failure");
    },
    properties: { get() {
      assert.equal(stale, false, "A cancelled renderer must not receive shader queries.");
      queries += 1;
      if (options.queryFails) throw new Error("disposed program");
      return options.disposedMaterial ? {} : { currentProgram: { isReady() {
        events.push(["poll", clock]);
        return options.neverReady ? false : clock >= readyAt;
      } } };
    } },
  };
  const context = vm.createContext({
    module: { exports: {} },
    console,
    performance: { now: () => clock },
    DEBUG: false,
    PROGRAM_COMPILE_PATIENCE_MS: 160,
    COMPOSER_TARGETS: new WeakMap([[gl, hdrTarget]]),
    UPLOADED_TEXTURES: new WeakMap(),
    THREE: { HalfFloatType: "half float", WebGLRenderTarget: class {
      constructor() { return hdrTarget; }
    } },
    countRenderables: () => 1,
    unifyTree: () => undefined,
    untilIdle: async () => undefined,
    wait: async (ms) => {
      assert.notEqual(activeTarget, hdrTarget, "No asynchronous wait may retain the compile framebuffer.");
      clock += ms;
      if (options.cancelOnPoll && ms === 16) stale = true;
    },
    nextUploadFrame: async () => {
      assert.notEqual(activeTarget, hdrTarget, "The visible frame must keep its own render target.");
      events.push(["upload-frame", clock]);
      clock += 16;
      if (options.cancelDuringUploads) stale = true;
      if (options.frameFails) throw new Error("cancelled upload frame");
      if (options.changeTargetDuringFrame) activeTarget = afterFrameTarget;
    },
  });
  hdrTarget.dispose = () => { disposals += 1; };
  vm.runInContext(executable, context);
  return {
    run: () => context.module.exports.warmSubtree(gl, node, camera, scene, () => stale),
    events, textures, gl, hdrTarget, readerTarget, afterFrameTarget,
    state: () => ({ clock, uploads, queries, activeTarget, face, mip, disposals }),
  };
}

const main = fixture();
await main.run();
const firstCompile = main.events.findIndex(([event]) => event === "compile");
const firstUpload = main.events.findIndex(([event]) => event === "upload");
assert.ok(firstCompile >= 0 && firstCompile < firstUpload,
  "Submit shaders before paced texture uploads so GPU compilation can overlap those frames.");
assert.equal(main.state().uploads, 6);
assert.equal(main.events.filter(([event]) => event === "upload-frame").length, 6,
  "One full frame per exact texture upload is unchanged.");
assert.equal(main.state().activeTarget, main.readerTarget);
assert.equal(main.state().face, 3, "Restore the caller's cube face before yielding.");
assert.equal(main.state().mip, 2, "Restore the caller's mip level before yielding.");
assert.ok(main.state().clock <= 182,
  "The 96ms texture pass must overlap the 100ms driver compile, not add to it.");
assert.equal(main.state().disposals, 0, "Borrowed composer targets remain owned by the composer.");
for (const texture of main.textures) assert.deepEqual(texture.image, { width: 4096, height: 4096 });

const switched = fixture({ changeTargetDuringFrame: true });
await switched.run();
assert.equal(switched.state().activeTarget, switched.afterFrameTarget,
  "A late finally must never overwrite a newer visible frame's target.");

const initiallyStale = fixture({ initiallyStale: true });
await initiallyStale.run();
assert.deepEqual(initiallyStale.events, []);
const cancelled = fixture({ cancelDuringUploads: true });
await cancelled.run();
assert.equal(cancelled.state().uploads, 1);
assert.equal(cancelled.state().queries, 0);
assert.equal(cancelled.state().activeTarget, cancelled.readerTarget);
const cancelledPoll = fixture({ cancelOnPoll: true, neverReady: true });
await cancelledPoll.run();
assert.equal(cancelledPoll.state().queries, 1, "Cancellation stops the bounded poll without a detached timer.");

const unhandled = [];
const onUnhandled = (error) => unhandled.push(error);
process.on("unhandledRejection", onUnhandled);
try {
  for (const option of ["compileFails", "uploadFails", "frameFails", "queryFails", "disposedMaterial", "neverReady"]) {
    const candidate = fixture({ [option]: true });
    await candidate.run();
    assert.equal(candidate.state().activeTarget, candidate.readerTarget, `${option} restores the caller target.`);
    assert.ok(candidate.state().clock <= 326, `${option} must remain bounded.`);
    if (option === "compileFails") assert.equal(candidate.state().uploads, 6,
      "An optional compile failure cannot remove paced texture pre-upload fallback.");
  }
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(unhandled, [], "No background promise can reject after warm-up has returned.");
} finally {
  process.off("unhandledRejection", onUnhandled);
}

console.log("garage warm-up overlap contract: PASS (exact textures, HDR state, cancellation, fallback, bounded polling)");
