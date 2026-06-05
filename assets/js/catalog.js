/*
 * Help Mobility — product catalogue
 * ---------------------------------
 * Real product lines grouped the way the business sells them, each tagged with
 * the funding programs that typically apply (ADP / ODSP / MOD) and 2-3 key
 * feature specs. Eligibility always depends on the person & device — the site
 * says "we help you confirm".
 *
 * IMAGES: set `img` (via opts) to a real photo in assets/img/ when you have one
 * (licensed dealer/manufacturer photos). When `img` is omitted, a clean branded
 * illustration (the `pic` icon) is shown — never an emoji.
 */
(function () {
  "use strict";
  window.HM = window.HM || {};

  window.HM.FUND_INFO = {
    ADP: "Assistive Devices Program — Ontario covers up to 75% of the cost of approved mobility & seating devices.",
    ODSP: "Ontario Disability Support Program — may fund equipment for eligible recipients (mandatory/discretionary benefits).",
    MOD: "March of Dimes — Home & Vehicle Modification Program for ramps, lifts and accessibility changes."
  };

  // Product-type illustrations (line art, inherit colour). Used when no photo set.
  function _i(p) { return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"; }
  var P = {
    bed: _i('<path d="M2 18v-6a2 2 0 0 1 2-2h10a4 4 0 0 1 4 4v4"/><path d="M2 18h20"/><path d="M2 13V8"/><path d="M22 16v3"/><rect x="5" y="11.5" width="5" height="2.5" rx="1"/>'),
    mattress: _i('<rect x="2.5" y="9" width="19" height="7" rx="2"/><path d="M6 9v7M10 9v7M14 9v7M18 9v7"/>'),
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
    cane: _i('<path d="M9 3a3 3 0 0 1 6 0v13a3 3 0 0 1-6 0"/><path d="M9 21h6"/>'),
    table: _i('<rect x="3" y="7" width="18" height="3" rx="1"/><path d="M5 10v9M19 10v9"/><path d="M5 14h14"/>')
  };
  window.HM.ICONS = Object.assign({}, window.HM.ICONS || {}, P);

  // p(name, brand, pic, blurb, opts) — opts: {img, funding, specs}
  function p(name, brand, pic, blurb, opts) {
    opts = opts || {};
    return { name: name, brand: brand || "", pic: pic, blurb: blurb || "",
      img: opts.img || null, funding: opts.funding || null, specs: opts.specs || [] };
  }

  window.HM.CATALOG = [
    {
      id: "beds", cat: "daily", name: "Hospital & Homecare Beds", icon: "bed",
      img: "assets/img/lifestyle.jpg",
      blurb: "Full- and semi-electric beds for safe, comfortable home recovery — delivered, assembled and adjusted for you.",
      funding: ["ODSP"],
      products: [
        p("Invacare IVC Hospital Bed", "Invacare", "bed", "Dependable semi-electric homecare bed for everyday care at home.", { specs: ["Semi-electric head & foot", "Manual height adjust", "Optional half/full rails"] }),
        p("Invacare Etude / Etude HC", "Invacare", "bed", "Full-electric low bed — height lowers to ease transfers and reduce fall risk.", { specs: ["Full-electric positioning", "Low height for fall safety", "Quiet, smooth motors"] }),
        p("Hälsa Bed", "Hälsa", "bed", "Comfortable, quiet homecare bed with electric head, foot and height adjustment.", { specs: ["Full-electric 3-function", "Wood-look home styling", "Castors with brakes"] }),
        p("Hälsa Plus Bed", "Hälsa", "bed", "Premium Hälsa bed with extended positioning and a refined home look.", { specs: ["Extended low-to-high range", "Premium finish & rails", "Battery backup ready"] }),
        p("Toron Care Bed", "Toron", "bed", "Reliable care bed built for long-term home and facility use.", { specs: ["Durable steel frame", "Full-electric functions", "Facility-grade build"] }),
        p("Euro Hospital Bed", "", "bed", "Institutional-style profiling bed for clinical-grade support at home.", { specs: ["4-section profiling deck", "Clinical-grade support", "Integrated side rails"] }),
        p("Bariatric Hospital Bed", "", "bed", "Reinforced, wider bed with higher weight capacity for heavier users.", { specs: ["Expanded width", "Heavy-duty capacity", "Reinforced motors & deck"] }),
        p("Low Floor Bed", "", "bed", "Ultra-low bed that lowers close to the floor to protect against fall injuries.", { specs: ["Lowers near floor level", "Fall-injury prevention", "Pairs with floor mats"] }),
        p("Pressure-Redistribution Mattress", "", "mattress", "Therapeutic foam mattress that redistributes pressure to protect skin.", { specs: ["Multi-layer therapeutic foam", "Shear & friction reduction", "Fluid-resistant cover"] }),
        p("Alternating-Pressure Mattress", "", "mattress", "Powered air mattress that cycles pressure for higher-risk skin care.", { specs: ["Powered air cells", "Pressure-injury prevention", "Adjustable comfort"] }),
        p("Bed Rails, Trapeze, Tables & Accessories", "", "table", "Assist rails, trapeze bars and overbed tables to round out the bed.", { specs: ["Assist & safety rails", "Trapeze lift bar", "Overbed table"] })
      ]
    },
    {
      id: "walkers", cat: "mobility", name: "Walkers & Rollators", icon: "rollator",
      blurb: "From sturdy standard walkers to four-wheel rollators with a seat — the right support for your balance and stamina.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Standard Walker (no wheels)", "", "walker", "Lightweight folding frame for maximum stability — lift-and-step support.", { specs: ["Folds flat", "Height-adjustable legs", "Most stable support"] }),
        p("Two-Wheel Walker", "", "walker", "Front wheels glide while rear glides grip — easier to move, still secure.", { specs: ["Front wheels glide", "Rear grip glides", "Folds for the car"] }),
        p("Four-Wheel Rollator", "", "rollator", "Wheels, hand brakes and a built-in seat for rest stops on longer outings.", { specs: ["Built-in seat & basket", "Loop hand brakes", "Folds upright"] }),
        p("Outdoor Rollator", "", "rollator", "Larger wheels and rugged frame for sidewalks, parks and uneven ground.", { specs: ["Large all-terrain wheels", "Rugged frame", "Seat & storage"] }),
        p("Upright / Stand-up Rollator", "", "rollator", "Forearm supports promote upright posture and reduce wrist and back strain.", { specs: ["Forearm supports", "Upright posture", "Reduces wrist strain"] }),
        p("Walker with Seat & Basket", "", "rollator", "Three- or four-wheel rollator configured with a comfortable seat and storage.", { specs: ["Padded seat", "Storage basket/bag", "Compact fold"] }),
        p("Bariatric Walker", "", "walker", "Wider, reinforced frame with higher weight capacity.", { specs: ["Extra-wide frame", "Heavy-duty capacity", "Reinforced welds"] }),
        p("Hemi Walker", "", "cane", "One-handed support — more stable than a cane, ideal after a stroke.", { specs: ["One-handed use", "More stable than a cane", "Compact footprint"] }),
        p("Knee Walker", "", "rollator", "Roll instead of hop while a foot or ankle heals — steerable with brakes.", { specs: ["Padded knee rest", "Steerable with brakes", "Non-weight-bearing"] }),
        p("Walker Accessories", "", "walker", "Trays, baskets, pouches, glides and ski-glides to personalise any walker.", { specs: ["Trays & baskets", "Glides & ski-glides", "Pouches & cup holders"] })
      ]
    },
    {
      id: "power", cat: "mobility", name: "Power Wheelchairs", icon: "powerchair",
      img: "assets/img/power-header.jpg",
      blurb: "Powered independence with comfort and control — front-, mid- and rear-wheel drive, tilt, recline and more.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Quantum Power Chairs", "Quantum / Pride", "powerchair", "Edge and 4Front series — responsive drive with iLevel® seat elevation.", { img: "assets/img/power-header.jpg", specs: ["iLevel® seat elevation", "Multiple drive setups", "Power tilt/recline options"] }),
        p("Sunrise / Quickie Power Chairs", "Sunrise Medical", "powerchair", "Quickie QM-7 series — precise handling and advanced power seating.", { specs: ["Mid-wheel drive handling", "Advanced power seating", "Highly configurable"] }),
        p("Permobil Power Chairs", "Permobil", "powerchair", "F-series and M-series — premium power positioning and all-day comfort.", { specs: ["Premium power positioning", "Smooth suspension", "All-day comfort"] }),
        p("Group 2 Standard Power Chair", "", "powerchair", "Everyday powered mobility for indoor and light outdoor use.", { specs: ["Standard captain's seat", "Indoor/light outdoor", "ADP-fundable"] }),
        p("Group 3 / Complex Rehab Power Chair", "", "powerchair", "Configurable base for complex seating and positioning needs.", { specs: ["Complex rehab base", "Custom seating ready", "Power positioning"] }),
        p("Tilt & Recline Power Chair", "", "powerchair", "Power tilt, recline and legs for pressure relief and all-day positioning.", { specs: ["Power tilt + recline", "Elevating leg rests", "Pressure relief"] }),
        p("Travel / Folding Power Chair", "", "powerchair", "Lightweight, folds for the car and air travel without losing power.", { specs: ["Folds for transport", "Airline-friendly battery", "Lightweight frame"] }),
        p("Bariatric Power Chair", "", "powerchair", "Heavy-duty base and wider seating with higher weight capacity.", { specs: ["Heavy-duty base", "Wider seat options", "High weight capacity"] })
      ]
    },
    {
      id: "manual", cat: "mobility", name: "Manual Wheelchairs (by Drive)", icon: "wheelchair",
      img: "assets/img/wheelchair-manual.jpg",
      blurb: "ADP funds manual wheelchairs by type — from standard to fully configured tilt-in-space. We fit the right type to you.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Type 1 — Standard Manual Wheelchair", "Drive", "wheelchair", "Everyday folding wheelchair for occasional to regular indoor/outdoor use.", { img: "assets/img/wheelchair-manual.jpg", specs: ["Folding steel frame", "Swing-away footrests", "ADP Type 1"] }),
        p("Type 2 — Lightweight Manual Wheelchair", "Drive", "wheelchair", "Lighter frame — easier to propel, lift and transport.", { img: "assets/img/wheelchair-folding.jpg", specs: ["Lighter aluminum frame", "Easier to propel & lift", "ADP Type 2"] }),
        p("Type 3 — High-Strength Lightweight", "Drive", "wheelchair", "Durable lightweight chair for daily, active full-time use.", { specs: ["Durable for daily use", "Adjustable rear axle", "ADP Type 3"] }),
        p("Type 4 — Rigid / Ultralight Active", "Drive", "wheelchair", "Rigid ultralight frame configured for energy-efficient active propulsion.", { specs: ["Rigid ultralight frame", "Energy-efficient push", "ADP Type 4"] }),
        p("Type 5 — Tilt-in-Space (STP Power Plus)", "Drive", "wheelchair", "Tilt-in-space positioning for pressure relief, posture and comfort.", { specs: ["Tilt-in-space frame", "Pressure relief & posture", "ADP Type 5"] }),
        p("Transport Chair", "Drive", "wheelchair", "Light companion-pushed chair with small wheels — folds for the car.", { specs: ["Companion-pushed", "Small wheels, folds", "Very lightweight"] }),
        p("Reclining Wheelchair", "Drive", "wheelchair", "High back that reclines for rest, positioning and pressure relief.", { specs: ["Reclining high back", "Elevating leg rests", "Headrest support"] }),
        p("Pediatric Wheelchair", "Drive", "wheelchair", "Smaller, growable frames sized and configured for children.", { specs: ["Child-sized frame", "Grows with the user", "Positioning supports"] }),
        p("Bariatric Manual Wheelchair", "Drive", "wheelchair", "Wider, reinforced seating with higher weight capacity.", { specs: ["Extra-wide seat", "Reinforced frame", "High capacity"] })
      ]
    },
    {
      id: "cushions", cat: "mobility", name: "Cushions & Seating", icon: "cushion",
      blurb: "The right cushion protects skin, improves posture and adds comfort — foam, gel and air, professionally matched.",
      funding: ["ADP", "ODSP"],
      products: [
        p("Foam Cushion", "", "cushion", "Supportive contoured foam for everyday comfort and basic pressure relief.", { specs: ["Contoured foam", "Everyday comfort", "Lightweight"] }),
        p("Gel Cushion", "", "cushion", "Gel-over-foam balances comfort with improved pressure distribution.", { specs: ["Gel-over-foam", "Better pressure spread", "Stable base"] }),
        p("ROHO Air Cushion", "ROHO", "cushion", "Adjustable air cells — high-level pressure care for skin protection.", { specs: ["Adjustable air cells", "High pressure relief", "Skin protection"] }),
        p("JAY Cushions", "Sunrise / JAY", "cushion", "Clinically proven positioning and skin-protection cushions.", { specs: ["Clinically proven", "Positioning + protection", "Fluid/gel options"] }),
        p("Permobil Seating", "Permobil", "cushion", "Advanced air and hybrid cushions for posture and pressure management.", { specs: ["Air & hybrid options", "Posture management", "Pressure care"] }),
        p("Air-Foam Hybrid Cushion", "", "cushion", "Combines an air layer with foam for relief plus stability.", { specs: ["Air + foam layers", "Relief with stability", "Low maintenance"] }),
        p("Positioning & Back Supports", "", "cushion", "Backrests and lateral supports for alignment and trunk stability.", { specs: ["Backrests", "Lateral supports", "Trunk alignment"] }),
        p("Bariatric Cushion", "", "cushion", "Wider, higher-capacity cushions for larger seating systems.", { specs: ["Extra-wide sizes", "High capacity", "Durable cover"] })
      ]
    },
    {
      id: "scooters", cat: "mobility", name: "Mobility Scooters", icon: "scooter",
      img: "assets/img/scooter.jpg",
      blurb: "Get out and about with confidence — compact 3-wheel manoeuvrability or stable 4-wheel range.",
      funding: ["ADP", "ODSP"],
      products: [
        p("3-Wheel Scooter", "Pride", "scooter", "Tight turning radius and open legroom — great for indoors and tight spaces.", { specs: ["Tight turning radius", "Open legroom", "Easy disassembly"] }),
        p("4-Wheel Scooter", "Fortress", "scooter", "Extra stability and outdoor capability for longer trips.", { specs: ["4-wheel stability", "Outdoor capable", "Comfort seating"] }),
        p("Travel / Folding Scooter", "", "scooter", "Disassembles or auto-folds to fit in the car for travel.", { specs: ["Folds / disassembles", "Airline-friendly", "Lightweight pieces"] }),
        p("Mid-Size Scooter", "Pride", "scooter", "A balance of portability, comfort and range for daily errands.", { specs: ["Daily range", "Comfortable seat", "Front basket"] }),
        p("Heavy-Duty / Bariatric Scooter", "Fortress", "scooter", "Long range, higher capacity and a wider, supportive seat.", { specs: ["Long range", "High capacity", "Wide captain's seat"] }),
        p("All-Terrain Scooter", "Fortress", "scooter", "Larger tyres and suspension for grass, gravel and trails.", { specs: ["All-terrain tyres", "Suspension", "Strong climbing"] })
      ]
    },
    {
      id: "lifts", cat: "accessibility", name: "Patient & Access Lifts", icon: "lift",
      blurb: "Move safely between levels and surfaces — patient lifts, stairlifts, porch and vertical platform lifts.",
      funding: ["MOD", "ODSP"],
      products: [
        p("Sit-to-Stand / Standing Lift", "", "lift", "Helps a person rise and transfer safely with support under the arms.", { funding: ["ODSP"], specs: ["Assisted sit-to-stand", "Safe transfers", "Compact base"] }),
        p("Floor Lift (Electric Patient Lift)", "", "lift", "Powered sling lift for safe, low-effort transfers at home.", { funding: ["ODSP"], specs: ["Powered sling lift", "Low-effort transfers", "Multiple sling sizes"] }),
        p("Ceiling Lift", "", "ceiling", "Ceiling-track sling system for smooth room-to-room transfers.", { funding: ["MOD"], specs: ["Fixed ceiling track", "Room-to-room transfers", "Frees floor space"] }),
        p("Portable / Gantry Ceiling Lift", "", "ceiling", "Freestanding lift — no permanent track required.", { funding: ["MOD"], specs: ["Freestanding frame", "No permanent track", "Relocatable"] }),
        p("Porch Lift", "", "vpl", "Outdoor platform lift that raises a wheelchair to porch or entry level.", { funding: ["MOD"], specs: ["Raises to entry level", "Weather-rated", "Wheelchair platform"] }),
        p("Stair Lift", "", "stairlift", "Motorised chair that carries you safely up and down the stairs.", { funding: ["MOD"], specs: ["Straight or curved rail", "Folds away", "Safety sensors"] }),
        p("Vertical Platform Lift (VPL)", "", "vpl", "Enclosed platform lift for wheelchair access between levels.", { funding: ["MOD"], specs: ["Wheelchair platform", "Indoor/outdoor", "Multi-level access"] }),
        p("Inclined Platform (Stair) Lift", "", "stairlift", "Folding platform that carries a wheelchair along a staircase.", { funding: ["MOD"], specs: ["Carries wheelchair", "Folds against wall", "For shared stairs"] }),
        p("Pool Lift", "", "lift", "Powered lift for safe, dignified access in and out of a pool.", { funding: ["MOD"], specs: ["Powered pool access", "Corrosion-resistant", "Independent or assisted"] }),
        p("Transfer Aids", "", "lift", "Transfer boards, discs, slings and belts for safer everyday transfers.", { funding: ["ODSP"], specs: ["Boards & discs", "Slings & belts", "Reduce caregiver strain"] })
      ]
    },
    {
      id: "accessibility", cat: "accessibility", name: "Home Accessibility Modifications", icon: "ramp",
      blurb: "Make the whole home safer and barrier-free — ramps, railings, door openers and accessible layouts.",
      funding: ["MOD"],
      products: [
        p("Modular Aluminum Ramps", "", "ramp", "Reconfigurable aluminum ramp systems for entries and stairs — rent or buy.", { specs: ["Reconfigurable sections", "Non-slip surface", "Rent or buy"] }),
        p("Threshold & Suitcase Ramps", "", "ramp", "Portable ramps for doorways, single steps and on-the-go access.", { specs: ["Portable & foldable", "Doorways & single steps", "Quick setup"] }),
        p("Railings & Handrails", "", "railing", "Secure indoor and outdoor railings for steps, halls and entries.", { specs: ["Indoor & outdoor", "Steps, halls, entries", "Code-compliant install"] }),
        p("Automatic Door Openers", "", "door", "Push-button and touch-free openers for hands-free entry.", { specs: ["Push-button / touch-free", "Hands-free entry", "Wireless options"] }),
        p("Doorway Widening", "", "door", "Widen doorways and remove thresholds for wheelchair access.", { specs: ["Wheelchair-width doorways", "Threshold removal", "Offset hinges option"] }),
        p("Stair Anti-Slip & Nosings", "", "ramp", "High-visibility, anti-slip stair nosings and treads to prevent falls.", { specs: ["Anti-slip treads", "High-visibility edges", "Indoor/outdoor"] }),
        p("Accessible Kitchen & Living Changes", "", "ramp", "Lowered counters, roll-under sinks, lever handles and reachable storage.", { specs: ["Roll-under counters/sinks", "Lever handles", "Reachable storage"] })
      ]
    },
    {
      id: "bathroom", cat: "bathroom", name: "Bathroom Safety", icon: "grabbar",
      img: "assets/img/bathroom.jpg",
      blurb: "Stay safe and independent in the most personal space — grab bars, commodes, raised seats, poles and more.",
      funding: ["MOD", "ODSP"],
      products: [
        p("Commode", "", "commode", "Bedside or over-toilet commode for safe, dignified toileting.", { specs: ["Bedside / over-toilet", "Height-adjustable", "Removable pail"] }),
        p("Raised Toilet Seat", "", "toilet", "Adds height to reduce strain when sitting and standing.", { specs: ["Adds 2–6\" height", "Clamp-on or locking", "Optional armrests"] }),
        p("Toilet Safety Rails & Frames", "", "toilet", "Sturdy armrests and frames around the toilet for support.", { specs: ["Support both sides", "Adjustable width/height", "Tool-free install"] }),
        p("Grab Bars", "", "grabbar", "Professionally installed bars for the shower, tub and toilet.", { specs: ["Pro-installed to studs", "Multiple lengths/angles", "Knurled or smooth"] }),
        p("Saska / Super Pole", "", "pole", "Floor-to-ceiling pole that gives a secure hand-hold for transfers.", { specs: ["Floor-to-ceiling", "No-damage tension fit", "Bedside or bath"] }),
        p("Pole with Curved & Straight Grab Bar", "", "pole", "Pivoting curved bar plus a straight bar for flexible, two-point support.", { specs: ["Pivoting curved bar", "Added straight bar", "Two-point support"] }),
        p("Shower Chairs & Stools", "", "bath", "Sit safely to shower — with or without a back and arms.", { specs: ["Height-adjustable legs", "Drainage seat", "With/without back"] }),
        p("Tub Transfer Bench", "", "bath", "Slide safely across into the tub without stepping over the wall.", { specs: ["Seat extends over tub", "Slide-across transfer", "Adjustable legs"] }),
        p("Bath Lifts", "", "bath", "Lower and raise yourself gently into the bath at the touch of a button.", { specs: ["Powered lower/raise", "Reclining options", "Waterproof control"] }),
        p("Non-slip & Hand-held Showers", "", "bath", "Anti-slip mats and treads plus hand-held shower kits.", { specs: ["Anti-slip mats/treads", "Hand-held shower", "Diverter included"] })
      ]
    },
    {
      id: "liftchairs", cat: "accessibility", name: "Lift Chair Recliners", icon: "recliner",
      img: "assets/img/lift-chair.jpg",
      blurb: "Power recliners that gently rise to help you stand — comfort, support and independence in one chair.",
      funding: ["ODSP"],
      products: [
        p("Pride Lift Chairs", "Pride", "recliner", "Quality power lift recliners in a range of sizes and styles.", { img: "assets/img/lift-chair.jpg", specs: ["Smooth power lift", "Many fabrics/sizes", "Side pocket & control"] }),
        p("2-Position Lift Chair", "Pride", "recliner", "Lift, sit upright and a gentle recline — ideal for TV and reading.", { specs: ["Lift + light recline", "TV & reading", "Single motor"] }),
        p("3-Position Lift Chair", "Pride", "recliner", "Reclines further toward a near-flat 'napping' position.", { specs: ["Near-flat recline", "Napping position", "Single motor"] }),
        p("Infinite-Position Lift Chair", "Pride", "recliner", "Independent back and footrest for full-recline and zero-gravity comfort.", { specs: ["Independent back/foot", "Zero-gravity", "Dual motors"] }),
        p("Heat & Massage Lift Chair", "Pride", "recliner", "Adds soothing heat and massage to lift-and-recline comfort.", { specs: ["Heat + massage", "Multiple zones", "Remote control"] }),
        p("Petite, Tall & Wide Fits", "Pride", "recliner", "Sized to fit — petite, tall and wide options for the right support.", { specs: ["Petite to tall sizing", "Wide seat options", "Proper fit = comfort"] }),
        p("Bariatric Lift Chair", "Pride", "recliner", "Wider seat and higher weight capacity with the same easy lift.", { specs: ["Extra-wide seat", "High weight capacity", "Reinforced lift"] })
      ]
    }
  ];
})();
