#!/usr/bin/env node
/*
 * Help Mobility — static SEO landing-page generator
 * --------------------------------------------------
 * The main site is a hash-routed SPA (great UX, but crawlers see one page).
 * This emits standalone, crawlable HTML pages that share the site's CSS and
 * link into the SPA's quote flow — the big win for local search traffic:
 *   - one page per product category   → /products/<cat>/
 *   - one page per GTA city we serve   → /areas/<city>/
 *   - an "areas we serve" hub          → /areas/
 * Each page has unique title/description, real content, internal links,
 * click-to-call, and LocalBusiness + Breadcrumb (+ FAQ) structured data.
 *
 * Run:  node tools/build-landing.js   (also updates sitemap.xml)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://helpmobility.ca";

const COMPANY = {
  name: "Help Mobility",
  tagline: "helping you get active, today!",
  phone: "905-615-9302",
  phoneHref: "tel:+19056159302",
  region: "Greater Toronto Area",
  logo: "/assets/img/logo-dark.png",
};

const CATEGORIES = [
  { slug: "mobility", name: "Mobility",
    blurb: "Reliable solutions for getting around with ease. From manual and power wheelchairs to scooters and walkers, we offer mobility aids tailored to every need and lifestyle.",
    items: ["Manual wheelchairs", "Powered wheelchairs", "Transport wheelchairs", "Mobility scooters", "Indoor & outdoor rollators", "Walkers", "Canes & crutches", "Power assist"] },
  { slug: "accessibility", name: "Accessibility",
    blurb: "Make spaces safer and more inclusive. Our accessibility products include ramps, lifts, transfer aids, and home modifications that remove barriers and promote freedom.",
    items: ["Stairlifts", "Ramps", "Railings", "Automatic door openers", "Ceiling lifts", "Floor & standing lifts", "Porch & platform lifts", "Power lift recliners", "Slings", "Support poles"] },
  { slug: "bathroom", name: "Bathroom",
    blurb: "Stay safe and confident in the most personal space. We provide grab bars, shower chairs, raised toilet seats, and other bathroom safety equipment designed for comfort and dignity.",
    items: ["Grab bars", "Shower chairs & stools", "Raised toilet seats", "Bath lifts", "Walk-in bathtubs", "Commodes", "Bathroom accessibility"] },
  { slug: "daily", name: "Daily Living",
    blurb: "Support for everyday tasks made easier. Our daily living aids include dressing tools, kitchen accessories, reachers, and adaptive devices that simplify routines and promote independence.",
    items: ["Bedroom & daily-living aids", "Living-area products", "Personal care", "Incontinence products", "Reachers & dressing aids"] },
];

// Curated, high-intent GTA cities. Expand once GBP/analytics confirm demand.
const CITIES = ["Toronto", "Mississauga", "Brampton", "Scarborough", "North York", "Etobicoke", "Markham", "Vaughan"];

const FAQ = [
  ["Do I have to pay full price for my equipment?", "Often, no. We help you access funding programs like ADP, ODSP, Ontario Works, WSIB, March of Dimes and Spinal Cord Injury Ontario, which can cover part — or all — of the cost. Ask us what you may qualify for."],
  ["Can I rent instead of buying?", "Yes. Hospital beds, wheelchairs, scooters, stairlifts, walkers, lift chairs and patient lifts are available to rent by the month — ideal for recovery or short-term needs."],
  ["Do you deliver and install?", "Yes. We deliver across the Greater Toronto Area and install equipment such as stairlifts, ramps and lifts so it is ready to use safely."],
  ["Do you repair and service equipment?", "We do — 7 days a week, with same-day repairs across the GTA and loaner equipment available while yours is serviced."],
];

/* ----------------------------------------------------------------- helpers */
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const jsonLd = (obj) => '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + "\n</script>";

