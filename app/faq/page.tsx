import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How Much Does It Cost to Restore a Classic Car? Alberta FAQ",
  description:
    "How much does it cost to restore a classic car, how long it takes, frame-off versus rolling, Alberta rust, winter storage, out-of-province inspections and deposits — answered straight by 2240 Speed Shop in Edmonton.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Classic Car Restoration FAQ — Alberta Numbers, Straight Answers",
    description:
      "Eighteen honest answers on restoration cost, timelines, rust, storage, inspections and how a build actually gets billed.",
    url: "/faq",
  },
};

const groups = [
  {
    label: "Money",
    items: [
      {
        q: "How much does it cost to restore a classic car?",
        a: "There is no single number — a classic car restoration is priced by hours and parts, and a full frame-off runs well past a thousand hours before paint. Published Canadian ranges put driver-quality paint alone around $4,000 to $5,000 and show paint north of $10,000. Scope decides everything else.",
      },
      {
        q: "Where does the money actually go in a restoration?",
        a: "Labour, mostly. Metalwork and bodywork are the biggest line on almost every classic invoice, followed by paint prep, then parts. Mechanical work is usually predictable. Rust is not — what is hiding under sound-deadening and seam sealer is the single largest variable in any restoration estimate.",
      },
      {
        q: "Do I pay a deposit, and how is a build billed?",
        a: "Yes. Work starts against a deposit, and the build is billed in stages as it moves — teardown, metal, paint, assembly. You approve the scope of each stage before it starts. Nobody should ever hand a shop a five-figure cheque against a verbal promise, here or anywhere else.",
      },
      {
        q: "Is it cheaper to buy a finished classic than to restore one?",
        a: "Usually, yes. A finished car of the same spec almost always costs less than building one, because the previous owner ate the labour. People restore anyway when the car has history, when it is the exact spec they want, or when they want to know what is underneath.",
      },
      {
        q: "What can I do to keep the cost down?",
        a: "Buy the best body you can afford, then spend on it. Rust is the most expensive thing in the shop. Decide the quality tier before work starts and hold it. Do your own parts chasing if you enjoy it. Phase the build so the car drives sooner.",
      },
    ],
  },
  {
    label: "The work",
    items: [
      {
        q: "What is the difference between a frame-off and a rolling restoration?",
        a: "Frame-off means the body comes off the chassis and everything is addressed at once — the deepest, most expensive, most complete option. A rolling restoration fixes the car in planned stages while you keep driving it. Same destination, different cash flow, and a very different amount of time off the road.",
      },
      {
        q: "How long does a classic car restoration take?",
        a: "A full frame-off is measured in years, not months, because it is a thousand-plus hours of labour queued behind other cars. A focused job — rust repair, a swap, paint — is measured in weeks. The honest answer comes with the quote, once we know what is actually there.",
      },
      {
        q: "Is my car even worth restoring?",
        a: "Sometimes no, and you will be told so. A car is worth restoring when the body is solid, the parts supply exists, and it means something to you. It stops being worth it when the shell is gone and an identical better car is for sale two provinces away.",
      },
      {
        q: "Can you finish a project somebody else started?",
        a: "Yes, and it is common. Stalled builds arrive with boxes of parts and no photos of what was done underneath. Expect an inspection stage first: what was completed, what was done wrong, what is missing. That assessment is the honest starting point for any number we give you.",
      },
      {
        q: "Where do parts for a sixty-year-old car come from?",
        a: "Reproduction catalogues for the popular platforms, specialist suppliers for the rest, swap meets, donor cars, and fabrication when nothing exists. Common Mustangs, C10s and muscle cars are well supported. Orphan models and trim pieces take patience — which is why parts hunting starts early, not at assembly.",
      },
      {
        q: "Can the build be done in stages instead of all at once?",
        a: "Yes, and for most people it is the smarter route. Sequence it so safety and structure come first — rust, brakes, steering, drivetrain — then cosmetics later. The car stays usable, the bills stay survivable, and you are never one bad month away from an unfinished shell.",
      },
    ],
  },
  {
    label: "Alberta",
    items: [
      {
        q: "How bad is rust on Alberta cars?",
        a: "Worse than people expect and better than the coast. Road salt and brine get into rockers, cab corners, floor pans, trunk drop-offs and frame rails, and it works from the inside out. A car that looks clean in photos can still need metal — which is why we ask for underside shots.",
      },
      {
        q: "Should I store my classic over an Alberta winter?",
        a: "Store it dry, off salt, on a full tank with fresh fuel and a battery tender. Heated is nicer; dry and stable matters more than warm. The killers are condensation, mice and a car parked wet. Winter is also the best window to book bodywork, because nobody is driving.",
      },
      {
        q: "Will an engine swap or modification cause an out-of-province inspection problem?",
        a: "It can complicate one. Alberta's out-of-province inspection is a safety inspection, and modified or altered vehicles get looked at harder — lighting, brakes, steering, suspension height, glass and tires are the usual failures. Get the inspection sorted before you spend on paint, not after.",
      },
      {
        q: "Does the cold change how you build a car here?",
        a: "Yes. A build that only runs in July is a failed build here. Cooling, wiring, fuel delivery and ignition get specified to start at minus thirty, and paint and cure work gets scheduled around shop temperature. Cold is the design constraint every Alberta shop either respects or ignores.",
      },
    ],
  },
  {
    label: "Working with the shop",
    items: [
      {
        q: "Can I ship a car in from another province or the US?",
        a: "People do it regularly. Enclosed transport for anything painted, open for a project. Send photos and the VIN before you book a truck — it is cheaper to find out a car is not worth restoring while it is still sitting in somebody else's driveway.",
      },
      {
        q: "Do you work on modern daily drivers too?",
        a: "This shop is set up for classics and customs — restoration, fabrication, swaps, and the mechanical service old cars need. A modern daily is welcome when it is part of a build. For routine service on a late-model commuter there are shops that do it faster and cheaper.",
      },
      {
        q: "How do I know what is happening to my car while it is here?",
        a: "Photos at every stage. When metal comes off and something unexpected turns up, you hear about it before more money gets spent, not in a summary at the end. Ask to come see it on the hoist any week you like — that is the whole point of a small shop.",
      },
    ],
  },
] as const;

