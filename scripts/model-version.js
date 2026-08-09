/**
 * A content hash of the two shipped model shelves.
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

function modelVersion() {
  const hash = crypto.createHash("sha1");
  let counted = 0;
  for (const shelf of SHELVES) {
    const dir = path.join(ROOT, "public", shelf);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".glb")) continue; // the .br twin is derived from it
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

module.exports = modelVersion;
module.exports.SHELVES = SHELVES;

if (require.main === module) process.stdout.write(modelVersion());
