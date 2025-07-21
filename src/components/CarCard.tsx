// src/components/CarCard.tsx

import type { FC } from "react";
import type { Car } from "../types/Car";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface CarCardProps {
  car: Car;
  onSelect?: () => void;
}

export const CarCard: FC<CarCardProps> = ({ car, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-lg border bg-white dark:bg-zinc-900 transition-all",
        "flex flex-col"
      )}
    >
      <div className="relative w-full h-56">
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
        <span
          className={cn(
            "absolute top-2 right-2 text-xs px-2 py-1 rounded-full",
            car.availability === "Available"
              ? "bg-green-500 text-white"
              : car.availability === "In Transit"
              ? "bg-yellow-500 text-black"
              : "bg-red-500 text-white"
          )}
        >
          {car.availability ?? "Unknown"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{car.name || car.title || 'Car'}</h3>
          <div className="flex items-center text-yellow-400">
            <Star size={16} className="mr-1" />
            <span className="text-sm">{car.ratings?.toFixed(1) ?? "N/A"}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{car.tagline || car.description || ''}</p>

        <div className="flex flex-wrap gap-2 text-sm mt-1">
          {(car.tags || []).map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-2 font-bold text-primary text-lg">
          {(car.currency ?? "KES") === "KES" ? "Ksh" : "$"} {car.price?.toLocaleString() || 'Contact for price'}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{car.specs?.year || car.year || 'N/A'}</span>
          <span>{car.specs?.fuel || car.fuel_type || 'N/A'}</span>
          <span>{car.specs?.transmission || car.transmission || 'N/A'}</span>
          <span>{(car.specs?.mileage || car.mileage)?.toLocaleString() || 'N/A'} km</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="default"
            className="w-full"
            onClick={() =>
              window.open(
                `https://wa.me/254722827458?text=Hi! I'm interested in the ${car.name || car.title || 'car'} (${car.stockId || car.id}). Can you tell me more?`,
                "_blank"
              )
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="p-2"
            onClick={() => (window.location.href = `tel:+254722827458`)}
          >
            <Phone className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="p-2"
            onClick={() =>
              (window.location.href = `mailto:sales@justiceauto.com?subject=Car Inquiry: ${car.name}&body=I'm interested in stock ${car.stockId}`)
            }
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>

        {onSelect && (
          <Button
            variant="default"
            className="mt-2 text-blue-600 hover:underline"
            onClick={onSelect}
          >
            Quick View →
          </Button>
        )}
      </div>
    </motion.div>
  );
};
