import { useState } from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
<<<<<<< HEAD
=======
import { Moon, Sun } from "lucide-react";
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c

const services = [
  {
    icon: "🚗",
    title: "Global Car Rentals",
    desc: "Affordable, luxury, and electric vehicle rentals available across all continents. Seamless online booking with local pickup or delivery."
  },
  {
    icon: "🏎️",
    title: "Luxury & Exotic Vehicles",
    desc: "Drive the world's finest supercars, from Lamborghinis to Rolls-Royces. Curated for special occasions and elite experiences."
  },
  {
    icon: "🔧",
    title: "Auto Servicing & Maintenance",
    desc: "Top-tier vehicle diagnostics, maintenance plans, and servicing from certified mechanics and AI-powered tools."
  },
  {
    icon: "📦",
    title: "Auto Parts & Accessories",
    desc: "Order OEM and aftermarket car parts, custom rims, performance upgrades, and tech accessories with global shipping."
  },
  {
    icon: "🧠",
    title: "AI-Powered Vehicle Recommendations",
    desc: "Get intelligent car suggestions based on your preferences, driving habits, and budget powered by machine learning."
  },
  {
    icon: "📲",
    title: "Smart Vehicle Management",
    desc: "Control, track, and schedule your vehicle via the JusticeApp. Real-time GPS, fuel analytics, and driver behavior tracking."
  },
  {
    icon: "🌍",
    title: "International Car Export",
    desc: "Export vehicles to 60+ countries with customs handling, VIN checks, and port-to-port logistics."
  },
  {
    icon: "🛂",
    title: "Sourcing & Importing",
    desc: "We locate, inspect, and import cars based on your exact specs from Japan, UAE, Germany, UK, and more."
  },
  {
    icon: "⚙️",
    title: "Right-Hand to Left-Hand Conversion",
    desc: "Compliant conversions for markets like Europe, India, and the Americas."
  }
];

export default function Services() {
<<<<<<< HEAD
  const [darkMode] = useState(true);
=======
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c

  return (
    <div className={darkMode ? "min-h-screen bg-gradient-to-r from-blue-950 to-black text-white" : "min-h-screen bg-gray-100 text-black"}>
      {/* Hero Section */}
      <motion.section
        className="text-center py-32 px-6 md:px-20"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className={darkMode ? "text-white" : "text-black"}>Global Automotive </span>
          <span className="text-blue-400">Services</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          🚘 From Nairobi to New York — Justice Ultimate Automobiles provides expert car services, international sourcing, export, import, and logistics.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link to="/register">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300">Get Started</Button>
          </Link>
          <Link to="/vehicle-catalogue">
            <Button variant="outline" size="lg">Visit Showroom</Button>
          </Link>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="px-6 md:px-20 py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {services.map((car, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-blue-900/60 p-4 rounded-xl shadow-md hover:ring-2 hover:ring-yellow-400 transition-all"
            >
              <h4 className="text-xl font-bold mb-2">{car.icon} {car.title}</h4>
              <p className="text-sm text-gray-200">{car.desc}</p>
              <Link to="/vehicle-catalogue" className="inline-block mt-3 text-yellow-400 hover:underline">Explore More →</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6" style={{ color: darkMode ? '#ccc' : '#555' }}>
        &copy; 2025 Justice Ultimate Automobiles. All rights reserved.
      </footer>
    </div>
  );
}
