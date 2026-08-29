"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Roll } from "@/components/fx/Roll";
import { setUIOverlay } from "@/components/ui-overlay";

const links = [
  { href: "/services", label: "Services", n: "01" },
  { href: "/builds", label: "Builds", n: "02" },
  { href: "/edmonton", label: "Edmonton", n: "03" },
  { href: "/guides", label: "Guides", n: "04" },
  { href: "/about", label: "About", n: "05" },
  { href: "/reviews", label: "Reviews", n: "06" },
  { href: "/blog", label: "Journal", n: "07" },
];

/**
 * AFTER HOURS nav: a thin instrument strip. Transparent over the hero, a dark
 * plate once the page moves. Desktop links carry the backlit hover language;
 * mobile opens a full-screen panel with big display type.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const closeMenu = () => {
    if (disclosureRef.current) disclosureRef.current.open = false;
    setOpen(false);
  };

  useEffect(() => {
    // A tap can open the native disclosure before React hydrates. Adopt that
    // state on mount, then add the focus trap, iOS body lock, and GPU pause.
    if (disclosureRef.current?.open) setOpen(true);
  }, []);

  useEffect(() => {
    // 100px: past the first breath of the page, the bar compacts to a hairline.
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const shell = document.getElementById("site-shell");
    const trigger = triggerRef.current;
    const scrollY = window.scrollY;
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      shellInert: shell?.inert ?? false,
      shellAriaHidden: shell?.getAttribute("aria-hidden") ?? null,
    };

    setUIOverlay("menu");
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    // iOS Safari can keep moving an overflow-hidden root. Fix the body at the
    // exact scroll offset and restore that offset when the modal closes.
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (shell) {
      shell.inert = true;
      shell.setAttribute("aria-hidden", "true");
    }

    const focusable = () =>
      [...(panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [])].filter((element) => !element.hasAttribute("hidden"));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const focusFrame = window.requestAnimationFrame(() => focusable()[0]?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      if (shell) {
        shell.inert = previous.shellInert;
        if (previous.shellAriaHidden === null) shell.removeAttribute("aria-hidden");
        else shell.setAttribute("aria-hidden", previous.shellAriaHidden);
      }
      window.scrollTo(0, scrollY);
      window.__lenis2240?.scrollTo(scrollY, { immediate: true, force: true });
      setUIOverlay(null);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-500 ${
        scrolled || open
          ? "border-b border-bone/[0.07] bg-bay-black/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[92rem] items-center justify-between px-5 transition-[padding] duration-500 sm:px-8 ${
          scrolled && !open ? "py-2" : "py-3.5"
        }`}
      >
        <Link href="/" className="group flex items-baseline gap-3" onClick={closeMenu}>
          <span className="font-display text-[26px] leading-none tracking-[0.02em] text-bone transition-colors group-hover:text-ember">
            2240
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-steel sm:block">
            Speed Shop / Edmonton AB
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`backlit relative !bg-transparent px-4 py-2 font-sub text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-bone ${
                  active ? "is-active text-bone" : "text-steel"
                }`}
              >
                <span aria-hidden="true" className="mr-1.5 font-mono text-[9px] text-tungsten/60">
                  {l.n}
                </span>
                <Roll text={l.label} />
                <span className="nav-underline" aria-hidden="true" />
              </Link>
            );
          })}
          <Link href="/quote" data-magnetic className="cta ml-4 !px-6 !py-3 !text-[11px]">
            Start your build
          </Link>
        </nav>

        {/* Native disclosure first, React enhancement second. A tap between
            first paint and hydration opens this immediately; once hydrated,
            onToggle adds the modal focus/scroll/GPU ownership behavior. */}
        <details
          ref={disclosureRef}
          className="group lg:hidden"
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary
            ref={triggerRef}
            aria-controls="mobile-nav"
            aria-label="Open main menu"
            onClick={(event) => {
              /* If a no-JS tap opened the disclosure while React was still
                 hydrating, React may replay that same click. Its native
                 default would close the already-open menu again. The panel
                 covers this trigger while open, so preserving that state is
                 both the correct replay behavior and invisible to ordinary
                 hydrated interaction. */
              if (disclosureRef.current?.open) event.preventDefault();
            }}
            className="flex h-12 w-12 touch-manipulation cursor-pointer list-none flex-col items-center justify-center gap-[6px] rounded-full outline-none transition-colors marker:content-none hover:bg-bone/[0.06] focus-visible:ring-2 focus-visible:ring-tungsten focus-visible:ring-offset-2 focus-visible:ring-offset-bay-black [&::-webkit-details-marker]:hidden"
          >
            <span className="h-px w-6 bg-bone transition-transform duration-300 group-open:translate-y-[7px] group-open:rotate-45" />
            <span className="h-px w-6 bg-bone transition-opacity duration-300 group-open:opacity-0" />
            <span className="h-px w-6 bg-bone transition-transform duration-300 group-open:-translate-y-[7px] group-open:-rotate-45" />
          </summary>

          {/* Full-screen mobile panel — an isolated room, never a transparent dropdown. */}
          <div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            tabIndex={-1}
            className="mobile-menu-panel fixed inset-0 z-[110] isolate min-h-screen h-[100dvh] overflow-y-auto bg-[#070708] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] outline-none"
          >
            <div className="mx-auto flex min-h-full w-full max-w-[42rem] flex-col">
              <div className="flex min-h-16 items-center justify-between border-b border-bone/10">
                <Link href="/" onClick={closeMenu} className="flex min-h-12 items-center">
                  <span className="font-display text-[26px] leading-none tracking-[0.02em] text-bone">2240</span>
                  <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.24em] text-steel">
                    Edmonton AB
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full outline-none hover:bg-bone/[0.06] focus-visible:ring-2 focus-visible:ring-tungsten"
                >
                  <span className="absolute h-px w-6 rotate-45 bg-bone" />
                  <span className="absolute h-px w-6 -rotate-45 bg-bone" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 py-2 min-[380px]:py-4">
                <ul>
                  {links.map((link, index) => (
                    <li key={link.href} className="border-b border-rust/50">
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="mobile-menu-link flex min-h-12 items-center gap-4 py-2.5 outline-none focus-visible:bg-bone/[0.05]"
                        style={{ animationDelay: `${index * 28}ms` }}
                      >
                        <span className="w-5 font-mono text-[9px] text-tungsten/75">{link.n}</span>
                        <span className="font-display text-[clamp(1.75rem,8.5vw,2.5rem)] uppercase leading-none tracking-[0.035em] text-bone">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-3 border-t border-bone/10 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/quote" onClick={closeMenu} className="cta min-h-12 text-center">
                    Start your build
                  </Link>
                  <a
                    href={`tel:${site.phone}`}
                    onClick={closeMenu}
                    className="cta cta-ghost min-h-12 text-center"
                  >
                    Call the shop
                  </a>
                </div>
                <p className="corner-note pb-1">
                  {site.street} · {site.city} {site.region} · Mon–Fri 9–5
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
