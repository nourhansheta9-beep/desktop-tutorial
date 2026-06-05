/*
 * Help Mobility — website application
 * -----------------------------------
 * Vanilla JS, hash-routed single-page app. No build step; runs from file://
 * or any static host. Faithful to the real Help Mobility site: browse the real
 * product categories & collections, rentals, repairs, funding and industries —
 * then turn interest into a contactable quote request (a real lead).
 */
(function () {
  "use strict";

  var HM = window.HM || {};
  var COMPANY = HM.COMPANY, VALUES = HM.VALUES, CATEGORIES = HM.CATEGORIES,
      RENTALS = HM.RENTALS, REPAIRS = HM.REPAIRS, INDUSTRIES = HM.INDUSTRIES, FUNDING = HM.FUNDING,
      HOWITWORKS = HM.HOWITWORKS, FAQ = HM.FAQ,
      CONFIG = HM.CONFIG || {}, REVIEWS = HM.REVIEWS || [],
      FEATURED = HM.FEATURED || [], ICONS = HM.ICONS || {},
      CATALOG = HM.CATALOG || [], FUND_INFO = HM.FUND_INFO || {};

  function ico(name) { return ICONS[name] || ""; }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  // flat product list (for search) + group lookup by category
  var ALL_PRODUCTS = [];
  CATALOG.forEach(function (g) { g.products.forEach(function (pr) { ALL_PRODUCTS.push({ p: pr, g: g }); }); });
  function groupsByCat(catId) { return CATALOG.filter(function (g) { return g.cat === catId; }); }

  function fundBadges(funding) {
    if (!funding || !funding.length) return "";
    return '<div class="fund-badges">' + funding.map(function (f) {
      return '<span class="fund-badge fund-' + f.toLowerCase() + '" title="' + escapeHtml(FUND_INFO[f] || f) + '">' + escapeHtml(f) + "</span>";
    }).join("") + "</div>";
  }
  function productCard(pr, g) {
    var media = pr.img
      ? '<div class="prod-media">' + picture(pr.img, pr.name, 600, 400) + "</div>"
      : '<div class="prod-media illus cat-' + g.cat + '" aria-hidden="true">' + ico(pr.pic || g.icon) + "</div>";
    return '<article class="prod-card">' + media +
      '<div class="prod-body">' +
        (pr.brand ? '<span class="prod-brand">' + escapeHtml(pr.brand) + "</span>" : "") +
        "<h4>" + escapeHtml(pr.name) + "</h4>" +
        '<p>' + escapeHtml(pr.blurb) + "</p>" +
        fundBadges(pr.funding || g.funding) +
        '<button class="btn btn-primary btn-sm" data-action="add" data-id="' + slugify(pr.name) +
          '" data-name="' + escapeHtml(pr.name) + '" data-note="' + escapeHtml(g.name) + '">Add to quote</button>' +
      "</div></article>";
  }
  function groupBlock(g) {
    return '<section class="group" id="grp-' + g.id + '"><div class="group-head"><div>' +
      "<h2>" + escapeHtml(g.name) + "</h2><p>" + escapeHtml(g.blurb) + "</p>" + fundBadges(g.funding) +
      "</div></div><div class=\"prod-grid\">" + g.products.map(function (pr) { return productCard(pr, g); }).join("") + "</div></section>";
  }

  var QUOTE_KEY = "hm_quote_v1";
  var LEADS_KEY = "hm_leads_v1";

  // Flat index of every collection for search + lookups.
  var ALL_COLLECTIONS = [];
  CATEGORIES.forEach(function (c) {
    c.collections.forEach(function (col) {
      ALL_COLLECTIONS.push({ slug: col.slug, name: col.name, cat: c.id, catName: c.name });
    });
  });

  /* ------------------------------------------------------------------ utils */
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }
  function catById(id) { return CATEGORIES.filter(function (c) { return c.id === id; })[0]; }
  function phoneCta(cls) {
    return '<a class="btn ' + (cls || "btn-ghost") + '" href="' + COMPANY.phoneHref + '">' +
      ico("phone") + " " + escapeHtml(COMPANY.phone) + "</a>";
  }

  /* --------------------------------------------------- analytics + delivery */
  // Fire a GA4 event (no-op until CONFIG.gaId is set in data.js).
  function track(event, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", event, params || {}); } catch (e) {}
  }
  function initAnalytics() {
    var ids = [CONFIG.gaId, CONFIG.googleAdsId].filter(Boolean);
    if (!ids.length || location.protocol.indexOf("http") !== 0) return; // needs an ID over http(s)
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ids[0]);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    ids.forEach(function (id) { window.gtag("config", id); });
  }
  // Deliver a captured lead to your endpoint (no-op until CONFIG.leadEndpoint is set).
  function postLead(lead) {
    if (!CONFIG.leadEndpoint) return;
    try {
      fetch(CONFIG.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(lead)
      }).catch(function () {});
    } catch (e) {}
  }

  /* ------------------------------------------------------------- quote list */
  function loadQuote() {
    try { return JSON.parse(localStorage.getItem(QUOTE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveQuote() {
    try { localStorage.setItem(QUOTE_KEY, JSON.stringify(quote)); } catch (e) {}
    updateQuoteBadge();
  }
  var quote = loadQuote();

  function keyOf(item) { return item.id + "|" + (item.note || ""); }
  function hasItem(id, note) {
    return quote.some(function (i) { return keyOf(i) === id + "|" + (note || ""); });
  }
  function addItem(id, name, note) {
    if (hasItem(id, note)) return false;
    quote.push({ id: id, name: name, note: note || "" });
    saveQuote();
    return true;
  }
  function removeItem(id, note) {
    quote = quote.filter(function (i) { return keyOf(i) !== id + "|" + (note || ""); });
    saveQuote();
  }
  function clearQuote() { quote = []; saveQuote(); }
  function updateQuoteBadge() {
    var el = document.getElementById("quote-count");
    if (!el) return;
    el.textContent = quote.length;
    el.hidden = quote.length === 0;
  }

  /* ------------------------------------------------------------------ leads */
  function makeRef() {
    return "HM-" + Date.now().toString(36).toUpperCase().slice(-5) + "-" +
           Math.floor(Math.random() * 1296).toString(36).toUpperCase().padStart(2, "0");
  }
  function saveLead(lead) {
    var all = [];
    try { all = JSON.parse(localStorage.getItem(LEADS_KEY)) || []; } catch (e) {}
    all.push(lead);
    try { localStorage.setItem(LEADS_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function getLead(ref) {
    try {
      return (JSON.parse(localStorage.getItem(LEADS_KEY)) || [])
        .filter(function (l) { return l.ref === ref; })[0] || null;
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------ toast */
  function toast(html, ms) {
    var wrap = document.getElementById("toasts");
    if (!wrap) return;
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = html;
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s, transform .3s";
      t.style.opacity = "0"; t.style.transform = "translateY(10px)";
      setTimeout(function () { t.remove(); }, 300);
    }, ms || 3200);
  }

  /* ----------------------------------------------------------------- router */
  function parseHash() {
    var raw = location.hash.replace(/^#/, "") || "/";
    var qi = raw.indexOf("?");
    var path = qi === -1 ? raw : raw.slice(0, qi);
    var query = qi === -1 ? "" : raw.slice(qi + 1);
    if (path.charAt(0) !== "/") path = "/" + path;
    var params = {};
    query.split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });
    return { path: path, params: params };
  }
  function go(hash) { location.hash = hash; }

  /* ----------------------------------------------------------------- pieces */
  // WebP (with JPEG fallback) for fast, Core-Web-Vitals-friendly images.
  function picture(jpg, alt, w, h, attrs) {
    var webp = jpg.replace(/\.jpg$/, ".webp");
    return '<picture><source type="image/webp" srcset="' + webp + '">' +
      '<img src="' + jpg + '" alt="' + escapeHtml(alt) + '" width="' + w + '" height="' + h + '" ' +
      (attrs || 'loading="lazy"') + "></picture>";
  }
  function collectionCard(col, catId, catName) {
    return '<article class="col-card cat-' + catId + '">' +
      '<div class="col-body"><span class="col-tag">' + escapeHtml(catName) + "</span>" +
        "<h3>" + escapeHtml(col.name) + "</h3></div>" +
      '<button class="btn btn-ghost btn-sm" data-action="add" data-id="' + escapeHtml(col.slug) +
        '" data-name="' + escapeHtml(col.name) + '" data-note="' + escapeHtml(catName) + '">' +
        "Add to quote</button>" +
      "</article>";
  }
  function categoryCard(c) {
    return '<a class="cat-card" href="#/shop?cat=' + c.id + '">' +
      '<div class="cat-media">' + picture(c.image, c.alt, 640, 420) + "</div>" +
      '<div class="cat-card-body"><h3>' + escapeHtml(c.name) + "</h3>" +
        "<p>" + escapeHtml(c.blurb) + "</p>" +
        '<span class="more">Browse ' + escapeHtml(c.name) + " &rarr;</span></div>" +
      "</a>";
  }
  function crumbs(trail) {
    return '<div class="container"><nav class="crumbs" aria-label="Breadcrumb">' +
      trail.map(function (t, i) {
        return (t.href ? '<a href="' + t.href + '">' + escapeHtml(t.label) + "</a>" : escapeHtml(t.label)) +
               (i < trail.length - 1 ? " / " : "");
      }).join("") + "</nav></div>";
  }

  // Cost-objection killer: funding is the single biggest reason people hesitate.
  // Real-photo equipment gallery — makes the catalogue feel tangible & premium.
  function featuredSection() {
    var cards = FEATURED.map(function (f) {
      return '<a class="feat-card" href="#/shop?cat=' + f.cat + '">' +
        '<div class="feat-media">' + picture(f.img, f.name, 600, 400) + "</div>" +
        '<div class="feat-body"><h3>' + escapeHtml(f.name) + "</h3>" +
        "<p>" + escapeHtml(f.note) + '</p><span class="more">View ' + ico("arrow") + "</span></div></a>";
    }).join("");
    return '<section class="section"><div class="container">' +
      '<div class="section-head"><div><h2>Featured equipment</h2><p>A selection of what we supply, rent and service across the GTA.</p></div>' +
      '<a class="btn btn-ghost" href="#/shop">View all products</a></div>' +
      '<div class="feat-grid">' + cards + "</div></div></section>";
  }

  // Clinical / human "we help you choose" band using the real assessment photo.
  function assessmentBand() {
    return '<section class="section alt"><div class="container"><div class="assess-band">' +
      '<div class="assess-media">' + picture("assets/img/lifestyle.jpg", "A Help Mobility specialist assessing a client’s needs", 700, 470) + "</div>" +
      '<div class="assess-copy"><p class="eyebrow">Personal, expert guidance</p>' +
      "<h2>We help you choose the right equipment</h2>" +
      '<p class="lead">Not sure what you need? Our team gets to know your situation, your home and your budget, then recommends the right solution — and handles delivery, setup and funding.</p>' +
      '<ul class="ticks">' +
        "<li>One-on-one advice from people who care</li>" +
        "<li>Help applying for ADP, ODSP, WSIB &amp; more</li>" +
        "<li>Delivery, installation and 7-day service</li>" +
      "</ul>" +
      '<div class="hero-cta"><a class="btn btn-primary btn-lg" href="#/quote">Request a free quote</a>' + phoneCta("btn-accent btn-lg") + "</div>" +
      "</div></div></div></section>";
  }

  function fundingBanner() {
    var list = FUNDING.slice(0, 6).map(function (f) { return "<li>" + escapeHtml(f.name) + "</li>"; }).join("");
    return '<section class="section"><div class="container"><div class="funding-banner">' +
      "<div><p class=\"eyebrow\">Worried about the cost?</p>" +
        "<h2>You may not have to pay full price</h2>" +
        "<p class=\"lead\">We help you access government and insurer programs that can cover part — or all — of the cost of your equipment. We’ll tell you what you qualify for.</p>" +
        '<div class="cta-actions cta-left"><a class="btn btn-primary btn-lg" href="#/funding">See funding options</a>' + phoneCta("btn-ghost btn-lg") + "</div></div>" +
      '<ul class="ticks big">' + list + "</ul>" +
    "</div></div></section>";
  }

  function howItWorks() {
    var steps = HOWITWORKS.map(function (s) {
      return '<div class="step"><div class="step-n" aria-hidden="true">' + escapeHtml(s.step) + "</div>" +
        "<h3>" + escapeHtml(s.title) + "</h3><p>" + escapeHtml(s.text) + "</p></div>";
    }).join("");
    return '<section class="section alt"><div class="container">' +
      '<div class="section-head"><div><h2>How it works</h2><p>Getting the right equipment is simple — and we’re with you the whole way.</p></div></div>' +
      '<div class="steps">' + steps + "</div></div></section>";
  }

  function faqSection() {
    var items = FAQ.map(function (f, i) {
      return '<details class="faq-item"' + (i === 0 ? " open" : "") + "><summary>" + escapeHtml(f.q) +
        '</summary><div class="faq-a">' + escapeHtml(f.a) + "</div></details>";
    }).join("");
    return '<section class="section"><div class="container">' +
      '<div class="section-head"><div><h2>Questions? Answers.</h2><p>The things people ask us most, before they get in touch.</p></div></div>' +
      '<div class="faq">' + items + "</div></div></section>";
  }

  // Social proof — only renders once REAL reviews are added to data.js (REVIEWS).
  function reviewsSection() {
    if (!REVIEWS.length) return "";
    var cards = REVIEWS.map(function (r) {
      var n = Math.round(r.stars || 5);
      var stars = "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
      return '<figure class="review"><div class="stars" aria-label="' + n + ' out of 5 stars">' + stars + "</div>" +
        "<blockquote>&ldquo;" + escapeHtml(r.quote) + "&rdquo;</blockquote>" +
        "<figcaption>" + escapeHtml(r.name) + (r.city ? ' · <span class="muted">' + escapeHtml(r.city) + "</span>" : "") + "</figcaption></figure>";
    }).join("");
    return '<section class="section alt"><div class="container">' +
      '<div class="section-head"><div><h2>What our customers say</h2><p>Real experiences from people we’ve helped stay independent.</p></div></div>' +
      '<div class="reviews">' + cards + "</div></div></section>";
  }

  // Lowest-friction lead capture: just a name + phone, "we'll call you".
  function callbackCard() {
    return '<div class="callback-card">' +
      "<h2>Prefer we call you?</h2>" +
      '<p class="muted">Leave your name and number and a specialist will call you back — usually the same day.</p>' +
      '<form id="callback-form" novalidate>' +
        '<div class="field"><label for="cb-name">Name <span class="req" aria-hidden="true">*</span></label>' +
          '<input id="cb-name" name="name" type="text" autocomplete="name" required></div>' +
        '<div class="field"><label for="cb-phone">Phone <span class="req" aria-hidden="true">*</span></label>' +
          '<input id="cb-phone" name="phone" type="tel" autocomplete="tel" required></div>' +
        '<button type="submit" class="btn btn-accent btn-lg btn-block">Call me back</button>' +
        '<span class="error-msg" id="cb-error" role="alert"></span>' +
      "</form>" +
      '<p class="fine muted">Or call us now: <a href="' + COMPANY.phoneHref + '">' + escapeHtml(COMPANY.phone) + "</a></p>" +
    "</div>";
  }

  /* ------------------------------------------------------------------ views */
  function renderHome() {
    var values = VALUES.map(function (v) {
      return '<div class="item"><div class="vico" aria-hidden="true">' + ico(v.icon) + "</div>" +
        '<div><div class="t">' + escapeHtml(v.title) + '</div><div class="d">' + escapeHtml(v.text) + "</div></div></div>";
    }).join("");

    var cats = CATEGORIES.map(categoryCard).join("");

    var rentals = RENTALS.slice(0, 6).map(function (r) {
      return '<li>' + escapeHtml(r.name) + "</li>";
    }).join("");

    return '' +
      '<section class="hero"><div class="container"><div class="hero-grid">' +
        "<div>" +
          '<p class="eyebrow">Mobility &amp; home healthcare · ' + escapeHtml(COMPANY.region) + "</p>" +
          "<h1>Welcome to Help Mobility</h1>" +
          '<p class="tagline">' + escapeHtml(COMPANY.tagline) + "</p>" +
          '<p class="lead">' + escapeHtml(COMPANY.intro) + " " + escapeHtml(COMPANY.specialise) + "</p>" +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary btn-lg" href="#/quote">Request a free quote</a>' +
            phoneCta("btn-accent btn-lg") +
          "</div>" +
          '<p class="hero-note"><span>' + ico("check") + " Free, no-obligation quote</span><span>" + ico("coins") + " Funding help (ADP · ODSP · WSIB)</span><span>" + ico("clock") + " Service 7 days a week</span></p>" +
        "</div>" +
        '<div class="hero-art">' +
          picture("assets/img/mobility.jpg", "A person staying active and independent with mobility support", 560, 747, 'fetchpriority="high"') +
        "</div>" +
      "</div></div></section>" +

      '<div class="container"><div class="value-strip">' + values + "</div></div>" +

      featuredSection() +

      fundingBanner() +

      '<section class="section"><div class="container">' +
        '<div class="section-head"><div><h2>Shop by need</h2><p>Four ways we help you stay comfortable, safe and independent at home.</p></div>' +
        '<a class="btn btn-ghost" href="#/shop">View all products</a></div>' +
        '<div class="cat-grid">' + cats + "</div>" +
      "</div></section>" +

      assessmentBand() +

      howItWorks() +

      '<section class="section"><div class="container"><div class="mission">' +
        "<h2>Empowering independence through smart solutions</h2>" +
        '<p class="lead">' + escapeHtml(COMPANY.mission) + "</p>" +
      "</div></div></section>" +

      '<section class="section alt"><div class="container"><div class="split">' +
        '<div class="split-card">' +
          "<h2>Rent instead of buy</h2>" +
          "<p>Short-term need, recovery or just trying before you buy? Rent quality equipment by the month.</p>" +
          '<ul class="ticks">' + rentals + "</ul>" +
          '<a class="btn btn-primary" href="#/rentals">See rental options</a>' +
        "</div>" +
        callbackCard() +
      "</div></div></section>" +

      reviewsSection() +

      faqSection() +

      '<section class="section"><div class="container"><div class="cta-band">' +
        "<h2>Not sure what you need?</h2>" +
        "<p>Tell us about your situation and a Help Mobility specialist will recommend the right solution and prepare a clear quote — buy or rent.</p>" +
        '<div class="cta-actions">' +
          '<a class="btn btn-accent btn-lg" href="#/quote">Request a free quote</a>' +
          phoneCta("btn-outline btn-lg") +
        "</div>" +
      "</div></div></section>";
  }

  function renderShop(params) {
    var q = (params.q || "").trim();
    var catId = params.cat || "";

    // chips
    function chip(id, label) {
      var active = (id === "" && !catId && !q) || id === catId;
      return '<a class="chip' + (active ? " active" : "") + '" href="#/shop' + (id ? "?cat=" + id : "") + '">' + escapeHtml(label) + "</a>";
    }
    var chips = chip("", "All") + CATEGORIES.map(function (c) { return chip(c.id, c.name); }).join("");

    var body;
    if (q) {
      var ql = q.toLowerCase();
      var matches = ALL_PRODUCTS.filter(function (x) {
        return (x.p.name + " " + (x.p.brand || "") + " " + x.p.blurb + " " + x.g.name).toLowerCase().indexOf(ql) !== -1;
      });
      body = '<div class="section-head"><div><h1>Search results</h1>' +
        '<p class="result-count">' + matches.length + " result" + (matches.length === 1 ? "" : "s") +
        ' for &ldquo;' + escapeHtml(q) + "&rdquo;</p></div></div>" +
        (matches.length
          ? '<div class="prod-grid">' + matches.map(function (x) { return productCard(x.p, x.g); }).join("") + "</div>"
          : '<div class="empty-state"><h3>No matching products</h3>' +
            '<p class="muted">Try another search, or browse all categories.</p>' +
            '<a class="btn btn-primary" href="#/shop">Browse all products</a></div>');
    } else if (catId && catById(catId)) {
      var c = catById(catId);
      body =
        '<div class="cat-hero cat-' + c.id + '">' + picture(c.image, c.alt, 640, 420) +
          "<div><h1>" + escapeHtml(c.name) + "</h1><p>" + escapeHtml(c.blurb) + "</p>" +
          '<a class="btn btn-accent" href="#/quote">Request a free quote</a></div>' +
        "</div>" +
        groupsByCat(catId).map(groupBlock).join("");
    } else {
      body = '<div class="section-head"><div><h1>Explore our products</h1><p class="result-count">' +
        ALL_PRODUCTS.length + " products across " + CATALOG.length + " categories — buy or rent, with funding help.</p></div></div>" +
        CATALOG.map(groupBlock).join("");
    }

    return crumbs([{ label: "Home", href: "#/" }, { label: "Products" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="chips" role="navigation" aria-label="Product categories">' + chips + "</div>" +
        body +
      "</div></section>";
  }

  function renderRentals() {
    var cards = RENTALS.map(function (r) {
      return '<article class="col-card cat-mobility">' +
        '<div class="col-body"><span class="col-tag">Rental</span><h3>' + escapeHtml(r.name) + "</h3></div>" +
        '<button class="btn btn-ghost btn-sm" data-action="add" data-id="' + escapeHtml(r.slug) +
          '" data-name="' + escapeHtml(r.name) + '" data-note="Rental">Add to quote</button>' +
        "</article>";
    }).join("");

    return crumbs([{ label: "Home", href: "#/" }, { label: "Rentals" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="section-head"><div><h1>Rent instead of buy</h1>' +
        "<p>Flexible monthly rentals for recovery, short-term needs or trying before you buy — delivered across the GTA.</p></div></div>" +
        '<div class="col-grid">' + cards + "</div>" +
        '<div class="cta-band" style="margin-top:2rem"><h2>Ready to arrange a rental?</h2>' +
        "<p>Add what you need to your quote and we’ll confirm availability, delivery and pricing.</p>" +
        '<div class="cta-actions"><a class="btn btn-accent btn-lg" href="#/quote">Request a quote</a>' + phoneCta("btn-outline btn-lg") + "</div></div>" +
      "</div></section>";
  }

  function renderRepairs() {
    var equip = REPAIRS.equipment.map(function (e) { return "<li>" + escapeHtml(e) + "</li>"; }).join("");
    var services = REPAIRS.services.map(function (s) {
      return '<div class="feature"><h3>' + escapeHtml(s.title) + "</h3><p>" + escapeHtml(s.text) + "</p></div>";
    }).join("");

    return crumbs([{ label: "Home", href: "#/" }, { label: "Repairs & Maintenance" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        "<h1>" + escapeHtml(REPAIRS.heading) + "</h1>" +
        '<p class="lead">' + escapeHtml(REPAIRS.intro) + "</p>" +
        '<div class="assess-note">We service <strong>' + REPAIRS.equipment.join(", ").toLowerCase() +
          "</strong> and more. Not sure if we cover your device? Just ask.</div>" +
        '<div class="feature-grid">' + services + "</div>" +
        '<div class="cta-band" style="margin-top:2rem"><h2>Need a repair?</h2>' +
        "<p>Call us 7 days a week and we’ll get you booked in — with loaner equipment available while yours is serviced.</p>" +
        '<div class="cta-actions">' + phoneCta("btn-accent btn-lg") +
          '<a class="btn btn-outline btn-lg" href="#/contact">Send a message</a></div></div>' +
      "</div></section>";
  }

  function renderIndustries() {
    var segs = INDUSTRIES.segments.map(function (s) {
      return '<div class="feature"><h3>' + escapeHtml(s.name) + "</h3><p>" + escapeHtml(s.text) + "</p></div>";
    }).join("");

    return crumbs([{ label: "Home", href: "#/" }, { label: "Industries We Serve" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        "<h1>" + escapeHtml(INDUSTRIES.heading) + "</h1>" +
        '<p class="lead">' + escapeHtml(INDUSTRIES.intro) + "</p>" +
        '<div class="feature-grid">' + segs + "</div>" +
        '<div class="cta-band" style="margin-top:2rem"><h2>Work with Help Mobility</h2>' +
        "<p>Partner with us for reliable equipment, same-day delivery and ongoing maintenance for the people in your care.</p>" +
        '<div class="cta-actions"><a class="btn btn-accent btn-lg" href="#/contact">Become a partner</a>' + phoneCta("btn-outline btn-lg") + "</div></div>" +
      "</div></section>";
  }

  function renderFunding() {
    var cards = FUNDING.map(function (f) {
      return '<div class="feature"><h3>' + escapeHtml(f.name) + "</h3><p>" + escapeHtml(f.text) + "</p></div>";
    }).join("");

    return crumbs([{ label: "Home", href: "#/" }, { label: "Funding & Assistance" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        "<h1>Funding &amp; assistance programs</h1>" +
        '<p class="lead">You may not have to pay full price for the equipment you need. Help Mobility helps you understand and apply for the programs you qualify for.</p>' +
        '<div class="feature-grid">' + cards + "</div>" +
        '<p class="fine muted" style="margin-top:1rem">Eligibility and coverage are set by each program. We’ll help you find the right fit for your situation.</p>' +
        '<div class="cta-band" style="margin-top:1.6rem"><h2>Find out what you qualify for</h2>' +
        "<p>Tell us a little about your needs and we’ll guide you through your funding options.</p>" +
        '<div class="cta-actions"><a class="btn btn-accent btn-lg" href="#/contact">Ask about funding</a>' + phoneCta("btn-outline btn-lg") + "</div></div>" +
      "</div></section>" + faqSection();
  }

  function field(name, label, type, required, autocomplete) {
    return '<div class="field"><label for="f-' + name + '">' + escapeHtml(label) +
      (required ? ' <span class="req" aria-hidden="true">*</span>' : "") + "</label>" +
      "<" + (type === "textarea" ? 'textarea id="f-' + name + '" name="' + name + '" rows="3"' :
             'input id="f-' + name + '" name="' + name + '" type="' + type + '"') +
      (required ? " required" : "") + ' autocomplete="' + (autocomplete || "on") + '">' +
      (type === "textarea" ? "</textarea>" : "") +
      '<span class="error-msg" role="alert">Please enter your ' + escapeHtml(label.toLowerCase()) + ".</span></div>";
  }

  function requestForm(type) {
    // type: "quote" (carries the interest list) or "contact" (general enquiry)
    var heading = type === "contact" ? "Send us a message" : "Request your quote";
    var sub = type === "contact"
      ? "Questions about products, rentals, repairs or funding? We’ll get back to you, usually the same day."
      : "Send your list and we’ll reply with a personalized quote — buy or rent. No obligation.";
    return '' +
      '<form id="request-form" novalidate data-type="' + type + '">' +
        "<h2>" + heading + "</h2>" +
        '<p class="muted" style="margin-top:-.3rem">' + sub + "</p>" +
        '<div class="form-grid">' +
          field("name", "Full name", "text", true, "name") +
          field("phone", "Phone", "tel", true, "tel") +
          field("email", "Email", "email", true, "email") +
          field("postal", "Postal code", "text", false, "postal-code") +
          '<div class="field"><label for="f-interest">I’m interested in</label>' +
            '<select id="f-interest" name="interest">' +
              "<option>Buying</option><option>Renting</option><option>Repair / maintenance</option>" +
              "<option>Funding &amp; assistance</option><option selected>Not sure — please advise</option>" +
            "</select></div>" +
          '<div class="field"><label for="f-contact">Best way to reach me</label>' +
            '<select id="f-contact" name="contact"><option>Phone call</option><option>Text message</option><option>Email</option></select></div>' +
          '<div class="field full"><label for="f-msg">How can we help? <span class="muted">(optional)</span></label>' +
            '<textarea id="f-msg" name="message" rows="3" placeholder="e.g. stairs have a turn, needed within 2 weeks, ADP funding question…"></textarea></div>' +
        "</div>" +
        '<div class="form-actions">' +
          '<button type="submit" class="btn btn-primary btn-lg">' + (type === "contact" ? "Send message" : "Send quote request") + "</button>" +
          phoneCta("btn-ghost") +
        "</div>" +
        '<p class="fine muted" style="margin-top:.8rem">We use your details only to respond to your request and never share them. By submitting you agree to be contacted about your enquiry.</p>' +
      "</form>";
  }

  function renderQuote() {
    var list;
    if (!quote.length) {
      list = '<div class="empty-state"><div class="e" aria-hidden="true">📝</div><h2>Your quote list is empty</h2>' +
        '<p class="muted">Browse the catalogue and add anything you’re interested in — buying or renting — then send it to us for a personalized quote.</p>' +
        '<a class="btn btn-primary btn-lg" href="#/shop">Browse products</a></div>';
      return crumbs([{ label: "Home", href: "#/" }, { label: "Quote request" }]) +
        '<section class="section" style="padding-top:1.4rem"><div class="container">' + list + "</div></section>";
    }
    var items = quote.map(function (i) {
      return '<div class="q-item"><div><div class="q-name">' + escapeHtml(i.name) + "</div>" +
        (i.note ? '<div class="q-note">' + escapeHtml(i.note) + "</div>" : "") + "</div>" +
        '<button class="link-danger" data-action="remove" data-id="' + escapeHtml(i.id) +
        '" data-note="' + escapeHtml(i.note) + '">Remove</button></div>';
    }).join("");

    return crumbs([{ label: "Home", href: "#/" }, { label: "Quote request" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="section-head"><div><h1>Your quote request</h1><p>Review your list, then send it for a personalized quote.</p></div>' +
        '<button class="btn btn-ghost btn-sm" data-action="clear-quote">Clear list</button></div>' +
        '<div class="quote-grid">' +
          '<aside class="q-list"><h2>' + quote.length + " item" + (quote.length === 1 ? "" : "s") + "</h2>" + items + "</aside>" +
          '<div class="q-form">' + requestForm("quote") + "</div>" +
        "</div>" +
      "</div></section>";
  }

  function renderContact() {
    return crumbs([{ label: "Home", href: "#/" }, { label: "Contact" }]) +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="quote-grid">' +
          '<div class="q-form">' + requestForm("contact") + "</div>" +
          '<aside class="contact-aside">' +
            "<h2>Talk to us</h2>" +
            '<p class="contact-line">' + ico("phone") + ' <a href="' + COMPANY.phoneHref + '">' + escapeHtml(COMPANY.phone) + "</a></p>" +
            '<p class="muted">Available 7 days a week.</p>' +
            '<p class="contact-line">' + ico("mail") + ' <a href="mailto:' + escapeHtml(COMPANY.email) + '">' + escapeHtml(COMPANY.email) + "</a></p>" +
            '<p class="contact-line">' + ico("pin") + ' <a href="' + COMPANY.mapHref + '" target="_blank" rel="noopener">' + escapeHtml(COMPANY.addressText) + "</a></p>" +
            '<div class="assess-note" style="margin-top:1.2rem">Prefer to browse first? <a href="#/shop">Explore our products</a> and add items to your quote as you go.</div>' +
          "</aside>" +
        "</div>" +
      "</div></section>";
  }

  // Build a prefilled email to the business (real lead-delivery fallback).
  function buildMailto(lead) {
    var c = lead.customer || {};
    var lines = ["New " + (lead.type || "quote") + " request — " + lead.ref, ""];
    if (c.name) lines.push("Name: " + c.name);
    if (c.phone) lines.push("Phone: " + c.phone);
    if (c.email) lines.push("Email: " + c.email);
    if (c.postal) lines.push("Postal code: " + c.postal);
    if (c.interest) lines.push("Interested in: " + c.interest);
    if (c.contact) lines.push("Preferred contact: " + c.contact);
    if (c.message) { lines.push(""); lines.push("Message: " + c.message); }
    if (lead.items && lead.items.length) {
      lines.push("", "Items:");
      lead.items.forEach(function (it) { lines.push("- " + it.name + (it.note ? " (" + it.note + ")" : "")); });
    }
    return "mailto:" + COMPANY.email + "?subject=" + encodeURIComponent("Quote request " + lead.ref) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function renderSent(ref) {
    var lead = getLead(ref);
    var recap = "";
    if (lead && lead.items && lead.items.length) {
      recap = '<div class="quote-recap"><h3>Your list</h3>' + lead.items.map(function (it) {
        return '<div class="line"><span>' + escapeHtml(it.name) + "</span><span class=\"muted\">" + escapeHtml(it.note || "") + "</span></div>";
      }).join("") + "</div>";
    }
    var firstName = lead && lead.customer && lead.customer.name ? lead.customer.name.split(" ")[0] : "";
    var headline = lead && lead.type === "contact" ? "Your message is on its way!" : "Your quote request is in!";

    return '<div class="container"><section class="section"><div class="confirm">' +
      '<div class="check" aria-hidden="true">✓</div>' +
      "<h1>" + escapeHtml(headline) + "</h1>" +
      "<p>Thank you" + (firstName ? ", " + escapeHtml(firstName) : "") +
        "! A Help Mobility specialist will reach out " +
        (lead && lead.customer ? "via " + escapeHtml((lead.customer.contact || "phone").toLowerCase()) : "shortly") +
        ", usually the same day.</p>" +
      '<div class="ref-box">Reference: ' + escapeHtml(ref || "—") + "</div>" +
      recap +
      '<div class="confirm-actions">' +
        '<a class="btn btn-primary" href="#/shop">Continue browsing</a>' +
        (lead ? '<a class="btn btn-ghost" href="' + buildMailto(lead) + '">✉️ Email a copy to us</a>' : "") +
        phoneCta("btn-ghost") +
      "</div>" +
      '<p class="fine muted" style="margin-top:1rem">This demo stores your request in your browser. Connect a form endpoint or email service to receive leads automatically — see the project README.</p>' +
    "</div></section></div>";
  }

  /* ------------------------------------------------------------------ render */
  var ROUTES = {
    "/": { fn: renderHome, title: "Help Mobility — Mobility & Home Healthcare (GTA)", nav: "home" },
    "/shop": { fn: function (p) { return renderShop(p); }, title: "Products · Help Mobility", nav: "shop" },
    "/rentals": { fn: renderRentals, title: "Rentals · Help Mobility", nav: "rentals" },
    "/repairs": { fn: renderRepairs, title: "Repairs & Maintenance · Help Mobility", nav: "repairs" },
    "/industries": { fn: renderIndustries, title: "Industries We Serve · Help Mobility", nav: "industries" },
    "/funding": { fn: renderFunding, title: "Funding & Assistance · Help Mobility", nav: "funding" },
    "/contact": { fn: renderContact, title: "Contact · Help Mobility", nav: "contact" },
    "/quote": { fn: renderQuote, title: "Quote request · Help Mobility", nav: "quote" },
    "/sent": { fn: function (p) { return renderSent(p.ref); }, title: "Request received · Help Mobility", nav: "" }
  };

  function render() {
    var route = parseHash();
    var def = ROUTES[route.path] || ROUTES["/"];
    var view = document.getElementById("view");

    view.innerHTML = def.fn(route.params);
    document.title = def.title;

    // active nav
    var active = def.nav;
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      var on = a.getAttribute("data-nav") === active;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });

    var nav = document.getElementById("mainnav"); if (nav) nav.classList.remove("open");
    var toggle = document.querySelector('[data-action="nav-toggle"]');
    if (toggle) toggle.setAttribute("aria-expanded", "false");

    updateQuoteBadge();
    if (!route.params.keepscroll) window.scrollTo(0, 0);
    // move focus to main heading for screen-reader users on route change
    var h = view.querySelector("h1, h2"); if (h) { h.setAttribute("tabindex", "-1"); }
  }

  /* ------------------------------------------------------------------ events */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");

    if (action === "nav-toggle") {
      var nav = document.getElementById("mainnav");
      var open = nav && nav.classList.toggle("open");
      el.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (action === "add") {
      e.preventDefault();
      var name = el.getAttribute("data-name");
      var added = addItem(el.getAttribute("data-id"), name, el.getAttribute("data-note"));
      if (added) {
        toast('<span class="e" aria-hidden="true">✅</span><span>Added <strong>' + escapeHtml(name) +
          '</strong> to your quote. <a href="#/quote">View list &rarr;</a></span>');
      } else {
        toast('<span class="e" aria-hidden="true">👍</span><span><strong>' + escapeHtml(name) + "</strong> is already on your list.</span>");
      }
      return;
    }
    if (action === "remove") {
      removeItem(el.getAttribute("data-id"), el.getAttribute("data-note"));
      render();
      return;
    }
    if (action === "clear-quote") { clearQuote(); render(); return; }
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "search-form") {
      e.preventDefault();
      var input = e.target.querySelector("input[name=q]");
      go("/shop?q=" + encodeURIComponent((input.value || "").trim()));
      if (input) input.blur();
      return;
    }
    if (e.target.id === "request-form") {
      e.preventDefault();
      handleRequestSubmit(e.target);
      return;
    }
    if (e.target.id === "callback-form") {
      e.preventDefault();
      handleCallbackSubmit(e.target);
      return;
    }
  });

  function handleCallbackSubmit(form) {
    var name = (form.querySelector("[name=name]").value || "").trim();
    var phone = (form.querySelector("[name=phone]").value || "").trim();
    var err = form.querySelector("#cb-error");
    var nameOk = name.length >= 2;
    var phoneOk = phone.replace(/[^0-9]/g, "").length >= 10;
    if (!nameOk || !phoneOk) {
      if (err) err.textContent = !nameOk ? "Please enter your name." : "Please enter a valid phone number.";
      form.querySelector(!nameOk ? "[name=name]" : "[name=phone]").focus();
      return;
    }
    var lead = {
      ref: makeRef(), type: "callback", date: new Date().toISOString(),
      customer: { name: name, phone: phone, contact: "Phone call" }, items: []
    };
    saveLead(lead);
    postLead(lead);                                  // deliver to CONFIG.leadEndpoint if set
    track("generate_lead", { type: "callback" });    // GA4 conversion (if CONFIG.gaId set)
    var card = form.closest(".callback-card") || form.parentNode;
    card.innerHTML = '<div class="cb-success"><div class="check" aria-hidden="true">✓</div>' +
      "<h2>Thanks, " + escapeHtml(name.split(" ")[0]) + "!</h2>" +
      "<p>We’ll call you at <strong>" + escapeHtml(phone) + "</strong> shortly. Your reference is <strong>" + escapeHtml(lead.ref) + "</strong>.</p></div>";
    toast('<span class="e" aria-hidden="true">✅</span><span>Got it — we’ll call you back shortly.</span>');
  }

  function handleRequestSubmit(form) {
    var type = form.getAttribute("data-type");
    var get = function (n) { var el = form.querySelector("[name=" + n + "]"); return el ? el.value.trim() : ""; };
    var valid = true;

    function check(name, ok) {
      var input = form.querySelector("[name=" + name + "]");
      if (!input) return;
      var fieldEl = input.closest(".field");
      if (fieldEl) fieldEl.classList.toggle("invalid", !ok);
      if (!ok && valid) input.focus();
      if (!ok) valid = false;
    }
    var name = get("name"), phone = get("phone"), email = get("email");
    check("email", /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));
    check("phone", phone.replace(/[^0-9]/g, "").length >= 10);
    check("name", name.length >= 2);

    if (!valid) { toast('<span class="e" aria-hidden="true">⚠️</span><span>Please complete the highlighted fields.</span>'); return; }

    var lead = {
      ref: makeRef(),
      type: type,
      date: new Date().toISOString(),
      customer: {
        name: name, phone: phone, email: email,
        postal: get("postal"), interest: get("interest"), contact: get("contact"), message: get("message")
      },
      items: type === "quote" ? quote.slice() : []
    };
    saveLead(lead);
    postLead(lead);                              // deliver to CONFIG.leadEndpoint if set
    track("generate_lead", { type: type });      // GA4 conversion (if CONFIG.gaId set)

    if (type === "quote") clearQuote();
    go("/sent?ref=" + encodeURIComponent(lead.ref));
  }

  /* ------------------------------------------------------------------ boot */
  // Track click-to-call as a conversion (phone is the #1 action for this audience).
  document.addEventListener("click", function (e) {
    var tel = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (tel) track("contact", { method: "phone" });
  });

  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", function () {
    initAnalytics();
    var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
    updateQuoteBadge();
    render();

    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("service-worker.js").catch(function () {});
    }
  });

  // console helper for store owners to export captured leads during testing
  window.HM.exportLeads = function () {
    try { return JSON.parse(localStorage.getItem(LEADS_KEY)) || []; } catch (e) { return []; }
  };
})();
