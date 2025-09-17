import { useState } from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Footer from "../components/Footer";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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
          className="text-center py-20 md:py-32 px-4 md:px-20 w-full"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Glass Panel with Enhanced Effects */}
          <div className="glass-panel mx-auto max-w-6xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">Global Automotive </span>
              <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Services</span>
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              🚘 From Nairobi to New York — Justice Ultimate Automobiles provides expert car services, international sourcing, export, import, and logistics.
            </motion.p>
            <motion.div 
              className="flex flex-col md:flex-row justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl border-0" 
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/catalogue">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl"
                >
                  Visit Showroom
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section with Enhanced Glass Cards */}
        <section className="px-6 md:px-20 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)] mb-4">
              Our Premium Services
            </h3>
            <p className="text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of automotive services designed to meet your every need, from luxury rentals to international logistics.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  transition: { duration: 0.3 }
                }}
                className="glass-panel p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    {service.icon} {service.title}
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 mb-4">
                    {service.desc}
                  </p>
                  <Link 
                    to="/catalogue" 
                    className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium group-hover:translate-x-1 transform transition-transform duration-300"
                  >
                    Explore More →
                  </Link>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-16 text-center px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel mx-auto max-w-4xl rounded-3xl p-10 shadow-2xl border border-white/20 backdrop-blur-xl"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">
              Ready to Experience Premium Automotive Services?
            </h3>
            <p className="text-lg mb-8 max-w-xl mx-auto text-white/90 leading-relaxed">
              Join thousands of satisfied customers who trust Justice Ultimate Automobiles for their automotive needs worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
