import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CarFront, Fuel, Settings } from 'lucide-react';

type Car = {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  priceKES: number;
  image: string;
};

export default function ExploreCars() {
  // Sample data for demonstration; replace with API call or actual data source as needed
  const sampleCars: Car[] = [
    {
      id: 1,
      name: 'Corolla',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      fuel: 'Petrol',
      transmission: 'Automatic',
      priceKES: 2000000,
      image: 'https://via.placeholder.com/400x200?text=Toyota+Corolla'
    },
    {
      id: 2,
      name: 'X5',
      brand: 'BMW',
      model: 'X5',
      year: 2021,
      fuel: 'Diesel',
      transmission: 'Automatic',
      priceKES: 6000000,
      image: 'https://via.placeholder.com/400x200?text=BMW+X5'
    },
    {
      id: 3,
      name: 'Impreza',
      brand: 'Subaru',
      model: 'Impreza',
      year: 2019,
      fuel: 'Petrol',
      transmission: 'Manual',
      priceKES: 2500000,
      image: 'https://via.placeholder.com/400x200?text=Subaru+Impreza'
    }
  ];

  const [cars, setCars] = useState<Car[]>(sampleCars);
  const [filters, setFilters] = useState({ brand: '', fuel: '', transmission: '' });
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCars = cars.filter((car) => {
    return (
      (filters.brand === '' || car.brand === filters.brand) &&
      (filters.fuel === '' || car.fuel === filters.fuel) &&
      (filters.transmission === '' || car.transmission === filters.transmission)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Explore Cars</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <select name="brand" onChange={handleFilterChange} className="p-2 rounded-lg border">
          <option value="">All Brands</option>
          <option value="Toyota">Toyota</option>
          <option value="BMW">BMW</option>
          <option value="Subaru">Subaru</option>
        </select>
        <select name="fuel" onChange={handleFilterChange} className="p-2 rounded-lg border">
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
        <select name="transmission" onChange={handleFilterChange} className="p-2 rounded-lg border">
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-lg p-4 transition border hover:shadow-2xl"
          >
            <img src={car.image} alt={car.name} className="w-full h-48 object-cover rounded" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">{car.name}</h2>
            <p className="text-gray-500">KES {Number(car.priceKES).toLocaleString()}</p>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><CarFront size={16} />{car.brand}</span>
              <span className="flex items-center gap-1"><Fuel size={16} />{car.fuel}</span>
              <span className="flex items-center gap-1"><Settings size={16} />{car.transmission}</span>
            </div>
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">View Details</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
