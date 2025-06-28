// File: /src/pages/CompareCars.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import cars from '../data/cars.json'; // Sample data file (create it)

const CompareCars: React.FC = () => {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  const toggleCarSelection = (id: string) => {
    setSelectedCars((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev.slice(0, 2), id]
    );
  };

  const comparedCars = cars.filter((car) => selectedCars.includes(String(car.id)));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Compare Cars</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car) => (
          <motion.div
            key={car.id}
            whileHover={{ scale: 1.03 }}
            className={`border rounded-xl p-4 shadow-md cursor-pointer transition-all duration-300 ${
              selectedCars.includes(String(car.id)) ? 'border-blue-600 bg-blue-50' : ''
            }`}
            onClick={() => toggleCarSelection(String(car.id))}
          >
            <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{car.name}</h2>
            <p className="text-gray-500">{car.brand}</p>
            <p className="text-blue-600 font-bold">
              {new Intl.NumberFormat('en-KE', {
                style: 'currency',
                currency: 'KES',
              }).format(car.priceKES)}
            </p>
          </motion.div>
        ))}
      </div>

      {comparedCars.length >= 2 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4">Feature</th>
                  {comparedCars.map((car) => (
                    <th className="p-4" key={car.id}>{car.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-semibold">Brand</td>
                  {comparedCars.map((car) => (
                    <td className="p-4" key={car.id + '-brand'}>{car.brand}</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-semibold">Fuel Type</td>
                  {comparedCars.map((car) => (
                    <td className="p-4" key={car.id + '-fuel'}>{car.fuel}</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-semibold">Transmission</td>
                  {comparedCars.map((car) => (
                    <td className="p-4" key={car.id + '-trans'}>{car.transmission}</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-semibold">Price</td>
                  {comparedCars.map((car) => (
                    <td className="p-4 text-green-600 font-bold" key={car.id + '-price'}>
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES',
                      }).format(car.priceKES)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareCars;
