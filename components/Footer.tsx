import Link from "next/link";
import { site, services, areas } from "@/lib/site";
import { FooterWordmark } from "@/components/FooterWordmark";
import { Roll } from "@/components/fx/Roll";

const bigLinks = [
  { href: "/builds", label: "Builds" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/quote", label: "Quote" },
];

/**
 * The footer as destination — the last frame of the film: a giant interactive
 * wordmark (numerals backlit by pointer proximity), oversized char-roll page
 * links, one slow tungsten pool drifting behind, then the instrument panel —
 * mono columns, hairlines, coordinates.
 */
export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* The pool of light the footer stands in — drifting, like a lamp on a
          long cord. */}
      <div
        aria-hidden="true"
        className="pool-drift pointer-events-none absolute inset-x-0 bottom-0 h-[460px] bg-[radial-gradient(58%_100%_at_50%_100%,rgba(255,176,102,0.08),transparent_70%)]"
      />

      <div className="weld" />

      <div className="relative mx-auto max-w-[92rem] px-5 sm:px-8">
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

        {/* Oversized page links — display type, char-roll hovers. */}
        <nav aria-label="Footer primary" className="mt-14 border-t border-rust/60 pt-10">
          <ul className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
            {bigLinks.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.9rem,4.5vw,3.6rem)] uppercase leading-none tracking-wide text-bone transition-colors hover:text-ember"
                >
                  <span aria-hidden="true" className="font-mono text-[10px] tracking-[0.2em] text-tungsten/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Roll text={l.label} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mono coordinates strip. */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-y border-rust/50 py-3">
          <p className="corner-note">N 53.4818° — W 113.3773°</p>
          <p className="corner-note hidden sm:block">{site.street} · {site.city} {site.region}</p>
          <p className="corner-note">AFTER HOURS · ONE LAMP ON</p>
        </div>

        <div className="mt-10 grid gap-10 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="corner-note text-tungsten/80">The shop</p>
            <address className="mt-4 not-italic font-mono text-[13px] leading-relaxed text-steel">
              {site.street}
              <br />
              {site.city}, {site.region} {site.postalCode}
              <br />
              <a className="transition-colors hover:text-ember" href={`tel:${site.phone}`}>
                {site.phoneDisplay}
              </a>
              <br />
              <a className="transition-colors hover:text-ember" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </address>
            <p className="mt-4 font-mono text-[11px] text-steel/60">
              MON–FRI 09:00–17:00 · WEEKENDS CLOSED
            </p>
          </div>

          <nav aria-label="Services">
            <p className="corner-note text-tungsten/80">What we do</p>
            <ul className="mt-4 space-y-2 font-sub text-[13px] text-steel">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link className="transition-colors hover:text-bone" href={`/services/${s.slug}`}>
                    <Roll text={s.title} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Service areas">
            <p className="corner-note text-tungsten/80">Where we work</p>
            <ul className="mt-4 space-y-2 font-sub text-[13px] text-steel">
              <li>
                <Link className="transition-colors hover:text-bone" href="/edmonton">
                  <Roll text="Edmonton" />
                </Link>
              </li>
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link className="transition-colors hover:text-bone" href={`/edmonton/${a.slug}`}>
                    <Roll text={a.name} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="More">
            <p className="corner-note text-tungsten/80">The rest</p>
            <ul className="mt-4 space-y-2 font-sub text-[13px] text-steel">
              <li><Link className="transition-colors hover:text-bone" href="/builds"><Roll text="Builds" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/about"><Roll text="About Terry" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/reviews"><Roll text="Reviews" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/guides"><Roll text="Guides" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/faq"><Roll text="FAQ" /></Link></li>
              <li><Link className="transition-colors hover:text-bone" href="/contact"><Roll text="Contact" /></Link></li>
              <li>
                <a
                  className="transition-colors hover:text-bone"
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Roll text="Instagram" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

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
