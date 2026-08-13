import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { builds, getBuild, otherBuilds, servicesForBuild } from "@/lib/builds";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { GLImage } from "@/components/gl/GLImage";

export const dynamicParams = false;

export function generateStaticParams() {
  return builds.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const build = getBuild(slug);

  if (!build) {
    return { title: "Build not found" };
  }

  return {
    title: build.metaTitle,
    description: `${build.card} A ${build.keyword} case study from 2240 Speed Shop, ${site.street}, ${site.city}.`,
    alternates: { canonical: `/builds/${build.slug}` },
    openGraph: {
      type: "article",
      title: `${build.title} — 2240 Speed Shop Edmonton`,
      description: build.card,
      images: [build.images[0].src],
    },
  };
}

export default async function BuildPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const build = getBuild(slug);

  if (!build) {
    notFound();
  }

  const linkedServices = servicesForBuild(build);
  const rest = otherBuilds(build.slug);
  const hero = build.images[0];
  const gallery = build.images.slice(1);

  const buildSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${site.url}/builds/${build.slug}#build`,
    name: build.title,
    description: build.lede,
    keywords: build.keyword,
    image: build.images.map((img) => `${site.url}${img.src}`),
    creator: { "@id": `${site.url}/#shop` },
    locationCreated: {
      "@type": "Place",
      name: site.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.street,
        addressLocality: site.city,
        addressRegion: site.region,
        postalCode: site.postalCode,
        addressCountry: site.country,
      },
    },
  };

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Builds", path: "/builds" },
          { name: build.cardTitle, path: `/builds/${build.slug}` },
        ])}
      />
      <JsonLd data={buildSchema} />
      <JsonLd data={faqSchema(build.faq)} />

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
          <li>
            <Link className="hover:text-bone" href="/builds">
              Builds
            </Link>
          </li>
          <li aria-hidden="true" className="text-tungsten/50">
            /
          </li>
          <li aria-current="page" className="text-bone">
            {build.cardTitle}
          </li>
        </ol>
      </nav>

      <header className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-steel">
            <span>{build.era}</span>
            <span aria-hidden="true" className="text-tungsten/50">
              ·
            </span>
            <span className="text-tungsten">{build.stage}</span>
          </p>
          <h1 data-fx="h" className="mt-3 font-display text-[clamp(2.8rem,6.5vw,5.5rem)] uppercase leading-[0.88] tracking-wide text-bone">
            {build.title}
          </h1>
          <div className="weld mt-6 max-w-md" />
          <p className="mt-6 text-lg leading-relaxed text-bone">{build.lede}</p>

          <dl className="mt-8 divide-y divide-rust/25 border-y border-rust/25">
            {build.facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="font-sub text-[11px] uppercase tracking-[0.2em] text-neon-bloom">
                  {fact.label}
                </dt>
                <dd className="font-mono text-sm leading-relaxed text-steel">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="lg:sticky lg:top-24">
          <GLImage
            src={hero.src}
            alt={hero.alt}
            zoom={hero.zoom ?? 1}
            eager
            sizes="(min-width: 1024px) 46vw, 100vw"
            className={`w-full ${hero.aspect}`}
          />
          <figcaption className="mt-3 text-sm leading-relaxed text-steel">
            {hero.caption}
            {build.credit ? (
              <span className="mt-2 block font-mono text-xs text-tungsten">{build.credit}</span>
            ) : null}
          </figcaption>
        </figure>
      </header>

      <section aria-labelledby="work-list" className="mt-20 max-w-3xl">
        <h2
          id="work-list"
          className="font-display text-3xl leading-tight tracking-wide text-bone sm:text-4xl"
        >
          {build.workQuestion}
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <p className="mt-6 text-sm leading-relaxed text-steel">
          What the photograph shows, and what a vehicle in that condition takes. Scope on any
          specific vehicle is set after somebody has put hands on it.
        </p>
        <ul className="mt-6 space-y-4">
          {build.work.map((item) => (
            <li key={item} className="flex gap-4 text-base leading-relaxed text-bone">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-tungsten" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {gallery.length > 0 ? (
        <section aria-labelledby="gallery" className="mt-20">
          <h2 id="gallery" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
            More of it
          </h2>
          <div className="weld mt-5 max-w-xs" />
          <ul className="mt-8 grid items-start gap-8 sm:grid-cols-2">
            {gallery.map((img) => (
              <li key={img.src}>
                <figure>
                  <GLImage
                    src={img.src}
                    alt={img.alt}
                    zoom={img.zoom ?? 1}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className={`w-full ${img.aspect}`}
                  />
                  <figcaption className="mt-3 text-sm leading-relaxed text-steel">
                    {img.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="build-faq" className="mt-20 max-w-3xl">
        <h2 id="build-faq" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Straight answers
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <dl className="mt-8 space-y-8">
          {build.faq.map((item) => (
            <div key={item.q}>
              <dt className="font-display text-xl tracking-wide text-bone">{item.q}</dt>
              <dd className="mt-2 text-base leading-relaxed text-steel">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="build-services" className="mt-20">
        <h2 id="build-services" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          Which trades built this?
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
      </section>

      <section
        aria-labelledby="build-cta"
        className="mt-20 border border-tungsten/50 bg-panel px-6 py-10 sm:px-10"
      >
        <h2 id="build-cta" className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
          Want one like this?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel">
          Tell us the vehicle, send photos of the seams and the underside, and say what you want out
          of it. You get an honest scope before anyone touches a bolt.
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
        </div>
        <p className="mt-6 font-mono text-xs leading-relaxed text-steel">
          {site.street}, {site.city}, {site.region} {site.postalCode} · On the Sherwood Park line ·
          Mon–Fri 9:00–17:00
        </p>
      </section>

      <section aria-labelledby="more-builds" className="mt-20">
        <h2 id="more-builds" className="font-display text-3xl tracking-wide text-bone sm:text-4xl">
          What else has come through
        </h2>
        <div className="weld mt-5 max-w-xs" />
        <ul className="mt-8 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((b) => (
            <li key={b.slug}>
              <Link href={`/builds/${b.slug}`} className="backlit group block h-full !bg-transparent">
                <GLImage
                  src={b.images[0].src}
                  alt={b.images[0].alt}
                  zoom={b.images[0].zoom ?? 1}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={`w-full ${b.images[0].aspect}`}
                />
                <div className="p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-steel">
                    {b.era}
                  </p>
                  <p className="mt-2 font-display text-lg tracking-wide text-bone">{b.cardTitle}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