function localBusinessLd() {
  return {
    "@context": "https://schema.org", "@type": "MedicalSupplyStore",
    name: COMPANY.name, slogan: COMPANY.tagline, url: ORIGIN + "/",
    image: ORIGIN + COMPANY.logo, telephone: "+1-905-615-9302",
    areaServed: { "@type": "Place", name: "Greater Toronto Area, Ontario, Canada" },
    makesOffer: ["Mobility equipment sales", "Mobility equipment rentals", "Equipment repairs & maintenance"]
      .map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
  };
}
function breadcrumbLd(trail) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: ORIGIN + t.path })),
  };
}
function faqLd() {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

function head(opts) {
  const og = opts.title;
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
  <meta property="og:title" content="${esc(og)}" />
  <meta property="og:description" content="${esc(opts.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${ORIGIN}${COMPANY.logo}" />
  <link rel="stylesheet" href="/assets/css/styles.css" />
  ${opts.ld.map(jsonLd).join("\n  ")}
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
    <a class="brand" href="/" aria-label="Help Mobility — home"><img src="${COMPANY.logo}" alt="Help Mobility — helping you get active, today!" width="153" height="40" /></a>
    <div class="header-actions">
      <a class="btn btn-ghost btn-sm call-link" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a>
      <a class="btn btn-accent btn-sm" href="/#/quote">📝 Get a quote</a>
      <button class="nav-toggle" data-action="nav-toggle" aria-label="Menu" aria-controls="mainnav" aria-expanded="false">☰</button>
    </div>
  </div>
  <nav class="mainnav" id="mainnav" aria-label="Primary"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/#/shop">Explore Products</a></li>
    <li><a href="/#/rentals">Rentals</a></li>
    <li><a href="/#/repairs">Repairs &amp; Maintenance</a></li>
    <li><a href="/#/funding">Funding</a></li>
    <li><a href="/areas/">Areas We Serve</a></li>
    <li><a href="/#/contact">Contact</a></li>
  </ul></nav></header>
  <main id="main">`;
}

function fundingBanner() {
  const li = ["Assistive Devices Program (ADP)", "Ontario Disability Support Program (ODSP)", "Ontario Works", "WSIB", "March of Dimes Canada", "Spinal Cord Injury Ontario"].map((f) => `<li>${esc(f)}</li>`).join("");
  return `<section class="section"><div class="container"><div class="funding-banner">
    <div><p class="eyebrow">Worried about the cost?</p><h2>You may not have to pay full price</h2>
      <p class="lead">We help you access government and insurer programs that can cover part — or all — of the cost of your equipment.</p>
      <div class="cta-actions cta-left"><a class="btn btn-primary btn-lg" href="/#/funding">See funding options</a>
      <a class="btn btn-ghost btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div></div>
    <ul class="ticks big">${li}</ul>
  </div></div></section>`;
}

function faqSection() {
  const items = FAQ.map(([q, a], i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><div class="faq-a">${esc(a)}</div></details>`).join("");
  return `<section class="section"><div class="container"><div class="section-head"><div><h2>Questions? Answers.</h2><p>The things people ask us most, before they get in touch.</p></div></div><div class="faq">${items}</div></div></section>`;
}

function ctaBand(line) {
  return `<section class="section"><div class="container"><div class="cta-band"><h2>${esc(line)}</h2>
    <p>Tell us about your situation and a Help Mobility specialist will recommend the right solution and prepare a clear quote — buy or rent.</p>
    <div class="cta-actions"><a class="btn btn-accent btn-lg" href="/#/quote">Request a free quote</a>
    <a class="btn btn-outline btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div></div></div></section>`;
}

