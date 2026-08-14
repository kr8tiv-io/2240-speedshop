import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Winter Storage for Classic Cars in Alberta — The −40 Guide",
  description:
    "Winter storage and cold-weather survival for classic cars in Alberta: storage prep, fuel stabiliser, battery tenders, mice, moisture, block heaters, cold-start reality, and the spring wake-up checklist.",
  alternates: { canonical: "/guides/winter" },
  openGraph: {
    type: "article",
    title: "Winter Storage and Cold-Weather Survival for Alberta Classics",
    description:
      "Storage prep, fuel, batteries, rodents, moisture, block heaters, and the spring checklist — written where it actually hits −40.",
    url: "/guides/winter",
  },
};

const faqs = [
  {
    q: "How do you store a classic car for winter in Alberta?",
    a: "Fill the tank and add stabiliser, change the oil before storage rather than after, inflate tires above normal pressure, put the battery on a smart tender or take it out, block the intake and exhaust against rodents, leave the parking brake off, and cover the car with something breathable. Do it in one afternoon in late September or early October, before the first hard freeze.",
  },
  {
    q: "Do you need fuel stabiliser for winter storage?",
    a: "Yes, especially with a carburetted engine. Pump gasoline containing ethanol attracts water and degrades over months, which corrodes carburetor internals, fuel lines, and steel tanks. Fill the tank to limit condensation space, add stabiliser at the recommended dose, then run the engine long enough for treated fuel to reach the carburetor bowls or fuel rail.",
  },
  {
    q: "Should a stored car be on a battery tender all winter?",
    a: "A modern smart tender that monitors and floats is safe to leave connected for the season and will get the battery to spring in good shape. An old-style trickle charger without regulation is not — it can cook a battery over months. If the car is stored somewhere without power, remove the battery and keep it somewhere above freezing on a tender.",
  },
  {
    q: "How do you keep mice out of a stored classic car?",
    a: "Deny entry and deny appeal. Block the exhaust outlet and air intake, plug obvious holes into the cabin, remove anything organic from the car, and do not store food or feed nearby. Traps around the vehicle beat repellents inside it. Mice nest in warm places, so headers, air cleaners, and heater boxes are the first places to check in spring.",
  },
  {
    q: "Do you need a block heater in Alberta?",
    a: "Below roughly −15 °C a block heater is the difference between an easy start and hard cranking on cold oil. Below −25 °C treat it as required. A built engine with looser bearing clearances and heavier oil benefits even more than a stock one. Two to four hours on a timer before you start does most of the work; leaving it plugged in all night mostly heats the garage.",
  },
  {
    q: "Why is a carburetted engine harder to start in the cold?",
    a: "Cold air is dense, cold fuel does not vaporise well, and cold oil resists cranking, so the engine needs a richer mixture and more cranking energy exactly when the battery has least to give. A correctly set choke, a healthy battery, correct-viscosity oil, and fresh fuel fix most cold-start complaints. Chronic hard starting usually means the choke or the carburetor needs attention, not more cranking.",
  },
  {
    q: "What is the spring startup procedure after winter storage?",
    a: "Inspect before you turn the key: look for rodent damage, check fluid levels and leaks, check tire pressures and brakes, and reconnect a charged battery. Prime the oil system, start the engine and let it warm gradually, then test the brakes at walking pace before the first drive. Wash the underside early to get any road salt off a car that has just come out of hibernation.",
  },
];

const prep = [
  {
    task: "Fuel: fill and stabilise",
    when: "Day of storage",
    why: "A full tank leaves less air for condensation. Stabiliser slows the breakdown of ethanol-blended pump gas, which is the main enemy of a carburetted classic sitting for six months. Run the engine afterwards so treated fuel reaches the bowls.",
  },
  {
    task: "Oil: change before, not after",
    when: "Day of storage",
    why: "Used oil carries acids and combustion by-products. Leaving that in the sump all winter is worse than the cost of a filter and five litres. Change it warm, then run the engine to circulate clean oil.",
  },
  {
    task: "Coolant: check the mix",
    when: "Before first freeze",
    why: "A weak mix in an unheated space is a cracked block waiting for the first −30 night. Test it rather than assuming, particularly on a car that has had cooling work done recently.",
  },
  {
    task: "Tires: over-inflate and move",
    when: "Day of storage",
    why: "Bias-ply and older radials flat-spot when they sit cold under load. A few extra psi above normal helps. Moving the car a metre once mid-winter helps more.",
  },
  {
    task: "Battery: tender or remove",
    when: "Day of storage",
    why: "A discharged lead-acid battery freezes; a charged one does not. A smart tender left connected keeps it healthy. No power in the building means take the battery home.",
  },
  {
    task: "Rodents: block and bait",
    when: "Before first freeze",
    why: "Exhaust outlet, air intake, and any cabin gap get blocked. Traps go around the car, not in it. Mice chew wiring and nest in headers and heater boxes, and the damage is discovered in April at the worst possible moment.",
  },
  {
    task: "Brakes: park brake off",
    when: "Day of storage",
    why: "A parked brake shoe can bond to a drum over a damp winter. Chock the wheels instead. Surface rust on rotors is normal and wipes off in the first few stops.",
  },
  {
    task: "Cover: breathable only",
    when: "Day of storage",
    why: "A plastic tarp traps moisture against paint and creates its own microclimate. A breathable cover over a clean, dry, waxed car is the correct answer. Never cover a dirty car — grit under a cover is sandpaper.",
  },
];

