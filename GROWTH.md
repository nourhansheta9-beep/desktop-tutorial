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

**2. Analytics + call tracking — wired, needs a GA4 ID.** Paste your Google
Analytics 4 Measurement ID into `CONFIG.gaId`. It auto‑loads GA4 and fires a
`generate_lead` event on every quote/callback and a `contact` event on every
phone‑number tap — so you can see exactly what drives calls.

**3. Real SEO landing pages — generated.** Standalone, crawlable pages now exist
(shared styling, real content, JSON‑LD, click‑to‑call):
- `/products/mobility/`, `/products/accessibility/`, `/products/bathroom/`, `/products/daily/`
- `/areas/<city>/` for Toronto, Mississauga, Brampton, Scarborough, North York, Etobicoke, Markham, Vaughan
- `/areas/` hub, all listed in `sitemap.xml` and linked from the footer.

Regenerate/expand any time: **`node tools/build-landing.js`** (edit the `CITIES`
list in that file to add more areas).

**4. Reviews — section ready, needs real reviews.** Add genuine reviews to
`REVIEWS` in `assets/js/data.js` and a “What our customers say” section appears
automatically. **No fake reviews were added.**

## 🔜 Still needs you (off‑site, highest impact of all)

- **Google Business Profile** — claim/optimize it (hours, photos, services, service area). For “medical equipment near me” this is often the #1 source of calls. *Send your address + hours and I’ll prepare the listing + wire them into the header/contact page/JSON‑LD.*
- **Collect Google reviews** — then we both show them on‑site and boost local ranking.
- **Paid search (optional)** — “stairlift installation GTA”, “hospital bed rental Toronto”, pointed at the new landing pages, with funding as the hook.

> Fastest revenue: paste a **Formspree endpoint** (#1) so leads reach you today, add a **GA4 ID** (#2), and claim your **Google Business Profile**.
