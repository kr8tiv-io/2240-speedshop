import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [layout, css, preloader, cinema] = await Promise.all([
  readFile(new URL("app/layout.tsx", root), "utf8"),
  readFile(new URL("app/globals.css", root), "utf8"),
  readFile(new URL("components/home/Preloader.tsx", root), "utf8"),
  readFile(new URL("components/home/HomeCinema.tsx", root), "utf8"),
]);

function constant(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*([\\d_]+)`));
  assert.ok(match, `${name} must be a named, auditable constant`);
  return Number(match[1].replaceAll("_", ""));
}

assert.match(layout, /import \{[^}]*Instrument_Serif[^}]*\} from "next\/font\/google"/);
assert.doesNotMatch(layout, /Bodoni_Moda/, "The rejected Bodoni face must leave the payload.");
assert.match(layout, /const instrumentSerif = Instrument_Serif\(\{[\s\S]*weight: "400"/);
assert.match(layout, /style: "italic"/);
assert.match(layout, /variable: "--font-instrument-serif"/);
assert.match(css, /--font-serif:\s*var\(--font-instrument-serif\)/);

const ceiling = constant(preloader, "PROGRESSIVE_CEILING_MS");
const ignition = constant(preloader, "IGNITION_MS");
const exit = constant(preloader, "EXIT_MS");
assert.ok(ceiling <= 800, `Opening plate ceiling is still ${ceiling} ms.`);
assert.ok(
  ceiling + ignition + exit <= 1_250,
  `Opening choreography still occupies ${ceiling + ignition + exit} ms.`,
);

const mobileGrace = constant(cinema, "MOBILE_RUNTIME_GRACE_MS");
const idleTimeout = constant(cinema, "RUNTIME_IDLE_TIMEOUT_MS");
assert.ok(mobileGrace <= 900, `Mobile hero waits ${mobileGrace} ms after the plate.`);
assert.ok(idleTimeout <= 500, `Idle scheduling can wait another ${idleTimeout} ms.`);
assert.match(
  cinema,
  /if \(!ready \|\| runtimeAllowed \|\| uiOverlay !== null\) return/,
  "Opening navigation must continue to outrank WebGL startup.",
);

console.log("designer type and opening-speed contract: PASS");

