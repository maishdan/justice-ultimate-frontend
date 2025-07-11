// File: src/components/AnimatedHeader.tsx
import { motion } from "framer-motion";
import type { FC } from "react";

export const AnimatedHeader: FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-center pt-28 pb-8 bg-gradient-to-r from-black to-blue-900 text-white"
    >
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Justice Ultimate Automobiles
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        🌍 Premium Cars | ✈️ Global Delivery | 💬 Instant Support | 🚗 Dream Rides
      </motion.p>
    </motion.header>
  );
};

interface AnimatedHeaderProps {
  toggleDarkMode: () => void;
}

export const AnimatedHeaderWithToggle: FC<AnimatedHeaderProps> = ({ toggleDarkMode }) => {
  return (
    <div className="bg-gray-800 text-white">
      <button
        onClick={toggleDarkMode}
        className="p-2 m-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        Toggle Dark Mode
      </button>
      <AnimatedHeader />
    </div>
  );
};
