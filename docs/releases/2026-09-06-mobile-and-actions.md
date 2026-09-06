# Published mobile, garage and interaction release

Production: https://2240speedshop.com/

- Release marker: `5990422f1d8c4e88977473ad9a08e491`
- Deployment: `427cff2776a486a799a9a3e317bc17d2edfd1cca`
- Application source: `6d5231d681d46d94b37ceebb1f0b3c7162d57c8b`, including `899f973`.
- Both source remotes are updated: `kr8tiv-io/2240-speedshop` and `kr8tiv-ai/2240-speedshop`.
- Subsequent verification-script/documentation commits do not change these published application bytes.

## Changes

Decorative image and garage canvases no longer intercept clicks on page controls
or the footer. Pointer-driven effects retain their existing window tracking.
Quote CTAs now arrive at the actual form, with native same-page handling for
mobile-menu cleanup and service selections. A version-pinned Next patch fixes
duplicated fragments when returning to an initially cached quote route, without
forcing full-page reloads.

The mobile film uses a stable large viewport for browser-toolbar movement.
Garage shader preparation overlaps the existing paced texture uploads and
compiles the actual scene's lights once, rather than warming a duplicate-light
variant. No model files, texture resolution, effects or camera choreography were
reduced. The contact map resolves the verified business name and street address.

## Verification

- Production build and TypeScript passed; targeted regression contracts passed.
- Prepared export: 127/127 browser interaction cases passed. All 69 pages' quote
  CTAs were clicked, plus desktop/mobile menus, Back navigation, shared footer
  links and the KR8TIV credit after garage initialization.
- Production browser pass: 61 interaction cases passed. Its map case timed out
  waiting for global network idleness; Google's map continues background
  requests. A focused rerun verifying resolved place data and loaded map imagery
  passed, with zero unexpected blocked requests. The audit guard was corrected
  to allow public Google place-detail reads while continuing to block real lead
  submissions. The original reports are retained, not rewritten as clean runs.
- Live footer/KR8TIV clicks and taps passed on desktop and 390px mobile emulation.
- Five-step quote validation, photo add/remove, Back/Next, and mocked success and
  failure passed. No real lead, call or email was sent; inbox delivery is unverified.
- All 69 live canonical pages and 24 critical/crawl/social assets match the
  prepared bytes after the exact release marker appeared and Hostinger cache
  purge succeeded. The sitemap matches all 69 canonical pages. The build has
  327 parseable JSON-LD blocks across 72 HTML files and no missing targets among
  5,324 same-origin HTML href/src references.
- Social metadata, crawler access, private-upload exclusions, AI discovery links
  and RSS/Atom/JSON feeds passed. Each feed contains 40 canonical articles.
- Apex and www HTTPS validate. HTTPS www redirects once to the apex; HTTP www
  takes Hostinger's HTTPS hop followed by the apex hop. Legacy GoDaddy blog paths
  redirect to the Journal. Mail records and nameservers were preserved.
- All 145 packaged Brotli model twins decode byte-for-byte to their originals.

## Measured garage comparison

Four sequential A/B/B/A runs compared the archived previous production build
with this release using fresh Chrome contexts, a 390×844 mobile-emulated viewport
and the same AMD Radeon 740M hardware renderer. Browser cache was disabled; the
local server used no-store. There was no network/CPU throttling, and OS/GPU driver
caches were not cleared. These are **not physical-phone or Safari measurements**.

| Mean timing | Previous | Published |
| --- | ---: | ---: |
| Renderer creation to world-ready | 8.049s | 6.867s |
| Renderer creation to shell-ready | 2.991s | 1.696s |
| Navigation to complete reveal, including the scripted approach | 18.809s | 17.747s |
| Startup long-task total | 3.574s | 2.988s |

The world-ready interval improved by about 14.7%; complete reveal was about
1.06 seconds earlier. Cold initialization remains material and is not claimed
to be instant. All four runs navigated all seven stations with no overflow or
browser errors, identical 74 model responses / 5,623,825 compressed model bytes,
and 131 textures. No general desktop FPS or physical-iPhone speed claim is made.

## Evidence and recovery

- `output/published-release-check.json`
- `output/playwright/site-actions-final-599042/results.json`
- `output/playwright/site-actions-live-599042-verified/results.json`
- `output/playwright/site-actions-live-map-final-599042/results.json`
- `output/playwright/garage-performance-2026-09-06/release-mobile-abba.json`
- Previous deployment: `3b6aa8e3`; exact prior export: `output/baseline-b4108.zip`.
  Existing checkpoint tags and older archives remain intact.

## External limits

SeaOcean's signed-in account is Free and its actual audit requires Pro. No 2240
score has been obtained; 95+ and search rankings are not claimed. Search Console
and Bing ownership, physical Apple-device testing and real email delivery remain
unverified. Hostinger CDN activation is not established; the cache-purge API's
generic CDN wording does not prove activation. Do not move nameservers to an
unprepared zone or disrupt Microsoft 365 to enable it.