const flatFaq = groups.flatMap((g) => g.items.map((i) => ({ q: i.q, a: i.a })));

const bands = [
  {
    band: "Under $10,000",
    covers: "Focused jobs, not restorations",
    shape:
      "Carb and ignition sort-out, a set of patch panels, brakes and suspension refresh, or a driver-quality respray on steel that is already solid.",
  },
  {
    band: "$10,000 – $25,000",
    covers: "One discipline, done properly",
    shape:
      "Real rust repair and paint on a straight car, or an engine build, or a swap finished right with cooling, wiring and driveline sorted.",
  },
  {
    band: "$25,000 – $50,000",
    covers: "A rolling restoration",
    shape:
      "Body, paint and mechanicals staged over a season or two. Most 'I want it right, not perfect' builds land in here.",
  },
  {
    band: "$50,000 – $100,000",
    covers: "Frame-off and restomod territory",
    shape:
      "Body off the chassis on a well-supported platform, or a modern drivetrain, brakes, suspension and interior under original sheet metal.",
  },
  {
    band: "$100,000 +",
    covers: "Show-level and one-off",
    shape:
      "Heavy fabrication, rare platforms, and builds where the answer to every question is do it properly.",
  },
];

const compare = [
  { row: "What happens", off: "Body comes off the chassis. Everything apart, everything addressed.", roll: "Planned stages. The car goes back together between them." },
  { row: "Time off the road", off: "Long — measured in years on a full build.", roll: "Short blocks you schedule around driving season." },
  { row: "Cost pattern", off: "One large committed spend.", roll: "Spread across seasons as budget allows." },
  { row: "Best for", off: "Rare or valuable cars, show builds, shells that need it.", roll: "Drivers you want to keep using while it improves." },
  { row: "The risk", off: "Finding more once it is apart.", roll: "Doing some work twice as scope grows." },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd data={faqSchema(flatFaq)} />

      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-rust/25">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
            Straight answers, Alberta numbers
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.92] tracking-wide text-bone sm:text-7xl">
            How much does it cost to restore a classic car?
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-bone">
            There is no sticker. A full frame-off is a thousand-plus hours of labour plus parts, so
            scope, rust and quality tier decide the number. Below: honest ranges to plan with, and
            eighteen answers about timelines, Alberta rust, storage, inspections and process.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- band table */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What does each budget band actually buy?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          These are the same bands the quote form asks you to pick from. They are planning ranges
          for thinking in, not quotes — your number comes from your car, once somebody has looked
          underneath it.
        </p>

        <div className="mt-8 overflow-x-auto border border-rust/30">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Classic car restoration budget bands and what each one typically covers
            </caption>
            <thead>
              <tr className="border-b border-rust/40">
                <th scope="col" className="px-5 py-4 font-sub text-[10px] uppercase tracking-[0.22em] text-neon-bloom">
                  Budget band
                </th>
                <th scope="col" className="px-5 py-4 font-sub text-[10px] uppercase tracking-[0.22em] text-neon-bloom">
                  What it is
                </th>
                <th scope="col" className="px-5 py-4 font-sub text-[10px] uppercase tracking-[0.22em] text-neon-bloom">
                  Typical shape of the job
                </th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b.band} className="border-b border-rust/20 last:border-0 align-top">
                  <th scope="row" className="whitespace-nowrap px-5 py-5 font-mono text-sm font-normal text-bone">
                    {b.band}
                  </th>
                  <td className="px-5 py-5 font-sub text-[11px] uppercase tracking-[0.14em] text-steel">
                    {b.covers}
                  </td>
                  <td className="px-5 py-5 font-body text-sm leading-relaxed text-steel">{b.shape}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-xs leading-relaxed text-steel/60">
          Bands, not quotes. Published Canadian market figures — for example driver-quality paint
          around $4,000–$5,000 and show paint past $10,000 — are cited as ranges, not as this
          shop&apos;s prices.
        </p>
      </section>

      {/* ---------------------------------------------------- compare table */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="weld" />
        <h2 className="mt-12 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Frame-off or rolling restoration — which one do you need?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          The single decision that moves the budget more than any other. Answer it before you pick a
          colour.
        </p>

        <div className="mt-8 overflow-x-auto border border-rust/30">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <caption className="sr-only">
              Frame-off restoration compared with a rolling restoration
            </caption>
            <thead>
              <tr className="border-b border-rust/40">
                <th scope="col" className="px-5 py-4 font-sub text-[10px] uppercase tracking-[0.22em] text-steel">
                  &nbsp;
                </th>
                <th scope="col" className="px-5 py-4 font-sub text-[10px] uppercase tracking-[0.22em] text-neon-bloom">
                  Frame-off
                </th>
                <th scope="col" className="px-5 py-4 font-sub text-[10px] uppercase tracking-[0.22em] text-neon-bloom">
                  Rolling restoration
                </th>
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <tr key={c.row} className="border-b border-rust/20 last:border-0 align-top">
                  <th scope="row" className="whitespace-nowrap px-5 py-5 font-sub text-[11px] font-normal uppercase tracking-[0.16em] text-bone">
                    {c.row}
                  </th>
                  <td className="px-5 py-5 font-body text-sm leading-relaxed text-steel">{c.off}</td>
                  <td className="px-5 py-5 font-body text-sm leading-relaxed text-steel">{c.roll}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --------------------------------------------------------- the Q&As */}
      <section className="mx-auto max-w-3xl px-5 pb-8">
        {groups.map((group) => (
          <div key={group.label} className="pb-4">
            <div className="weld" />
            <p className="mt-10 mb-8 font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
              {group.label}
            </p>
            <div className="space-y-10">
              {group.items.map((item) => (
                <article key={item.q}>
                  <h2 className="font-display text-2xl leading-tight tracking-wide text-bone sm:text-3xl">
                    {item.q}
                  </h2>
                  <p className="mt-3 font-body text-[15px] leading-relaxed text-steel">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* --------------------------------------------------------------- cta */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col gap-6 border border-speed-red/45 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Still the wrong question? Ask about your car.
            </h2>
            <p className="mt-3 font-body text-[15px] leading-relaxed text-steel">
              General answers only go so far. Send photos of the actual car and the numbers stop
              being hypothetical. Two business days for scope, sequence and a band.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="border border-speed-red/70 px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
            >
              Get a quote
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="border border-steel/35 px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </div>

        <p className="mt-8 font-body text-[15px] leading-relaxed text-steel">
          Deeper reading lives in the{" "}
          <Link className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone" href="/guides">
            guides
          </Link>
          . What the shop is and who runs it is on{" "}
          <Link className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone" href="/about">
            about Terry
          </Link>
          , and what customers said is on{" "}
          <Link className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone" href="/reviews">
            reviews
          </Link>
          .
        </p>
      </section>
    </>
  );
}
