// File: src/components/OfferPopup.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface OfferPopupProps {
  onClose?: () => void;
}

export const OfferPopup = ({ onClose }: OfferPopupProps) => {
  const [visible, setVisible] = useState(true);
  const [seconds, setSeconds] = useState(60); // 1 minute countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible || seconds <= 0) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-400 text-black px-6 py-4 rounded-xl shadow-lg flex items-center gap-4"
    >
      <div>
        <strong>🔥 Limited Offer:</strong> Get 5% off bookings made in the next{" "}
        <span className="font-bold">{seconds}s</span>!
      </div>
      <button onClick={handleClose} className="ml-4 text-black">
        <X size={20} />
      </button>
    </motion.div>
  );
};
