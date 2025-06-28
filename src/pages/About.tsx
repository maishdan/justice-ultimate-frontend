import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  const [darkMode] = useState(true);

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-gradient-to-br from-purple-900 to-black text-white"
          : "min-h-screen bg-gray-100 text-black"
      }
    >
      {/* ✅ 1. International Hero Section */}
      <section
        className="text-center py-24 px-6 md:px-20 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url('/images/global-cars.jpg')` }}
      >
        <div className="backdrop-blur-md bg-black/60 p-6 rounded-xl shadow-xl border border-white/10 transition-all duration-300">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.03, textShadow: "0 0 15px #facc15" }}
            className="text-4xl md:text-6xl font-extrabold mb-4 text-yellow-400 hover:drop-shadow-glow transition-all duration-300"
          >
            Driving Excellence Beyond Borders
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl mb-6 max-w-3xl mx-auto text-white/90"
          >
            Connecting Kenya to the world, one car at a time. From Nairobi to New York, we deliver unmatched value in vehicle sourcing, export, import, and sales.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250, 204, 21, 0.6)" }}>
              <Link
                to="/services"
                className="bg-yellow-400 px-6 py-3 rounded-lg font-semibold text-black hover:bg-yellow-300 transition-all duration-300 shadow-md"
              >
                Explore Our Global Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ✅ 2. Mission & Vision Section */}
      <section className="py-20 px-6 md:px-20 space-y-10 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold mb-3">🌍 Our Mission</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Our mission is to redefine trust in vehicle acquisition by connecting global customers with high-quality, affordable cars from Kenya and across the world.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-3xl font-bold mb-3">🚀 Our Vision</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            To be Africa’s most trusted and internationally recognized automobile dealer, delivering cars across continents with precision, professionalism, and pride.
          </p>
        </motion.div>
      </section>

      {/* ✅ 3. Core Values */}
      <section className="bg-indigo-900 py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-10">💎 Core Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {["🌐 Global Reach", "🤝 Integrity", "🚗 Quality Assurance", "📦 Seamless Logistics", "🌟 Customer Success", "⚙️ Innovation & Tech"].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-md hover:shadow-yellow-500/20 transition duration-300"
            >
              <p className="text-lg font-semibold">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ 4. Our Story */}
      <section className="py-20 px-6 md:px-20 text-center bg-indigo-950">
        <h2 className="text-3xl font-bold mb-6">📖 Our Story</h2>
        <p className="max-w-4xl mx-auto text-white/80">
          Justice Ultimate Automobiles began in Nyeri, Kenya, with a bold vision — to give every customer, no matter their location, access to world-class vehicles. From humble beginnings to global exports, we’ve built a company driven by passion, purpose, and people.
        </p>
        <ul className="mt-6 space-y-2 text-left text-sm list-disc pl-10 max-w-2xl mx-auto">
          <li><strong>2020:</strong> Founded in Nyeri</li>
          <li><strong>2021:</strong> First cross-border sale to Uganda</li>
          <li><strong>2022:</strong> Europe export expansion</li>
          <li><strong>2023:</strong> Over 1,000 cars sold</li>
          <li><strong>2024:</strong> Global logistics hub opened in Mombasa</li>
        </ul>
      </section>

      {/* ✅ 5. Meet the Team */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-6">👨‍💼 Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[{ name: "Daniel Maina Wangui", role: "General Manager", flag: "🇰🇪" }, { name: "Jane Doe", role: "Head of Exports", flag: "🇺🇸" }, { name: "Ali Zain", role: "Logistics Lead", flag: "🇦🇪" }, { name: "Grace Achieng", role: "Sales Rep", flag: "🇰🇪" }, { name: "Mike Andrews", role: "UK Agent", flag: "🇬🇧" }].map((person, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
              className="bg-white/10 p-4 rounded-lg shadow-md hover:shadow-yellow-500/30 transition-all"
            >
              <h3 className="font-bold text-lg">{person.name}</h3>
              <p className="text-sm">{person.role} {person.flag}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ 6. Legal & Policies */}
      <section className="py-20 px-6 md:px-20 text-center bg-black">
        <h2 className="text-2xl font-semibold mb-6">📜 Legal & Policies</h2>
        <div className="flex justify-center flex-wrap gap-6">
          <Link to="/terms" className="text-yellow-400 hover:underline">Terms of Use</Link>
          <Link to="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</Link>
          <Link to="/cookies" className="text-yellow-400 hover:underline">Cookie Policy</Link>
        </div>
      </section>

      {/* ✅ 7. Call to Action */}
      <footer className="bg-gray-900 text-white py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Drive With Us?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="bg-green-500 px-6 py-3 rounded hover:bg-green-400">Contact Our Global Sales Team</Link>
          <Link to="/vehicle-catalogue" className="border border-green-400 px-6 py-3 rounded hover:bg-green-400">View International Stock</Link>
          <Link to="/quote" className="bg-yellow-400 px-6 py-3 rounded hover:bg-yellow-300 text-black">Request a Shipping Quote</Link>
        </div>
      </footer>
    </div>
  );
}