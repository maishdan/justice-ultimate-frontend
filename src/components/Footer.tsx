// src/components/Footer.tsx
// React import removed as it's unused in this file
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Marquee import removed; using StepMarquee for step-based display
import StepMarquee from './ui/StepMarquee';
import { brandLogos } from '../data/brandLogos';
import { Github } from "lucide-react";
import { FaHome, FaTachometerAlt, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full mt-16">
      <motion.div 
        className="glass-panel mx-auto max-w-7xl rounded-2xl p-8 md:p-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        {/* Trusted Partners - Real Car Brand Logos (Step by step 60s each) */}
        <div className="mb-10">
          <h3 className="text-center text-white/90 text-sm md:text-base font-semibold mb-4">Trusted by leading automotive brands</h3>
          <StepMarquee
            items={brandLogos}
            intervalMs={30000}
            renderItem={(b) => (
              <img src={b.src} alt={b.alt} className="h-10 md:h-12 object-contain opacity-95" />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Justice Ultimate Automobiles */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              Justice Ultimate Automobiles
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Your trusted partner for premium automotive solutions across Africa and beyond.
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaHome className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaTachometerAlt className="w-4 h-4" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaEnvelope className="w-4 h-4" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vehicle-catalogue" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  🚗 Vehicle Catalogue
                </Link>
              </li>
              <li>
                <Link to="/book-test-drive" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  📅 Test Drive Booking
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  🔑 Car Rentals
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  🎥 Video Showcase
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  🔧 Auto Services
                </Link>
              </li>
              <li className="text-white/60 flex items-center gap-2">
                💰 Vehicle Insurance (Coming Soon)
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  📰 Latest News
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  ⭐ Success Stories
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  📜 Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  🔒 Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                  🍪 Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Connect With Us</h3>
            <div className="space-y-3">
              <div>
                <p className="text-white/90 text-sm font-medium mb-2">📍 Location</p>
                <p className="text-white/70 text-sm">Nairobi, Kenya</p>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-2">📞 Contact</p>
                <a href="tel:+254722827458" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300 text-sm">
                  <FaPhone className="w-3 h-3" />
                  +254 722 827 458
                </a>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-2">✉️ Email</p>
                <a href="mailto:info@justiceauto.com" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300 text-sm">
                  <FaEnvelope className="w-3 h-3" />
                  info@justiceauto.com
                </a>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-2">💬 WhatsApp</p>
                <a href="https://wa.me/254722827458?text=Hello%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-300 text-sm">
                  <FaWhatsapp className="w-3 h-3" />
                  Chat with us
                </a>
              </div>
              
              {/* Social Media Links */}
              <div className="pt-3 border-t border-white/20">
                <p className="text-white/90 text-sm font-medium mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <span className="text-white text-xs">f</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors">
                    <span className="text-white text-xs">t</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-400 hover:to-pink-400 transition-colors">
                    <span className="text-white text-xs">ig</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                    <span className="text-white text-xs">yt</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                © 2025 <span className="text-yellow-400 font-semibold">Justice Ultimate Automobiles</span>. All rights reserved.
              </p>
              <p className="text-white/60 text-xs mt-1">
                Driving excellence across Africa and beyond 🌍
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-white/60 text-xs">Developed by</p>
                <a
                  href="https://www.github.com/maishdan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600/20 to-green-600/20 hover:from-blue-500/30 hover:to-green-500/30 text-white/90 hover:text-white rounded-full transition-all duration-300 border border-white/10"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-medium">Daniwest Tech Sol</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Additional Footer Info */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-white/50 text-xs">
              🚗 Premium Automotive Solutions | 🔒 Secure Transactions | 🌟 Customer Excellence | 🚀 AI-Powered Support
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
