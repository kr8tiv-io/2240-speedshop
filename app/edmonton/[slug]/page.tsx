import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, services, areas } from "@/lib/site";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const dynamicParams = false;

type AreaContent = {
  /** The single local term this page owns. */
  keyword: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Answer-first opener, 40–60 words. */
  lede: string;
  drive: string;
  /**
   * `zoom` crops the baked-in black bars off IMG_1954-original.png, a phone
   * screenshot whose photo sits at y 35.9–64.1% / x 6.9–90.6% of the file
   * (measured in-browser). object-cover alone cannot avoid the side bars
   * because the content is landscape inside a portrait file.
   */
  image: { src: string; alt: string; caption: string; aspect: string; zoom?: number };
  sections: { h2: string; body: string[] }[];
  notesTitle: string;
  notes: string[];
  faq: { q: string; a: string }[];
  serviceSlugs: string[];
};

const content: Record<string, AreaContent> = {
  "sherwood-park": {
    keyword: "classic car restoration Sherwood Park",
    h1: "Classic car restoration in Sherwood Park",
    metaTitle: "Classic Car Restoration Sherwood Park — Minutes From Baseline Road",
    metaDescription:
      "Classic car restoration for Sherwood Park and Strathcona County. 2240 Speed Shop sits on the county line at 2009 91 Ave NW — about ten minutes from Baseline Road. Restorations, rust repair, and classic service.",
    lede:
      "2240 Speed Shop sits on the Sherwood Park line at 2009 91 Ave NW. From Baseline Road it is roughly ten minutes west — closer than most Edmonton shops are to each other. For Strathcona County owners, classic car restoration stops being something you drive across a city for.",
    drive: "Baseline Road to the bay door — about 10 minutes",
    image: {
      src: "/shop/IMG_0052-red-pickup-texaco.jpeg",
      alt: "Red 1950s stepside pickup with the hood up inside the 2240 Speed Shop bay, ten minutes from Sherwood Park",
      caption: "Ten minutes from Baseline Road, this is what is behind the door most days.",
      aspect: "aspect-[3/4]",
    },
    sections: [
      {
        h2: "Why is Sherwood Park the shortest drive?",
        body: [
          "The shop sits in the southeast industrial pocket where Edmonton stops and Strathcona County starts. Coming off Baseline Road, Wye Road, or anywhere near Broadmoor, you cross one boundary and you are here. No Henday, no Whitemud, no Saturday spent on the bridges.",
          "That matters more than it sounds. A restoration is not a drop-off-and-forget job — you are going to want to come look at it. From the Park you can do that on a lunch break instead of booking out an afternoon.",
        ],
      },
      {
        h2: "What do Sherwood Park owners usually bring in?",
        body: [
          "County acreages have big shops, and big shops collect projects. Half of what comes in from the Park has been sitting under a cover in a heated garage for six years with a box of parts on the back seat.",
          "The other half are summer drivers that got parked over one problem — a carburetor that will not stay tuned, brakes nobody trusts, a floor pan that finally went soft underfoot.",
          "Both are normal here. Neither one gets a lecture.",
        ],
      },
      {
        h2: "Can I bring it without a trailer?",
        body: [
          "If it runs and stops, drive it. Ten minutes of county road is a fair shakedown and it tells us things a trailer never will — how it idles warm, whether it pulls, what the brakes actually do at a real stop sign.",
          "If it does not run, it comes on a deck. There is room out front to unload without blocking anybody.",
        ],
      },
    ],
    notesTitle: "The Sherwood Park run",
    notes: [
      "Baseline Road to the bay door: about ten minutes.",
      "Wye Road and Broadmoor feed straight into the same run.",
      "No Anthony Henday and no Whitemud required.",
      "Room out front to unload a deck truck or a trailer.",
    ],
    faq: [
      {
        q: "How far is 2240 Speed Shop from Sherwood Park?",
        a: "About ten minutes from Baseline Road. The shop is at 2009 91 Ave NW in southeast Edmonton, right on the Strathcona County boundary — for most of Sherwood Park it is the closest classic shop, not the furthest.",
      },
      {
        q: "Do you take on cars that have been stored on an acreage?",
        a: "Constantly. Long-stored cars bring their own list — seized brakes, varnished fuel, mice in the wiring loom, flat spots on every tire. All of it gets assessed before anything is quoted.",
      },
      {
        q: "Can I stop in and see the work?",
        a: "Yes. Monday to Friday, 9:00 to 17:00. Come look at what is on the hoist. The work does the talking.",
      },
    ],
    serviceSlugs: [
      "classic-car-restoration",
      "classic-performance-tuning",
      "body-paint-metalwork",
    ],
  },

  "st-albert": {
    keyword: "classic car mechanic St. Albert",
    h1: "Classic car mechanic for St. Albert",
    metaTitle: "Classic Car Mechanic St. Albert — Thirty Minutes Down the Henday",
    metaDescription:
      "A classic car mechanic for St. Albert owners: restoration, rust repair, paint, and classic service at 2240 Speed Shop in southeast Edmonton. About thirty minutes down the Anthony Henday. Book winter work for Rock'n August.",
    lede:
      "St. Albert to 2240 Speed Shop is the Anthony Henday, top end to bottom — about thirty minutes on a clear road. A classic car mechanic is not a weekly errand, so the drive is rarely the deciding factor. What you book, and when you book it, is.",
    drive: "Anthony Henday north end to south end — about 30 minutes",
    image: {
      src: "/shop/IMG_1954-original.png",
      alt: "Restored green 1960s hardtop coupe with black vinyl roof, the kind of show-ready car St. Albert owners bring to Rock'n August",
      caption:
        "Show-ready is a winter decision. This is what gets booked in November so it can sit on a field in August.",
      aspect: "aspect-[16/9]",
      zoom: 1.35,
    },
    sections: [
      {
        h2: "Does Rock'n August set your timeline?",
        body: [
          "It should. St. Albert's classic car week lands in August, and the cars that roll in clean were booked the previous winter.",
          "Work backwards. Bodywork and paint over the winter, when the shop is not fighting everybody's summer deadline. Mechanical sorted through spring. Shakedown miles in June and July so the first long drive of the year is not the show itself.",
          "A car dropped off in July is a next-year car. That is not pessimism, it is arithmetic.",
        ],
      },
      {
        h2: "How bad is the Henday haul?",
        body: [
          "North end to south end, then east. Half an hour on a clear road, longer once west-side construction season opens up.",
          "So batch the trips. Drop it off against a written scope, get photos at stages, and come out when there is something worth looking at. You should not have to drive across a city to find out what happened this week.",
        ],
      },
      {
        h2: "What comes in from St. Albert?",
        body: [
          "Show cars and driver-quality restorations, mostly. Paint, trim, chrome fitment, and the fussy detail work that separates a car that photographs well from one that holds up with somebody standing beside it.",
          "Period-correct is usually the ask. Straight panels, correct clips, colour mixed to look like it left the factory that way.",
        ],
      },
    ],
    notesTitle: "The St. Albert run",
    notes: [
      "Anthony Henday north end to south end, then east: about thirty minutes.",
      "Rock'n August lands in August — book the winter before.",
      "West-side construction season adds time. Leave early.",
      "Photos at stages, so the drive is worth making.",
    ],
    faq: [
      {
        q: "How long is the drive from St. Albert?",
        a: "About thirty minutes on a clear Anthony Henday — north end to south end, then east to 2009 91 Ave NW in southeast Edmonton.",
      },
      {
        q: "Can you have my car ready for Rock'n August?",
        a: "It depends entirely on the scope and when the car lands here. Bodywork and paint booked over the winter is realistic. A car dropped off in July is a next-year car. Ask early and you get a straight answer instead of a hopeful one.",
      },
      {
        q: "Do you handle paint and trim, or only mechanical work?",
        a: "Both. Rust repair, patch panels, fabrication, and paint are done in the shop, and so are brakes, ignition, and carburetor work.",
      },
    ],
    serviceSlugs: [
      "body-paint-metalwork",
      "classic-car-restoration",
      "classic-performance-tuning",
    ],
  },

  "leduc-nisku": {
    keyword: "classic car shop Leduc",
    h1: "Classic car shop for Leduc and Nisku",
    metaTitle: "Classic Car Shop Leduc & Nisku — Passenger Classics, Not Fleet Iron",
    metaDescription:
      "A classic car shop for Leduc and Nisku owners. Nisku is built for heavy truck and fleet work — 2240 Speed Shop takes passenger classics, muscle cars, and custom pickups. About thirty minutes north on the QEII.",
    lede:
      "Leduc and Nisku are full of shops, and most of them were built for heavy truck, fleet, and oilfield iron. A classic car shop is a different animal. 2240 Speed Shop takes passenger classics, muscle cars, and custom pickups, and the run north on the QEII is about thirty minutes.",
    drive: "QEII north to the Anthony Henday, then east — about 30 minutes",
    image: {
      src: "/shop/IMG_0434-black-muscle-car.jpeg",
      alt: "Black muscle car with a supercharger and twin scoops standing open in the bay at 2240 Speed Shop, the kind of passenger classic Leduc and Nisku shops do not take",
      caption:
        "Not a fleet unit. Passenger classics, muscle, and custom pickups are the whole diet here.",
      aspect: "aspect-[3/4]",
    },
    sections: [
      {
        h2: "Why not just use a Nisku shop?",
        body: [
          "Nisku does heavy truck and fleet work better than almost anywhere in the province, and that is exactly the point. Those shops are built for uptime on units that earn money, on a schedule that has nothing in common with a car you drive eleven weekends a year.",
          "A wavy quarter panel does not get block-sanded by a shop with a wrecker contract. Sheet-metal patience, trim fitment, period parts sourcing, and paint are a separate trade.",
        ],
      },
      {
        h2: "How do you get here from Leduc?",
        body: [
          "QEII north, east onto the Anthony Henday, then off on the southeast side. About thirty minutes clear. Airport traffic is the only variable worth planning around.",
          "There is room out front for a trailer, which matters if the car has not turned over since the day it got parked.",
        ],
      },
      {
        h2: "Does a rotation schedule work with a build?",
        body: [
          "Plenty of people out this way work rotations, and long-cycle work suits that better than most jobs do. The car does not need you here every week, and photos at stages mean you are not out of the loop when you are out of town.",
          "Scope goes in writing before anything starts, so no decision needs a phone call at a bad hour.",
        ],
      },
    ],
    notesTitle: "The Leduc and Nisku run",
    notes: [
      "QEII north to the Anthony Henday, then east: about thirty minutes.",
      "Airport traffic is the variable — plan around it.",
      "Trailer room out front.",
      "Passenger classics, muscle, and custom pickups. Not fleet, not heavy truck.",
    ],
    faq: [
      {
        q: "Do you work on passenger classics, not just trucks?",
        a: "Both, and passenger classics are most of what comes through. Coupes, hardtops, muscle cars, and classic pickups all run the same process: read the steel, fix what is actually wrong, then finish it.",
      },
      {
        q: "How far is the shop from Leduc?",
        a: "About thirty minutes. QEII north to the Anthony Henday, then east to 2009 91 Ave NW in southeast Edmonton.",
      },
      {
        q: "Can the work happen while I am out on rotation?",
        a: "Yes. Long-cycle work and photo updates at stages suit a rotation schedule. The scope is agreed in writing before the work starts, so nothing waits on you being in cell range.",
      },
    ],
    serviceSlugs: [
      "classic-car-restoration",
      "engine-swaps-builds",
      "classic-performance-tuning",
    ],
  },

  "spruce-grove": {
    keyword: "car restoration Spruce Grove",
    h1: "Car restoration for Spruce Grove and the west end",
    metaTitle: "Car Restoration Spruce Grove — Worth the Henday Haul",
    metaDescription:
      "Car restoration for Spruce Grove, Stony Plain, and Parkland County. 2240 Speed Shop is about forty minutes around the Anthony Henday — one trip in, one trip out, photos at stages in between.",
    lede:
      "Spruce Grove is the long way around — the full arc of the Anthony Henday from the west end down and across to southeast Edmonton, roughly forty minutes on a clear road. Car restoration is worth that drive precisely because it is not a weekly trip. You come twice, and the work happens in between.",
    drive: "Anthony Henday, west end around to the southeast — about 40 minutes",
    image: {
      src: "/shop/IMG_0402-covered-classic.jpeg",
      alt: "Maroon classic coupe masked off for paint beside a stripped project shell in the 2240 Speed Shop bay in Edmonton",
      caption:
        "Long-cycle work. Masked off, curtained off, and nowhere near needing you to stand there watching.",
      aspect: "aspect-[3/4]",
    },
    sections: [
      {
        h2: "Is it worth driving from Spruce Grove?",
        body: [
          "Depends what you need. An oil change is not worth forty minutes. A frame-off, an engine swap, or a paint job you will be looking at for the next twenty years is a different calculation entirely.",
          "The honest version: pick the shop, not the postal code. Then make the drive twice — once in, once out — and let the photos cover the middle.",
        ],
      },
      {
        h2: "Trailer it, or drive it?",
        body: [
          "If it is road-ready and insured, drive it. Forty minutes of Henday tells us more than any static inspection will.",
          "If it has been sitting, trailer it. A car that has not run in years does not need a highway shakedown as its first outing, and there is room out front to unload a deck.",
        ],
      },
      {
        h2: "How do west-end owners stay in the loop?",
        body: [
          "Photos at stages, a phone call when something changes, and scope in writing from the start. You should not have to drive across the city to learn what happened this week.",
          "What comes in from out here is usually a Parkland County acreage project — barn finds, half-done builds, and cars that arrived with somebody else's plan already half executed.",
        ],
      },
    ],
    notesTitle: "The west-end haul",
    notes: [
      "Anthony Henday, west end around to the southeast: about forty minutes.",
      "One trip in, one trip out. Photos cover the middle.",
      "Trailer parking and unloading room out front.",
      "Parkland County barn finds and half-done builds welcome.",
    ],
    faq: [
      {
        q: "Is it worth driving from Spruce Grove for car restoration?",
        a: "For a long job, yes. Restoration, paint, and engine swaps get booked once and worked for weeks — you make the drive twice, not weekly. For routine service, use somebody closer and save the trip.",
      },
      {
        q: "Do I need to trailer the car?",
        a: "Only if it is not road-ready. If it runs, stops, and is insured, drive it out — the trip tells us things a static inspection cannot. If it has sat for years, put it on a deck.",
      },
      {
        q: "How do I know what is happening to my car?",
        a: "Photos at stages and a scope agreed in writing before work starts. Nobody should have to drive forty minutes to find out what happened this week.",
      },
    ],
    serviceSlugs: [
      "classic-car-restoration",
      "body-paint-metalwork",
      "restomods-custom-builds",
    ],
  },
};

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  const copy = content[slug];

  if (!area || !copy) {
    return { title: "Area not found" };
  }

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: `/edmonton/${slug}` },
    openGraph: {
      type: "website",
      title: `${copy.h1} — 2240 Speed Shop`,
      description: copy.metaDescription,
      images: [copy.image.src],
    },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  const copy = content[slug];

  if (!area || !copy) {
    notFound();
  }

  const linkedServices = copy.serviceSlugs
    .map((s) => services.find((svc) => svc.slug === s))
    .filter((svc): svc is (typeof services)[number] => Boolean(svc));

  const siblings = areas.filter((a) => a.slug !== slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Edmonton", path: "/edmonton" },
          { name: area.name, path: `/edmonton/${slug}` },
        ])}
      />
      <JsonLd data={faqSchema(copy.faq)} />

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
          <li>
            <Link className="hover:text-bone" href="/edmonton">
              Edmonton
            </Link>
          </li>
          <li aria-hidden="true" className="text-rust">
            /
          </li>
          <li aria-current="page" className="text-bone">
            {area.name}
          </li>
        </ol>
      </nav>

      <header className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="font-sub text-xs uppercase tracking-[0.28em] text-neon-bloom">
            {area.name}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl">
            {copy.h1}
          </h1>
          <div className="weld mt-6 max-w-md" />
          <p className="mt-6 text-lg leading-relaxed text-bone">{copy.lede}</p>
          <p className="mt-6 border-l-2 border-speed-red/70 pl-4 font-mono text-sm leading-relaxed text-tungsten">
            {copy.drive}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-steel">{area.note}</p>
        </div>

        <figure>
          <div
            className={`relative w-full overflow-hidden border border-rust/35 ${copy.image.aspect}`}
          >
            <div
              className="absolute inset-0"
              style={copy.image.zoom ? { transform: `scale(${copy.image.zoom})` } : undefined}
            >
              <Image
                src={copy.image.src}
                alt={copy.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="graded object-cover"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-steel">
            {copy.image.caption}
          </figcaption>
        </figure>
      </header>

      {copy.sections.map((section) => (
        <section key={section.h2} className="mt-16 max-w-3xl">
          <h2 className="font-display text-3xl leading-tight tracking-wide text-bone sm:text-4xl">
            {section.h2}
          </h2>
          <div className="weld mt-5 max-w-xs" />
          {section.body.map((p) => (
            <p key={p} className="mt-5 text-base leading-relaxed text-steel">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section aria-labelledby="local-notes" className="mt-16 max-w-3xl">
        <h2
          id="local-notes"
          className="font-display text-3xl tracking-wide text-bone sm:text-4xl"
        >
          {copy.notesTitle}
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-6 space-y-3">
          {copy.notes.map((note) => (
            <li key={note} className="flex gap-4 text-base leading-relaxed text-bone">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-speed-red" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="area-services" className="mt-16">
        <h2 id="area-services" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What {area.name} owners book most
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {linkedServices.map((s) => (
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
        <p className="mt-6 text-sm leading-relaxed text-steel">
          Want to see the work before you call?{" "}
          <Link className="text-neon-bloom hover:text-bone" href="/builds">
            Look through the builds
          </Link>{" "}
          — real vehicles, real condition, no stock photography.
        </p>
      </section>

      <section aria-labelledby="area-faq" className="mt-16 max-w-3xl">
        <h2 id="area-faq" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Straight answers for {area.name}
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <dl className="mt-8 space-y-8">
          {copy.faq.map((item) => (
            <div key={item.q}>
              <dt className="font-display text-xl tracking-wide text-bone">{item.q}</dt>
              <dd className="mt-2 text-base leading-relaxed text-steel">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="area-cta"
        className="mt-16 border border-speed-red/50 bg-panel px-6 py-10 sm:px-10"
      >
        <h2 id="area-cta" className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
          Got a project in {area.name}?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel">
          Send photos of the seams and the underside, tell us the vehicle, and say what you want out
          of it. Honest scope, real hours, one standard. Two business days.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link
            href="/quote"
            className="border border-speed-red/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
          >
            Start your quote
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-steel"
          >
            {site.phoneDisplay}
          </a>
        </div>
        <p className="mt-6 font-mono text-xs leading-relaxed text-steel">
          {site.name} · {site.street}, {site.city}, {site.region} {site.postalCode} · Mon–Fri
          9:00–17:00
        </p>
      </section>

      <section aria-labelledby="other-areas" className="mt-16">
        <h2 id="other-areas" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Coming from somewhere else?
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {siblings.map((a) => (
            <li key={a.slug}>
              <Link href={`/edmonton/${a.slug}`} className="plate block h-full p-5">
                <p className="font-display text-xl tracking-wide text-bone">{a.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel">{a.note}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-steel">
          <Link className="text-neon-bloom hover:text-bone" href="/edmonton">
            Back to the Edmonton hub
          </Link>{" "}
          for the full drive-time table and the areas we serve.
        </p>
      </section>
    </div>
  );
}
