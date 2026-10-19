# CLAUDE.md — Highline Builders & Roofing Website

Project instructions for Claude Code. Facts were verified against the repository on 2026-10-15 unless marked otherwise. Anything not verified is labeled **Unverified**.

## Project Overview

This project is the static HTML website for Highline Builders & Roofing, an Everett, WA roofing contractor serving Snohomish County.

The goal of this site is to generate roofing leads through calls, estimate requests, SEO visibility, and trust-building local content.

## Core Business Info

- **Business Name:** Highline Builders & Roofing
- **Location:** Everett, WA
- **Service Area:** Everett, Bothell, Mill Creek, Lynnwood, Marysville, Snohomish, Mukilteo, Lake Stevens, and Snohomish County.
- **Phone:** 425-321-8309
- **Tel Link:** `tel:+14253218309`
- **Email:** Highlinebuilderswa@gmail.com (appears in the site's contact details)
- **Website:** https://highlinebuildersroofing.com/
- **Primary CTA:** Get Free Estimate
- **Secondary CTA:** Call Now

### Services

Listed on the services page: Roof Repair, Roof Replacement, Roof Installation, Roof Inspections, Gutter Systems, and Siding. Storm damage work is mentioned in the meta descriptions and home page.

### Business Claims (Unverified)

These appear on the site but have not been validated. Do not repeat or add new claims without verification:

- "Licensed and insured" (no WA contractor registration number is displayed)
- "Third-generation, family-owned"
- "Over 100 years of combined experience"
- "Same-day response"
- "Emergency roofing service in Everett"
- "Financing options are available"
- "5-Star Rated" and `aggregateRating` of 5.0 from 24 reviews (in JSON-LD on index, reviews, about, and offer pages)
- Offer terms: free seamless gutters up to 150 linear feet, or $1,200 off a qualifying full roof replacement

## Website Architecture

### Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home page |
| `about.html` | About |
| `services.html` | Services |
| `reviews.html` | Reviews |
| `contact.html` | Contact and estimate request form |
| `privacy-policy.html` | Privacy Policy (`noindex, follow`) |
| `terms-of-service.html` | Terms of Service |
| `roof-replacement-offer/index.html` | Standalone Facebook landing page, "Free Roof Inspection" offer. Not linked in site navigation. |

All eight pages are self-contained HTML files. The offer page has its own inline `<script>` blocks. The other pages load `js/main.js`.

### Folder Layout

```
index.html, about.html, services.html, reviews.html, contact.html,
privacy-policy.html, terms-of-service.html   (site root)
css/styles.css                                (all site styles, ~2,970 lines)
js/main.js                                    (shared site JavaScript)
roof-replacement-offer/index.html             (standalone landing page, loads ../css and ../js)
Claude.MD → renamed to CLAUDE.md             (this file)
```

- There are no local image, video, or font files. Media is hosted externally (see Known Issues).
- No build step, package manager, or framework config exists.

### Tech Stack

This is a static HTML/CSS/JS site.

Do not convert this project to React, Next.js, WordPress, or any framework unless specifically requested.

## Design System (from `css/styles.css`)

Colors are CSS custom properties on `:root`:

| Token | Value | Use |
| --- | --- | --- |
| `--black` | `#0D2037` | Base dark navy |
| `--deep` | `#1A3253` | Section background |
| `--card` | `#1E3A5F` | Card background |
| `--card-hover` | `#24436E` | Card hover |
| `--gold` | `#FAA421` | Primary accent and CTA color |
| `--gold-light` | `#FBB84F` | Accent hover |
| `--white` | `#FFFFFF` | Text on dark |
| `--off-white` | `#F0F5FA` | Light background |
| `--muted` | `#8BAAC4` | Secondary text |

- **Fonts:** Bebas Neue (`--font-display`, headings), DM Sans (`--font-body`), Playfair Display (`--font-accent`). Loaded from Google Fonts.
- **Shape:** Asymmetric corner radii, `--radius: 16px 0 16px 0`, `--radius-sm: 8px 0 8px 0`.
- **Layout:** `--max-width: 1280px`; section padding `120px 0` (`--section-pad`) and `80px 0` (`--section-pad-sm`).
- **Motion:** `--transition: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Use the existing tokens. Do not hardcode new colors.

## HTML, CSS, and JavaScript Conventions

- **HTML:** Every page has a viewport meta tag. Keep the GTM placement rules below. Schema is JSON-LD in `<script type="application/ld+json">`.
- **CSS:** One stylesheet. Responsive rules live in six `@media` blocks. Phone-width layout must work without horizontal scroll.
- **JS (`js/main.js`):** Wrapped in an IIFE with `'use strict'`. Handles:
  - Nav scroll state and hamburger menu
  - Active nav link
  - Intersection Observer reveal animations (`.fade-up`, `.fade-in`, `.slide-left`, `.slide-right`)
  - Counter animation (`data-count`)
  - Before/after slider (`.ba-slider`)
  - Video autoplay on scroll (`video[data-autoplay]`)
  - Contact form AJAX submit (Web3Forms)
  - Hero parallax (respects `prefers-reduced-motion`)
  - Smooth scroll for `#` anchors
  - Reveal buttons for phone and email (`.reveal-btn`)
- The offer page has its own inline JavaScript for multi-step form logic, UTM capture, and submission.

## Forms and Lead Capture

Both forms submit to Web3Forms (`https://api.web3forms.com/submit`). The access keys live in hidden `access_key` fields in the HTML. Do not print, copy into docs, or move them without approval.

### Contact Form (`contact.html`)

- Form id `contactForm`, submitted by `js/main.js` via `fetch` with `FormData`.
- Fields: name, phone (required), email, address, message, plus hidden `subject`.
- Success and error boxes: `#formSuccess` and `#formError`.
- Has a `botcheck` honeypot checkbox.
- **Open issue:** the form uses `novalidate` and `main.js` has no validation, so `required` attributes are not enforced in the browser.

### Offer Form (`roof-replacement-offer/index.html`)

- Multi-step form, id `rhc-form`, with inline validation.
- Hidden fields: `source` ("Facebook Roofing Landing Page"), `page_url`, `cta_location`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `roof_issue`, `offer`.
- UTM and fbclid values are stored in `sessionStorage` under key `hl_lp_utms` and written into the hidden fields.
- Has a `botcheck` honeypot checkbox.
- Submits via Web3Forms. On success it fires the Meta `Lead` event (content_name "Free Roof Inspection Bonus Offer").

## Tracking and Advertising (Protected)

Do not remove, duplicate, or alter these without explicit instructions:

| Integration | ID / Detail | Where |
| --- | --- | --- |
| Google Tag Manager | `GTM-N8XLLRPV` | Every HTML page (head script and noscript iframe) |
| Google Analytics 4 | `G-L1Y3K9JYTW` (direct `gtag.js`, one `config` call per page) | Every HTML page, immediately after the GTM head block. No consent gating exists on the site. |
| Microsoft Clarity | `ygb2svjdci` | Every HTML page (direct snippet). The published GTM container also carries a tag with this project ID (see Known Issues). |
| Meta Pixel | `1076795415074859` and `1053488807263721` (two `fbq('init')` calls) | Every HTML page. Both IDs **need ownership verification.** |
| Meta events, offer page | `PageView` (all pages), `ViewContent` on load, `Contact` on click of phone links (`.rhc-tel-link`), `Lead` on successful submission | `roof-replacement-offer/index.html` |
| UTM and fbclid capture | `sessionStorage` key `hl_lp_utms`, hidden form fields | Offer page |

### Google Tag Manager Rules

Every HTML page must include the GTM head script immediately after the opening `<head>` tag.

Every HTML page must include the GTM noscript iframe immediately after the opening `<body>` tag.

Do not install GTM more than once on the same page.

Do not place the GTM script below meta tags, schema, fonts, or CSS.

Do not place the noscript iframe inside nav, sections, div wrappers, or the footer.

Current pages comply: GTM head on line 3–9 of each file, noscript right after `<body>`.

### GTM Head Snippet

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N8XLLRPV');</script>
<!-- End Google Tag Manager -->
```

## SEO

- Every page has a unique `<title>`, `meta description`, canonical link, Open Graph tags, and Twitter tags.
- JSON-LD schema: `RoofingContractor` on home, about, services, contact, reviews, and offer pages. `FAQPage` on home, services, and offer pages. Review schema on reviews. Offer page also has a schema description for the offer.
- Canonical URLs use `https://highlinebuildersroofing.com/...`. The offer page canonical has no `.html` extension.
- `privacy-policy.html` has `noindex, follow`.
- **Missing:** `sitemap.xml`, `robots.txt`, favicon, and custom 404 page.

## Git and GitHub Workflow

- **Repository:** https://github.com/contractorarsenal/Highline-Roofing (public)
- **Remote:** `origin` → `https://github.com/contractorarsenal/Highline-Roofing.git`
- **Default branch:** `main`, tracking `origin/main`
- **Repo-local author identity:** Jay Duran `<259208228+contractorarsenal@users.noreply.github.com>`. Do not change global Git config.
- `.DS_Store` is excluded in `.git/info/exclude`. Do not commit it.
- Remote branches: `main`, and `cloudflare/workers-autoconfig` (not merged).
- Open PRs: **#4**, "Add Cloudflare Workers configuration" (bot-generated). Do not merge without explicit approval.
- Rules:
  - Treat `main` as deployment-sensitive. Pushing to `main` triggers a GitHub Pages build.
  - Prefer feature branches for nontrivial changes.
  - Never force-push.
  - Never discard uncommitted changes.
  - Never merge PRs without approval.
  - Do not delete branches without approval.
  - Commit and push only with explicit approval.

## Deployment

- **Verified:** GitHub Pages is enabled on the repo (legacy build, source `main` branch, `/` path). Pushes to `main` trigger the "pages build and deployment" workflow. Last successful runs: 2026-09-26 at 14:38 and 14:47 UTC.
- **GitHub Pages URL:** https://contractorarsenal.github.io/Highline-Roofing/
- **Custom domain on GitHub Pages:** None configured (Pages API `cname: null`).
- **Production domain:** https://highlinebuildersroofing.com/. **Its hosting provider is not verified.** Do not claim a site update is live on the production domain until the real host is confirmed.
- **DNS observation (2026-10-19):** `highlinebuildersroofing.com` returned NXDOMAIN from the working environment (`host`, `nslookup`, and `curl` all failed to resolve it), while other hosts resolved normally. The domain may be unregistered, unconfigured, or not yet propagated. Confirm DNS with the domain registrar before any production claim.
- **Cloudflare:** PR #4 proposes a Workers config (`wrangler.jsonc`, name `highlineroofing`, assets directory `.`) and a `.gitignore`. It is not merged and not deployed. Do not modify Cloudflare configuration without approval.
- No GitHub Actions workflow files exist in the repository. The Pages workflow is GitHub-managed.

## Remote Development Commands

These are the agreed command phrases. Each has a fixed scope.

- **"Check website"** — Inspect and report. No file changes. Read-only checks only.
- **"Update website"** — Implement and verify requested changes locally. Prefer a feature branch. Do not deploy unless authorized.
- **"Push live"** — Review Git changes, verify the deployment destination (GitHub Pages today; Cloudflare only if approved), run appropriate checks, and publish only after explicit authorization. Pushing to `main` is live publishing.
- **"Status"** — Report Git state, recent commits, open PRs, and outstanding issues.
- **"Refresh context"** — Review relevant Git changes and this file. No full repository scan.

## Token Efficiency

- Read this file before inspecting the repository.
- Use targeted searches (`grep -n`, specific files). Avoid full-project scans.
- Do not launch subagents for routine tasks.
- Do not repeat large file contents in reports.
- Run only checks relevant to the requested change. Do not run builds, since none exist.

## Known Issues (Outstanding, Not Approved for Repair)

- Production domain hosting unverified.
- Cloudflare PR #4 remains open.
- Contact form validation requires investigation (`novalidate` with no JS validation).
- Supabase signed media URLs may expire. Three signed `object/sign/` video URLs exist across `about.html` and `index.html`. Tokens are embedded in the URLs and must not be copied elsewhere.
- Two Meta Pixel IDs require ownership verification.
- Business claims and review schema (`aggregateRating` 5.0 / 24) require validation.
- Missing `sitemap.xml`, `robots.txt`, favicon, and 404 page.
- External image hosting dependencies. Images are hotlinked from `github.com/user-attachments/assets/`. The site has no local image files.
- Possible double Clarity initialization: the published GTM container (`GTM-N8XLLRPV`) contains one tag whose config holds Clarity project ID `ygb2svjdci`, in addition to the direct Clarity snippet on every page. Not yet verified in the GTM UI.
- GTM container check: the published container has no GA4 tag. The GA4 ID `G-L1Y3K9JYTW` is installed directly only. A second gtag.js request with a `gtm=` parameter appears intermittently in browser tests, but it sends no extra `config` or `page_view`.
- Stale HTML comments: "TODO: Replace with real … profile URL before launch" appear near social links that already contain URLs.
- Footer credit "Built by contractorarsenal.com" appears on every page. Confirm the client wants it.
- Offer page is not in site navigation and is not `noindex`.
- Business email is a Gmail address.

## Constraints

- Do not convert the project to a framework.
- Do not remove or alter tracking without explicit instructions.
- Never print or commit private credentials. Web3Forms access keys and Supabase tokens are sensitive in this sense.
- Do not modify website source files during a "Check website" or "Status" command.
