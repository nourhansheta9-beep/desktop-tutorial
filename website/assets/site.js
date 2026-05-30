/* ===========================================================
   Help Mobility — shared site script (site.js)
   Accessibility toolbar · mobile menu · scroll reveal · forms
   =========================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------
     FORM CONFIG — set this ONCE to go live.
     Create a free endpoint at https://formspree.io (or Basin,
     Netlify Forms, etc.) and paste the URL below. Until then,
     forms fall back to opening the visitor's email app.
     ------------------------------------------------------- */
  var FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxxx"
  var FALLBACK_EMAIL = "info@helpmobility.ca";

  var root = document.documentElement, body = document.body, store = window.localStorage;

  /* text size */
  function setText(scale, save) {
    root.style.setProperty('--step', scale);
    document.querySelectorAll('.a11y [data-text]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-text') === String(scale) ? 'true' : 'false');
    });
    if (save !== false) { try { store.setItem('hm-text', scale); } catch (e) {} }
  }
  document.querySelectorAll('.a11y [data-text]').forEach(function (b) {
    b.addEventListener('click', function () { setText(b.getAttribute('data-text')); });
  });

  /* high contrast */
  var hcBtn = document.getElementById('hcToggle');
  function setHC(on, save) {
    body.classList.toggle('hc', on);
    if (hcBtn) hcBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (save !== false) { try { store.setItem('hm-hc', on ? '1' : '0'); } catch (e) {} }
  }
  if (hcBtn) hcBtn.addEventListener('click', function () { setHC(!body.classList.contains('hc')); });

  /* restore saved prefs */
  try {
    var t = store.getItem('hm-text'); if (t) setText(t, false);
    if (store.getItem('hm-hc') === '1') setHC(true, false);
  } catch (e) {}

  /* mobile menu */
  var mb = document.getElementById('menuBtn'), nl = document.getElementById('navlinks');
  if (mb && nl) {
    mb.addEventListener('click', function () {
      var open = nl.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nl.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* year */
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* scroll reveal */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* active nav (in-page anchors) */
  var links = Array.prototype.slice.call(document.querySelectorAll('.navlinks a[href^="#"]'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window && secs.some(Boolean)) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var i = secs.indexOf(e.target);
          if (i > -1 && links[i]) links[i].classList.add('active');
        }
      });
    }, { threshold: .5 });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }

  /* ---------- AJAX form handling ---------- */
  function statusEl(form) {
    var s = form.querySelector('.form-status');
    if (!s) {
      s = document.createElement('div');
      s.className = 'form-status';
      s.setAttribute('role', 'status');
      s.setAttribute('aria-live', 'polite');
      form.insertBefore(s, form.firstChild);
    }
    return s;
  }
  function show(s, ok, msg) {
    s.className = 'form-status show ' + (ok ? 'ok' : 'err');
    s.textContent = msg;
  }

  document.querySelectorAll('form[data-hm-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      var s = statusEl(form);

      // No endpoint configured -> graceful mailto fallback
      if (!FORM_ENDPOINT) {
        ev.preventDefault();
        var fd = new FormData(form), lines = [];
        fd.forEach(function (v, k) { if (v) lines.push(k + ': ' + v); });
        var subject = encodeURIComponent('Website enquiry: ' + (form.getAttribute('data-hm-form') || 'contact'));
        var bodyText = encodeURIComponent(lines.join('\n'));
        window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=' + subject + '&body=' + bodyText;
        show(s, true, 'Opening your email app… If nothing happens, please call us or email ' + FALLBACK_EMAIL + '.');
        return;
      }

      // AJAX submit to configured endpoint
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (r.ok) {
          form.reset();
          show(s, true, 'Thank you — we’ve received your message and will be in touch shortly.');
        } else {
          show(s, false, 'Sorry, something went wrong. Please call us or email ' + FALLBACK_EMAIL + '.');
        }
      }).catch(function () {
        show(s, false, 'Network error. Please call us or email ' + FALLBACK_EMAIL + '.');
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = orig; }
      });
    });
  });
})();
