import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../app/contact/page.tsx", import.meta.url), "utf8");
assert.doesNotMatch(source, /site\.geo|osmEmbed|osmLink|[?&](?:mlat|mlon|bbox|marker)=/, "Contact maps must not send visitors to the unverified coordinate pin");
assert.match(source, /const addressQuery = encodeURIComponent\([\s\S]*?site\.street[\s\S]*?site\.city[\s\S]*?site\.region[\s\S]*?site\.postalCode/, "All map destinations must use the published shop address");
assert.doesNotMatch(source.match(/const addressQuery = encodeURIComponent\(([\s\S]*?)\);/)?.[1] ?? "", /site\.name/, "Resolve the street address directly, not an unavailable Google business-place card");
assert.ok(source.includes('const mapsEmbed = `https://www.google.com/maps?q=${addressQuery}&output=embed`'), "The embedded map must search the verified address, not invent a coordinate");
assert.ok(source.includes('const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`'), "Directions use Google's documented cross-platform address URL");
assert.match(source, /<iframe[\s\S]*?src=\{mapsEmbed\}[\s\S]*?loading="lazy"[\s\S]*?className="h-\[420px\] w-full border-0 sm:h-\[520px\]"/, "Preserve the lazy-loaded responsive map frame");
assert.match(source, /href=\{mapsDirections\}[\s\S]*?Get directions/, "The directions control must have a real destination and accurate label");
assert.ok(source.includes('href={`https://www.google.com/maps/search/?api=1&query=${addressQuery}`}'), "Keep the direct Google Maps alternative");

console.log("contact map address contract: PASS — verified address query, no guessed pin, directions and responsive frame");
