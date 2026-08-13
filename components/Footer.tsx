import Link from "next/link";
import { site, services, areas } from "@/lib/site";
import { FooterWordmark } from "@/components/fx/FooterWordmark";
import { RollText } from "@/components/fx/RollText";

/**
 * The colophon of the monograph: a giant interactive wordmark (chars lift
 * toward the pointer), oversized page-links with char-roll, hairline-divided
 * mono columns, and the coordinates strip. Server component except the
 * wordmark island.
 */

const bigLinks = [
  { href: "/builds", label: "Builds" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/quote", label: "Quote" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* The pool of light the footer stands in. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(72%_100%_at_50%_100%,rgba(20,20,20,0.05),transparent_70%)]"
      />

      <div className="weld" />

      <div className="relative mx-auto max-w-[92rem] px-5 sm:px-8">
        {/* the wordmark spread */}
        <div className="flex flex-wrap items-end justify-between gap-6 pt-16">
          <FooterWordmark />
          <div className="pb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-tungsten">
              Speed Shop
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-steel/70">
              Customs and classics · Edmonton AB
            </p>
          </div>
        </div>

        {/* oversized page-links — the index of the book */}
        <nav aria-label="Footer index" className="mt-12 border-t border-rust/60">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {bigLinks.map((l, i) => (
              <li
                key={l.href}
                className={`border-b border-rust/60 lg:border-b-0 ${
                  i > 0 ? "lg:border-l lg:border-rust/60" : ""
                }`}
              >
                <Link
                  href={l.href}
                  className="group flex items-baseline justify-between gap-4 px-1 py-6 lg:px-6"
                >
                  <span className="font-display text-3xl uppercase leading-none tracking-wide text-bone sm:text-4xl">
                    <RollText text={l.label} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] text-steel/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-tungsten"
                  >
                    0{i + 1} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* hairline-divided instrument columns */}
        <div className="mt-0 grid gap-10 border-t border-rust/60 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <div className="lg:pr-8">
            <p className="corner-note text-tungsten/80">The shop</p>
            <address className="mt-4 not-italic font-mono text-[13px] leading-relaxed text-steel">
              {site.street}
              <br />
              {site.city}, {site.region} {site.postalCode}
              <br />
              <a className="transition-colors hover:text-bone" href={`tel:${site.phone}`}>
                <RollText text={site.phoneDisplay} />
              </a>
              <br />
              <a className="transition-colors hover:text-bone" href={`mailto:${site.email}`}>
                <RollText text={site.email} />
              </a>
            </address>
            <p className="mt-4 font-mono text-[11px] text-steel/60">
              MON–FRI 09:00–17:00 · WEEKENDS CLOSED
            </p>
          </div>

          <nav aria-label="Services" className="lg:border-l lg:border-rust/60 lg:px-8">
            <p className="corner-note text-tungsten/80">What we do</p>
            <ul className="mt-4 space-y-2 font-sub text-[13px] text-steel">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link className="transition-colors hover:text-bone" href={`/services/${s.slug}`}>
                    <RollText text={s.title} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Service areas" className="lg:border-l lg:border-rust/60 lg:px-8">
            <p className="corner-note text-tungsten/80">Where we work</p>
            <ul className="mt-4 space-y-2 font-sub text-[13px] text-steel">
              <li>
                <Link className="transition-colors hover:text-bone" href="/edmonton">
                  <RollText text="Edmonton" />
                </Link>
              </li>
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link className="transition-colors hover:text-bone" href={`/edmonton/${a.slug}`}>
                    <RollText text={a.name} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="More" className="lg:border-l lg:border-rust/60 lg:pl-8">
            <p className="corner-note text-tungsten/80">The rest</p>
            <ul className="mt-4 space-y-2 font-sub text-[13px] text-steel">
              <li><Link className="transition-colors hover:text-bone" href="/builds"><RollText text="Builds" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/about"><RollText text="About Terry" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/reviews"><RollText text="Reviews" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/guides"><RollText text="Guides" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/faq"><RollText text="FAQ" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/contact"><RollText text="Contact" /></Link></li>
              <li>
                <a
                  className="transition-colors hover:text-bone"
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <RollText text="Instagram" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* the coordinates strip */}
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-rust/60 py-6 sm:flex-row sm:items-center">
          <p className="corner-note">
            53.4818°N 113.3773°W · EST. EDMONTON · © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-mono text-[11px] text-steel/70">
            built with{" "}
            <span aria-label="love" role="img" className="text-tungsten">
              ♥
            </span>{" "}
            by{" "}
            <a
              href="https://kr8tiv.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-tungsten/40 underline-offset-2 transition-colors hover:text-bone"
            >
              kr8tiv
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
