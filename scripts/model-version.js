/**
 * Content hashes for every shipped model shelf.
 *
 *   node scripts/model-version.js        prints the hash
 *   require(...)()                       returns it
 *
 * WHY THE MODEL DIRECTORIES ARE VERSIONED
 *
 * Model URLs were fixed while their CONTENTS changed every deploy, and the host
 * caches them for thirty days. Measured live, straight after a deploy:
 *
 *   /models-mobile/car-dodge-charger.glb.br   ->  94 kB, `age: 2551`
 *   the same file on disk                     ->  43 kB
 *
 * The edge was serving the PREVIOUS build's geometry, and would have gone on
 * doing so for a month. That is not a stale optimisation — the loader asks for
 * the `.glb.br` twin by name, so visitors were being handed the old faceted cars
 * with a 200 and no error anywhere. Worse, our own `.htaccess` caused it:
 * `AddType model/gltf-binary .br` puts the twins under
 * `ExpiresByType model/gltf-binary "access plus 1 month"`.
 *
 * A query string cannot fix it — the loader gates the twin on
 * `url.endsWith(".glb")`, so `?v=` silently disables brotli for all 71 files.
 * So the DIRECTORY carries the version: `/models-opt-a1b2c3d4/`. The URL becomes
 * content-addressed, `immutable` becomes true rather than aspirational, and a
 * changed model cannot be served from a cache keyed on the old name.
 *
 * The hash covers file names and bytes, so a build that does not change a model
 * keeps the same directory and produces no deploy churn.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const SHELVES = ["models-opt", "models-mobile"];
const HERO_SHELF = "models/hero";

function contentVersion(shelves) {
  const hash = crypto.createHash("sha1");
  let counted = 0;
  for (const shelf of shelves) {
    const dir = path.join(ROOT, "public", shelf);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      // The transport twin is content too: an encoder/quality improvement must
      // receive a fresh immutable URL even when the raw GLB is unchanged.
      if (!name.endsWith(".glb") && !name.endsWith(".glb.br")) continue;
      hash.update(shelf);
      hash.update(name);
      hash.update(fs.readFileSync(path.join(dir, name)));
      counted++;
    }
  }
  // No shelves means a source checkout without built models; an empty version
  // keeps the unversioned paths working rather than inventing a wrong one.
  return counted ? hash.digest("hex").slice(0, 8) : "";
}

function modelVersion() {
  return contentVersion(SHELVES);
}

/* Keep the three hero cars on their own hash. A refined hero should invalidate
   only ~333 kB of film assets, not force returning visitors to refetch both
   71-model walk-through shelves. */
function heroVersion() {
  return contentVersion([HERO_SHELF]);
}

/** Browser/CDN-safe version for the shipped shop photography tree. Query
 * versioning is appropriate here (unlike `.glb`, whose `.endsWith()` transport
 * gate requires the extension to remain last). */
function shopVersion() {
  const root = path.join(ROOT, "public", "shop");
  if (!fs.existsSync(root)) return "";
  const hash = crypto.createHash("sha1");
  let counted = 0;

  const walk = (dir, prefix = "") => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (relative.startsWith("_orig-letterboxed/") || relative.startsWith("_orig-ig/")) continue;
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(absolute, relative);
      else if (entry.isFile()) {
        hash.update(relative);
        hash.update(fs.readFileSync(absolute));
        counted += 1;
      }
    }
  };

  walk(root);
  return counted ? hash.digest("hex").slice(0, 8) : "";
}

module.exports = modelVersion;
module.exports.SHELVES = SHELVES;
module.exports.heroVersion = heroVersion;
module.exports.shopVersion = shopVersion;

if (require.main === module) process.stdout.write(modelVersion());
