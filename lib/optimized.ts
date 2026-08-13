/**
 * Map an original /shop/ photo path to its generated WebP variant in
 * /shop/opt/ (scripts/optimize-images.mjs). Non-/shop/ paths pass through.
 */
export function opt(src: string, width: 800 | 1600 = 1600): string {
  const match = src.match(/^\/shop\/([^/]+)\.(jpe?g|png|webp)$/i);
  if (!match) return src;
  return `/shop/opt/${match[1]}-${width}.webp`;
}

export function optSrcSet(src: string): string {
  return `${opt(src, 800)} 800w, ${opt(src, 1600)} 1600w`;
}
