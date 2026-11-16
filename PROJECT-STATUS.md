# PROJECT-STATUS.md — Highline Builders & Roofing

Internal document. Not for public serving. Last updated 2026-11-16 (post-release).

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
- Internal links on the seven root pages changed from `.html` hrefs to relative clean paths (179 links). 2026-11-16.
- Home links (35, logo/nav/footer) changed from `index.html` to `./`, with a 2-line change in `js/main.js` so `./` counts as the home href for the active-nav highlight. Approved by the owner 2026-11-16. Verified on a local Workers asset server (root) and on a GitHub-Pages-style subpath server: Home highlighted on `/` and `/Highline-Roofing/`, inner pages keep their highlight, clicking Home lands on the clean root. No visual change.
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
| Internal links (not in the audit, found during repair) | 179 `.html` hrefs per site, each 307 on production; active-nav highlight silently broken on inner pages | Relative clean hrefs; 0 redirects; active-nav works on inner pages (verified headless). 35 `index.html` home links changed to `./` (0 redirects) with the approved 2-line JS change |
| Internal files public | `/CLAUDE.md` 200, `/wrangler.jsonc` 200 (a file not in any repo commit) | Excluded via `.assetsignore` and `_config.yml` |

Redirect matrix observed live (unchanged by this release; all hosting-side): apex and `www` both 200 with no redirect; `http://` 200 with no redirect; `/about/` → 307 → `/about`; `/roof-replacement-offer` → 307 → `/roof-replacement-offer/`; `.html` → 307 → clean. Preview hosts on `workers.dev` carry `X-Robots-Tag: noindex`. Live `robots.txt` is Cloudflare's managed block (blocks 31 AI crawlers, allows `*`, no sitemap line) and will be prepended to the repo file after release; verify the `Sitemap:` line survives.

Tests run 2026-11-16 on the final tree:

- Diff review: HTML changes are only canonical/og/JSON-LD URLs, the 6 domain-text replacements, and `href` swaps; `css/styles.css`, `js/main.js`, forms, tracking IDs and the offer page are byte-identical to `main`.
- `wrangler dev` (local Workers assets): every internal href target 200 with 0 hops (home `./` → `/`, 0 hops); 7 internal files 404; all 12 public files byte-identical to source; sitemap URLs 200.
- Headless Chrome, 390 px mobile viewport, all 8 pages: CSS applied, H1 present, no horizontal scroll, 0 JS exceptions, `contactForm` and `rhc-form` present, tel links present, `gtag`/`fbq`/`clarity` defined, one GA4 `config` per page, correct canonical. Only failed requests: the Supabase video host (known) and `/favicon.ico` (known).
- Jekyll (GitHub Pages simulation): isolated Ruby 3.3.6 + Jekyll 4.3.4 build of the final tree, exit 0; output is exactly the 12 public files, byte-identical to source; `CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md`, `_config.yml`, `.assetsignore`, `wrangler.jsonc`, `.gitignore` absent. Negative control (exclude list removed) leaks all four docs/config files, so the test detects leaks. Limit: GitHub Pages uses the `github-pages` gem (Jekyll 3.10), a close approximation.


## Release 1 deployed (2026-11-16)

