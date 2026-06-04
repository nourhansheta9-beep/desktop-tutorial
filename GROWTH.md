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

## 🔜 Highest‑ROI next steps (need your input or external accounts)

These typically move revenue more than anything on‑site, but I can’t do them without you:

1. **Google Business Profile** — claim/optimize it (hours, photos, services, service‑area). For “medical equipment near me” searches this is often the single biggest source of calls. *Provide your business address/hours and I’ll prepare the listing content.*
2. **Collect & show real reviews** — Google reviews on the profile, and a testimonials section on‑site once they’re real. (I deliberately left out fake ones.) *Share real reviews and I’ll add a proper, schema‑marked testimonials section.*
3. **Publish real hours & a service address** — the live site shows none; adding them lifts trust and local ranking. *Send them and I’ll wire them into the header, contact page and JSON‑LD.*
4. **Real product/landing pages** — this app is a hash‑routed SPA (great UX, weak for SEO because crawlers see one page). For search traffic, the biggest win is **per‑category and per‑city landing pages** (e.g. “Stairlifts in Mississauga”, “Wheelchair rental Toronto”) as real, crawlable URLs. I can refactor to multi‑page/SSG and generate these.
5. **Connect the lead pipeline** — right now quote/callback leads are stored in the browser. Wire the **“Lead delivery hook”** in `app.js` to Formspree / a Google Sheet / your CRM so leads reach you instantly (and add email/SMS alerts). *Give me an endpoint and I’ll connect it.*
6. **Conversion tracking** — add Google Analytics 4 + call tracking so we can see which pages/keywords drive calls and double down. *Provide a GA4 ID.*
7. **Paid search for high‑intent terms** (optional) — “stairlift installation GTA”, “hospital bed rental Toronto”, etc., pointed at the matching landing pages, with funding as the hook.

> Tell me which of these you want next — #1, #4 and #5 usually deliver the most new business fastest.
