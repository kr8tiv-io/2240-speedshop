/**
 * THE ASSET PIPELINE — 67 MB of raw .glb into a payload a phone can swallow.
 *
 *   node scripts/compress-models.js [--only name.glb] [--force]
 *
 * Every model the shop actually mounts (the list is read straight out of
 * `components/shop/Loaders.tsx`, so it can never drift) gets:
 *
 *   textures   resized to a per-slot budget, then encoded to KTX2/Basis
 *              (ETC1S, normal-mode on normal maps). This is the fix that
 *              matters most: a 1024² RGBA texture is 5.5 MB of VRAM with mips,
 *              the same texture as ETC1S is 0.7 MB and uploads without a
 *              decode or a mipmap-generation pass on the main thread.
 *   geometry   EXT_meshopt_compression — chosen over Draco because decode is
 *              ~10x cheaper, and decode cost is exactly what shows up as a
 *              dropped frame while the reader is scrolling.
 *   graph      dedup + prune + resample: the free bytes.
 *
 * Originals are never touched: they stay in `public/models/`, the optimised
 * copies land in `public/models-opt/` (what the site fetches, what ships).
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const SCRATCH = "C:\\Users\\lucid\\AppData\\Local\\Temp\\claude\\C--Users-lucid-Desktop\\e5405e16-e9ad-425a-94e8-51f957461ea3\\scratchpad";
const req = (name) => require(path.join(SCRATCH, "node_modules", name));

const { NodeIO } = req("@gltf-transform/core");
const { ALL_EXTENSIONS, EXTTextureWebP } = req("@gltf-transform/extensions");
const {
  dedup,
  prune,
  resample,
  meshopt,
  listTextureSlots,
} = req("@gltf-transform/functions");
const { MeshoptEncoder, MeshoptDecoder } = req("meshoptimizer");
const sharp = req("sharp");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "models");
const OUT = path.join(ROOT, "public", "models-opt");
const KTX = "C:\\Users\\lucid\\tools\\ktx\\bin\\ktx.exe";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "ktx2240-"));

/* ── What the shop actually mounts ──────────────────────────────────────── */

const loaders = fs.readFileSync(path.join(ROOT, "components", "shop", "Loaders.tsx"), "utf8");
const USED = [...new Set([...loaders.matchAll(/\$\{BASE\}([\w.\-]+\.glb)/g)].map((m) => m[1]))];

/* ── Detail budget ──────────────────────────────────────────────────────────
   The orbits pass within a metre of the cars and of the props dressed onto the
   benches and the floor beside each arc — those keep 1K colour. Everything
   that reads as background at four metres or more is half that, which nobody
   can see and every GPU can feel. */

const HERO = new Set([
  // every vehicle — they are the subject of five of the seven orbits
  "car-muscle-challenger.glb", "car-muscle-coupe-hoodup.glb", "car-dodge-charger.glb",
  "car-camaro.glb", "car-camaro-primer-shell.glb", "car-project-shell-rusted.glb",
  "car-covered-project.glb", "truck-pickup-classic.glb", "car-convertible-50s.glb",
  "car-prewar-hotrod-donor.glb",
  // the photogrammetry pieces placed inside arm's reach of an arc
  "prop-tool-cart-rolling.glb", "prop-welding-cart.glb", "prop-tyre-old.glb",
  "prop-wheel-rim-rusted-a.glb", "prop-barrel-rusted-b.glb", "prop-crate-wooden.glb",
  "prop-rack-metal-worn.glb", "prop-desk-metal-office.glb", "prop-stool-metal-a.glb",
  "prop-pipes-industrial.glb", "prop-lamp-caged-hanging.glb", "prop-power-box.glb",
  "prop-metal-jug.glb", "prop-wrench-adjustable.glb", "prop-tool-chest-metal.glb",
  "prop-toolbox-metal.glb", "prop-bench-vice.glb", "prop-storage-cart-industrial.glb",
]);

const budget = (file, slot) => {
  const hero = HERO.has(file);
  if (slot === "color") return hero ? 1024 : 512;
  if (slot === "normal") return hero ? 512 : 256;
  return hero ? 512 : 256; // metallicRoughness / occlusion / everything else
};

function slotOf(document, texture) {
  const slots = listTextureSlots(texture);
  const s = slots.join(",");
  if (/baseColor|emissive|sheenColor|specularColor/.test(s)) return "color";
  if (/normal/.test(s)) return "normal";
  return "linear";
}

/* ── Texture encode ─────────────────────────────────────────────────────────
   WebP, not KTX2.

   KTX2/Basis was the first choice and it was the right one on paper: GPU-native
   compression, a twentieth of the video memory, no main-thread decode. It also
   killed the renderer process about a minute into every visit on the Radeon
   test machine — reproducibly, and never with the same models as plain images.
   Isolated by elimination: not the transcode target (forcing an uncompressed
   target still died), not the worker count (one worker still died), not the
   mesh compression (dropping it still died). The transcoder itself is what the
   driver could not survive.

   WebP keeps most of the win — the size caps below are doing the heavy lifting
   on both bytes and video memory — and it decodes on a browser path that is
   twenty years old and cannot take the page down with it. */

async function encodeTexture(pixels, slot, hero) {
  const quality = slot === "color" ? (hero ? 92 : 86) : hero ? 94 : 90;
  return sharp(pixels, { unlimited: true })
    .webp({ quality, effort: 5, alphaQuality: 90 })
    .toBuffer();
}

