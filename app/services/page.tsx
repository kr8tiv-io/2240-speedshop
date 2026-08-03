import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Classic Car Shop Edmonton — Six Trades, One Roof",
  description:
    "2240 Speed Shop is a classic car shop in Edmonton, Alberta: restoration, restomods and hot rods, LS and diesel engine swaps, carb and ignition tuning, rust repair and paint, and period-correct interiors.",
  alternates: { canonical: "/services" },
  keywords: [
    "classic car shop Edmonton",
    "custom car shop Edmonton",
    ...services.map((s) => s.keyword),
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    url: `${site.url}/services`,
    title: "Classic Car Shop Edmonton — Six Trades, One Roof",
    description:
      "Restoration, restomods, engine swaps, tuning, body and paint, interiors. One shop on the Sherwood Park line.",
  },
};

/** 80-word teasers — the hub says enough to be liftable on its own. */
const teasers: Record<(typeof services)[number]["slug"], string> = {
  "classic-car-restoration":
    "Frame-off or rolling — the difference is whether the body comes off the chassis or the car stays together while we work it in stages. We strip to bare metal, document what is actually rotten, and give you the number before the first bolt turns. Mustangs, C10s, square-bodies, Mopars, the odd stubborn import. Driver-quality or show-quality; both get the same standard of metalwork underneath. Stalled projects welcome — a build that stopped in someone else's garage is still a build.",
  "restomods-custom-builds":
    "Classic skin, modern spine. Disc brake conversions, coilovers or a modern front clip, a drivetrain that idles in traffic and pulls onto the Henday without drama. The steel stays period; the parts you touch every day get thirty years newer. Air conditioning, sound and wiring go in hidden — no rocker switches drilled through a dash that took a month to finish. Hot rods live here too, when the brief is attitude rather than accuracy.",
  "engine-swaps-builds":
    "LS and diesel conversions, plus builds on the engine you already own. Mounts and crossmembers fabricated, driveline angles set properly, a standalone harness laid in behind the dash instead of zip-tied to a fender. Cooling gets sized for August traffic; the tune gets set for a cold morning, not a sea-level dyno sheet. An Alberta swap has to fire at minus thirty and still be civil in July — that is the bar, and it is the whole job.",
  "classic-performance-tuning":
    "Carburetors rebuilt, jetted, and actually driven before they go back to you. Points converted to electronic ignition, coils and wires sorted, timing curves set for pump gas. Intakes, cams, headers and exhaust when the combination calls for it. Edmonton sits around 650 metres up and swings sixty degrees between January and July, so a carb tuned in a warm, low garage arrives here rich and lazy. We tune for the air the car actually breathes.",
  "body-paint-metalwork":
    "Alberta road salt writes the same story on every car: rockers, cab corners, lower quarters, floor pans, then the frame rails where brine sits and never dries. We cut it out and weld steel in — patch panels where a panel exists, fabricated pieces where it does not. Then primer, block, block again, paint. Bodywork is where a build gets expensive and where a cheap job announces itself two winters later. Rust dies here.",
  "classic-interiors-service":
    "Leather, vinyl, wool broadcloth and wood done the way the factory did it — then the modern comfort hidden where nobody sees it. Seat foam rebuilt, headliners stretched, panels re-covered, gauges and trim refinished. Bluetooth and speakers go in without cutting the dash. Classic mechanical service lives here too: brakes, ignition, fluids and the seasonal once-over that keeps a driven classic driven. Nothing about a good interior should announce itself.",
};

export default function ServicesHubPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
          <li>
            <Link className="hover:text-bone" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-rust">
            /
          </li>
          <li aria-current="page" className="text-bone">
            Services
          </li>
        </ol>
      </nav>

      <header className="mt-8 max-w-4xl">
        <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
          What we do
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-wide text-bone md:text-7xl">
          Classic car shop in Edmonton
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-bone md:text-xl">
          2240 Speed Shop is a classic car shop in Edmonton, Alberta, owned by Terry Harmider. Six
          trades run under one roof: restoration, restomods and hot rods, engine swaps, performance
          and tuning, body and paint, and interiors with classic mechanical service. One shop, one
          standard, from a stalled barn find to a finished build.
        </p>
        <p className="mt-5 max-w-3xl leading-relaxed text-steel">
          The shop sits at {site.street}, {site.city} — right on the Sherwood Park line. Every trade
          below has its own page with what the work actually involves, indicative cost ranges, and
          the questions people ask before they hand over a car.
        </p>
      </header>

      <div className="weld mt-12" />

      <section aria-labelledby="trades" className="mt-14">
        <h2
          id="trades"
          className="font-display text-3xl uppercase tracking-wide text-bone md:text-4xl"
        >
          Which trade does your project need?
        </h2>

        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug} className="plate flex flex-col">
              <Link href={`/services/${s.slug}`} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 32rem, 100vw"
                    className="graded object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-3xl uppercase leading-tight tracking-wide text-bone">
                  <Link className="hover:text-neon-bloom" href={`/services/${s.slug}`}>
                    {s.title}
                  </Link>
                </h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-tungsten">
                  {s.keyword}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-steel">{teasers[s.slug]}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-6 inline-block self-start border border-speed-red/70 px-4 py-2 font-sub text-[11px] uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.4)]"
                >
                  {s.nav} details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="where" className="mt-20 max-w-3xl">
        <h2
          id="where"
          className="font-display text-3xl uppercase tracking-wide text-bone md:text-4xl"
        >
          Where do customers haul projects in from?
        </h2>
        <p className="mt-4 leading-relaxed text-steel">
          {site.areas.join(", ")} — and county roads we could not name. The shop is east Edmonton,
          minutes off the Sherwood Park line, which puts it inside a straight haul from most of the
          region.{" "}
          <Link
            className="text-tungsten underline decoration-rust underline-offset-4 hover:text-bone"
            href="/edmonton"
          >
            See the areas we cover
          </Link>
          .
        </p>
      </section>

      <section
        aria-labelledby="cta"
        className="mt-20 border border-speed-red/60 bg-panel/70 px-6 py-12 text-center md:px-12"
      >
        <h2
          id="cta"
          className="font-display text-4xl uppercase tracking-wide text-bone md:text-5xl"
        >
          Got a project sitting?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-steel">
          Barn find, stalled build, or a daily that deserves better. Send photos and the vehicle
          details. Photos in, honest scope out.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/quote"
            className="w-full border border-speed-red bg-speed-red/10 px-8 py-3 font-sub text-xs uppercase tracking-[0.22em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_24px_rgba(224,69,69,0.45)] sm:w-auto"
          >
            Start your quote
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="w-full border border-steel/40 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-bone transition-colors hover:border-steel sm:w-auto"
          >
            {site.phoneDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}
