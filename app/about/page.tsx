import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site, services } from "@/lib/site";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terry Harmider — Owner of 2240 Speed Shop, Edmonton",
  description:
    "Terry Harmider owns and runs 2240 Speed Shop, the customs-and-classics garage at 2009 91 Ave NW in east Edmonton. The steel sign, the Dodge D100, the September run to Radium — the story behind the shop.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Terry Harmider — Owner, 2240 Speed Shop Edmonton",
    description:
      "Owner-operator. Customs and classics. The man every review names, and the shop he built on the Sherwood Park line.",
    url: "/about",
  },
};

// Same @id the AutoRepair node uses in lib/schema.tsx — one entity, many nodes.
const BUSINESS_ID = `${site.url}/#shop`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/about#terry-harmider`,
  name: site.owner,
  givenName: "Terry",
  familyName: "Harmider",
  jobTitle: "Owner",
  url: `${site.url}/about`,
  image: `${site.url}/shop/IMG_0446-team-photo.jpeg`,
  description:
    "Terry Harmider is the owner of 2240 Speed Shop, a customs-and-classics restoration shop in east Edmonton, Alberta.",
  worksFor: { "@id": BUSINESS_ID },
  owns: { "@id": BUSINESS_ID },
  knowsAbout: [
    "Classic car restoration",
    "Restomod builds",
    "Hot rod fabrication",
    "Engine swaps",
    "Automotive rust repair",
    "Classic car interiors",
  ],
  workLocation: {
    "@type": "Place",
    name: site.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      addressLocality: site.city,
      addressRegion: site.region,
      postalCode: site.postalCode,
      addressCountry: site.country,
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Terry", path: "/about" },
        ])}
      />
      <JsonLd data={personSchema} />

      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-rust/25">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
            Owner · 2240 Speed Shop
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.92] tracking-wide text-bone sm:text-7xl">
            Terry Harmider
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-bone">
            Terry Harmider owns and runs 2240 Speed Shop, the customs-and-classics garage at{" "}
            {site.street} in east Edmonton. He is the one who reads the quote requests, scopes the
            builds, and answers the phone. Every review with words in it names him personally. The
            brand is the man.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- the story */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Who is Terry Harmider?
            </h2>
            <div className="mt-5 space-y-5 font-body text-[15px] leading-relaxed text-steel">
              <p>
                He is the owner of a working garage on 91 Avenue, not a franchise operator with a
                logo package. The shop calls itself customs and classics because that is what Terry
                put on the front of the building long before anybody suggested he needed a website.
                The sign reads CLASSICS AND CUSTOMS. The bio reads customs and classics. Either way
                you know exactly what you are looking at.
              </p>
              <p>
                What comes through that door is a wide spread. Frame-off restorations. Restomods
                that keep the skin and modernize everything under it. LS and diesel conversions.
                Rust cut out of quarters and floors that Alberta winters have been working on for
                fifty years. British roadsters and Detroit muscle share the same bay.
              </p>
              <p>
                The through-line is not a specialty. It is a standard. Old cars are honest about
                whether the person working on them cares, and the shop&apos;s reputation was built
                by people who came back a second and third time — the kind of reviews that use the
                word <span className="text-bone">quality</span> and then name the man who delivered
                it.
              </p>
            </div>

            <div className="weld my-10" />

            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              What does the sign mean?
            </h2>
            <div className="mt-5 space-y-5 font-body text-[15px] leading-relaxed text-steel">
              <p>
                Above the door on the pale green siding hangs a disc cut from steel plate:{" "}
                <span className="text-bone">SPEED SHOP</span> arced over the top,{" "}
                <span className="text-bone">2240</span> across the middle with a pair of wrenches
                crossed behind the numbers, <span className="text-bone">CLASSICS AND CUSTOMS</span>{" "}
                arced underneath, and a star on each shoulder. The steel has gone rust-brown outside
                through however many Edmonton winters it has stood there.
              </p>
              <p>
                It is not a vinyl banner and it did not come from a sign shop&apos;s catalogue. It
                is a fabricated object, hung on a building, in the same material the shop works in
                every day. That is the whole brand: cut it, hang it, let the weather do the rest.
              </p>
              <p>
                We built this site around that sign rather than around a stock photo of somebody
                else&apos;s garage.
              </p>
            </div>
          </div>

          <figure className="lg:sticky lg:top-24">
            <div className="plate relative aspect-[3/4] overflow-hidden">
              <Image
                src="/shop/IMG_2943-original.jpeg"
                alt="The cut-steel Speed Shop 2240 Classics and Customs sign with crossed wrenches above the door of 2240 Speed Shop in Edmonton"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="graded object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-steel/70">
              {site.street} — the sign, the maroon door, and a winter that is not finished with it
              yet.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------------------------------------------------- the D100 */}
      <section className="border-y border-rust/25 bg-panel/40">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="font-sub text-[11px] uppercase tracking-[0.28em] text-neon-bloom">
            The standard, stated plainly
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[0.95] tracking-wide text-bone sm:text-5xl">
            A photographer pulled over for the D100.
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-5 font-body text-[15px] leading-relaxed text-steel">
              <p>
                The shop&apos;s 1960s Dodge D100 has a light patch worn into the hood where decades
                of sun and hands took the paint back. In September 2025 a photographer driving past
                saw it, pulled over, and shot the truck on the spot — camera already in the car,
                trip interrupted.
              </p>
              <p>
                Nobody staged that. It is the clearest statement of what the shop is after: build
                things that make strangers stop in traffic. Not the shiniest car at the show — the
                one people walk back to.
              </p>
            </div>
            <div className="space-y-5 font-body text-[15px] leading-relaxed text-steel">
              <p>
                Every September the shop runs the road to Radium for the Columbia Valley Classics
                Show &amp; Shine — a thousand-plus classics parked in a mountain town, and the one
                weekend a year the tools go quiet. If you want to meet Terry without booking
                anything, that is where he is.
              </p>
              <p>
                The rest of the year he is here, and the shop soundtrack is Metallica and Guns
                N&apos; Roses at working volume. Nobody is going to apologize for that.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/builds"
              className="border border-speed-red/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
            >
              See the builds
            </Link>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-steel/35 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- the room */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <figure>
            <div className="plate relative aspect-[4/3] overflow-hidden">
              <Image
                src="/shop/IMG_0446-team-photo.jpeg"
                alt="The front room at 2240 Speed Shop in Edmonton, with vintage Coca-Cola, Hires and Mopar Performance signs above the table"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="graded object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-steel/70">
              The front room. Coca-Cola, Hires, Pepsi, Mopar Performance — and a birthday cake on a
              table with an exhaust tip lying across it.
            </figcaption>
          </figure>

          <div>
            <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Where the scope conversation happens
            </h2>
            <div className="mt-5 space-y-5 font-body text-[15px] leading-relaxed text-steel">
              <p>
                There is a room at the front with orange walls, old porcelain soda signs, a Mopar
                Performance banner, and a table big enough to spread photos across. That is where
                builds get argued out before anything gets cut.
              </p>
              <p>
                It is also where birthdays happen, where lunch happens, and where a customer who
                shows up with a barn find on a trailer gets a coffee and a straight opinion about
                whether it is worth saving. Sometimes the answer is no. You get told that either
                way.
              </p>
              <p>
                A shop this size only takes on what it can finish properly, which is why booking a
                build slot is a conversation and not a checkout button.
              </p>
            </div>

            <div className="mt-8 border border-rust/30 p-6">
              <p className="font-sub text-[10px] uppercase tracking-[0.26em] text-neon-bloom">
                What Terry will tell you himself
              </p>
              <ul className="mt-4 space-y-3 font-body text-sm leading-relaxed text-steel">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-speed-red" />
                  <span>What is actually rusted, before you spend money on paint.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-speed-red" />
                  <span>Whether your car is worth restoring, or worth selling to somebody who wants that one.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-speed-red" />
                  <span>Which half of the budget to spend first so the car is usable sooner.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- the trades */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="weld" />
        <h2 className="mt-12 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What the shop does
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug} className="plate p-6">
              <h3 className="font-sub text-[12px] uppercase tracking-[0.18em] text-bone">
                <Link className="hover:text-neon-bloom" href={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col gap-6 border border-speed-red/45 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl tracking-wide text-bone">
              Got a project? Let&apos;s talk straight.
            </h2>
            <p className="mt-3 font-body text-[15px] leading-relaxed text-steel">
              Photos in, honest scope out. Two business days. Terry reads every one himself.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="border border-speed-red/70 px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
            >
              Start your quote
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="border border-steel/35 px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
