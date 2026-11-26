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

// Leadership: Board of Directors and Key Managerial Personnel of Metal Coatings (India) Ltd,
// names, designations, profiles and photos from the MCIL website (github.com/Tamanna-57/Mcil-website).
export const leaders = [
  {
    "id": "ramesh-chander-khandelwal",
    "name": "Ramesh Chander Khandelwal",
    "role": "Chairman & Whole-time Director",
    "chip": "Promoter · Executive",
    "bio": "Mr. Ramesh Chander Khandelwal is the Chairman and Whole-time Director of the Company. Being in the capacity of Chairman, he chairs the Board of Directors and provides strategic guidance to steer the Company's overall growth and governance.\n\nAs Whole-time Director, he closely oversees the manufacturing function and contributes towards key technical aspects of operations. A Mechanical Engineer by qualification, his technical expertise in C.R. manufacturing and galvanising has helped the Company achieve substantial improvement in efficiencies.",
    "qualification": "BE (Mechanical Engineering)",
    "image": "/media/img/lead-ramesh.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Ramesh"
  },
  {
    "id": "pramod-khandelwal",
    "name": "Pramod Khandelwal",
    "role": "Managing Director",
    "chip": "Promoter · Executive",
    "bio": "Mr. Pramod Khandelwal is the Managing Director of the Company. A Chartered Accountant by qualification, he has an extensive experience in overseeing the Commercial, Financial and Marketing functions of the Company. As Managing Director, he is responsible for the Company's overall management and strategic direction, steering its day-to-day affairs in line with the Board's vision.\n\nHis rich experience and in-depth knowledge of the auto components and consumer durables markets, coupled with his ability to control and manage all financials, commercial and marketing aspects of the Company have played a pivotal role in the Company's proactive strategic decision-making and its ability to stay ahead of the competition.",
    "qualification": "B.Com (Hons.), FCA",
    "image": "/media/img/lead-pramod.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Pramod"
  },
  {
    "id": "rupali-aggarwal",
    "name": "Rupali Aggarwal",
    "role": "Non-Executive Independent Director",
    "chip": "Independent Director",
    "bio": "Mrs. Rupali Aggarwal is a Non-Executive Independent Director on the Board of the Company. She is a qualified Company Secretary and Law Graduate with over 15 years of diverse experience across industries such as Agriculture, Real Estate, Automotive, and Sugar Manufacturing.\n\nRenowned for her innovative thinking, she brings to the Board her expertise in corporate advisory, including company law, SEBI regulations, secretarial compliance, and Capital Markets. Her ability to effectively bridge theory and practice adds significant value to the Board's deliberations and strengthens the Company's governance framework.",
    "qualification": "Company Secretary, LLB",
    "image": "/media/team/rupali-aggarwal.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Rupali"
  },
  {
    "id": "sachin-khurana",
    "name": "Sachin Khurana",
    "role": "Non-Executive Independent Director",
    "chip": "Independent Director",
    "bio": "Mr. Sachin Khurana is a Non-Executive Independent Director on the Board of the Company. As an Independent Director, he provides independent oversight of the Board's functioning, holding management accountable to sound standards of corporate governance, compliance and ethical business conduct.\n\nHe also brings sound command over compliance management services including Company Law, statutory reporting, secretarial audits, labour laws and other statutory requirements — expertise that adds significant strength to the Board's governance oversight.",
    "qualification": "Company Secretary, Masters in Commerce & Law Graduate",
    "image": "/media/team/sachin-khurana.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Sachin"
  },
  {
    "id": "aanchal-gupta",
    "name": "Aanchal Gupta",
    "role": "Non-Executive Independent Director",
    "chip": "Independent Director",
    "bio": "Ms. Aanchal Gupta is a Non-Executive Independent Director on the Board of the Company. She is a seasoned professional with over 16 years of experience in finance, cost analysis, corporate governance, and risk management.\n\nAs an Independent Director, she provides objective oversight of the Company's financial and governance practices, holding management accountable to high standards of transparency, risk management and regulatory compliance. She contributed significantly to business growth, financial management, and regulatory compliance.",
    "qualification": "B.Com, CMA, MBA",
    "image": "/media/team/aanchal-gupta.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Aanchal"
  },
  {
    "id": "ram-awtar-sharma",
    "name": "Ram Awtar Sharma",
    "role": "Chief Financial Officer",
    "chip": "Key Managerial Personnel",
    "bio": "Mr. Ram Awtar Sharma is the Chief Financial Officer of the Company. He is a Member of the Institute of Chartered Accountants of India (ICAI), with a varied experience of more than 25 years in finance, accounting and taxation matters.\n\nAs CFO, he is responsible for overseeing compliance across all financial matters of the Company. He is also responsible for the Company's finance and accounts function, including the quarterly financial results published on the Stock Exchanges and accounts published in the Annual Report, besides supporting the Board with financial insights for strategic decision-making.",
    "qualification": "ACA (Associate Chartered Accountant)",
    "image": "/media/team/ram-awtar-sharma.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Ram"
  },
  {
    "id": "shimpy-goyal",
    "name": "Shimpy Goyal",
    "role": "Company Secretary & Compliance Officer",
    "chip": "Key Managerial Personnel",
    "bio": "Ms. Shimpy Goyal is the Company Secretary and Compliance Officer of the Company. She is a qualified Company Secretary with over 8 years of experience in corporate secretarial functions, regulatory filings, and listing compliance.\n\nHer expertise includes handling end-to-end ROC and SEBI compliances, drafting and vetting corporate documents, managing Board and shareholder meetings, ensuring statutory adherence and liaising with regulatory authorities. She has worked extensively on governance frameworks, disclosure requirements, and compliance management systems, contributing to smooth corporate operations and fostering a strong compliance culture within the organisation.",
    "qualification": "Company Secretary",
    "image": "/media/team/shimpy-goyal.jpg",
    "company": "Metal Coatings (India) Ltd",
    "first": "Shimpy"
  }
];
