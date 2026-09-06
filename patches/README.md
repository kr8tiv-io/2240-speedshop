# Next 16.2.12 cached fragment correction

The initial route cache can retain a document fragment in `route.canonicalUrl`.
Returning to that cached route appends the destination hash again, producing
`/quote/#form#form`. This was reproduced by opening `/quote/#form`, navigating
to Guides, and selecting its quote CTA in the production export.

The version-pinned pnpm patch removes only the cached fragment before adding
the requested one. Encoded `#` characters, paths, queries, SPA navigation and
animations remain unchanged. Both CJS and ESM builds are patched. No package
version was upgraded.

Use `pnpm install --frozen-lockfile`. Patch files retain LF endings so their
lockfile hashes are portable. On a future Next upgrade, remove this patch only
after `scripts/next-cached-fragment-contract.mjs` and the cold-fragment/Back
case in `scripts/site-actions-check.mjs` pass against the replacement version.

The preview server must serve exported `.txt` RSC payloads as `text/plain`, as
Hostinger does. Octet-stream responses cause Next to fall back to a second full
navigation and can hide the cached-fragment bug. Check this with
`node scripts/export-rsc-mime-contract.mjs` while the export server is running.
