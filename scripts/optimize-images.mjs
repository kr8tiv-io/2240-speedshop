/**
 * Generate optimized WebP variants of every photo in public/shop:
 *   public/shop/opt/<basename>-1600.webp  (max width 1600)
 *   public/shop/opt/<basename>-800.webp   (max width 800)
 * Skips upscaling and skips files already generated with a newer mtime.
 * Run: node scripts/optimize-images.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/shop");
const OUT = path.resolve("public/shop/opt");
const WIDTHS = [1600, 800];
const QUALITY = 72;

await fs.mkdir(OUT, { recursive: true });

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
let made = 0;
let skipped = 0;

for (const file of files) {
  const input = path.join(SRC, file);
  const base = file.replace(/\.(jpe?g|png|webp)$/i, "");
  const srcStat = await fs.stat(input);

  for (const width of WIDTHS) {
    const outPath = path.join(OUT, `${base}-${width}.webp`);
    try {
      const outStat = await fs.stat(outPath);
      if (outStat.mtimeMs > srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      /* not generated yet */
    }
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    made++;
  }
}

const outFiles = await fs.readdir(OUT);
let total = 0;
for (const f of outFiles) total += (await fs.stat(path.join(OUT, f))).size;
console.log(
  `optimize-images: ${made} generated, ${skipped} up-to-date, ${outFiles.length} files, ${(total / 1024 / 1024).toFixed(2)} MB total in shop/opt`,
);
