# Help Mobility — Website

A complete, production-ready marketing website for Help Mobility — single-file, fast, and **built accessible** (which matters more here than anywhere: it's a mobility company).

![Desktop preview](assets/preview-desktop-hero.png)

## What it is
- **`index.html`** — the entire site in one self-contained file (HTML + CSS + a little vanilla JS). No build step, no dependencies, no tracking. Just open it or drop it on any host.
- Fonts load from Google Fonts (Fraunces + Hanken Grotesk); everything else is inline.

## Design direction
Warm, calm, trustworthy "human healthcare" — **deep evergreen + warm cream + ochre accent**, a characterful serif (Fraunces) paired with a highly readable humanist sans (Hanken Grotesk). Coherent with your decks/collateral, but its own thing — and deliberately *not* the cold medical-blue every competitor uses.

## Sections
Hero (funding hook) → trust band → **Funding, figured out** (the differentiator: ADP / insurance / WSIB·VAC·NIHB / home-mods) → Products (mobility, accessibility, bathroom safety, daily living) → How it works → Rentals + Hospital-at-Home → Healthcare partners → About + reviews → Contact (with form) → Footer.

## Accessibility (the standout feature)
Because your customers are seniors and people with disabilities, the site is built to be usable by them:
- A working **accessibility toolbar**: text size (A / A+ / A++) and **high-contrast mode**, with the choice **saved** between visits (localStorage).
- Skip-to-content link, semantic landmarks, labelled sections, visible focus outlines, 44px+ touch targets, large readable base text, and `prefers-reduced-motion` support.
- High-contrast mode (shown below) flips to a WCAG-strong black/white theme.

![Accessibility mode](assets/preview-accessibility.png)
![Mobile](assets/preview-mobile.png)

## Before you go live — replace the `[ placeholders ]`
Search the file for `[` and fill in:
- **Phone number** (appears in header, hero, contact, footer; also the `tel:` links — update `+10000000000`).
- **Email** (currently `info@helpmobility.ca`) and **showroom address** + **hours**.
- **Real photos** — the hero and product cards are designed for your imagery (one hero photo slot is marked).
- **Real testimonials** — the two reviews are clearly flagged as placeholders. ⚠ **Do not publish the placeholder reviews** — replace with genuine, verifiable ones.
- **Contact form** — currently falls back to `mailto:`. For a real site, point it at a form service (Formspree, Basin, Netlify Forms) or your CRM.

> Compliance note: funding figures use safe wording ("up to 75%", "depends on eligibility"). Keep claims accurate and avoid promising coverage — eligibility is per-client and per-program.

## Deploy (any of these)
- **Netlify / Vercel / Cloudflare Pages:** drag the `website/` folder in, or connect the repo. Zero config.
- **GitHub Pages:** push and enable Pages on the folder.
- **Any host:** upload `index.html`. That's it.

## Regenerate the preview images
```bash
pip install playwright && python3 -m playwright install chromium
# then run the screenshot script used in the repo history
```

*Built with the `frontend-design` skill. Targets/claims are placeholders pending your real details.*
