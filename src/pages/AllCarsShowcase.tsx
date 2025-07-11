// File: src/pages/AllCarsShowcase.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";

import { CarCard } from "../components/CarCard";
import { CarDetailModal } from "../components/CarDetailModal";
import BookingModal from "../components/BookingModal";
import { PaymentOptions } from "../components/PaymentOptions";
import { ReceiptGenerator } from "../components/ReceiptGenerator";
import { OfferPopup } from "../components/OfferPopup";
import { SmartSearch } from "../components/SmartSearch";
import { FavoritesPanel } from "../components/FavoritesPanel";
import FinanceCalculator from "../components/FinanceCalculator";
import ComparePanel from "../components/ComparePanel";
import { ContactBar } from "../components/ContactBar";
import { carsData } from "../data/carData";
import type { Car } from "../types/Car";

import Header from "../components/ui/Header"; // ✅ Make sure path is correct
import { AnimatedHeader } from "../components/AnimatedHeader";

const AllCarsShowcase: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchResults, setSearchResults] = useState<Car[]>(carsData);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useHotkeys("/", () => document.getElementById("smart-search")?.focus());

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
  };

  const handleSearch = (query: string) => {
    const filtered = carsData.filter(car =>
      car.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleCloseModal = () => setSelectedCar(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-black dark:to-slate-900 transition-colors">
      {/* ✅ Fixed Header injected */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ✅ Proper spacing below fixed header */}
      <div className="pt-24">
        <AnimatedHeader />
        <ContactBar />
        {showOfferPopup && <OfferPopup onClose={() => setShowOfferPopup(false)} />}

        <SmartSearch onSearch={handleSearch} />

        <div className="max-w-screen-2xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(car => (
            <motion.div
              key={car.slug}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CarCard car={car} onSelect={() => handleCarSelect(car)} />
            </motion.div>
          ))}
        </div>

        {selectedCar && (
          <CarDetailModal
            open={true}
            car={selectedCar}
            onClose={handleCloseModal}
            onBook={() => setShowBookingModal(true)}
          />
        )}

        {showBookingModal && (
          <BookingModal
            open={showBookingModal}
            car={selectedCar!}
            onClose={() => setShowBookingModal(false)}
          />
        )}

        <FinanceCalculator />
        <ComparePanel cars={carsData} />
        <PaymentOptions />
        <ReceiptGenerator
          name="Client Name"
          carName="Selected Car"
          amount={123456}
          stockId="STK-0001"
        />
        <FavoritesPanel />
        <ContactBar />
      </div>
    </div>
  );
};

export default AllCarsShowcase;
