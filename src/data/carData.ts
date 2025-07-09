// src/data/carData.ts

export interface Car {
  id: string;          // unique ID (slug-based)
  slug: string;        // for URL route (e.g. /cars/:slug)
  name: string;        // Display name
  tagline: string;     // Short branding line
  tags: string[];      // Category/traits
  stockId: string;     // Internal stock identifier
  price: string;       // Placeholder price for now
  image: string[];     // Local image URLs (at least 1, ideally 2+)
}

export const cars: Car[] = [
  {
    id: "mercedes-benz-s-class",
    slug: "mercedes-benz-s-class",
    name: "Mercedes-Benz S-Class",
    tagline: "Excellence in motion.",
    tags: ["Luxury", "Imported", "Justice Quality"],
    stockId: "STOCK-1001",
    price: "$85,000",
    image: ["/cars/mercedes-benz-s-class-1.jpg", "/cars/mercedes-benz-s-class-2.jpg"],
  },
  {
    id: "toyota-land-cruiser-v8",
    slug: "toyota-land-cruiser-v8",
    name: "Toyota Land Cruiser V8",
    tagline: "Conquer any terrain.",
    tags: ["SUV", "Imported", "Justice Quality"],
    stockId: "STOCK-1002",
    price: "$75,000",
    image: ["/cars/toyota-land-cruiser-v8-1.jpg", "/cars/toyota-land-cruiser-v8-2.jpg"],
  },
  {
    id: "tesla-model-x",
    slug: "tesla-model-x",
    name: "Tesla Model X",
    tagline: "The future of driving.",
    tags: ["Electric", "Autopilot", "Justice Quality"],
    stockId: "STOCK-1003",
    price: "$99,000",
    image: ["/cars/tesla-model-x-1.jpg", "/cars/tesla-model-x-2.jpg"],
  },
  {
    id: "bmw-x3",
    slug: "bmw-x3",
    name: "BMW X3",
    tagline: "Luxury in motion.",
    tags: ["Luxury", "SUV", "Justice Quality"],
    stockId: "STOCK-1004",
    price: "$52,000",
    image: ["/cars/bmw-x3-1.jpg", "/cars/bmw-x3-2.jpg"],
  },
  {
    id: "toyota-prado-2018",
    slug: "toyota-prado-2018",
    name: "Toyota Prado 2018",
    tagline: "Versatility and strength.",
    tags: ["SUV", "2018", "Justice Quality"],
    stockId: "STOCK-1005",
    price: "$41,500",
    image: ["/cars/toyota-prado-2018-1.jpg", "/cars/toyota-prado-2018-2.jpg"],
  },
  {
    id: "outlander",
    slug: "outlander",
    name: "OUTLANDER",
    tagline: "Efficiency with space.",
    tags: ["SUV", "Hybrid", "Justice Quality"],
    stockId: "STOCK-1006",
    price: "$33,800",
    image: ["/cars/outlander-1.jpg", "/cars/outlander-2.jpg"],
  },
  {
    id: "toyota-prado-2017",
    slug: "toyota-prado-2017",
    name: "Toyota Prado 2017",
    tagline: "Built to endure.",
    tags: ["SUV", "2017", "Justice Quality"],
    stockId: "STOCK-1007",
    price: "$38,900",
    image: ["/cars/toyota-prado-2017-1.jpg", "/cars/toyota-prado-2017-2.jpg"],
  },
  {
    id: "volvo-xc90-7-seater",
    slug: "volvo-xc90-7-seater",
    name: "RANGE VOLVO XC90 7 SEATER",
    tagline: "Space meets luxury.",
    tags: ["Luxury SUV", "7 Seater", "Justice Quality"],
    stockId: "STOCK-1008",
    price: "$62,500",
    image: ["/cars/volvo-xc90-1.jpg", "/cars/volvo-xc90-2.jpg"],
  },
  {
    id: "prado-diesel",
    slug: "prado-diesel",
    name: "PRADO DIESEL",
    tagline: "Power and economy combined.",
    tags: ["SUV", "Diesel", "Justice Quality"],
    stockId: "STOCK-1009",
    price: "$47,200",
    image: ["/cars/prado-diesel-1.jpg", "/cars/prado-diesel-2.jpg"],
  },
  {
    id: "cx5-mazda",
    slug: "cx5-mazda",
    name: "CX5 MAZDA",
    tagline: "Zoom into adventure.",
    tags: ["SUV", "Mazda", "Justice Quality"],
    stockId: "STOCK-1010",
    price: "$35,500",
    image: ["/cars/cx5-mazda-1.jpg", "/cars/cx5-mazda-2.jpg"],
  },

  // ✅ Add more here following same format...

  // 🚨 Truncated here for brevity — I will provide the remaining ~40 entries as a follow-up message.
];
