#!/usr/bin/env node
/*
 * Help Mobility — static SEO landing-page generator
 * --------------------------------------------------
 * The main site is a hash-routed SPA (great UX, but crawlers see one page).
 * This emits standalone, crawlable HTML pages that share the site's CSS and
 * link into the SPA's quote flow — the big win for local search traffic.
 *
 * Content is read from assets/js/data.js (single source of truth):
 *   /products/<category>/   — one per product category (real collections)
 *   /rentals/               — rentals hub  + /rentals/<type>/ per rental line
 *   /repairs/  /funding/  /industries/  — the service pages
 *   /areas/                 — areas hub   + /areas/<city>/ per GTA city
 *
 * Each page has a unique title/description, real content, click-to-call, the
 * Google Ads tag and LocalBusiness + Breadcrumb (+ FAQ) structured data.
 *
 * Run:  node tools/build-landing.js   (also refreshes sitemap.xml)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://helpmobility.ca";

// ---- load real content from data.js (no duplication / no drift) -----------
const win = {};
new Function("window", fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8"))(win);
const HM = win.HM;
const COMPANY = HM.COMPANY, CATEGORIES = HM.CATEGORIES, RENTALS = HM.RENTALS,
  REPAIRS = HM.REPAIRS, INDUSTRIES = HM.INDUSTRIES, FUNDING = HM.FUNDING, FAQ = HM.FAQ;
const ADS = (HM.CONFIG && HM.CONFIG.googleAdsId) || "";
const LOGO = "/assets/img/logo-dark.png";

// Curated, high-intent GTA cities. Expand once GBP/analytics confirm demand.
const CITIES = ["Toronto", "Mississauga", "Brampton", "Scarborough", "North York", "Etobicoke", "Markham", "Vaughan"];

// Category → hero image + short, useful per-rental descriptions.
const CAT_IMG = { mobility: "power-header", accessibility: "lift-chair", bathroom: "bathroom", daily: "smartdrive" };
const RENTAL_BLURB = {
  "hospital-bed-rental": "Electric hospital beds for safe, comfortable home recovery — delivered, assembled and adjusted for you.",
  "wheelchair-and-transport-chair-rental": "Manual wheelchairs and lightweight transport chairs by the month — ideal for recovery, travel or short-term needs.",
  "scooter-rental": "Mobility scooters to rent for getting out and about, by the week or month, delivered across the GTA.",
  "stairlift-rental": "Rent a stairlift instead of buying — professionally installed and later removed, ideal for temporary needs.",
  "walker-rollator-rental": "Walkers and rollators to rent while you recover, or before you commit to buying.",
  "lift-chair-recliner-rental": "Power lift recliners that help you stand with ease — delivered and set up in your home.",
  "patient-lift-sling-rental": "Patient lifts and slings for safe transfers at home, with guidance on safe use.",
};

/* ----------------------------------------------------------------- helpers */
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const pic = (jpg, alt, w, h, attrs) => `<picture><source type="image/webp" srcset="${jpg.replace(/\.jpg$/, ".webp")}"><img src="${jpg}" alt="${esc(alt)}" width="${w}" height="${h}" ${attrs || 'loading="lazy"'}></picture>`;
const jsonLd = (obj) => '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + "\n</script>";
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function localBusinessLd() {
  const a = COMPANY.address;
  return {
    "@context": "https://schema.org", "@type": "MedicalSupplyStore",
    name: COMPANY.name, slogan: COMPANY.tagline, url: ORIGIN + "/",
    image: ORIGIN + LOGO, telephone: "+1-905-615-9302", email: COMPANY.email,
    address: { "@type": "PostalAddress", streetAddress: a.line, addressLocality: a.city, addressRegion: a.province, postalCode: a.postal, addressCountry: "CA" },
    areaServed: { "@type": "Place", name: "Greater Toronto Area, Ontario, Canada" },
    makesOffer: ["Mobility equipment sales", "Mobility equipment rentals", "Equipment repairs & maintenance"]
      .map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
  };
}
const breadcrumbLd = (trail) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: ORIGIN + t.path })),
});
const faqLd = () => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

