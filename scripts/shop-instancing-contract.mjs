import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const hardware = await readFile(
  new URL("../components/shop/Hardware.tsx", import.meta.url),
  "utf8",
);
const stations = await readFile(
  new URL("../components/shop/Stations.tsx", import.meta.url),
  "utf8",
);
const liftColumn = hardware.slice(
  hardware.indexOf("function LiftColumn"),
  hardware.indexOf("export function TwoPostLift"),
);
const doorway = stations.slice(
  stations.indexOf("export function StationDoorway"),
  stations.indexOf("export function StationHoist"),
);

assert.ok(
  /function LiftLockLadder/.test(hardware) &&
    /buildInstances\([\s\S]*Array\.from\(\{ length: 11 \}/.test(hardware),
  "Every lift lock ladder must preserve its eleven notches in one instanced draw.",
);
assert.ok(
  /<LiftLockLadder side=\{side\} \/>/.test(liftColumn) &&
    !/Array\.from\(\{ length: 11 \}/.test(liftColumn),
  "Lift columns may not submit eleven separate notch meshes.",
);
assert.ok(
  /const doorSlats = useMemo\([\s\S]*buildInstances\([\s\S]*length: 9/.test(doorway) &&
    /<primitive object=\{doorSlats\}/.test(doorway),
  "The nine visually identical roll-up slats must share one instanced draw.",
);

console.log("shop instancing contract: PASS");
