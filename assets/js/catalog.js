/*
 * Help Mobility — product catalogue
 * ---------------------------------
 * Real product lines grouped the way the business sells them, each tagged with
 * the funding programs that typically apply (ADP / ODSP / MOD). Eligibility
 * always depends on the person & device — the site says "we help you confirm".
 *
 * IMAGES: set `img` to a real photo in assets/img/ when you have one (dealer/
 * manufacturer photos). When `img` is omitted, a clean branded illustration
 * (the `pic` icon) is shown — never an emoji.
 */
(function () {
  "use strict";
  window.HM = window.HM || {};

  // Funding programmes (short, accurate summaries)
  window.HM.FUND_INFO = {
    ADP: "Assistive Devices Program — Ontario covers up to 75% of the cost of approved mobility & seating devices.",
    ODSP: "Ontario Disability Support Program — may fund equipment for eligible recipients (mandatory/discretionary benefits).",
    MOD: "March of Dimes — Home & Vehicle Modification Program for ramps, lifts and accessibility changes."
  };

  // Product-type illustrations (line art, inherit colour). Used when no photo set.
  function _i(p) { return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"; }
  var P = {
    bed: _i('<path d="M2 18v-6a2 2 0 0 1 2-2h10a4 4 0 0 1 4 4v4"/><path d="M2 18h20"/><path d="M2 13V8"/><path d="M22 16v3"/><rect x="5" y="11.5" width="5" height="2.5" rx="1"/>'),
    walker: _i('<path d="M7 4v13M17 4v13"/><path d="M5.5 9h13"/><path d="M6 4h12"/><path d="M7 17l-2 3M17 17l2 3"/>'),
    rollator: _i('<path d="M7 4v11M17 4v11"/><path d="M5.5 9h13"/><path d="M6 4h12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
    powerchair: _i('<circle cx="8" cy="18" r="3"/><path d="M11 18h4.5a2 2 0 0 0 2-2v-3h-6l-1-4H6v4h4z"/><path d="M17.5 9H20"/>'),
    wheelchair: _i('<circle cx="11" cy="16" r="5"/><circle cx="12" cy="4" r="1.6"/><path d="M10.5 6l1 6h5l2 5"/><path d="M11.5 12H8"/>'),
    scooter: _i('<circle cx="6.5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6.5 18h8l-2-8h3"/><path d="M12.5 10V6h4"/>'),
    cushion: _i('<rect x="3" y="9" width="18" height="7" rx="3"/><path d="M3 12.5h18"/>'),
    lift: _i('<path d="M5 21V4l9 3"/><path d="M5 4h2"/><path d="M14 7a3 3 0 0 1 0 6"/><path d="M4 21h6"/><path d="M14 13v3h-3"/>'),
    ceiling: _i('<path d="M3 4h18"/><path d="M8 4v3M16 4v3"/><path d="M8 7h8l-1.5 5h-5z"/><path d="M9 12l-1 5h8l-1-5"/>'),
    stairlift: _i('<path d="M3 20h4v-4h4v-4h4v-4h6"/><rect x="4" y="13" width="5" height="4" rx="1"/>'),
    vpl: _i('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 17h8"/><path d="M12 8v6"/><path d="M9 11l3-3 3 3"/>'),
    ramp: _i('<path d="M3 19h18"/><path d="M4 19L19 7"/><path d="M19 7v12"/>'),
    railing: _i('<path d="M3 7h18"/><path d="M6 7v10M12 7v10M18 7v10"/><path d="M3 17h18"/>'),
    door: _i('<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M14 12h.01"/><path d="M3 21h18"/>'),
    grabbar: _i('<rect x="3.5" y="10.5" width="17" height="3" rx="1.5"/><path d="M6 13.5V17M18 13.5V17"/>'),
    commode: _i('<path d="M6 9h12l-1.2 6H7.2z"/><rect x="7" y="5.5" width="10" height="3" rx="1.5"/><path d="M8 15l-1 5M16 15l1 5"/>'),
    toilet: _i('<path d="M6 4h7v5a3.5 3.5 0 0 1-7 0z"/><path d="M9 14l-2 6h9l-1.5-5"/>'),
    pole: _i('<path d="M12 3v18"/><path d="M8 3h8M8 21h8"/><path d="M12 10h5a2 2 0 0 1 0 4"/>'),
    recliner: _i('<path d="M6 12V7a2 2 0 0 1 4 0v5"/><path d="M4 12h12l3 2v4H4z"/><path d="M6 18v2M17 18v2"/>'),
    bath: _i('<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M5 12V6a2 2 0 0 1 4 0"/><path d="M6 19l-1 2M18 19l1 2"/>'),
    cane: _i('<path d="M9 3a3 3 0 0 1 6 0v13a3 3 0 0 1-6 0"/><path d="M9 21h6"/>')
  };
  // merge product icons into the shared icon set
  window.HM.ICONS = Object.assign({}, window.HM.ICONS || {}, P);

  // helper to build a product
  function p(name, brand, pic, blurb, opts) {
    opts = opts || {};
    return { name: name, brand: brand || "", pic: pic, blurb: blurb || "", img: opts.img || null, funding: opts.funding || null };
  }

  window.HM.CATALOG = [
    {
      id: "beds", cat: "daily", name: "Hospital & Homecare Beds", icon: "bed",
      img: "assets/img/lifestyle.jpg",
      blurb: "Full- and semi-electric beds for safe, comfortable home recovery — delivered, assembled and adjusted for you.",
      funding: ["ODSP"],
      products: [
        p("Invacare IVC Hospital Bed", "Invacare", "bed", "Dependable semi-electric homecare bed for everyday care at home."),
        p("Invacare Etude / Etude HC", "Invacare", "bed", "Full-electric low bed — height adjusts to ease transfers and reduce fall risk."),
        p("Hälsa Bed", "Hälsa", "bed", "Comfortable, quiet homecare bed with electric head, foot and height adjustment."),
        p("Hälsa Plus Bed", "Hälsa", "bed", "Premium Hälsa bed with extended positioning and a refined home look."),
        p("Toron Care Bed", "Toron", "bed", "Reliable care bed built for long-term home and facility use."),
        p("Euro Hospital Bed", "", "bed", "Institutional-style profiling bed for clinical-grade support at home."),
        p("Bariatric Hospital Bed", "", "bed", "Reinforced, wider bed with higher weight capacity for heavier users."),
        p("Low Floor Bed", "", "bed", "Ultra-low bed that lowers close to the floor to protect against fall injuries."),
        p("Bed Rails, Trapeze & Accessories", "", "bed", "Assist rails, trapeze bars, overbed tables and pressure mattresses.")
      ]
    },
    {
      id: "walkers", cat: "mobility", name: "Walkers & Rollators", icon: "rollator",
      blurb: "From sturdy standard walkers to four-wheel rollators with a seat — the right support for your balance and stamina.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Standard Walker (no wheels)", "", "walker", "Lightweight folding frame for maximum stability — lift-and-step support."),
        p("Two-Wheel Walker", "", "walker", "Front wheels glide while rear glides grip — easier to move, still secure."),
        p("Four-Wheel Rollator", "", "rollator", "Wheels, hand brakes and a built-in seat for rest stops on longer outings."),
        p("Outdoor Rollator", "", "rollator", "Larger wheels and rugged frame for sidewalks, parks and uneven ground."),
        p("Upright / Stand-up Rollator", "", "rollator", "Forearm supports promote upright posture and reduce wrist and back strain."),
        p("Bariatric Walker", "", "walker", "Wider, reinforced frame with higher weight capacity."),
        p("Hemi Walker", "", "cane", "One-handed support — more stable than a cane, ideal after a stroke."),
        p("Knee Walker", "", "rollator", "Roll instead of hop while a foot or ankle heals — steerable with brakes.")
      ]
    },
    {
      id: "power", cat: "mobility", name: "Power Wheelchairs", icon: "powerchair",
      img: "assets/img/power-header.jpg",
      blurb: "Powered independence with comfort and control — front-, mid- and rear-wheel drive, tilt, recline and more.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Quantum Power Chairs", "Quantum / Pride", "powerchair", "Edge and 4Front series — responsive drive with iLevel® seat elevation.", { img: "assets/img/power-header.jpg" }),
        p("Sunrise / Quickie Power Chairs", "Sunrise Medical", "powerchair", "Quickie QM-7 series — precise handling and advanced power seating."),
        p("Permobil Power Chairs", "Permobil", "powerchair", "F-series and M-series — premium power positioning and all-day comfort."),
        p("Tilt & Recline Power Chair", "", "powerchair", "Power tilt, recline and legs for pressure relief and all-day positioning."),
        p("Travel / Folding Power Chair", "", "powerchair", "Lightweight, folds for the car and air travel without losing power."),
        p("Bariatric Power Chair", "", "powerchair", "Heavy-duty base and wider seating with higher weight capacity.")
      ]
    },
    {
      id: "manual", cat: "mobility", name: "Manual Wheelchairs (by Drive)", icon: "wheelchair",
      img: "assets/img/wheelchair-manual.jpg",
      blurb: "ADP funds manual wheelchairs by type — from standard to fully configured tilt-in-space. We fit the right type to you.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Type 1 — Standard Manual Wheelchair", "Drive", "wheelchair", "Everyday folding wheelchair for occasional to regular indoor/outdoor use.", { img: "assets/img/wheelchair-manual.jpg" }),
        p("Type 2 — Lightweight Manual Wheelchair", "Drive", "wheelchair", "Lighter frame — easier to propel, lift and transport.", { img: "assets/img/wheelchair-folding.jpg" }),
        p("Type 3 — High-Strength Lightweight", "Drive", "wheelchair", "Durable lightweight chair for daily, active full-time use."),
        p("Type 4 — Rigid / Ultralight Active", "Drive", "wheelchair", "Rigid ultralight frame configured for energy-efficient active propulsion."),
        p("Type 5 — Tilt-in-Space (STP Power Plus)", "Drive", "wheelchair", "Tilt-in-space positioning for pressure relief, posture and comfort."),
        p("Transport Chair", "Drive", "wheelchair", "Light companion-pushed chair with small wheels — folds for the car."),
        p("Bariatric Manual Wheelchair", "Drive", "wheelchair", "Wider, reinforced seating with higher weight capacity.")
      ]
    },
    {
      id: "cushions", cat: "mobility", name: "Cushions & Seating", icon: "cushion",
      blurb: "The right cushion protects skin, improves posture and adds comfort — foam, gel and air, professionally matched.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Foam Cushion", "", "cushion", "Supportive contoured foam for everyday comfort and basic pressure relief."),
        p("Gel Cushion", "", "cushion", "Gel-over-foam balances comfort with improved pressure distribution."),
        p("ROHO Air Cushion", "ROHO", "cushion", "Adjustable air cells — high-level pressure care for skin protection."),
        p("JAY Cushions", "Sunrise / JAY", "cushion", "Clinically proven positioning and skin-protection cushions."),
        p("Permobil Seating", "Permobil", "cushion", "Advanced air and hybrid cushions for posture and pressure management."),
        p("Positioning & Back Supports", "", "cushion", "Backrests and positioning components for alignment and stability."),
        p("Bariatric Cushion", "", "cushion", "Wider, higher-capacity cushions for larger seating systems.")
      ]
    },
    {
      id: "scooters", cat: "mobility", name: "Mobility Scooters", icon: "scooter",
      img: "assets/img/scooter.jpg",
      blurb: "Get out and about with confidence — compact 3-wheel manoeuvrability or stable 4-wheel range.",
      funding: ["ADP", "ODSP"],
      products: [
        p("3-Wheel Scooter", "Pride", "scooter", "Tight turning radius and open legroom — great for indoors and tight spaces."),
        p("4-Wheel Scooter", "Fortress", "scooter", "Extra stability and outdoor capability for longer trips."),
        p("Travel / Folding Scooter", "", "scooter", "Disassembles or folds to fit in the car for travel."),
        p("Heavy-Duty / Bariatric Scooter", "Fortress", "scooter", "Long range, higher capacity and a wider, supportive seat.")
      ]
    },
    {
      id: "lifts", cat: "accessibility", name: "Patient & Access Lifts", icon: "lift",
      blurb: "Move safely between levels and surfaces — patient lifts, stairlifts, porch and vertical platform lifts.",
      funding: ["MOD", "ODSP"],
      products: [
        p("Sit-to-Stand / Standing Lift", "", "lift", "Helps a person rise and transfer safely with support under the arms.", { funding: ["ODSP"] }),
        p("Floor Lift (Electric Patient Lift)", "", "lift", "Powered sling lift for safe, low-effort transfers at home.", { funding: ["ODSP"] }),
        p("Ceiling Lift", "", "ceiling", "Ceiling-track sling system for smooth room-to-room transfers.", { funding: ["MOD"] }),
        p("Porch Lift", "", "vpl", "Outdoor platform lift that raises a wheelchair to porch or entry level.", { funding: ["MOD"] }),
        p("Stair Lift", "", "stairlift", "Motorised chair that carries you safely up and down the stairs.", { funding: ["MOD"] }),
        p("Vertical Platform Lift (VPL)", "", "vpl", "Enclosed platform lift for wheelchair access between levels.", { funding: ["MOD"] }),
        p("Portable / Gantry Ceiling Lift", "", "ceiling", "Freestanding lift — no permanent track required.", { funding: ["MOD"] })
      ]
    },
    {
      id: "accessibility", cat: "accessibility", name: "Home Accessibility Modifications", icon: "ramp",
      blurb: "Make the whole home safer and barrier-free — ramps, railings, door openers and accessible layouts.",
      funding: ["MOD"],
      products: [
        p("Modular & Threshold Ramps", "", "ramp", "Aluminum ramps for entries, thresholds and stairs — rent or buy."),
        p("Railings & Handrails", "", "railing", "Secure indoor and outdoor railings for steps, halls and entries."),
        p("Automatic Door Openers", "", "door", "Push-button and touch-free openers for hands-free entry."),
        p("Doorway Widening", "", "door", "Widen doorways and remove thresholds for wheelchair access."),
        p("Accessible Kitchen & Living Changes", "", "ramp", "Lowered counters, lever handles and reachable storage.")
      ]
    },
    {
      id: "bathroom", cat: "bathroom", name: "Bathroom Safety", icon: "grabbar",
      img: "assets/img/bathroom.jpg",
      blurb: "Stay safe and independent in the most personal space — grab bars, commodes, raised seats, poles and more.",
      funding: ["MOD", "ODSP"],
      products: [
        p("Commode", "", "commode", "Bedside or over-toilet commode for safe, dignified toileting."),
        p("Raised Toilet Seat", "", "toilet", "Adds height to reduce strain when sitting and standing."),
        p("Toilet Safety Rails & Frames", "", "toilet", "Sturdy armrests/frames around the toilet for support."),
        p("Grab Bars", "", "grabbar", "Professionally installed bars for the shower, tub and toilet."),
        p("Saska / Super Pole", "", "pole", "Floor-to-ceiling pole that gives a secure hand-hold for transfers."),
        p("Pole with Curved & Straight Grab Bar", "", "pole", "Pivoting curved bar plus a straight bar for flexible, two-point support."),
        p("Shower Chairs & Transfer Benches", "", "bath", "Sit safely to shower, or slide across a bench into the tub."),
        p("Bath Lifts", "", "bath", "Lower and raise yourself gently into the bath at the touch of a button."),
        p("Non-slip & Hand-held Showers", "", "bath", "Anti-slip mats, treads and hand-held shower kits.")
      ]
    },
    {
      id: "liftchairs", cat: "accessibility", name: "Lift Chair Recliners", icon: "recliner",
      img: "assets/img/lift-chair.jpg",
      blurb: "Power recliners that gently rise to help you stand — comfort, support and independence in one chair.",
      funding: ["ODSP"],
      products: [
        p("Pride Lift Chairs", "Pride", "recliner", "Quality power lift recliners in a range of sizes and styles.", { img: "assets/img/lift-chair.jpg" }),
        p("2-Position Lift Chair", "Pride", "recliner", "Lift, sit upright and a gentle recline — ideal for TV and reading."),
        p("3-Position Lift Chair", "Pride", "recliner", "Reclines further toward a near-flat 'napping' position."),
        p("Infinite-Position Lift Chair", "Pride", "recliner", "Independent back and footrest for full-recline and zero-gravity comfort."),
        p("Heat & Massage Lift Chair", "Pride", "recliner", "Adds soothing heat and massage to lift-and-recline comfort."),
        p("Bariatric Lift Chair", "Pride", "recliner", "Wider seat and higher weight capacity with the same easy lift.")
      ]
    }
  ];
})();
