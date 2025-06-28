// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-8 px-4 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h5 className="text-xl font-semibold mb-2">Justice Ultimate Automobiles</h5>
          <p className="text-sm">Redefining car ownership across Africa with smart technology, trust, and luxury experiences.</p>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Our Services</h5>
          <ul className="space-y-1 text-sm">
            <li><Link to="/showroom" className="hover:text-green-300">Vehicle Catalogue</Link></li>
            <li><Link to="/book-test-drive" className="hover:text-green-300">Car Booking</Link></li>
            <li><span className="cursor-not-allowed text-gray-400">Vehicle Insurance (Coming soon)</span></li>
            <li><span className="cursor-not-allowed text-gray-400">Auto Consultations (Coming soon)</span></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Legal</h5>
          <ul className="space-y-1 text-sm">
            <li><Link to="/terms" className="hover:text-green-300">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:text-green-300">Privacy Policy</Link></li>
            <li><Link to="/cookies" className="hover:text-green-300">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Connect With Us</h5>
          <ul className="space-y-1 text-sm">
            <li>Email: <a href="mailto:info@justiceauto.com" className="hover:text-green-300">info@justiceauto.com</a></li>
            <li>Phone: <a href="tel:+254722827458" className="hover:text-green-300">+254 722 827 458</a></li>
            <li>
              <a
                href="https://wa.me/254722827458?text=Hello%20Justice%20Ultimate%20Automobiles%2C%20I%20need%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300"
              >WhatsApp Support</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Justice Ultimate Automobiles. All rights reserved.
      </div>
    </footer>
  );
}