function head(opts) {
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(opts.title)}</title>
  <meta name="description" content="${esc(opts.description)}" />
  <link rel="canonical" href="${ORIGIN}${opts.canonical}" />
  <meta name="theme-color" content="#004678" />
  <link rel="icon" href="/assets/icons/icon.svg" type="image/svg+xml" />
  <meta property="og:title" content="${esc(opts.title)}" />
  <meta property="og:description" content="${esc(opts.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${ORIGIN}${LOGO}" />
  <link rel="stylesheet" href="/assets/css/styles.css" />
  ${opts.ld.map(jsonLd).join("\n  ")}${ADS ? `
  <!-- Google Ads (gtag) — remarketing + conversion tracking -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${ADS}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ADS}');</script>` : ""}
</head>`;
}

function header() {
  return `<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="topbar"><div class="container">
    <span>🍁 Mobility &amp; home healthcare across the GTA</span>
    <span>🛟 Sales · Rentals · Repairs — 7 days a week</span>
    <a href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a>
  </div></div>
  <header class="site-header"><div class="header-row">
    <a class="brand" href="/" aria-label="Help Mobility — home"><img src="${LOGO}" alt="Help Mobility — helping you get active, today!" width="153" height="40" /></a>
    <div class="header-actions">
      <a class="btn btn-ghost btn-sm call-link" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a>
      <a class="btn btn-accent btn-sm" href="/#/quote">📝 Get a quote</a>
      <button class="nav-toggle" data-action="nav-toggle" aria-label="Menu" aria-controls="mainnav" aria-expanded="false">☰</button>
    </div>
  </div>
  <nav class="mainnav" id="mainnav" aria-label="Primary"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/#/shop">Explore Products</a></li>
    <li><a href="/rentals/">Rentals</a></li>
    <li><a href="/repairs/">Repairs &amp; Maintenance</a></li>
    <li><a href="/industries/">Industries We Serve</a></li>
    <li><a href="/funding/">Funding</a></li>
    <li><a href="/#/contact">Contact</a></li>
  </ul></nav></header>
  <main id="main">`;
}

function fundingBanner() {
  const li = FUNDING.map((f) => `<li>${esc(f.name)}</li>`).join("");
  return `<section class="section"><div class="container"><div class="funding-banner">
    <div><p class="eyebrow">Worried about the cost?</p><h2>You may not have to pay full price</h2>
      <p class="lead">We help you access government and insurer programs that can cover part — or all — of the cost of your equipment.</p>
      <div class="cta-actions cta-left"><a class="btn btn-primary btn-lg" href="/funding/">See funding options</a>
      <a class="btn btn-ghost btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div></div>
    <ul class="ticks big">${li}</ul>
  </div></div></section>`;
}

function faqSection() {
  const items = FAQ.map((f, i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join("");
  return `<section class="section"><div class="container"><div class="section-head"><div><h2>Questions? Answers.</h2><p>The things people ask us most, before they get in touch.</p></div></div><div class="faq">${items}</div></div></section>`;
}

function ctaBand(line) {
  return `<section class="section"><div class="container"><div class="cta-band"><h2>${esc(line)}</h2>
    <p>Tell us about your situation and a Help Mobility specialist will recommend the right solution and prepare a clear quote — buy or rent.</p>
    <div class="cta-actions"><a class="btn btn-accent btn-lg" href="/#/quote">Request a free quote</a>
    <a class="btn btn-outline btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div></div></div></section>`;
}

function footer() {
  const cats = CATEGORIES.map((c) => `<a href="/products/${c.id}/">${esc(c.name)}</a>`).join("");
  const rentals = RENTALS.slice(0, 5).map((r) => `<a href="/rentals/${r.slug}/">${esc(r.name)}</a>`).join("");
  const cities = CITIES.map((c) => `<a href="/areas/${slug(c)}/">${esc(c)}</a>`).join("");
  return `</main>
  <footer class="site-footer"><div class="container"><div class="footer-grid">
    <div><span class="footer-brand-logo"><img src="${LOGO}" alt="Help Mobility" width="172" height="45" /></span>
      <p style="color:#cdd9e4;margin:.9rem 0">Helping you get active, today! Sales, rentals and repairs across the Greater Toronto Area.</p>
      <p>📞 <a href="${COMPANY.phoneHref}" style="display:inline">${COMPANY.phone}</a><br />✉️ <a href="mailto:${COMPANY.email}" style="display:inline">${COMPANY.email}</a></p>
      <p style="color:#cdd9e4">📍 ${esc(COMPANY.addressText)}</p></div>
    <div><h4>Products</h4>${cats}<a href="/#/shop">All products</a></div>
    <div><h4>Rentals</h4>${rentals}<a href="/rentals/">All rentals</a></div>
    <div><h4>Services</h4><a href="/repairs/">Repairs &amp; Maintenance</a><a href="/funding/">Funding &amp; Assistance</a><a href="/industries/">Industries We Serve</a><a href="/#/quote">Request a quote</a></div>
    <div><h4>Areas we serve</h4>${cities}<a href="/areas/">All areas</a></div>
  </div></div>
  <div class="footer-bottom">© <span id="year">${new Date().getFullYear()}</span> Help Mobility. ${esc(COMPANY.addressText)}.</div></footer>
  <div class="mobile-cta" aria-label="Quick contact">
    <a class="btn btn-accent" href="${COMPANY.phoneHref}">📞 Call now</a>
    <a class="btn btn-primary" href="/#/quote">📝 Free quote</a>
  </div>
  <script>document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-action="nav-toggle"]');if(t){var n=document.getElementById('mainnav');var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');}});</script>
</body>
</html>`;
}

