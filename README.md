# Help Mobility — Sales Storefront

A fast, accessible **customer storefront** for [Help Mobility](https://helpmobility.ca)
(mobility & home‑healthcare equipment, Greater Toronto Area). Customers browse the
catalog, choose **buy or rent**, and request a free quote or in‑home assessment — turning
anonymous visitors into contactable leads.

It's a single‑codebase **Progressive Web App (PWA)**: it runs in any browser on
desktop and phones, and can be *installed* like a native app on Windows, macOS,
Android and iOS — no app store required.

---

## Why this drives more sales

No software can *guarantee* tripling sales, but this storefront is built around the
exact leaks that cost mobility retailers business:

| Sales leak | What the storefront does about it |
|---|---|
| Visitors leave because prices/options are hidden | Clear catalog with indicative pricing + **Buy / Rent** on every eligible item |
| Undecided shoppers never make contact | One‑tap **"Add to quote"** and a 30‑second quote form capture the lead |
| "I'm not sure what I need" drop‑off | Prominent **free in‑home assessment** booking on every page |
| Mobile/senior users struggle | Large type, high‑contrast, big tap targets, click‑to‑call |
| Browsers forget you | Installable PWA + works offline; one tap to reopen |
| Renters ignored | Dedicated **Rentals** filter — a whole revenue stream made shoppable |

Every captured request becomes a **lead** (name, phone, email, what they want, buy vs.
rent) so your team can follow up the same day.

---

## Run it

It's static — **no build step, no dependencies.**

**Quickest:** open `index.html` directly in a browser. *(Browsing works from
`file://`; PWA install/offline needs `http(s)` — use a local server below.)*

**Recommended (enables PWA + service worker):**

```bash
# any one of these from the project folder:
python3 -m http.server 8080
# or
npx serve .
```

Then visit **http://localhost:8080**.

### Install as an app
- **Desktop (Chrome/Edge):** open the site → click the **Install** icon in the address bar.
- **Android (Chrome):** menu → **Add to Home screen / Install app**.
- **iOS (Safari):** Share → **Add to Home Screen**.

---

## Project structure

```
index.html              # App shell: header, search, nav, footer
manifest.webmanifest    # PWA metadata (installability)
service-worker.js       # Offline caching of the app shell
assets/
  css/styles.css        # All styling (responsive, accessible)
  js/data.js            # ← EDIT ME: catalog, categories, company info, testimonials
  js/app.js             # Routing, search/filter, buy/rent cart, quote capture
  icons/icon.svg        # App icon
```

---

## Customize

### Products, prices & company details
Everything customer‑facing lives in **`assets/js/data.js`**:

- `COMPANY` — name, phone, email, region, trust badges.
- `CATEGORIES` — the four shop sections.
- `PRODUCTS` — add/edit items. Each looks like:

```js
p({ id: "m1", cat: "mobility", emoji: "♿",
    name: "Lightweight Folding Wheelchair",
    price: 399,            // purchase price (CAD)
    rent: 60,              // monthly rental price (omit if not rentable)
    from: false,           // true → shows "from $X" (e.g. custom stairlifts)
    popular: true,         // featured on the home page
    rating: 4.8, reviews: 214,
    blurb: "One‑line description.",
    features: ["Bullet 1", "Bullet 2", "Bullet 3"] })
```

> **Pricing note:** the sample prices are realistic placeholders. Help Mobility's
> live site is consultation‑driven and doesn't publish prices — replace these with
> your real numbers, or set products to quote‑only by removing the price emphasis.

### Real product photos
Product art currently uses tasteful emoji tiles (so it works offline with zero
image weight). To use real photos, add an `image` field per product and swap the
`.thumb` / `.pd-media` rendering in `app.js` for an `<img>`.

---

## Receiving leads for real

By default, submitted quote/assessment requests are stored in the visitor's browser
(`localStorage`) and the confirmation page offers an **"Email a copy to us"** button.
To collect leads automatically, open `assets/js/app.js`, find the
**"Lead delivery hook"** comment in `handleRequestSubmit`, and POST the `lead` object
to your endpoint. Options:

- **Formspree / Getform** — paste your form endpoint, no backend needed.
- **Google Apps Script** — append leads to a Google Sheet.
- **Your CRM webhook** — HubSpot, Zoho, Salesforce, etc.

```js
fetch("https://your-endpoint.example/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(lead)
});
```

To review leads captured in a browser during testing, run `HM.exportLeads()` in the
DevTools console.

---

## Deploy (free options)

- **GitHub Pages:** push to GitHub → Settings → Pages → deploy from branch. Because
  paths are relative, it works from a project subpath (`/desktop-tutorial/`).
- **Netlify / Vercel / Cloudflare Pages:** drag‑and‑drop the folder or connect the repo.
  No build command, publish directory = project root.

---

## Accessibility

Designed for an older / caregiver audience: 17–18px base text, AA‑contrast colours,
≥44px tap targets, visible focus rings, keyboard‑navigable, `prefers-reduced-motion`
respected, and semantic landmarks with a skip link.

---

*Built as a starting point — swap in real pricing, photos and a lead endpoint and it's
ready to take to customers.*