const heaters = [
  {
    gear: "Block heater",
    what: "Heats coolant in the block, which warms the oil around it",
    when: "Plug in below about −15 °C; treat as required below −25 °C",
    note: "Two to four hours on a timer is enough. All night is mostly wasted power.",
  },
  {
    gear: "Oil pan heater",
    what: "Pad or magnet heats the oil directly",
    when: "Below about −25 °C, or any built engine on heavy oil",
    note: "Best paired with a block heater on engines with looser bearing clearances.",
  },
  {
    gear: "Battery blanket",
    what: "Insulated wrap keeps the battery near working temperature",
    when: "Below about −25 °C, or any older or marginal battery",
    note: "Cold cranking amps fall exactly when the engine demands the most. This is the cheapest fix on the list.",
  },
  {
    gear: "Smart battery tender",
    what: "Monitors and floats the battery instead of trickling",
    when: "Any car that sits more than two weeks",
    note: "Safe to leave connected all season. An unregulated trickle charger is not.",
  },
];

export default function WinterGuidePage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: "Winter", path: "/guides/winter" },
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
              src="/shop/IMG_0402-covered-classic.jpeg"
              alt="Covered classic car in winter storage inside the 2240 Speed Shop building in Edmonton, Alberta"
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
              <span className="px-2 text-tungsten/50">/</span>
              <Link href="/guides" className="hover:text-bone">
                Guides
              </Link>
              <span className="px-2 text-tungsten/50">/</span>
              <span className="text-tungsten">Winter</span>
            </nav>

            <p className="mt-8 font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
              Pillar 03 · The Cold
            </p>
            <h1 data-fx="h" className="mt-4 font-display text-4xl leading-[0.95] tracking-wide text-bone sm:text-6xl">
              Winter storage and cold-weather
              <br />
              <span className="neon-red">survival for Alberta classics</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone">
              Storing a classic car through an Alberta winter comes down to eight jobs: stabilise
              the fuel, change the oil, protect the battery, over-inflate the tires, block the
              rodents out, control moisture, leave the park brake off, and cover it with something
              that breathes. Do them in October, not December.
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-steel">
              Everything below is written for a climate that reaches −40 and salts its roads with
              calcium-chloride brine. That combination does things to old iron that advice written
              anywhere warmer does not account for.
            </p>

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-tungsten">
              Updated August 2026 · Edmonton, Alberta
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5">
          {/* PREP TABLE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              How do you prepare a classic car for winter storage?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              One afternoon in late September or early October covers all of it. The deadline is
              the first hard freeze, not the first snow — and in this province those are not the
              same week.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <caption className="sr-only">
                  Winter storage preparation checklist for classic cars in Alberta
                </caption>
                <thead>
                  <tr className="border-b border-rust/50 text-left font-sub text-[11px] uppercase tracking-[0.18em] text-neon-bloom">
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Job
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      When
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Why it matters here
                    </th>
                  </tr>
                </thead>
                <tbody className="text-steel">
                  {prep.map((p) => (
                    <tr key={p.task} className="border-b border-rust/20 align-top">
                      <td className="py-4 pr-4 font-sub text-xs uppercase tracking-[0.14em] text-bone">
                        {p.task}
                      </td>
                      <td className="py-4 pr-4 font-mono text-[11px] text-tungsten">{p.when}</td>
                      <td className="py-4 leading-relaxed">{p.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="weld" />

          {/* FUEL */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Does fuel stabiliser actually matter?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              On a carburetted classic, more than any other item on the list. Ethanol-blended pump
              gasoline pulls water out of the air, and a half-empty steel tank in an unheated
              building is a condensation machine. Over six months that water finds carburetor
              castings, brass jets, fuel lines, and the bottom of the tank.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              The routine is simple. Fill the tank so there is less air in it. Add stabiliser at
              the dose on the bottle. Then run the engine for long enough that treated fuel is
              actually sitting in the carburetor bowls or fuel rail, not just in the tank — this is
              the step people skip, and it is the step that protects the expensive parts.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              One seasonal footnote: winter-blend pump fuel is formulated differently from summer
              blend, with more light components to help cold starting. It is fine to store, but it
              is another reason the car feels slightly different in April than it did in September.
              If your classic has a chronic hot-start or hesitation complaint that stabiliser does
              not fix, the carburetor is telling you something — that work lives on the{" "}
              <Link
                href="/services/classic-interiors-service"
                className="text-bone underline decoration-tungsten/40 underline-offset-4 hover:text-neon-bloom"
              >
                classic service
              </Link>{" "}
              side of the shop.
            </p>
          </section>

          <div className="weld" />

          {/* BATTERY + MICE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What kills a battery over an Alberta winter?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Discharge, then freezing. A fully charged lead-acid battery tolerates deep cold. A
              discharged one freezes, and a frozen battery is scrap. Parasitic draws from clocks,
              alarms, and aftermarket electronics do the discharging quietly over four months.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              A modern smart tender solves it — it monitors, charges, and floats, and it is safe to
              leave connected for the whole season. An old unregulated trickle charger is not the
              same device and will slowly boil a battery dry. If the storage building has no power,
              pull the battery and keep it somewhere above freezing on a tender.
            </p>

            <h3 className="mt-10 font-display text-2xl tracking-wide text-bone">
              How do you keep mice out of a stored car?
            </h3>
            <p className="mt-4 leading-relaxed text-steel">
              Deny entry, deny appeal, and trap outside the vehicle. Block the exhaust outlet and
              the air intake — steel wool or purpose-made plugs, and put a note on the steering
              wheel so you remember to remove them. Plug obvious cabin gaps. Take out floor mats,
              paper, and anything organic. Do not store pet food or bird seed in the same building.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Traps belong on the floor around the car, not inside it. Repellents placed in the
              cabin mostly teach mice to nest somewhere else in the same car. In spring, check
              headers, air cleaner housings, and heater boxes first — they are warm, enclosed, and
              exactly what a mouse is looking for. Chewed wiring insulation is the damage that turns
              a stored car into a shop visit.
            </p>
          </section>

          <div className="weld" />

          {/* MOISTURE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Heated or unheated storage — which is better?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Steady beats warm. A cold, dry, stable building is kinder to a car than a heated
              building that cycles: every warm-cold swing drives condensation onto cold metal, and
              condensation is what starts rust from the inside of a door or the top of a frame rail.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              The single biggest mistake is driving a salty car straight into storage. Edmonton
              treats its roads with calcium-chloride brine, which stays active far longer than dry
              rock salt and holds moisture against metal. A car put away with brine on the
              underside spends the winter being slowly eaten. Wash it — underside included — let it
              dry completely, then store it.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Other practical points: get the car off a bare concrete floor if you can, because
              concrete gives up moisture; use a breathable cover, never a plastic tarp; and if the
              space is genuinely damp, a dehumidifier or desiccant does more good than a heater.
            </p>
          </section>

          <div className="weld" />

          {/* HEATERS */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What do you plug in when it is minus thirty?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              For a car that is driven in the cold rather than stored, heat is the whole game. Cold
              oil is thick, cold batteries are weak, and cold cylinder walls do not vaporise fuel.
              Every hard cold start puts more wear into an engine than a week of normal driving.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <caption className="sr-only">
                  Cold-weather heating gear for classic and built engines in Alberta
                </caption>
                <thead>
                  <tr className="border-b border-rust/50 text-left font-sub text-[11px] uppercase tracking-[0.18em] text-neon-bloom">
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Gear
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      What it does
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      When to use it
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="text-steel">
                  {heaters.map((h) => (
                    <tr key={h.gear} className="border-b border-rust/20 align-top">
                      <td className="py-4 pr-4 font-sub text-xs uppercase tracking-[0.14em] text-bone">
                        {h.gear}
                      </td>
                      <td className="py-4 pr-4 leading-relaxed">{h.what}</td>
                      <td className="py-4 pr-4 font-mono text-[11px] leading-relaxed text-tungsten">
                        {h.when}
                      </td>
                      <td className="py-4 leading-relaxed">{h.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 leading-relaxed text-steel">
              A built engine cares more than a stock one. Looser bearing clearances and heavier oil
              mean a cold start puts more time between cranking and full oil pressure. If we built
              the motor, plug it in. That is why an{" "}
              <Link
                href="/services/engine-swaps-builds"
                className="text-bone underline decoration-tungsten/40 underline-offset-4 hover:text-neon-bloom"
              >
                Alberta engine swap
              </Link>{" "}
              gets specified around cold starting rather than around a dyno sheet.
            </p>
          </section>

          <div className="weld" />

          {/* COLD START */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Why does a carburetted engine start differently in the cold?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Because a carburetor has no idea how cold it is. Fuel injection reads air temperature,
              coolant temperature, and air density, and adds fuel accordingly. A carburetor relies
              on a mechanical choke that somebody set — correctly or not — and on fuel vaporising
              well enough to light. At −25 °C, gasoline does not want to vaporise, cold dense air
              leans the mixture, and thick oil drags the crank down while the cold battery is at its
              weakest.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              What actually fixes cold starting: a choke that is set and functioning, correct
              seasonal oil viscosity, a strong battery with clean grounds, fresh fuel, and a block
              heater. What does not fix it: cranking longer, pumping the pedal until the plugs are
              wet, or starting fluid, which washes the cylinder walls and is hard on an old engine.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Once it fires, drive it gently rather than idling in the driveway for fifteen minutes.
              A cold engine at idle runs rich, dilutes its own oil, and warms up slowly. Light load
              gets it to temperature faster and cleaner. And if you are chasing cold-start behaviour
              every single winter, the permanent fix is fuel injection — that conversion is where a
              cold-climate restomod earns its money.
            </p>
          </section>

          <div className="weld" />

          {/* SPRING */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What is the spring wake-up checklist?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Do not lead with the key. Everything that went wrong over the winter went wrong while
              you were not watching, and the cheapest time to find it is before the engine turns.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                [
                  "Look for tenants",
                  "Air cleaner, headers, heater box, and under the seats. Nesting material, chewed insulation, and stored seed are the signs. Fix wiring damage before power goes anywhere near it.",
                ],
                [
                  "Fluids and leaks",
                  "Check oil, coolant, brake fluid, and the floor under the car. A puddle that was not there in October tells you where to start.",
                ],
                [
                  "Brakes and tires",
                  "Surface rust on rotors and drums is normal. Seized calipers and a soft pedal are not. Set tire pressures back to normal and look for flat spots and cracking.",
                ],
                [
                  "Battery and grounds",
                  "Refit a fully charged battery, clean the terminals and the ground strap. Most spring electrical mysteries are a dirty ground.",
                ],
                [
                  "Prime, then start",
                  "Get oil pressure before load. Start the engine and let it come up to temperature gradually rather than revving it warm.",
                ],
                [
                  "First stop at walking pace",
                  "Test the brakes in the lot before you test them on 91 Avenue. Then take a short first drive and listen to the car instead of the radio.",
                ],
                [
                  "Wash the underside",
                  "Even a stored car picks up brine on the drive in and out. Spring is also pothole season, so check alignment and wheels after the first rough week.",
                ],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <span aria-hidden className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-tungsten/50" />
                  <p className="leading-relaxed text-steel">
                    <span className="text-bone">{title}.</span> {body}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-7 leading-relaxed text-steel">
              One timing note for anyone running a summer car on winter rubber or the other way
              around: around 7 °C is the accepted threshold where winter and all-season compounds
              swap advantage. In Edmonton that usually means late March at the earliest and often
              April, and the spring cold snap catches somebody out every year.
            </p>
          </section>

          <div className="weld" />

          {/* FAQ */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Alberta winter questions, answered
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
                ["/guides/costs", "What It Really Costs", "CAD ranges by scope, and where the money goes."],
                ["/guides/alberta-laws", "Alberta Law and Your Build", "Exhaust, tint, lift, inspections, plates, insurance."],
                ["/services/body-paint-metalwork", "Body, Paint & Metal", "What brine does, and how rust actually gets fixed."],
                ["/services/engine-swaps-builds", "Engine Swaps & Builds", "Old iron, modern heart — starts at minus thirty."],
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
        <section className="border-y border-tungsten/40 bg-panel/50">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
                Book the winter prep before the freeze.
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-steel">
                Fluids, fuel, battery, rodent-proofing, and a proper look underneath. Cheaper in
                October than in April.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="border border-tungsten/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_24px_rgba(255,176,102,0.15)]"
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
