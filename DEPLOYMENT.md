# DEPLOYMENT.md — Highline Builders & Roofing

Internal document. Not for public serving (excluded from Cloudflare and GitHub Pages output; see Internal File Protection). Last updated 2026-11-16.

## Status of what is and is not verified

**Unverified, and must stay labeled so until confirmed:**

- **Cloudflare zone settings and redirect rules.** Always Use HTTPS, HSTS and an apex → www redirect are not configured (verified live 2026-11-16: `http://` serves 200, apex serves 200). The local wrangler OAuth token has `zone (read)` only, so these must be set in the dashboard by an account with zone-settings and rules edit rights. Build settings (root directory, build command) are still dashboard-only, but the builds for `23c1a62`, `e121335` and `892ab9c` succeeded with the repo's `wrangler.jsonc`.

**Verified (2026-11-16):**

- Owner confirmed `https://www.highlineroofingwa.com/` as the production host.
- Worker `highlineroofing` custom domains: `www.highlineroofingwa.com` and `highlineroofingwa.com` (zone `6db56e4f…`). Production version `e1bde0e1` from merge commit `892ab9c`.
- Search Console: domain property `sc-domain:highlineroofingwa.com`; sitemap resubmitted, status Success.

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

## Redirect matrix (live, 2026-11-16, after Release 1)

| Request | Result |
| --- | --- |
| `https://www.highlineroofingwa.com/about` | 200, no redirect |
| `https://highlineroofingwa.com/about` | 200, no redirect to `www` (outstanding) |
| `http://www.highlineroofingwa.com/` and `http://highlineroofingwa.com/` | 200 over plain HTTP, no HTTPS redirect, no HSTS (outstanding) |
| `/about.html`, `/index.html`, `/contact.html` | 307 to the clean URL |
| `/about/` | 307 to `/about` |
| `/roof-replacement-offer` | 307 to `/roof-replacement-offer/` |
| Query strings | preserved on every hop |

After the dashboard changes, rerun this table and add: `http://highlineroofingwa.com/about?x=1` must end at `https://www.highlineroofingwa.com/about?x=1` with 200, and `https://www.highlineroofingwa.com/` must not redirect.

## Do not

- Merge PR #4 (`cloudflare/workers-autoconfig`). It is based on an old commit, would delete `roof-replacement-offer/index.html`, and publishes internal files.
- Promote a Cloudflare Worker version, change DNS, or change redirects without explicit approval.
- Claim any update is live until the live host has been checked.
- Print or commit Web3Forms access keys or Supabase tokens.
