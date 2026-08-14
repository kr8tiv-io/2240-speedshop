import type { NextConfig } from "next";
import modelVersion from "./scripts/model-version.js";

/* The walk-through's model shelves are content-addressed by directory:
   `/models-opt-a1b2c3d4/`. Computed here so the build and
   `scripts/prepare-deploy.js` cannot disagree — the loader's URLs and the
   directory names on the host come from one hash of the same bytes. See
   scripts/model-version.js for what went wrong without it.
   DEPLOY BUILDS ONLY: in dev (and non-export builds) the shelves sit at their
   plain paths — nothing renames the directories, so a stamped URL is a
   guaranteed 404 and the walk-through plays to an empty room. */
const MODELS_VERSION = process.env.EXPORT ? modelVersion() : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_MODELS_VERSION: MODELS_VERSION },
  // `EXPORT=1 next build` produces a fully static `out/` for dumb hosts
  // (Hostinger shared, any Apache/nginx). Unset, the build stays a normal
  // Node target for the VPS. The site is 100% SSG either way; export only
  // changes packaging. Images ship unoptimized in export mode because there
  // is no server to resize them — sources are already web-sized.
  ...(process.env.EXPORT
    ? {
        output: "export" as const,
        trailingSlash: true,
        // A custom loader rather than `unoptimized`: next/image ignores
        // basePath on exported src, so subfolder deploys 404 every photo.
        // The loader re-adds the prefix and does no resizing (no server).
        images: { loader: "custom" as const, loaderFile: "./lib/image-loader.ts" },
        // BASEPATH=/2240 roots the whole export under a subfolder, so the
        // preview can live at evolveecoblasting.com/2240/ without touching DNS.
        ...(process.env.BASEPATH ? { basePath: process.env.BASEPATH } : {}),
      }
    : {}),
};

export default nextConfig;
