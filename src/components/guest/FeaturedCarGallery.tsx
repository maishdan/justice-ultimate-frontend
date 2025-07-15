import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featuredCars = [
  {
    id: 1,
    name: "2024 Mercedes-Benz S-Class",
    image: "/images/cars/mercedes-sclass.png",
    link: "/vehicle-catalogue/mercedes-sclass"
  },
  {
    id: 2,
    name: "2024 Tesla Model X",
    image: "/images/cars/tesla-modelx.png",
    link: "/vehicle-catalogue/tesla-modelx"
  },
  {
    id: 3,
    name: "2023 Range Rover Vogue",
    image: "/images/cars/range-rover.png",
    link: "/vehicle-catalogue/range-rover"
  }
];

export default function FeaturedCarGallery() {
  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-4 text-blue-900">Featured Cars</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredCars.map((car, i) => (
          <motion.div
            key={car.id}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
          >
            <img src={car.image} alt={car.name} className="w-40 h-28 object-contain mb-3 rounded" />
            <div className="font-semibold text-gray-900 mb-2">{car.name}</div>
            <Link to={car.link} className="text-blue-700 hover:underline font-medium">View Details</Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 