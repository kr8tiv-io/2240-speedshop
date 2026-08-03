import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { InstagramGrid } from "@/components/InstagramGrid";
import { Section } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { areas, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Speed Shop Edmonton | Custom Car Shop & Classic Builds — 2240 Speed Shop",
  },
  description:
    "2240 Speed Shop is Terry Harmider's custom car shop in Edmonton, Alberta — classic restorations, restomods, hot rods, LS and diesel swaps, body, paint, and interiors. On the Sherwood Park line.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: site.name,
    title: "Speed Shop Edmonton — Customs and Classics, Built in Edmonton",
    description:
      "Restorations, restomods, and engine swaps from a working shop on the Sherwood Park line.",
    images: [
      {
        url: "/shop/IMG_1949-blue-pickup.png",
        width: 2560,
        height: 1177,
        alt: "Custom blue vintage pickup truck built by 2240 Speed Shop in Edmonton",
      },
    ],
  },
};

const hours = site.hours[0];
const hoursLine = `Mon–Fri ${hours.opens}–${hours.closes}`;

const builds = [
  {
    slug: "blue-pickup-restomod",
    title: "Blue Pickup Restomod",
    trade: "Restomod",
    line: "Vintage pickup, lowered, sitting on polished rims.",
    image: "/shop/IMG_1949-blue-pickup.png",
    alt: "Custom blue vintage pickup truck lowered on polished rims, a restomod build by 2240 Speed Shop Edmonton",
  },
  {
    slug: "black-muscle-car",
    title: "Black Muscle Car",
    trade: "Engine swap",
    line: "Intake breathing through the hood, drivetrain on the bench.",
    image: "/shop/IMG_0434-black-muscle-car.jpeg",
    alt: "Black muscle car with an exposed air intake during an engine swap at 2240 Speed Shop in Edmonton",
  },
  {
    slug: "black-classic-restoration",
    title: "Black Classic",
    trade: "Restoration",
    line: "Long-haul classic car restoration, one panel at a time.",
    image: "/shop/IMG_0051-mission-black-classic.jpeg",
    alt: "Vintage black classic car under restoration inside the 2240 Speed Shop garage in Edmonton",
  },
] as const;

