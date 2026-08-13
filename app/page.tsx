import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeCinema } from "@/components/home/HomeCinema";
import { HomeFx } from "@/components/home/HomeFx";
import { ProcessRail } from "@/components/home/ProcessRail";
import { ReviewsCinema } from "@/components/home/ReviewsCinema";
import { Marquee } from "@/components/fx/Marquee";
import { Kinetic } from "@/components/fx/Kinetic";
import { Roll } from "@/components/fx/Roll";
import { GLImage } from "@/components/gl/GLImage";
import { InstagramGrid } from "@/components/InstagramGrid";
import { builds } from "@/lib/builds";
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

/* Real builds, real slugs — straight from lib/builds.ts. */
const featured = builds.filter((b) =>
  ["blue-lowered-pickup", "red-stepside-pickup", "1960s-dodge-d100"].includes(b.slug),
);

/* Verbatim from public Google reviews — same three the reviews page carries. */
const quotes = [
  { text: "Terry builds beautiful Cars", when: "Google review · July 2026" },
  {
    text: "outstanding service… recommend this shop for your vintage auto needs",
    when: "Google review · 2025",
  },
  { text: "Terrific quality work", when: "Google review · July 2026" },
];

/**
 * The homepage is a film: preloader → one WebGL hero with scroll-as-camera
 * chapters → then the page continues as normal DOM sections. Every word on
 * this page ships in the server-rendered HTML.
 */
