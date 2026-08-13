import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Modified Vehicle Laws in Alberta — Exhaust, Tint, Lift, Plates",
  description:
    "A plain-language guide to modified vehicle laws in Alberta: exhaust noise rules and Edmonton enforcement, window tint limits, lift height, out-of-province inspections, antique plates, and insuring a modified or collector car.",
  alternates: { canonical: "/guides/alberta-laws" },
  openGraph: {
    type: "article",
    title: "Modified Vehicle Laws in Alberta — The Plain-Language Guide",
    description:
      "Exhaust, tint, lift height, inspections, rebuilt status, antique plates, and insurance for modified and collector cars in Alberta.",
    url: "/guides/alberta-laws",
  },
};

const faqs = [
  {
    q: "Are aftermarket exhausts legal in Alberta?",
    a: "An aftermarket exhaust is not automatically illegal, but Alberta's equipment rules require a working muffler, prohibit widened exhaust outlets, and prohibit devices that increase noise or produce flames or sparks. Excessive or unnecessary noise is separately enforceable. A well-built system that is quieter than stock at idle and does not shoot flames is generally the safe side of the line. Confirm specifics with Alberta Transportation.",
  },
  {
    q: "How much is the fine for a loud vehicle in Edmonton?",
    a: "Edmonton's noise bylaw, as amended in 2023, set a $1,000 first-offence fine for excessive vehicle noise, and council approved a $50,000 automated noise-monitoring pilot in August 2025 that requires provincial approval to issue tickets. Fine amounts and enforcement tools change, so confirm the current figure with the City of Edmonton before relying on it.",
  },
  {
    q: "What window tint is legal in Alberta?",
    a: "Alberta does not permit aftermarket tint on the windshield beyond a strip across the top of roughly 10 cm, and does not permit aftermarket tint on the front side windows. Rear side and rear windows are generally unrestricted provided the vehicle has working mirrors on both sides. Fines have been reported around $155 per window. Confirm current rules before you buy film.",
  },
  {
    q: "How high can you lift a truck in Alberta?",
    a: "Alberta's framework limits how far structural components may sit above the ground on an unloaded vehicle — commonly cited as roughly 500 mm, about 20 inches — and separately regulates bumper height. A lift can also trigger an inspection requirement. Because measurement points matter, confirm your specific setup with Alberta Transportation or an inspection facility before ordering a kit.",
  },
  {
    q: "What does an out-of-province inspection cost in Edmonton?",
    a: "Out-of-province inspections in Edmonton commonly run $200 to $350, with some shops advertising nearer $130 for a basic inspection. A failed inspection typically comes with a repair window of about 10 days and a free re-inspection. Common failures are unglamorous: wipers, lights, tires, and airbag warning lamps.",
  },
  {
    q: "Do you have to tell your insurer about modifications in Alberta?",
    a: "Yes. Alberta runs a private auto insurance market, and performance or appearance modifications are expected to be declared. Undeclared modifications can put a claim at risk, and some policies exclude or limit coverage for aftermarket equipment. Declare the build, get it in writing, and ask specifically how the modified parts are valued.",
  },
  {
    q: "What are antique plates in Alberta?",
    a: "Alberta's antique registration is generally available to vehicles 25 years or older and restricts use to things like parades, club activities, and events rather than everyday driving. The trade-off is reduced insurance and registration cost. If you plan to drive the car on regular weekends, standard registration usually fits better.",
  },
];

