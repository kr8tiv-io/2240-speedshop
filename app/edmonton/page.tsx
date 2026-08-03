import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, services, areas } from "@/lib/site";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Classic Car Restoration Edmonton — Where the Shop Is and Who We Serve",
  description:
    "Looking for classic car restoration near you in Edmonton? 2240 Speed Shop sits at 2009 91 Ave NW on the Sherwood Park line. Drive times, areas served, and links to Sherwood Park, St. Albert, Leduc, Nisku, and Spruce Grove.",
  alternates: { canonical: "/edmonton" },
  openGraph: {
    type: "website",
    title: "Classic Car Restoration Near You in Edmonton — 2240 Speed Shop",
    description:
      "2009 91 Ave NW, right on the Sherwood Park boundary. Most of the metro is inside a forty-minute drive.",
    images: ["/shop/IMG_2943-original.jpeg"],
  },
};

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.street}, ${site.city}, ${site.region} ${site.postalCode}`
)}`;

type DriveRow = {
  area: string;
  route: string;
  drive: string;
  href?: string;
};

const driveTable: DriveRow[] = [
  {
    area: "Southeast Edmonton",
    route: "Local roads — 91 Ave NW at the east edge of the city",
    drive: "Under 15 min",
  },
  {
    area: "Sherwood Park",
    route: "Across the county line, minutes from Baseline Road",
    drive: "About 10 min",
    href: "/edmonton/sherwood-park",
  },
  {
    area: "Fort Saskatchewan",
    route: "Highway 21 south, then west into the city",
    drive: "About 30 min",
  },
  {
    area: "St. Albert",
    route: "Anthony Henday Drive, north end to south end",
    drive: "About 30 min",
    href: "/edmonton/st-albert",
  },
  {
    area: "Leduc and Nisku",
    route: "QEII north to the Henday, then east",
    drive: "About 30 min",
    href: "/edmonton/leduc-nisku",
  },
  {
    area: "Spruce Grove",
    route: "The Henday, west end all the way around to the southeast",
    drive: "About 40 min",
    href: "/edmonton/spruce-grove",
  },
];

const faq = [
  {
    q: "Where is 2240 Speed Shop?",
    a: `${site.name} is at ${site.street}, ${site.city}, ${site.region} ${site.postalCode} — in southeast Edmonton, right on the Sherwood Park boundary. Owner-operated by ${site.owner}. Open Monday to Friday, 9:00 to 17:00.`,
  },
  {
    q: "Which areas does the shop serve?",
    a: "Edmonton, Sherwood Park, St. Albert, Leduc, Nisku, Spruce Grove, and Fort Saskatchewan. Most of the metro is inside a forty-minute drive, and projects come in from county roads well past that.",
  },
  {
    q: "Do I have to drive the car there myself?",
    a: "No. Plenty of projects arrive on a trailer or a deck truck, especially the ones that have not run in years. The shop sits in a southeast industrial pocket, so there is room to unload without fighting downtown traffic.",
  },
  {
    q: "When is car season in Edmonton?",
    a: "Roughly May through September. That is why bodywork and paint get booked over the winter — a car that arrives in July is usually a next-season car. Every September the shop runs the road west to the Columbia Valley Classics Show and Shine at Radium Hot Springs.",
  },
];

