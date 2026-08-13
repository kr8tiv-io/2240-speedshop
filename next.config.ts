import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
