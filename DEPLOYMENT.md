# DEPLOYMENT.md — Highline Builders & Roofing

Internal document. Not for public serving (excluded from Cloudflare and GitHub Pages output; see Internal File Protection). Last updated 2026-11-16.

## Status of what is and is not verified

**Unverified, and must stay labeled so until confirmed:**

- **Cloudflare build settings** (root directory, build command) are dashboard-only and were not inspected, but the builds for `23c1a62`, `e121335` and `892ab9c` succeeded with the repo's `wrangler.jsonc`.
- **HSTS** is not enabled (deliberately deferred).

**Verified (2026-11-16):**

- Owner confirmed `https://www.highlineroofingwa.com/` as the production host.
- Worker `highlineroofing` custom domains: `www.highlineroofingwa.com` and `highlineroofingwa.com` (zone `6db56e4f…`). Production version `e1bde0e1` from merge commit `892ab9c`.
- Search Console: domain property `sc-domain:highlineroofingwa.com`; sitemap resubmitted, status Success.
- Cloudflare zone: Always Use HTTPS on; Redirect Rule "Redirect apex to www (301)" (`http.host eq "highlineroofingwa.com"` → `concat("https://www.highlineroofingwa.com", http.request.uri.path)`, 301, query preserved). No Page Rules. Verified live, no loops.

**Verified earlier (2026-10-27 and 2026-11-04):**

- GitHub Pages is enabled (legacy build, source `main`, path `/`, no custom domain) and builds on every push to `main`.
- `www.highlineroofingwa.com` and `highlineroofingwa.com` returned 200 and served HTML byte-identical to `main` at `4e6a89f`.
- `highlinebuildersroofing.com` returns NXDOMAIN and does not respond.
- The Cloudflare Workers Builds check run `highlineroofing` succeeded on `main` (`4e6a89f`) and on `seo/technical-release-1`.

## Publishers

A push to `main` triggers two production publishers:

| Publisher | What it serves | Config location |
| --- | --- | --- |
| Cloudflare Workers Builds, project `highlineroofing` | `highlineroofingwa.com` and `www` (customer-facing) | Dashboard build settings plus `wrangler.jsonc` and `.assetsignore` (repo, on `main`) |
| GitHub Pages (Jekyll, legacy build) | `contractorarsenal.github.io/Highline-Roofing`, a second public copy with no custom domain | Pages settings plus `_config.yml` (repo, on `main`) |

There are no GitHub Actions workflow files. The Pages workflow is GitHub-managed.

## Internal File Protection

These files must never be publicly served:

`CLAUDE.md`, `PROJECT-STATUS.md`, `DEPLOYMENT.md`, `_config.yml`, `.assetsignore`, `wrangler.jsonc`, `.gitignore`.

- Cloudflare: listed in `.assetsignore`.
- GitHub Pages: listed in the `exclude:` list of `_config.yml`.
- When adding any new internal file, add it to **both** lists in the same commit.
- `robots.txt` is not a security control.
- Released 2026-11-16: all seven internal files return 404 on `www` and 404 or GitHub's 503 error page on GitHub Pages. Recheck after any change to the exclusion lists.

## Safe release workflow

1. **Branch.** Work on a feature branch. Never commit directly to `main`. Never force-push.
2. **Isolated build tests.** Copy the working tree (without `.git`) to a temporary directory outside the repo. Run the Jekyll build and a local Workers asset server there, then confirm the internal files are absent from the output. Do not rely on file-pattern matching alone.
3. **Review the diff.** Confirm there are no design, form, tracking-ID, or JavaScript changes unless approved.
4. **Check the Cloudflare Workers Builds check run** for the branch (`gh api repos/contractorarsenal/Highline-Roofing/commits/<sha>/check-runs`). A successful feature-branch build publishes a non-production preview URL (in the check-run summary, `noindex` via `X-Robots-Tag`); verify the excluded files return 404 there. A `queued` suite that never runs (as with `85207b9`) proves nothing.
5. **Approvals required before merge:** explicit owner approval for the release. For changes to `wrangler.jsonc`, review the Cloudflare dashboard build settings first.
6. **Merge to `main`** only with explicit approval. This publishes to both hosts.
7. **Post-release verification** (curl against both hosts):
   - `/`, `/about`, `/services`, `/reviews`, `/contact` return 200.
   - `/sitemap.xml` and `/robots.txt` return 200.
   - `/CLAUDE.md`, `/PROJECT-STATUS.md`, `/DEPLOYMENT.md`, `/_config.yml`, `/.assetsignore` and `/wrangler.jsonc` return 404.
   - Canonical tags match the approved domain.
   - GTM, GA4, Clarity and Meta Pixel IDs are still present once per page.
8. **Rollback.** Revert on a branch and run the same workflow. Cloudflare version rollback is done in the dashboard and needs approval (version before Release 1: `927b4221`; Release 1: `e1bde0e1`).

## Redirect matrix (live, 2026-11-16, after the Cloudflare changes)

| Request | Result |
| --- | --- |
| `https://www.highlineroofingwa.com/about?x=1` | 200, no redirect |
| `https://highlineroofingwa.com/about?x=1` | 301 → `https://www.highlineroofingwa.com/about?x=1` (1 hop) |
| `http://highlineroofingwa.com/about?x=1` | 301 → `https://www.highlineroofingwa.com/about?x=1` (1 hop) |
| `http://www.highlineroofingwa.com/about?x=1` | 301 → `https://www.highlineroofingwa.com/about?x=1` (1 hop) |
| `http://…/about.html?x=1`, `http://www…/contact.html` | 301 → 307 → clean HTTPS www URL (2 hops) |
| `/about/` | 307 to `/about` |
| `/roof-replacement-offer` | 307 to `/roof-replacement-offer/` |
| Query strings | preserved on every hop |
| HSTS | not enabled |

Rerun after any Cloudflare rule change. The preferred `https://www` URLs must stay at 0 hops.

## Do not

- Merge PR #4 (`cloudflare/workers-autoconfig`). It is based on an old commit, would delete `roof-replacement-offer/index.html`, and publishes internal files.
- Promote a Cloudflare Worker version, change DNS, or change the redirect rule / Always Use HTTPS without explicit approval.
- Claim any update is live until the live host has been checked.
- Print or commit Web3Forms access keys or Supabase tokens.
