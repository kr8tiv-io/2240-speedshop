import { opt, optSrcSet } from "@/lib/optimized";

/**
 * Plain <img> wired to the generated WebP variants with a real srcSet —
 * identical output in the node build and the static export (no loader
 * involved). Use for above-fold photography; below-fold images can keep
 * next/image pointed at an opt() path.
 */
export function OptImage({
  src,
  alt,
  sizes = "100vw",
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={opt(src, 1600)}
      srcSet={optSrcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}

export default OptImage;