function footer() {
  const cats = CATEGORIES.map((c) => `<a href="/products/${c.slug}/">${esc(c.name)}</a>`).join("");
  const cities = CITIES.map((c) => `<a href="/areas/${slug(c)}/">${esc(c)}</a>`).join("");
  return `</main>
  <footer class="site-footer"><div class="container"><div class="footer-grid">
    <div><span class="footer-brand-logo"><img src="${COMPANY.logo}" alt="Help Mobility" width="172" height="45" /></span>
      <p style="color:#cdd9e4;margin:.9rem 0">Helping you get active, today! Sales, rentals and repairs across the Greater Toronto Area.</p>
      <p>📞 <a href="${COMPANY.phoneHref}" style="display:inline">${COMPANY.phone}</a></p></div>
    <div><h4>Products</h4>${cats}</div>
    <div><h4>Areas we serve</h4>${cities}</div>
    <div><h4>Company</h4><a href="/#/repairs">Repairs &amp; Maintenance</a><a href="/#/funding">Funding &amp; Assistance</a><a href="/#/contact">Contact us</a><a href="${COMPANY.phoneHref}">Call ${COMPANY.phone}</a></div>
  </div></div>
  <div class="footer-bottom">© <span id="year">${new Date().getFullYear()}</span> Help Mobility. Serving the Greater Toronto Area.</div></footer>
  <div class="mobile-cta" aria-label="Quick contact">
    <a class="btn btn-accent" href="${COMPANY.phoneHref}">📞 Call now</a>
    <a class="btn btn-primary" href="/#/quote">📝 Free quote</a>
  </div>
  <script>
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-action="nav-toggle"]');if(t){var n=document.getElementById('mainnav');var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');}});
  </script>
</body>
</html>`;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function write(rel, html) {
  const dir = path.join(ROOT, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  return "/" + rel.replace(/\\/g, "/") + "/";
}

/* ------------------------------------------------------------- page builds */
const urls = [];

// Category pages
CATEGORIES.forEach((c) => {
  const canonical = `/products/${c.slug}/`;
  const items = c.items.map((i) => `<li>${esc(i)}</li>`).join("");
  const others = CATEGORIES.filter((x) => x.slug !== c.slug).map((x) => `<a class="chip" href="/products/${x.slug}/">${esc(x.name)}</a>`).join("");
  const html = head({
    title: `${c.name} Equipment in the GTA — Buy, Rent & Repair | Help Mobility`,
    description: `${c.name} equipment from Help Mobility — ${c.items.slice(0, 4).join(", ").toLowerCase()} and more. Buy or rent across the Greater Toronto Area, with funding help. Call ${COMPANY.phone}.`,
    canonical, ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/#/shop" }, { name: c.name, path: canonical }]), faqLd()],
  }) + header() +
    `<div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/#/shop">Products</a> / ${esc(c.name)}</nav></div>
    <section class="hero"><div class="container"><div class="hero-grid"><div>
      <p class="eyebrow">${esc(c.name)} · ${esc(COMPANY.region)}</p>
      <h1>${esc(c.name)} equipment across the Greater Toronto Area</h1>
      <p class="lead">${esc(c.blurb)}</p>
      <div class="hero-cta"><a class="btn btn-primary btn-lg" href="/#/quote">Request a free quote</a><a class="btn btn-accent btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div>
      <p class="hero-note"><span>✅ Buy or rent</span><span>🤝 Funding help (ADP · ODSP · WSIB)</span><span>🛟 7-day service</span></p>
    </div><div class="hero-art"><img src="/assets/img/${c.slug === "mobility" ? "power-header" : c.slug === "accessibility" ? "lift-chair" : c.slug === "bathroom" ? "bathroom" : "smartdrive"}.jpg" alt="${esc(c.name)} equipment from Help Mobility" width="560" height="747"></div></div></div></section>
    <section class="section"><div class="container"><div class="section-head"><div><h2>What we carry</h2><p>A selection of our ${esc(c.name.toLowerCase())} range — ask us about anything you don't see.</p></div></div>
      <ul class="ticks big cols">${items}</ul>
      <div class="chips" style="margin-top:1.4rem">${others}</div></div></section>` +
    fundingBanner() + faqSection() + ctaBand(`Looking for ${c.name.toLowerCase()} equipment?`) + footer();
  urls.push(write(`products/${c.slug}`, html));
});

// City/area pages
CITIES.forEach((city) => {
  const s = slug(city);
  const canonical = `/areas/${s}/`;
  const cats = CATEGORIES.map((c) => `<a class="cat-card" href="/products/${c.slug}/"><div class="cat-card-body"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p><span class="more">View ${esc(c.name)} &rarr;</span></div></a>`).join("");
  const html = head({
    title: `Mobility Equipment in ${city} — Sales, Rentals & Repairs | Help Mobility`,
    description: `Help Mobility serves ${city} with wheelchairs, scooters, stairlifts, ramps, bathroom safety and homecare equipment — buy, rent or repair. Funding help available. Call ${COMPANY.phone}.`,
    canonical, ld: [localBusinessLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Areas We Serve", path: "/areas/" }, { name: city, path: canonical }]), faqLd()],
  }) + header() +
    `<div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/areas/">Areas We Serve</a> / ${esc(city)}</nav></div>
    <section class="hero"><div class="container"><div class="hero-grid"><div>
      <p class="eyebrow">Serving ${esc(city)} &amp; nearby</p>
      <h1>Mobility &amp; home-healthcare equipment in ${esc(city)}</h1>
      <p class="lead">Help Mobility supplies, rents and repairs mobility and home-healthcare equipment for ${esc(city)} residents and families — with delivery, installation and funding help across the Greater Toronto Area.</p>
      <div class="hero-cta"><a class="btn btn-primary btn-lg" href="/#/quote">Request a free quote</a><a class="btn btn-accent btn-lg" href="${COMPANY.phoneHref}">📞 ${COMPANY.phone}</a></div>
      <p class="hero-note"><span>✅ Free, no-obligation quote</span><span>🚚 Delivery &amp; install in ${esc(city)}</span><span>🛟 7-day service</span></p>
    </div><div class="hero-art"><img src="/assets/img/mobility.jpg" alt="Staying active and independent in ${esc(city)}" width="560" height="747"></div></div></div></section>
    <section class="section"><div class="container"><div class="section-head"><div><h2>What we offer in ${esc(city)}</h2><p>Everything for comfort, safety and independence at home.</p></div></div><div class="cat-grid">${cats}</div></div></section>` +
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
    `<div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / Areas We Serve</nav></div>
    <section class="section" style="padding-top:1.4rem"><div class="container"><div class="section-head"><div><h1>Areas we serve</h1><p>Sales, rentals and repairs across the Greater Toronto Area.</p></div></div>
    <div class="col-grid">${cards}</div></div></section>` + ctaBand("Don't see your city?") + footer();
  urls.push(write("areas", html));
}

/* ----------------------------------------------------------- sitemap.xml */
const staticUrls = [ORIGIN + "/"];
const all = staticUrls.concat(urls.map((u) => ORIGIN + u));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>${u === ORIGIN + "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

console.log("Generated " + urls.length + " landing pages + sitemap.xml (" + all.length + " urls):");
urls.forEach((u) => console.log("  " + u));
