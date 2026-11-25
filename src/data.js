// Content seeded from khandelwalbusar.com and mcil.net.
// Alwar is seeded from KBI's cable/strip lines until its own site is live.

export const group = {
  name: "Khandelwal Busar Group",
  since: "1981",
  stats: [
    { value: "1981", label: "Founded" },
    { value: "3", label: "Manufacturing firms" },
    { value: "2", label: "States — Haryana & Rajasthan" },
    { value: "IATF", label: "16949 / ISO / BIS certified" },
  ],
};

export const firms = [
  {
    id: "faridabad",
    index: "01",
    name: "Khandelwal Busar Industries",
    city: "Faridabad",
    state: "Haryana",
    kicker: "Automobile & precision sheet metal",
    since: "Since 1981",
    accent: "#F26A1B",
    accentSoft: "rgba(242, 106, 27, 0.14)",
    blurb:
      "Precision sheet metal, fabrication and cable-input solutions for India's automobile, power and telecom sectors — pressed, welded and machined to tolerance.",
    products: ["World Wide Axle", "Chassis & cabins", "Pedals", "Steering brackets", "Seat-belt brackets"],
    clients: ["Maruti Suzuki", "Volvo Eicher", "Mahindra Defence", "Kubota", "Euler Motors", "New Holland"],
    certs: ["IATF 16949:2016", "ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"],
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80",
    url: "https://khandelwalbusar.com",
    live: true,
  },
  {
    id: "alwar",
    index: "02",
    name: "KB Wires & Strips",
    city: "Alwar",
    state: "Rajasthan",
    kicker: "Wires & galvanised strips",
    since: "Cable & armouring division",
    accent: "#C6803B",
    accentSoft: "rgba(198, 128, 59, 0.16)",
    blurb:
      "Galvanised steel tapes, armouring wires and strips engineered as cable input for India's power and telecom infrastructure — drawn, coated and slit in-house.",
    products: ["Galvanised steel tapes", "Round armour wire", "Formed strips", "Cable accessories"],
    clients: ["Delton Cables", "Cords Cables", "Havells", "Power & telecom OEMs"],
    certs: ["ISO 9001:2015", "Heat-traced coils", "In-line gauge control"],
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    url: "#",
    live: false,
  },
  {
    id: "mcr",
    index: "03",
    name: "Metal Coatings (India) Ltd",
    city: "Faridabad",
    state: "Haryana",
    kicker: "Cold-rolled steel strips & coatings",
    since: "Since 1994 · BSE listed",
    accent: "#7FA8BD",
    accentSoft: "rgba(127, 168, 189, 0.16)",
    blurb:
      "Thirty years of cold rolling steel in Faridabad — CR and HRPO strips finished to ±0.01 mm across the width, every coil shipped with its heat number and test certificate.",
    products: ["Cold-rolled strips & coils", "HRPO coils", "Galvanised steel", "Up to 30 MT coils"],
    clients: ["Talbros Automotive", "Havells India", "Caparo India", "Satyam Auto", "Nikko Auto"],
    certs: ["BIS IS: 513:2008", "CM/L-9512364723", "±0.01 mm tolerance"],
    image:
      "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?auto=format&fit=crop&w=1600&q=80",
    url: "https://www.mcil.net",
    live: true,
  },
];
