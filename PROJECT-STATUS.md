# PROJECT-STATUS.md — Highline Builders & Roofing

Internal document. Not for public serving. Last updated 2026-11-16.

## Baseline

- **Repository:** https://github.com/contractorarsenal/Highline-Roofing (public)
- **Production (verified 2026-11-04):** `www.highlineroofingwa.com` serves HTML identical to `main` at `4e6a89f`.
- **Not verified:** the Cloudflare production configuration, and final canonical-domain approval by the client.

## Branches

| Branch | State | Action |
| --- | --- | --- |
| `main` | `4e6a89f`, live, clean | Do not touch without approval |
| `seo/technical-release-1` | Unmerged. SEO Release 1 plus documentation and exclusion work | Active branch |
| `cloudflare/workers-autoconfig` (PR #4) | Open, outdated, unsafe | Do not merge. Closure needs approval |
| `chore/highline-claude-instructions` | Identical to `main` | Deletion needs approval |

## SEO Release 1 (branch `seo/technical-release-1`)

Done on the branch:

- Canonical, `og:url` and JSON-LD `url` values moved to `https://www.highlineroofingwa.com/` with clean URLs.
- `sitemap.xml` (five indexable pages) and `robots.txt` added.
- `wrangler.jsonc` added (name `highlineroofing`, assets directory `.`, `auto-trailing-slash`).
- Internal-file exclusions added for Cloudflare (`.assetsignore`) and GitHub Pages (`_config.yml`), covering `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md`, configs.
- Internal links on the seven root pages changed from `.html` hrefs to relative clean paths (179 links; home links stay `index.html`, see CLAUDE.md SEO section). 2026-11-16.
- Permanent documentation: `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md`.

Isolated build test results are listed in the section below.

## Isolated exclusion tests (2026-11-04)

Run in a temporary copy of the working tree outside the repository. Nothing was deployed or contacted in production.

| Test | Result |
| --- | --- |
| GitHub Pages: real Jekyll 3.9.5 build (GitHub Pages uses Jekyll 3.10 through the `github-pages` gem, so this is a close approximation, not the identical build) | Output contains only the 8 pages, `css/styles.css`, `js/main.js`, `sitemap.xml`, `robots.txt`. Absent: `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md`, `_config.yml`, `.assetsignore`, `wrangler.jsonc`. All 12 published files are byte-identical to source. |
| Jekyll negative control (excludes removed) | `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md` and `wrangler.jsonc` all leak. This shows the test detects a leak. |
| Cloudflare: Wrangler 4.157.0 local asset server (`wrangler dev --local`) using the repo `wrangler.jsonc` | The 10 site URLs, including `/sitemap.xml` and `/robots.txt`, return 200. The 7 internal files plus case, trailing-slash and percent-encoded variants of `CLAUDE.md` return 404. |
| Wrangler negative control (`.assetsignore` removed) | `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md` and `wrangler.jsonc` all return 200. |

Limits of these tests: they exercise Wrangler's local asset handling, not the Cloudflare production build. The production dashboard settings (for example a different root directory) could change the result. Final proof requires checking both live hosts after release.

## Release blockers

1. Client approval of the canonical domain.
2. Cloudflare dashboard settings and route bindings not inspected (unverified).
3. Cloudflare previews exist only for builds that actually run; the suite for `85207b9` stayed `queued`. Exclusion of the two newest docs is confirmed locally, and on Cloudflare only once a new build runs.
4. Redirect policy (apex versus `www`, HTTP to HTTPS) is undecided and lives in Cloudflare.

## Unresolved problems (not approved for repair)

- Live `/CLAUDE.md` is publicly reachable (200) until this branch is released.
- `sitemap.xml` returns 404 on the live host until release.
- GitHub Pages is a second public copy with no noindex or redirect.
- Contact form uses `novalidate` with no JS validation.
- Two Meta Pixel IDs need ownership verification. Possible duplicate Clarity init through GTM. No consent gating on any tracker.
- Unverified business claims and `aggregateRating` 5.0 / 24 in JSON-LD.
- Supabase signed video URLs may expire. Images are hotlinked from GitHub user-attachments.
- No favicon or custom 404 page. Offer page is neither `noindex` nor in the navigation.
- Stale TODO comments in HTML. Footer credit "Built by contractorarsenal.com" needs client confirmation. Business email is a Gmail address.

## Next priorities

1. Obtain canonical-domain approval and Cloudflare dashboard settings, then request final production approval for SEO Release 1.
2. Contact form validation (needs approval, since it changes JavaScript behavior).
3. Validate or remove unverifiable claims and review schema. Clean up tracking (Meta Pixel ownership, Clarity duplicate).

## Needed from the business owner

- Canonical domain approval, and registrar status of `highlinebuildersroofing.com`.
- Cloudflare dashboard access or screenshots of build settings and bindings.
- WA contractor registration number and proof of insurance.
- Proof for the claims (third-generation, 100 years combined experience, same-day response, financing, emergency service).
- Review sources behind the 24-review rating.
- Meta Pixel ownership confirmation.
- Permanent hosting for images and videos.
- Decision on the footer credit and a business-domain email.

## SEO Release 1 before/after record (2026-11-16)

Reproduced on production (`www.highlineroofingwa.com`, which serves `main` at `4e6a89f`) before any change. "After" is the state of branch `seo/technical-release-1`, verified on a local Workers asset server (`wrangler dev`) and in headless Chrome; production is unchanged until the branch is merged.

| Reported item | Before (live, 2026-11-16) | After (branch) |
| --- | --- | --- |
| Canonicals point to `highlinebuildersroofing.com` | Confirmed on all 8 pages; host is NXDOMAIN | All 8 canonicals, `og:url` and JSON-LD `url` use `https://www.highlineroofingwa.com/` clean URLs |
| Inner canonicals use `.html` URLs that redirect | Confirmed: `/about.html` etc. return 307 to clean URL | Canonicals are the clean URLs, which return 200 with no redirect |
| `/sitemap.xml` 404 | Confirmed | `sitemap.xml` with the 5 indexable pages; `robots.txt` references it |
| Missing `/roof-repair`, `/roof-replacement`, `/roof-installation`, `/siding`, `/faqs`, `/request-estimate` | All 404. None ever existed in repository history (only the 8 current pages did). Not a regression. | Left as 404 on purpose; no redirects invented. Services are sections on `/services` (`#repair`, `#replacement`, `#installation`, `#siding`, `#gutters`, `#inspections`); estimate requests are `/contact`. New pages would be new content, listed under Needed from the business owner. |
| Search Console lists an HTTP contact URL | Live condition, not stale: `http://www.highlineroofingwa.com/contact.html` → 307 → `http://.../contact` served over HTTP (200). No HTTPS upgrade, no HSTS. | Not fixable in the repository (assets-only Worker). Needs Cloudflare "Always Use HTTPS" (dashboard, approval). |
| Internal links (not in the audit, found during repair) | 179 `.html` hrefs per site, each 307 on production; active-nav highlight silently broken on inner pages | Relative clean hrefs; 0 redirects; active-nav works on inner pages (verified headless). 35 `index.html` home links kept (one 307) for the reason in CLAUDE.md |
| Internal files public | `/CLAUDE.md` 200, `/wrangler.jsonc` 200 (a file not in any repo commit) | Excluded via `.assetsignore` and `_config.yml` |

Redirect matrix observed live (unchanged by this release; all hosting-side): apex and `www` both 200 with no redirect; `http://` 200 with no redirect; `/about/` → 307 → `/about`; `/roof-replacement-offer` → 307 → `/roof-replacement-offer/`; `.html` → 307 → clean. Preview hosts on `workers.dev` carry `X-Robots-Tag: noindex`. Live `robots.txt` is Cloudflare's managed block (blocks 31 AI crawlers, allows `*`, no sitemap line) and will be prepended to the repo file after release; verify the `Sitemap:` line survives.

Tests run 2026-11-16 on the final tree:

- Diff review: HTML changes are only canonical/og/JSON-LD URLs, the 6 domain-text replacements, and `href` swaps; `css/styles.css`, `js/main.js`, forms, tracking IDs and the offer page are byte-identical to `main`.
- `wrangler dev` (local Workers assets): every internal href target 200 with 0 hops (`index.html` 1 hop); 7 internal files 404; all 12 public files byte-identical to source; sitemap URLs 200.
- Headless Chrome, 390 px mobile viewport, all 8 pages: CSS applied, H1 present, no horizontal scroll, 0 JS exceptions, `contactForm` and `rhc-form` present, tel links present, `gtag`/`fbq`/`clarity` defined, one GA4 `config` per page, correct canonical. Only failed requests: the Supabase video host (known) and `/favicon.ico` (known).
- Jekyll (GitHub Pages simulation): isolated Ruby 3.3.6 + Jekyll 4.3.4 build of the final tree, exit 0; output is exactly the 12 public files, byte-identical to source; `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md`, `_config.yml`, `.assetsignore`, `wrangler.jsonc`, `.gitignore` absent. Negative control (exclude list removed) leaks all four docs/config files, so the test detects leaks. Limit: GitHub Pages uses the `github-pages` gem (Jekyll 3.10), a close approximation.
