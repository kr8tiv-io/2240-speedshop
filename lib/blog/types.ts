import type { ComponentType } from "react";

/**
 * THE SHOP JOURNAL — article contract.
 *
 * Each article is ONE self-contained file in `lib/blog/articles/` that exports
 * exactly three named members:
 *
 *   export const meta: ArticleMeta = { ... };
 *   export function Illustration() { ... }   // bespoke inline SVG, hero
 *   export function Body() { ... }           // the article, semantic TSX
 *
 * Register it with one import line + one array entry in `lib/blog/registry.ts`.
 * The template (`app/blog/[slug]/page.tsx`) renders everything else: header,
 * byline strip, hero illustration, sources list, FAQ block, JSON-LD, prev/next.
 *
 * BODY AUTHORING RULES (enforced by the `.prose-dark` styles in globals.css):
 * - Semantic HTML only inside <Body/>: <p>, <h2> (question-form), <h3>, <ul>,
 *   <ol>, <blockquote> (pull-quotes, optional <footer> attribution),
 *   <strong>, <Link> for internal links, <a> only for inline citation refs.
 * - First paragraph answers the title question in 40–60 words. It is what
 *   answer engines lift.
 * - Comparison tables: wrap in <div className="table-bleed"> … full-bleed
 *   treatment, mono headers, tungsten rules come free. Use <th scope="col">
 *   in <thead>, <th scope="row"> for row leads, className="num" on money
 *   cells. Include a <caption className="sr-only">.
 * - Key figures: <div className="stat-plate"> with children
 *   <div><span className="stat-v">$80K+</span><span className="stat-l">label
 *   </span></div>. Every dollar figure is a labelled typical range in CAD,
 *   never a firm price.
 * - Inline citation refs: <a href="#src-1" className="cite-ref">[1]</a> —
 *   numbers match the order of `meta.citations`. The template renders the
 *   matching SOURCES list with ids src-1, src-2, …
 * - Do NOT render the FAQ inside <Body/>. It lives in `meta.faq` and the
 *   template prints it verbatim, which is what keeps the visible text and the
 *   FAQPage JSON-LD in exact agreement.
 */

/** One Q&A pair. Rendered verbatim on the page AND serialized into FAQPage
 *  JSON-LD by the template — never edit one side alone. */
export type FaqPair = { q: string; a: string };

/** External source. Only include URLs verified to exist and to support the
 *  claim they back. Authority citations get plain rel="noopener" — no
 *  nofollow. */
export type Citation = { name: string; url: string };

export type ArticleMeta = {
  /** URL segment: /blog/<slug>. Kebab-case, matches the file name. */
  slug: string;
  /** The H1, verbatim. */
  title: string;
  /** One word or short phrase that appears verbatim in `title`, rendered as
   *  the Bodoni italic accent inside the Anton headline. */
  accent?: string;
  /** <title> without brand suffix — layout appends "| 2240 Speed Shop". */
  metaTitle: string;
  /** Meta description AND the on-page standfirst. 140–170 chars. */
  description: string;
  /** ISO dates, e.g. "2026-08-12". */
  datePublished: string;
  dateModified: string;
  /** Byline: "2240 Speed Shop". No invented staff writers. */
  author: string;
  /** Mono category eyebrow, e.g. "Restomods", "Revivals". */
  category: string;
  /** The queries this article exists to own. */
  targetKeywords: string[];
  /** 4–5 pairs. Question phrasing people actually search. */
  faq: FaqPair[];
  /** 3–6 verified sources, in the order the body cites them. */
  citations: Citation[];
  /** Internal paths linked from the body — kept here so link audits do not
   *  have to parse TSX. Every entry must resolve on this site. */
  internalLinks: string[];
  /** Honest estimate at ~220 wpm including tables. */
  readingMinutes: number;
};

/** A registered article: meta + the two components the template mounts.
 *  `Illustration` is the heroIllustration component ref. */
export type Article = {
  meta: ArticleMeta;
  Body: ComponentType;
  Illustration: ComponentType;
};

/** What an article module in `lib/blog/articles/` must export. */
export type ArticleModule = {
  meta: ArticleMeta;
  Body: ComponentType;
  Illustration: ComponentType;
};
