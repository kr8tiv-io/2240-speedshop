/**
 * Trim the static export down to what the site actually fetches.
 *
 *   node scripts/prepare-deploy.js
 *
 * `public/models/` is the 140 MB authoring library — 105 raw .glb files kept in
 * the repo so the compression pipeline can be re-run against the originals.
 * Nothing on the site ever requests one: every fetch goes to `models-opt/`.
 * Next copies all of `public/` into `out/` regardless, so it comes out here.
 */
const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "..", "out");
const DROP = ["models"];

const mb = (dir) => {
  let total = 0;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else total += fs.statSync(full).size;
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return total / 1048576;
};

if (!fs.existsSync(OUT)) {
  console.error("no out/ — run `EXPORT=1 next build` first");
  process.exit(1);
}

for (const name of DROP) {
  const dir = path.join(OUT, name);
  if (!fs.existsSync(dir)) continue;
  const size = mb(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`dropped out/${name}  (${size.toFixed(1)} MB)`);
}

if (!fs.existsSync(path.join(OUT, ".htaccess"))) {
  console.warn("WARNING: out/.htaccess missing — compression and cache headers will not ship");
}

console.log(`export is ${mb(OUT).toFixed(1)} MB`);