function crumb(trail) {
  return `<div class="container"><nav class="crumbs" aria-label="Breadcrumb">` +
    trail.map((t, i) => (t.path ? `<a href="${t.path}">${esc(t.name)}</a>` : esc(t.name)) + (i < trail.length - 1 ? " / " : "")).join("") +
    `</nav></div>`;
}
function hero(eyebrow, h1, lead, img, imgAlt, notes) {
  return `<section class="hero"><div class="container"><div class="hero-grid"><div>
    <p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="/#/quote">Request a free quote</a><a class="btn btn-accent btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div>
    <p class="hero-note">${notes.map((n) => `<span>${n}</span>`).join("")}</p>
  </div><div class="hero-art">${pic(img, imgAlt, 560, 747, 'fetchpriority="high"')}</div></div></div></section>`;
}

function write(rel, html) {
  const dir = path.join(ROOT, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  return "/" + rel.replace(/\\/g, "/") + "/";
}

/* ------------------------------------------------------------- page builds */
const urls = [];

// Category pages (real collections)
CATEGORIES.forEach((c) => {
  const canonical = `/products/${c.id}/`;
  const cols = c.collections.map((col) => `<li>${esc(col.name)}</li>`).join("");
  const others = CATEGORIES.filter((x) => x.id !== c.id).map((x) => `<a class="chip" href="/products/${x.id}/">${esc(x.name)}</a>`).join("");
  const html = head({
    title: `${c.name} Equipment in the GTA — Buy, Rent & Repair | Help Mobility`,
    description: `${c.name} from Help Mobility — ${c.collections.slice(0, 4).map((x) => x.name.toLowerCase()).join(", ")} and more. Buy or rent across the Greater Toronto Area, with funding help. Call ${COMPANY.phone}.`,
    canonical, ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/#/shop" }, { name: c.name, path: canonical }]), faqLd()],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Products", path: "/#/shop" }, { name: c.name }]) +
    hero(`${c.name} · ${COMPANY.region}`, `${c.name} equipment across the Greater Toronto Area`, c.blurb,
      `/assets/img/${CAT_IMG[c.id]}.jpg`, `${c.name} equipment from Help Mobility`,
      ["✅ Buy or rent", "🤝 Funding help (ADP · ODSP · WSIB)", "🛟 7-day service"]) +
    `<section class="section"><div class="container"><div class="section-head"><div><h2>What we carry</h2><p>A selection of our ${esc(c.name.toLowerCase())} range — ask us about anything you don't see.</p></div></div>
      <ul class="ticks big cols">${cols}</ul>
      <div class="chips" style="margin-top:1.4rem">${others}</div></div></section>` +
    fundingBanner() + faqSection() + ctaBand(`Looking for ${c.name.toLowerCase()} equipment?`) + footer();
  urls.push(write(`products/${c.id}`, html));
});

// Rental type pages + rentals hub
RENTALS.forEach((r) => {
  const canonical = `/rentals/${r.slug}/`;
  const blurb = RENTAL_BLURB[r.slug] || `${r.name} available to rent by the month across the Greater Toronto Area.`;
  const html = head({
    title: `${r.name} in the GTA — by the Month | Help Mobility`,
    description: `${r.name} from Help Mobility — ${blurb} Delivered and serviced across the Greater Toronto Area. Call ${COMPANY.phone}.`,
    canonical, ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Rentals", path: "/rentals/" }, { name: r.name, path: canonical }]), faqLd()],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Rentals", path: "/rentals/" }, { name: r.name }]) +
    hero(`Rentals · ${COMPANY.region}`, `${r.name} in the Greater Toronto Area`, blurb,
      `/assets/img/mobility.jpg`, `${r.name} from Help Mobility`,
      ["✅ Rent by the month", "🚚 Delivery &amp; setup", "🛟 Service 7 days a week"]) +
    `<section class="section"><div class="container"><div class="section-head"><div><h2>What's included</h2></div></div>
      <ul class="ticks big cols"><li>Delivery and setup across the GTA</li><li>Flexible monthly rental — no long-term commitment</li><li>Servicing and support 7 days a week</li><li>Funding help where you're eligible</li></ul></div></section>` +
    fundingBanner() + faqSection() + ctaBand(`Need a ${r.name.toLowerCase()}?`) + footer();
  urls.push(write(`rentals/${r.slug}`, html));
});
{
  const cards = RENTALS.map((r) => `<a class="col-card cat-mobility" href="/rentals/${r.slug}/"><div class="col-body"><span class="col-tag">Rental</span><h3>${esc(r.name)}</h3></div><span class="more" aria-hidden="true">&rarr;</span></a>`).join("");
  const html = head({
    title: `Mobility Equipment Rentals in the GTA — Beds, Scooters, Stairlifts | Help Mobility`,
    description: `Rent hospital beds, wheelchairs, scooters, stairlifts, walkers, lift chairs and patient lifts by the month across the Greater Toronto Area. Delivered and serviced. Call ${COMPANY.phone}.`,
    canonical: "/rentals/", ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Rentals", path: "/rentals/" }]), faqLd()],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Rentals" }]) +
    `<section class="section" style="padding-top:1.4rem"><div class="container"><div class="section-head"><div><h1>Rent instead of buy</h1><p>Flexible monthly rentals for recovery, short-term needs or trying before you buy — delivered across the GTA.</p></div></div>
      <div class="col-grid">${cards}</div></div></section>` +
    fundingBanner() + faqSection() + ctaBand("Ready to arrange a rental?") + footer();
  urls.push(write("rentals", html));
}

// Repairs page
{
  const equip = REPAIRS.equipment.map((e) => `<li>${esc(e)}</li>`).join("");
  const services = REPAIRS.services.map((s) => `<div class="feature"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("");
  const html = head({
    title: `Mobility Equipment Repairs & Maintenance in the GTA | Help Mobility`,
    description: `Same-day repairs and maintenance for hospital beds, wheelchairs, scooters and lifts across the Greater Toronto Area — 7 days a week, loaner equipment available. Call ${COMPANY.phone}.`,
    canonical: "/repairs/", ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Repairs & Maintenance", path: "/repairs/" }]), faqLd()],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Repairs & Maintenance" }]) +
    `<section class="section" style="padding-top:1.4rem"><div class="container"><h1>${esc(REPAIRS.heading)}</h1>
      <p class="lead">${esc(REPAIRS.intro)}</p>
      <div class="assess-note">We service <strong>${REPAIRS.equipment.join(", ").toLowerCase()}</strong> and more. Not sure if we cover your device? Just ask.</div>
      <div class="feature-grid">${services}</div></div></section>` +
    faqSection() + ctaBand("Need a repair?") + footer();
  urls.push(write("repairs", html));
}

// Funding page
{
  const cards = FUNDING.map((f) => `<div class="feature"><h3>${esc(f.name)}</h3><p>${esc(f.text)}</p></div>`).join("");
  const html = head({
    title: `Funding & Assistance for Mobility Equipment in Ontario | Help Mobility`,
    description: `You may not have to pay full price. Help Mobility helps you access ADP, ODSP, Ontario Works, WSIB, March of Dimes and Spinal Cord Injury Ontario funding for mobility equipment. Call ${COMPANY.phone}.`,
    canonical: "/funding/", ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Funding & Assistance", path: "/funding/" }]), faqLd()],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Funding & Assistance" }]) +
    `<section class="section" style="padding-top:1.4rem"><div class="container"><h1>Funding &amp; assistance programs</h1>
      <p class="lead">You may not have to pay full price for the equipment you need. Help Mobility helps you understand and apply for the programs you qualify for.</p>
      <div class="feature-grid">${cards}</div>
      <p class="fine muted" style="margin-top:1rem">Eligibility and coverage are set by each program. We'll help you find the right fit for your situation.</p></div></section>` +
    faqSection() + ctaBand("Find out what you qualify for") + footer();
  urls.push(write("funding", html));
}

// Industries page
{
  const segs = INDUSTRIES.segments.map((s) => `<div class="feature"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></div>`).join("");
  const html = head({
    title: `Partner With Help Mobility — Hospitals, Long-Term Care & Therapists (GTA)`,
    description: `${INDUSTRIES.intro} Reliable equipment, same-day delivery and maintenance across the Greater Toronto Area. Call ${COMPANY.phone}.`,
    canonical: "/industries/", ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries We Serve", path: "/industries/" }])],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Industries We Serve" }]) +
    `<section class="section" style="padding-top:1.4rem"><div class="container"><h1>${esc(INDUSTRIES.heading)}</h1>
      <p class="lead">${esc(INDUSTRIES.intro)}</p>
      <div class="feature-grid">${segs}</div></div></section>` +
    ctaBand("Work with Help Mobility") + footer();
  urls.push(write("industries", html));
}

// City/area pages
CITIES.forEach((city) => {
  const s = slug(city);
  const canonical = `/areas/${s}/`;
  const cats = CATEGORIES.map((c) => `<a class="cat-card" href="/products/${c.id}/"><div class="cat-card-body"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p><span class="more">View ${esc(c.name)} &rarr;</span></div></a>`).join("");
  const html = head({
    title: `Mobility Equipment in ${city} — Sales, Rentals & Repairs | Help Mobility`,
    description: `Help Mobility serves ${city} with wheelchairs, scooters, stairlifts, ramps, bathroom safety and homecare equipment — buy, rent or repair. Funding help available. Call ${COMPANY.phone}.`,
    canonical, ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Areas We Serve", path: "/areas/" }, { name: city, path: canonical }]), faqLd()],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Areas We Serve", path: "/areas/" }, { name: city }]) +
    hero(`Serving ${city} & nearby`, `Mobility & home-healthcare equipment in ${city}`,
      `Help Mobility supplies, rents and repairs mobility and home-healthcare equipment for ${city} residents and families — with delivery, installation and funding help across the Greater Toronto Area.`,
      `/assets/img/mobility.jpg`, `Staying active and independent in ${city}`,
      ["✅ Free, no-obligation quote", `🚚 Delivery &amp; install in ${esc(city)}`, "🛟 7-day service"]) +
    `<section class="section"><div class="container"><div class="section-head"><div><h2>What we offer in ${esc(city)}</h2><p>Everything for comfort, safety and independence at home.</p></div></div><div class="cat-grid">${cats}</div></div></section>` +
    fundingBanner() + faqSection() + ctaBand(`Need mobility equipment in ${city}?`) + footer();
  urls.push(write(`areas/${s}`, html));
});