const framework = [
  {
    area: "Exhaust and noise",
    rule: "Muffler required. Widened outlets, noise-increasing devices, and flame or spark production are prohibited. Excessive or unnecessary noise is separately enforceable, and Edmonton has its own bylaw with a residential quiet period overnight.",
    confirm: "Alberta Transportation · City of Edmonton",
  },
  {
    area: "Window tint",
    rule: "No aftermarket tint on the windshield beyond a strip of roughly 10 cm across the top, and none on the front side windows. Rear glass is generally unrestricted where both side mirrors are present and working.",
    confirm: "Alberta Transportation · inspection facility",
  },
  {
    area: "Lift and suspension",
    rule: "Structural components are limited in how high they may sit above the ground on an unloaded vehicle — commonly cited at about 500 mm — and bumper-height rules apply separately. Significant changes can trigger inspection.",
    confirm: "Alberta Transportation · inspection facility",
  },
  {
    area: "Out-of-province vehicles",
    rule: "A vehicle brought in from another province generally needs an out-of-province inspection before it can be registered here. The interprovincial exemption that lets some vehicles skip it does not apply to lifted or lowered vehicles.",
    confirm: "Registry agent · licensed inspection facility",
  },
  {
    area: "Salvage and rebuilt",
    rule: "A written-off vehicle must go through a defined rebuild process — a work plan, pre-repair photographs, repairs to recognised collision standards, and a rebuilt inspection — before it can be registered again.",
    confirm: "Registry agent · licensed rebuilder",
  },
  {
    area: "Antique registration",
    rule: "Available to vehicles 25 years or older, with use restricted to events, parades, and club activity rather than daily driving. Lower cost to register and insure.",
    confirm: "Registry agent · your insurer",
  },
  {
    area: "Insurance",
    rule: "Alberta is a private insurance market. Performance and appearance modifications are expected to be declared, and undeclared work can put a claim at risk. Collector policies with agreed value are a separate product from a standard policy.",
    confirm: "Your broker or insurer",
  },
];

