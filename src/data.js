// Content and photography taken from khandelwalbusar.com and mcil.net —
// both companies belong to the Khandelwal Busar Group.

const M = "/media/img/";

export const about = {
  title: "Supplying India's leading manufacturers",
  body: [
    "Khandelwal Busar Group brings together three manufacturing companies in Faridabad and Alwar. Between them they cold roll steel strip, galvanise tape and wire for cable makers, and press and weld assemblies for India's vehicle makers.",
    "Working with the group is simple. Each company runs its own plant and certifications, and together they give OEMs one dependable source for metal, from coil to finished component.",
  ],
  sinceLabel: "A Family of Manufacturers Since",
  since: "1981",
  image: M + "kbi-plant-front.jpg",
  imageAlt: "Khandelwal Busar Industries plant, Sector 59, Faridabad",
};

// Order as requested: automotive, MCIL, wires & strips.
export const firms = [
  {
    id: "kbi",
    name: "Khandelwal Busar Industries",
    mark: "KBI",
    accent: "#4b86f2",
    tint: ["#0d2152", "#040917"], // backdrop of the wordmark panel, top-left to bottom-right
    logo: M + "mark-white.png",
    tagline: "Sheet-metal and fabricated assemblies (axles, chassis, cabins and pedals) for India's automobile, tractor, construction-equipment and defence OEMs.",
    meta: "Faridabad, Haryana · Est. 1981",
    description: [
      "KBI began in 1981 as a Faridabad press shop supplying Maruti Suzuki. Four decades on, it manufactures sheet-metal and fabricated components for India's automobile, tractor, construction-equipment and defence OEMs.",
      "Its lines press, weld and machine World Wide dual-slider axles, chassis and cabin assemblies, pedal assemblies, steering-mounting brackets and safety-critical seat-belt brackets. In August 2026 the plant gained IATF 16949:2016 certification for sheet-metal and welded components.",
    ],
    facts: [
      ["Customers", "Maruti Suzuki, Volvo Eicher, Escorts Kubota, CNH, Kobelco, Mahindra Defence, Euler Motors"],
      ["Certified", "IATF 16949:2016 · ISO 9001 · ISO 14001 · ISO 45001"],
    ],
    category: "Automotive · Tractor · Defence",
    figures: [["1981", "Founded in Faridabad"], ["30+", "OEM customers"], ["IATF", "16949:2016 certified"]],
    enquiry: { what: "Sheet metal parts, axles, chassis and cabin assemblies", email: "business@khandelwalbusar.com", phone: "+91 99999 73404", image: M + "kbi-welding.jpg" },
    image: M + "kbi-shop-floor.jpg",
    alt: "KBI press and fabrication shop floor in Faridabad",
    url: "https://khandelwalbusar.com",
  },
  {
    id: "mcil",
    name: "Metal Coatings (India) Ltd",
    mark: "MCIL",
    accent: "#d6a54f",
    tint: ["#2e200c", "#0b0805"], // backdrop of the wordmark panel, top-left to bottom-right
    logo: M + "mcil-mark-white.png",
    tagline: "Cold rolled steel strips and coils, and HRPO coils, pickled, rolled and finished on one floor in Faridabad to ±0.01 mm.",
    meta: "Faridabad, Haryana · Est. 1994 · BSE 531810",
    description: [
      "Metal Coatings (India) Limited is a public limited company promoted by the Khandelwal family in December 1994 and listed on the BSE. It manufactures cold rolled steel strips and coils, and hot rolled pickled and oiled (HRPO) coils, at its integrated works in Sector 59, Faridabad.",
      "Hot rolled coil is pickled, rolled, finished and despatched from one floor, so thickness is held to ±0.01 mm across the full width. Every coil ships with its heat number and test certificate.",
    ],
    facts: [
      ["Products", "CR strips & coils · HRPO coils · coils up to 30 MT"],
      ["Certified", "BIS IS 513:2008 · licence CM/L-9512364723"],
    ],
    category: "Cold Rolled · HRPO · Auto, White Goods & Power",
    figures: [["±0.01", "mm gauge across the width"], ["30 MT", "Maximum coil weight"], ["1994", "Listed on the BSE"]],
    enquiry: { what: "Cold rolled strips and coils, HRPO coils", email: "info@mcilindia.net", phone: "011-4180 8125", image: M + "mcil-finished.jpg" },
    image: M + "mcil-coil-line.jpg",
    alt: "Cold rolled steel coils at the MCIL works",
    url: "https://www.mcil.net",
  },
  {
    id: "alwar",
    name: "KBI Wires & Strips",
    mark: "KBI Wires",
    accent: "#8fc1d4",
    tint: ["#0b2a35", "#03090c"], // backdrop of the wordmark panel, top-left to bottom-right
    logo: M + "mark-white.png",
    tagline: "Galvanised steel tape, round wire and strip that armour the underground power and telecom cables of India's leading cable makers.",
    meta: "Alwar, Rajasthan · Cable input division",
    description: [
      "The group's Alwar plant in Matsya Industrial Area produces galvanised steel tape, wire and strip that armour underground power and telecom cables across India's infrastructure.",
      "Steel is drawn, zinc-coated and slit in-house. In June 2025 a new galvanised wire and strip (GWS) line was added to expand capacity for India's leading cable makers.",
    ],
    facts: [
      ["Products", "Galvanised steel tape · round armour wire · formed strip"],
      ["Customers", "Havells, Delton Cables, Cords Cables"],
    ],
    category: "Power · Telecom · Cable Armouring",
    figures: [["3", "Lines: tape, wire, strip"], ["2025", "New GWS line added"], ["2", "Sectors: power & telecom"]],
    enquiry: { what: "Galvanised steel tape, armour wire and strip", email: "alwar@khandelwalbusar.com", phone: "", image: M + "alwar-galvanizing.jpg" },
    image: M + "alwar-galvanizing.jpg",
    alt: "Galvanising line for steel wire and strip",
    url: "https://khandelwalbusar.com/products?cat=wires",
  },
];

