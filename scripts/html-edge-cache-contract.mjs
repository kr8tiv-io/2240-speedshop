import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const htaccess = await readFile(new URL("../public/.htaccess", import.meta.url), "utf8");

assert.match(
  htaccess,
  /Cache-Control "public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=86400, must-revalidate"/,
  "Browsers must revalidate HTML while Hostinger may serve a brief, resilient edge copy.",
);

console.log("HTML edge cache contract: PASS");
