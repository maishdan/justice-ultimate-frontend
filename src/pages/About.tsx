import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Target, Users, Award, MapPin, Phone, Mail } from "lucide-react";
import Footer from "../components/Footer";

export default function About() {
  const [darkMode] = useState(true);

  return (
    <div 
      className="min-h-screen w-full pt-0"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Enhanced Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none z-10"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div className="relative z-10 min-h-screen w-full flex flex-col">
        {/* Hero Section with Premium Glass Morphism */}
        <motion.section
          className="text-center py-20 md:py-32 px-6 md:px-20 w-full"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-panel mx-auto max-w-6xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.03, textShadow: "0 0 15px #facc15" }}
              className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-400 hover:drop-shadow-glow transition-all duration-300"
            >
              Driving Excellence Beyond Borders
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
            >
              Connecting Kenya to the world, one car at a time. From Nairobi to New York, we deliver unmatched value in vehicle sourcing, export, import, and sales.
            </motion.p>

            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250, 204, 21, 0.6)" }}>
                <Link
                  to="/services"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 rounded-xl font-semibold text-black hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Explore Our Global Services
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Mission & Vision Section with Enhanced Glass Morphism */}
        <motion.section 
          className="py-20 px-6 md:px-20 space-y-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl"
          >
            <h2 className="text-3xl font-bold mb-4 text-yellow-400 flex items-center justify-center gap-2">
              <Globe className="w-8 h-8" /> Our Mission
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Our mission is to redefine trust in vehicle acquisition by connecting global customers with high-quality, affordable cars from Kenya and across the world.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl"
          >
            <h2 className="text-3xl font-bold mb-4 text-yellow-400 flex items-center justify-center gap-2">
              <Target className="w-8 h-8" /> Our Vision
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              To be Africa's most trusted and internationally recognized automobile dealer, delivering cars across continents with precision, professionalism, and pride.
            </p>
          </motion.div>
        </motion.section>

        {/* Core Values with Enhanced Glass Morphism */}
        <motion.section 
          className="py-20 px-6 md:px-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-10 text-yellow-400">💎 Core Values</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {["🌐 Global Reach", "🤝 Integrity", "🚗 Quality Assurance", "📦 Seamless Logistics", "🌟 Customer Success", "⚙️ Innovation & Tech"].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-md hover:shadow-yellow-500/20 transition-all duration-300 border border-white/20"
                >
                  <p className="text-lg font-semibold text-white">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Our Story with Enhanced Glass Morphism */}
        <motion.section 
          className="py-20 px-6 md:px-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">📖 Our Story</h2>
            <p className="max-w-4xl mx-auto text-white/90 leading-relaxed mb-6">
              Justice Ultimate Automobiles began in Nyeri, Kenya, with a bold vision — to give every customer, no matter their location, access to world-class vehicles. From humble beginnings to global exports, we've built a company driven by passion, purpose, and people.
            </p>
            <ul className="mt-6 space-y-3 text-left text-sm list-disc pl-10 max-w-2xl mx-auto text-white/80">
              <li><strong>2020:</strong> Founded in Nyeri</li>
              <li><strong>2021:</strong> First cross-border sale to Uganda</li>
              <li><strong>2022:</strong> Europe export expansion</li>
              <li><strong>2023:</strong> Over 1,000 cars sold</li>
              <li><strong>2024:</strong> Global logistics hub opened in Mombasa</li>
            </ul>
          </div>
        </motion.section>

        {/* Meet the Team with Enhanced Glass Morphism */}
        <motion.section 
          className="py-20 px-6 md:px-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center justify-center gap-2">
              <Users className="w-8 h-8" /> Meet the Team
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[{ name: "Daniel Maina Wangui", role: "General Manager", flag: "🇰🇪" }, { name: "Jane Doe", role: "Head of Exports", flag: "🇺🇸" }, { name: "Ali Zain", role: "Logistics Lead", flag: "🇦🇪" }, { name: "Grace Achieng", role: "Sales Rep", flag: "🇰🇪" }, { name: "Mike Andrews", role: "UK Agent", flag: "🇬🇧" }].map((person, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
                  className="bg-white/10 p-6 rounded-xl shadow-md hover:shadow-yellow-500/30 transition-all border border-white/20 backdrop-blur-sm"
                >
                  <h3 className="font-bold text-lg text-white">{person.name}</h3>
                  <p className="text-sm text-white/80">{person.role} {person.flag}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Legal & Policies with Enhanced Glass Morphism */}
        <motion.section 
          className="py-20 px-6 md:px-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-400">📜 Legal & Policies</h2>
            <div className="flex justify-center flex-wrap gap-6">
              <Link to="/terms" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">Terms of Use</Link>
              <Link to="/privacy" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/cookies" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </motion.section>

        {/* Call to Action with Enhanced Glass Morphism */}
        <motion.section 
          className="py-16 px-6 md:px-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6 text-white">Ready to Drive With Us?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 font-semibold">
                Contact Our Global Sales Team
              </Link>
              <Link to="/catalogue" className="border-2 border-white/50 px-6 py-3 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 font-semibold text-white">
                View International Stock
              </Link>
              <Link to="/quote" className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-semibold text-black">
                Request a Shipping Quote
              </Link>
            </div>
          </div>
        </motion.section>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}