export default function AlbertaLawsGuidePage() {
  const crumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: "Alberta Laws", path: "/guides/alberta-laws" },
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
              src="/shop/IMG_0052-red-pickup-texaco.jpeg"
              alt="Restored red vintage pickup truck with period Texaco signage at 2240 Speed Shop in Edmonton, Alberta"
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
              <span className="text-tungsten">Alberta Laws</span>
            </nav>

            <p className="mt-8 font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
              Pillar 02 · The Rules
            </p>
            <h1 data-fx="h" className="mt-4 font-display text-4xl leading-[0.95] tracking-wide text-bone sm:text-6xl">
              Modified vehicle laws
              <br />
              <span className="neon-red">in Alberta</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone">
              Alberta regulates modified vehicles mainly through equipment rules, inspections, and
              insurance disclosure rather than a single &ldquo;modified car&rdquo; law. Exhaust
              noise, window tint, lift height, out-of-province inspections, rebuilt status, and
              antique plates are the six areas that catch most builds.
            </p>

            <div className="mt-8 max-w-2xl border-l-2 border-tungsten/70 bg-panel/60 p-5">
              <p className="font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom">
                Read this first
              </p>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                This is a plain-language overview written by a shop, not legal advice, and rules,
                fines, and enforcement change. Before you commit money to a build, confirm the
                current requirement with Alberta Transportation, a registry agent, a licensed
                inspection facility, or your insurer. Where a figure below is dated or approximate,
                it is flagged as such on purpose.
              </p>
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-tungsten">
              Updated August 2026 · Edmonton, Alberta
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5">
          {/* OVERVIEW TABLE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What does Alberta actually regulate on a modified vehicle?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Seven areas, and one office that gives the binding answer for each. Use this as the
              map, then confirm the detail with the body in the right-hand column before you order
              parts.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <caption className="sr-only">
                  Framework of Alberta modified vehicle rules and where to confirm each one
                </caption>
                <thead>
                  <tr className="border-b border-rust/50 text-left font-sub text-[11px] uppercase tracking-[0.18em] text-neon-bloom">
                    <th scope="col" className="py-3 pr-4 font-normal">
                      Area
                    </th>
                    <th scope="col" className="py-3 pr-4 font-normal">
                      General framework
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Confirm with
                    </th>
                  </tr>
                </thead>
                <tbody className="text-steel">
                  {framework.map((f) => (
                    <tr key={f.area} className="border-b border-rust/20 align-top">
                      <td className="py-4 pr-4 font-sub text-xs uppercase tracking-[0.14em] text-bone">
                        {f.area}
                      </td>
                      <td className="py-4 pr-4 leading-relaxed">{f.rule}</td>
                      <td className="py-4 font-mono text-[11px] leading-relaxed text-tungsten">
                        {f.confirm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="weld" />

          {/* EXHAUST */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Are aftermarket exhausts legal in Alberta?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              An aftermarket exhaust is not illegal by definition. Alberta&rsquo;s vehicle equipment
              rules require a functioning muffler, prohibit widening the exhaust outlet, and
              prohibit any device that increases noise or throws flames or sparks. Separately, loud
              and unnecessary noise is enforceable in its own right, and there is a residential
              quiet provision overnight.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              In practice, the thing that gets people ticketed is not the brand of muffler. It is
              behaviour: revving at a light, cold-start pops at seven in the morning, cutouts open
              through a residential street. A system built to sound good under load and behave at
              idle is a different animal from a straight pipe.
            </p>

            <h3 className="mt-9 font-display text-2xl tracking-wide text-bone">
              What is happening with noise enforcement in Edmonton?
            </h3>
            <p className="mt-4 leading-relaxed text-steel">
              Edmonton amended its noise bylaw in 2023 with a $1,000 first-offence fine for
              excessive vehicle noise, and council approved a $50,000 automated noise-monitoring
              pilot in August 2025. Automated ticketing of that kind needs provincial approval to
              proceed, so the practical picture is still moving. Cruising season is enforcement
              season — assume attention in May through September, particularly downtown and on the
              known cruise routes.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Treat the fine figure above as a 2023 amendment amount, not a guaranteed current
              number. Check with the City of Edmonton before you rely on it.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Building a system that sounds like the car should and still keeps you out of trouble
              is a fabrication problem, not a compliance loophole. That work lives on the{" "}
              <Link
                href="/services/classic-performance-tuning"
                className="text-bone underline decoration-tungsten/40 underline-offset-4 hover:text-neon-bloom"
              >
                performance and tuning
              </Link>{" "}
              page.
            </p>
          </section>

          <div className="weld" />

          {/* TINT */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What window tint is legal in Alberta?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Alberta is strict at the front and relaxed at the back. Aftermarket film is not
              permitted on the windshield apart from a strip across the top of roughly 10 cm, and it
              is not permitted on the front side windows at all. Behind the driver, tint is
              generally unrestricted provided the vehicle has working mirrors on both sides.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Reported fines have been in the region of $155 per offending window, which makes a
              cheap front-window job an expensive one. Two practical notes for classic owners.
              First, factory-tinted glass is not the same thing as aftermarket film — original
              glass is judged on its own terms. Second, clear paint protection film and clear UV
              film are a different product from tint; if light transmission is not reduced, the tint
              rule is not the rule being applied. Confirm the specifics before buying either.
            </p>
          </section>

          <div className="weld" />

          {/* LIFT */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              How high can you legally lift a truck in Alberta?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Alberta&rsquo;s framework works on how far structural components sit above the ground
              on an unloaded vehicle — the figure commonly cited is about 500 mm, roughly 20 inches
              — with separate rules governing bumper height. Because what counts as a structural
              component and where it is measured both matter, this is a rule you confirm against
              your specific truck rather than against an internet number.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Two knock-on effects that catch people. A significant suspension change can put the
              vehicle into inspection territory. And a lifted or lowered vehicle is excluded from
              the interprovincial arrangement that lets some vehicles skip an out-of-province
              inspection — so the lift that was fine in Saskatchewan becomes a booking at an
              Alberta inspection facility.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              Lowering has the same logic in reverse. Ride height, headlight aim, and bumper
              position are all fair game at inspection, and a car that scrapes its way over
              Edmonton&rsquo;s spring potholes has a maintenance problem as well as a legal one.
            </p>
          </section>

          <div className="weld" />

          {/* OOP */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What happens at an out-of-province inspection?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Bring a vehicle into Alberta from another province and it generally needs an
              out-of-province inspection before it can be registered here. In Edmonton the
              inspection commonly runs $200 to $350, with some shops advertising nearer $130 for a
              basic version — worth asking what the cheaper number includes.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              A fail is not a disaster. There is normally a repair window of about 10 days and a
              free re-inspection inside it. The failures that actually happen are mundane: wipers,
              lights, tires, brakes, and airbag warning lamps. The expensive surprises are structural
              — frame rot and previous collision repair that was never done to standard.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              The trap for enthusiasts is the interprovincial exemption. It exists, and it does not
              cover lifted or lowered vehicles. If your car or truck sits at anything other than
              factory ride height, plan on the full inspection.
            </p>
          </section>

          <div className="weld" />

          {/* SALVAGE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Can you build a written-off car and register it again?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Sometimes, and the process is deliberately paperwork-heavy. Alberta separates
              vehicles that may be repaired and re-registered from vehicles that may not, so the
              first question about any auction find is which category it is in. Getting a repairable
              one back on the road generally involves a work plan filed before repairs begin,
              photographs of the damage taken before anything is fixed — four or more is the
              commonly cited minimum — repairs performed to recognised collision-repair standards,
              and a rebuilt inspection at the end.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              The rebuilt certificate has a short validity window, commonly cited at 14 days, so
              the registry visit is booked around the inspection rather than the other way round.
              Rebuilt status stays on the vehicle&rsquo;s record and affects both resale and what
              insurers will offer. For a builder, that can be an acceptable trade on a car you are
              keeping. It is a poor trade on a car you intend to sell.
            </p>
          </section>

          <div className="weld" />

          {/* PLATES + INSURANCE */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Antique plates or regular plates?
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Alberta&rsquo;s antique registration is generally open to vehicles 25 years and older,
              and it trades cost for freedom. Registration and insurance are cheaper. Use is
              restricted to things like parades, club activities, and events rather than errands and
              commuting.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              The decision comes down to one question: how do you actually use the car? A trailered
              show car or a parade-only survivor fits antique registration neatly. A restomod you
              intend to drive on any decent Saturday from May to September does not, and the
              cheaper plate is a false economy the first time it matters.
            </p>

            <h3 className="mt-10 font-display text-2xl tracking-wide text-bone">
              Do you have to declare modifications to your insurer?
            </h3>
            <p className="mt-4 leading-relaxed text-steel">
              Yes, and this is the part of the guide that costs the most money when ignored. Alberta
              runs a private auto insurance market, which means coverage terms vary between
              insurers instead of being set provincially. Performance and appearance modifications
              are expected to be declared. Undeclared work can put a claim at risk, and some
              policies limit or exclude aftermarket equipment even when the vehicle itself is
              covered.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              For a finished classic or a restomod, the product to ask about is a collector policy
              with an agreed value rather than actual cash value. A restomod has no book value —
              there is no price-guide entry for a one-off build — so an appraisal and a documented
              build file are what stand between you and a lowball settlement. Keep receipts, keep
              photographs of each stage, and keep the build sheet.
            </p>
            <p className="mt-5 leading-relaxed text-steel">
              We are a shop, not brokers. Ask your own insurer how they treat your specific build,
              and get the answer in writing.
            </p>
          </section>

          <div className="weld" />

          {/* FAQ */}
          <section className="py-14 sm:py-16">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Alberta modified vehicle questions, answered
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
                ["/guides/costs", "What It Really Costs", "CAD ranges by scope, and why quotes vary."],
                ["/guides/winter", "The Minus Forty Moat", "Storage, cold starts, and spring wake-up."],
                ["/services/engine-swaps-builds", "Engine Swaps & Builds", "LS and diesel conversions, and the paperwork that follows one."],
                ["/services/body-paint-metalwork", "Body, Paint & Metal", "Rust repair and metalwork that passes an inspection."],
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
                Planning a build? Ask before you cut.
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-steel">
                Tell us what you want the car to do and where you want to drive it. We will build it
                so it can be plated, insured, and inspected.
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
      </article>
    </>
  );
}
