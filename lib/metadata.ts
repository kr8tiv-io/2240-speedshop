import type { Metadata } from "next";
import { canonicalPageUrl, site } from "./site";

export const socialImage = {
  url: "/social/2240-speed-shop-edmonton-cinematic-v1.png",
  width: 1727,
  height: 911,
  alt: "2240 Speed Shop in Edmonton, Alberta — cinematic black classic muscle car brand artwork",
};

/** Next replaces nested metadata objects instead of merging layout defaults. */
export function withPageMetadata(
  path: string,
  metadata: Metadata & { title: string; description: string },
): Metadata {
  const images = metadata.openGraph?.images ?? [socialImage];
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: canonicalPageUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      title: metadata.title,
      description: metadata.description,
      ...metadata.openGraph,
      url: canonicalPageUrl(path),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images,
      ...metadata.twitter,
    },
  };
}
