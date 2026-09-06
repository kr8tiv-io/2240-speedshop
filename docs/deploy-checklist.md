# Production deploy checklist (SEO / crawl)

Before any **production** export or Hostinger ship to `2240speedshop.com`:

1. **Leave `HOSTINGER_PREVIEW` unset.** Never set `HOSTINGER_PREVIEW=1` on a production build.
2. Confirm `out/robots.txt` allows Googlebot (`Disallow` must **not** be `/` for Googlebot). Preview builds intentionally emit `Googlebot Disallow: /` — that must never reach apex.
3. Confirm `EXPORT=1` / `BASEPATH` match the intended host (no preview packaging as apex).
4. Bake `NEXT_PUBLIC_GA_ID` only when a real GA4 Measurement ID (`G-…`) is available; do not invent one.

See `app/robots.ts` for the host-aware robots policy.
