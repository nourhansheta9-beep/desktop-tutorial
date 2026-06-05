/*
 * Help Mobility — site content & data
 * -----------------------------------
 * Everything here reflects the REAL Help Mobility business (helpmobility.ca):
 * brand voice, mission, the four product categories with their real collections,
 * rentals, repairs, funding programs, "industries we serve" and contact details.
 *
 * Deliberately NO invented pricing, ratings or reviews — Help Mobility is a
 * consultation / quote-driven retailer, so the site captures interest and turns
 * it into a contactable lead instead of showing fabricated numbers.
 */
(function () {
  "use strict";

  var COMPANY = {
    name: "Help Mobility",
    tagline: "helping you get active, today!",
    intro: "At Help Mobility, we believe that comfort, safety, and independence should never be compromised.",
    mission: "To make home healthcare accessible, affordable, and stress-free, so you or your loved ones can focus on what truly matters: recovery and quality of life.",
    specialise: "At Help Mobility, we specialize in providing high-quality equipment that enhances comfort, safety, and independence.",
    region: "Serving the Greater Toronto Area",
    phone: "905-615-9302",
    phoneHref: "tel:+19056159302",
    email: "st@helpmobility.ca",       // from the site's privacy policy
    address: {
      line: "4161 Sladeview Crescent, Unit 8",
      city: "Mississauga", province: "ON", postal: "L5L 5R3", country: "Canada"
    },
    addressText: "4161 Sladeview Crescent, Unit 8, Mississauga, ON L5L 5R3",
    mapHref: "https://www.google.com/maps/search/?api=1&query=" +
             encodeURIComponent("Help Mobility, 4161 Sladeview Crescent Unit 8, Mississauga, ON L5L 5R3"),
    currency: "CAD"
  };

  /*
   * Integration config — fill these in to "go live" with real lead delivery
   * and analytics. Both are optional: empty = the site still works (leads are
   * stored in the browser; no analytics loaded).
   */
  var CONFIG = {
    // Paste a Formspree / Getform / Google Apps Script / CRM webhook URL here and
    // every quote, contact and callback submission is POSTed to it as JSON.
    // Quick start: create a form at https://formspree.io and paste its endpoint.
    leadEndpoint: "",
    // Paste a Google Analytics 4 Measurement ID (e.g. "G-XXXXXXX") to enable
    // analytics + conversion tracking (phone clicks and lead submissions).
    gaId: "",
    // Google Ads tag — taken from the live site (they already run Google Ads).
    // Loads gtag for remarketing + conversion tracking on every page.
    googleAdsId: "AW-740552287"
  };

  // Real customer reviews. LEAVE EMPTY until you have genuine reviews — the
  // testimonials section only appears when this has entries (no fake reviews).
  // Example: { name: "First L.", city: "Toronto, ON", stars: 5, quote: "…" }
  var REVIEWS = [];

  // Top value propositions — each grounded in real site content
  // (three core services, GTA coverage, funding help, 7-day service).
  var VALUES = [
    { icon: "tag", title: "Sales, rentals & repairs", text: "Buy, rent or repair mobility and home-healthcare equipment — all in one place." },
    { icon: "pin", title: "Serving the GTA", text: "Home-healthcare solutions delivered across the Greater Toronto Area." },
    { icon: "coins", title: "Funding & assistance", text: "We help you navigate ADP, ODSP, WSIB and other funding programs." },
    { icon: "clock", title: "Service 7 days a week", text: "Same-day repairs and loaner equipment keep you moving when it matters." }
  ];

  // Four product categories (real homepage copy) → real store collections.
  var CATEGORIES = [
    {
      id: "mobility", name: "Mobility", image: "assets/img/power-header.jpg",
      alt: "Power wheelchair with a contoured captain's seat",
      blurb: "Reliable solutions for getting around with ease. From manual and power wheelchairs to scooters and walkers, we offer mobility aids tailored to every need and lifestyle.",
      collections: [
        { slug: "type-1-standard-manual-wheelchairs", name: "Standard Manual Wheelchairs" },
        { slug: "type-2-lightweight-manual-wheelchairs", name: "Lightweight Manual Wheelchairs" },
        { slug: "type-3-manual-wheelchairs", name: "Manual Wheelchairs" },
        { slug: "type-5-dynamic-tilt-manual-wheelchairs", name: "Dynamic Tilt Wheelchairs" },
        { slug: "transport-manual-wheelchairs", name: "Transport Wheelchairs" },
        { slug: "standard-powered-wheelchairs", name: "Powered Wheelchairs" },
        { slug: "travel-powered-wheelchairs", name: "Travel Powered Wheelchairs" },
        { slug: "power-assist", name: "Power Assist" },
        { slug: "mobility-scooters", name: "Mobility Scooters" },
        { slug: "indoor-rollators", name: "Indoor Rollators" },
        { slug: "outdoor-rollators", name: "Outdoor Rollators" },
        { slug: "canes-crutches", name: "Canes & Crutches" }
      ]
    },
    {
      id: "accessibility", name: "Accessibility", image: "assets/img/lift-chair.jpg",
      alt: "Powered lift recliner that gently rises to help you stand",
      blurb: "Make spaces safer and more inclusive. Our accessibility products include ramps, lifts, transfer aids, and home modifications that remove barriers and promote freedom.",
      collections: [
        { slug: "stairlifts", name: "Stairlifts" },
        { slug: "ramps", name: "Ramps" },
        { slug: "railing", name: "Railings" },
        { slug: "automatic-door-openers", name: "Automatic Door Openers" },
        { slug: "ceiling-lifts", name: "Ceiling Lifts" },
        { slug: "floor-and-standing-lifts", name: "Floor & Standing Lifts" },
        { slug: "porch-lifts-and-vertical-lifting-platforms-vpls", name: "Porch & Platform Lifts" },
        { slug: "power-lift-recliners", name: "Power Lift Recliners" },
        { slug: "slings", name: "Slings" },
        { slug: "support-poles", name: "Support Poles" }
      ]
    },
    {
      id: "bathroom", name: "Bathroom", image: "assets/img/bathroom.jpg",
      alt: "Bathroom safety aids including grab bars and a shower seat",
      blurb: "Stay safe and confident in the most personal space. We provide grab bars, shower chairs, raised toilet seats, and other bathroom safety equipment designed for comfort and dignity.",
      collections: [
        { slug: "grab-bars", name: "Grab Bars" },
        { slug: "shower-chairs-stools", name: "Shower Chairs & Stools" },
        { slug: "toilet-seats", name: "Raised Toilet Seats" },
        { slug: "bath-lifts", name: "Bath Lifts" },
        { slug: "bathtub", name: "Bathtubs" },
        { slug: "commodes", name: "Commodes" },
        { slug: "bathroom-accessibility", name: "Bathroom Accessibility" }
      ]
    },
    {
      id: "daily", name: "Daily Living", image: "assets/img/smartdrive.jpg",
      alt: "Power-assist device that helps with everyday mobility",
      blurb: "Support for everyday tasks made easier. Our daily living aids include dressing tools, kitchen accessories, reachers, and adaptive devices that simplify routines and promote independence.",
      collections: [
        { slug: "bedroom-daily-living-products", name: "Bedroom & Daily Living" },
        { slug: "living-area-products", name: "Living Area Products" },
        { slug: "personal-care-products", name: "Personal Care" },
        { slug: "incontinence-products", name: "Incontinence Products" }
      ]
    }
  ];

  // Rent instead of buy — the real rental line-up.
  var RENTALS = [
    { slug: "hospital-bed-rental", name: "Hospital Bed Rental" },
    { slug: "wheelchair-and-transport-chair-rental", name: "Wheelchair & Transport Chair Rental" },
    { slug: "scooter-rental", name: "Mobility Scooter Rental" },
    { slug: "stairlift-rental", name: "Stairlift Rental" },
    { slug: "walker-rollator-rental", name: "Walker & Rollator Rental" },
    { slug: "lift-chair-recliner-rental", name: "Lift Chair Recliner Rental" },
    { slug: "patient-lift-sling-rental", name: "Patient Lift & Sling Rental" }
  ];

  // Repairs & maintenance — real heading, copy and service list.
  var REPAIRS = {
    heading: "Fast, reliable repairs & maintenance for your mobility equipment",
    intro: "Keep your equipment in top condition with Help Mobility's professional repair and maintenance services. From hospital beds and wheelchairs to scooters and lifts, we ensure your devices stay safe, functional, and ready when you need them.",
    equipment: ["Hospital beds", "Wheelchairs", "Scooters", "Patient lifts", "Walkers", "Rollators"],
    services: [
      { title: "Same-day repairs", text: "Available across the Greater Toronto Area." },
      { title: "Preventive maintenance", text: "Maintenance packages that help you avoid costly breakdowns." },
      { title: "Replacement guidance", text: "Honest advice if equipment can’t be repaired." },
      { title: "Loaner equipment", text: "Stay mobile with a loaner while yours is serviced." },
      { title: "7 days a week", text: "Help when you need it — not just on weekdays." },
      { title: "Certified technicians", text: "Trained technicians who service every major brand." }
    ]
  };

  // Industries we serve — real heading, intro and segments.
  var INDUSTRIES = {
    heading: "Partnering with organizations that care",
    intro: "At Help Mobility, we work closely with professionals and organizations dedicated to improving the lives of seniors and individuals with mobility challenges.",
    segments: [
      { name: "Hospitals", text: "Patient care supported with beds, lifts and mobility aids." },
      { name: "Community Therapists", text: "Specialized equipment for therapy and rehabilitation." },
      { name: "Long-Term Care Homes", text: "Equipment for residents, with same-day delivery and maintenance." },
      { name: "Retirement Homes", text: "Mobility solutions for resident comfort and independence." },
      { name: "Senior Communities", text: "Accessible-environment equipment and ongoing support." },
      { name: "Community Organizations", text: "Inclusive programs for seniors and people with disabilities." }
    ]
  };

  // Funding & assistance programs Help Mobility helps customers access.
  var FUNDING = [
    { name: "Assistive Devices Program (ADP)", text: "Ontario government program that covers part of the cost of approved mobility equipment." },
    { name: "Ontario Disability Support Program (ODSP)", text: "Support that can help fund equipment for eligible Ontarians with disabilities." },
    { name: "Ontario Works", text: "Assistive-devices coverage for people receiving Ontario Works." },
    { name: "WSIB", text: "Health-care equipment and assistive devices for approved workplace-injury claims." },
    { name: "March of Dimes Canada", text: "Home & Vehicle Modification Program for accessibility adaptations." },
    { name: "Spinal Cord Injury Ontario", text: "Equipment-access programs for people living with a spinal cord injury." }
  ];

  // "How it works" — three simple, reassuring steps (reduces purchase anxiety).
  var HOWITWORKS = [
    { step: "1", title: "Tell us what you need", text: "Call us or send a quick request. We listen to your situation — no jargon, no pressure." },
    { step: "2", title: "We recommend & handle funding", text: "We suggest the right equipment to buy or rent, and help you apply for any funding you qualify for." },
    { step: "3", title: "Delivery, setup & support", text: "We deliver and set up across the GTA — and we’re here 7 days a week for service and repairs." }
  ];

  // FAQ — answers the top objections (cost, rent, delivery, repairs, area) and helps SEO.
  var FAQ = [
    { q: "Do I have to pay full price for my equipment?", a: "Often, no. We help you access funding programs like ADP, ODSP, Ontario Works, WSIB, March of Dimes and Spinal Cord Injury Ontario, which can cover part — or all — of the cost. Ask us what you may qualify for." },
    { q: "Can I rent instead of buying?", a: "Yes. Hospital beds, wheelchairs, scooters, stairlifts, walkers, lift chairs and patient lifts are available to rent by the month — ideal for recovery or short-term needs." },
    { q: "Do you deliver and install?", a: "Yes. We deliver across the Greater Toronto Area and install equipment such as stairlifts, ramps and lifts so it’s ready to use safely." },
    { q: "Do you repair and service equipment?", a: "We do — 7 days a week, with same-day repairs across the GTA and loaner equipment available while yours is serviced." },
    { q: "Which areas do you serve?", a: "We serve the Greater Toronto Area." },
    { q: "How do I get started?", a: "Call 905-615-9302 or request a free, no-obligation quote online, and a Help Mobility specialist will help you choose." }
  ];

  // Featured equipment — real product photos, shown in a gallery on the home page.
  var FEATURED = [
    { name: "Manual Wheelchairs", note: "Lightweight & folding", img: "assets/img/wheelchair-manual.jpg", cat: "mobility" },
    { name: "Power Wheelchairs", note: "Comfort & control", img: "assets/img/power-header.jpg", cat: "mobility" },
    { name: "Folding Wheelchairs", note: "Travel with ease", img: "assets/img/wheelchair-folding.jpg", cat: "mobility" },
    { name: "Lift Recliners", note: "Stand with ease", img: "assets/img/lift-chair.jpg", cat: "accessibility" },
    { name: "Bathroom Safety", note: "Confidence & dignity", img: "assets/img/bathroom.jpg", cat: "bathroom" },
    { name: "Power Assist", note: "Go further, easier", img: "assets/img/smartdrive.jpg", cat: "mobility" }
  ];

  // Professional line icons (Feather, MIT). Inline SVG, inherit colour via currentColor.
  function _ico(p) { return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"; }
  var ICONS = {
    phone: _ico('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
    mail: _ico('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'),
    pin: _ico('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
    check: _ico('<polyline points="20 6 9 17 4 12"/>'),
    clock: _ico('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
    shield: _ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    heart: _ico('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),
    tag: _ico('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'),
    wrench: _ico('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 3 3 6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.7-.7-.7-2.7 2.3-2.3z"/>'),
    truck: _ico('<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
    coins: _ico('<circle cx="12" cy="12" r="10"/><path d="M14.8 9A2.5 2 0 0 0 12 7.6c-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2 2.6.9 2.6 2-1.1 2-2.6 2A2.5 2 0 0 1 9.2 15"/><line x1="12" y1="6" x2="12" y2="18"/>'),
    users: _ico('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    home: _ico('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    star: _ico('<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>'),
    arrow: _ico('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
    clip: _ico('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>'),
    award: _ico('<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>'),
    leaf: _ico('<path d="M11 20A7 7 0 0 1 4 13c0-6 7-11 16-11 0 9-5 16-11 16z"/><path d="M2 22c4-4 6-7 9-9"/>')
  };

  // expose on a single global namespace (no ES modules → also works from file://)
  window.HM = window.HM || {};
  window.HM.COMPANY = COMPANY;
  window.HM.VALUES = VALUES;
  window.HM.CATEGORIES = CATEGORIES;
  window.HM.RENTALS = RENTALS;
  window.HM.REPAIRS = REPAIRS;
  window.HM.INDUSTRIES = INDUSTRIES;
  window.HM.FUNDING = FUNDING;
  window.HM.HOWITWORKS = HOWITWORKS;
  window.HM.FAQ = FAQ;
  window.HM.CONFIG = CONFIG;
  window.HM.REVIEWS = REVIEWS;
  window.HM.FEATURED = FEATURED;
  window.HM.ICONS = ICONS;
})();
