import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle, adjacentArticles } from "@/lib/blog/registry";
import { blogPostingSchema } from "@/lib/blog/schema";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const { meta } = article;
  return {
    title: meta.metaTitle,
    description: meta.description,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      type: "article",
      title: meta.metaTitle,
      description: meta.description,
      url: `/blog/${meta.slug}`,
      publishedTime: meta.datePublished,
      modifiedTime: meta.dateModified,
      authors: [meta.author],
    },
  };
}

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
const fmtDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));

/** The H1 with its one Bodoni italic word. `accent` must appear verbatim in
 *  `title`; if it does not, the title renders unaccented rather than wrong. */
function AccentedTitle({ title, accent }: { title: string; accent?: string }) {
  const i = accent ? title.indexOf(accent) : -1;
  if (!accent || i === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <em className="accent-serif">{accent}</em>
      {title.slice(i + accent.length)}
    </>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const { meta, Body, Illustration } = article;
  const { prev, next } = adjacentArticles(meta.slug);

  return (
    <article>
      <JsonLd data={blogPostingSchema(meta)} />
      <JsonLd data={faqSchema(meta.faq)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blog" },
          { name: meta.title, path: `/blog/${meta.slug}` },
        ])}
      />

      {/* ═ HEADER ═ */}
      <header className="px-5 pt-10 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-widest text-steel">
            <Link href="/" className="hover:text-bone">
              Home
            </Link>
            <span aria-hidden="true" className="px-2 text-tungsten/50">
              /
            </span>
            <Link href="/blog" className="hover:text-bone">
              Journal
            </Link>
            <span aria-hidden="true" className="px-2 text-tungsten/50">
              /
            </span>
            <span className="text-tungsten">{meta.category}</span>
          </nav>

          <p className="corner-note mt-10 text-tungsten">
            FROM THE SHOP FLOOR · {meta.category.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.1rem,5.4vw,4.2rem)] uppercase leading-[0.95] tracking-wide text-bone">
            <AccentedTitle title={meta.title} accent={meta.accent} />
          </h1>

          {/* standfirst */}
          <p className="mt-7 max-w-2xl font-body text-lg leading-relaxed text-bone/90">
            {meta.description}
          </p>

          {/* byline instrument strip */}
          <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y border-rust/50 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
            <span className="text-bone">{meta.author}</span>
            <span aria-hidden="true" className="text-tungsten/50">
              ·
            </span>
            <span>{fmtDate(meta.datePublished)}</span>
            <span aria-hidden="true" className="text-tungsten/50">
              ·
            </span>
            <span>{meta.readingMinutes} min read</span>
            {meta.dateModified !== meta.datePublished && (
              <>
                <span aria-hidden="true" className="text-tungsten/50">
                  ·
                </span>
                <span>Updated {fmtDate(meta.dateModified)}</span>
              </>
            )}
          </div>
          <p className="mt-3 font-mono text-[11px] text-steel/60">
            Written on the shop floor at {site.street}, {site.city}.
          </p>
        </div>
      </header>

      {/* ═ HERO ILLUSTRATION ═ */}
      <div className="px-5 pt-12 sm:px-8">
        <div className="journal-illo mx-auto max-w-6xl">
          <div className="grain" aria-hidden="true" />
          <Illustration />
        </div>
      </div>

      {/* ═ BODY ═ */}
      <div className="px-5 pt-4 sm:px-8">
        <div className="prose-dark mx-auto max-w-6xl py-10 sm:py-14">
          <Body />
        </div>
      </div>

      {/* ═ FAQ — visible text is the FAQPage schema, verbatim. ═ */}
      <section aria-labelledby="article-faq" className="px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="weld" aria-hidden="true" />
          <h2
            id="article-faq"
            className="mt-14 font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl"
          >
            Asked on every job like this one
          </h2>
          <dl className="mt-8 space-y-8">
            {meta.faq.map((f) => (
              <div key={f.q} className="border-l border-rust/40 pl-5">
                <dt className="font-sub text-sm uppercase tracking-[0.12em] text-bone">{f.q}</dt>
                <dd className="mt-3 leading-relaxed text-steel">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═ SOURCES ═ */}
      <section aria-labelledby="article-sources" className="px-5 pb-4 pt-14 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 id="article-sources" className="corner-note text-tungsten">
            SOURCES
          </h2>
          <ol className="mt-5 space-y-3">
            {meta.citations.map((c, i) => (
              <li
                key={c.url}
                id={`src-${i + 1}`}
                className="flex gap-4 font-mono text-[12px] leading-relaxed text-steel"
              >
                <span className="shrink-0 text-tungsten/70">[{String(i + 1).padStart(2, "0")}]</span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener"
                  className="underline decoration-tungsten/30 underline-offset-4 transition-colors hover:text-bone"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-5 font-mono text-[11px] text-steel/60">
            Dollar figures in this article are typical planning ranges in CAD, not quotes.
          </p>
        </div>
      </section>

      {/* ═ PREV / NEXT ═ */}
      <nav aria-label="More from the Journal" className="px-5 pt-14 sm:px-8">
        <div className="mx-auto grid max-w-4xl gap-px border-y border-rust/50 sm:grid-cols-2">
          {prev ? (
            <Link href={`/blog/${prev.meta.slug}`} className="backlit group !bg-transparent px-2 py-6 sm:pr-8">
              <p className="corner-note">← PREVIOUS ENTRY</p>
              <p className="mt-3 font-display text-xl uppercase leading-tight tracking-wide text-bone transition-colors group-hover:text-ember">
                {prev.meta.title}
              </p>
            </Link>
          ) : (
            <div aria-hidden="true" className="hidden px-2 py-6 sm:block" />
          )}
          {next ? (
            <Link
              href={`/blog/${next.meta.slug}`}
              className="backlit group !bg-transparent px-2 py-6 sm:pl-8 sm:text-right"
            >
              <p className="corner-note">NEXT ENTRY →</p>
              <p className="mt-3 font-display text-xl uppercase leading-tight tracking-wide text-bone transition-colors group-hover:text-ember">
                {next.meta.title}
              </p>
            </Link>
          ) : (
            <div aria-hidden="true" className="hidden px-2 py-6 sm:block" />
          )}
        </div>
      </nav>

      {/* ═ CTA — the roll-up door. ═ */}
      <section className="mt-20 border-y border-tungsten/40 bg-panel/50">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
              Got one like this in the garage?
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-steel">
              Photos in, honest scope out — including the honest no when the car deserves it. Two
              business days.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/quote" className="cta">
              Start your build
            </Link>
            <a href={`tel:${site.phone}`} className="cta cta-ghost">
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
