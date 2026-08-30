import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import jpegtran from "jpegtran-bin";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const source = fileURLToPath(new URL("public/shop/IMG_0434-black-muscle-car.jpeg", root));
const crops = [
  {
    label: "desktop",
    geometry: "1920x1216+0+672",
    width: 1920,
    height: 1216,
    output: fileURLToPath(new URL("public/shop/hero-still-desktop.jpg", root)),
  },
  {
    label: "mobile",
    geometry: "1184x2560+368+0",
    width: 1184,
    height: 2560,
    output: fileURLToPath(new URL("public/shop/hero-still-mobile.jpg", root)),
  },
];

function runJpegtran(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(jpegtran, args, {
      cwd: dirname(jpegtran),
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`jpegtran exited with status ${code}`));
    });
  });
}

for (const crop of crops) {
  await mkdir(dirname(crop.output), { recursive: true });
  /* Both rectangles are JPEG MCU-aligned. The desktop envelope includes
     eight extra original pixels above and below the approved 16:10 view;
     object-cover trims those exact edges in the browser. jpegtran can then
     copy the original DCT coefficients instead of decoding/re-encoding. */
  await runJpegtran([
    "-copy",
    "none",
    "-perfect",
    "-crop",
    crop.geometry,
    "-outfile",
    crop.output,
    source,
  ]);

  const metadata = await sharp(crop.output).metadata();
  if (metadata.width !== crop.width || metadata.height !== crop.height) {
    throw new Error(
      `${crop.label} crop is ${metadata.width}x${metadata.height}; expected ${crop.width}x${crop.height}`,
    );
  }
  console.log(`${crop.label}: ${metadata.width}x${metadata.height}`);
}

console.log("lossless hero stills: generated");
