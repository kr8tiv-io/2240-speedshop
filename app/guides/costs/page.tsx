import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Classic Car Restoration Cost in Canada — Real CAD Ranges",
  description:
    "What classic car restoration actually costs in Canada. Honest CAD ranges for mechanical refresh, rolling restoration, frame-off, and restomod builds, what drives the price, and why quotes vary. From an Edmonton shop.",
  alternates: { canonical: "/guides/costs" },
  openGraph: {
    type: "article",
    title: "What Classic Car Restoration Actually Costs in Canada",
    description:
      "Honest Canadian-dollar ranges by scope, where the money goes, and why two shops quote the same car differently.",
    url: "/guides/costs",
  },
};

const faqs = [
  {
    q: "How much does it cost to restore a classic car in Canada?",
    a: "Plan on roughly $4,000 to $15,000 CAD for a mechanical refresh, $15,000 to $60,000 for a rolling restoration done in stages, $60,000 to $120,000 for a driver-quality frame-off, and $120,000 to $250,000 or more for show-quality work. A full frame-off is commonly a 1,000-plus hour job, so labour, not parts, sets the number.",
  },
  {
    q: "Why do restoration shops bill by the hour instead of giving a flat price?",
    a: "Nobody knows what is under the paint until the paint is off. A fixed bid on an unknown car is either padded to cover the worst case or it is a number the shop will have to walk back. Hourly billing against a written scope, with a teardown assessment before the big money is committed, is the honest version.",
  },
  {
    q: "Is it cheaper to buy a finished classic than to restore one?",
    a: "Almost always, yes. A finished car of the same model usually sells for less than the cost of building it, because the previous owner already ate the labour. Restoration makes sense when you want a specific car, a specific spec, or a car with history you care about — not as a way to save money.",
  },
  {
    q: "How much does rust repair add to a classic car restoration?",
    a: "Surface rust adds hours, not thousands. Structural rust changes the project. Floor pans, rockers, cab corners, and frame repair commonly run $2,000 to $12,000 CAD in labour and metal, and severe cases run past that. Rust is the single biggest reason a restoration estimate moves after teardown.",
  },
  {
    q: "Can a restoration be done in stages to spread the cost?",
    a: "Yes. A rolling restoration keeps the car driveable and takes it in phases — brakes and safety first, then drivetrain, then body and paint, then interior. It costs slightly more in total because some work gets touched twice, and it is how most private owners actually get a car finished.",
  },
  {
    q: "Does a restomod cost more than a restoration?",
    a: "Usually. A restoration returns a car to what it was. A restomod adds a modern drivetrain, brakes, suspension, wiring, and often air conditioning, so it carries the restoration bill plus the cost of engineering and fitting parts the car was never designed around. Budget $80,000 CAD and up for a serious build.",
  },
];

const scopes = [
  {
    scope: "Mechanical refresh",
    also: "Recommissioning, safety sort-out",
    range: "$4,000 – $15,000",
    hours: "40 – 150 hrs",
    what: "Brakes, fluids, fuel system, ignition, cooling, tires, and the safety items. The car runs, stops, and can be driven. Paint and body stay as they are.",
  },
  {
    scope: "Rolling restoration",
    also: "Phased or stage-by-stage",
    range: "$15,000 – $60,000",
    hours: "150 – 600 hrs",
    what: "The car stays on the road while it is fixed in planned phases. Spread over two to five years for most private owners. Slightly more total cost, far easier to fund.",
  },
  {
    scope: "Frame-off, driver quality",
    also: "Body-off, rotisserie",
    range: "$60,000 – $120,000",
    hours: "800 – 1,200 hrs",
    what: "Stripped to bare metal, body off the frame, everything rebuilt or replaced. Finished to a standard that looks right at ten feet and gets driven hard on weekends.",
  },
  {
    scope: "Frame-off, show quality",
    also: "Show, judged local and regional",
    range: "$120,000 – $250,000",
    hours: "1,500 – 2,500 hrs",
    what: "The same teardown with far more hours in metal finishing, block sanding, plating, and detail. Underside and engine bay finished to the same standard as the paint you can see.",
  },
  {
    scope: "Restomod",
    also: "Pro-touring, modern drivetrain",
    range: "$80,000 – $250,000+",
    hours: "1,000 – 2,500 hrs",
    what: "Restoration scope plus a modern engine, transmission, brakes, suspension, wiring, and comfort. Fabrication and fitment hours are the variable that moves the number.",
  },
  {
    scope: "Concours",
    also: "Judged national, correct to the bolt",
    range: "Open-ended",
    hours: "2,500 hrs and up",
    what: "Correct finishes, correct fasteners, correct date codes, documented. A different discipline from a driver build. Very few Alberta cars justify it.",
  },
];

