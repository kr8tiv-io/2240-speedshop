/**
 * Brotli every model up front, so the host does not have to.
 *
 *   node scripts/precompress.js
 *
 * The `.htaccess` deliberately excludes .glb from compression on the grounds
 * that it is "already compressed". That is true of the props, whose bytes are
 * nearly all WebP — and completely false of the CARS, which are raw float32
 * geometry with no textures at all. Measured over the set: 16.20 MB → 11.34 MB,
 * and on the one file the opening shot is built around, `car-dodge-charger`,
 * 474 KB → 86 KB. That is the single cheapest win available and it costs the
 * server nothing at request time, because the compressing is done here.
 *
 * Apache/LiteSpeed serves the `.br` twin via a rewrite when the browser says it
 * takes brotli; the plain file stays as the fallback for anything that does not.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.resolve(__dirname, "..");
const DIRS = ["models-opt", "models-mobile"].map((d) => path.join(ROOT, "public", d));

let before = 0;
let after = 0;
let files = 0;

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".glb"))) {
    const source = path.join(dir, name);
    const target = source + ".br";
    const raw = fs.readFileSync(source);
    // Skip if the twin is already current.
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) {
      before += raw.length;
      after += fs.statSync(target).size;
      files++;
      continue;
    }
    const squeezed = zlib.brotliCompressSync(raw, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
      },
    });
    fs.writeFileSync(target, squeezed);
    before += raw.length;
    after += squeezed.length;
    files++;
  }
}

console.log(
  `${files} models · ${(before / 1048576).toFixed(2)} MB → ${(after / 1048576).toFixed(2)} MB brotli` +
    ` (${Math.round((1 - after / before) * 100)}% smaller on the wire)`,
);
