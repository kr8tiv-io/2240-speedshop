/**
 * Trim the baked-in letterbox off the Instagram thumbnails.
 *
 * Ten of these are 9:16 reel covers that were saved WITH their black bars —
 * on a 360x640 tile that is 185px of pure black top and bottom, i.e. 58% of
 * the file is nothing. Any `object-cover` crop then puts those bars straight
 * through the middle of the tile, which is the "black borders / weird square
 * frames" on the page. No CSS fixes this; the pixels have to go.
 *
 * Originals are copied to public/shop/_orig-ig/ before anything is written.
 *
 *   node scripts/fix-ig-crops.mjs           # trim in place
 *   node scripts/fix-ig-crops.mjs --check   # report only
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "shop");
const backup = path.join(dir, "_orig-letterboxed");
const check = process.argv.includes("--check");

/** A row/column is "bar" if it is essentially black across its whole length. */
const DARK = 14;

async function bars(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const rowLum = (y) => {
    let s = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * c;
      s += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return s / w;
  };
  const colLum = (x) => {
    let s = 0;
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * c;
      s += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return s / h;
  };
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;
  while (top < h / 2 && rowLum(top) < DARK) top++;
  while (bottom < h / 2 && rowLum(h - 1 - bottom) < DARK) bottom++;
  while (left < w / 2 && colLum(left) < DARK) left++;
  while (right < w / 2 && colLum(w - 1 - right) < DARK) right++;
  return { w, h, top, bottom, left, right };
}

/* EVERY shop photo, not just the ig- ones. The reel covers were the obvious
   offenders, but car-d100-truck.jpg is letterboxed too and it was the hero of
   the quote page — a rule that covers all of them beats a special case that
   covers the ten I happened to look at. */
const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(jpe?g|png)$/i.test(f) && fs.statSync(path.join(dir, f)).isFile());

let fixed = 0;
for (const f of files) {
  const file = path.join(dir, f);
  const b = await bars(file);
  // 2px of slack: a compression-dark edge row is not a letterbox.
  const total = b.top + b.bottom + b.left + b.right;
  if (total <= 4) continue;

  const width = b.w - b.left - b.right;
  const height = b.h - b.top - b.bottom;
  console.log(
    `${f.padEnd(46)} ${b.w}x${b.h} -> ${width}x${height}  (T${b.top} B${b.bottom} L${b.left} R${b.right})`,
  );
  if (check) continue;

  fs.mkdirSync(backup, { recursive: true });
  const kept = path.join(backup, f);
  if (!fs.existsSync(kept)) fs.copyFileSync(file, kept);

  // Read from the BACKUP so re-running is idempotent rather than compounding.
  // Encode back into the SAME format as the extension promises, and land it
  // via a temp file — sharp can still hold the source handle when the input
  // and output paths are the same directory on Windows.
  const png = /\.png$/i.test(f);
  const pipeline = sharp(kept).extract({ left: b.left, top: b.top, width, height });
  const out = await (png
    ? pipeline.png({ compressionLevel: 9 }).toBuffer()
    : pipeline.jpeg({ quality: 90, mozjpeg: true }).toBuffer());
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, out);
  fs.renameSync(tmp, file);
  fixed++;
}

console.log(check ? "\n(check only)" : `\ntrimmed ${fixed} file(s); originals in public/shop/_orig-ig/`);
