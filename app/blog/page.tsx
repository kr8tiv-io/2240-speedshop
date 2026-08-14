import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/blog/registry";
import { blogSchema } from "@/lib/blog/schema";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Shop Journal — Articles From the Floor of an Edmonton Speed Shop",
  description:
    "Long-form articles written on the shop floor at 2240 Speed Shop, Edmonton — restomods, barn find revivals, restoration money, and how this work actually gets done.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "The Shop Journal — 2240 Speed Shop, Edmonton",
    description:
      "Restomods, revivals, and restoration money — written on the shop floor, not in a content mill.",
    url: "/blog",
  },
};

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
const fmtDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));

/**
 * The Journal index as an editorial contents page: one featured article set
 * large over its illustration plate, the rest as numbered index rows in the
 * services-row language. No card grid.
 */
export default function BlogIndexPage() {
  const [featured, ...rest] = articles;
  const FeaturedIllustration = featured.Illustration;

  return (
    <div className="px-5 pb-28 pt-10 sm:px-8 sm:pt-16">
      <JsonLd data={blogSchema(articles)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blog" },
        ])}
      />

      <div className="mx-auto max-w-[92rem]">
        {/* MASTHEAD */}
        <header>
          <div className="flex items-baseline justify-between gap-4">
            <p className="corner-note text-tungsten">FROM THE SHOP FLOOR</p>
            <p className="corner-note hidden sm:block">
              NO. {String(articles.length).padStart(2, "0")} ENTRIES · EDMONTON AB
            </p>
          </div>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.85] tracking-wide text-bone">
            The Shop <em className="accent-serif">Journal</em>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-steel">
            What this work actually involves, written by the people doing it. Restomods, barn find
            revivals, and the money questions everyone asks on the phone — answered straight, in
            Canadian dollars, from {`2009 91 Ave NW`}.
          </p>
        </header>

        {/* FEATURED — index entry 01, set large. */}
        <section aria-label="Featured article" className="mt-16">
          <div className="weld" aria-hidden="true" />
          <Link
            href={`/blog/${featured.meta.slug}`}
            className="backlit group mt-px grid !bg-transparent gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
          >
            <div className="journal-illo order-2 lg:order-1">
              <div className="grain" aria-hidden="true" />
              <FeaturedIllustration />
            </div>
            <div className="order-1 lg:order-2">
              <p className="flex flex-wrap items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                <span className="text-tungsten/70">01</span>
                <span className="text-tungsten">{featured.meta.category}</span>
                <span aria-hidden="true" className="text-steel/40">
                  ·
                </span>
                <span className="text-steel/70">{fmtDate(featured.meta.datePublished)}</span>
              </p>
              <h2 className="mt-5 font-display text-3xl uppercase leading-[0.95] tracking-wide text-bone transition-colors group-hover:text-ember sm:text-4xl lg:text-5xl">
                {featured.meta.title}
              </h2>
              <p className="mt-5 max-w-xl font-body text-[15px] leading-relaxed text-steel">
                {featured.meta.description}
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-steel/70">
                {featured.meta.readingMinutes} min read ·{" "}
                <span className="text-tungsten transition-colors group-hover:text-ember">
                  Read the article →
                </span>
              </p>
            </div>
          </Link>
        </section>

        {/* THE INDEX — numbered rows, services-row language. */}
        {rest.length > 0 && (
          <section aria-label="All articles" className="mt-4">
            <ul className="border-t border-rust/60">
              {rest.map((a, i) => (
                <li key={a.meta.slug} className="relative border-b border-rust/40">
                  <Link
                    href={`/blog/${a.meta.slug}`}
                    className="backlit group flex flex-col gap-2 !bg-transparent px-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:px-4 sm:py-7"
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] text-tungsten/70">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-2xl uppercase leading-[1.02] tracking-wide text-bone transition-colors group-hover:text-ember sm:text-3xl lg:text-4xl">
                      {a.meta.title}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-steel/70">
                      {a.meta.category} · {a.meta.readingMinutes} min
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden font-mono text-sm text-steel/50 transition-all group-hover:translate-x-1 group-hover:text-tungsten sm:block"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* THE QUEUE NOTE — honest about what is coming, no fake archive. */}
        <p className="corner-note mt-10">
          MORE ENTRIES IN THE QUEUE — WRITTEN BETWEEN JOBS, PUBLISHED WHEN THEY ARE RIGHT.
        </p>
      </div>
    </div>
  );
}
