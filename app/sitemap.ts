import type { MetadataRoute } from "next";
import { canonicalPageUrl, services, areas } from "@/lib/site";
import { builds } from "@/lib/builds";
import { articles } from "@/lib/blog/registry";

// Metadata routes must declare staticness explicitly under `output: export`.
export const dynamic = "force-static";

/**
 * Build case-study slugs come straight from lib/builds.ts — the same array
 * that drives generateStaticParams — so every URL emitted here resolves.
 * (A previous hand-maintained list had drifted and emitted 404s.)
 */
const buildSlugs = builds.map((b) => b.slug);

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  // Only dated editorial content has an authoritative modification date.
  // A rebuild alone is not a significant update to these pages.
  const url = canonicalPageUrl;

  const home: Entry = {
    url: url("/"),
    changeFrequency: "weekly",
    priority: 1,
  };

  // Money pages — the six service pillars each own one keyword cluster.
  const serviceHub: Entry = {
    url: url("/services"),
    changeFrequency: "monthly",
    priority: 0.9,
  };

  const servicePages: Entry[] = services.map((s) => ({
    url: url(`/services/${s.slug}`),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Conversion.
  const quote: Entry = {
    url: url("/quote"),
    changeFrequency: "monthly",
    priority: 0.9,
  };

  // Proof layer — build case studies, one vehicle keyword each.
  const buildsHub: Entry = {
    url: url("/builds"),
    changeFrequency: "weekly",
    priority: 0.8,
  };

  const buildPages: Entry[] = buildSlugs.map((slug) => ({
    url: url(`/builds/${slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Local hub + suburbs.
  const edmontonHub: Entry = {
    url: url("/edmonton"),
    changeFrequency: "monthly",
    priority: 0.8,
  };

  const areaPages: Entry[] = areas.map((a) => ({
    url: url(`/edmonton/${a.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Informational layer — three pillar hubs.
  const guidesHub: Entry = {
    url: url("/guides"),
    changeFrequency: "weekly",
    priority: 0.7,
  };

  const guidePages: Entry[] = ["costs", "alberta-laws", "winter"].map((slug) => ({
    url: url(`/guides/${slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // The Shop Journal — editorial layer.
  const blogHub: Entry = {
    url: url("/blog"),
    changeFrequency: "weekly",
    priority: 0.7,
  };

  const blogPages: Entry[] = articles.map((a) => ({
    url: url(`/blog/${a.meta.slug}`),
    lastModified: new Date(`${a.meta.dateModified}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Trust and contact.
  const support: Entry[] = [
    { url: url("/faq"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/reviews"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    home,
    serviceHub,
    ...servicePages,
    quote,
    buildsHub,
    ...buildPages,
    edmontonHub,
    ...areaPages,
    guidesHub,
    ...guidePages,
    blogHub,
    ...blogPages,
    ...support,
  ];
}
