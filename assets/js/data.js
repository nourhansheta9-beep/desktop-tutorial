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
    email: null, // Help Mobility publishes no public email — contact is by phone or form.
    currency: "CAD"
  };

  // Top value propositions — each grounded in real site content
  // (three core services, GTA coverage, funding help, 7-day service).
  var VALUES = [
    { icon: "🛒", title: "Sales, rentals & repairs", text: "Buy, rent or repair mobility and home-healthcare equipment — all in one place." },
    { icon: "📍", title: "Serving the GTA", text: "Home-healthcare solutions delivered across the Greater Toronto Area." },
    { icon: "🤝", title: "Funding & assistance", text: "We help you navigate ADP, ODSP, WSIB and other funding programs." },
    { icon: "🛟", title: "Service 7 days a week", text: "Same-day repairs and loaner equipment keep you moving when it matters." }
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
})();