const drivers = [
  {
    driver: "Rust",
    impact: "High to extreme",
    detail:
      "Every hour of metal work is an hour nobody sees in the finished car. Floor pans, rockers, cab corners, lower quarters, and frame rails are the usual suspects. This is the line item that moves most between estimate and final.",
  },
  {
    driver: "Paint and prep hours",
    impact: "High",
    detail:
      "A driver-quality respray commonly runs $4,000 to $6,000 CAD. Show-quality paint runs $10,000 to $25,000 because block sanding straight panels is measured in weeks, not days. The paint is cheap. The flat surface under it is not.",
  },
  {
    driver: "Parts scarcity",
    impact: "Medium to high",
    detail:
      "Mustang and C10 parts arrive next week from a catalogue. Orphan makes, trim-specific pieces, and correct glass can take months and cost multiples. Cross-border shipping, duty, and exchange add real money on a Canadian build.",
  },
  {
    driver: "Chrome and plating",
    impact: "Medium",
    detail:
      "Re-plating a bumper pair is commonly $1,500 to $3,500 CAD, and a full car of brightwork adds up quickly. Pitted pot metal costs more to save than steel does. Plating also has lead times that can hold up final assembly.",
  },
  {
    driver: "Interior",
    impact: "Medium",
    detail:
      "Kit upholstery on a well-supported car can land near $3,000 CAD installed. Custom leather, wood, headliners, and sound deadening on a restomod run $10,000 to $15,000 or more.",
  },
  {
    driver: "Drivetrain",
    impact: "Medium to high",
    detail:
      "A stock rebuild of a common V8 typically runs $6,000 to $12,000 CAD. A performance build runs $12,000 to $25,000. A complete LS or diesel conversion, done properly with cooling, wiring, and driveline sorted, commonly lands between $15,000 and $35,000.",
  },
  {
    driver: "Wiring and electrical",
    impact: "Low to medium",
    detail:
      "A new harness plus fuse panel, charging, and lighting sorted commonly falls between $1,500 and $5,000 CAD. It is unglamorous, it is what stops fires, and it is where a lot of amateur restorations quietly fail.",
  },
];

