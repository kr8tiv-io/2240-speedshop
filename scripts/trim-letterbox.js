/**
 * Cut the baked-in letterbox off the Instagram thumbnails.
 *
 *   node scripts/trim-letterbox.js [--dry]
 *
 * The reel thumbnails were exported as squares with the 9:16 video pillar-boxed
 * into the middle, so every tile carried black bars ABOVE AND BELOW THE PICTURE
 * — inside the file, where no amount of `object-fit` can reach it. This trims
 * the uniform border off each one and writes the photograph back at full bleed.
 * Originals are preserved in `public/shop/_original/` on the first run.
 */

const fs = require("fs");
const path = require("path");

const SCRATCH =
  "C:\\Users\\lucid\\AppData\\Local\\Temp\\claude\\C--Users-lucid-Desktop\\e5405e16-e9ad-425a-94e8-51f957461ea3\\scratchpad";
const sharp = require(path.join(SCRATCH, "node_modules", "sharp"));

const SHOP = path.resolve(__dirname, "..", "public", "shop");
const KEEP = path.join(SHOP, "_original");
const dry = process.argv.includes("--dry");

(async () => {
  fs.mkdirSync(KEEP, { recursive: true });
  const files = fs.readdirSync(SHOP).filter((f) => /^ig-.*\.(jpg|jpeg|png)$/i.test(f));
  let trimmed = 0;

  for (const file of files) {
    const source = path.join(SHOP, file);
    const backup = path.join(KEEP, file);
    if (!fs.existsSync(backup)) fs.copyFileSync(source, backup);

    const input = sharp(backup, { unlimited: true });
    const before = await input.metadata();

    // Trim anything within ~5% of the corner colour. On these files the corner
    // IS the bar, so this finds the picture without being told where it is.
    let out;
    try {
      out = await sharp(backup, { unlimited: true })
        .trim({ threshold: 14 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      console.log(`${file}: trim failed, left alone`);
      continue;
    }

    const { width, height } = out.info;
    const shrank = width < before.width - 4 || height < before.height - 4;
    if (!shrank) {
      console.log(`${file}: no bars found (${before.width}x${before.height})`);
      continue;
    }
    // A trim that eats most of the frame means the photo itself was nearly
    // uniform — not a letterbox. Leave those alone.
    if (width * height < before.width * before.height * 0.25) {
      console.log(`${file}: trim looked wrong (${width}x${height}), left alone`);
      continue;
    }

    console.log(
      `${file}: ${before.width}x${before.height} → ${width}x${height}` +
        `  (${Math.round((1 - (width * height) / (before.width * before.height)) * 100)}% was bars)`,
    );
    trimmed++;
    if (!dry) {
      await sharp(out.data)
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(source + ".tmp");
      fs.renameSync(source + ".tmp", source);
    }
  }

  console.log(`\n${trimmed} of ${files.length} thumbnails had letterbox bars${dry ? " (dry run)" : " — trimmed"}`);
})();
