import { useState } from "react";
import { motion } from "framer-motion";

const carTypes = [
  { label: "Economy", base: 40 },
  { label: "SUV", base: 70 },
  { label: "Luxury", base: 120 },
  { label: "Electric", base: 90 },
];

const locations = [
  { label: "Nairobi", multiplier: 1 },
  { label: "Lagos", multiplier: 1.1 },
  { label: "London", multiplier: 1.5 },
  { label: "New York", multiplier: 1.7 },
];

export default function GuestCalculator() {
  const [car, setCar] = useState(carTypes[0]);
  const [days, setDays] = useState(1);
  const [location, setLocation] = useState(locations[0]);

  const estimate = car.base * days * location.multiplier;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-blue-900 mb-4">Estimate Your Rental Cost</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Car Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={car.label}
            onChange={e => setCar(carTypes.find(c => c.label === e.target.value) || carTypes[0])}
          >
            {carTypes.map(c => (
              <option key={c.label} value={c.label}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Duration (days)</label>
          <input
            type="number"
            min={1}
            max={30}
            className="w-full border rounded px-3 py-2"
            value={days}
            onChange={e => setDays(Math.max(1, Math.min(30, Number(e.target.value))))}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Location</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={location.label}
            onChange={e => setLocation(locations.find(l => l.label === e.target.value) || locations[0])}
          >
            {locations.map(l => (
              <option key={l.label} value={l.label}>{l.label}</option>
            ))}
          </select>
        </div>
      </form>
      <div className="mt-6 text-center">
        <span className="text-gray-700">Estimated Price:</span>
        <span className="text-2xl font-bold text-green-600 ml-2">${estimate.toFixed(2)}</span>
      </div>
    </motion.div>
  );
} 