const process = [
  {
    step: "Talk it through",
    body: "Send photos. Tell us what the vehicle is and where you want it to end up. No sales pitch.",
  },
  {
    step: "Real scope",
    body: "Honest scope, real hours. What it needs, what it does not need, and where the cost sits before a bolt moves.",
  },
  {
    step: "Build",
    body: "Metal first, then mechanical, then paint and trim. Photos as it moves, so nothing is a surprise at pickup.",
  },
  {
    step: "Shakedown",
    body: "Nothing leaves on a trailer of hope. It gets driven, sorted, and driven again.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* S1 — HERO. The 3D drift lives here; it is decoration over real HTML. */}
      <Hero />

      {/* S2 — ENTITY BLOCK. Answer-first, machine-liftable: who, what, where. */}
      <Section id="who" eyebrow="Edmonton, Alberta" labelledBy="entity-heading">
        <div className="border border-l-2 border-rust/40 border-l-speed-red bg-panel/60 p-7 sm:p-10">
          <h2
            id="entity-heading"
            className="font-display text-3xl uppercase leading-none tracking-wide text-bone sm:text-4xl"
          >
            What is 2240 Speed Shop?
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-bone">
            2240 Speed Shop is {site.owner}&rsquo;s customs-and-classics shop at {site.street},{" "}
            {site.city}{" "}
            &mdash; right on the Sherwood Park boundary. Full restorations, hot rods and
            restomods, LS and diesel conversions, body, paint, and classic interiors. Serving
            Edmonton, Sherwood Park, St. Albert, Leduc, and Spruce Grove. Owner-operated, Monday to
            Friday, nine to five.
          </p>

          <dl className="mt-8 grid gap-6 border-t border-rust/25 pt-6 font-mono text-xs text-steel sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-sub uppercase tracking-[0.2em] text-neon-bloom">Address</dt>
              <dd className="mt-2 leading-relaxed">
                {site.street}
                <br />
                {site.city}, {site.region} {site.postalCode}
              </dd>
            </div>
            <div>
              <dt className="font-sub uppercase tracking-[0.2em] text-neon-bloom">Phone</dt>
              <dd className="mt-2">
                <a className="hover:text-bone" href={`tel:${site.phone}`}>
                  {site.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-sub uppercase tracking-[0.2em] text-neon-bloom">Hours</dt>
              <dd className="mt-2">{hoursLine}</dd>
            </div>
            <div>
              <dt className="font-sub uppercase tracking-[0.2em] text-neon-bloom">Owner</dt>
              <dd className="mt-2">{site.owner}</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* S3 — SIGNATURE PROOF: the D100. */}
      <Section
        id="d100"
        eyebrow="Signature build"
        divider
        labelledBy="d100-heading"
        className="bg-panel/30"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2
              id="d100-heading"
              className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone sm:text-6xl"
            >
              The truck a photographer pulled over for
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              The light patch on the hood of our &rsquo;60s Dodge D100 stopped a passing
              photographer mid-drive. She shot it on the spot. That is the bar in this shop &mdash;
              build things people cannot drive past.
            </p>
            <Link
              href="/builds/1960s-dodge-d100"
              className="mt-8 inline-flex items-center gap-3 border border-speed-red/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.22em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
            >
              The D100&rsquo;s build page
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <figure className="relative aspect-[4/5] w-full overflow-hidden border border-rust/30">
            <Image
              src="/shop/ig-D100-slide1-fullres.jpg"
              alt="1960s Dodge D100 classic pickup truck with original patina and a light patch on the hood, built at 2240 Speed Shop in Edmonton"
              fill
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="graded object-cover"
            />
          </figure>
        </div>
      </Section>

      {/* S4 — SIX TRADES. One pillar page per keyword cluster. */}
      <Section id="services" eyebrow="What we do" divider labelledBy="services-heading">
        <h2
          id="services-heading"
          className="font-display text-4xl uppercase leading-none tracking-wide text-bone sm:text-5xl"
        >
          What does 2240 Speed Shop do?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel">
          Six trades, one roof, one standard. Restoration, restomods and hot rods, engine swaps,
          performance and tuning, body and metal, interiors and classic service.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              blurb={s.blurb}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      {/* S5 — RECENT BUILDS. Proof band. */}
      <Section
        id="builds"
        eyebrow="Recent builds"
        divider
        labelledBy="builds-heading"
        className="bg-panel/30"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="builds-heading"
            className="font-display text-4xl uppercase leading-none tracking-wide text-bone sm:text-5xl"
          >
            Fresh off the hoist
          </h2>
          <Link
            href="/builds"
            className="font-sub text-[11px] uppercase tracking-[0.22em] text-steel transition-colors hover:text-neon-bloom"
          >
            All builds <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((b) => (
            <Link key={b.slug} href={`/builds/${b.slug}`} className="plate group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={b.image}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                  className="graded object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-[11px] uppercase tracking-widest text-rust">
                  {b.trade}
                </span>
                <h3 className="mt-2 font-display text-2xl uppercase leading-none tracking-wide text-bone">
                  {b.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{b.line}</p>
                <span className="mt-5 font-sub text-[11px] uppercase tracking-[0.22em] text-steel transition-colors group-hover:text-neon-bloom">
                  The build <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* S6 — PROCESS. Four steps, no mystery. */}
      <Section id="process" eyebrow="Why 2240" divider labelledBy="process-heading">
        <h2
          id="process-heading"
          className="font-display text-4xl uppercase leading-none tracking-wide text-bone sm:text-5xl"
        >
          How does a build actually go?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel">
          Four steps. You know the scope before the work starts, and you see the vehicle the whole
          way through.
        </p>

        <ol className="mt-12 grid gap-px border border-rust/25 bg-rust/25 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <li key={p.step} className="bg-bay-black p-6">
              <span className="font-mono text-sm text-neon-bloom">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl uppercase leading-none tracking-wide text-bone">
                {p.step}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* S7 — AREAS. */}
      <Section
        id="areas"
        eyebrow="Where we work"
        divider
        labelledBy="areas-heading"
        className="bg-panel/30"
      >
        <h2
          id="areas-heading"
          className="max-w-4xl font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone sm:text-5xl"
        >
          East Edmonton. Sherwood Park line. Worth the drive from anywhere.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel">
          The shop sits in southeast Edmonton, minutes off the Sherwood Park boundary. Projects come
          in from across the metro and the county roads past it.
        </p>

        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <Link
              href="/edmonton"
              className="inline-block border border-rust/40 px-5 py-2 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-neon-bloom hover:text-neon-bloom"
            >
              Edmonton
            </Link>
          </li>
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/edmonton/${a.slug}`}
                className="inline-block border border-rust/40 px-5 py-2 font-sub text-xs uppercase tracking-[0.2em] text-steel transition-colors hover:border-neon-bloom hover:text-neon-bloom"
              >
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* S8 — INSTAGRAM. */}
      <Section id="instagram" eyebrow="Instagram" divider labelledBy="instagram-heading">
        <InstagramGrid />
      </Section>

      {/* S9 — CLOSING CTA. */}
      <Section
        id="start"
        labelledBy="cta-heading"
        className="border-t border-speed-red/40 bg-panel/70"
      >
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="cta-heading"
              className="neon-red font-display text-5xl uppercase leading-none tracking-wide sm:text-7xl"
            >
              Start your build
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel">
              Barn find, stalled project, or a driver that deserves better. Photos in, honest scope
              out.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-3 border border-speed-red bg-speed-red/10 px-8 py-4 font-sub text-sm uppercase tracking-[0.22em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_24px_rgba(224,69,69,0.5)]"
            >
              Start your build
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <div className="font-mono text-sm text-steel">
              <a className="block text-bone hover:text-neon-bloom" href={`tel:${site.phone}`}>
                {site.phoneDisplay}
              </a>
              <span className="mt-1 block">{hoursLine}</span>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
