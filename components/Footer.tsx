import Link from "next/link";
import { site, services, areas } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rust/30 bg-panel/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl tracking-wide text-bone">2240 SPEED SHOP</p>
          <p className="mt-1 font-sub text-xs uppercase tracking-[0.25em] text-steel">
            Classics and Customs
          </p>
          <address className="mt-5 not-italic text-sm leading-relaxed text-steel">
            {site.street}
            <br />
            {site.city}, {site.region} {site.postalCode}
            <br />
            <a className="hover:text-bone" href={`tel:${site.phone}`}>
              {site.phoneDisplay}
            </a>
            <br />
            <a className="hover:text-bone" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
          <p className="mt-4 font-mono text-xs text-steel">Mon–Fri 9:00–17:00 · Weekends closed</p>
        </div>

        <nav aria-label="Services">
          <p className="font-sub text-xs uppercase tracking-[0.2em] text-neon-bloom">What we do</p>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {services.map((s) => (
              <li key={s.slug}>
                <Link className="hover:text-bone" href={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Service areas">
          <p className="font-sub text-xs uppercase tracking-[0.2em] text-neon-bloom">Where we work</p>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            <li>
              <Link className="hover:text-bone" href="/edmonton">
                Edmonton
              </Link>
            </li>
            {areas.map((a) => (
              <li key={a.slug}>
                <Link className="hover:text-bone" href={`/edmonton/${a.slug}`}>
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More">
          <p className="font-sub text-xs uppercase tracking-[0.2em] text-neon-bloom">The shop</p>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            <li><Link className="hover:text-bone" href="/builds">Builds</Link></li>
            <li><Link className="hover:text-bone" href="/about">About Terry</Link></li>
            <li><Link className="hover:text-bone" href="/reviews">Reviews</Link></li>
            <li><Link className="hover:text-bone" href="/guides">Guides</Link></li>
            <li><Link className="hover:text-bone" href="/faq">FAQ</Link></li>
            <li><Link className="hover:text-bone" href="/contact">Contact</Link></li>
            <li>
              <a className="hover:text-bone" href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="weld" />

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-steel sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}. Serving Edmonton &amp; area.
        </p>
        <p className="text-[11px] opacity-70">
          built with{" "}
          <span aria-label="love" role="img" className="text-neon-bloom">
            ♥
          </span>{" "}
          by{" "}
          <a
            href="https://kr8tiv.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-rust underline-offset-2 hover:text-bone"
          >
            kr8tiv
          </a>
        </p>
      </div>
    </footer>
  );
}