export default function CostsGuidePage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: "Restoration Costs", path: "/guides/costs" },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={faqSchema(faqs)} />

      <article>
        {/* HEADER */}
        <header className="relative overflow-hidden border-b border-rust/25">
          <div className="absolute inset-0">
            <Image
              src="/shop/IMG_0401-stripped-blue-frame.jpeg"
              alt="Stripped blue classic car body shell on the frame during a frame-off restoration in Edmonton"
              fill
              priority
              sizes="100vw"
              className="graded object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bay-black via-bay-black/80 to-bay-black/45" />
          </div>

          <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 sm:pt-24">
            <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-widest text-steel">
              <Link href="/" className="hover:text-bone">
                Home
              </Link>
              <span className="px-2 text-rust">/</span>
              <Link href="/guides" className="hover:text-bone">
                Guides
              </Link>
              <span className="px-2 text-rust">/</span>
              <span className="text-tungsten">Costs</span>
            </nav>

            <p className="mt-8 font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
              Pillar 01 · Money
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-wide text-bone sm:text-6xl">
              What classic car restoration
              <br />
              <span className="neon-red">actually costs in Canada</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone">
              A classic car restoration in Canada runs roughly $4,000 CAD for a mechanical refresh
              to $250,000 and up for show-quality frame-off work. Most private builds land between
              $60,000 and $120,000. Labour drives the number, not parts — a full frame-off is
              commonly a 1,000-hour job.
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-steel">
              Every figure on this page is a planning range in 2026 Canadian dollars, before GST,
              based on how this work actually gets billed in Alberta. It is not a quote. Your car,
              its rust, and its parts availability decide the real number, and nobody can tell you
              that number honestly until the car is apart.
            </p>

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-tungsten">
              Updated August 2026 · Edmonton, Alberta
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5">
          {/* SCOPE TABLE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              How much does a restoration cost by scope?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              &ldquo;Restoration&rdquo; covers six different jobs with six different price tags.
              Pick the scope before you argue about the money. Most disappointment in this trade
              comes from a customer buying scope A and expecting result D.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <caption className="sr-only">
                  Classic car restoration cost ranges in Canadian dollars by scope of work
                </caption>
                <thead>
                  <tr className="border-b border-rust/50 text-left font-sub text-[11px] uppercase tracking-[0.18em] text-neon-bloom">
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Scope
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Range (CAD)
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Shop hours
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      What you get
                    </th>
                  </tr>
                </thead>
                <tbody className="text-steel">
                  {scopes.map((s) => (
                    <tr key={s.scope} className="border-b border-rust/20 align-top">
                      <td className="py-4 pr-4">
                        <span className="block font-sub text-xs uppercase tracking-[0.14em] text-bone">
                          {s.scope}
                        </span>
                        <span className="mt-1 block text-xs text-steel/70">{s.also}</span>
                      </td>
                      <td className="py-4 pr-4 font-mono text-xs text-tungsten">{s.range}</td>
                      <td className="py-4 pr-4 font-mono text-xs">{s.hours}</td>
                      <td className="py-4 leading-relaxed">{s.what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-steel">
              Specialty shop labour in Alberta generally plans out between $95 and $150 CAD per
              hour depending on the work and who is doing it. Multiply that by the hours column and
              the ranges stop looking arbitrary. A thousand hours is half a work-year for one
              technician.
            </p>
          </section>

          <div className="weld" />

          {/* COST DRIVERS */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What drives the price up fastest?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Seven line items decide almost every restoration budget. Two of them — rust and prep
              hours — decide most of it.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <caption className="sr-only">
                  Cost drivers on a classic car restoration and their typical impact
                </caption>
                <thead>
                  <tr className="border-b border-rust/50 text-left font-sub text-[11px] uppercase tracking-[0.18em] text-neon-bloom">
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Driver
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Impact
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody className="text-steel">
                  {drivers.map((d) => (
                    <tr key={d.driver} className="border-b border-rust/20 align-top">
                      <td className="py-4 pr-4 font-sub text-xs uppercase tracking-[0.14em] text-bone">
                        {d.driver}
                      </td>
                      <td className="py-4 pr-4 font-mono text-xs text-tungsten">{d.impact}</td>
                      <td className="py-4 leading-relaxed">{d.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="weld" />

          {/* WHY QUOTES VARY */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Why do two shops quote the same car so differently?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Because they are quoting two different cars. A restoration estimate is a set of
              assumptions about what will be found once the panels come off, and every shop makes
              those assumptions differently. Four things account for almost all of the spread:
            </p>

            <ul className="mt-7 space-y-5">
              <li className="flex gap-4">
                <span aria-hidden className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-speed-red" />
                <p className="leading-relaxed text-steel">
                  <span className="text-bone">Assumed standard.</span> One shop prices a
                  driver-quality respray. The other prices blocked, straight, show panels. Same
                  words in the quote, three times the hours in the second one.
                </p>
              </li>
              <li className="flex gap-4">
                <span aria-hidden className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-speed-red" />
                <p className="leading-relaxed text-steel">
                  <span className="text-bone">Metal versus filler.</span> Cutting out rot and
                  welding in new steel takes hours. Skimming over it does not. Both look identical
                  the day the car is delivered. They stop looking identical after one Alberta
                  winter.
                </p>
              </li>
              <li className="flex gap-4">
                <span aria-hidden className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-speed-red" />
                <p className="leading-relaxed text-steel">
                  <span className="text-bone">What the quote excludes.</span> Chrome, glass,
                  interior, drivetrain, and wiring are frequently carved out of a headline number.
                  Read what is not in the scope before you compare two totals.
                </p>
              </li>
              <li className="flex gap-4">
                <span aria-hidden className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-speed-red" />
                <p className="leading-relaxed text-steel">
                  <span className="text-bone">Optimism.</span> The lowest quote in the pile is
                  usually the one that assumed the best case. It is also the one that produces the
                  hardest phone call four months in.
                </p>
              </li>
            </ul>

            <p className="mt-7 leading-relaxed text-steel">
              A useful estimate names the standard, lists what is included and excluded, states the
              hourly rate, sets a teardown-and-reassess point before the large money is committed,
              and carries a contingency. Ten to twenty percent on top of the estimate is the
              realistic buffer on any car that has not been apart yet.
            </p>
          </section>

          <div className="weld" />

          {/* VALUE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Will the finished car be worth what you spent?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Usually not, and that is the wrong test. On common models, a finished car sells for
              less than the cost of building one, because the seller already absorbed the labour.
              The gap narrows on desirable models with strong documentation and disappears entirely
              on the rare stuff. Here is the honest framing:
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <caption className="sr-only">
                  When restoration makes financial sense versus buying a finished classic car
                </caption>
                <thead>
                  <tr className="border-b border-rust/50 text-left font-sub text-[11px] uppercase tracking-[0.18em] text-neon-bloom">
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Situation
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Verdict
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Reasoning
                    </th>
                  </tr>
                </thead>
                <tbody className="text-steel">
                  <tr className="border-b border-rust/20 align-top">
                    <td className="py-4 pr-4 text-bone">Common model, no history to you</td>
                    <td className="py-4 pr-4 font-mono text-xs text-tungsten">Buy finished</td>
                    <td className="py-4 leading-relaxed">
                      Somebody else already paid the labour bill. Let them.
                    </td>
                  </tr>
                  <tr className="border-b border-rust/20 align-top">
                    <td className="py-4 pr-4 text-bone">Family car, or the one you learned on</td>
                    <td className="py-4 pr-4 font-mono text-xs text-tungsten">Restore</td>
                    <td className="py-4 leading-relaxed">
                      No equivalent exists on the market at any price. This is most of the work
                      that comes through the door.
                    </td>
                  </tr>
                  <tr className="border-b border-rust/20 align-top">
                    <td className="py-4 pr-4 text-bone">You want a specific spec</td>
                    <td className="py-4 pr-4 font-mono text-xs text-tungsten">Build it</td>
                    <td className="py-4 leading-relaxed">
                      A restomod with the drivetrain, brakes, and stance you want will not turn up
                      used in your colour with your options.
                    </td>
                  </tr>
                  <tr className="border-b border-rust/20 align-top">
                    <td className="py-4 pr-4 text-bone">Rare, documented, numbers-matching</td>
                    <td className="py-4 pr-4 font-mono text-xs text-tungsten">Restore carefully</td>
                    <td className="py-4 leading-relaxed">
                      Originality is the value. Correct restoration protects it. Modification can
                      erase it — decide before anything is cut.
                    </td>
                  </tr>
                  <tr className="border-b border-rust/20 align-top">
                    <td className="py-4 pr-4 text-bone">Severe structural rot, common model</td>
                    <td className="py-4 pr-4 font-mono text-xs text-tungsten">Walk away</td>
                    <td className="py-4 leading-relaxed">
                      A better shell exists somewhere for less than the metal work. We will tell
                      you that instead of billing you for it.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="weld" />

          {/* PHASING */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              How do you phase a restoration you cannot pay for at once?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Most private restorations are funded a season at a time. That works, provided the
              order is right. Do the phases in this sequence and no phase gets undone by the next
              one:
            </p>

            <ol className="mt-7 space-y-5">
              {[
                [
                  "Phase 1 — Safety and stopping",
                  "Brakes, lines, steering, suspension, tires, fuel system. The car becomes something you can drive while you save for the rest.",
                ],
                [
                  "Phase 2 — Drivetrain",
                  "Engine and transmission sorted, rebuilt, or swapped. Cooling and charging done at the same time, because they are the same afternoon while things are out.",
                ],
                [
                  "Phase 3 — Metal",
                  "Rust cut out and steel welded in. Do this before paint and never the other way around. Metal work under fresh paint is money burned twice.",
                ],
                [
                  "Phase 4 — Paint",
                  "Strip, prep, block, spray. The longest single stretch on the calendar and the one most affected by how well phase 3 went.",
                ],
                [
                  "Phase 5 — Trim, glass, interior",
                  "Chrome back from plating, glass and seals in, interior fitted. Order plating early — lead times, not labour, hold up final assembly.",
                ],
                [
                  "Phase 6 — Sorting",
                  "The last ten percent: leaks, rattles, alignment, tuning, and the shakedown miles. Budget for it. Everyone forgets it exists.",
                ],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <span aria-hidden className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-rust" />
                  <p className="leading-relaxed text-steel">
                    <span className="text-bone">{title}.</span> {body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <div className="weld" />

          {/* ALBERTA */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Does an Alberta car cost more or less to restore?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Both, depending on how the car lived. A prairie car that spent its winters parked is
              often dry underneath in a way an eastern car never is — that saves real metal hours.
              A prairie car that worked through winters met calcium-chloride brine, which is
              aggressive on fasteners, brake and fuel lines, and anything aluminium.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Two Alberta-specific costs are worth planning for. First, cure and cold: paint and
              body work want a heated, controlled space, and scheduling that work outside the deep
              winter avoids compromises. Second, parts logistics — a lot of catalogue supply crosses
              the border, so exchange, shipping, and duty are part of the build budget, not an
              afterthought.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              One more piece of local reality: fresh concrete, fresh paint, and fresh anything wants
              time before it meets an Alberta winter. Finishing a car in October and storing it
              properly beats rushing the last phase to make one show. The{" "}
              <Link href="/guides/winter" className="text-bone underline decoration-rust underline-offset-4 hover:text-neon-bloom">
                winter guide
              </Link>{" "}
              covers how to put a finished car away without undoing the work.
            </p>
          </section>

          <div className="weld" />

          {/* FAQ */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Restoration cost questions, answered
            </h2>
            <dl className="mt-8 space-y-8">
              {faqs.map((f) => (
                <div key={f.q} className="border-l border-rust/40 pl-5">
                  <dt className="font-sub text-sm uppercase tracking-[0.12em] text-bone">{f.q}</dt>
                  <dd className="mt-3 leading-relaxed text-steel">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="weld" />

          {/* RELATED */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Where to go next
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                ["/services/classic-car-restoration", "Restoration", "Frame-off or rolling. Honest scope, real hours, one standard."],
                ["/services/restomods-custom-builds", "Restomods & Hot Rods", "Classic skin, modern spine. Where the bigger budgets go."],
                ["/guides/alberta-laws", "Alberta Law and Your Build", "What the province expects before the metal is cut."],
                ["/guides/winter", "The Minus Forty Moat", "Storing and starting a finished car in an Alberta winter."],
              ].map(([href, title, blurb]) => (
                <Link key={href} href={href} className="plate group p-6">
                  <p className="font-display text-2xl leading-none tracking-wide text-bone group-hover:neon">
                    {title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-steel">{blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="border-y border-speed-red/40 bg-panel/50">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
                Want the number for your car?
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-steel">
                Send photos and what you want out of it. You get a scope, a range, and a straight
                answer about whether the car is worth it.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="border border-speed-red/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
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
      </article>
    </>
  );
}
