import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { site, services, areas } from "@/lib/site";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact 2240 Speed Shop — Address, Hours and Map in Edmonton",
  description:
    "Contact 2240 Speed Shop in Edmonton: 2009 91 Ave NW, 780-999-6450, Monday to Friday 9 to 5. Map, service area from Sherwood Park to Spruce Grove, and what to photograph before you call.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact 2240 Speed Shop — Edmonton",
    description:
      "2009 91 Ave NW, Edmonton. On the Sherwood Park line. Phone, hours, map and what to bring.",
    url: "/contact",
  },
};

const dayRows = [
  { day: "Monday", hours: "9:00 – 17:00" },
  { day: "Tuesday", hours: "9:00 – 17:00" },
  { day: "Wednesday", hours: "9:00 – 17:00" },
  { day: "Thursday", hours: "9:00 – 17:00" },
  { day: "Friday", hours: "9:00 – 17:00" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" },
];

const bring = [
  {
    title: "The whole car, from ten feet back",
    body: "Four corners, standing far enough away to see the body lines. Close-ups hide sag, gaps and a roof that has been off.",
  },
  {
    title: "Everything that touches the ground",
    body: "Floor pans with the carpet up, trunk floor with the spare out, rockers and cab corners shot low. This is where a quote is won or lost.",
  },
  {
    title: "Engine bay and the plate",
    body: "Both fenders, plus the VIN or data plate. It settles what the car left the factory as before anybody argues about it.",
  },
  {
    title: "The paperwork and the parts",
    body: "Registration or bill of sale, any out-of-province history, and photos of the boxes of parts already bought. Half of them usually fit.",
  },
];

export default function ContactPage() {
  const { lat, lng } = site.geo;
  const bbox = [lng - 0.012, lat - 0.006, lng + 0.012, lat + 0.006]
    .map((n) => n.toFixed(4))
    .join(",");
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  const addressQuery = encodeURIComponent(
    `${site.name}, ${site.street}, ${site.city}, ${site.region} ${site.postalCode}`,
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-rust/25">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
            Find the shop
          </p>
          <h1 data-fx="h" className="mt-4 font-display text-5xl leading-[0.92] tracking-wide text-bone sm:text-7xl">
            Contact 2240 Speed Shop
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-bone">
            2240 Speed Shop is at {site.street}, {site.city}, {site.region} {site.postalCode} — east
            Edmonton, right on the Sherwood Park line. Phone {site.phoneDisplay} or email{" "}
            {site.email}. Open Monday to Friday, 9:00 to 17:00. Send photos first and the
            conversation starts a lot further ahead.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- nap + map */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start">
          <div className="space-y-8">
            <div className="plate p-6">
              <h2 className="font-display text-2xl tracking-wide text-bone">Where and when</h2>
              <address className="mt-5 not-italic font-body text-[15px] leading-relaxed text-steel">
                <span className="block font-sub text-[10px] uppercase tracking-[0.24em] text-steel/70">
                  Address
                </span>
                <span className="mt-1 block text-bone">
                  {site.street}
                  <br />
                  {site.city}, {site.region} {site.postalCode}
                  <br />
                  Canada
                </span>

                <span className="mt-5 block font-sub text-[10px] uppercase tracking-[0.24em] text-steel/70">
                  Phone
                </span>
                <a
                  className="mt-1 block font-mono text-lg text-bone transition-colors hover:text-neon-bloom"
                  href={`tel:${site.phone}`}
                >
                  {site.phoneDisplay}
                </a>

                <span className="mt-5 block font-sub text-[10px] uppercase tracking-[0.24em] text-steel/70">
                  Email
                </span>
                <a
                  className="mt-1 block font-mono text-sm text-bone break-all transition-colors hover:text-neon-bloom"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </address>

              <div className="weld my-6" />

              <h3 className="font-sub text-[11px] uppercase tracking-[0.24em] text-neon-bloom">
                Shop hours
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse font-mono text-sm">
                  <caption className="sr-only">
                    Opening hours for 2240 Speed Shop in Edmonton
                  </caption>
                  <tbody>
                    {dayRows.map((row) => (
                      <tr key={row.day} className="border-b border-rust/20 last:border-0">
                        <th scope="row" className="py-2 text-left font-normal text-steel">
                          {row.day}
                        </th>
                        <td
                          className={`py-2 text-right ${
                            row.hours === "Closed" ? "text-steel/45" : "text-bone"
                          }`}
                        >
                          {row.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-body text-xs leading-relaxed text-steel/70">
                Builds run past five. Calls do not — if nobody picks up, the shop is under a car.
                Leave a message or send an email and it gets answered.
              </p>
            </div>

            <div className="plate overflow-hidden">
              <div data-fx="mask" className="relative aspect-[4/3]">
                <Image
                  src="/shop/IMG_2943-original.jpeg"
                  alt="Storefront of 2240 Speed Shop in Edmonton with the cut-steel Speed Shop 2240 Classics and Customs sign above the door at 2009"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="graded object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sub text-[11px] uppercase tracking-[0.24em] text-neon-bloom">
                  What to look for
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-steel">
                  Pale green siding, a rust-brown steel disc reading SPEED SHOP 2240 — CLASSICS AND
                  CUSTOMS with a pair of crossed wrenches through the middle, and a maroon door
                  numbered 2009. If you can see the sign, you are at the right door.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="plate overflow-hidden">
              <iframe
                title="Map showing 2240 Speed Shop at 2009 91 Ave NW, Edmonton"
                src={osmEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0 sm:h-[520px]"
              />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={osmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sub text-[11px] uppercase tracking-[0.2em] text-steel underline decoration-tungsten/40 underline-offset-4 transition-colors hover:text-bone"
              >
                Open in OpenStreetMap
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${addressQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sub text-[11px] uppercase tracking-[0.2em] text-steel underline decoration-tungsten/40 underline-offset-4 transition-colors hover:text-bone"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="border border-tungsten/45 p-6">
              <h2 className="font-display text-2xl tracking-wide text-bone">
                Is the shop actually in Sherwood Park?
              </h2>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-steel">
                The address is Edmonton. The postal code sits on the eastern edge of the city, which
                puts the roll-up door minutes from Sherwood Park — close enough that half our
                customers describe us as a Sherwood Park shop and neither of us corrects them.
                Trailer in from the county, the west end, or anywhere on the Henday.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/quote"
                  className="border border-rust px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)]"
                >
                  Start a quote
                </Link>
                <a
                  href={`tel:${site.phone}`}
                  className="border border-steel/35 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
                >
                  Call the shop
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- areas */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="weld" />
        <h2 className="mt-12 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Where do you take work from?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Edmonton and the ring around it. Classics get trailered further than daily drivers, so
          distance matters less than you would think — the drive happens once at each end of the
          build.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="plate p-6">
            <h3 className="font-sub text-[12px] uppercase tracking-[0.18em] text-bone">
              <Link className="hover:text-neon-bloom" href="/edmonton">
                Edmonton
              </Link>
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-steel">
              Home turf. East side, south side, west end — the whole city rolls through the door.
            </p>
          </div>
          {areas.map((a) => (
            <div key={a.slug} className="plate p-6">
              <h3 className="font-sub text-[12px] uppercase tracking-[0.18em] text-bone">
                <Link className="hover:text-neon-bloom" href={`/edmonton/${a.slug}`}>
                  {a.name}
                </Link>
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel">{a.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-body text-sm leading-relaxed text-steel/80">
          Also serving {site.areas.join(", ")} and the county roads between them.
        </p>
      </section>

      {/* -------------------------------------------------------- what to send */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="weld" />
        <h2 className="mt-12 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What should I have ready when I call?
        </h2>
        <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Six photos and two facts beat a twenty-minute description every time. Shoot these in
          daylight before you pick up the phone and the first call turns into a real conversation
          about scope instead of twenty questions.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {bring.map((item) => (
            <div key={item.title} className="plate p-6">
              <h3 className="font-sub text-[12px] uppercase tracking-[0.18em] text-bone">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-steel">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border border-rust/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[15px] leading-relaxed text-steel">
            Ready to put it in writing? The quote form walks the same ground in five steps and lets
            you list the photos as you go.
          </p>
          <Link
            href="/quote"
            className="shrink-0 border border-rust px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)]"
          >
            Get a quote
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------------------- services */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="weld" />
        <h2 className="mt-12 font-sub text-[11px] uppercase tracking-[0.24em] text-neon-bloom">
          What you can call about
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="inline-block border border-rust/35 px-4 py-2 font-sub text-[11px] uppercase tracking-[0.16em] text-steel transition-colors hover:border-rust hover:text-bone"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
