// components/ComparePanel.tsx
import type { Car } from "../types/Car";
import React from "react";
import { Card, CardHeader, CardContent } from "../components/ui/card";

interface ComparePanelProps {
  cars: Car[];
}

const ComparePanel = ({ cars }: ComparePanelProps) => {
  if (cars.length === 0) return null;

  const headers = [
    "Name",
    "Year",
    "Price",
    "Fuel",
    "Transmission",
    "Drivetrain",
    "Mileage",
    "Color",
    "Location",
  ];

  return (
    <Card className="my-4 p-4 overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">Compare Cars</h2>
      </CardHeader>
      <CardContent>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2 border" />
              {cars.map((car) => (
                <th key={car.slug} className="p-2 border text-sm font-semibold">
                  {car.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {headers.map((label) => (
              <tr key={label} className="text-center">
                <td className="p-2 border font-semibold">{label}</td>
                {cars.map((car) => (
                  <td key={`${car.slug}-${label}`} className="p-2 border">
                    {{
                      Name: car.name,
                      Year: car.specs.year,
                      Price: `${car.currency === "USD" ? "$" : "KES"} ${car.price.toLocaleString()}`,
                      Fuel: car.specs.fuel,
                      Transmission: car.specs.transmission,
                      Drivetrain: car.specs.drivetrain,
                      Mileage: `${car.specs.mileage.toLocaleString()} km`,
                      Color: car.specs.color,
                      Location: car.location,
                    }[label as
                      | "Name"
                      | "Year"
                      | "Price"
                      | "Fuel"
                      | "Transmission"
                      | "Drivetrain"
                      | "Mileage"
                      | "Color"
                      | "Location"]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default ComparePanel;
