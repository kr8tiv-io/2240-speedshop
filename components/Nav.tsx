"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { RollText } from "@/components/fx/RollText";

const links = [
  { href: "/services", label: "Services", n: "01" },
  { href: "/builds", label: "Builds", n: "02" },
  { href: "/edmonton", label: "Edmonton", n: "03" },
  { href: "/guides", label: "Guides", n: "04" },
  { href: "/about", label: "About", n: "05" },
  { href: "/reviews", label: "Reviews", n: "06" },
];

/**
 * DAYLIGHT nav: a thin instrument strip. Transparent over the hero; after
 * 100px it morphs into a compact hairline bar — paper glass at 92%, hairline
 * bottom rule, tightened padding. Desktop links carry the char-roll hover and
 * the active page keeps a drawn ink underline. Mobile opens a full-screen
 * panel with big display type.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled || open
          ? "border-[#141414]/10 bg-bay-black/92 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[92rem] items-center justify-between px-5 transition-[padding] duration-500 sm:px-8 ${
          scrolled || open ? "py-2" : "py-3.5"
        }`}
      >
        <Link href="/" className="group flex items-baseline gap-3" onClick={() => setOpen(false)}>
          <span
            className={`font-display leading-none tracking-[0.02em] text-bone transition-all duration-500 group-hover:text-ember ${
              scrolled ? "text-[22px]" : "text-[26px]"
            }`}
          >
            2240
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-steel sm:block">
            Speed Shop / Edmonton AB
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`relative px-4 py-2 font-sub text-[11px] uppercase tracking-[0.2em] transition-colors ${
                isActive(l.href) ? "text-bone" : "text-steel hover:text-bone"
              }`}
            >
              <span aria-hidden="true" className="mr-1.5 font-mono text-[9px] text-tungsten/60">
                {l.n}
              </span>
              <RollText text={l.label} />
              {/* active-page underline — draws in from the left */}
              <span
                aria-hidden="true"
                className={`absolute bottom-1 left-4 right-4 h-px origin-left bg-bone transition-transform duration-500 ease-out ${
                  isActive(l.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
          <Link href="/quote" data-magnetic className="cta ml-4 !px-6 !py-3 !text-[11px]">
            Start your build
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
        >
          <span
            className={`h-px w-6 bg-bone transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-bone transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-bone transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Full-screen mobile panel — the menu is a room, not a dropdown. */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`fixed inset-0 top-[57px] flex flex-col justify-between bg-bay-black/97 px-6 pb-8 pt-10 backdrop-blur-lg transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul>
          {links.map((l, i) => (
            <li key={l.href} className="border-b border-rust/50">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-4"
              >
                <span className="font-mono text-[10px] text-tungsten/70">{l.n}</span>
                <span
                  className={`font-display text-4xl uppercase leading-none tracking-wide ${
                    isActive(l.href) ? "text-ember" : "text-bone"
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {l.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Link href="/quote" onClick={() => setOpen(false)} className="cta flex-1 text-center">
              Start your build
            </Link>
            <a href={`tel:${site.phone}`} className="cta cta-ghost flex-1 text-center">
              Call the shop
            </a>
          </div>
          <p className="corner-note">
            {site.street} · {site.city} {site.region} · Mon–Fri 9–5
          </p>
        </div>
      </nav>
    </header>
  );
}
