const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const TOOL_PATHS = [
  path.join(ROOT, "node_modules"),
  "C:\\tmp\\gltf-tools\\node_modules",
];
const req = (name) => {
  for (const root of TOOL_PATHS) {
    const candidate = path.join(root, name);
    if (fs.existsSync(candidate)) return require(candidate);
  }
  throw new Error(`${name} is required for the shelf audit`);
};

const { NodeIO, Logger } = req("@gltf-transform/core");
const { ALL_EXTENSIONS } = req("@gltf-transform/extensions");
const { MeshoptDecoder } = req("meshoptimizer");

const loaders = fs.readFileSync(path.join(ROOT, "components", "shop", "Loaders.tsx"), "utf8");
const used = [...new Set([...loaders.matchAll(/\$\{BASE\}([\w.\-]+\.glb)/g)].map((match) => match[1]))];
const baselineFlag = process.argv.indexOf("--baseline");
const baselineRoot = baselineFlag >= 0 ? path.resolve(process.argv[baselineFlag + 1]) : null;

const stats = async (io, file) => {
  const document = await io.read(file);
  const primitives = document.getRoot().listMeshes().flatMap((mesh) => mesh.listPrimitives());
  return {
    primitives: primitives.length,
    vertices: primitives.reduce(
      (sum, primitive) => sum + (primitive.getAttribute("POSITION")?.getCount() ?? 0),
      0,
    ),
    triangles: primitives.reduce((sum, primitive) => {
      assert.equal(primitive.getMode(), 4, `${file} contains a non-triangle primitive`);
      const elements = primitive.getIndices()?.getCount()
        ?? primitive.getAttribute("POSITION")?.getCount()
        ?? 0;
      return sum + elements / 3;
    }, 0),
    materials: document.getRoot().listMaterials().length,
    animations: document.getRoot().listAnimations().length,
    skins: document.getRoot().listSkins().length,
  };
};

(async () => {
  await MeshoptDecoder.ready;
  const io = new NodeIO()
    .setLogger(new Logger(Logger.Verbosity.SILENT))
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "meshopt.decoder": MeshoptDecoder });

  const totals = {};
  for (const shelf of ["models-opt", "models-mobile"]) {
    let currentPrimitives = 0;
    let baselinePrimitives = 0;
    let currentTriangles = 0;
    let baselineTriangles = 0;
    let currentBytes = 0;
    let baselineBytes = 0;
    for (const file of used) {
      const currentPath = path.join(ROOT, "public", shelf, file);
      assert.ok(fs.existsSync(currentPath), `${shelf}/${file} is missing`);
      const current = await stats(io, currentPath);
      assert.equal(current.animations, 0, `${shelf}/${file} unexpectedly contains animation`);
      assert.equal(current.skins, 0, `${shelf}/${file} unexpectedly contains a skin`);
      currentPrimitives += current.primitives;
      currentTriangles += current.triangles;
      currentBytes += fs.statSync(currentPath).size;

      if (!baselineRoot) continue;
      const baselinePath = path.join(baselineRoot, "public", shelf, file);
      assert.ok(fs.existsSync(baselinePath), `baseline ${shelf}/${file} is missing`);
      const baseline = await stats(io, baselinePath);
      baselinePrimitives += baseline.primitives;
      baselineTriangles += baseline.triangles;
      baselineBytes += fs.statSync(baselinePath).size;
      assert.ok(current.primitives <= baseline.primitives, `${shelf}/${file} added primitives`);
    }
    totals[shelf] = {
      files: used.length,
      primitives: baselineRoot ? `${baselinePrimitives} -> ${currentPrimitives}` : currentPrimitives,
      triangles: baselineRoot ? `${baselineTriangles} -> ${currentTriangles}` : currentTriangles,
      bytes: baselineRoot ? `${baselineBytes} -> ${currentBytes}` : currentBytes,
    };
  }
  console.log(JSON.stringify(totals, null, 2));
  console.log("model shelf audit: PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
