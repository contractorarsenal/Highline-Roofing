# CLAUDE.md — Highline Builders & Roofing Website

## Project Overview

This project is the static HTML website for Highline Builders & Roofing, an Everett, WA roofing contractor serving Snohomish County.

The website includes:

- Home page
- About page
- Services page
- Reviews page
- Contact page
- Privacy Policy page
- Terms of Service page

The goal of this site is to generate roofing leads through calls, estimate requests, SEO visibility, and trust-building local content.

## Core Business Info

Business Name:
Highline Builders & Roofing

Location:
Everett, WA

Service Area:
Everett, Bothell, Mill Creek, Lynnwood, Marysville, Snohomish, Mukilteo, Lake Stevens, and Snohomish County.

Phone:
(425) 209-0732

Tel Link:
tel:4252090732

Website:
https://highlinebuildersroofing.com/

Primary CTA:
Get Free Estimate

Secondary CTA:
Call Now

## Current Tech Stack

This is a static HTML/CSS/JS site.

Main files:

- index.html
- about.html
- services.html
- reviews.html
- contact.html
- privacy-policy.html
- terms-of-service.html
- css/styles.css
- js/main.js

Do not convert this project to React, Next.js, WordPress, or any framework unless specifically requested.

## Google Tag Manager

GTM Container ID:

GTM-N8XLLRPV

Every HTML page must include the GTM head script immediately after the opening `<head>` tag.

Every HTML page must include the GTM noscript iframe immediately after the opening `<body>` tag.

Do not install GTM more than once on the same page.

Do not place the GTM script below meta tags, schema, fonts, or CSS.

Do not place the noscript iframe inside nav, sections, div wrappers, or the footer.

## GTM Head Snippet

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N8XLLRPV');</script>
<!-- End Google Tag Manager -->