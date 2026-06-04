# Help Mobility — growth & conversion playbook

Goal: **more customers, more sales, more revenue.** For a local mobility / home‑healthcare
retailer, “sales” almost always starts with a **phone call or a quote request**, and the
audience is older adults *and the family members / caregivers who research for them*. So
the whole site is built to (1) make contacting you effortless, (2) remove the biggest
reason people hesitate — **cost** — and (3) get you **found** locally.

## ✅ Shipped in this change (on‑site conversion + SEO)

**Make contact effortless (the #1 lever for local service)**
- **Sticky mobile call/quote bar** — always visible on phones: one tap to **Call now** or get a **Free quote**. Most local‑service mobile leads come by phone; this puts it one thumb‑tap away on every page.
- **Click‑to‑call everywhere** — top bar, a desktop header **call button**, footer, contact page and every CTA use the real number `905‑615‑9302` as a `tel:` link.
- **“Request a callback” mini‑form** — just name + phone. The lowest‑friction way to capture a lead; many people won’t fill a long form but will leave a number.

**Kill the cost objection (biggest reason people don’t buy)**
- **Funding banner** high on the homepage: *“You may not have to pay full price.”* with ADP / ODSP / WSIB / Ontario Works / March of Dimes / Spinal Cord Injury Ontario.
- Funding is repeated in the hero trust line, the FAQ and a dedicated page.

**Build trust & reduce anxiety (older / health‑sensitive buyers)**
- **“How it works”** 3‑step section (tell us → we recommend & handle funding → delivery, setup & support).
- **FAQ accordion** answering the real objections: cost/funding, rent vs buy, delivery & install, repairs, service area, how to start.
- Honest trust microcopy under the hero (free quote · funding help · 7‑day service). **No fabricated reviews, ratings, awards or “years in business.”**

**Get found (SEO / discoverability)**
- **`LocalBusiness` (MedicalSupplyStore) JSON‑LD** — name, phone, area served (GTA), services. Helps Google show the business and a tap‑to‑call in local results.
- **`FAQPage` JSON‑LD** — eligible for FAQ rich results in search.
- Real `<meta description>`, canonical, Open Graph, `robots.txt` and `sitemap.xml`.

## ✅ Also shipped (the four growth moves) — wired, finalize with your data

**1. Lead delivery — connected, needs an endpoint.** Every quote, contact and callback
submission is now POSTed to a URL of your choice. Paste it into
`assets/js/data.js` → `CONFIG.leadEndpoint`. Easiest: create a form at
**formspree.io** (free) and paste its endpoint — leads then arrive in your inbox
instantly. (Until set, leads are still saved in the browser.)

**2. Analytics + call tracking — wired with your real Google Ads tag.** The live
site already runs **Google Ads** (`AW-740552287`), so that tag is now loaded on
every page (SPA + landing pages) for remarketing and conversion tracking, and a
`generate_lead` event fires on every quote/callback plus a `contact` event on every
phone‑number tap. *(No GA4 property was found on the site — add a GA4 Measurement ID
to `CONFIG.gaId` if you want GA4 reporting too. To count Ads conversions, create a
conversion action in Google Ads and I'll add its `send_to` label.)*

**3. Real SEO landing pages — 24 generated.** Standalone, crawlable pages
(shared styling, real content read from `data.js`, JSON‑LD, click‑to‑call, the
Google Ads tag), all in `sitemap.xml` and cross‑linked from the footer/nav:
- **Products** (×4): `/products/{mobility,accessibility,bathroom,daily}/`
- **Rentals**: `/rentals/` hub + a page per line — hospital‑bed, wheelchair/transport,
  scooter, stairlift, walker/rollator, lift‑chair, patient‑lift (these target
  high‑intent searches like "hospital bed rental Toronto")
- **Services**: `/repairs/`, `/funding/`, `/industries/`
- **Areas** (×8): `/areas/{toronto,mississauga,brampton,scarborough,north-york,etobicoke,markham,vaughan}/` + an `/areas/` hub

Regenerate/expand any time: **`node tools/build-landing.js`** (it reads `data.js`
for content; edit the `CITIES` list in that file to add more areas).

**4. Reviews — section ready, needs real reviews.** Add genuine reviews to
`REVIEWS` in `assets/js/data.js` and a “What our customers say” section appears
automatically. **No fake reviews were added.**

**5. Performance (Core Web Vitals → rank + conversion).** Photos were resized to
display size and served as **WebP with a JPEG fallback** via `<picture>`; the
homepage hero is pre‑rendered for instant first paint and marked
`fetchpriority="high"`. Image payload dropped ~66% (hero 486 KB → 134 KB).
Re‑optimize after adding photos: `npm i -D sharp && node tools/optimize-images.js`.

### Pulled from the live site (now wired in)

These were recovered from the site itself, so I applied them everywhere (header/
contact/footer/structured data/landing pages):

- **Address:** 4161 Sladeview Crescent, Unit 8, Mississauga, ON L5L 5R3 *(was only in the privacy policy)*
- **Email:** st@helpmobility.ca *(was only in the privacy policy)* — quote/callback confirmations can now email a copy here, a real lead path even before Formspree.
- **Phone:** 905-615-9302 *(was only on the repairs page)*
- **Google Ads tag:** AW-740552287

## 🔜 Still needs you (not available on the site)

- **Business hours** — the site only says “7 days a week,” no specific times. *Send your hours and I’ll add them to the contact page + `openingHoursSpecification` schema.*
- **Formspree (or similar) endpoint** — the live site posts to Shopify’s own form, which isn’t reusable here. A free Formspree endpoint in `CONFIG.leadEndpoint` delivers leads automatically (the email‑a‑copy fallback to st@helpmobility.ca already works today).
- **Google Business Profile + real reviews** — claim/optimize the profile (now that we have the address) and collect reviews; add them to `REVIEWS` and they show on‑site. Usually the #1 source of “near me” calls.
- **Paid search (optional)** — point your existing Google Ads at the new `/areas/…` and `/products/…` landing pages, with funding as the hook.

> Fastest remaining wins: claim the **Google Business Profile**, paste a **Formspree endpoint**, and send your **hours**.
