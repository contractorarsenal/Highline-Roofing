# PROJECT-STATUS.md — Highline Builders & Roofing

Internal document. Not for public serving. Last updated 2026-11-04.

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
3. No preview exists for feature branches, so exclusion cannot be confirmed on a live preview. It can only be confirmed after release, on both hosts.
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
