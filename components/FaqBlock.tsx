import { faqSchema, JsonLd } from "@/lib/schema";

export type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  items: readonly FaqItem[];
  heading?: string;
  /** Short line under the H2. */
  intro?: string;
  /** Unique per page — the H2 anchor. */
  id?: string;
};

/**
 * Server component. Uses native <details>/<summary>, so every question AND
 * answer sits in the server-rendered HTML — AI crawlers do not execute JS, and
 * the FAQPage schema text is literally the visible text.
 */
export function FaqBlock({ items, heading = "Straight answers", intro, id = "faq" }: Props) {
  return (
    <section aria-labelledby={id} className="mt-20">
      <JsonLd data={faqSchema(items.map((i) => ({ q: i.q, a: i.a })))} />

      <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
        Questions we actually get
      </p>
      <h2 id={id} className="mt-3 font-display text-4xl uppercase tracking-wide text-bone md:text-5xl">
        {heading}
      </h2>
      {intro ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-steel">{intro}</p> : null}

      <div className="mt-8 border-t border-rust/25">
        {items.map((item, i) => (
          <details
            key={item.q}
            open={i === 0}
            className="group border-b border-rust/25 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5">
              <h3 className="font-display text-2xl uppercase leading-tight tracking-wide text-bone transition-colors group-open:text-neon-bloom md:text-3xl">
                {item.q}
              </h3>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 font-mono text-lg leading-none text-steel transition-transform duration-200 group-open:rotate-45 group-open:text-neon-bloom"
              >
                +
              </span>
            </summary>
            <p className="max-w-3xl pb-6 text-base leading-relaxed text-steel">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
