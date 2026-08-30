"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";

type IntentLinkProps = Omit<LinkProps, "href" | "prefetch"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> & {
    href: string;
  };

const prefetchedRoutes = new Set<string>();

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
