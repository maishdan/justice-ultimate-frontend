// src/data/carData.ts

export interface Car {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  stockId: string;
  price: number;
  year: number;
  fuel: string;
  transmission: string;
  drivetrain: string;
  color: string;
  mileage: number; // in km
  location: string;
  image: string[]; // Local images
  description: string;
}

export const cars: Car[] = [
  {
    id: "mercedes-benz-s-class",
    slug: "mercedes-benz-s-class",
    name: "Mercedes‑Benz S‑Class",
    tagline: "Luxury at its finest",
    tags: ["Luxury", "Sedan", "Automatic"],
    stockId: "MB‑S12345",
    price: 15500000,
    year: 2023,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "RWD",
    color: "Obsidian Black",
    mileage: 12000,
    location: "Nairobi, Kenya",
    image: [
      "/public/cars/mercedes-s-class 1.jpg",
      "/public/cars/mercedes-s-class 2.jpg",
      "/public/cars/mercedes-s-class 3.jpg",
    ],
    description: `
      The Mercedes‑Benz S‑Class delivers unmatched comfort, cutting‑edge technology, and unparalleled prestige.
      Equipped with MBUX infotainment, executive rear seating, and a handcrafted interior —
      it’s designed for those who expect nothing short of excellence.
    `,
  },

  // src/data/carData.ts

export const carData = [
  {
    id: "car-22",
    slug: "car-22",
    name: "Decker and Sons Strategy",
    tagline: "Focused zero-defect core",
    tags: ["Imported", "Justice Quality", "Automatic"],
    stockId: "STOCK-00022",
    price: 13603465,
    year: 2020,
    fuel: "Electric",
    transmission: "Automatic",
    drivetrain: "FWD",
    color: "LightGray",
    mileage: 60892,
    location: "Nairobi, Kenya",
    image: [
      "/cars/car-22/1.jpg",
      "/cars/car-22/2.jpg",
      "/cars/car-22/3.jpg",
      "/cars/car-22/4.jpg",
      "/cars/car-22/5.jpg",
      "/cars/car-22/6.jpg",
    ],
    description:
      "From way worker find off will tonight everyone. Carry really newspaper probably bit. Ready hope against. Begin interest professor first next including staff. Training whole take continue team happen factor.",
  },

export const cars: Car[] = [
  {
    id: "toyota-land-cruiser-v8",
    slug: "toyota-land-cruiser-v8",
    name: "Toyota Land Cruiser V8",
    tagline: "Conquer any terrain",
    tags: ["SUV", "4WD", "V8"],
    stockId: "TL‑V80456",
    price: 12500000,
    year: 2022,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Pearl White",
    mileage: 48000,
    location: "Mombasa, Kenya",
    image: [
      "/public/cars/land-cruiser-v8 1.jpg",
      "/public/cars/land-cruiser-v8 2.jpg",
      "/public/cars/land-cruiser-v8 3.jpg"
    ],
    description: `
      Built for Africa’s rugged landscapes, the Land Cruiser V8 combines legendary durability
      with modern comfort. Boasting a powerful V8 engine, locking differentials,
      and plush leather interiors — it’s perfect for both safari and city life.
    `,
  },
  {
    id: "tesla-model-x",
    slug: "tesla-model-x",
    name: "Tesla Model X",
    tagline: "The future of driving",
    tags: ["Electric", "Autopilot", "Falcon Doors"],
    stockId: "TS‑X78901",
    price: 18000000,
    year: 2024,
    fuel: "Electric",
    transmission: "Single Speed",
    drivetrain: "AWD",
    color: "Midnight Silver Metallic",
    mileage: 5000,
    location: "Nairobi, Kenya",
    image: [
      "/cars/tesla-model-x/1.jpg",
      "/cars/tesla-model-x/2.jpg",
      "/cars/tesla-model-x/3.jpg"
    ],
    description: `
      The Tesla Model X redefines family SUVs with full-electric range, semi-autonomous autopilot,
      and iconic Falcon Wing doors. With zero emissions and instant torque,
      it delivers performance without compromise.
    `,
  },
  {
    id: "bmw-x3",
    slug: "bmw-x3",
    name: "BMW X3",
    tagline: "Dynamic luxury",
    tags: ["Luxury", "SUV", "Sport"],
    stockId: "BMW‑X34567",
    price: 9800000,
    year: 2023,
    fuel: "Diesel",
    transmission: "Automatic",
    drivetrain: "AWD",
    color: "Carbon Black",
    mileage: 26000,
    location: "Kisumu, Kenya",
    image: [
      "/cars/bmw-x3/1.jpg",
      "/cars/bmw-x3/2.jpg",
      "/cars/bmw-x3/3.jpg"
    ],
    description: `
      The BMW X3 blends athletic handling with everyday versatility. Featuring BMW’s xDrive,
      a responsive turbocharged engine, and high-end cabin tech — it’s ideal for both family outings
      and spirited drives.
    `,
  },
  {
    id: "toyota-prado-2018",
    slug: "toyota-prado-2018",
    name: "Toyota Prado 2018",
    tagline: "Versatility & strength",
    tags: ["SUV", "DIESEL", "4WD"],
    stockId: "PR‑2018A89",
    price: 7800000,
    year: 2018,
    fuel: "Diesel",
    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Graphite Grey",
    mileage: 82000,
    location: "Nakuru, Kenya",
    image: [
      "/cars/prado-2018/1.jpg",
      "/cars/prado-2018/2.jpg",
      "/cars/prado-2018/3.jpg"
    ],
    description: `
      The 2018 Toyota Prado is built tough for both urban roads and backcountry routes.
      With durable diesel torque, full-time 4WD capability, and a comfortable interior,
      it’s a reliable partner for professionals and families alike.
    `,
  },
  {
    id: "car-06",
    slug: "car-06",
    name: "Lewis LLC Discuss",
    tagline: "Cross-platform mission-critical benchmark",
    tags: ["Imported", "Justice Quality", "Manual"],
    stockId: "STOCK-00006",
    price: 19062139,
    year: 2022,
    fuel: "Petrol",
    transmission: "Manual",
    drivetrain: "RWD",
    color: "Plum",
    mileage: 59970,
    location: "Nakuru, Kenya",
    image: [
      "/cars/car-06/1.jpg",
      "/cars/car-06/2.jpg",
      "/cars/car-06/3.jpg",
      "/cars/car-06/4.jpg",
      "/cars/car-06/5.jpg",
      "/cars/car-06/6.jpg"
    ],
    description: `
      Teacher you involve. By may pressure food morning. Time parent point stage still down marriage.
      Interest increase I concern responsibility sense.
    `
  },
  {
    id: "car-07",
    slug: "car-07",
    name: "Morales-Collins Among",
    tagline: "Fully-configurable maximized access",
    tags: ["Imported", "Justice Quality", "Automatic"],
    stockId: "STOCK-00007",
    price: 6078305,
    year: 2022,
    fuel: "Hybrid",
    transmission: "Automatic",
    drivetrain: "4WD",
    color: "Navy",
    mileage: 11246,
    location: "Nairobi, Kenya",
    image: [
      "/cars/car-07/1.jpg",
      "/cars/car-07/2.jpg",
      "/cars/car-07/3.jpg",
      "/cars/car-07/4.jpg",
      "/cars/car-07/5.jpg",
      "/cars/car-07/6.jpg"
    ],
    description: `
      Could baby shake discover toward reality growth. Series their list foot.
      Girl view focus.
    `
  },
  {
    id: "car-08",
    slug: "car-08",
    name: "Gregory and Sons Of",
    tagline: "Open-architected zero-defect orchestration",
    tags: ["Imported", "Justice Quality", "Single Speed"],
    stockId: "STOCK-00008",
    price: 17885666,
    year: 2023,
    fuel: "Electric",
    transmission: "Single Speed",
    drivetrain: "FWD",
    color: "LightSteelBlue",
    mileage: 39797,
    location: "Nakuru, Kenya",
    image: [
      "/cars/car-08/1.jpg",
      "/cars/car-08/2.jpg",
      "/cars/car-08/3.jpg",
      "/cars/car-08/4.jpg",
      "/cars/car-08/5.jpg",
      "/cars/car-08/6.jpg"
    ],
    description: `
      Crime health for thing. Term involve accept government member short also.
      Rich blue list know art girl increase. However soon very hour conference participant case.
    `
  }
];

export const carData = [
  {
    id: "car-09",
    slug: "car-09",
    name: "Parker-Zimmerman Have",
    tagline: "Synergistic fresh-thinking projection",
    tags: ["Imported", "Justice Quality", "Single Speed"],
    stockId: "STOCK-00009",
    price: 9362383,
    year: 2021,
    fuel: "Hybrid",
    transmission: "Single Speed",
    drivetrain: "4WD",
    color: "CornflowerBlue",
    mileage: 59978,
    location: "Nakuru, Kenya",
    image: [
      "/cars/car-09/1.jpg",
      "/cars/car-09/2.jpg",
      "/cars/car-09/3.jpg",
      "/cars/car-09/4.jpg",
      "/cars/car-09/5.jpg",
      "/cars/car-09/6.jpg"
    ],
    description:
      "Establish let society kid draw. Age each out guy final agency serious. Table appear lawyer. Director part she system. City much skill serious sit. Easy subject stuff behind. Artist four serious president share."
  },
  {
    id: "car-10",
    slug: "car-10",
    name: "Mccullough-Kim Bit",
    tagline: "Programmable asynchronous core",
    tags: ["Imported", "Justice Quality", "Single Speed"],
    stockId: "STOCK-00010",
    price: 14924548,
    year: 2021,
    fuel: "Diesel",
    transmission: "Single Speed",
    drivetrain: "RWD",
    color: "PaleGoldenRod",
    mileage: 59091,
    location: "Kisumu, Kenya",
    image: [
      "/cars/car-10/1.jpg",
      "/cars/car-10/2.jpg",
      "/cars/car-10/3.jpg",
      "/cars/car-10/4.jpg",
      "/cars/car-10/5.jpg",
      "/cars/car-10/6.jpg"
    ],
    description:
      "Good wind fish feeling. Its trade think. Health anything happy effect work thousand first. Drug level anything vote drive worker nearly. Cup oil beautiful he design town respond make. Fire process watch top class major easy."
  },
  {
    id: "car-11",
    slug: "car-11",
    name: "Smith-Jacobs Write",
    tagline: "Cross-group discrete open architecture",
    tags: ["Imported", "Justice Quality", "Single Speed"],
    stockId: "STOCK-00011",
    price: 5956615,
    year: 2022,
    fuel: "Petrol",
    transmission: "Single Speed",
    drivetrain: "4WD",
    color: "Red",
    mileage: 76532,
    location: "Kisumu, Kenya",
    image: [
      "/cars/car-11/1.jpg",
      "/cars/car-11/2.jpg",
      "/cars/car-11/3.jpg",
      "/cars/car-11/4.jpg",
      "/cars/car-11/5.jpg",
      "/cars/car-11/6.jpg"
    ],
    description:
      "Thus determine rich fire spring most. Because hundred structure. Radio price language beat hotel community thousand concern. And happen music look strong."
  },
  {
    id: "car-12",
    slug: "car-12",
    name: "Manning, Guerrero and Allen Prevent",
    tagline: "Optional explicit synergy",
    tags: ["Imported", "Justice Quality", "Single Speed"],
    stockId: "STOCK-00012",
    price: 5062135,
    year: 2022,
    fuel: "Diesel",
    transmission: "Single Speed",
    drivetrain: "4WD",
    color: "PapayaWhip",
    mileage: 58450,
    location: "Nakuru, Kenya",
    image: [
      "/cars/car-12/1.jpg",
      "/cars/car-12/2.jpg",
      "/cars/car-12/3.jpg",
      "/cars/car-12/4.jpg",
      "/cars/car-12/5.jpg",
      "/cars/car-12/6.jpg"
    ],
    description:
      "Old great establish cold prepare soldier identify. Economic write team or effort region. Heavy to all loss face. Up fill page field. Everything may inside likely. Commercial cut despite despite."
  },
  {
    id: "car-13",
    slug: "car-13",
    name: "Kelly PLC Especially",
    tagline: "Function-based cohesive interface",
    tags: ["Imported", "Justice Quality", "Single Speed"],
    stockId: "STOCK-00013",
    price: 6810060,
    year: 2023,
    fuel: "Diesel",
    transmission: "Single Speed",
    drivetrain: "AWD",
    color: "DarkOrchid",
    mileage: 87730,
    location: "Kisumu, Kenya",
    image: [
      "/cars/car-13/1.jpg",
      "/cars/car-13/2.jpg",
      "/cars/car-13/3.jpg",
      "/cars/car-13/4.jpg",
      "/cars/car-13/5.jpg",
      "/cars/car-13/6.jpg"
    ],
    description:
      "Art institution house while without range. Quickly finally key factor peace. Deal east man feel argue. Break today his much professional."
  }
];

[
  {
    "id": "car-14",
    "slug": "car-14",
    "name": "Brown-Hunter Young",
    "tagline": "Multi-channeled even-keeled collaboration",
    "tags": [
      "Imported",
      "Justice Quality",
      "Automatic"
    ],
    "stockId": "STOCK-00014",
    "price": 14407296,
    "year": 2022,
    "fuel": "Petrol",
    "transmission": "Automatic",
    "drivetrain": "4WD",
    "color": "LightSlateGray",
    "mileage": 77607,
    "location": "Nakuru, Kenya",
    "image": [
      "/cars/car-14/1.jpg",
      "/cars/car-14/2.jpg",
      "/cars/car-14/3.jpg",
      "/cars/car-14/4.jpg",
      "/cars/car-14/5.jpg",
      "/cars/car-14/6.jpg"
    ],
    "description": "Less stop appear site artist. Among thing when news each style. Almost trial college during because someone. Better have research. These sit seven she Democrat successful vote improve. I nothing run food she number."
  },
  {
    "id": "car-15",
    "slug": "car-15",
    "name": "Mahoney PLC Feel",
    "tagline": "Grass-roots incremental contingency",
    "tags": [
      "Imported",
      "Justice Quality",
      "Automatic"
    ],
    "stockId": "STOCK-00015",
    "price": 10132631,
    "year": 2022,
    "fuel": "Electric",
    "transmission": "Automatic",
    "drivetrain": "4WD",
    "color": "Coral",
    "mileage": 56435,
    "location": "Nairobi, Kenya",
    "image": [
      "/cars/car-15/1.jpg",
      "/cars/car-15/2.jpg",
      "/cars/car-15/3.jpg",
      "/cars/car-15/4.jpg",
      "/cars/car-15/5.jpg",
      "/cars/car-15/6.jpg"
    ],
    "description": "Understand firm bill serious message most. Building these difference suffer adult visit. Production notice because age without. Write rest military read learn. Field so interest two opportunity describe. Hear thank director should key once may."
  },
  {
    "id": "car-16",
    "slug": "car-16",
    "name": "Evans LLC Create",
    "tagline": "Visionary bi-directional encryption",
    "tags": [
      "Imported",
      "Justice Quality",
      "Single Speed"
    ],
    "stockId": "STOCK-00016",
    "price": 19596546,
    "year": 2024,
    "fuel": "Hybrid",
    "transmission": "Single Speed",
    "drivetrain": "4WD",
    "color": "ForestGreen",
    "mileage": 76788,
    "location": "Mombasa, Kenya",
    "image": [
      "/cars/car-16/1.jpg",
      "/cars/car-16/2.jpg",
      "/cars/car-16/3.jpg",
      "/cars/car-16/4.jpg",
      "/cars/car-16/5.jpg",
      "/cars/car-16/6.jpg"
    ],
    "description": "Reduce realize fund easy. Question hospital then describe scientist would. Business since should idea worker us yes politics. Against message activity them. Teacher wide human kid. Education area identify star next."
  }
]
  {
    "id": "car-17",
    "slug": "car-17",
    "name": "Taylor-Edwards Important",
    "tagline": "Proactive fresh-thinking structure",
    "tags": [
      "Imported",
      "Justice Quality",
      "Manual"
    ],
    "stockId": "STOCK-00017",
    "price": 5774221,
    "year": 2023,
    "fuel": "Petrol",
    "transmission": "Manual",
    "drivetrain": "FWD",
    "color": "GreenYellow",
    "mileage": 76031,
    "location": "Nakuru, Kenya",
    "image": [
      "/cars/car-17/1.jpg",
      "/cars/car-17/2.jpg",
      "/cars/car-17/3.jpg",
      "/cars/car-17/4.jpg",
      "/cars/car-17/5.jpg",
      "/cars/car-17/6.jpg"
    ],
    "description": "Hospital make marriage mention beautiful return present. Range body seek bag. Total again ten remember upon discover over drug."
  },
  {
    "id": "car-18",
    "slug": "car-18",
    "name": "Day-Mayer Everything",
    "tagline": "Upgradable user-facing encryption",
    "tags": [
      "Imported",
      "Justice Quality",
      "Manual"
    ],
    "stockId": "STOCK-00018",
    "price": 6269265,
    "year": 2024,
    "fuel": "Diesel",
    "transmission": "Manual",
    "drivetrain": "RWD",
    "color": "DarkBlue",
    "mileage": 39560,
    "location": "Nakuru, Kenya",
    "image": [
      "/cars/car-18/1.jpg",
      "/cars/car-18/2.jpg",
      "/cars/car-18/3.jpg",
      "/cars/car-18/4.jpg",
      "/cars/car-18/5.jpg",
      "/cars/car-18/6.jpg"
    ],
    "description": "Alone care town rich Congress employee. Continue hundred end camera suffer yeah. Why admit site generation outside stuff art. Through notice material music national discuss class. Generation their we tend firm character."
  },
  {
    "id": "car-19",
    "slug": "car-19",
    "name": "Cameron-Nielsen Life",
    "tagline": "Total client-server info-mediaries",
    "tags": [
      "Imported",
      "Justice Quality",
      "Manual"
    ],
    "stockId": "STOCK-00019",
    "price": 13917158,
    "year": 2022,
    "fuel": "Diesel",
    "transmission": "Manual",
    "drivetrain": "FWD",
    "color": "SkyBlue",
    "mileage": 63881,
    "location": "Nairobi, Kenya",
    "image": [
      "/cars/car-19/1.jpg",
      "/cars/car-19/2.jpg",
      "/cars/car-19/3.jpg",
      "/cars/car-19/4.jpg",
      "/cars/car-19/5.jpg",
      "/cars/car-19/6.jpg"
    ],
    "description": "White ever hair subject. American view kitchen example dream rest. Myself state talk mind. Practice kitchen happy create similar believe. Simple face good reveal yet although."
  },
  {
    "id": "car-20",
    "slug": "car-20",
    "name": "Romero, Sanchez and Roberts Loss",
    "tagline": "Multi-channeled multimedia framework",
    "tags": [
      "Imported",
      "Justice Quality",
      "Single Speed"
    ],
    "stockId": "STOCK-00020",
    "price": 13249702,
    "year": 2024,
    "fuel": "Electric",
    "transmission": "Single Speed",
    "drivetrain": "RWD",
    "color": "Aqua",
    "mileage": 37426,
    "location": "Nakuru, Kenya",
    "image": [
      "/cars/car-20/1.jpg",
      "/cars/car-20/2.jpg",
      "/cars/car-20/3.jpg",
      "/cars/car-20/4.jpg",
      "/cars/car-20/5.jpg",
      "/cars/car-20/6.jpg"
    ],
    "description": "Culture chair six return benefit. Project plant girl myself. Ever something like easy type still. Develop serve five. Morning wait month race."
  },
  {
    "id": "car-21",
    "slug": "car-21",
    "name": "Smith Ltd Three",
    "tagline": "Centralized real-time concept",
    "tags": [
      "Imported",
      "Justice Quality",
      "Manual"
    ],
    "stockId": "STOCK-00021",
    "price": 6318018,
    "year": 2021,
    "fuel": "Diesel",
    "transmission": "Manual",
    "drivetrain": "FWD",
    "color": "Black",
    "mileage": 20963,
    "location": "Nakuru, Kenya",
    "image": [
      "/cars/car-21/1.jpg",
      "/cars/car-21/2.jpg",
      "/cars/car-21/3.jpg",
      "/cars/car-21/4.jpg",
      "/cars/car-21/5.jpg",
      "/cars/car-21/6.jpg"
    ],
    "description": "Industry receive who friend represent reality. Career central during just. Onto explain represent nation better soldier court."
  },
 [
  {
    "id": "car-22",
    "slug": "car-22",
    "name": "Decker and Sons Strategy",
    "tagline": "Focused zero-defect core",
    "tags": ["Imported", "Justice Quality", "Automatic"],
    "stockId": "STOCK-00022",
    "price": 13603465,
    "year": 2020,
    "fuel": "Electric",
    "transmission": "Automatic",
    "drivetrain": "FWD",
    "color": "LightGray",
    "mileage": 60892,
    "location": "Nairobi, Kenya",
    "image": [
      "/cars/car-22/1.jpg",
      "/cars/car-22/2.jpg",
      "/cars/car-22/3.jpg",
      "/cars/car-22/4.jpg",
      "/cars/car-22/5.jpg",
      "/cars/car-22/6.jpg"
    ],
    "description": "From way worker find off will tonight everyone. Carry really newspaper probably bit. Ready hope against. Begin interest professor first next including staff. Training whole take continue team happen factor."
  },
  {
    "id": "car-23",
    "slug": "car-23",
    "name": "Henderson-Martinez Machine",
    "tagline": "Cloned optimizing data-warehouse",
    "tags": ["Imported", "Justice Quality", "Single Speed"],
    "stockId": "STOCK-00023",
    "price": 6517054,
    "year": 2020,
    "fuel": "Petrol",
    "transmission": "Single Speed",
    "drivetrain": "4WD",
    "color": "MediumSeaGreen",
    "mileage": 35328,
    "location": "Mombasa, Kenya",
    "image": [
      "/cars/car-23/1.jpg",
      "/cars/car-23/2.jpg",
      "/cars/car-23/3.jpg",
      "/cars/car-23/4.jpg",
      "/cars/car-23/5.jpg",
      "/cars/car-23/6.jpg"
    ],
    "description": "Letter help maintain ago standard. Open somebody if author night little impact. Movement fill think chance play."
  },
  {
    "id": "car-24",
    "slug": "car-24",
    "name": "Robinson-Rivera Evidence",
    "tagline": "Digitized mobile projection",
    "tags": ["Imported", "Justice Quality", "Automatic"],
    "stockId": "STOCK-00024",
    "price": 15428381,
    "year": 2024,
    "fuel": "Electric",
    "transmission": "Automatic",
    "drivetrain": "4WD",
    "color": "PeachPuff",
    "mileage": 86337,
    "location": "Kisumu, Kenya",
    "image": [
      "/cars/car-24/1.jpg",
      "/cars/car-24/2.jpg",
      "/cars/car-24/3.jpg",
      "/cars/car-24/4.jpg",
      "/cars/car-24/5.jpg",
      "/cars/car-24/6.jpg"
    ],
    "description": "Agency industry star above establish hour. Hard way financial listen party eat of. In personal their economic play bit. Subject view world baby public scientist. Contain lay deep training nor government her admit."
  },
  {
    "id": "car-25",
    "slug": "car-25",
    "name": "Myers, Brown and Shaffer Back",
    "tagline": "User-friendly incremental workforce",
    "tags": ["Imported", "Justice Quality", "Single Speed"],
    "stockId": "STOCK-00025",
    "price": 16132453,
    "year": 2023,
    "fuel": "Hybrid",
    "transmission": "Single Speed",
    "drivetrain": "AWD",
    "color": "DarkSlateBlue",
    "mileage": 75810,
    "location": "Mombasa, Kenya",
    "image": [
      "/cars/car-25/1.jpg",
      "/cars/car-25/2.jpg",
      "/cars/car-25/3.jpg",
      "/cars/car-25/4.jpg",
      "/cars/car-25/5.jpg",
      "/cars/car-25/6.jpg"
    ],
    "description": "Word research this everybody ground finally to. Amount majority dark of. All money budget future west onto my. Charge firm form central shoulder improve style."
  },
  {
    "id": "car-26",
    "slug": "car-26",
    "name": "Nelson Ltd Without",
    "tagline": "Ameliorated methodical encryption",
    "tags": ["Imported", "Justice Quality", "Single Speed"],
    "stockId": "STOCK-00026",
    "price": 15220944,
    "year": 2022,
    "fuel": "Diesel",
    "transmission": "Single Speed",
    "drivetrain": "4WD",
    "color": "BlueViolet",
    "mileage": 90025,
    "location": "Kisumu, Kenya",
    "image": [
      "/cars/car-26/1.jpg",
      "/cars/car-26/2.jpg",
      "/cars/car-26/3.jpg",
      "/cars/car-26/4.jpg",
      "/cars/car-26/5.jpg",
      "/cars/car-26/6.jpg"
    ],
    "description": "Certainly break protect sometimes student evening perform maintain. Simply statement material bring newspaper animal since. Alone sit example audience collection keep. Mind day us player population analysis. Hard impact message speech."
  },
  {
    "id": "car-27",
    "slug": "car-27",
    "name": "Trujillo, Roth and Garcia Type",
    "tagline": "Total responsive archive",
    "tags": ["Imported", "Justice Quality", "Automatic"],
    "stockId": "STOCK-00027",
    "price": 11011248,
    "year": 2023,
    "fuel": "Electric",
    "transmission": "Automatic",
    "drivetrain": "AWD",
    "color": "DarkOliveGreen",
    "mileage": 24714,
    "location": "Nakuru, Kenya",
    "image": [
      "/cars/car-27/1.jpg",
      "/cars/car-27/2.jpg",
      "/cars/car-27/3.jpg",
      "/cars/car-27/4.jpg",
      "/cars/car-27/5.jpg",
      "/cars/car-27/6.jpg"
    ],
    "description": "Necessary easy on court option resource. Say cut red compare word. Century table later today toward PM affect try."
  },
  {
    "id": "car-28",
    "slug": "car-28",
    "name": "Lara, Hendricks and Hill Focus",
    "tagline": "Synergistic background capacity",
    "tags": ["Imported", "Justice Quality", "Manual"],
    "stockId": "STOCK-00028",
    "price": 18593970,
    "year": 2023,
    "fuel": "Hybrid",
    "transmission": "Manual",
    "drivetrain": "FWD",
    "color": "AliceBlue",
    "mileage": 19335,
    "location": "Mombasa, Kenya",
    "image": [
      "/cars/car-28/1.jpg",
      "/cars/car-28/2.jpg",
      "/cars/car-28/3.jpg",
      "/cars/car-28/4.jpg",
      "/cars/car-28/5.jpg",
      "/cars/car-28/6.jpg"
    ],
    "description": "Poor interest end who. Arm important husband. Herself environmental similar lay two. Local authority thus beat listen old fear. Tv go fact. Real large very finish throughout keep."
  },
  {
    "id": "car-29",
    "slug": "car-29",
    "name": "Golden Group Religious",
    "tagline": "Assimilated uniform algorithm",
    "tags": ["Imported", "Justice Quality", "Automatic"],
    "stockId": "STOCK-00029",
    "price": 4664251,
    "year": 2023,
    "fuel": "Hybrid",
    "transmission": "Automatic",
    "drivetrain": "4WD",
    "color": "LimeGreen",
    "mileage": 62880,
    "location": "Mombasa, Kenya",
    "image": [
      "/cars/car-29/1.jpg",
      "/cars/car-29/2.jpg",
      "/cars/car-29/3.jpg",
      "/cars/car-29/4.jpg",
      "/cars/car-29/5.jpg",
      "/cars/car-29/6.jpg"
    ],
    "description": "Among section dream individual their. System anything between. Something always already another material. Wide serious leg sing teacher threat. Conference really let example team."
  }
]

{
  "id": "car-30",
  "slug": "car-30",
  "name": "Thomas-Gardner Present",
  "tagline": "Multi-lateral solution-oriented moderator",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00030",
  "price": 5123822,
  "year": 2023,
  "fuel": "Petrol",
  "transmission": "Automatic",
  "drivetrain": "AWD",
  "color": "Violet",
  "mileage": 51470,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-30/1.jpg",
    "/cars/car-30/2.jpg",
    "/cars/car-30/3.jpg",
    "/cars/car-30/4.jpg",
    "/cars/car-30/5.jpg",
    "/cars/car-30/6.jpg"
  ],
  "description": "Ok our couple gas free perform. Head understand difficult one million. Still war nice my daughter management really."
},
{
  "id": "car-31",
  "slug": "car-31",
  "name": "Hunter-Jenkins More",
  "tagline": "Versatile impactful process improvement",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00031",
  "price": 6129002,
  "year": 2020,
  "fuel": "Hybrid",
  "transmission": "Single Speed",
  "drivetrain": "FWD",
  "color": "Sienna",
  "mileage": 13343,
  "location": "Kisumu, Kenya",
  "image": [
    "/cars/car-31/1.jpg",
    "/cars/car-31/2.jpg",
    "/cars/car-31/3.jpg",
    "/cars/car-31/4.jpg",
    "/cars/car-31/5.jpg",
    "/cars/car-31/6.jpg"
  ],
  "description": "Theory cup important order majority page education. During class outside. You realize on issue use car role. Voice trade challenge process cell available page. Senior expect million turn."
},
{
  "id": "car-32",
  "slug": "car-32",
  "name": "Payne-Fox Hundred",
  "tagline": "Innovative system-worthy architecture",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00032",
  "price": 6013072,
  "year": 2022,
  "fuel": "Petrol",
  "transmission": "Automatic",
  "drivetrain": "4WD",
  "color": "DarkOrange",
  "mileage": 61804,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-32/1.jpg",
    "/cars/car-32/2.jpg",
    "/cars/car-32/3.jpg",
    "/cars/car-32/4.jpg",
    "/cars/car-32/5.jpg",
    "/cars/car-32/6.jpg"
  ],
  "description": "Thing business however perhaps glass. Value teach see. Though wear candidate husband. Practice need thousand."
},
{
  "id": "car-33",
  "slug": "car-33",
  "name": "Lopez, Garner and Turner Near",
  "tagline": "Digitized explicit system engine",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00033",
  "price": 15252476,
  "year": 2022,
  "fuel": "Diesel",
  "transmission": "Manual",
  "drivetrain": "FWD",
  "color": "DarkSlateBlue",
  "mileage": 99268,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-33/1.jpg",
    "/cars/car-33/2.jpg",
    "/cars/car-33/3.jpg",
    "/cars/car-33/4.jpg",
    "/cars/car-33/5.jpg",
    "/cars/car-33/6.jpg"
  ],
  "description": "Together writer finish show probably course country. Check speak step beyond poor interview pressure. Section else add available notice group maintain."
},
{
  "id": "car-34",
  "slug": "car-34",
  "name": "Young LLC Ok",
  "tagline": "Self-enabling next generation productivity",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00034",
  "price": 19836522,
  "year": 2021,
  "fuel": "Petrol",
  "transmission": "Single Speed",
  "drivetrain": "RWD",
  "color": "Cyan",
  "mileage": 11060,
  "location": "Nairobi, Kenya",
  "image": [
    "/cars/car-34/1.jpg",
    "/cars/car-34/2.jpg",
    "/cars/car-34/3.jpg",
    "/cars/car-34/4.jpg",
    "/cars/car-34/5.jpg",
    "/cars/car-34/6.jpg"
  ],
  "description": "Middle firm become end keep thing. Blood turn girl. Kind speech test foreign. Still law cover why rather growth space. Land red country house coach create. Address trouble political whole window."
},
{
  "id": "car-35",
  "slug": "car-35",
  "name": "Tucker and Sons Heart",
  "tagline": "Upgradable logistical model",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00035",
  "price": 10456753,
  "year": 2023,
  "fuel": "Electric",
  "transmission": "Single Speed",
  "drivetrain": "FWD",
  "color": "FireBrick",
  "mileage": 43819,
  "location": "Nairobi, Kenya",
  "image": [
    "/cars/car-35/1.jpg",
    "/cars/car-35/2.jpg",
    "/cars/car-35/3.jpg",
    "/cars/car-35/4.jpg",
    "/cars/car-35/5.jpg",
    "/cars/car-35/6.jpg"
  ],
  "description": "South road four woman ground time well. Street yeah member recent yeah training. Participant end anything increase boy. Cost practice since floor tend camera value."
},
{
  "id": "car-36",
  "slug": "car-36",
  "name": "Bowen, Thomas and Marks Country",
  "tagline": "Advanced static monitoring",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00036",
  "price": 16113820,
  "year": 2022,
  "fuel": "Electric",
  "transmission": "Manual",
  "drivetrain": "AWD",
  "color": "Linen",
  "mileage": 24777,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-36/1.jpg",
    "/cars/car-36/2.jpg",
    "/cars/car-36/3.jpg",
    "/cars/car-36/4.jpg",
    "/cars/car-36/5.jpg",
    "/cars/car-36/6.jpg"
  ],
  "description": "Him others wife attack sea hit. Simply us process light. Tree age force share the shake theory. Up now hospital blood born."
},
{
  "id": "car-37",
  "slug": "car-37",
  "name": "Stevenson-Long If",
  "tagline": "Mandatory scalable neural-net",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00037",
  "price": 15866674,
  "year": 2024,
  "fuel": "Petrol",
  "transmission": "Automatic",
  "drivetrain": "FWD",
  "color": "MistyRose",
  "mileage": 71527,
  "location": "Kisumu, Kenya",
  "image": [
    "/cars/car-37/1.jpg",
    "/cars/car-37/2.jpg",
    "/cars/car-37/3.jpg",
    "/cars/car-37/4.jpg",
    "/cars/car-37/5.jpg",
    "/cars/car-37/6.jpg"
  ],
  "description": "Religious drop decade pay add. Race agreement marriage rate total use opportunity. Gas story dream quality whose inside. Smile expert environment authority deal almost. Catch herself those. Address born suffer different mouth. Even now investment."
},
{
  "id": "car-38",
  "slug": "car-38",
  "name": "Thomas-Powell Bed",
  "tagline": "Inverse systematic forecast",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00038",
  "price": 19930224,
  "year": 2021,
  "fuel": "Hybrid",
  "transmission": "Automatic",
  "drivetrain": "4WD",
  "color": "FireBrick",
  "mileage": 31560,
  "location": "Kisumu, Kenya",
  "image": [
    "/cars/car-38/1.jpg",
    "/cars/car-38/2.jpg",
    "/cars/car-38/3.jpg",
    "/cars/car-38/4.jpg",
    "/cars/car-38/5.jpg",
    "/cars/car-38/6.jpg"
  ],
  "description": "Range move section western change water dog. Capital very attention example office so particular. Customer middle both simply card after. Financial appear key already kitchen. Garden share size particular learn. Morning big term million or close."
},
{
  "id": "car-39",
  "slug": "car-39",
  "name": "Mccann, Ali and Sanchez Amount",
  "tagline": "Switchable logistical standardization",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00039",
  "price": 12518163,
  "year": 2020,
  "fuel": "Hybrid",
  "transmission": "Manual",
  "drivetrain": "FWD",
  "color": "LightBlue",
  "mileage": 71625,
  "location": "Kisumu, Kenya",
  "image": [
    "/cars/car-39/1.jpg",
    "/cars/car-39/2.jpg",
    "/cars/car-39/3.jpg",
    "/cars/car-39/4.jpg",
    "/cars/car-39/5.jpg",
    "/cars/car-39/6.jpg"
  ],
  "description": "Information rest know third rate media. Three trial name possible. To career ability. Marriage enter mother cause foreign late. People power me current avoid account race."
},
{
  "id": "car-40",
  "slug": "car-40",
  "name": "Hall-Gordon Add",
  "tagline": "Down-sized maximized challenge",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00040",
  "price": 9591135,
  "year": 2023,
  "fuel": "Petrol",
  "transmission": "Automatic",
  "drivetrain": "FWD",
  "color": "DarkGray",
  "mileage": 13376,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-40/1.jpg",
    "/cars/car-40/2.jpg",
    "/cars/car-40/3.jpg",
    "/cars/car-40/4.jpg",
    "/cars/car-40/5.jpg",
    "/cars/car-40/6.jpg"
  ],
  "description": "Well they food exactly understand. Indeed somebody worry performance media. Direction create consumer great teach ago."
},
{
  "id": "car-41",
  "slug": "car-41",
  "name": "Schultz, Walker and Perry Tend",
  "tagline": "Reactive real-time firmware",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00041",
  "price": 11994807,
  "year": 2024,
  "fuel": "Diesel",
  "transmission": "Automatic",
  "drivetrain": "FWD",
  "color": "Olive",
  "mileage": 73774,
  "location": "Nairobi, Kenya",
  "image": [
    "/cars/car-41/1.jpg",
    "/cars/car-41/2.jpg",
    "/cars/car-41/3.jpg",
    "/cars/car-41/4.jpg",
    "/cars/car-41/5.jpg",
    "/cars/car-41/6.jpg"
  ],
  "description": "Born follow any director. Also beat live not. Situation gas site all what language they. Describe president space blue west."
},
{
  "id": "car-42",
  "slug": "car-42",
  "name": "Day, Farmer and Anderson Media",
  "tagline": "Polarized non-volatile hardware",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00042",
  "price": 15847159,
  "year": 2021,
  "fuel": "Electric",
  "transmission": "Automatic",
  "drivetrain": "RWD",
  "color": "Chartreuse",
  "mileage": 89843,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-42/1.jpg",
    "/cars/car-42/2.jpg",
    "/cars/car-42/3.jpg",
    "/cars/car-42/4.jpg",
    "/cars/car-42/5.jpg",
    "/cars/car-42/6.jpg"
  ],
  "description": "One above artist reflect never TV adult. Water second letter send. Picture want few threat reality start heavy."
},
{
  "id": "car-43",
  "slug": "car-43",
  "name": "Yu, Long and Fernandez Line",
  "tagline": "Fully-configurable exuding open system",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00043",
  "price": 14601381,
  "year": 2023,
  "fuel": "Petrol",
  "transmission": "Manual",
  "drivetrain": "FWD",
  "color": "Bisque",
  "mileage": 49983,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-43/1.jpg",
    "/cars/car-43/2.jpg",
    "/cars/car-43/3.jpg",
    "/cars/car-43/4.jpg",
    "/cars/car-43/5.jpg",
    "/cars/car-43/6.jpg"
  ],
  "description": "Reveal record have opportunity sort. Former explain last much reduce every. Billion over plant recent. Young grow clear and campaign."
},
{
  "id": "car-44",
  "slug": "car-44",
  "name": "Davis-Lucas Computer",
  "tagline": "Progressive discrete functionalities",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00044",
  "price": 6613333,
  "year": 2022,
  "fuel": "Electric",
  "transmission": "Manual",
  "drivetrain": "4WD",
  "color": "MediumVioletRed",
  "mileage": 66491,
  "location": "Nairobi, Kenya",
  "image": [
    "/cars/car-44/1.jpg",
    "/cars/car-44/2.jpg",
    "/cars/car-44/3.jpg",
    "/cars/car-44/4.jpg",
    "/cars/car-44/5.jpg",
    "/cars/car-44/6.jpg"
  ],
  "description": "Race record door couple charge continue Mr. Same most citizen whose training various week. Rock public beat until necessary blood. Trade position remain view successful suffer. Tough example close. Suggest wall condition material. Most bad hot."
},
{
  "id": "car-45",
  "slug": "car-45",
  "name": "Warren-Schmidt Religious",
  "tagline": "Streamlined web-enabled database",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00045",
  "price": 17407080,
  "year": 2020,
  "fuel": "Hybrid",
  "transmission": "Manual",
  "drivetrain": "AWD",
  "color": "DarkOrange",
  "mileage": 76445,
  "location": "Nairobi, Kenya",
  "image": [
    "/cars/car-45/1.jpg",
    "/cars/car-45/2.jpg",
    "/cars/car-45/3.jpg",
    "/cars/car-45/4.jpg",
    "/cars/car-45/5.jpg",
    "/cars/car-45/6.jpg"
  ],
  "description": "Language than she. Trouble on others audience record truth husband. Fast scientist book partner body last actually purpose. American we agent social. Result animal threat impact business across."
},
{
  "id": "car-46",
  "slug": "car-46",
  "name": "Barrett-Nelson Effect",
  "tagline": "Team-oriented context-sensitive approach",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00046",
  "price": 4657887,
  "year": 2023,
  "fuel": "Hybrid",
  "transmission": "Automatic",
  "drivetrain": "FWD",
  "color": "DarkOrchid",
  "mileage": 57553,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-46/1.jpg",
    "/cars/car-46/2.jpg",
    "/cars/car-46/3.jpg",
    "/cars/car-46/4.jpg",
    "/cars/car-46/5.jpg",
    "/cars/car-46/6.jpg"
  ],
  "description": "Become before tonight each. Necessary meet line recognize go stay just. West bad in where control. Wife woman practice government personal will one most."
},
{
  "id": "car-47",
  "slug": "car-47",
  "name": "Blackwell Ltd Kitchen",
  "tagline": "Persevering static array",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00047",
  "price": 14171564,
  "year": 2020,
  "fuel": "Petrol",
  "transmission": "Single Speed",
  "drivetrain": "AWD",
  "color": "Beige",
  "mileage": 23570,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-47/1.jpg",
    "/cars/car-47/2.jpg",
    "/cars/car-47/3.jpg",
    "/cars/car-47/4.jpg",
    "/cars/car-47/5.jpg",
    "/cars/car-47/6.jpg"
  ],
  "description": "Court bring its answer. Alone type short history machine religious. Possible star road decade reflect adult agency one. Gun power simple tree usually. Will everything able number. Than conference color exist way community. By mission system bank."
},
{
  "id": "car-48",
  "slug": "car-48",
  "name": "Walker-Roth Present",
  "tagline": "Sharable intermediate standardization",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00048",
  "price": 7986193,
  "year": 2024,
  "fuel": "Hybrid",
  "transmission": "Single Speed",
  "drivetrain": "AWD",
  "color": "SteelBlue",
  "mileage": 68862,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-48/1.jpg",
    "/cars/car-48/2.jpg",
    "/cars/car-48/3.jpg",
    "/cars/car-48/4.jpg",
    "/cars/car-48/5.jpg",
    "/cars/car-48/6.jpg"
  ],
  "description": "Kid exist set quite leg same. Short future operation officer around. Training make evidence game father break. So statement bank technology. Cultural history call admit number social have. Rate major gun fear not ten nation yes."
},
{
  "id": "car-49",
  "slug": "car-49",
  "name": "Cross LLC Security",
  "tagline": "Organic radical knowledgebase",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00049",
  "price": 5356832,
  "year": 2024,
  "fuel": "Diesel",
  "transmission": "Single Speed",
  "drivetrain": "RWD",
  "color": "Maroon",
  "mileage": 49330,
  "location": "Kisumu, Kenya",
  "image": [
    "/cars/car-49/1.jpg",
    "/cars/car-49/2.jpg",
    "/cars/car-49/3.jpg",
    "/cars/car-49/4.jpg",
    "/cars/car-49/5.jpg",
    "/cars/car-49/6.jpg"
  ],
  "description": "Nature again expert color. We particularly street language make suddenly consider. Take blue because not ball short or sit. Southern off process improve. Herself might use stand care. Child get hear participant claim."
},
{
  "id": "car-50",
  "slug": "car-50",
  "name": "Smith-Hinton Toward",
  "tagline": "Configurable mobile leverage",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00050",
  "price": 17537167,
  "year": 2024,
  "fuel": "Hybrid",
  "transmission": "Automatic",
  "drivetrain": "RWD",
  "color": "Plum",
  "mileage": 79557,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-50/1.jpg",
    "/cars/car-50/2.jpg",
    "/cars/car-50/3.jpg",
    "/cars/car-50/4.jpg",
    "/cars/car-50/5.jpg",
    "/cars/car-50/6.jpg"
  ],
  "description": "Country night across box approach. Right age Mrs design under chance leave. Between level capital enter walk try expert travel. Seven good far foot letter. Main city ability process act only. Question military reveal newspaper under."
},
{
  "id": "car-51",
  "slug": "car-51",
  "name": "Wilson, Hendrix and Esparza Live",
  "tagline": "Customer-focused next generation function",
  "tags": [
    "Imported",
    "Justice Quality",
    "Single Speed"
  ],
  "stockId": "STOCK-00051",
  "price": 12643431,
  "year": 2020,
  "fuel": "Petrol",
  "transmission": "Single Speed",
  "drivetrain": "RWD",
  "color": "CadetBlue",
  "mileage": 37000,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-51/1.jpg",
    "/cars/car-51/2.jpg",
    "/cars/car-51/3.jpg",
    "/cars/car-51/4.jpg",
    "/cars/car-51/5.jpg",
    "/cars/car-51/6.jpg"
  ],
  "description": "Try heavy action bring sport. Moment hot contain throw wall seven. Question long answer role whole charge improve."
},
{
  "id": "car-52",
  "slug": "car-52",
  "name": "Brown Inc Fire",
  "tagline": "Ameliorated mobile approach",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00052",
  "price": 11455081,
  "year": 2020,
  "fuel": "Petrol",
  "transmission": "Automatic",
  "drivetrain": "4WD",
  "color": "Chartreuse",
  "mileage": 14613,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-52/1.jpg",
    "/cars/car-52/2.jpg",
    "/cars/car-52/3.jpg",
    "/cars/car-52/4.jpg",
    "/cars/car-52/5.jpg",
    "/cars/car-52/6.jpg"
  ],
  "description": "Development ability system message science need. Tax similar cultural article main herself call hope. Ready tax collection property. Wrong ground body likely. Play avoid wear."
},
{
  "id": "car-53",
  "slug": "car-53",
  "name": "Stanley-Cline Population",
  "tagline": "Profit-focused 5thgeneration flexibility",
  "tags": [
    "Imported",
    "Justice Quality",
    "Automatic"
  ],
  "stockId": "STOCK-00053",
  "price": 5371647,
  "year": 2023,
  "fuel": "Diesel",
  "transmission": "Automatic",
  "drivetrain": "RWD",
  "color": "Snow",
  "mileage": 60467,
  "location": "Nakuru, Kenya",
  "image": [
    "/cars/car-53/1.jpg",
    "/cars/car-53/2.jpg",
    "/cars/car-53/3.jpg",
    "/cars/car-53/4.jpg",
    "/cars/car-53/5.jpg",
    "/cars/car-53/6.jpg"
  ],
  "description": "Public who fast past effect. Production forward contain child. Shoulder lay meeting game must. Quickly away tonight decision practice organization be."
},
{
  "id": "car-54",
  "slug": "car-54",
  "name": "Dominguez and Sons Man",
  "tagline": "Innovative impactful data-warehouse",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00054",
  "price": 4793949,
  "year": 2024,
  "fuel": "Electric",
  "transmission": "Manual",
  "drivetrain": "AWD",
  "color": "Ivory",
  "mileage": 36861,
  "location": "Mombasa, Kenya",
  "image": [
    "/cars/car-54/1.jpg",
    "/cars/car-54/2.jpg",
    "/cars/car-54/3.jpg",
    "/cars/car-54/4.jpg",
    "/cars/car-54/5.jpg",
    "/cars/car-54/6.jpg"
  ],
  "description": "Account speech study decide another. Authority car sell above something give size. Real ahead will hundred."
},
{
  "id": "car-55",
  "slug": "car-55",
  "name": "Powell-Mullins Pretty",
  "tagline": "Cloned 3rdgeneration artificial intelligence",
  "tags": [
    "Imported",
    "Justice Quality",
    "Manual"
  ],
  "stockId": "STOCK-00055",
  "price": 19887782,
  "year": 2021,
  "fuel": "Petrol",
  "transmission": "Manual",
  "drivetrain": "RWD",
  "color": "Brown",
  "mileage": 92448,
  "location": "Nairobi, Kenya",
  "image": [
    "/cars/car-55/1.jpg",
    "/cars/car-55/2.jpg",
    "/cars/car-55/3.jpg",
    "/cars/car-55/4.jpg",
    "/cars/car-55/5.jpg",
    "/cars/car-55/6.jpg"
  ],
  "description": "Magazine base million trade. Country research best happy everyone. Tree surface happen forget each century live color. Before hotel figure last. Gun thank past second sign fight."
}
];