/* ── One file ───────────────────────────────────────────────────────────── */

async function convert(file, io) {
  const src = path.join(SRC, file);
  const dst = path.join(OUT, file);
  const before = fs.statSync(src).size;

  const document = await io.read(src);
  document.createExtension(EXTTextureWebP).setRequired(true);

  await document.transform(
    dedup(),
    prune({ keepAttributes: false, keepLeaves: false }),
    resample(),
  );

  /* ONE FEATURE SET, ONE SHADER.
     three compiles a separate program for every distinct combination of vertex
     attributes and texture slots — and a V8 profile put ~350 ms of driver time
     behind EACH one on the Radeon test machine. Four artists' worth of props
     meant a dozen combinations for what is visually one material: some ship
     tangents, some ship vertex colours, most ship neither.
     Tangents are recomputed from screen-space derivatives when absent, which
     at these sizes and in this light is indistinguishable; baked vertex colours
     on a prop that also carries a base-colour texture are noise. Dropping both
     collapses the prop set onto a single program. */
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      for (const name of ["TANGENT", "COLOR_0", "COLOR_1", "TEXCOORD_2", "JOINTS_0", "WEIGHTS_0"]) {
        if (prim.getAttribute(name)) prim.setAttribute(name, null);
      }
    }
  }
  await document.transform(prune({ keepAttributes: false, keepLeaves: false }));

  let vramBefore = 0;
  let vramAfter = 0;

  for (const texture of document.getRoot().listTextures()) {
    const image = texture.getImage();
    if (!image) continue;
    if (texture.getMimeType() === "image/webp") continue;

    const slot = slotOf(document, texture);
    const cap = budget(file, slot);

    let pipeline = sharp(Buffer.from(image), { unlimited: true });
    const meta = await pipeline.metadata();
    vramBefore += meta.width * meta.height * 4 * 1.33;

    // Powers of two only: ETC1S wants a multiple of 4, and the mip chain is
    // cleaner when every level halves exactly.
    const target = Math.min(cap, 1 << Math.floor(Math.log2(Math.max(meta.width, meta.height))));
    const resized = await pipeline
      .resize(target, target, { fit: "fill", kernel: "lanczos3" })
      .png({ compressionLevel: 3 })
      .toBuffer();

    const webp = await encodeTexture(resized, slot, HERO.has(file));
    texture.setImage(webp).setMimeType("image/webp");
    vramAfter += target * target * 4 * 1.33;
  }

  // Vehicles keep float32 geometry. `Loaders.tsx` re-creases the normals of
  // the flat-shaded bodies at load time, and that maths reads the position
  // buffer directly — quantised positions would hand it a different space and
  // the roof of every car is exactly where a wrong normal shows. The bodies
  // are a rounding error in bytes once their textures are KTX2 anyway.
  if (!/^(car|truck)-/.test(file) && !process.argv.includes("--nomeshopt")) {
    await document.transform(meshopt({ encoder: MeshoptEncoder, level: "medium" }));
  }

  await io.write(dst, document);
  const after = fs.statSync(dst).size;
  return { file, before, after, vramBefore, vramAfter };
}

/* ── Run ────────────────────────────────────────────────────────────────── */

(async () => {
  await MeshoptEncoder.ready;
  await MeshoptDecoder.ready;
  fs.mkdirSync(OUT, { recursive: true });

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "meshopt.decoder": MeshoptDecoder,
      "meshopt.encoder": MeshoptEncoder,
    });

  const onlyIdx = process.argv.indexOf("--only");
  const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;
  const force = process.argv.includes("--force");
  const list = only ? [only] : USED;

  let before = 0;
  let after = 0;
  let vramB = 0;
  let vramA = 0;
  const failures = [];

  for (const [i, file] of list.entries()) {
    const dst = path.join(OUT, file);
    if (!force && fs.existsSync(dst) && fs.statSync(dst).mtimeMs > fs.statSync(path.join(SRC, file)).mtimeMs) {
      const b = fs.statSync(path.join(SRC, file)).size;
      const a = fs.statSync(dst).size;
      before += b;
      after += a;
      console.log(`[${i + 1}/${list.length}] ${file} — cached`);
      continue;
    }
    try {
      const r = await convert(file, io);
      before += r.before;
      after += r.after;
      vramB += r.vramBefore;
      vramA += r.vramAfter;
      console.log(
        `[${i + 1}/${list.length}] ${file}  ${(r.before / 1048576).toFixed(2)} → ${(r.after / 1048576).toFixed(2)} MB` +
          `  (vram ${(r.vramBefore / 1048576).toFixed(1)} → ${(r.vramAfter / 1048576).toFixed(1)} MB)`,
      );
    } catch (e) {
      failures.push(file);
      console.error(`[${i + 1}/${list.length}] ${file} FAILED: ${e.message?.slice(0, 300)}`);
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`files      ${list.length - failures.length}/${list.length}`);
  console.log(`payload    ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
  console.log(`texture VRAM ${(vramB / 1048576).toFixed(0)} MB → ${(vramA / 1048576).toFixed(0)} MB`);
  if (failures.length) console.log("FAILED: " + failures.join(", "));
  fs.rmSync(TMP, { recursive: true, force: true });
})();
