# Help Mobility — issues found & fixed

This rebuild started from a review of the live site **helpmobility.ca** (a Shopify
store) and the previous demo build in this repo. Below is every issue that was
flagged, the evidence for it, and how the rebuild corrects it.

> Brand assets kept intact, as requested: the **real logo**, the real brand
> **colours** (blue `#004678` “Help” + green `#00780a` “Mobility”) and the real
> **images** pulled from the live site.

---

## A. Issues on the live helpmobility.ca site

| # | Issue | Evidence | Fix in this rebuild |
|---|-------|----------|---------------------|
| 1 | **Spelling error in a page/URL: “industries‑we‑server”** (should be *served*). The menu item points at `/pages/industries-we-server`. | Site sitemap + nav links | Page is correctly titled **“Industries We Serve”** with a clean route (`#/industries`). |
| 2 | **No meta description on the homepage** — weak for SEO/social. | `<meta name="description">` absent in the homepage HTML | Added a descriptive `meta description`, `canonical`, `lang="en-CA"` and Open Graph tags. |
| 3 | **Logo image has empty `alt=""`** — screen readers don’t announce the brand. | `class="header-logo__image" alt=""` in the live HTML | Logo now has descriptive alt text: *“Help Mobility — helping you get active, today!”* |
| 4 | **Phone number is not clickable and only appears on one page.** `905‑615‑9302` shows on the Repairs page as plain text; the homepage and Contact page show no phone at all. | Number appears 3× only in the repairs page HTML; **zero `tel:` links** anywhere on the site | The real number is surfaced **site‑wide as a clickable `tel:` link** — top bar, header, footer, contact page and every call‑to‑action. |
| 5 | **Contact page has no business details** — just a form. No phone, email, address or hours, which hurts trust and local SEO for a local GTA business. | Contact page content | Contact page now shows the real phone, availability (7 days a week) and service area, alongside the form. |
| 6 | **Images served with the wrong file extension** — files named `.webp` are actually JPEG/PNG (e.g. `Bath-Aids-…-1080x675_jpg.webp`, `M90-1080.webp`). | `file` reports JPEG/PNG data for `.webp` URLs | Re‑downloaded images are saved with their **true extensions** (`.jpg` / `.png`). |
| 7 | **Oversized, unoptimised images.** A ~**4.4 MB** 1920×1080 PNG (`power-wheelchair`) was shipped on the homepage — slow on mobile and for the older audience the site targets. | Download size 4,404,014 bytes | That file is dropped; remaining images are lighter and all carry explicit `width`/`height` + `loading="lazy"` (hero uses `fetchpriority="high"`). |

## B. Issues in the previous demo build (this repo)

The earlier build was a polished shell wrapped around **invented data**:

- ❌ Off‑brand colours — teal `#0e7c86` + amber, not the real blue/green.
- ❌ An **“HM” monogram** instead of the real Help Mobility logo.
- ❌ Invented tagline *“Comfort · Safety · Independence”* (real one is *“helping you get active, today!”*).
- ❌ A **fake phone** `1-800-555-0199` and **fake email** `hello@helpmobility.ca`.
- ❌ **Fabricated prices, star ratings and review counts** on every product.
- ❌ **Fabricated testimonials** with invented customer names and cities.
- ❌ **Emoji tiles** in place of real product photos.
- ❌ A product taxonomy that didn’t match the real store’s categories/collections.

## C. What the rebuild does instead

- ✅ **Real logo** (`assets/img/logo-dark.png`) and **real palette** (blue `#004678`, green `#00780a`) throughout.
- ✅ **Real copy** taken from the live site — hero (“Welcome to Help Mobility”), tagline, the mission statement, and the four category descriptions (verbatim).
- ✅ **Real product taxonomy** — the four categories (Mobility, Accessibility, Bathroom, Daily Living) mapped to the store’s **actual collections**, plus real **Rentals**, **Repairs & Maintenance** (with the real service list), **Industries We Serve** (the real segments) and **Funding & Assistance** (ADP, ODSP, Ontario Works, WSIB, March of Dimes, Spinal Cord Injury Ontario).
- ✅ **Real images** for the category cards and hero, correctly named and sized.
- ✅ **No fabricated numbers** — the business is consultation/quote‑driven, so the site captures interest into a quote request (a real lead) instead of showing made‑up prices, ratings or reviews.
- ✅ **Accessibility kept and improved** — large type, AA‑contrast colours, ≥44px tap targets, visible focus rings, a skip link, semantic landmarks, `aria-current` on the active nav, and `prefers-reduced-motion` support.
- ✅ **Still an installable, offline‑capable PWA**, with no build step.

---

## How the findings were verified

- Downloaded the live homepage, sitemap, and the Contact / Repairs / Industries pages directly.
- Extracted the exact logo colours from the logo PNG (green `#00780a`, blue `#004678`).
- Confirmed the real phone number `905-615-9302` appears in the site HTML before relying on it.
- Ran a headless‑DOM smoke test of the rebuilt app (routing, search, category filter, add‑to‑quote, form submission) — all green, 0 runtime errors.
- Captured desktop + mobile screenshots of the home, shop, category, repairs and contact pages.
