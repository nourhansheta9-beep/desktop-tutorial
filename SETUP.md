# Help Mobility — go‑live setup (the 2 things that win you the most business)

Everything on the site works today, but two quick setups turn it from "looks
great" into "rings the phone and fills the inbox." Both are free and take a few
minutes. Follow these in order.

---

## 1) Lead delivery — ALREADY WIRED. Activate it once (≈2 min)

Lead delivery is **pre‑configured** to email every quote / contact / callback to
**`st@helpmobility.ca`** via **FormSubmit** (a free, no‑signup form service). It's
set in `assets/js/data.js`:

```js
leadEndpoint: "https://formsubmit.co/ajax/st@helpmobility.ca"
```

**To switch it on (one‑time — verifies you own the inbox):**

1. Open the live site → add something to a quote → **submit the form** once
   (or use the Contact form).
2. Check the **st@helpmobility.ca** inbox for an email from **FormSubmit** and
   click **"Activate Form."**
3. Done — from then on, **every** submission is emailed to you automatically,
   formatted as a clean table (name, phone, email, what they want, items), with
   the customer's email set as reply‑to so you can reply directly.

**Tip — hide your address from bots:** after activating, FormSubmit emails you a
random alias like `https://formsubmit.co/abc123hash`. Swap that into
`leadEndpoint` (send it to me and I'll do it) so your email isn't shown in the
page code.

**Prefer Formspree instead?** (nicer dashboard, spam filtering, Slack/SMS):
sign up at **https://formspree.io**, create a form that sends to
`st@helpmobility.ca`, copy its endpoint (`https://formspree.io/f/xxxx`) and
replace the `leadEndpoint` value. The site sends the same flat fields, so it just
works.

> Until you activate (or while testing), nothing is lost — leads are also saved
> in the browser and the confirmation page has a one‑tap **"Send your request to
> us"** email button.

---

## 2) Google Business Profile (≈15 min) — the #1 source of "near me" calls

For searches like *"medical equipment near me"* or *"wheelchair rental
Mississauga,"* your Google Business Profile (the map/box on the right) drives more
calls than anything else.

1. Go to **https://business.google.com** and sign in with the **business**
   Google account.
2. Search **Help Mobility** — if it's listed, click **Claim / Manage**; if not,
   **Add your business**.
3. Fill it out completely:
   - **Name:** Help Mobility
   - **Category (primary):** *Mobility equipment supplier* (add: *Medical supply
     store*, *Wheelchair store*, *Wheelchair rental service*).
   - **Address:** 4161 Sladeview Crescent, Unit 8, Mississauga, ON L5L 5R3
     (or set as a **service‑area business** if you prefer not to show the unit).
   - **Service area:** add your GTA cities — Toronto, Mississauga, Brampton,
     Scarborough, North York, Etobicoke, Markham, Vaughan, Oakville, Burlington,
     Richmond Hill, Oshawa, Pickering, Milton.
   - **Phone:** 905‑615‑9302   **Website:** your site URL
   - **Hours:** your real hours (you advertise "7 days a week" for service — set
     accordingly).
4. **Verify** the business (Google sends a code by phone, email, or postcard).
5. Add **photos** (storefront, team, products, a delivery/install in action),
   a **description** (mention sales · rentals · repairs · funding help · GTA),
   and your **services** (use the catalog groups: beds, walkers, power &
   manual wheelchairs, scooters, lifts, bathroom safety, lift chairs…).
6. **Get reviews:** in your dashboard, copy your **"Ask for reviews" link** and
   text/email it to happy customers. Aim for a steady trickle — reviews lift both
   ranking and trust.
   - When you have a few real reviews, send them to me (name + city + quote +
     stars) and I'll add a **testimonials section** on the site — the code is
     already there, it just needs real reviews (no fakes).

---

## 3) (Optional) Analytics so you can see what's working

- Your **Google Ads** tag (`AW‑740552287`) is already on every page for
  remarketing + conversion tracking.
- To add **GA4** reporting: create a property at **https://analytics.google.com**,
  copy the **Measurement ID** (`G‑XXXXXXX`), and paste it into `CONFIG.gaId` in
  `assets/js/data.js`. The site fires a `generate_lead` event on every quote/
  callback and a `contact` event on every phone tap.
- In **Google Ads**, create a **conversion action** for "lead/contact" so your
  ad spend optimizes toward calls and form submits.

---

## What I (the site) already do for you

- Capture quote/callback/contact leads, with a one‑tap **email fallback** so
  nothing is lost even before Formspree is connected.
- Surface your phone, email and address everywhere + click‑to‑call.
- 30 crawlable SEO pages, structured data and a sitemap.
- An 86‑product catalogue with funding tags, and a funding page that does the
  selling on affordability.

Do #1 and #2 above and you've got a complete lead machine. Send me your Formspree
endpoint, GA4 ID, real photos or reviews and I'll wire them in immediately.
