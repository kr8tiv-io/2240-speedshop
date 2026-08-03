import Link from "next/link";

type ServiceCardProps = {
  /** Service slug from lib/site.ts — the card links to /services/<slug>. */
  slug: string;
  title: string;
  blurb: string;
  /** 1-based position; rendered as a mono bay number (01, 02, …). */
  index?: number;
  /** Link label under the blurb. */
  cta?: string;
};

/**
 * Server component. Steel plate card for one of the six pillar services.
 * The whole plate is the link, so the accessible name is the service title.
 */
export function ServiceCard({ slug, title, blurb, index, cta = "See the work" }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="plate group flex h-full flex-col p-6 sm:p-7"
    >
      {typeof index === "number" ? (
        <span aria-hidden="true" className="font-mono text-xs tracking-widest text-rust">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}

      <h3 className="mt-3 font-display text-2xl uppercase leading-none tracking-wide text-bone sm:text-3xl">
        {title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{blurb}</p>

      <span className="mt-6 inline-flex items-center gap-2 font-sub text-[11px] uppercase tracking-[0.22em] text-steel transition-colors group-hover:text-neon-bloom">
        {cta}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
    </Link>
  );
}
