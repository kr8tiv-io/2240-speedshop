/**
 * Keep a refined model only where refining actually helped.
 *
 *   node scripts/prune-refined.js [--apply]
 *
 * The Blender pass is right for a FACETED model and wrong for one that was
 * already smooth. Smoothing by angle marks every edge steeper than the threshold
 * sharp, and the glTF exporter splits vertices at each of them — so a
 * photogrammetry prop whose author already shipped correct normals comes back
 * with MORE vertices than it started with, for no visual gain whatsoever.
 *
 * Measured on the shipped shelf, which is how this was found:
 *
 *   car-dodge-charger   88,544 -> 44,166 B on the wire     refining worked
 *   car-prewar-hotrod  345,604 -> 273,815                  refining worked
 *   prop-ammo-box       48,895 ->  51,761                  refining COST bytes
 *   prop-bench-vice    150,090 -> 155,788                  refining COST bytes
 *
 * The gate is the outcome, not a proxy for it: if the refined export does not
 * have fewer vertices than the original, the refined file is deleted and
 * `compress-models.js` falls back to the pristine source on its own. No rename,
 * no special case, no flag — `sourceOf()` already does exactly this for the
 * models the refiner refused.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "models");
const REFINED = path.join(ROOT, "public", "models-refined");
const APPLY = process.argv.includes("--apply");

const TOOL_PATHS = [
  path.join(ROOT, "node_modules"),
  "C:\\tmp\\gltf-tools\\node_modules",
];
const req = (name) => {
  for (const root of TOOL_PATHS) {
    const candidate = path.join(root, name);
    if (fs.existsSync(candidate)) return require(candidate);
  }
  throw new Error(`${name} not found — see compress-models.js for the toolchain install`);
};
const { NodeIO } = req("@gltf-transform/core");
const { ALL_EXTENSIONS } = req("@gltf-transform/extensions");

const verts = (doc) => {
  let n = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute("POSITION");
      if (pos) n += pos.getCount();
    }
  }
  return n;
};

(async () => {
  if (!fs.existsSync(REFINED)) {
    console.log("no public/models-refined — nothing to prune");
    return;
  }
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const files = fs.readdirSync(REFINED).filter((f) => f.endsWith(".glb"));
  const drop = [];
  let keptVerts = 0;
  let savedVerts = 0;

  for (const file of files) {
    const source = path.join(SRC, file);
    if (!fs.existsSync(source)) continue;
    let a, b;
    try {
      a = verts(await io.read(source));
      b = verts(await io.read(path.join(REFINED, file)));
    } catch (error) {
      console.log(`  ?  ${file} — unreadable (${String(error).slice(0, 60)}), dropping to be safe`);
      drop.push(file);
      continue;
    }
    // A VEHICLE always keeps its refined twin, whatever the vertex count says.
    //
    // Blender welds the hot-rod to 12,851 vertices and the glTF exporter splits
    // it back to 47,672 — glTF stores one normal per vertex, so every edge the
    // smooth-by-angle pass marked sharp re-duplicates its vertices on the way
    // out. The vertex count is therefore not the measure of whether refining a
    // car worked: the SHADING is, and the shading is the whole point. The
    // hot-rod still went 345,604 -> 273,815 B on the wire, because
    // `compress-models.js` only applies meshopt to a vehicle that has a refined
    // twin — deleting the twin here would flip `needsRuntimeCrease` back on and
    // take meshopt with it, sending that same file to about 719 KB.
    const vehicle = /^(car|truck)-/.test(file);
    if (b >= a && !vehicle) {
      drop.push({ file, a, b });
    } else {
      keptVerts += b;
      savedVerts += Math.max(0, a - b);
    }
  }

  console.log(`${files.length} refined models`);
  console.log(`  kept    ${files.length - drop.length}  (${savedVerts.toLocaleString()} vertices saved)`);
  console.log(`  dropped ${drop.length}  (refining added vertices — original is better)`);
  for (const d of drop.slice(0, 15)) {
    if (typeof d === "string") continue;
    console.log(`     ${d.file.padEnd(38)} ${d.a.toLocaleString()} -> ${d.b.toLocaleString()}  (+${Math.round((100 * (d.b - d.a)) / d.a)}%)`);
  }
  if (drop.length > 15) console.log(`     … and ${drop.length - 15} more`);

  if (!APPLY) {
    console.log("\ndry run — pass --apply to delete the unhelpful refined files");
    return;
  }
  for (const d of drop) fs.rmSync(path.join(REFINED, typeof d === "string" ? d : d.file));
  console.log(`\ndeleted ${drop.length} refined files; compress-models.js will read those from public/models/`);
})();
