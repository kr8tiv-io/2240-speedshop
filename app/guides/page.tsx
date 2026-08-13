import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Classic Car Guides for Alberta — Costs, Laws, Winter",
  description:
    "Straight answers for Alberta classic car owners: what restoration costs in Canadian dollars, what modified vehicle laws in Alberta actually say, and how classics survive a −40 winter. Written in an Edmonton shop.",
  alternates: { canonical: "/guides" },
  openGraph: {
    type: "website",
    title: "Straight Answers, Alberta Numbers — 2240 Speed Shop Guides",
    description:
      "Three pillar guides on restoration cost in Canada, Alberta modified vehicle law, and winter survival for classic cars.",
    url: "/guides",
  },
};

type Pillar = {
  href: string;
  eyebrow: string;
  title: string;
  keyword: string;
  blurb: string;
  spokes: string[];
};

const pillars: Pillar[] = [
  {
    href: "/guides/costs",
    eyebrow: "Pillar 01",
    title: "What It Really Costs",
    keyword: "classic car restoration cost Canada",
    blurb:
      "Honest Canadian-dollar ranges by scope — mechanical refresh, rolling restoration, frame-off, restomod. Where the money goes, why two shops quote the same car differently, and how to phase a build you cannot pay for in one go.",
    spokes: [
      "What Classic Car Restoration Really Costs in Canada (Edmonton): Driver, Show, and Concours Tiers",
      "Restomod Cost in Canada: What a Driver-Quality Build vs. a Show Build Actually Runs",
      "Engine Rebuild and Performance Build Costs in Canada: Stock Refresh to Full Build",
      "LS Swap Cost in Canada: The Real All-In Number, and the Alberta Paperwork Nobody Mentions",
      "How Much Does It Cost to Paint a Car in Canada? Driver-Quality vs. Show-Quality, Priced Honestly",
      "Custom Exhaust Cost in Canada: Catback vs. Full Custom, and Why Material Matters More in Edmonton",
      "Winter Car Storage Cost in Edmonton, and What Storage for a Classic Should Include",
      "What a Restoration Estimate Should Include, and How Shops Actually Charge",
    ],
  },
  {
    href: "/guides/alberta-laws",
    eyebrow: "Pillar 02",
    title: "Alberta Law and Your Build",
    keyword: "modified vehicle laws Alberta",
    blurb:
      "Exhaust noise, window tint, lift height, out-of-province inspections, salvage-to-rebuilt, antique plates, and insuring a modified classic. The general framework, plainly stated, with a pointer to the office that gives the binding answer.",
    spokes: [
      "Are Exhaust Mods Legal in Alberta? Noise Rules, Edmonton Enforcement, and How Not to Get Ticketed",
      "Lift Kit Laws in Alberta: How High Is Legal, and When a Lift Triggers an Inspection",
      "Do You Have to Declare Mods to Your Insurer in Alberta? Yes — Here Is What Happens If You Do Not",
      "Out-of-Province Inspection in Edmonton: Cost, What Is Checked, and the Modified-Car Trap",
      "Failed Your Out-of-Province Inspection in Alberta? Here Is Exactly What to Do Next",
      "Buying a Write-Off to Build? Alberta Salvage-to-Rebuilt, Explained for Builders",
      "Antique Plates in Alberta: The 25-Year Rule, the Restrictions, and Whether They Suit Your Classic",
      "Classic and Collector Insurance in Alberta: Agreed Value, Appraisals, and Insuring a Restomod",
      "Selling a Modified Car in Alberta: Disclose, Undo, or Document?",
      "Ethanol, Octane, and Old Iron: The Alberta Fuel Guide for Classic Engines",
    ],
  },
  {
    href: "/guides/winter",
    eyebrow: "Pillar 03",
    title: "The Minus Forty Moat",
    keyword: "winter storage classic cars Alberta",
    blurb:
      "Storage prep, fuel stabiliser, battery tenders, mice, moisture, block heaters, and cold-start reality for carburetted engines. National content cannot speak to −40 with a straight face. This is the part nobody else can write.",
    spokes: [
      "The Winter Storage Bible for Classic and Modified Cars (Alberta Edition)",
      "The Spring Startup Checklist: Waking Up Your Summer Car After an Alberta Winter",
      "How Cold Is Too Cold to Start a Carburetted Car? Winter Reality for Classic Owners",
      "Block Heaters, Pan Heaters, and Battery Blankets: Winter Gear for Built and Classic Engines",
      "Protecting a Classic or Lowered Car from Edmonton Road Salt and Calcium Chloride",
      "Winter Beater or Winter Package? The Cost Math of Driving Your Project Through an Edmonton Winter",
      "Can You Daily a Mustang, or Any RWD Classic, Through an Edmonton Winter?",
      "Pothole Season Survival for Lowered and Classic Cars (Edmonton Spring Edition)",
    ],
  },
];

const shopFloor = [
  "What Is a Restomod? The Definitive Guide, With Real Builds",
  "Restomod vs. Restoration: Which Is Right for Your Classic?",
  "Is It Worth Restoring a Classic Car? An Honest Answer from Inside the Shop",
  "How Long Does a Classic Car Restoration Take? Stage-by-Stage Timelines",
  "Frame-Off vs. Rolling Restoration, and Driver vs. Show vs. Concours",
  "How to Buy a Classic or Project in Canada: The Inspection Checklist We Use",
  "Classic Car Rust: How Bad Is Too Bad? Triage from the Restoration Bay",
  "Barn Find First Steps: Do Not Start It. Reviving a Car That Sat for Years",
  "Will Modifying or LS-Swapping Your Classic Hurt Its Value? The Honest Math",
  "Carb to EFI Conversion: Worth It? The Cold-Climate Case",
  "Classic Electrical Modernisation: 6V to 12V, Points to Electronic Ignition",
  "How to Break In a Rebuilt Engine: The Procedure We Give Every Customer",
  "Eight Signs Your Classic Carburetor Needs a Rebuild, Not Just an Adjustment",
  "The Chevy C10 and Square-Body Buyer’s and Builder’s Guide (Alberta Edition)",
];

