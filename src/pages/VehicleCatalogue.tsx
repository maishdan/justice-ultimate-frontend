// src/pages/VehicleCatalogue.tsx
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export const cars = [
  {
    id: "mercedes-benz-s-class",
    category: "Luxury",
    name: "Mercedes-Benz S-Class",
    description: "Elegant design with unmatched comfort. Ideal for executive travel.",
    image: "/images/mercedes-benz-s-class.png",
  },
  {
    id: "toyota-land-cruiser-v8",
    category: "SUV",
    name: "Toyota Land Cruiser V8",
    description: "Rugged performance, off-road beast. Perfect for African terrain.",
    image: "/images/toyota-land-cruiser-v8.png",
  },
  {
    id: "tesla-model-x",
    category: "Electric",
    name: "Tesla Model X",
    description: "Futuristic design with zero emissions and full autopilot.",
    image: "/images/tesla-model-x.png",
  },
  {
    id: "bmw-x3",
    category: "Luxury",
    name: "BMW X3",
    description: "Powerful performance in a compact luxury SUV.",
    image: "/images/bmw-x3.png",
  },
  {
    id: "toyota-prado-2018",
    category: "SUV",
    name: "Toyota Prado 2018",
    description: "Reliable off-roader with premium features.",
    image: "/images/toyota-prado-2018.png",
  },
  {
    id: "outlander",
    category: "SUV",
    name: "OUTLANDER",
    description: "Spacious SUV with hybrid technology.",
    image: "/images/outlander.png",
  },
  {
    id: "toyota-prado-2017",
    category: "SUV",
    name: "Toyota Prado 2017",
    description: "Versatile and tough, for both city and wild.",
    image: "/images/toyota-prado-2017.png",
  },
  {
    id: "volvo-xc90-7-seater",
    category: "Luxury SUV",
    name: "RANGE VOLVO XC90 7 SEATER",
    description: "Family luxury and space in a premium build.",
    image: "/images/volvo-xc90.png",
  },
  {
    id: "prado-diesel",
    category: "SUV",
    name: "PRADO DIESEL",
    description: "Diesel-powered off-road excellence.",
    image: "/images/prado-diesel.png",
  },
  {
    id: "cx5-mazda",
    category: "SUV",
    name: "CX5 MAZDA",
    description: "Sleek design with sporty handling.",
    image: "/images/cx5-mazda.png",
  },
  {
    id: "mazda-cx3",
    category: "Crossover",
    name: "MAZDA CX3",
    description: "Compact urban SUV with style.",
    image: "/images/mazda-cx3.png",
  },
  {
    id: "volvo-xc60",
    category: "Luxury",
    name: "VOLVO XC60",
    description: "Modern Scandinavian design meets comfort.",
    image: "/images/volvo-xc60.png",
  },
  {
    id: "subaru-outback",
    category: "Wagon/SUV",
    name: "SUBARU OUTBACK",
    description: "Adventure-ready with all-wheel-drive.",
    image: "/images/subaru-outback.png",
  },
  {
    id: "porsche",
    category: "Luxury Sports",
    name: "PORSCHE",
    description: "Performance and luxury redefined.",
    image: "/images/porsche.png",
  },
  {
    id: "bmw-x5",
    category: "Luxury SUV",
    name: "BMW X5",
    description: "Bold looks and powerful drive.",
    image: "/images/bmw-x5.png",
  },
  {
    id: "subaru-xv",
    category: "Crossover",
    name: "SUBARU XV",
    description: "Agile and safe for urban or rural roads.",
    image: "/images/subaru-xv.png",
  },
  {
    id: "toyota-probox",
    category: "Economy",
    name: "Toyota probox",
    description: "Reliable workhorse for daily use.",
    image: "/images/toyota-probox.png",
  },
  {
    id: "lexus-rx450h",
    category: "Luxury Hybrid",
    name: "LEXUS RX450H",
    description: "Hybrid SUV with finesse.",
    image: "/images/lexus-rx450h.png",
  },
  {
    id: "toyota-harrier",
    category: "SUV",
    name: "TOYOTA HARRIER",
    description: "Stylish and comfortable SUV.",
    image: "/images/toyota-harrier.png",
  },
  {
    id: "mercedes-gle350",
    category: "Luxury SUV",
    name: "MERCEDES GLE350",
    description: "Smooth ride and executive appeal.",
    image: "/images/mercedes-gle350.png",
  },
  {
    id: "mazda-axela",
    category: "Compact",
    name: "MAZDA AXELA",
    description: "Sporty design and fuel efficiency.",
    image: "/images/mazda-axela.png",
  },
  {
    id: "mercedes-s-class",
    category: "Luxury",
    name: "MERCEDES S CLASS",
    description: "The pinnacle of Mercedes luxury.",
    image: "/images/mercedes-s-class.png",
  },
  {
    id: "honda-fit-shuttle",
    category: "Economy",
    name: "HONDA FIT SHUTTLE",
    description: "Spacious hatchback with hybrid efficiency.",
    image: "/images/honda-fit-shuttle.png",
  },
  {
    id: "nissan-xtrail",
    category: "SUV",
    name: "NISSAN XTRAIL",
    description: "Versatile and ready for adventure.",
    image: "/images/nissan-xtrail.png",
  },
  {
    id: "nissan-sylphy",
    category: "Sedan",
    name: "NISSAN SYLPHY",
    description: "Comfortable daily driver.",
    image: "/images/nissan-sylphy.png",
  },
  {
    id: "honda-vezel-hybrid",
    category: "Hybrid",
    name: "Honda Vezel HYBRID",
    description: "Hybrid crossover with style.",
    image: "/images/honda-vezel-hybrid.png",
  },
  {
    id: "toyota-vellfire",
    category: "Luxury Van",
    name: "TOYOTA VELLFIRE EXECUTIVE VAN",
    description: "High-end van for executive comfort.",
    image: "/images/toyota-vellfire.png",
  },
  {
    id: "toyota-noah",
    category: "Van/MPV",
    name: "TOYOTA NOAH",
    description: "Multi-purpose van for family or business.",
    image: "/images/toyota-noah.png",
  },
  {
    id: "volvo-xc60-sunroof",
    category: "Luxury",
    name: "VOLVO XC60 SUNROOF",
    description: "Panoramic view in luxury trim.",
    image: "/images/volvo-xc60-sunroof.png",
  },
  {
    id: "mercedes-e250",
    category: "Luxury",
    name: "MERCEDES E250",
    description: "Classy executive sedan.",
    image: "/images/mercedes-e250.png",
  },
  {
    id: "vw-tiguan",
    category: "Crossover",
    name: "VW TIGUAN",
    description: "Efficient and smart family SUV.",
    image: "/images/vw-tiguan.png",
  },
  {
    id: "toyota-prado-tx",
    category: "SUV",
    name: "TOYOTA PRADO TX",
    description: "Iconic Toyota toughness and reliability.",
    image: "/images/toyota-prado-tx.png",
  },
];

// ✅ EXPORT CARS WITH EXTRA FIELDS
export const carsDetailed = cars.map((car, index) => ({
  ...car,
  image: [car.image, car.image], // duplicate for gallery
  tagline: "Excellence in motion.", // ✅ Default tagline
  stockId: `STOCK-${index + 1001}`, // ✅ Example: STOCK-1001, STOCK-1002
  tags: [car.category, "Imported", "Justice Quality"], // ✅ Basic dynamic tags
  specs: {
    engine: "2.5L VVT-i",
    fuel: "Petrol",
    year: 2022,
    mileage: "32,000 km",
    color: "Black",
    transmission: "Automatic",
    drive: "4WD",
  },
}));

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
        {cars.map((car) => (
          <motion.div
            key={car.id}
            whileHover={{ scale: 1.03 }}
            className="bg-blue-900/60 p-4 rounded-xl shadow-md hover:ring-2 hover:ring-yellow-400 transition-all"
          >
            <Link to={`/cars/${car.id}`}>
              <img
                src={car.image}
                alt={car.name}
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-1">{car.name}</h3>
              <p className="text-sm text-gray-300 mb-2 italic">{car.category}</p>
              <p className="text-sm text-gray-200 mb-3">{car.description}</p>
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
