// src/components/CarCard.tsx

import type { FC } from "react";
import type { Car } from "../types/Car";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import type { MouseEvent } from "react";
import { CarDetailModal } from "./CarDetailModal";

interface CarCardProps {
  car: Car;
  onSelect?: () => void;
}

export const CarCard: FC<CarCardProps> = ({ car }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.04 }}
        className={cn(
          "relative rounded-xl overflow-hidden shadow-xl border border-blue-400/30 bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-950/90 backdrop-blur-lg transition-all flex flex-col min-w-[180px] max-w-[220px] w-full",
        )}
        style={{ minHeight: '340px', maxHeight: '370px' }}
        onClick={() => setShowModal(true)}
      >
        <div className="relative w-full h-32 sm:h-36 md:h-36 lg:h-32 xl:h-32">
          <img
            src={car.image?.[0] || car.main_image || car.additional_images?.[0] || '/images/placeholder-car.jpg'}
            alt={car.name || car.title || 'Car'}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          {car.featured && (
            <Badge
              variant="default"
              className="absolute top-2 left-2 bg-yellow-500 text-black animate-pulse"
            >
              Featured
            </Badge>
          )}
          {/* Tag for On Sale or Sold Out */}
          {car.availability === 'sold' || car.availability === 'Sold Out' ? (
            <span className="absolute top-2 right-2 text-xs px-3 py-1 rounded-full bg-red-600 text-white font-bold shadow-lg z-10">
              Sold Out
            </span>
          ) : (
            <span className="absolute top-2 right-2 text-xs px-3 py-1 rounded-full bg-green-500 text-white font-bold shadow-lg z-10">
              On Sale
            </span>
          )}
        </div>

        <div className="p-3 flex flex-col gap-2 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold truncate">{car.name || car.title || 'Car'}</h3>
            {car.ratings && (
              <div className="flex items-center text-yellow-400">
                <Star size={16} className="mr-1" />
                <span className="text-sm">{car.ratings?.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-blue-200 truncate">{car.tagline || car.description || ''}</p>

          <div className="flex flex-wrap gap-2 text-xs mt-1">
            {(car.tags || []).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-1 font-bold text-blue-300 text-base">
            {(car.currency ?? "KES") === "KES" ? "Ksh" : "$"} {car.price?.toLocaleString() || 'Contact for price'}
          </div>

          <div className="flex items-center justify-between text-xs text-blue-100">
            {car.specs?.year || car.year ? <span>{car.specs?.year || car.year}</span> : <span></span>}
            {car.specs?.fuel || car.fuel_type ? <span>{car.specs?.fuel || car.fuel_type}</span> : <span></span>}
            {car.specs?.transmission || car.transmission ? <span>{car.specs?.transmission || car.transmission}</span> : <span></span>}
            {(car.specs?.mileage || car.mileage) ? <span>{(car.specs?.mileage || car.mileage)?.toLocaleString()} km</span> : <span></span>}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={((e: MouseEvent) => {
                e.stopPropagation();
                window.open(
                  `https://wa.me/254722827458?text=Hi! I'm interested in the ${car.name || car.title || 'car'} (${car.stockId || car.id}). Can you tell me more?`,
                  "_blank"
                );
              }) as any}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-2 border-blue-400 text-blue-200"
              onClick={((e: MouseEvent) => {
                e.stopPropagation();
                window.location.href = `tel:+254722827458`;
              }) as any}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-2 border-blue-400 text-blue-200"
              onClick={((e: MouseEvent) => {
                e.stopPropagation();
                window.location.href = `mailto:sales@justiceauto.com?subject=Car Inquiry: ${car.name}&body=I'm interested in stock ${car.stockId}`;
              }) as any}
            >
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="default"
            className="mt-2 w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold"
            onClick={((e: MouseEvent) => {
              e.stopPropagation();
              setShowModal(true);
            }) as any}
          >
            Quick View →
          </Button>
        </div>
      </motion.div>
      {showModal && (
        <CarDetailModal 
          open={showModal}
          car={car}
          onClose={() => setShowModal(false)}
          onBook={() => {}}
        />
      )}
    </>
  );
};
