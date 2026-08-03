import type { MetadataRoute } from "next";
import { site, services, areas } from "@/lib/site";

/**
 * Build case-study slugs.
 * Keep this array in sync with the directories under `app/builds/`.
 * Every URL emitted here must resolve — a sitemap that lists a 404 is worse
 * than a sitemap that omits a page.
 */
const buildSlugs = [
  "1960s-dodge-d100",
  "black-muscle-car",
  "blue-pickup",
  "red-pickup-texaco",
  "mission-black-classic",
] as const;

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const home: Entry = {
    url: url("/"),
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
  };

  // Money pages — the six service pillars each own one keyword cluster.
  const serviceHub: Entry = {
    url: url("/services"),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  };

  const servicePages: Entry[] = services.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Conversion.
  const quote: Entry = {
    url: url("/quote"),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  };

  // Proof layer — build case studies, one vehicle keyword each.
  const buildsHub: Entry = {
    url: url("/builds"),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  };

  const buildPages: Entry[] = buildSlugs.map((slug) => ({
    url: url(`/builds/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Local hub + suburbs.
  const edmontonHub: Entry = {
    url: url("/edmonton"),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  };

  const areaPages: Entry[] = areas.map((a) => ({
    url: url(`/edmonton/${a.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Informational layer — three pillar hubs.
  const guidesHub: Entry = {
    url: url("/guides"),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  };

  const guidePages: Entry[] = ["costs", "alberta-laws", "winter"].map((slug) => ({
    url: url(`/guides/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Trust and contact.
  const support: Entry[] = [
    { url: url("/faq"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/contact"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/reviews"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/about"), lastModified, changeFrequency: "yearly", priority: 0.6 },
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
    ...support,
  ];
}