- **Approval:** owner confirmed `https://www.highlineroofingwa.com/` as the production host and authorized the home-link change and the merge (2026-11-16).
- **Merged:** PR #5 via merge commit `892ab9c` on `main` (contains `e121335` home links + `23c1a62` clean links and the earlier Release 1 commits). PR #4 untouched.
- **Deployments:** Cloudflare Workers Builds `deploy` succeeded 20:18 UTC, version `e1bde0e1-9b23-4b68-93fb-00b9ce48fa6b` (previous production version `927b4221`). GitHub Pages build succeeded for `892ab9c` (run 43948329475).
- **Cloudflare bindings (verified via API, read-only):** Worker `highlineroofing` has custom domains `www.highlineroofingwa.com` and `highlineroofingwa.com` (zone `6db56e4f…`, Free plan, nameservers jade/walt). Compatibility date matches `wrangler.jsonc`. No other bindings. The local wrangler OAuth token has `zone (read)` only, so zone settings, DNS and redirect rulesets could not be read or changed.
- **Production verification (www, 20:25 UTC):** all 12 public paths 200 with 0 hops and byte-identical to `main` (robots.txt differs only by Cloudflare's managed prefix); all 7 internal files 404; canonicals on all 8 pages point to `https://www.highlineroofingwa.com/` clean URLs; `href="./"` ×5 and no `index.html` hrefs; GTM/GA4 (one `config`)/Clarity/Meta inits present on `/`, `/contact`, `/roof-replacement-offer/`; `contactForm` and `rhc-form` present; `.html`, trailing-slash and no-slash variants 307 to the canonical form. Headless Chrome: active nav correct on every page on www and on the GitHub Pages subpath; clicking Home lands on the clean root. Apex serves byte-identical HTML with the www canonical.
- **GitHub Pages copy:** 12 public paths 200, byte-identical; internal files return 404 or GitHub's 503 edge error page (same as a nonexistent path), never the file.
- **robots.txt (live):** Cloudflare's managed block (Content-Signal + 31 AI/scraper crawlers disallowed, unchanged by request) followed by the repo block `User-agent: *` / `Allow: /` / `Sitemap: https://www.highlineroofingwa.com/sitemap.xml`. Googlebot is not named anywhere and is allowed.
- **Search Console:** the existing verified property is the **domain property** `sc-domain:highlineroofingwa.com` (the account has no access to the URL-prefix property `https://www.highlineroofingwa.com/`; none was created). `https://www.highlineroofingwa.com/sitemap.xml` had been submitted 2026-02-23 with status "Couldn't fetch" (last read 2026-04-24). Resubmitted 2026-11-16: status **Success**, 5 discovered pages.

### Cloudflare HTTPS enforcement and apex → www redirect (done 2026-11-16, ~20:50 UTC)

Configured in the Cloudflare dashboard (zone `highlineroofingwa.com`, signed-in browser session). Inspected first: 0 Redirect Rules, 0 Page Rules, no Bulk Redirects referencing the zone, Always Use HTTPS off, HSTS off, active edge certificates covering apex and `www`. DNS, Worker bindings, email records, AI crawler settings and all other settings untouched.

1. SSL/TLS → Edge Certificates → **Always Use HTTPS: on**. HSTS left off (enable later once the redirects have been stable; it is hard to undo).
2. Rules → Redirect Rules → single redirect **"Redirect apex to www (301)"**, enabled, order 1 of 1. Match: custom expression `(http.host eq "highlineroofingwa.com")`. Action: dynamic URL redirect, expression `concat("https://www.highlineroofingwa.com", http.request.uri.path)`, status 301, preserve query string on.

Live verification (curl, 20:57 UTC):

| Request | Chain | Final |
| --- | --- | --- |
| `http://highlineroofingwa.com/about?x=1` | 301 (1 hop) | `https://www.highlineroofingwa.com/about?x=1` 200 |
| `https://highlineroofingwa.com/about?x=1` | 301 (1 hop) | same, 200 |
| `http://www.highlineroofingwa.com/about?x=1` | 301 (1 hop) | same, 200 |
| `https://www.highlineroofingwa.com/about?x=1` | none (0 hops) | 200 served directly |
| `http://highlineroofingwa.com/about.html?x=1` | 301 → 307 (2 hops) | same, 200 |
| `http://www.highlineroofingwa.com/contact.html` (the GSC HTTP URL) | 301 → 307 | `https://www.highlineroofingwa.com/contact` 200 |
| `https://highlineroofingwa.com/services?utm_source=fb&utm_medium=cpc` | 301 | query string preserved |

No loops: `/`, `/about?x=1` and `/roof-replacement-offer/` on `https://www` return 200 with 0 hops; all 12 public paths on `www` still 200 with 0 hops. The redirect rule fires before Always Use HTTPS, so `http://apex` reaches `https://www` in a single hop.

### Follow-up items recorded separately

- **Broken video source:** four `<source>` elements (three in `index.html`, one in `about.html`) load MP4s from the Supabase project host `ivhxwbmlmqhqncbkjuou.supabase.co` (one public URL, three signed URLs). That host no longer resolves in DNS, so the videos fail on every page load (the browser logs `net::ERR_NAME_NOT_RESOLVED`). The poster images (GitHub user-attachments) still load, so the sections render without the video. Fix needs new hosting for the files and approval (media change).
- **Favicon:** no `<link rel="icon">` on any page and `/favicon.ico` returns 404 on production. Adding one needs a design asset from the client and approval.
