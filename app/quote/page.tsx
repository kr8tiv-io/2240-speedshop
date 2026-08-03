import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { QuoteForm } from "@/components/QuoteForm";
import { site, services } from "@/lib/site";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Car Restoration Quote in Edmonton — Start Your Build",
  description:
    "Get a car restoration quote in Edmonton. Pick the work, tell us the vehicle, send photos. Terry reads every request himself and answers with scope, sequence and a number band in two business days.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Car Restoration Quote in Edmonton — 2240 Speed Shop",
    description:
      "Photos in, honest scope out. A five-step quote request for restorations, restomods, engine swaps, rust repair and classic interiors.",
    url: "/quote",
  },
};

const quoteFaq = [
  {
    q: "How long does a quote take?",
    a: "Two business days on a normal week. A photo set with the floors, rockers, engine bay and interior usually gets a full answer in one pass. Thin photos get a phone call first, because guessing at rust helps nobody and inflates every number on the sheet.",
  },
  {
    q: "Do I have to bring the car in to get a quote?",
    a: "No. Start with photos and a description — nothing has to move for the first conversation. Before a number is final we want the car here where it can go on the hoist, because the underside is where estimates live or die.",
  },
  {
    q: "Why is the answer a band instead of one number?",
    a: "Because sealed sheet metal lies. Until panels come off, an honest shop quotes the range it can defend and narrows it once the car is open. A single number quoted blind is either padded to be safe or short enough to become a fight later.",
  },
];

const steps = [
  {
    n: "01",
    title: "You send the car",
    body: "Five minutes on the form below, or a text with photos. Year, make, model, where it sits, and what you want out of it.",
  },
  {
    n: "02",
    title: "Terry reads it",
    body: "Owner-operator shop. The person who would do the work is the person who reads the request — no service writer in the middle.",
  },
  {
    n: "03",
    title: "You get scope and a band",
    body: "Written back inside two business days: the work in sequence, what gets done first, and the range it lands in.",
  },
  {
    n: "04",
    title: "We look at it together",
    body: "Before anything is final the car comes in and goes up on the hoist. Then the band becomes a number and the sequence becomes a schedule.",
  },
];

const photoChecklist = [
  "All four corners, standing back far enough to see the whole body line",
  "Floor pans and trunk floor — carpet up, spare tire out",
  "Rockers, lower quarters and cab corners, shot low",
  "Engine bay from both fenders, plus the VIN or data plate",
  "Interior, dash and seats, doors open",
  "The parts you already bought, in their boxes",
];

function resolveService(raw: string | string[] | undefined): string {
  if (!raw) return "";
  const value = (Array.isArray(raw) ? raw[0] : raw).trim().toLowerCase();
  if (!value) return "";
  const exact = services.find((s) => s.slug === value);
  if (exact) return exact.slug;
  const loose = services.find(
    (s) =>
      s.slug.includes(value) ||
      s.nav.toLowerCase() === value ||
      s.title.toLowerCase() === value ||
      s.keyword.toLowerCase().includes(value),
  );
  return loose ? loose.slug : "";
}

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const preselected = resolveService(params.lane ?? params.service);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Get a quote", path: "/quote" },
        ])}
      />
      <JsonLd data={faqSchema(quoteFaq)} />

      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-rust/25">
        <div className="absolute inset-0">
          <Image
            src="/shop/ig-D100-slide2-lightpatch.jpg"
            alt="Light patch worn into the hood of a 1960s Dodge D100 at 2240 Speed Shop in Edmonton"
            fill
            priority
            sizes="100vw"
            className="graded object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bay-black/70 via-bay-black/85 to-bay-black" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
            Edmonton · Customs and classics
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.92] tracking-wide text-bone sm:text-7xl">
            Car restoration quote.
            <span className="block text-steel">Edmonton, straight answers.</span>
          </h1>

          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-bone">
            A car restoration quote from 2240 Speed Shop starts with photos and a straight
            conversation. Tell us the vehicle, where it sits, and what you want out of it. Terry
            reads every request himself and comes back with scope, sequence, and a number band
            inside two business days.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`tel:${site.phone}`}
              className="font-sub text-xs uppercase tracking-[0.22em] text-bone underline decoration-speed-red decoration-2 underline-offset-8 transition-colors hover:text-neon-bloom"
            >
              Or call {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="font-sub text-xs uppercase tracking-[0.22em] text-steel transition-colors hover:text-bone"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- how it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          How does getting a quote work?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Four moves. No showroom lap, no financing pitch, no pressure to book a bay before anyone
          has seen the underside of your car.
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="plate p-6">
              <span className="font-mono text-xs text-neon-bloom">{s.n}</span>
              <h3 className="mt-3 font-sub text-[13px] uppercase tracking-[0.16em] text-bone">
                {s.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------- lanes */}
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="weld" />
        <div className="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-sub text-[11px] uppercase tracking-[0.24em] text-steel">
            Jump straight to a lane
          </p>
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/quote?service=${s.slug}`}
                  className={`inline-block border px-4 py-2 font-sub text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    preselected === s.slug
                      ? "border-speed-red text-bone"
                      : "border-rust/35 text-steel hover:border-rust hover:text-bone"
                  }`}
                >
                  {s.nav}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------------- form */}
      <section id="form" className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
          <QuoteForm key={preselected || "open"} initialService={preselected} />

          <aside className="space-y-8 lg:sticky lg:top-24">
            <div className="plate p-6">
              <h2 className="font-display text-2xl tracking-wide text-bone">
                What makes a quote accurate?
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel">
                Six photos. That is the whole trick. Shoot these and the estimate you get back is
                one a shop can stand behind.
              </p>
              <ul className="mt-5 space-y-3">
                {photoChecklist.map((item) => (
                  <li key={item} className="flex gap-3 font-body text-sm leading-relaxed text-steel">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-speed-red" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-speed-red/45 p-6">
              <p className="font-sub text-[10px] uppercase tracking-[0.28em] text-neon-bloom">
                The guaranteed path
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-steel">
                Forms are convenient. A phone is faster. If a project is stalled in your garage and
                you want a human opinion today, use these.
              </p>
              <div className="mt-5 space-y-3">
                <a
                  href={`tel:${site.phone}`}
                  className="block border border-speed-red/70 px-5 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
                >
                  {site.phoneDisplay}
                </a>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Quote request")}`}
                  className="block border border-steel/35 px-5 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
                >
                  Email the shop
                </a>
              </div>
              <p className="mt-5 font-mono text-xs leading-relaxed text-steel/70">
                {site.street}
                <br />
                {site.city}, {site.region} {site.postalCode}
                <br />
                Mon–Fri 9:00–17:00
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* --------------------------------------------------------------- faq */}
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <div className="weld mb-12" />
        <h2 className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Questions about quoting
        </h2>
        <dl className="mt-8 space-y-8">
          {quoteFaq.map((item) => (
            <div key={item.q}>
              <dt className="font-sub text-[13px] uppercase tracking-[0.14em] text-bone">
                {item.q}
              </dt>
              <dd className="mt-2 font-body text-[15px] leading-relaxed text-steel">{item.a}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 font-body text-[15px] leading-relaxed text-steel">
          More of them on the{" "}
          <Link className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone" href="/faq">
            restoration FAQ
          </Link>
          , including what a classic car restoration actually costs in Alberta. Want to see the work
          before you send anything? Start with the{" "}
          <Link className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone" href="/builds">
            builds
          </Link>{" "}
          or the{" "}
          <Link className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone" href="/reviews">
            reviews
          </Link>
          .
        </p>
      </section>
    </>
  );
}
