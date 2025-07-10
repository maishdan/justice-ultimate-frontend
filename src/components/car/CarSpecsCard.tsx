// src/components/car/CarSpecsCard.tsx

interface CarSpecs {
  engine?: string;
  transmission?: string;
  fuel?: string;
  mileage?: string;
  year?: number;
  color?: string;
  drive?: string;
  doors?: number;
  registration?: string;
  importFrom?: string;
  assembledIn?: string;
}

interface Props {
  car: CarSpecs;
}

export default function CarSpecsCard({ car }: Props) {
  return (
    <div className="bg-blue-900/60 rounded-xl p-4 mb-6">
      <h2 className="text-xl font-semibold text-yellow-300 mb-2">Specs & Description</h2>
      <ul className="text-sm text-gray-400 grid grid-cols-2 gap-2">
        {car.engine && <li>Engine: {car.engine}</li>}
        {car.transmission && <li>Transmission: {car.transmission}</li>}
        {car.fuel && <li>Fuel: {car.fuel}</li>}
        {car.mileage && <li>Mileage: {car.mileage}</li>}
        {car.year && <li>Year: {car.year}</li>}
        {car.color && <li>Color: {car.color}</li>}
        {car.drive && <li>Drive: {car.drive}</li>}
        {car.doors && <li>Doors: {car.doors}</li>}
        {car.registration && <li>{car.registration}</li>}
        {car.importFrom && <li>Imported From: {car.importFrom}</li>}
        {car.assembledIn && <li>Assembled In: {car.assembledIn}</li>}
      </ul>
    </div>
  );
}
