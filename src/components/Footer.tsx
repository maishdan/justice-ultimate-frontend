// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github } from "lucide-react";
import { FaHome, FaTachometerAlt, FaEnvelope, FaPhone, FaWhatsapp, FaFileAlt, FaLock, FaCookieBite } from 'react-icons/fa';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Justice Ultimate Automobiles */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Justice Ultimate Automobiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaHome className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/customer-dashboard" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaTachometerAlt className="w-4 h-4" />
                  Customer Dashboard
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
            <h3 className="text-xl font-bold text-white mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vehicle-catalogue" className="text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  Vehicle Catalogue
                </Link>
              </li>
              <li>
                <Link to="/book-test-drive" className="text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  Car Booking
                </Link>
              </li>
              <li className="text-white/60">
                Vehicle Insurance (Coming Soon)
              </li>
              <li className="text-white/60">
                Auto Consultations (Coming Soon)
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaFileAlt className="w-4 h-4" />
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaLock className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaCookieBite className="w-4 h-4" />
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@justiceauto.com" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaEnvelope className="w-4 h-4" />
                  info@justiceauto.com
                </a>
              </li>
              <li>
                <a href="tel:+254722827458" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaPhone className="w-4 h-4" />
                  +254 722 827 458
                </a>
              </li>
              <li>
                <a href="https://wa.me/254722827458" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors duration-300">
                  <FaWhatsapp className="w-4 h-4" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6">
           <p className="text-center text-white/60 text-sm">
      @ Developed by Daniwest Tech Sol. © 2025 Justice Ultimate Automobiles. All rights reserved.
      <a
        href="https://www.github.com/maishdan"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 ml-2 px-3 py-1 bg-white/10 hover:bg-yellow-400 hover:text-black text-white/80 rounded-full transition-all duration-300 shadow-md"
      >
        <Github className="w-4 h-4" />
        Daniwest Maina
      </a>
    </p>
        </div>
      </motion.div>
    </footer>
  );
}