// Areas hub
{
  const cards = CITIES.map((c) => `<a class="col-card cat-mobility" href="/areas/${slug(c)}/"><div class="col-body"><span class="col-tag">Service area</span><h3>${esc(c)}</h3></div><span class="more" aria-hidden="true">&rarr;</span></a>`).join("");
  const html = head({
    title: `Areas We Serve — Mobility Equipment Across the GTA | Help Mobility`,
    description: `Help Mobility serves the Greater Toronto Area — Toronto, Mississauga, Brampton, Scarborough and more — with mobility and home-healthcare equipment sales, rentals and repairs.`,
    canonical: "/areas/", ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Areas We Serve", path: "/areas/" }])],
  }) + header() +
    crumb([{ name: "Home", path: "/" }, { name: "Areas We Serve" }]) +
    `<section class="section" style="padding-top:1.4rem"><div class="container"><div class="section-head"><div><h1>Areas we serve</h1><p>Sales, rentals and repairs across the Greater Toronto Area.</p></div></div>
    <div class="col-grid">${cards}</div></div></section>` + ctaBand("Don't see your city?") + footer();
  urls.push(write("areas", html));
}

/* ----------------------------------------------------------- sitemap.xml */
const all = [ORIGIN + "/"].concat(urls.map((u) => ORIGIN + u));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  all.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>${u === ORIGIN + "/" ? "1.0" : "0.8"}</priority></url>`).join("\n") +
  `\n</urlset>\n`);

console.log("Generated " + urls.length + " landing pages + sitemap.xml (" + all.length + " urls):");
urls.forEach((u) => console.log("  " + u));
