import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function PromoBanner() {
  return (
    <motion.div
      className="relative bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden mb-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-2 justify-center md:justify-start">
          <FaStar className="text-yellow-600 animate-bounce" />
          Welcome to Justice Ultimate Automobiles!
        </h2>
        <p className="text-gray-800 text-lg mb-4 max-w-xl">
          Discover exclusive deals, luxury rides, and a seamless booking experience. Join thousands of happy drivers worldwide!
        </p>
        <Link to="/vehicle-catalogue">
          <button className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition">
            Explore Cars
          </button>
        </Link>
      </div>
      <motion.img
        src="/images/promo-car.png"
        alt="Promo Car"
        className="w-40 md:w-56 drop-shadow-xl hidden md:block"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7 }}
      />
    </motion.div>
  );
} 