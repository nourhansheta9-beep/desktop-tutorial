/*
 * Help Mobility — Storefront application
 * --------------------------------------
 * Vanilla JS single-page app (hash routing, no build step, runs from file://
 * or any static host). Conversion-focused: browse → choose buy/rent →
 * request a quote / book a free assessment (captures the lead).
 */
(function () {
  "use strict";

  var HM = window.HM || {};
  var COMPANY = HM.COMPANY, CATEGORIES = HM.CATEGORIES, PRODUCTS = HM.PRODUCTS, TESTIMONIALS = HM.TESTIMONIALS;

  var CART_KEY = "hm_cart_v1";
  var LEADS_KEY = "hm_quotes_v1";

  /* ------------------------------------------------------------------ utils */
  function money(n) {
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
  }
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function catName(id) { var c = CATEGORIES.filter(function (c) { return c.id === id; })[0]; return c ? c.name : ""; }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }
  function stars(rating) {
    var full = Math.round(rating);
    return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
  }
  function priceLabel(p) {
    return (p.from ? '<span class="from">from </span>' : "") + money(p.price);
  }

  /* ------------------------------------------------------------------ cart */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
    updateCartBadge();
  }
  var cart = loadCart();

  function cartCount() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function findLine(id, mode) {
    for (var i = 0; i < cart.length; i++) if (cart[i].id === id && cart[i].mode === mode) return cart[i];
    return null;
  }
  function addToCart(id, mode, qty) {
    var p = byId(id); if (!p) return;
    if (mode === "rent" && !p.rent) mode = "buy";
    var line = findLine(id, mode);
    if (line) line.qty += qty; else cart.push({ id: id, mode: mode, qty: qty });
    saveCart(cart);
  }
  function setQty(id, mode, qty) {
    var line = findLine(id, mode); if (!line) return;
    line.qty = Math.max(0, qty);
    if (line.qty === 0) cart = cart.filter(function (l) { return l !== line; });
    saveCart(cart);
  }
  function removeLine(id, mode) {
    cart = cart.filter(function (l) { return !(l.id === id && l.mode === mode); });
    saveCart(cart);
  }
  function clearCart() { cart = []; saveCart(cart); }

  function cartTotals() {
    var t = { buy: 0, rent: 0, buyCount: 0, rentCount: 0 };
    cart.forEach(function (l) {
      var p = byId(l.id); if (!p) return;
      if (l.mode === "rent" && p.rent) { t.rent += p.rent * l.qty; t.rentCount += l.qty; }
      else { t.buy += p.price * l.qty; t.buyCount += l.qty; }
    });
    return t;
  }

  function updateCartBadge() {
    var el = document.getElementById("cart-count");
    if (!el) return;
    var n = cartCount();
    el.textContent = n;
    el.hidden = n === 0;
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
      var all = JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
      return all.filter(function (l) { return l.ref === ref; })[0] || null;
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

  /* ------------------------------------------------------------------ router */
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

  /* ------------------------------------------------------------------ views */
  function productCard(p) {
    var badge = p.popular ? '<span class="badge">★ Popular</span>' : "";
    var rentBadge = p.rent ? '<span class="badge rentbuy">Rent or Buy</span>' : "";
    var rentNote = p.rent ? '<div class="rent-note">or rent ' + money(p.rent) + "/mo</div>" : "";
    return '' +
      '<article class="card">' +
        '<a class="thumb cat-' + p.cat + '" href="#/product/' + p.id + '" aria-label="' + escapeHtml(p.name) + '">' +
          badge + rentBadge + "<span>" + p.emoji + "</span>" +
        "</a>" +
        '<div class="body">' +
          '<div class="cat-tag">' + escapeHtml(catName(p.cat)) + "</div>" +
          "<h3>" + escapeHtml(p.name) + "</h3>" +
          '<div class="stars">' + stars(p.rating) + ' <small>' + p.rating.toFixed(1) + " (" + p.reviews + ")</small></div>" +
          '<p class="blurb">' + escapeHtml(p.blurb) + "</p>" +
          '<div class="price-row"><span class="price">' + priceLabel(p) + "</span></div>" +
          rentNote +
          '<div class="actions">' +
            '<a class="btn btn-ghost btn-sm" href="#/product/' + p.id + '">Details</a>' +
            '<button class="btn btn-primary btn-sm" data-action="add" data-id="' + p.id + '" data-mode="buy">Add to quote</button>' +
          "</div>" +
        "</div>" +
      "</article>";
  }

  function renderHome() {
    var cats = CATEGORIES.map(function (c) {
      return '<a class="cat-card" href="#/shop?cat=' + c.id + '">' +
        '<div class="e">' + c.emoji + "</div>" +
        "<h3>" + escapeHtml(c.name) + "</h3>" +
        "<p>" + escapeHtml(c.blurb) + "</p>" +
        '<span class="more">Browse ' + escapeHtml(c.name) + " →</span>" +
      "</a>";
    }).join("");

    var featured = PRODUCTS.filter(function (p) { return p.popular; }).slice(0, 8).map(productCard).join("");

    var trust = COMPANY.trust.map(function (t) {
      return '<div class="item"><div class="e">' + t.icon + "</div><div><div class=\"t\">" +
        escapeHtml(t.title) + '</div><div class="d">' + escapeHtml(t.text) + "</div></div></div>";
    }).join("");

    var tts = TESTIMONIALS.map(function (t) {
      return '<div class="tcard"><div class="stars">' + stars(t.stars) + '</div>' +
        '<p class="q">“' + escapeHtml(t.quote) + '”</p>' +
        '<div class="who">' + escapeHtml(t.name) + '</div><div class="city">' + escapeHtml(t.city) + "</div></div>";
    }).join("");

    return '' +
      '<section class="hero"><div class="container"><div class="hero-grid">' +
        "<div>" +
          "<h1>Live <span>independently</span>, comfortably, at home.</h1>" +
          '<p class="lead">' + escapeHtml(COMPANY.promise) + " Browse, compare and request a quote in minutes — buy or rent.</p>" +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary btn-lg" href="#/shop">Shop products</a>' +
            '<a class="btn btn-accent btn-lg" href="#/assessment">Book free assessment</a>' +
          "</div>" +
          '<div class="hero-points">' +
            "<span>🍁 " + escapeHtml(COMPANY.foundedNote) + "</span>" +
            "<span>🚚 " + escapeHtml(COMPANY.region) + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="hero-art"><div class="quote-card">' +
          '<div class="big">“They gave me my home back.”</div>' +
          '<p style="margin:.6rem 0 0;color:#eaffff">Free in-home assessment, flexible buy or rent, and certified installation across the GTA.</p>' +
          '<div class="hero-mini">' +
            '<div class="tile"><span class="e">♿</span><span>Wheelchairs &amp; scooters</span></div>' +
            '<div class="tile"><span class="e">🛗</span><span>Stairlifts &amp; ramps</span></div>' +
            '<div class="tile"><span class="e">🚿</span><span>Bathroom safety</span></div>' +
            '<div class="tile"><span class="e">🛏️</span><span>Homecare beds</span></div>' +
          "</div>" +
        "</div></div>" +
      "</div></div></section>" +

      '<div class="container"><div class="trust">' + trust + "</div></div>" +

      '<section class="section"><div class="container">' +
        '<div class="section-head"><div><h2>Shop by need</h2><p>Everything for comfort, safety and independence at home.</p></div>' +
        '<a class="btn btn-ghost" href="#/shop">View all products</a></div>' +
        '<div class="cat-grid">' + cats + "</div>" +
      "</div></section>" +

      '<section class="section alt"><div class="container">' +
        '<div class="section-head"><div><h2>Most requested</h2><p>Popular picks our GTA customers choose most.</p></div>' +
        '<a class="btn btn-ghost" href="#/shop?sort=popular">See more →</a></div>' +
        '<div class="product-grid">' + featured + "</div>" +
      "</div></section>" +

      '<section class="section"><div class="container">' +
        '<div class="section-head"><div><h2>Families trust Help Mobility</h2><p>Real outcomes across the Greater Toronto Area.</p></div></div>' +
        '<div class="tgrid">' + tts + "</div>" +
      "</div></section>" +

      '<section class="section"><div class="container"><div class="cta-band">' +
        "<h2>Not sure what you need?</h2>" +
        "<p>Book a free, no-pressure in-home assessment. We measure your space, recommend the right solution and give you a clear quote — buy or rent.</p>" +
        '<div class="cta-actions">' +
          '<a class="btn btn-accent btn-lg" href="#/assessment">Book free assessment</a>' +
          '<a class="btn btn-outline btn-lg" href="' + COMPANY.phoneHref + '">📞 Call ' + escapeHtml(COMPANY.phone) + "</a>" +
        "</div>" +
      "</div></div></section>";
  }

  function renderShop(params) {
    var q = (params.q || "").trim().toLowerCase();
    var cat = params.cat || "all";
    var mode = params.mode || "all";     // all | buy | rent
    var sort = params.sort || "featured";

    var list = PRODUCTS.slice();
    if (cat !== "all") list = list.filter(function (p) { return p.cat === cat; });
    if (mode === "rent") list = list.filter(function (p) { return !!p.rent; });
    if (q) list = list.filter(function (p) {
      return (p.name + " " + p.blurb + " " + catName(p.cat) + " " + p.features.join(" ")).toLowerCase().indexOf(q) !== -1;
    });

    if (sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    else if (sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    else if (sort === "rating") list.sort(function (a, b) { return b.rating - a.rating; });
    else if (sort === "popular") list.sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); });

    function catChip(id, label) {
      return '<button class="chip' + (cat === id ? " active" : "") + '" data-action="filter-cat" data-cat="' + id + '">' + escapeHtml(label) + "</button>";
    }
    var chips = catChip("all", "All") + CATEGORIES.map(function (c) { return catChip(c.id, c.emoji + " " + c.name); }).join("");

    var title = cat === "all" ? "All products" : catName(cat);
    var grid = list.length
      ? '<div class="product-grid">' + list.map(productCard).join("") + "</div>"
      : '<div class="empty-state"><div class="e">🔎</div><h3>No matching products</h3>' +
        '<p class="muted">Try a different search or category.</p>' +
        '<a class="btn btn-primary" href="#/shop">Show all products</a></div>';

    return '' +
      '<div class="container"><div class="crumbs"><a href="#/">Home</a> / Shop' + (cat !== "all" ? " / " + escapeHtml(title) : "") + "</div></div>" +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="section-head"><div><h2>' + escapeHtml(title) + "</h2>" +
          '<p class="result-count">' + list.length + " product" + (list.length === 1 ? "" : "s") +
          (q ? ' for “' + escapeHtml(q) + "”" : "") + "</p></div></div>" +

        '<div class="toolbar">' +
          '<div class="chips">' + chips + "</div>" +
          '<div class="spacer"></div>' +
          '<label for="f-mode">Show</label>' +
          '<select id="f-mode" data-action="filter-mode">' +
            '<option value="all"' + (mode === "all" ? " selected" : "") + ">Buy &amp; rent</option>" +
            '<option value="rent"' + (mode === "rent" ? " selected" : "") + ">Rentals only</option>" +
          "</select>" +
          '<label for="f-sort">Sort</label>' +
          '<select id="f-sort" data-action="filter-sort">' +
            '<option value="featured"' + (sort === "featured" ? " selected" : "") + ">Featured</option>" +
            '<option value="popular"' + (sort === "popular" ? " selected" : "") + ">Most popular</option>" +
            '<option value="price-asc"' + (sort === "price-asc" ? " selected" : "") + ">Price: low to high</option>" +
            '<option value="price-desc"' + (sort === "price-desc" ? " selected" : "") + ">Price: high to low</option>" +
            '<option value="rating"' + (sort === "rating" ? " selected" : "") + ">Top rated</option>" +
          "</select>" +
        "</div>" +
        grid +
      "</div></section>";
  }

  // local UI state for the product detail buy box
  var pd = { id: null, mode: "buy", qty: 1 };

  function pdBuyBox() {
    var p = byId(pd.id); if (!p) return "";
    var unit = pd.mode === "rent" && p.rent ? p.rent : p.price;
    var suffix = pd.mode === "rent" ? "/mo" : "";
    var toggle = p.rent
      ? '<div class="mode-toggle" role="group" aria-label="Buy or rent">' +
          '<button class="' + (pd.mode === "buy" ? "active" : "") + '" data-action="pd-mode" data-mode="buy">Buy</button>' +
          '<button class="' + (pd.mode === "rent" ? "active" : "") + '" data-action="pd-mode" data-mode="rent">Rent / mo</button>' +
        "</div>"
      : "";
    return '' +
      '<div class="pd-price">' + (p.from && pd.mode === "buy" ? '<span class="from">from </span>' : "") + money(unit) + suffix + "</div>" +
      toggle +
      '<div class="pd-buy">' +
        '<div class="qty" aria-label="Quantity">' +
          '<button data-action="pd-qty" data-dir="-1" aria-label="Decrease quantity">−</button>' +
          "<span>" + pd.qty + "</span>" +
          '<button data-action="pd-qty" data-dir="1" aria-label="Increase quantity">+</button>' +
        "</div>" +
        '<button class="btn btn-primary btn-lg" data-action="pd-add">Add to quote</button>' +
      "</div>";
  }

  function renderProduct(id) {
    var p = byId(id);
    if (!p) return '<div class="container"><div class="empty-state"><div class="e">🤷</div><h3>Product not found</h3><a class="btn btn-primary" href="#/shop">Back to shop</a></div></div>';
    pd = { id: id, mode: "buy", qty: 1 };

    var feats = p.features.map(function (f) { return "<li>" + escapeHtml(f) + "</li>"; }).join("");
    var related = PRODUCTS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4).map(productCard).join("");

    return '' +
      '<div class="container"><div class="crumbs"><a href="#/">Home</a> / <a href="#/shop?cat=' + p.cat + '">' + escapeHtml(catName(p.cat)) + "</a> / " + escapeHtml(p.name) + "</div></div>" +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="pd-grid">' +
          '<div class="pd-media cat-' + p.cat + '" aria-hidden="true">' + p.emoji + "</div>" +
          '<div class="pd-info">' +
            '<div class="cat-tag">' + escapeHtml(catName(p.cat)) + "</div>" +
            "<h1>" + escapeHtml(p.name) + "</h1>" +
            '<div class="stars">' + stars(p.rating) + ' <small>' + p.rating.toFixed(1) + " · " + p.reviews + " reviews</small></div>" +
            "<p>" + escapeHtml(p.blurb) + "</p>" +
            '<div id="pd-buybox">' + pdBuyBox() + "</div>" +
            "<ul class=\"pd-features\">" + feats + "</ul>" +
            '<div class="assess-note">🏠 <strong>Free in-home assessment included.</strong> Our GTA team confirms the right fit, handles delivery &amp; installation, and your quote covers everything — no surprises.</div>' +
          "</div>" +
        "</div>" +
        (related ? '<div class="section-head" style="margin-top:2.4rem"><h2>You may also like</h2></div><div class="product-grid">' + related + "</div>" : "") +
      "</div></section>" +
      // sticky mobile bar
      '<div class="mobilebar"><span class="price">' + (p.rent ? money(p.rent) + "/mo or " : "") + priceLabel(p) +
        '</span><button class="btn btn-primary" data-action="pd-add">Add to quote</button></div>';
  }

  function requestForm(type) {
    // type: "quote" (has cart items) or "assessment"
    var heading = type === "assessment" ? "Book your free in-home assessment" : "Request your free quote";
    var sub = type === "assessment"
      ? "Tell us a little about your needs and we’ll arrange a no-cost visit across the GTA."
      : "Send your list and we’ll reply with a personalized quote — usually the same day.";
    return '' +
      '<form id="request-form" novalidate data-type="' + type + '">' +
        "<h3>" + heading + "</h3>" +
        '<p class="muted" style="margin-top:-.3rem">' + sub + "</p>" +
        '<div class="form-grid">' +
          field("name", "Full name", "text", true) +
          field("phone", "Phone", "tel", true) +
          field("email", "Email", "email", true) +
          field("postal", "Postal code", "text", false) +
          '<div class="field"><label for="f-interest">I’m interested in</label>' +
            '<select id="f-interest" name="interest">' +
              "<option>Buying</option><option>Renting</option><option selected>Not sure — please advise</option>" +
            "</select></div>" +
          '<div class="field"><label for="f-contact">Best way to reach me</label>' +
            '<select id="f-contact" name="contact"><option>Phone call</option><option>Text message</option><option>Email</option></select></div>' +
          '<div class="field full"><label for="f-msg">Anything we should know? <span class="muted">(optional)</span></label>' +
            '<textarea id="f-msg" name="message" rows="3" placeholder="e.g. stairs have a turn, needed within 2 weeks, mobility needs…"></textarea></div>' +
        "</div>" +
        '<div style="margin-top:1.2rem;display:flex;gap:.8rem;flex-wrap:wrap;align-items:center">' +
          '<button type="submit" class="btn btn-primary btn-lg">' + (type === "assessment" ? "Book my assessment" : "Send my quote request") + "</button>" +
          '<a class="btn btn-ghost" href="' + COMPANY.phoneHref + '">📞 Prefer to call? ' + escapeHtml(COMPANY.phone) + "</a>" +
        "</div>" +
        '<p class="fine muted" style="margin-top:.8rem">We use your details only to prepare your quote and never share them. By submitting you agree to be contacted about your request.</p>' +
      "</form>";
  }
  function field(name, label, type, required) {
    return '<div class="field"><label for="f-' + name + '">' + escapeHtml(label) +
      (required ? ' <span class="req">*</span>' : "") + "</label>" +
      '<input id="f-' + name + '" name="' + name + '" type="' + type + '"' + (required ? " required" : "") +
      ' autocomplete="' + (name === "name" ? "name" : name === "email" ? "email" : name === "phone" ? "tel" : name === "postal" ? "postal-code" : "on") + '">' +
      '<span class="error-msg">Please enter your ' + escapeHtml(label.toLowerCase()) + ".</span></div>";
  }

  function renderCart() {
    if (!cart.length) {
      return '<div class="container"><section class="section"><div class="empty-state">' +
        '<div class="e">🧾</div><h2>Your quote list is empty</h2>' +
        '<p class="muted">Add products you’re interested in — buying or renting — and we’ll send a personalized quote.</p>' +
        '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:1rem">' +
          '<a class="btn btn-primary btn-lg" href="#/shop">Browse products</a>' +
          '<a class="btn btn-accent btn-lg" href="#/assessment">Book free assessment</a>' +
        "</div></div></section></div>";
    }

    var items = cart.map(function (l) {
      var p = byId(l.id); if (!p) return "";
      var unit = l.mode === "rent" && p.rent ? p.rent : p.price;
      var modeLabel = l.mode === "rent" ? "Rental · " + money(p.rent) + "/mo" : "Purchase · " + money(p.price);
      return '<div class="cart-item">' +
        '<div class="ci-thumb cat-' + p.cat + '">' + p.emoji + "</div>" +
        "<div><div class=\"ci-name\">" + escapeHtml(p.name) + "</div>" +
          '<div class="ci-mode">' + modeLabel + "</div>" +
          '<button class="link-danger" data-action="remove" data-id="' + p.id + '" data-mode="' + l.mode + '">Remove</button></div>' +
        '<div class="ci-right">' +
          '<div class="qty"><button data-action="line-qty" data-id="' + p.id + '" data-mode="' + l.mode + '" data-dir="-1" aria-label="Decrease">−</button>' +
          "<span>" + l.qty + "</span>" +
          '<button data-action="line-qty" data-id="' + p.id + '" data-mode="' + l.mode + '" data-dir="1" aria-label="Increase">+</button></div>' +
          '<div class="price">' + money(unit * l.qty) + (l.mode === "rent" ? "/mo" : "") + "</div>" +
        "</div></div>";
    }).join("");

    var t = cartTotals();
    var summaryLines = "";
    if (t.buyCount) summaryLines += '<div class="line"><span>Purchase (' + t.buyCount + " item" + (t.buyCount === 1 ? "" : "s") + ")</span><span>" + money(t.buy) + "</span></div>";
    if (t.rentCount) summaryLines += '<div class="line"><span>Rental (' + t.rentCount + " item" + (t.rentCount === 1 ? "" : "s") + ")</span><span>" + money(t.rent) + "/mo</span></div>";

    return '' +
      '<div class="container"><div class="crumbs"><a href="#/">Home</a> / Your quote list</div></div>' +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="section-head"><div><h2>Your quote list</h2><p>Review items, then request your free personalized quote.</p></div>' +
          '<button class="btn btn-ghost btn-sm" data-action="clear-cart">Clear list</button></div>' +
        '<div class="cart-grid">' +
          '<div><div class="cart-list">' + items + "</div></div>" +
          '<aside class="summary"><h3>Estimate</h3>' + summaryLines +
            '<div class="line total"><span>Items</span><span>' + cartCount() + "</span></div>" +
            '<p class="fine">Indicative pricing only. Your personalized quote may include delivery, installation, applicable taxes and any government rebates you qualify for.</p>' +
          "</aside>" +
        "</div>" +
        '<div class="cart-grid" style="margin-top:1.6rem"><div class="summary" style="position:static">' + requestForm("quote") + "</div><div></div></div>" +
      "</div></section>";
  }

  function renderAssessment() {
    return '<div class="container"><div class="crumbs"><a href="#/">Home</a> / Free assessment</div></div>' +
      '<section class="section" style="padding-top:1.4rem"><div class="container">' +
        '<div class="cart-grid"><div class="summary" style="position:static">' + requestForm("assessment") + "</div>" +
        '<aside class="summary"><h3>What to expect</h3>' +
          '<div class="line"><span>1.</span><span>A friendly call to understand your needs</span></div>' +
          '<div class="line"><span>2.</span><span>A free home visit & measurements</span></div>' +
          '<div class="line"><span>3.</span><span>A clear written quote — buy or rent</span></div>' +
          '<div class="line"><span>4.</span><span>Professional delivery & installation</span></div>' +
          '<p class="fine">No cost, no obligation. Serving the Greater Toronto Area.</p>' +
        "</aside></div>" +
      "</div></section>";
  }

  function renderConfirm(ref) {
    var lead = getLead(ref);
    var recap = "";
    if (lead && lead.items && lead.items.length) {
      recap = '<div class="quote-recap"><h3>Your list</h3>' + lead.items.map(function (it) {
        return '<div class="line"><span>' + escapeHtml(it.name) + " × " + it.qty + (it.mode === "rent" ? " (rental)" : "") +
          "</span><span>" + money(it.lineTotal) + (it.mode === "rent" ? "/mo" : "") + "</span></div>";
      }).join("") + "</div>";
    }
    var mailto = lead ? buildMailto(lead) : "#";
    var headline = lead && lead.type === "assessment" ? "Your assessment request is in!" : "Your quote request is in!";
    return '<div class="container"><section class="section"><div class="confirm">' +
      '<div class="check">✓</div>' +
      "<h2>" + headline + "</h2>" +
      "<p>Thank you" + (lead ? ", " + escapeHtml(lead.customer.name.split(" ")[0]) : "") +
        "! A Help Mobility advisor will reach out " +
        (lead ? "via " + escapeHtml((lead.customer.contact || "phone").toLowerCase()) : "shortly") + ", usually the same day.</p>" +
      '<div class="ref-box">Reference: ' + escapeHtml(ref || "—") + "</div>" +
      recap +
      '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:1.4rem">' +
        '<a class="btn btn-primary" href="#/shop">Continue browsing</a>' +
        '<a class="btn btn-ghost" href="' + mailto + '">✉️ Email a copy to us</a>' +
        '<a class="btn btn-ghost" href="' + COMPANY.phoneHref + '">📞 ' + escapeHtml(COMPANY.phone) + "</a>" +
      "</div>" +
      '<p class="fine muted" style="margin-top:1rem">This demo stores your request in your browser. Connect a form endpoint or email service to receive leads automatically — see the project README.</p>' +
    "</div></section></div>";
  }

  function buildMailto(lead) {
    var lines = [];
    lines.push("New " + (lead.type === "assessment" ? "assessment" : "quote") + " request — " + lead.ref);
    lines.push("");
    lines.push("Name: " + lead.customer.name);
    lines.push("Phone: " + lead.customer.phone);
    lines.push("Email: " + lead.customer.email);
    if (lead.customer.postal) lines.push("Postal: " + lead.customer.postal);
    lines.push("Interested in: " + lead.customer.interest);
    lines.push("Preferred contact: " + lead.customer.contact);
    if (lead.customer.message) { lines.push(""); lines.push("Message: " + lead.customer.message); }
    if (lead.items && lead.items.length) {
      lines.push(""); lines.push("Items:");
      lead.items.forEach(function (it) {
        lines.push("- " + it.name + " x" + it.qty + (it.mode === "rent" ? " (rental/mo)" : "") + " — " + money(it.lineTotal) + (it.mode === "rent" ? "/mo" : ""));
      });
    }
    return "mailto:" + COMPANY.email + "?subject=" + encodeURIComponent("Quote request " + lead.ref) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  /* ------------------------------------------------------------------ render */
  function render() {
    var route = parseHash();
    var view = document.getElementById("view");
    var html, title = "Help Mobility";

    if (route.path === "/" ) { html = renderHome(); }
    else if (route.path === "/shop") { html = renderShop(route.params); title = "Shop · Help Mobility"; }
    else if (route.path.indexOf("/product/") === 0) {
      var pid = route.path.slice("/product/".length);
      html = renderProduct(pid);
      var pp = byId(pid); title = (pp ? pp.name + " · " : "") + "Help Mobility";
    }
    else if (route.path === "/cart") { html = renderCart(); title = "Your quote list · Help Mobility"; }
    else if (route.path === "/assessment") { html = renderAssessment(); title = "Free assessment · Help Mobility"; }
    else if (route.path === "/quote-sent") { html = renderConfirm(route.params.ref); title = "Request received · Help Mobility"; }
    else { html = renderHome(); }

    view.innerHTML = html;
    document.title = title;

    // active nav
    var navMap = { "/": "home", "/shop": "shop", "/assessment": "assessment", "/cart": "cart" };
    var active = navMap[route.path] || (route.path.indexOf("/product/") === 0 ? "shop" : "");
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === active);
    });

    // mobile sticky bar only on product pages
    document.body.classList.toggle("has-mobilebar", route.path.indexOf("/product/") === 0);
    // close mobile nav after navigation
    var nav = document.getElementById("mainnav"); if (nav) nav.classList.remove("open");

    updateCartBadge();
    if (!route.params.keepscroll) window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------------ events */
  function refreshShopParam(key, value) {
    var route = parseHash();
    var params = route.params; params[key] = value;
    var qs = Object.keys(params).filter(function (k) { return params[k] && params[k] !== "all" && k !== "keepscroll"; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); }).join("&");
    go("/shop" + (qs ? "?" + qs : ""));
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");

    if (action === "nav-toggle") {
      var nav = document.getElementById("mainnav");
      if (nav) nav.classList.toggle("open");
      el.setAttribute("aria-expanded", nav && nav.classList.contains("open") ? "true" : "false");
      return;
    }
    if (action === "add") {
      e.preventDefault();
      var p = byId(el.getAttribute("data-id"));
      addToCart(el.getAttribute("data-id"), el.getAttribute("data-mode") || "buy", 1);
      toast('<span class="e">✅</span><span>Added <strong>' + escapeHtml(p ? p.name : "item") + '</strong> to your quote. <a href="#/cart">View list →</a></span>');
      return;
    }
    if (action === "pd-mode") {
      pd.mode = el.getAttribute("data-mode");
      var box = document.getElementById("pd-buybox"); if (box) box.innerHTML = pdBuyBox();
      return;
    }
    if (action === "pd-qty") {
      pd.qty = Math.max(1, pd.qty + parseInt(el.getAttribute("data-dir"), 10));
      var box2 = document.getElementById("pd-buybox"); if (box2) box2.innerHTML = pdBuyBox();
      return;
    }
    if (action === "pd-add") {
      e.preventDefault();
      var pp = byId(pd.id);
      addToCart(pd.id, pd.mode, pd.qty);
      toast('<span class="e">✅</span><span>Added <strong>' + escapeHtml(pp ? pp.name : "item") + '</strong>' +
        (pd.mode === "rent" ? " (rental)" : "") + ' to your quote. <a href="#/cart">View list →</a></span>');
      return;
    }
    if (action === "line-qty") {
      var dir = parseInt(el.getAttribute("data-dir"), 10);
      var line = findLine(el.getAttribute("data-id"), el.getAttribute("data-mode"));
      if (line) { setQty(line.id, line.mode, line.qty + dir); render(); }
      return;
    }
    if (action === "remove") { removeLine(el.getAttribute("data-id"), el.getAttribute("data-mode")); render(); return; }
    if (action === "clear-cart") { clearCart(); render(); return; }
    if (action === "filter-cat") { refreshShopParam("cat", el.getAttribute("data-cat")); return; }
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "f-sort") refreshShopParam("sort", e.target.value);
    else if (e.target.id === "f-mode") refreshShopParam("mode", e.target.value);
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "search-form") {
      e.preventDefault();
      var input = e.target.querySelector("input[name=q]");
      go("/shop?q=" + encodeURIComponent((input.value || "").trim()));
      input.blur();
      return;
    }
    if (e.target.id === "request-form") {
      e.preventDefault();
      handleRequestSubmit(e.target);
      return;
    }
  });

  function handleRequestSubmit(form) {
    var type = form.getAttribute("data-type");
    var get = function (n) { var el = form.querySelector("[name=" + n + "]"); return el ? el.value.trim() : ""; };
    var valid = true;

    function check(name, ok) {
      var input = form.querySelector("[name=" + name + "]");
      if (!input) return;
      var fieldEl = input.closest(".field");
      if (fieldEl) fieldEl.classList.toggle("invalid", !ok);
      if (!ok && valid) { input.focus(); }
      if (!ok) valid = false;
    }
    var name = get("name"), phone = get("phone"), email = get("email");
    check("email", /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));
    check("phone", phone.replace(/[^0-9]/g, "").length >= 10);
    check("name", name.length >= 2);

    if (!valid) { toast('<span class="e">⚠️</span><span>Please fill in the highlighted fields.</span>'); return; }

    var items = cart.map(function (l) {
      var p = byId(l.id); var unit = l.mode === "rent" && p.rent ? p.rent : p.price;
      return { id: l.id, name: p.name, mode: l.mode, qty: l.qty, unit: unit, lineTotal: unit * l.qty };
    });
    var lead = {
      ref: makeRef(),
      type: type,
      date: new Date().toISOString(),
      customer: {
        name: name, phone: phone, email: email,
        postal: get("postal"), interest: get("interest"), contact: get("contact"), message: get("message")
      },
      items: type === "assessment" ? [] : items,
      totals: cartTotals()
    };
    saveLead(lead);

    /* ---- Lead delivery hook ----------------------------------------------
       This demo persists leads in localStorage. To receive leads for real,
       POST `lead` to your endpoint here, e.g.:
         fetch("/api/leads", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(lead)});
       or use Formspree / a Google Apps Script / your CRM webhook. See README.
    ----------------------------------------------------------------------- */

    if (type !== "assessment") clearCart();
    go("/quote-sent?ref=" + encodeURIComponent(lead.ref));
  }

  /* ------------------------------------------------------------------ boot */
  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", function () {
    // header year + phone
    var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
    updateCartBadge();
    render();

    // register service worker (PWA) — only over http(s), not file://
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("service-worker.js").catch(function () {});
    }
  });

  // expose a tiny console helper for store owners to export captured leads
  window.HM.exportLeads = function () {
    try { return JSON.parse(localStorage.getItem(LEADS_KEY)) || []; } catch (e) { return []; }
  };
})();
