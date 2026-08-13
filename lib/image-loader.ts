/**
 * Custom image loader for the static export.
 *
 * `next/image` does NOT prefix `basePath` onto its `src` in an exported build,
 * so every photo 404s when the site is served from a subfolder (the
 * evolveecoblasting.com/2240/ preview). There is no server to resize against
 * either, so this loader does the one job that is actually needed: hand back
 * the path with the deploy prefix on it. Sources are already web-sized.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return src.startsWith("/") ? `${prefix}${src}` : src;
}
