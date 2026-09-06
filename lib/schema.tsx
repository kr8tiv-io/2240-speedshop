import { canonicalPageUrl, site, services } from "./site";

const ID = `${site.url}/#shop`;

// AutoRepair with a stable @id so every other node can reference one entity.
// Deliberately no self-serving aggregateRating — per the AI-SEO playbook it
// never earns stars and real review velocity is the actual lever.
export const businessSchema = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "AutomotiveBusiness"],
  "@id": ID,
  name: site.name,
  description: "Classic car restoration, restomods, hot rods and engine swaps in Edmonton, Alberta. Owner-operated by Terry Harmider.",
  image: `${site.url}/shop/IMG_1949-blue-pickup.png`,
  logo: {
    "@type": "ImageObject",
    url: `${site.url}/apple-touch-icon.png`,
    width: 180,
    height: 180,
  },
  url: canonicalPageUrl(),
  telephone: site.phone,
  email: site.email,
  founder: { "@type": "Person", name: site.owner },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.street,
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.postalCode,
    addressCountry: site.country,
  },
  openingHoursSpecification: site.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
  sameAs: site.social,
  knowsAbout: [
    "Classic car restoration",
    "Restomod builds",
    "Hot rod fabrication",
    "LS engine swaps",
    "Diesel conversions",
    "Automotive rust repair",
    "Classic car interior restoration",
    "Carburetor rebuilding",
  ],
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.title,
      description: s.long,
      url: canonicalPageUrl(`/services/${s.slug}`),
      areaServed: { "@type": "City", name: site.city },
      provider: { "@id": ID },
    },
  })),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${canonicalPageUrl()}#website`,
  name: site.name,
  url: canonicalPageUrl(),
  inLanguage: "en-CA",
  publisher: { "@id": ID },
};

export function serviceSchema(s: (typeof services)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.long,
    url: canonicalPageUrl(`/services/${s.slug}`),
    serviceType: s.keyword,
    provider: { "@id": ID },
    areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonicalPageUrl(c.path),
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
