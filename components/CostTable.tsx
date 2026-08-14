import { site } from "@/lib/site";

export type CostRow = {
  /** The work being priced — plain language, the way a customer would ask for it. */
  item: string;
  /** Indicative CAD range. Always a range, never a fixed price. */
  range: string;
  /** What actually moves the number up or down. */
  note: string;
};

type Props = {
  heading: string;
  /** One or two sentences of context above the table. */
  intro: string;
  rows: readonly CostRow[];
  /** Trade-specific caveat printed under the table. */
  footnote: string;
  /** Unique per page — the H2 anchor. */
  id?: string;
};

/**
 * Server component. No Edmonton competitor publishes any pricing, so honest
 * indicative ranges are the citation wedge — but they ship with a visible
 * disclaimer above AND below the table so nothing here reads as a quote.
 */
export function CostTable({ heading, intro, rows, footnote, id = "costs" }: Props) {
  return (
    <section aria-labelledby={id} className="mt-20">
      <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
        Indicative ranges
      </p>
      <h2 id={id} className="mt-3 font-display text-4xl uppercase tracking-wide text-bone md:text-5xl">
        {heading}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-steel">{intro}</p>

      <p className="mt-6 max-w-3xl border-l-2 border-tungsten bg-panel/70 px-4 py-3 font-mono text-xs leading-relaxed text-tungsten">
        These are indicative ranges in Canadian dollars. They are not quotes. Every build is priced
        after we see the vehicle — condition, parts availability and the finish level you want move
        these numbers in both directions.
      </p>

      <div className="plate mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">
            {heading}: indicative price ranges in Canadian dollars at {site.name}, {site.city},{" "}
            {site.region}. Ranges only — not quotes.
          </caption>
          <thead>
            <tr className="border-b border-rust/40">
              <th
                scope="col"
                className="px-4 py-3 font-sub text-[11px] uppercase tracking-[0.22em] text-steel"
              >
                Work
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-sub text-[11px] uppercase tracking-[0.22em] text-steel"
              >
                Indicative range (CAD)
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-sub text-[11px] uppercase tracking-[0.22em] text-steel"
              >
                What moves the number
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.item}
                className="border-b border-rust/15 transition-colors duration-200 last:border-0 hover:bg-tungsten/[0.04]"
              >
                <th
                  scope="row"
                  className="px-4 py-4 align-top font-body text-sm font-medium leading-relaxed text-bone"
                >
                  {r.item}
                </th>
                <td className="whitespace-nowrap px-4 py-4 align-top font-mono text-sm text-tungsten">
                  {r.range}
                </td>
                <td className="px-4 py-4 align-top text-sm leading-relaxed text-steel">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-steel">{footnote}</p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-steel">
        Want a real number instead of a range? Send photos and the vehicle details — or call the shop
        at{" "}
        <a className="font-mono text-tungsten underline decoration-tungsten/40 underline-offset-4 hover:text-bone" href={`tel:${site.phone}`}>
          {site.phoneDisplay}
        </a>
        .
      </p>
    </section>
  );
}
