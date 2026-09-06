"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type IntentLinkProps = Omit<LinkProps, "href" | "prefetch"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> & {
    href: string;
  };

const prefetchedRoutes = new Set<string>();

function navigateSameDocumentHash(event: MouseEvent<HTMLAnchorElement>) {
  const anchor = event.currentTarget;
  if (
    event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
    event.shiftKey || event.altKey || anchor.hasAttribute("download") ||
    (anchor.target && anchor.target !== "_self")
  ) return;
  const current = new URL(window.location.href);
  const destination = new URL(anchor.href);
  const pathname = (url: URL) => url.pathname.replace(/\/+$/, "") || "/";
  const queryChanged = destination.search !== current.search;
  const quoteLane = pathname(current) === "/quote" && destination.hash === "#form";
  if (!destination.hash || destination.origin !== current.origin ||
    pathname(destination) !== pathname(current) || (queryChanged && !quoteLane)) return;

  // Next's initial route cache can already include the fragment and append it
  // again on a repeat click. Keep same-document anchors native. Quote lanes
  // are client-side state on one static page: the supported native History
  // integration updates useSearchParams without consulting that cached route.
  event.preventDefault();
  const from = current.href;
  current.hash = destination.hash;
  if (queryChanged) current.search = destination.search;
  window.requestAnimationFrame(() => {
    // Let the mobile menu restore scrolling first; do not override a newer
    // navigation. Retaining the current pathname avoids a slash-only reload.
    if (window.location.href !== from) return;
    if (queryChanged) {
      window.history.pushState(null, "", current.href);
      const target = document.getElementById("form");
      if (target) {
        if (window.__lenis2240) window.__lenis2240.scrollTo(target);
        else target.scrollIntoView({ block: "start" });
      }
    } else window.location.assign(current.href);
  });
}

/**
 * Keep speculative route chunks out of the opening cinema waterfall, then
 * recover Next's instant-navigation feel as soon as a visitor signals intent.
 * Pointer, keyboard and touch visitors all receive the same behavior.
 */
export function IntentLink({
  href,
  onPointerEnter,
  onFocus,
  onTouchStart,
  onClick,
  ...props
}: IntentLinkProps) {
  const router = useRouter();

  const prefetch = () => {
    if (prefetchedRoutes.has(href)) return;
    prefetchedRoutes.add(href);
    router.prefetch(href);
  };

  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onClick={(event) => {
        onClick?.(event);
        navigateSameDocumentHash(event);
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented) prefetch();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (!event.defaultPrevented) prefetch();
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        if (!event.defaultPrevented) prefetch();
      }}
    />
  );
}