export default function HomePage() {
  return (
    <div>
      {/* Scroll choreography outside the film: tone handoffs + services fx. */}
      <HomeFx />

      {/* THE FILM — preloader, three cars, two written interludes, one timeline. */}
      <div className="-mt-[76px]">
        <HomeCinema />
      </div>
      {/* The film dissolves into the page instead of stopping at an edge. */}
      <div className="film-handoff" aria-hidden="true" />

      {/* ENTITY BLOCK — answer-first, machine-liftable, instrument-panel NAP. */}
      <section aria-labelledby="entity-heading" className="relative px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex items-baseline justify-between gap-4">
            <p className="corner-note text-tungsten">EST. EDMONTON · {site.postalCode}</p>
            <p className="corner-note hidden sm:block">SEC. 01 — IDENT</p>
          </div>
          <Kinetic
            as="h2"
            id="entity-heading"
            className="mt-4 max-w-5xl font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-wide text-bone"
          >
            What is 2240 Speed Shop?
          </Kinetic>
          <p className="mt-8 max-w-3xl font-body text-lg leading-relaxed text-bone/90">
            2240 Speed Shop is {site.owner}&rsquo;s customs-and-classics shop at {site.street},{" "}
            {site.city} &mdash; right on the Sherwood Park boundary. Full restorations, hot rods and
            restomods, LS and diesel conversions, body, paint, and classic interiors. Serving
            Edmonton, Sherwood Park, St. Albert, Leduc, and Spruce Grove. Owner-operated, Monday to
            Friday, nine to five.
          </p>

          {/* the gauge cluster */}
          <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-rust/60 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Shop", value: `${site.street}, ${site.city} ${site.region}` },
              { label: "Line", value: site.phoneDisplay, href: `tel:${site.phone}` },
              { label: "Hours", value: hoursLine },
              { label: "Owner", value: site.owner },
            ].map((d) => (
              <div key={d.label}>
                <dt className="corner-note text-tungsten/80">{d.label}</dt>
                <dd className="mt-2 font-mono text-[13px] leading-relaxed text-steel">
                  {d.href ? (
                    <a className="transition-colors hover:text-ember" href={d.href}>
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SERVICES — six backlit rows, not six cards. Rows enter with drawn
          rules, numbers counting from 00, pools warming as each arrives. */}
      <section aria-labelledby="services-heading" data-tone="#0d0b09" className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Kinetic
              as="h2"
              id="services-heading"
              className="font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-wide text-bone"
            >
              Everything happens here.
            </Kinetic>
            <p className="corner-note pb-2">NOTHING GETS SUBBED OUT</p>
          </div>

          <ul className="mt-12 border-t border-rust/60">
            {services.map((s, i) => (
              <li key={s.slug} data-service-row className="relative">
                <Link
                  href={`/services/${s.slug}`}
                  className="services-row backlit group flex flex-col gap-2 !bg-transparent px-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:px-4 sm:py-7"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-tungsten/70">
                    <span data-count={i + 1}>{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span
                    data-col-a
                    className="font-display text-3xl uppercase leading-none tracking-wide text-bone transition-colors group-hover:text-ember sm:w-[38%] sm:text-4xl lg:text-5xl"
                  >
                    {s.title}
                  </span>
                  <span data-col-b className="max-w-md flex-1 font-body text-sm leading-relaxed text-steel">
                    {s.blurb}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden font-mono text-sm text-steel/50 transition-all group-hover:translate-x-1 group-hover:text-tungsten sm:block"
                  >
                    →
                  </span>
                </Link>
                <span className="row-rule" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE SEAM — one marquee, exactly one. */}
      <Marquee />

      {/* BUILDS — flashlight hovers, clip-path reveals, real slugs. */}
      <section aria-labelledby="builds-heading" className="px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Kinetic
              as="h2"
              id="builds-heading"
              className="font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-wide text-bone"
            >
              Recently, out that door
            </Kinetic>
            <Link
              href="/builds"
              className="pb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-steel transition-colors hover:text-tungsten"
            >
              <Roll text="All builds →" />
            </Link>
          </div>

          {/* deliberately unequal: one wide, two narrow */}
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {featured.map((b, i) => {
              const cover = b.images[0];
              return (
                <Link
                  key={b.slug}
                  href={`/builds/${b.slug}`}
                  data-cursor="view"
                  className={`group block ${i === 0 ? "lg:col-span-2 lg:w-[72%]" : ""} ${i === 2 ? "lg:justify-self-end lg:w-[86%]" : ""}`}
                >
                  <div data-skew>
                    <GLImage
                      src={cover.src}
                      alt={cover.alt}
                      zoom={cover.zoom ?? 1}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      fig={String(i + 1).padStart(2, "0")}
                      caption={`${b.era} · ${b.stage}`}
                      className={`w-full ${i === 0 ? "aspect-[16/9]" : cover.aspect}`}
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl uppercase leading-none tracking-wide text-bone transition-colors group-hover:text-ember sm:text-3xl">
                      {b.cardTitle}
                    </h3>
                    <p className="corner-note shrink-0">
                      {b.era} · {b.stage}
                    </p>
                  </div>
                  <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-steel">
                    {b.card}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE PROCESS — horizontal pinned rail. */}
      <ProcessRail />

      {/* FULL-BLEED STILL — the showroom neon, headline overlapping the frame. */}
      {/* The full-bleed still was the most box-like thing on the page: a hard
          rectangle of photograph with a top and bottom edge. `.melt` feathers
          both into the page tone so the room appears out of the dark and goes
          back into it. */}
      <section aria-label="The shop at night" data-tone="#0b0908" className="relative mt-28">
        <div className="melt relative aspect-[4/3] w-full overflow-hidden sm:aspect-[21/9]">
          <Image
            src="/shop/shop-showroom-neon.jpg"
            alt="Neon signs and classic machines inside the 2240 Speed Shop showroom in Edmonton at night"
            fill
            sizes="100vw"
            className="graded object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bay-black via-transparent to-bay-black/60" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[92rem] px-5 pb-10 sm:px-8">
            <p className="corner-note text-tungsten">THE ROOM ITSELF</p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,8vw,7rem)] uppercase leading-[0.85] tracking-wide text-bone mix-blend-screen">
              No showroom. This is the room.
            </h2>
          </div>
        </div>
      </section>

      {/* REVIEWS — three real Google quotes, honest context, no stars invented. */}
      <section aria-labelledby="reviews-heading" className="px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-[92rem]">
          <p className="corner-note text-tungsten">THEY TOLD SOMEBODY</p>
          <Kinetic
            as="h2"
            id="reviews-heading"
            className="mt-4 font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-wide text-bone"
          >
            Car people do not write essays.
          </Kinetic>
          <p className="mt-5 max-w-2xl font-body text-sm leading-relaxed text-steel">
            Three Google reviews with words in them, verbatim. The rest of the honest picture is on
            the{" "}
            <Link className="text-tungsten underline decoration-tungsten/40 underline-offset-4 hover:text-ember" href="/reviews">
              reviews page
            </Link>
            .
          </p>

          {/* pinned beat on desktop: mask-wipe quote swaps, the giant serif
              quotation mark, mono attribution plates */}
          <ReviewsCinema quotes={quotes} />
        </div>
      </section>

      {/* AREAS — spec strip, not a card row. */}
      {/* Feathered hairlines instead of `border-y`: a rule that runs edge to
          edge and stops dead is the seam of a box. `.weld` is the same rule
          fading out at both ends — the design system already had the blended
          version of this, it just was not being used here. */}
      <div className="weld mx-auto max-w-[92rem]" aria-hidden="true" />
      <section aria-labelledby="areas-heading" className="px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h2
            id="areas-heading"
            className="max-w-md font-display text-3xl uppercase leading-[0.95] tracking-wide text-bone sm:text-4xl"
          >
            East Edmonton. Worth the drive from anywhere.
          </h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[12px] uppercase tracking-[0.2em] text-steel">
            <li>
              <Link className="transition-colors hover:text-ember" href="/edmonton">
                <Roll text="Edmonton" />
              </Link>
            </li>
            {areas.map((a) => (
              <li key={a.slug}>
                <Link className="transition-colors hover:text-ember" href={`/edmonton/${a.slug}`}>
                  <Roll text={a.name} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="weld mx-auto max-w-[92rem]" aria-hidden="true" />

      {/* INSTAGRAM — the shop floor, most weeks. */}
      <section aria-labelledby="instagram-heading" className="px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-[92rem]">
          <InstagramGrid />
        </div>
      </section>

      {/* CLOSING CTA — the roll-up door. */}
      <section aria-labelledby="cta-heading" data-tone="#0d0b09" className="relative px-5 pb-10 pt-16 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(58%_70%_at_50%_100%,rgba(255,176,102,0.06),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-[92rem]">
          <p className="corner-note text-tungsten">LAST CALL</p>
          <div className="relative mt-4">
            <p
              aria-hidden="true"
              data-echo
              className="echo-outline font-display text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85] tracking-wide"
            >
              Start <em className="accent-serif">your</em> build
            </p>
            <Kinetic
              as="h2"
              id="cta-heading"
              accent="your"
              className="font-display text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85] tracking-wide text-bone"
            >
              Start your build
            </Kinetic>
          </div>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl font-body text-lg leading-relaxed text-steel">
              Barn find, stalled project, or a driver that deserves better. Photos in, honest scope
              out. Two business days.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/quote" data-magnetic className="cta">
                Start your build
              </Link>
              <div className="font-mono text-sm text-steel">
                <a className="block transition-colors hover:text-ember" href={`tel:${site.phone}`}>
                  {site.phoneDisplay}
                </a>
                <span className="mt-1 block text-steel/60">{hoursLine}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
