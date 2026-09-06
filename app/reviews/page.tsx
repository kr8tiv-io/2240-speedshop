import type { Metadata } from "next";
import { withPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = withPageMetadata("/reviews", {
  title: "2240 Speed Shop Reviews Edmonton",
  description: "2240 Speed Shop reviews from Google: beautiful cars, outstanding service, terrific quality work. What customers wrote about Terry Harmider's Edmonton shop.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "2240 Speed Shop Reviews Edmonton",
    description: "2240 Speed Shop reviews from Google: beautiful cars, outstanding service, terrific quality work. What customers wrote about Terry Harmider's Edmonton shop.",
    url: "/reviews",
  },
});

// Verbatim from public Google reviews. No names are published here beyond the
// platform, and no aggregateRating markup is emitted — self-reported ratings
// are neither trustworthy nor eligible for rich results.
const quotes = [
  {
    text: "Terry builds beautiful Cars",
    source: "Google review",
    when: "July 2026",
    tag: "On the work",
  },
  {
    text: "outstanding service… recommend this shop for your vintage auto needs",
    source: "Google review",
    when: "2025",
    tag: "On a two-year relationship",
  },
  {
    text: "Terrific quality work",
    source: "Google review",
    when: "July 2026",
    tag: "On the standard",
  },
];

const judging = [
  {
    title: "Ask to see a car mid-teardown",
    body: "Finished cars are easy. Ask to look at something with the panels off. Weld quality, panel gaps and the state of the floors tell you everything a photo gallery will not.",
  },
  {
    title: "Look underneath, not at the paint",
    body: "Paint hides a decade of shortcuts for about two winters. Rockers, floor pans and frame rails are where an Alberta restoration is actually judged.",
  },
  {
    title: "Ask about repeat work",
    body: "A second or third project is stronger evidence than a first visit. Ask whether customers come back with another car, and why.",
  },
  {
    title: "Read the quote, not the number",
    body: "A real estimate is a scope with a sequence. If a shop hands you one figure and no list of what it covers, the argument is already scheduled.",
  },
];

const gallery = [
  {
    src: "/shop/IMG_0434-black-muscle-car.jpeg",
    alt: "Black muscle car with an exposed air intake in the bay at 2240 Speed Shop in Edmonton",
  },
  {
    src: "/shop/IMG_1949-blue-pickup.png",
    alt: "Custom blue vintage pickup truck on polished rims built by 2240 Speed Shop in Edmonton",
  },
  {
    src: "/shop/IMG_2950-original.jpeg",
    alt: "Vintage motorcycle under neon signage inside the 2240 Speed Shop showroom in Edmonton",
  },
];

export default function ReviewsPage() {
  const mapsQuery = encodeURIComponent(
    `${site.name}, ${site.street}, ${site.city}, ${site.region} ${site.postalCode}`,
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />

      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-rust/25">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
            Word gets around
          </p>
          <h1 data-fx="h" className="mt-4 font-display text-5xl leading-[0.92] tracking-wide text-bone sm:text-7xl">
            2240 Speed Shop reviews
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-bone">
            Customers describe Terry&apos;s cars as beautiful, the service as outstanding, and the
            work as terrific. Their notes are public, direct, and unedited. Read them, then judge
            the panels, welds, and floors in person.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- quotes */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What do customers actually say?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Public Google reviews, quoted exactly as posted.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.text} className="plate flex flex-col justify-between p-7">
              <div>
                <p className="font-sub text-[10px] uppercase tracking-[0.24em] text-neon-bloom">
                  {q.tag}
                </p>
                <blockquote className="mt-4">
                  <p className="font-display text-2xl leading-tight tracking-wide text-bone sm:text-3xl">
                    &ldquo;{q.text}&rdquo;
                  </p>
                </blockquote>
              </div>
              <figcaption className="mt-8 font-mono text-xs text-steel/70">
                {q.source} · {q.when}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- full picture */}
      <section className="border-y border-rust/25 bg-panel/40">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
            What a rating cannot show
          </h2>
          <div className="mt-5 space-y-5 font-body text-[15px] leading-relaxed text-steel">
            <p>
              Google&rsquo;s listing includes the written reviews above alongside star-only ratings. A
              number names no car, no scope, and no result, so we do not turn it into a story.
            </p>
            <p>
              The customer words are quoted exactly. Reviews are never bought, and the stronger
              proof is available in the shop: welds, gaps, floors, wiring, and cars mid-build.
            </p>
            <p className="text-bone">
              Better yet — come by. Look at what is on the hoist. The work does the talking.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="border border-tungsten/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_24px_rgba(255,176,102,0.15)]"
            >
              Find the shop
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="border border-steel/35 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
            >
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- leave one */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 border border-tungsten/45 p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="font-sub text-[10px] uppercase tracking-[0.28em] text-neon-bloom">
              If we built something for you
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[0.95] tracking-wide text-bone sm:text-5xl">
              Put the car in the review.
            </h2>
            <p className="mt-4 max-w-xl font-body text-[15px] leading-relaxed text-steel">
              Name the car. Say what came in, what changed, and how the process went. That detail
              helps the next owner deciding whether to trust a shop with something irreplaceable.
              Open the Google listing, tap Reviews, then Write a review.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flicker border border-tungsten/70 px-6 py-4 text-center font-sub text-xs uppercase tracking-[0.22em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_24px_rgba(255,176,102,0.15)]"
            >
              Review us on Google
            </a>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Feedback on my build")}`}
              className="border border-steel/35 px-6 py-4 text-center font-sub text-xs uppercase tracking-[0.22em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
            >
              Or tell us privately
            </a>
            <p className="font-body text-xs leading-relaxed text-steel/70">
              Something went sideways on your job? Say it to the shop first. It gets fixed faster
              that way than it does in public.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- judging */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="weld" />
        <h2 className="mt-12 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          How should you judge a restoration shop?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Ask us these questions. Ask every shop. The answers should make the decision easier.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {judging.map((item) => (
            <div key={item.title} className="plate p-6">
              <h3 className="font-sub text-[12px] uppercase tracking-[0.18em] text-bone">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- gallery */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="weld" />
        <h2 className="mt-12 font-sub text-[11px] uppercase tracking-[0.26em] text-neon-bloom">
          The work the reviews are about
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {gallery.map((img) => (
            <div key={img.src} data-fx="mask" className="plate relative aspect-[4/3] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 32vw, 100vw"
                className="graded object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <Link
            href="/builds"
            className="font-sub text-xs uppercase tracking-[0.22em] text-bone underline decoration-tungsten/60 decoration-2 underline-offset-8 transition-colors hover:text-neon-bloom"
          >
            All builds
          </Link>
          <Link
            href="/about"
            className="font-sub text-xs uppercase tracking-[0.22em] text-steel transition-colors hover:text-bone"
          >
            Meet Terry
          </Link>
          <Link
            href="/quote"
            className="font-sub text-xs uppercase tracking-[0.22em] text-steel transition-colors hover:text-bone"
          >
            Start a quote
          </Link>
        </div>
      </section>
    </>
  );
}
