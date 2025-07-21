// File: src/types/Car.ts

export interface Car {
  id: string;
  slug?: string;
  name?: string;
  title?: string; // Alternative to name
  tagline?: string;
  stockId?: string;
  tags?: string[];
  price?: number;
  currency?: "KES" | "USD";
  image?: string[];
  main_image?: string; // Alternative to image[0]
  additional_images?: string[]; // Alternative to image
  availability?: string;
  specs?: {
    year?: number;
    fuel?: string;
    transmission?: string;
    drivetrain?: string;
    mileage?: number;
    color?: string;
    engine?: string;
    seats?: number;
    doors?: number;
    horsepower?: number;
    torque?: string;
  };
  // Alternative properties that might come from database
  brand?: string;
  make?: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
  mileage?: number;
  color?: string;
  location?: string;
  description?: string;
  featured?: boolean;
  ratings?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
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
