// src/pages/VehicleCatalogue.tsx
import { useEffect, useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';

export default function VehicleCatalogue() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setCars(data || []);
      setLoading(false);
    }
    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch =
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? car.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [cars, search, category]);

  const categories = useMemo(() => Array.from(new Set(cars.map(car => car.category))).filter(Boolean), [cars]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Vehicle Catalogue
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or brand..."
            className="px-4 py-2 rounded border w-full md:w-1/3"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 rounded border w-full md:w-1/4"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-white text-center">Loading cars...</div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <motion.div
                key={car.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
              >
                <img src={car.image_url} alt={car.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-yellow-400">{car.name}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{car.brand}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">KES {car.price}</p>
                  <Link to={`/car/${car.id}`}>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">View Details</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
