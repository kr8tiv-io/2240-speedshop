import type { Metadata } from "next";
import Link from "next/link";
import { builds } from "@/lib/builds";
import { site, services } from "@/lib/site";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { Kinetic } from "@/components/fx/Kinetic";
import { GLImage } from "@/components/gl/GLImage";

export const metadata: Metadata = {
  title: "Custom Car Builds Edmonton — Restorations, Restomods & Project Rescues",
  description:
    "Custom car builds in Edmonton from 2240 Speed Shop: a patina 1960s Dodge D100, a green hardtop coupe, a red 1950s stepside, a lowered shortbox pickup, and a stalled project down to bare steel.",
  alternates: { canonical: "/builds" },
  openGraph: {
    type: "website",
    title: "Custom Car Builds Edmonton — 2240 Speed Shop",
    description:
      "Real vehicles photographed in and around the shop on 91 Ave NW. What condition they were in, and the work a vehicle like that takes.",
    images: ["/shop/ig-D100-slide1-fullres.jpg"],
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Custom car builds by 2240 Speed Shop, Edmonton",
  description:
    "Classic car and truck build case studies from 2240 Speed Shop in Edmonton, Alberta.",
  numberOfItems: builds.length,
  itemListElement: builds.map((b, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: b.title,
    url: `${site.url}/builds/${b.slug}`,
  })),
};

export default function BuildsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Builds", path: "/builds" },
        ])}
      />
      <JsonLd data={itemListSchema} />

      <nav aria-label="Breadcrumb" className="font-mono text-xs text-steel">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="hover:text-bone" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-tungsten/50">
            /
          </li>
          <li aria-current="page" className="text-bone">
            Builds
          </li>
        </ol>
      </nav>

      <header className="mt-8 max-w-4xl">
        <p className="corner-note text-tungsten">THE PROOF LAYER</p>
        <Kinetic
          as="h1"
          trigger="mount"
          className="mt-3 font-display text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[0.88] tracking-wide text-bone"
        >
          Custom car builds — Edmonton
        </Kinetic>
        <div className="weld mt-6 max-w-md" />
        <p className="mt-6 text-lg leading-relaxed text-bone">
          2240 Speed Shop builds custom cars and classic trucks in Edmonton — full restorations,
          restomods, engine swaps, and stalled projects finished properly. These are real vehicles
          photographed in and around the shop at {site.street}. Each page shows the condition the
          vehicle was in and the work a vehicle like it takes.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-steel">
          No stock photography, no borrowed portfolios. If it is on this page it was in front of the
          bay doors.
        </p>
      </header>

      <section aria-labelledby="the-work" className="mt-16">
        <h2 id="the-work" className="sr-only">
          What has come through the shop
        </h2>
        <ul className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((build, i) => {
            const cover = build.images[0];
            return (
              <li key={build.slug} {...(i % 3 === 1 ? { "data-drift": "22" } : {})}>
                <Link
                  href={`/builds/${build.slug}`}
                  data-cursor="view"
                  className="backlit group block h-full !bg-transparent"
                >
                  <GLImage
                    src={cover.src}
                    alt={cover.alt}
                    zoom={cover.zoom ?? 1}
                    eager={i === 0}
                    fig={String(i + 1).padStart(2, "0")}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={`w-full ${cover.aspect}`}
                  />
                  <div className="p-5">
                    <p className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-steel">
                      <span>{build.era}</span>
                      <span className="text-tungsten">{build.stage}</span>
                    </p>
                    <h3 className="mt-3 font-display text-2xl tracking-wide text-bone">
                      {build.cardTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{build.card}</p>
                    <p className="mt-4 font-sub text-[11px] uppercase tracking-[0.22em] text-neon-bloom">
                      See the build →
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="how-we-work" className="mt-20 max-w-3xl">
        <h2 id="how-we-work" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          How does a build actually get started?
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ol className="mt-6 space-y-4 text-base leading-relaxed text-steel">
          <li>
            <span className="font-mono text-xs text-tungsten">01 </span>
            <span className="text-bone">Photos in.</span> Send what you have — the seams, the
            underside, the boxes of parts in the corner. Terry looks at everything himself.
          </li>
          <li>
            <span className="font-mono text-xs text-tungsten">02 </span>
            <span className="text-bone">The vehicle gets read.</span> Steel first. Nothing is
            ordered and nothing is promised until somebody has actually looked at what is rotten.
          </li>
          <li>
            <span className="font-mono text-xs text-tungsten">03 </span>
            <span className="text-bone">Scope in writing.</span> Order of operations, what happens
            first, and where the money goes. Honest scope, real hours, one standard.
          </li>
          <li>
            <span className="font-mono text-xs text-tungsten">04 </span>
            <span className="text-bone">Work starts.</span> Photos at stages. You are never guessing
            what happened this week.
          </li>
        </ol>
      </section>

      <section aria-labelledby="trades" className="mt-20">
        <h2 id="trades" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Which trade does your build need?
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="plate block h-full p-5 transition-colors"
              >
                <p className="font-display text-xl tracking-wide text-bone">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel">{s.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="builds-cta"
        className="mt-20 border border-tungsten/50 bg-panel px-6 py-10 sm:px-10"
      >
        <h2 id="builds-cta" className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
          Got a project sitting?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel">
          Barn find, stalled build, or a daily that deserves better. Photos in, honest scope out.
          Two business days.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link
            href="/quote"
            className="border border-rust px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)]"
          >
            Start your quote
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-steel"
          >
            {site.phoneDisplay}
          </a>
          <Link
            href="/edmonton"
            className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-steel"
          >
            Where we are
          </Link>
        </div>
      </section>
    </div>
  );
}
