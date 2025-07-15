import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function GuestContactBar() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-blue-900 text-white rounded-xl shadow-lg p-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href="https://wa.me/254722827458?text=Hello%2C%20I%20need%20assistance%20from%20Justice%20Ultimate%20Automobiles."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 hover:bg-green-400 transition font-semibold shadow"
      >
        <FaWhatsapp /> WhatsApp
      </a>
      <a
        href="mailto:info@justiceauto.com"
        className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition font-semibold shadow"
      >
        <FaEnvelope /> Email
      </a>
      <a
        href="tel:+254722827458"
        className="flex items-center gap-2 px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 transition font-semibold shadow"
      >
        <FaPhoneAlt /> Call
      </a>
    </motion.div>
  );
} 