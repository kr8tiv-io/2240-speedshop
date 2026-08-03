"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { Badge } from "@/components/Logo";

const links = [
  { href: "/services", label: "Services" },
  { href: "/builds", label: "Builds" },
  { href: "/edmonton", label: "Edmonton" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rust/25 bg-bay-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Badge className="h-9 w-auto" hole="#0b0b0d" title="" />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-2xl leading-none tracking-wide text-bone group-hover:neon">
              2240
            </span>
            <span className="font-sub text-[10px] uppercase tracking-[0.3em] text-steel">
              Speed Shop
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flicker font-sub text-xs uppercase tracking-[0.18em] text-steel transition-colors hover:text-bone"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="border border-speed-red/70 px-4 py-2 font-sub text-xs uppercase tracking-[0.18em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_18px_rgba(224,69,69,0.45)]"
          >
            Start your build
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className={`h-px w-6 bg-steel transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-steel transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-steel transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-rust/25 md:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {links.map((l) => (
              <li key={l.href} className="border-b border-rust/15 last:border-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-sub text-sm uppercase tracking-[0.18em] text-steel"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 px-5 pb-4">
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="flex-1 border border-speed-red/70 py-3 text-center font-sub text-xs uppercase tracking-[0.18em] text-bone"
            >
              Start your build
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="flex-1 border border-steel/40 py-3 text-center font-sub text-xs uppercase tracking-[0.18em] text-bone"
            >
              Call the shop
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
