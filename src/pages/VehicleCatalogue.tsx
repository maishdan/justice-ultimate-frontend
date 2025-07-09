// src/pages/VehicleCatalogue.tsx
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const cars = [
  {
    category: "Luxury",
    name: "Mercedes-Benz S-Class",
    description: "Elegant design with unmatched comfort. Ideal for executive travel.",
    image: "/public/images/mercedes-benz-s-class.png",
  },
  {
    category: "SUV",
    name: "Toyota Land Cruiser V8",
    description: "Rugged performance, off-road beast. Perfect for African terrain.",
    image: "/public/images/toyota-land-cruiser-v8.png",
  },
  {
    category: "Electric",
    name: "Tesla Model X",
    description: "Futuristic design with zero emissions and full autopilot.",
    image: "/public/images/tesla-model-x.png",
  },
  {
    category: "Economy",
    name: "Toyota Axio",
    description: "Affordable, fuel-efficient and ideal for city movement.",
    image: "/public/images/toyota-axio.jpg",
  },
  {
    category: "Van/Commercial",
    name: "Toyota Hiace",
    description: "Spacious, reliable and perfect for group travel or logistics.",
    image: "/public/images/toyota-hiace.png",
  },
  {
    category: "Vintage",
    name: "1967 Ford Mustang",
    description: "A classic masterpiece. Rare collector car available for hire.",
    image: "/public/images/1967-ford-mustang.png",
  },
];

// Rendering Example (e.g., in a React component)
// (Removed invalid top-level return statement and JSX)


export default function VehicleCatalogue() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white px-6 md:px-20 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-center mb-10 text-yellow-400"
      >
        Vehicle Catalogue
      </motion.h2>
      <p className="text-center max-w-3xl mx-auto text-gray-300 mb-12 text-lg">
        🌐 Explore our global vehicle fleet—ranging from luxury sedans to electric cars and off-road monsters.
        Justice Ultimate Automobiles connects continents with class and innovation.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {cars.map((car, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="bg-blue-900/60 p-4 rounded-xl shadow-md hover:ring-2 hover:ring-yellow-400 transition-all"
          >
            <img
              src={car.image}
              alt={car.name}
              className="rounded-lg w-full h-48 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-1">{car.name}</h3>
            <p className="text-sm text-gray-300 mb-2 italic">{car.category}</p>
            <p className="text-sm text-gray-200 mb-3">{car.description}</p>
            <Link to="/register">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300 w-full">Book Now</Button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <section className="text-center mt-20">
        <h3 className="text-2xl font-bold mb-4">Need a Personalized Vehicle Recommendation?</h3>
        <p className="text-gray-400 max-w-xl mx-auto mb-6">
          Our intelligent system and expert consultants help match you with the perfect ride across categories and budgets.
        </p>
        <Link to="/contact">
          <Button variant="outline" size="lg">Talk to an Expert</Button>
        </Link>
      </section>
    </div>
  );
}
