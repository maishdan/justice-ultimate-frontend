// File: src/types/Car.ts

export interface Car {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  stockId: string;
  tags: string[];
  price: number;
  currency: "KES" | "USD";
  image: string[];
  availability: string;
  specs: {
    year: number;
    fuel: string;
    transmission: string;
    drivetrain: string;
    mileage: number;
    color: string;
    engine?: string;
    seats?: number;
    doors?: number;
    horsepower?: number;
    torque?: string;
  };
  location: string;
  description: string;
  featured?: boolean;
  ratings?: number;
}

export interface CarCardProps {
  car: Car;
  onClick?: () => void;
}

export interface CarData {
  cars: Car[];
}

export interface CarSpec {
  engine: string;
  fuel: string;
  transmission: string;
  drivetrain: string;
  color: string;
  mileage: number;
  year: number;
  location: string;
  seats: number;
  doors: number;
  horsepower: number;
  torque: string;
}

export interface CarDetail {
  car: Car;
  onClose: () => void;
}
