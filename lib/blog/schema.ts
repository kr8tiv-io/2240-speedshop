import { site } from "@/lib/site";
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
const BLOG_ID = `${site.url}/blog#blog`;

/** The shop as author/publisher. The byline reads "2240 Speed Shop" — the
 *  organization, not an invented staff writer. */
const shopRef = { "@id": BUSINESS_ID };

export function blogSchema(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    name: "The Shop Journal",
    description:
      "Long-form articles from the 2240 Speed Shop floor in Edmonton — restomods, revivals, restoration money, and what this work actually involves.",
    url: `${site.url}/blog`,
    inLanguage: "en-CA",
    publisher: shopRef,
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      "@id": `${site.url}/blog/${a.meta.slug}#article`,
      headline: a.meta.title,
      url: `${site.url}/blog/${a.meta.slug}`,
      datePublished: a.meta.datePublished,
      dateModified: a.meta.dateModified,
    })),
  };
}

export function blogPostingSchema(meta: ArticleMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${site.url}/blog/${meta.slug}#article`,
    headline: meta.title,
    description: meta.description,
    url: `${site.url}/blog/${meta.slug}`,
    mainEntityOfPage: `${site.url}/blog/${meta.slug}`,
    isPartOf: { "@id": BLOG_ID },
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    author: {
      "@type": "Organization",
      "@id": BUSINESS_ID,
      name: meta.author,
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
