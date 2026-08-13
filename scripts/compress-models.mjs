/**
 * Hero-model compression — the three-act stage assets.
 *
 * The film mounts three vehicles. Raw, they are 3.5 MB of GLB, which is a
 * non-starter on a phone. gltfpack (meshoptimizer) quantises the attributes
 * (KHR_mesh_quantization) and entropy-codes the buffers
 * (EXT_meshopt_compression); the decoder is ~25 kB and already bundled inside
 * drei's useGLTF, so — unlike Draco — there is NO extra 250 kB decoder fetch
 * and decode is an order of magnitude faster on mobile.
 *
 *   raw 3.45 MB  ->  524 kB  (85% off), and the /draco/ decoder is dropped.
 *
 * `-km` keeps material names, which the scene REQUIRES: every paint / glass /
 * lamp / tyre treatment is keyed off the source material's name.
 * `-tc` (KTX2 + BasisU) is passed too, so any textured model added later is
 * supercompressed automatically. All three current heroes carry zero embedded
 * textures (verified) — their look is entirely material-driven — so today the
 * texture pass is a no-op and the win is all geometry.
 *
 *   node scripts/compress-models.mjs            # rebuild public/models/hero
 *   node scripts/compress-models.mjs --check    # report sizes only
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "public", "models");
const OUT = path.join(root, "public", "models", "hero");

/** [source file, published name] */
/**
 * The three heroes, chosen on triangle count as much as on silhouette — a
 * hero car that reads as low-poly undoes the whole film. The Quaternius
 * pickup that used to sit in act III was 6.4k triangles and looked it next to
 * the 10-11k Grzybek bodies; the Charger is 9.6k and holds up beside them.
 */
const HEROES = [
  ["car-muscle-challenger.glb", "challenger.glb"],
  ["car-muscle-coupe-hoodup.glb", "coupe-hoodup.glb"],
  ["car-dodge-charger.glb", "charger.glb"],
];

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;

if (process.argv.includes("--check")) {
  let total = 0;
  for (const [, out] of HEROES) {
    const p = path.join(OUT, out);
    const size = fs.existsSync(p) ? fs.statSync(p).size : 0;
    total += size;
    console.log(`${out.padEnd(22)} ${kb(size)}`);
  }
  console.log(`${"TOTAL".padEnd(22)} ${kb(total)}`);
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });

let before = 0;
let after = 0;
for (const [src, out] of HEROES) {
  const from = path.join(SRC, src);
  const to = path.join(OUT, out);
  if (!fs.existsSync(from)) {
    console.error(`missing source: ${from}`);
    process.exit(1);
  }
  // -cc high-ratio meshopt · -kn keep node names · -km keep material names
  // (the scene keys off them) · -ke keep extras · -tc KTX2/BasisU textures
  const run = (args) =>
    execFileSync("npx", ["--yes", "gltfpack@0.24", "-i", from, "-o", to, ...args], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
  // Quantisation precision above gltfpack's defaults. `-vn 8` (the default)
  // bands the normals badly on a smooth body panel under a rim light — the
  // exact "this model looks cheap" symptom — and `-vp 14` on a 5 m car puts
  // vertices on a 0.3 mm lattice, which shows on a panel gap. 12/16 costs a
  // few kB per model and is the difference between premium and papery.
  const base = ["-cc", "-kn", "-km", "-ke", "-vp", "16", "-vn", "12", "-vt", "14"];
  try {
    run([...base, "-tc"]);
  } catch {
    // The npm build of gltfpack ships without the BasisU encoder; it only
    // errors when a model actually HAS textures to encode. Geometry
    // compression is the whole win for these three, so carry on without it
    // and shout so a future textured hero gets a native gltfpack build.
    console.warn(`  (no BasisU encoder available — ${src} packed without KTX2)`);
    run(base);
  }
  before += fs.statSync(from).size;
  after += fs.statSync(to).size;
  console.log(`${src} -> hero/${out}  ${kb(fs.statSync(from).size)} -> ${kb(fs.statSync(to).size)}`);
}
console.log(`\nstage total  ${kb(before)} -> ${kb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% off)`);