export default function EdmontonHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Edmonton", path: "/edmonton" },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />

      <nav aria-label="Breadcrumb" className="font-mono text-xs text-steel">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="hover:text-bone" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-rust">
            /
          </li>
          <li aria-current="page" className="text-bone">
            Edmonton
          </li>
        </ol>
      </nav>

      <header className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="font-sub text-xs uppercase tracking-[0.28em] text-neon-bloom">
            Edmonton and the ring
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-7xl">
            Classic car restoration near you in Edmonton
          </h1>
          <div className="weld mt-6 max-w-md" />
          <p className="mt-6 text-lg leading-relaxed text-bone">
            2240 Speed Shop is a classic car restoration and custom build shop at {site.street} in
            southeast Edmonton, right on the Sherwood Park boundary. {site.owner}&rsquo;s shop
            serves Edmonton, Sherwood Park, St. Albert, Leduc, Nisku, Spruce Grove, and Fort
            Saskatchewan — most of the metro sits inside a forty-minute drive.
          </p>
          <p className="mt-4 text-base leading-relaxed text-steel">
            East Edmonton. Sherwood Park line. Worth the drive from anywhere.
          </p>
        </div>

        <figure>
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-rust/35">
            <Image
              src="/shop/IMG_2943-original.jpeg"
              alt="The rusted steel 2240 Speed Shop sign above the red door at 2009 91 Ave NW, the classic car restoration shop in southeast Edmonton"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="graded object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-steel">
            Laser-cut steel, left to weather on purpose. Red door, number 2009. If you have driven
            past it, you have found the place.
          </figcaption>
        </figure>
      </header>

      <section aria-labelledby="where" className="mt-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id="where" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
            Where exactly is the shop?
          </h2>
          <div className="weld mt-5 max-w-xs" />
          <p className="mt-6 text-base leading-relaxed text-steel">
            {site.street}, in the southeast industrial pocket where the city stops and Strathcona
            County starts. Not a strip-mall bay and not a downtown address. Room to unload a trailer,
            room to park a project, and a bay door you can actually back up to.
          </p>
          <p className="mt-4 text-base leading-relaxed text-steel">
            Being on the line is the whole geographic argument. Sherwood Park customers cross one
            boundary. Fort Saskatchewan comes down Highway 21. Everyone west rides the Henday around
            the bottom of the city and never touches Whyte Ave on a Saturday.
          </p>
        </div>

        <address className="plate not-italic p-6 text-sm leading-relaxed text-steel">
          <p className="font-display text-2xl not-italic tracking-wide text-bone">{site.name}</p>
          <p className="mt-3">
            {site.street}
            <br />
            {site.city}, {site.region} {site.postalCode}
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-tungsten">
            Mon–Fri 9:00–17:00
          </p>
          <p className="mt-4">
            <a className="hover:text-bone" href={`tel:${site.phone}`}>
              {site.phoneDisplay}
            </a>
            <br />
            <a className="hover:text-bone" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <p className="mt-5">
            <a
              className="font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom hover:text-bone"
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in maps →
            </a>
          </p>
        </address>
      </section>

      <section aria-labelledby="drive" className="mt-20">
        <h2 id="drive" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          How far is the drive?
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <div className="mt-8 overflow-x-auto border border-rust/30">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <caption className="sr-only">
              Drive times and routes to 2240 Speed Shop from areas around Edmonton
            </caption>
            <thead>
              <tr className="border-b border-rust/40 bg-panel">
                <th
                  scope="col"
                  className="px-4 py-3 font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom"
                >
                  Area
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom"
                >
                  Route
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom"
                >
                  Clear-road drive
                </th>
              </tr>
            </thead>
            <tbody>
              {driveTable.map((row) => (
                <tr key={row.area} className="border-b border-rust/20 last:border-0">
                  <th scope="row" className="px-4 py-4 align-top font-display text-lg tracking-wide text-bone">
                    {row.href ? (
                      <Link className="hover:text-neon-bloom" href={row.href}>
                        {row.area}
                      </Link>
                    ) : (
                      row.area
                    )}
                  </th>
                  <td className="px-4 py-4 align-top text-sm leading-relaxed text-steel">
                    {row.route}
                  </td>
                  <td className="px-4 py-4 align-top font-mono text-sm text-tungsten">
                    {row.drive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-xs leading-relaxed text-steel">
          Clear-road estimates, not promises. Check a map app before you hitch up a trailer.
        </p>
      </section>

      <section aria-labelledby="area-pages" className="mt-20">
        <h2 id="area-pages" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Which area are you coming from?
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link href={`/edmonton/${a.slug}`} className="plate block h-full p-6">
                <p className="font-display text-2xl tracking-wide text-bone">{a.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel">{a.note}</p>
                <p className="mt-4 font-sub text-[11px] uppercase tracking-[0.22em] text-neon-bloom">
                  Read the {a.name} page →
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-steel">
          Coming from Fort Saskatchewan or a county road we have not named? Highway 21 and the
          Henday both end up at the same bay door. Call the shop and describe the project.
        </p>
      </section>

      <div className="mt-20 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="season">
          <h2 id="season" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
            When is car season here?
          </h2>
          <div className="weld mt-5 max-w-xs" />
          <p className="mt-6 text-base leading-relaxed text-steel">
            Roughly May through September, and everybody in this city knows it. That is why the
            calendar runs backwards from the shows: bodywork and paint booked over winter,
            mechanical sorted in spring, shakedown miles in June. A car that lands here in July is
            usually a next-season car.
          </p>
          <p className="mt-4 text-base leading-relaxed text-steel">
            Winter is not downtime. It is when the long jobs get done — the ones you cannot rush
            through a summer weekend.
          </p>
        </section>
        <section aria-labelledby="off-the-clock">
          <h2
            id="off-the-clock"
            className="font-display text-3xl tracking-wide text-bone sm:text-4xl"
          >
            What does the shop do off the clock?
          </h2>
          <div className="weld mt-5 max-w-xs" />
          <p className="mt-6 text-base leading-relaxed text-steel">
            Every September the shop runs the road west to the Columbia Valley Classics Show and
            Shine at Radium Hot Springs. Mountains, hot springs, and a field of old iron — the last
            good trip before the salt goes down.
          </p>
          <p className="mt-4 text-base leading-relaxed text-steel">
            Local show season fills the summer in between. St. Albert has Rock&rsquo;n August. Come
            find us there, or come by the shop and look at what is on the hoist.
          </p>
        </section>
      </div>

      <section aria-labelledby="edmonton-services" className="mt-20">
        <h2
          id="edmonton-services"
          className="font-display text-3xl tracking-wide text-bone sm:text-4xl"
        >
          What can the shop do for an Edmonton classic?
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="plate block h-full p-5">
                <p className="font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom">
                  {s.keyword}
                </p>
                <p className="mt-3 font-display text-xl tracking-wide text-bone">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel">{s.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="edmonton-faq" className="mt-20 max-w-3xl">
        <h2 id="edmonton-faq" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Straight answers
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <dl className="mt-8 space-y-8">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-display text-xl tracking-wide text-bone">{item.q}</dt>
              <dd className="mt-2 text-base leading-relaxed text-steel">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="edmonton-cta"
        className="mt-20 border border-speed-red/50 bg-panel px-6 py-10 sm:px-10"
      >
        <h2 id="edmonton-cta" className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
          Let&rsquo;s talk straight
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel">
          Photos in, honest scope out. Two business days. Better yet — come by and look at what is
          on the hoist.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link
            href="/quote"
            className="border border-speed-red/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
          >
            Start your quote
          </Link>
          <Link
            href="/builds"
            className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-steel"
          >
            See the builds
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-steel"
          >
            {site.phoneDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}