export default function GuidesPage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-rust/25">
        <div className="absolute inset-0">
          <Image
            src="/shop/IMG_2943-original.jpeg"
            alt="The 2240 Speed Shop storefront and steel sign in east Edmonton, Alberta"
            fill
            priority
            sizes="100vw"
            className="graded object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bay-black via-bay-black/80 to-bay-black/40" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-20 sm:pt-28">
          <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
            The Guides
          </p>
          <h1 data-fx="h" className="mt-4 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-7xl">
            Straight answers,
            <br />
            <span className="neon-red">Alberta numbers</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone">
            The 2240 Speed Shop guides answer the three questions every classic owner in Alberta
            asks: what a restoration actually costs in Canadian dollars, what provincial law says
            about a modified vehicle, and what a −40 winter does to old iron. Three pillar guides,
            written from the shop floor in Edmonton.
          </p>

          <p className="mt-5 max-w-2xl leading-relaxed text-steel">
            Nobody local publishes this. American cost guides quote American money. National law
            articles average seven provinces into mush. Winter advice written in California is
            worth exactly what it costs. We build here, in the cold, for Canadian dollars, so these
            are the numbers and rules we actually work to.
          </p>

          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-tungsten">
            Updated August 2026 · Edmonton, Alberta
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Which guide do you need?
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-steel">
          Three pillars, each owning one question. Cost answers the money question before you call
          a shop. Alberta law answers the &ldquo;can I actually drive it like that&rdquo; question.
          Winter answers the question that only matters north of the 53rd parallel.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="plate group flex flex-col p-7 focus-visible:outline-none"
            >
              <p className="font-sub text-[10px] uppercase tracking-[0.3em] text-neon-bloom">
                {p.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-3xl leading-none tracking-wide text-bone group-hover:neon">
                {p.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-steel">{p.blurb}</p>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-tungsten">
                {p.keyword}
              </p>
              <p className="mt-4 font-sub text-xs uppercase tracking-[0.2em] text-bone">
                Read the guide →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="weld mx-auto max-w-6xl" />

      {/* SPOKES */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What gets published under each pillar?
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-steel">
          Each pillar is a hub. Under it sits a run of specific answers, each one taking a single
          question that currently has no Canadian answer worth reading. The titles below are the
          publishing queue, in order. None of them are live yet — this is the architecture, stated
          plainly, so you can see where the work is going before it gets there.
        </p>

        <div className="mt-12 space-y-14">
          {pillars.map((p) => (
            <div key={p.href}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-rust/30 pb-3">
                <h3 className="font-display text-2xl tracking-wide text-bone sm:text-3xl">
                  <Link href={p.href} className="hover:text-neon-bloom">
                    {p.title}
                  </Link>
                </h3>
                <span className="font-mono text-xs uppercase tracking-widest text-tungsten">
                  {p.spokes.length} planned
                </span>
              </div>
              <ol className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {p.spokes.map((s, i) => (
                  <li key={s} className="flex gap-4 text-sm leading-relaxed text-steel">
                    <span className="font-mono text-xs text-tungsten/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <div className="weld mx-auto max-w-6xl" />

      {/* SHOP FLOOR CLUSTER */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What about the restoration questions themselves?
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-steel">
          Process content lives beside the work it describes. Restomod versus restoration, rust
          triage, barn-find revival, engine break-in — those answers link out of the{" "}
          <Link href="/services" className="text-bone underline decoration-tungsten/40 underline-offset-4 hover:text-neon-bloom">
            service pages
          </Link>{" "}
          and the{" "}
          <Link href="/builds" className="text-bone underline decoration-tungsten/40 underline-offset-4 hover:text-neon-bloom">
            build case studies
          </Link>
          , because that is where the proof is. Same queue, different shelf.
        </p>

        <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {shopFloor.map((t) => (
            <li key={t} className="flex gap-3 text-sm leading-relaxed text-steel">
              <span aria-hidden className="mt-[7px] h-[6px] w-[6px] shrink-0 rotate-45 bg-tungsten/50" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="weld mx-auto max-w-6xl" />

      {/* HOW THEY CONNECT */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Why does a speed shop write guides?
        </h2>

        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-sub text-xs uppercase tracking-[0.2em] text-neon-bloom">
              Because the quote goes down easier
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              A restoration number lands hard when it arrives cold. It lands fine when you already
              know a frame-off is a thousand-hour job. Reading the cost guide before the estimate
              is the shortest route to an honest conversation.
            </p>
          </div>
          <div>
            <h3 className="font-sub text-xs uppercase tracking-[0.2em] text-neon-bloom">
              Because the rules are the rules
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              We would rather tell you what Alberta expects before the metal is cut than argue
              about it at inspection. A build that cannot be plated, insured, or driven is not a
              build. It is an expensive ornament.
            </p>
          </div>
          <div>
            <h3 className="font-sub text-xs uppercase tracking-[0.2em] text-neon-bloom">
              Because winter is the real test
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              Anything runs in July. The shop standard is a car that starts at minus thirty and
              comes out of storage in April without a surprise. Everything we know about that came
              from doing it here, badly, until we got good at it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-tungsten/40 bg-panel/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Got a project? Let&rsquo;s talk straight.
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-steel">
              Photos in, honest scope out. If the answer is that your car is not worth what it
              would take, you will hear that too.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="border border-rust px-6 py-3 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)]"
            >
              Start your quote
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-colors hover:border-bone"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
