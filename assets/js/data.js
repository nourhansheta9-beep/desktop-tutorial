/*
 * Help Mobility — Storefront catalog data
 * ---------------------------------------
 * Product, category and company data for the storefront.
 *
 * NOTE ON DATA: Prices and product details below are realistic *sample*
 * figures for demonstration. Help Mobility's live site is consultation-driven
 * and does not publish prices, so these are placeholders meant to be replaced
 * with your real pricing/inventory (or wired to your backend/CMS). See README.
 */
(function () {
  "use strict";

  var COMPANY = {
    name: "Help Mobility",
    tagline: "Your Trusted Partner in Home Healthcare",
    promise: "Empowering independence — comfort and safety should never be compromised.",
    region: "Serving the Greater Toronto Area",
    foundedNote: "Canadian owned & operated since 2019",
    phone: "1-800-555-0199",
    phoneHref: "tel:+18005550199",
    email: "hello@helpmobility.ca",
    currency: "CAD",
    // Conversion-focused trust points shown across the site
    trust: [
      { icon: "🍁", title: "Canadian owned since 2019", text: "A local team you can reach and trust." },
      { icon: "🏠", title: "Free in-home assessment", text: "We measure, advise and quote at no cost." },
      { icon: "🔄", title: "Buy · Rent · Service", text: "Flexible options for any budget or timeline." },
      { icon: "🛡️", title: "Insured installation", text: "Certified technicians, GTA-wide delivery." }
    ]
  };

  var CATEGORIES = [
    { id: "mobility",      name: "Mobility",          emoji: "♿", blurb: "Wheelchairs, power chairs, scooters, rollators & walking aids" },
    { id: "accessibility", name: "Home Accessibility", emoji: "🛗", blurb: "Stairlifts, ramps, porch & ceiling lifts, lift recliners, door openers" },
    { id: "bathroom",      name: "Bathroom Safety",   emoji: "🚿", blurb: "Grab bars, bath lifts, walk-in tubs, commodes & shower seating" },
    { id: "daily",         name: "Daily Living",      emoji: "🛏️", blurb: "Homecare beds, personal care and everyday independence aids" }
  ];

  // mode helpers: every product can be bought; some can also be rented monthly.
  function p(o) {
    o.rent = o.rent || null;
    o.from = o.from || false;
    o.popular = o.popular || false;
    o.rating = o.rating || 4.7;
    o.reviews = o.reviews || (12 + Math.floor(Math.random() * 120));
    return o;
  }

  var PRODUCTS = [
    // ---------------- Mobility ----------------
    p({ id: "m1", cat: "mobility", emoji: "♿", name: "Lightweight Folding Wheelchair", price: 399, rent: 60, popular: true, rating: 4.8, reviews: 214,
        blurb: "An everyday folding wheelchair under 15 kg — easy to lift into a car trunk.",
        features: ["Weighs only 14.5 kg", "Folds flat in seconds", "Flip-back desk armrests", "Puncture-proof tires"] }),
    p({ id: "m2", cat: "mobility", emoji: "♿", name: "Transport Wheelchair", price: 279, rating: 4.7, reviews: 96,
        blurb: "Compact companion chair built for quick trips and travel.",
        features: ["Ultra-light frame", "Locking hand brakes", "Removable footrests", "Carry weight 11 kg"] }),
    p({ id: "m3", cat: "mobility", emoji: "♿", name: "Foldable Power Wheelchair", price: 2499, rent: 250, popular: true, rating: 4.9, reviews: 158,
        blurb: "Electric independence that folds for travel and airline check-in.",
        features: ["Up to 20 km range", "Folds in 5 seconds", "Joystick control", "Airline-approved battery"] }),
    p({ id: "m4", cat: "mobility", emoji: "♿", name: "Heavy-Duty Power Chair", price: 3799, rating: 4.8, reviews: 64,
        blurb: "Bariatric-rated power chair with premium captain's seating.",
        features: ["Supports up to 180 kg", "Captain's seat with recline", "Up to 30 km range", "All-day comfort"] }),
    p({ id: "m5", cat: "mobility", emoji: "🚶", name: "Compact Indoor Rollator", price: 189, popular: true, rating: 4.7, reviews: 187,
        blurb: "Narrow-frame rollator that turns easily in tight hallways and doorways.",
        features: ["Padded seat & backrest", "Locking loop brakes", "Fits 60 cm doorways", "Folds upright"] }),
    p({ id: "m6", cat: "mobility", emoji: "🚶", name: "All-Terrain Outdoor Rollator", price: 329, rating: 4.6, reviews: 73,
        blurb: "Big-wheel rollator that rolls smoothly over grass, gravel and curbs.",
        features: ["25 cm air tires", "Ergonomic hand brakes", "Roomy under-seat bag", "Height adjustable"] }),
    p({ id: "m7", cat: "mobility", emoji: "🛵", name: "3-Wheel Travel Scooter", price: 1499, rent: 180, popular: true, rating: 4.8, reviews: 142,
        blurb: "Nimble travel scooter that disassembles into 5 light pieces.",
        features: ["Tight turning radius", "Disassembles in seconds", "Up to 18 km range", "Delta tiller steering"] }),
    p({ id: "m8", cat: "mobility", emoji: "🛵", name: "4-Wheel Heavy-Duty Scooter", price: 2299, rent: 220, rating: 4.7, reviews: 58,
        blurb: "Stable long-range scooter for confident outdoor errands.",
        features: ["Up to 40 km range", "Full LED lighting", "Supports up to 160 kg", "Suspension ride"] }),
    p({ id: "m9", cat: "mobility", emoji: "🦯", name: "Folding Quad Cane", price: 39, rating: 4.6, reviews: 211,
        blurb: "Self-standing quad cane that folds away when not needed.",
        features: ["Stands on its own", "Soft ergonomic grip", "Height adjustable", "Folds for travel"] }),
    p({ id: "m10", cat: "mobility", emoji: "🦯", name: "Forearm Crutches (Pair)", price: 59, rating: 4.7, reviews: 44,
        blurb: "Lightweight aluminum forearm crutches with comfortable cuffs.",
        features: ["Aluminum frame", "Contoured arm cuffs", "Non-slip tips", "Quick height adjust"] }),

    // ------------- Home Accessibility -------------
    p({ id: "a1", cat: "accessibility", emoji: "🛗", name: "Straight Stairlift", price: 3999, rent: 250, popular: true, rating: 4.9, reviews: 121,
        blurb: "Reclaim your second floor — installed on a straight staircase in hours.",
        features: ["Installs in ~3 hours", "Swivel & folding seat", "Battery backup", "Remote controls"] }),
    p({ id: "a2", cat: "accessibility", emoji: "🛗", name: "Curved Custom Stairlift", price: 9999, from: true, rating: 4.8, reviews: 37,
        blurb: "Made-to-measure rail for curved or multi-landing staircases.",
        features: ["Custom-bent rail", "Fits any curve", "Quiet smooth ride", "Free site survey"] }),
    p({ id: "a3", cat: "accessibility", emoji: "🛗", name: "Vertical Porch Lift", price: 5499, rating: 4.7, reviews: 29,
        blurb: "Outdoor platform lift for porches and decks up to 1.5 m.",
        features: ["Weatherproof build", "Anti-slip platform", "Safety sensors", "Key-lock operation"] }),
    p({ id: "a4", cat: "accessibility", emoji: "🛤️", name: "Portable Threshold Ramp", price: 129, popular: true, rating: 4.7, reviews: 168,
        blurb: "Bridges a single step or doorway threshold instantly.",
        features: ["Rubber, no install", "Non-slip surface", "Several heights", "Indoor/outdoor"] }),
    p({ id: "a5", cat: "accessibility", emoji: "🛤️", name: "Folding Aluminum Ramp (6 ft)", price: 279, rating: 4.6, reviews: 84,
        blurb: "Suitcase-style ramp for wheelchairs and scooters on the go.",
        features: ["Folds like a case", "Supports 360 kg", "Raised side rails", "Carry handle"] }),
    p({ id: "a6", cat: "accessibility", emoji: "🛗", name: "Ceiling Track Lift", price: 4200, rent: 300, rating: 4.8, reviews: 22,
        blurb: "Overhead transfer system from bed to bathroom with no floor clutter.",
        features: ["Smooth transfers", "Frees up floor space", "Includes sling", "Caregiver friendly"] }),
    p({ id: "a7", cat: "accessibility", emoji: "🚪", name: "Automatic Door Opener", price: 1200, rating: 4.7, reviews: 41,
        blurb: "Hands-free entry with a wireless push button or fob.",
        features: ["Wireless activation", "Fits most doors", "Gentle auto-close", "Battery backup"] }),
    p({ id: "a8", cat: "accessibility", emoji: "🛋️", name: "Power Lift Recliner", price: 1099, rent: 120, popular: true, rating: 4.9, reviews: 203,
        blurb: "Stand up effortlessly — the chair gently lifts you to your feet.",
        features: ["Lift-to-stand motor", "Infinite recline", "Plush heat option", "USB charging"] }),
    p({ id: "a9", cat: "accessibility", emoji: "🛗", name: "Floor / Patient Lift", price: 1899, rent: 180, rating: 4.7, reviews: 33,
        blurb: "Safe powered transfers for caregivers, anywhere in the home.",
        features: ["Powered lifting", "Wide leg base", "Includes sling", "Easy to steer"] }),
    p({ id: "a10", cat: "accessibility", emoji: "🦾", name: "Stand-Assist Support Pole", price: 249, rating: 4.6, reviews: 57,
        blurb: "Floor-to-ceiling grab pole for confident standing and transfers.",
        features: ["Tension mounted", "No permanent damage", "Rotating handle option", "Fits 2.1–2.8 m"] }),

    // ---------------- Bathroom ----------------
    p({ id: "b1", cat: "bathroom", emoji: "🛁", name: "Powered Bath Lift", price: 699, popular: true, rating: 4.8, reviews: 112,
        blurb: "Lower yourself safely into the tub and rise again at the touch of a button.",
        features: ["Lowers to tub floor", "Waterproof remote", "Suction-cup base", "Folds for storage"] }),
    p({ id: "b2", cat: "bathroom", emoji: "🛁", name: "Walk-In Safety Bathtub", price: 4999, from: true, rating: 4.8, reviews: 26,
        blurb: "Low-threshold tub with a built-in seat and grab bars for safe bathing.",
        features: ["Low step-in door", "Built-in seating", "Anti-slip floor", "Hydrotherapy option"] }),
    p({ id: "b3", cat: "bathroom", emoji: "🚽", name: "Bedside Commode", price: 89, rating: 4.6, reviews: 139,
        blurb: "3-in-1 commode that doubles as a raised seat and shower chair.",
        features: ["Height adjustable", "Removable bucket", "Padded armrests", "Folds flat"] }),
    p({ id: "b4", cat: "bathroom", emoji: "🧱", name: "Stainless Grab Bar (24\")", price: 34, popular: true, rating: 4.8, reviews: 256,
        blurb: "ADA-rated grab bar for the shower, tub or toilet area.",
        features: ["Holds up to 230 kg", "Concealed mounts", "Anti-slip knurling", "Rust-proof steel"] }),
    p({ id: "b5", cat: "bathroom", emoji: "🚿", name: "Adjustable Shower Chair", price: 69, popular: true, rating: 4.7, reviews: 174,
        blurb: "Stable, drainable shower seat with a supportive backrest.",
        features: ["Height adjustable legs", "Drainage holes", "Non-slip feet", "Tool-free assembly"] }),
    p({ id: "b6", cat: "bathroom", emoji: "🚿", name: "Shower Stool", price: 49, rating: 4.6, reviews: 88,
        blurb: "Compact backless stool for smaller showers and tubs.",
        features: ["Space-saving", "Rust-proof frame", "Soft contoured seat", "Holds up to 135 kg"] }),
    p({ id: "b7", cat: "bathroom", emoji: "🚽", name: "Raised Toilet Seat", price: 59, rating: 4.7, reviews: 121,
        blurb: "Adds height and side handles to make sitting and rising easier.",
        features: ["+10 cm height", "Locking clamp", "Padded armrests", "Tool-free fit"] }),

    // -------------- Daily Living --------------
    p({ id: "d1", cat: "daily", emoji: "🛏️", name: "Adjustable Homecare Bed", price: 1499, rent: 150, popular: true, rating: 4.8, reviews: 79,
        blurb: "Hospital-grade adjustable bed for comfort and safer caregiving at home.",
        features: ["Head & foot adjust", "Height adjustable", "Side rail compatible", "Quiet motors"] }),
    p({ id: "d2", cat: "daily", emoji: "🪑", name: "Overbed Table", price: 129, rating: 4.6, reviews: 52,
        blurb: "Tilting, height-adjustable table that rolls over bed or chair.",
        features: ["Tilting top", "Locking casters", "Height adjustable", "Easy-clean surface"] }),
    p({ id: "d3", cat: "daily", emoji: "🤏", name: "Reacher / Grabber Tool", price: 19, rating: 4.7, reviews: 233,
        blurb: "Pick up items without bending — kitchen, laundry and floor.",
        features: ["82 cm reach", "Rotating jaw", "Magnetic tip", "Lightweight"] }),
    p({ id: "d4", cat: "daily", emoji: "🧰", name: "Dressing Aid Kit", price: 29, rating: 4.6, reviews: 61,
        blurb: "Everything needed to dress independently after surgery or injury.",
        features: ["Sock aid", "Long shoehorn", "Button hook & zip pull", "Dressing stick"] }),
    p({ id: "d5", cat: "daily", emoji: "🧻", name: "Incontinence Briefs (Case)", price: 45, rating: 4.5, reviews: 97,
        blurb: "Discreet, high-absorbency protection delivered to your door.",
        features: ["Maximum absorbency", "Breathable & soft", "Secure fit tabs", "Case of 72"] }),
    p({ id: "d6", cat: "daily", emoji: "🛏️", name: "Bed Rail Assist", price: 79, rating: 4.6, reviews: 70,
        blurb: "Sturdy bedside rail for safer transfers in and out of bed.",
        features: ["Fits most beds", "Folds down", "Padded grip", "Storage pouch"] })
  ];

  var TESTIMONIALS = [
    { name: "Margaret R.", city: "Oakville, ON", stars: 5,
      quote: "The free home assessment was wonderful. They measured everything and the stairlift was installed the same week. I have my whole house back." },
    { name: "David & Anh T.", city: "Mississauga, ON", stars: 5,
      quote: "We rented a hospital bed and patient lift for my father — being able to rent instead of buy made all the difference for our family." },
    { name: "Carlos M.", city: "Toronto, ON", stars: 5,
      quote: "Ordered a power wheelchair online, got a quote back the same afternoon and it was delivered and fitted within days. Genuinely helpful people." }
  ];

  // expose on a single global namespace (no ES modules → works from file:// too)
  window.HM = window.HM || {};
  window.HM.COMPANY = COMPANY;
  window.HM.CATEGORIES = CATEGORIES;
  window.HM.PRODUCTS = PRODUCTS;
  window.HM.TESTIMONIALS = TESTIMONIALS;
})();
