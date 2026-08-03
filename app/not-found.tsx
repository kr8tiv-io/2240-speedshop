import Image from "next/image";
import Link from "next/link";
import { site, services } from "@/lib/site";

const destinations = [
  { href: "/services", title: "Services", blurb: "The six trades — restoration through interiors." },
  { href: "/builds", title: "Builds", blurb: "What has come off the hoist, with the specs." },
  { href: "/guides", title: "Guides", blurb: "Costs in CAD, Alberta law, and surviving −40." },
  { href: "/edmonton", title: "Edmonton", blurb: "Where we are and how far we reach." },
  { href: "/reviews", title: "Reviews", blurb: "Word gets around. Here is what it says." },
  { href: "/contact", title: "Contact", blurb: "Address, hours, and the shop phone." },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/shop/IMG_2950-original.jpeg"
          alt="Neon signage and vintage machinery inside the 2240 Speed Shop showroom in Edmonton"
          fill
          priority
          sizes="100vw"
          className="graded object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bay-black via-bay-black/85 to-bay-black" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-24 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-tungsten">
          Error 404 · Page not found
        </p>

        <h1 className="mt-6 font-display text-7xl leading-[0.85] tracking-wide text-bone sm:text-9xl">
          <span className="flicker neon-red">Wrong bay.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone">
          Whatever you came looking for is not at this address. Either the link is old, the URL got
          typed wrong, or we moved the page. Nothing is broken — you are just in the parts room.
        </p>

        <p className="mt-5 max-w-xl leading-relaxed text-steel">
          Pick a door below, or call the shop and ask. Somebody here knows where it went.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="border border-speed-red/70 px-6 py-3 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
          >
            Back to the front
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="border border-steel/40 px-6 py-3 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-colors hover:border-bone"
          >
            Call {site.phoneDisplay}
          </a>
        </div>

        <div className="weld mt-14" />

        <h2 className="mt-14 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Try one of these
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link key={d.href} href={d.href} className="plate group p-6">
              <p className="font-display text-2xl leading-none tracking-wide text-bone group-hover:neon">
                {d.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-steel">{d.blurb}</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-16 font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Or go straight to the work
        </h2>

        <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="mt-[7px] h-[6px] w-[6px] shrink-0 rotate-45 bg-rust" />
              <Link
                href={`/services/${s.slug}`}
                className="text-steel underline decoration-rust/60 underline-offset-4 transition-colors hover:text-bone"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 font-mono text-xs uppercase tracking-widest text-steel">
          {site.street} · {site.city}, {site.region} {site.postalCode} · Mon–Fri 9:00–17:00
        </p>
      </div>
    </section>
  );
}
