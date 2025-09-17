// src/pages/LandingPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../components/ui/LoadingScreen';
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Github } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTachometerAlt, FaEnvelopeOpenText } from "react-icons/fa";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";


export default function LandingPage() {
  // All hooks at the top, always called in the same order
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  // Optionally, show loader for a minimal 300ms to avoid flicker
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Car Start Sound: Play only on initial homepage load with debug log
  useEffect(() => {
    if (location.pathname === "/") {
      const audio = new Audio("/car-start.mp3");
      const hasPlayed = sessionStorage.getItem("carStartPlayed");
      if (!hasPlayed) {
        audio.play()
          .then(() => console.log("✅ Sound played"))
          .catch((e) => {
            console.warn("🚫 Autoplay blocked or file not found:", e);
            // Don't show error to user, just log it
          });
        sessionStorage.setItem("carStartPlayed", "true");
      }
    }
  }, [location.pathname]);

  // Function to play car start sound on button clicks
  const playCarStart = () => {
    try {
      const audio = new Audio("/car-start.mp3");
      audio.play().catch((e) => {
        console.warn("🚫 Button sound blocked:", e);
      });
    } catch (error) {
      console.warn("🚫 Sound play failed:", error);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading Justice Ultimate Automobiles..." progress={100} />;
  }

  return (
    <div
      className="min-h-screen w-full pt-0 clean-container"
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
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div className="relative z-10 min-h-screen w-full flex flex-col clean-container">
        {/* Hero Section with Premium Glass Morphism */}
        <motion.section
          className="relative text-center py-12 sm:py-16 md:py-24 lg:py-32 px-2 sm:px-4 md:px-8 lg:px-20 w-full"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Glass Panel with Enhanced Effects */}
          <div className="glass-panel mx-auto max-w-6xl rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl border border-white/20 backdrop-blur-xl">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 text-adaptive-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Drive Your <span className="text-yellow-400 animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Dream Today</span>
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              🚗 Experience global automotive excellence – from luxury car rentals to smart, secure bookings across all continents.
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
                  onClick={playCarStart}
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
                  Explore Cars
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section with Enhanced Glass Cards */}
        <section className="px-2 sm:px-4 md:px-8 lg:px-20 py-8 sm:py-12 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel mx-auto max-w-4xl rounded-2xl p-8 mb-12"
          >
            <h3 className="text-3xl font-semibold mb-4 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">Why Choose Us?</h3>
            <p className="max-w-3xl mx-auto text-white/90 leading-relaxed">
              We redefine excellence in the global automotive space by offering futuristic car leasing, intelligent recommendations, secure booking with biometric verification, and carbon-neutral delivery solutions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto grid-adaptive">
            {[
              { title: "🌍 Global Reach", desc: "Serving customers across Africa, Europe, Asia, and the Americas with seamless online booking." },
              { title: "🔐 Security First", desc: "Encrypted transactions, 2FA login, and verified vendor listings to keep your data and choices safe." },
              { title: "🚘 Premium Fleet", desc: "Access luxury cars, electric vehicles, commercial vans, and rare vintage collections all in one platform." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="glass-panel p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative">
                  <h4 className="text-xl font-bold mb-4 drop-shadow-lg group-hover:text-yellow-300 transition-colors duration-300">{feature.title}</h4>
                  <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">{feature.desc}</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner with Premium Glass Effect */}
        <section className="py-16 text-center px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel mx-auto max-w-4xl rounded-3xl p-10 shadow-2xl border border-white/20 backdrop-blur-xl"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">Ready to Drive into the Future?</h3>
            <p className="text-lg mb-8 max-w-xl mx-auto text-white/90 leading-relaxed">
              Join thousands globally who rely on Justice Ultimate Automobiles for reliability, luxury, and innovation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl"
                >
                  Join Now
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

        {/* Expertise Section with Enhanced Grid Layout */}
        <section className="py-20 px-6 md:px-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">Explore Our Expertise</h3>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[{
              icon: "🚗", title: "Luxury Car Rentals", desc: "Choose from our fleet of high-end cars for business or leisure travel."
            }, {
              icon: "🛠️", title: "Auto Servicing & Repair", desc: "Certified technicians offering routine maintenance and diagnostics."
            }, {
              icon: "📦", title: "Vehicle Delivery & Logistics", desc: "We handle global shipping and secure delivery of all vehicle types."
            }, {
              icon: "💼", title: "Corporate Fleet Management", desc: "Custom solutions for businesses needing efficient vehicle oversight."
            }, {
              icon: "📝", title: "Smart Car Booking", desc: "Use our intelligent booking system with real-time availability and support."
            }, {
              icon: "🔍", title: "Vehicle Inspection & History", desc: "Detailed reports and checks before every sale to ensure quality."
            }].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  transition: { duration: 0.3 }
                }}
                className={`glass-panel p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden ${
                  item.title.includes("Fleet") ? "ring-2 ring-yellow-400/50" : ""
                }`}
              >
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                    {item.icon} {item.title}
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 mb-4">{item.desc}</p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium group-hover:translate-x-1 transform transition-transform duration-300"
                  >
                    Learn More →
                  </Link>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Footer with Glass Morphism */}
        <footer className="py-12 px-6 md:px-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h5 className="font-semibold text-white mb-4 text-yellow-400">Justice Ultimate Automobiles</h5>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-2 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform group"
                    >
                      <FaHome className="group-hover:scale-110 transition-transform duration-300" /> Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/customer"
                      className="flex items-center gap-2 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform group"
                    >
                      <FaTachometerAlt className="group-hover:scale-110 transition-transform duration-300" /> Customer Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="flex items-center gap-2 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform group"
                    >
                      <FaEnvelopeOpenText className="group-hover:scale-110 transition-transform duration-300" /> Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-4 text-yellow-400">Our Services</h5>
                <ul className="space-y-3 text-white/80">
                  <li><Link to="/catalogue" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">Vehicle Catalogue</Link></li>
                  <li><Link to="/book-test-drive" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">Car Booking</Link></li>
                  <li><Link to="/vehicle-insurance" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">Vehicle Insurance (Coming Soon)</Link></li>
                  <li><Link to="/auto-consultations" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">Auto Consultations (Coming Soon)</Link></li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-4 text-yellow-400">Legal</h5>
                <ul className="space-y-3 text-white/80">
                  <li><Link to="/terms" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">📜 Terms of Use</Link></li>
                  <li><Link to="/privacy" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">🔒 Privacy Policy</Link></li>
                  <li><Link to="/cookies" className="hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform inline-block">🍪 Cookie Policy</Link></li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-4 text-yellow-400">Connect With Us</h5>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <a 
                      href="mailto:info@justiceauto.com" 
                      className="flex items-center gap-2 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform group"
                    >
                      <FaEnvelope className="group-hover:scale-110 transition-transform duration-300" /> 
                      <span className="hidden sm:inline">Email: info@justiceauto.com</span>
                      <span className="sm:hidden">Email</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="tel:+254722827458" 
                      className="flex items-center gap-2 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 transform group"
                    >
                      <FaPhoneAlt className="group-hover:scale-110 transition-transform duration-300" /> 
                      <span className="hidden sm:inline">Phone: +254 722 827 458</span>
                      <span className="sm:hidden">Phone</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://wa.me/254722827458?text=Hello%2C%20I%20need%20assistance%20from%20Justice%20Ultimate%20Automobiles." 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 hover:text-green-400 transition-all duration-300 hover:translate-x-1 transform group"
                    >
                      <FaWhatsapp className="group-hover:scale-110 transition-transform duration-300" /> 
                      <span className="hidden sm:inline">WhatsApp Support</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center text-xs mt-8 pt-6 border-t border-white/20 text-white/60">
      &copy; 2025 Justice Ultimate Automobiles. All rights reserved.  
      @ Developed by Daniwest Tech Sol.
      <a
        href="https://www.github.com/maishdan"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-white/10 hover:bg-yellow-400 hover:text-black text-white/80 rounded-full transition-all duration-300 shadow-sm"
      >
        <Github className="w-3 h-3" />
        <span className="text-xs">Daniwest Maina</span>
      </a>
    </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
