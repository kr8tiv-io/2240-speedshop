/**
 * Trim the static export down to what the site actually fetches.
 *
 *   node scripts/prepare-deploy.js
 *
 * `public/models/` is the 140 MB authoring library — 105 raw .glb files kept in
 * the repo so the compression pipeline can be re-run against the originals.
 * `public/models-refined/` is the Blender pass over that library, and is an
 * INTERMEDIATE: `compress-models.js` reads it, the site never does.
 * Nothing on the site ever requests either one: every fetch goes to `models-opt/`
 * or `models-mobile/`. Next copies all of `public/` into `out/` regardless, so
 * both come out here.
 *
 * This list is the only thing standing between an authoring directory and the
 * host. Adding `models-refined/` without adding it here took one export from
 * 62 MB to 211 MB — nothing visibly broke, which is exactly why it needs to be
 * checked rather than noticed.
 */
const fs = require("fs");
const path = require("path");

const modelVersion = require("./model-version.js");

const OUT = path.resolve(__dirname, "..", "out");
const VERSION = modelVersion();
/* COMBINED-SITE DIFFERENCE: the hero film (components/home/HeroScene.tsx)
   fetches /models/hero/*.glb at runtime, so out/models cannot be dropped
   wholesale the way the speedshop build did. The authoring .glb files at the
   top of out/models ARE dead weight (the walk-through fetches only the
   models-opt / models-mobile shelves) — prune them, keep hero/. */
const DROP = ["models-refined"];
/* What the site is actually allowed to fetch. Anything else under out/ that
   looks like a model shelf is an authoring or intermediate directory that
   should have been dropped — say so loudly rather than shipping it. */
const SHIPPED = new Set(
  VERSION
    ? [`models-opt-${VERSION}`, `models-mobile-${VERSION}`, "models"]
    : ["models-opt", "models-mobile", "models"],
);

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

/* Prune out/models to the hero shelf: everything at its top level is the
   authoring library the site never requests. */
const MODELS = path.join(OUT, "models");
if (fs.existsSync(MODELS)) {
  let pruned = 0;
  for (const entry of fs.readdirSync(MODELS, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name === "hero") continue;
    const full = path.join(MODELS, entry.name);
    pruned += entry.isDirectory() ? mb(full) : fs.statSync(full).size / 1048576;
    fs.rmSync(full, { recursive: true, force: true });
  }
  console.log(`pruned out/models to hero/  (${pruned.toFixed(1)} MB removed)`);
}

/* Stamp the shelves with the same hash the build compiled into the loader's
   URLs, so a model's URL changes exactly when its bytes do. Both names come from
   `model-version.js` reading the same files — they cannot drift apart. */
if (VERSION) {
  for (const shelf of modelVersion.SHELVES) {
    const from = path.join(OUT, shelf);
    const to = path.join(OUT, `${shelf}-${VERSION}`);
    if (!fs.existsSync(from)) continue;
    fs.rmSync(to, { recursive: true, force: true });
    fs.renameSync(from, to);
    console.log(`stamped out/${shelf} → ${shelf}-${VERSION}`);
  }
}

if (!fs.existsSync(path.join(OUT, ".htaccess"))) {
  console.warn("WARNING: out/.htaccess missing — compression and cache headers will not ship");
}

for (const entry of fs.readdirSync(OUT, { withFileTypes: true })) {
  if (!entry.isDirectory() || !/^models/.test(entry.name) || SHIPPED.has(entry.name)) continue;
  console.warn(
    `WARNING: out/${entry.name} is ${mb(path.join(OUT, entry.name)).toFixed(1)} MB and is not a shipped ` +
      `shelf — add it to DROP in this script.`,
  );
}

console.log(`export is ${mb(OUT).toFixed(1)} MB`);
