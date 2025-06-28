import React from 'react';

const recommendedCars = [
  {
    model: 'BMW X6 2022',
    reason: 'Perfect for long-distance comfort and status',
    image: '/images/cars/bmw-x6.jpg',
  },
  {
    model: 'Toyota Aqua Hybrid',
    reason: 'Great for city driving & fuel economy',
    image: '/images/cars/aqua-hybrid.jpg',
  },
  {
    model: 'Range Rover Sport',
    reason: 'Ideal for luxury and off-road trips',
    image: '/images/cars/range-rover.jpg',
  },
];

export default function AIRecommendations() {
  return (
    <div className="bg-green-900/70 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
      <h3 className="text-2xl font-bold text-white mb-4">🧠 AI Recommendations</h3>
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {recommendedCars.map((car, idx) => (
          <div
            key={idx}
            className="min-w-[250px] bg-green-800/80 rounded-lg p-4 shadow-md hover:scale-105 transition"
          >
            <img
              src={car.image}
              alt={car.model}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h4 className="text-lg font-semibold text-white">{car.model}</h4>
            <p className="text-sm text-green-100">{car.reason}</p>
            <button className="mt-2 text-sm underline text-green-200 hover:text-green-400 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
