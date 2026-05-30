# Help Mobility — Website

A complete, production-ready **multi-page** marketing site for Help Mobility — fast, dependency-free, and **built accessible** (which matters more here than anywhere: it's a mobility company).

![Desktop preview](assets/preview-desktop-hero.png)

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, funding hook, products overview, how it works, rentals, partners, about, contact |
| `products.html` | Full catalog — mobility, home accessibility, bathroom safety, daily living, each item tagged with its funding source |
| `funding.html` | ADP / insurance / WSIB·VAC·NIHB / home-mods, a comparison table, the process, and a funding **FAQ** |
| `rentals.html` | Rental fleet, terms, and the Hospital-at-Home program |
| `funding-check.html` | **"Check my funding"** lead form — captures needs + funding so your desk can triage (mirrors your intake template) |
| `brand-guide.html` | Brand & **photography** guide — colours, type, logo, voice, and a shot list for the team |

## Architecture (shared, DRY)
- **`assets/styles.css`** — all styling; colours & fonts are CSS variables at the top (change once, applies everywhere).
- **`assets/site.js`** — accessibility toolbar, mobile menu, scroll reveal, and **form handling**.
- Each page is plain HTML linking those two files. No build step, no framework, no tracking.

## Design direction
Warm, trustworthy "human healthcare" — **deep evergreen + warm cream + ochre**, a characterful serif (Fraunces) with a highly readable humanist sans (Hanken Grotesk). Coherent with your decks, and deliberately *not* the cold medical-blue every competitor uses.

## Accessibility (the standout feature)
Because your customers are seniors and people with disabilities, the site is built to be usable by them:
- A working **accessibility toolbar** on every page: text size (A / A+ / A++) and **high-contrast mode**, **saved** between visits (localStorage).
- Skip-to-content link, semantic landmarks, labelled sections, visible focus, 44px+ touch targets, large readable text, `prefers-reduced-motion` support, and a no-JS fallback (content shows even with JavaScript disabled).

![Accessibility mode](assets/preview-accessibility.png)
![Mobile](assets/preview-mobile.png)

## Wiring up the forms (one place)
Open **`assets/site.js`** and set:
```js
var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx"; // your endpoint
var FALLBACK_EMAIL = "info@helpmobility.ca";
```
- With an endpoint set, the contact and **funding-check** forms submit via AJAX and show a success/error message inline.
- Until then, they gracefully fall back to opening the visitor's email app — nothing breaks.
- Works with Formspree, Basin, Netlify Forms, or any service that accepts a `POST` with `Accept: application/json`.

## Before you go live — replace the `[ placeholders ]`
Search the files for `[`:
- **Phone** (header, footer, contact, `tel:+10000000000`), **email**, **showroom address**, **hours**.
- **Real photos** — see `brand-guide.html` for the exact shot list. Every photo slot is marked.
- **Real testimonials** — the homepage reviews are flagged ⚠ *do not publish the placeholders.*

> Compliance note: funding copy uses safe wording ("up to 75%", "depends on eligibility"). Keep claims accurate — never promise coverage; eligibility is per-client and per-program.

## Deploy
- **Netlify / Vercel / Cloudflare Pages:** drag in the `website/` folder, or connect the repo. Zero config. (Netlify Forms works out of the box if you add `netlify` to the `<form>` tags.)
- **GitHub Pages:** push and enable Pages on the folder.
- **Any host:** upload the folder. Done.

## Regenerate preview screenshots
```bash
pip install playwright && python3 -m playwright install chromium
# screenshot scripts were used during the build; see repo history
```

*Built with the `frontend-design` skill. Content/claims are placeholders pending your real details.*
