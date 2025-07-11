// File: components/CarDetailModal.tsx

import type { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import type { Car } from "../types/Car";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "../components/ui/carousel";
import { Phone, Mail, MessageCircle, ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CarDetailModalProps {
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onBook: () => void;
}

export const CarDetailModal: FC<CarDetailModalProps> = ({ open, car, onClose, onBook }) => {
  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{car.name}</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Image Carousel */}
          <Carousel>
            <CarouselContent className="rounded-xl overflow-hidden">
              {car.image.map((imgUrl, idx) => (
                <CarouselItem key={idx}>
                  <img
                    src={imgUrl}
                    alt={`${car.name} image ${idx + 1}`}
                    className="w-full h-72 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Basic Info */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">{car.tagline}</p>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">Stock ID: {car.stockId}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {car.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="text-xl font-semibold text-primary mt-3">
              {car.currency === "KES" ? "Ksh" : "$"} {car.price.toLocaleString()}
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
            <div><strong>Year:</strong> {car.specs.year}</div>
            <div><strong>Fuel:</strong> {car.specs.fuel}</div>
            <div><strong>Transmission:</strong> {car.specs.transmission}</div>
            <div><strong>Drive:</strong> {car.specs.drivetrain}</div>
            <div><strong>Mileage:</strong> {car.specs.mileage.toLocaleString()} km</div>
            <div><strong>Color:</strong> {car.specs.color}</div>
            <div><strong>Location:</strong> {car.location}</div>
            <div><strong>Availability:</strong> {car.availability}</div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-full text-sm mt-4">
            <p>{car.description}</p>
          </div>

          {/* Contact / Purchase Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              onClick={() =>
                window.open(
                  `https://wa.me/254722827258?text=Hi! I'm interested in the ${car.name} (${car.stockId}).`,
                  "_blank"
                )
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = `tel:+254722827458`)}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `mailto:sales@justiceauto.com?subject=Car Inquiry: ${car.name}&body=I'm interested in stock ${car.stockId}`)
              }
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>

            <Button variant="outline" onClick={onBook}>
              <ArrowRightCircle className="mr-2 h-4 w-4" />
              Book Test Drive
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
