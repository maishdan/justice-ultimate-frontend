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
  mileage: number;
  location: string;
  image: string[];
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
      "/cars/mercedes-s-class/1.jpg",
      "/cars/mercedes-s-class/2.jpg",
      "/cars/mercedes-s-class/3.jpg"
    ],
    description: `
      The Mercedes‑Benz S‑Class delivers unmatched comfort, cutting‑edge technology, and unparalleled prestige.
      Equipped with MBUX infotainment, executive rear seating, and a handcrafted interior —
      it’s designed for those who expect nothing short of excellence.
    `,
  },
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
      "/cars/land-cruiser-v8/1.jpg",
      "/cars/land-cruiser-v8/2.jpg",
      "/cars/land-cruiser-v8/3.jpg"
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
      With durable diesel torque, full-time 4WD capability, and a comfortable interior, 
      it’s a reliable partner for professionals and adventurers alike.
    `,
  },
  {
    id: "honda-civic-2020",
    slug: "honda-civic-2020",
    name: "Honda Civic 2020",
    tagline: "Sporty & efficient",
    tags: ["Sedan", "Petrol", "Automatic"],
    stockId: "HC‑2020C12",
    price: 3500000,
    year: 2020,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "FWD",
    color: "Crystal Black Pearl",
    mileage: 30000,
    location: "Eldoret, Kenya",
    image: [
      "/cars/honda-civic-2020/1.jpg",
      "/cars/honda-civic-2020/2.jpg",
      "/cars/honda-civic-2020/3.jpg"
    ],
    description: `
      The Honda Civic combines sporty performance with everyday practicality. 
      With a turbocharged engine, spacious cabin, and advanced safety features, 
      it’s perfect for both city commutes and weekend getaways.
    `,
  }
];
