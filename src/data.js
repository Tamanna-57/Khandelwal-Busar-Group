// Content and photography taken from khandelwalbusar.com and mcil.net —
// both companies belong to the Khandelwal Busar Group.

const M = "/media/img/";

export const group = {
  name: "Khandelwal Busar Group",
  stats: [
    { value: "1981", label: "Group founded in Faridabad" },
    { value: "3", label: "Manufacturing companies" },
    { value: "30+", label: "OEM customers across India" },
    { value: "±0.01", unit: "mm", label: "Gauge tolerance on cold rolled strip" },
  ],
};

export const firms = [
  {
    id: "kbi",
    index: "01",
    name: "Khandelwal Busar Industries",
    short: "KBI",
    location: "Faridabad, Haryana",
    since: "Est. 1981",
    kicker: "Sheet metal & fabrication",
    blurb:
      "Pressed, welded and machined sheet-metal assemblies for India's automobile, tractor and defence OEMs — axles, chassis and cabin assemblies, pedals and safety-critical brackets.",
    specs: [
      ["Products", "Axles · Chassis & cabins · Pedals · Steering & seat-belt brackets"],
      ["Customers", "Maruti Suzuki · Volvo Eicher · Kubota · New Holland · Mahindra Defence"],
      ["Certified", "IATF 16949:2016 · ISO 9001 · ISO 14001 · ISO 45001"],
    ],
    image: M + "kbi-shop-floor.jpg",
    alt: "KBI shop floor in Faridabad with press and fabrication lines",
    url: "https://khandelwalbusar.com",
    linkLabel: "khandelwalbusar.com",
  },
  {
    id: "alwar",
    index: "02",
    name: "KB Wires & Strips",
    short: "Alwar",
    location: "Alwar, Rajasthan",
    since: "Cable input division",
    kicker: "Galvanised tape, wire & strip",
    blurb:
      "Galvanised steel tape, armouring wire and strip for the power and telecom cable industry — drawn, coated and slit in-house to protect India's underground networks.",
    specs: [
      ["Products", "Galvanised steel tape · Armour wire · Formed strip"],
      ["Customers", "Havells · Delton Cables · Cords Cables"],
      ["Plant", "Plot A22, MIA, Alwar 301001"],
    ],
    image: M + "alwar-galvanizing.jpg",
    alt: "Galvanising line producing steel wire and strip",
    url: "https://khandelwalbusar.com/products?cat=wires",
    linkLabel: "Cable products",
  },
  {
    id: "mcil",
    index: "03",
    name: "Metal Coatings (India) Ltd",
    short: "MCIL",
    location: "Faridabad, Haryana",
    since: "Est. 1994 · Listed on BSE",
    kicker: "Cold rolled & HRPO steel",
    blurb:
      "Thirty years of cold rolling steel in Faridabad. CR strips and coils and HRPO coils, finished to gauge across the full width — every coil shipped with its heat number and test certificate.",
    specs: [
      ["Products", "Cold rolled strips & coils · HRPO coils · Up to 30 MT"],
      ["Customers", "Talbros · Havells · Caparo · Satyam Auto · Nikko Auto"],
      ["Certified", "BIS IS 513:2008 · Licence CM/L-9512364723"],
    ],
    image: M + "mcil-coil-line.jpg",
    alt: "Cold rolled steel coils lined up at the MCIL works",
    url: "https://www.mcil.net",
    linkLabel: "mcil.net",
  },
];

export const capabilities = [
  { title: "Tooling", firm: "KBI", text: "Dies, jigs and fixtures built in-house on CNC.", image: M + "kbi-tooling.jpg" },
  { title: "Pressing", firm: "KBI", text: "Mechanical and hydraulic press lines for structural parts.", image: M + "kbi-press-line.jpg" },
  { title: "Welding & fabrication", firm: "KBI", text: "MIG and spot-welded assemblies to OEM fixtures.", image: M + "kbi-welding.jpg" },
  { title: "Machining", firm: "KBI", text: "Turning, boring and multi-spindle drilling.", image: M + "kbi-machining.jpg" },
  { title: "Cold rolling", firm: "MCIL", text: "Hot rolled input reduced to gauge on one integrated line.", image: M + "mcil-cold-rolling.jpg" },
  { title: "Inspection", firm: "MCIL", text: "Gauge held across the full width; every coil ships with its test certificate.", image: M + "mcil-inspection.jpg" },
];

export const leaders = [
  {
    name: "Ramesh Chander Khandelwal",
    role: "Chairman & Whole-time Director, MCIL",
    note: "A mechanical engineer whose expertise in cold rolling and galvanising has shaped the group's manufacturing.",
    image: M + "lead-ramesh.jpg",
  },
  {
    name: "Pramod Khandelwal",
    role: "Managing Director, MCIL",
    note: "",
    image: M + "lead-pramod.jpg",
  },
];

const C = "/media/clients/";
export const clients = [
  ["Maruti Suzuki", C + "maruti_suzuki_img.png"],
  ["Volvo Eicher", C + "volvo_eicher.webp"],
  ["Kubota", C + "kubota_img.png"],
  ["New Holland", C + "New_Holland_img.png"],
  ["Mahindra Defence", C + "Mahindra_Defence_img.jpg"],
  ["Kobelco", C + "kobelco_img.png"],
  ["Euler Motors", C + "eulermotors_img.jpg"],
  ["Carraro", C + "carraro_img.png"],
  ["Havells", C + "havells_img.png"],
  ["Caparo", C + "caparo_img.png"],
  ["Talbros", C + "talbros.svg"],
  ["Satyam Auto", C + "satyam.png"],
  ["Nikko Auto", C + "nikko-auto.png"],
  ["Delton Cables", C + "Delton_Cables.png"],
  ["Cords Cables", C + "cords_cables.webp"],
];

export const certs = [
  ["IATF 16949:2016", "Automotive quality"],
  ["ISO 9001:2015", "Quality management"],
  ["ISO 14001:2015", "Environmental management"],
  ["ISO 45001:2018", "Occupational health & safety"],
  ["BIS IS 513:2008", "Cold rolled steel"],
];

export const sites = [
  {
    city: "Faridabad",
    label: "KBI — Faridabad unit",
    address: "Plot 112, Sector 59, HSIIDC Industrial Estate, Faridabad 121004, Haryana",
    contact: "+91 99999 73404 · info@khandelwalbusar.com",
    image: M + "kbi-plant-front.jpg",
  },
  {
    city: "Alwar",
    label: "KBI — Alwar unit",
    address: "Plot A22, Matsya Industrial Area, Alwar 301001, Rajasthan",
    contact: "alwar@khandelwalbusar.com",
    image: M + "kbi-quality.jpg",
  },
  {
    city: "Faridabad",
    label: "MCIL — Works",
    address: "Plot 113, Sector 59, HSIIDC Industrial Estate, Faridabad 121004, Haryana",
    contact: "011-4180 8125 · info@mcilindia.net",
    image: M + "mcil-coil-bay.jpg",
  },
];
