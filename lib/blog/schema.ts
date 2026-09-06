import { canonicalPageUrl, site } from "@/lib/site";
import type { Article, ArticleMeta } from "./types";

/**
 * Journal JSON-LD builders. FAQPage and BreadcrumbList come from the existing
 * lib/schema.tsx helpers; these cover the blog-specific nodes.
 *
 * NOTE: the site's business entity is `${site.url}/#shop` (see lib/schema.tsx
 * businessSchema). Every publisher/author reference here points at that node
 * so the graph stays one connected entity — do not invent a second @id.
 */

const BUSINESS_ID = `${site.url}/#shop`;
const BLOG_ID = `${canonicalPageUrl("/blog")}#blog`;

/** Publisher stays the shop entity; BlogPosting author points at Terry Harmider's Person @id. */
const shopRef = { "@id": BUSINESS_ID };

export function blogSchema(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    name: "The Shop Journal",
    description: "Long-form articles from the 2240 Speed Shop floor in Edmonton — restomods, revivals, restoration money, and what this work actually involves.",
    url: canonicalPageUrl("/blog"),
    inLanguage: "en-CA",
    publisher: shopRef,
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      "@id": `${canonicalPageUrl(`/blog/${a.meta.slug}`)}#article`,
      headline: a.meta.title,
      url: canonicalPageUrl(`/blog/${a.meta.slug}`),
      datePublished: a.meta.datePublished,
      dateModified: a.meta.dateModified,
    })),
  };
}

export function blogPostingSchema(meta: ArticleMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalPageUrl(`/blog/${meta.slug}`)}#article`,
    headline: meta.title,
    description: meta.description,
    image: `${site.url}/shop/IMG_1949-blue-pickup.png`,
    url: canonicalPageUrl(`/blog/${meta.slug}`),
    mainEntityOfPage: canonicalPageUrl(`/blog/${meta.slug}`),
    isPartOf: { "@id": BLOG_ID },
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    author: {
      "@type": "Person",
      "@id": `${canonicalPageUrl("/about")}#terry-harmider`,
      name: site.owner,
    },
    publisher: shopRef,
    articleSection: meta.category,
    keywords: meta.targetKeywords.join(", "),
    timeRequired: `PT${meta.readingMinutes}M`,
    inLanguage: "en-CA",
    citation: meta.citations.map((c) => ({
      "@type": "CreativeWork",
      name: c.name,
      url: c.url,
    })),
  };
}