const W = "/media/clients-white/";
export const clients = [
  ["Maruti Suzuki", W + "maruti_suzuki_img.png"],
  ["Volvo Eicher", W + "volvo_eicher.png"],
  ["Kubota", W + "kubota_img.png"],
  ["Havells", W + "havells_img.png"],
  ["Kobelco", W + "kobelco_img.png"],
  ["Talbros", W + "talbros.png"],
  ["Euler Motors", W + "eulermotors_img.png"],
  ["Satyam Auto Components", W + "satyam.png"],
  ["New Holland", W + "New_Holland_img.png"],
  ["Carraro", W + "carraro_img.png"],
  ["Nikko Auto", W + "nikko-auto.png"],
  ["Mahindra Defence", W + "Mahindra_Defence_img.png"],
  ["Cords Cables", W + "cords_cables.png"],
  ["Caparo", W + "caparo_img.png"],
  ["Delton Cables", W + "Delton_Cables.png"],
];

// Milestones from the KBI "Our Journey" timeline (khandelwalbusar.com/about_us).
// Placeholder set until the final list is supplied.
export const milestones = [
  {
    year: "1981",
    title: "Established",
    points: [
      "Founded in Faridabad, Haryana as Kochar Agro Industries.",
      "Partnered with Maruti Suzuki India Limited from the start.",
    ],
    tags: ["Faridabad", "Maruti Suzuki"],
  },
  {
    year: "1995",
    title: "Major milestone",
    points: ["Association with VE Commercial Vehicles (Volvo Eicher) and Escorts Kubota."],
    tags: ["Commercial vehicles", "Tractors"],
  },
  {
    year: "2005",
    title: "Family takeover",
    points: ["The Khandelwal family acquired KBI."],
    tags: ["Khandelwal family"],
  },
  {
    year: "2007",
    title: "CNH Industrial",
    points: ["Partnership with CNH Industrial, a global agricultural and construction equipment leader."],
    tags: ["New Holland", "Agri & construction"],
  },
  {
    year: "2008",
    title: "Alwar expansion",
    points: ["New plant in Alwar, Rajasthan for galvanised steel tape and wire."],
    tags: ["Alwar", "Cable input"],
  },
  {
    year: "2022",
    title: "Bold expansion",
    points: ["Partnership with Kobelco India, a leading excavator maker."],
    tags: ["Construction equipment"],
  },
  {
    year: "2023",
    title: "Defence sector",
    points: ["Partnered with Mahindra Defence Systems."],
    tags: ["Defence"],
  },
  {
    year: "2024",
    title: "Future-ready",
    points: ["Entered electric-vehicle components with Euler Motors."],
    tags: ["Electric vehicles"],
  },
];

// Figures shown once the hero closes to solid navy.
// Sources: khandelwalbusar.com (founded 1981, 30+ OEM customers) and the
// group's own company list (KBI, MCIL, KBI Wires & Strips).
export const heroMetrics = [
  { value: new Date().getFullYear() - 1981, suffix: "+", label: "Years of manufacturing, since 1981" },
  { value: 30, suffix: "+", label: "OEM customers across India" },
  { value: 3, suffix: "", label: "Group companies in Faridabad and Alwar" },
];
