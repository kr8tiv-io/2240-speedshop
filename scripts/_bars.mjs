import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
const dir = "C:/Users/lucid/Desktop/2240-v-dark/public/shop";
const files = fs.readdirSync(dir).filter((f) => f.startsWith("ig-") && /\.(jpe?g|png)$/i.test(f));
for (const f of files) {
  const p = path.join(dir, f);
  const img = sharp(p);
  const meta = await img.metadata();
  const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const rowLum = (y) => {
    let s = 0;
    for (let x = 0; x < w; x++) { const i = (y * w + x) * c; s += (data[i] + data[i + 1] + data[i + 2]) / 3; }
    return s / w;
  };
  const colLum = (x) => {
    let s = 0;
    for (let y = 0; y < h; y++) { const i = (y * w + x) * c; s += (data[i] + data[i + 1] + data[i + 2]) / 3; }
    return s / h;
  };
  let top = 0, bot = 0, left = 0, right = 0;
  while (top < h / 2 && rowLum(top) < 14) top++;
  while (bot < h / 2 && rowLum(h - 1 - bot) < 14) bot++;
  while (left < w / 2 && colLum(left) < 14) left++;
  while (right < w / 2 && colLum(w - 1 - right) < 14) right++;
  const bars = top + bot + left + right;
  console.log(`${f.padEnd(46)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ar ${(meta.width/meta.height).toFixed(2)}  bars T${top} B${bot} L${left} R${right}${bars > 3 ? "  <-- LETTERBOXED" : ""}`);
}
