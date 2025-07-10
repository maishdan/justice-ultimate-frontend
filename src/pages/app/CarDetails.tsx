// src/pages/app/CarDetails.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CarImageGallery from "../../components/car/CarImageGallery";
import CarSpecsCard from "../../components/car/CarSpecsCard";
import PurchaseOptions from "../../components/car/PurchaseOptions";
import BookingModal from "../../components/car/BookingModal";
import { Button } from "../../components/ui/button";
import { carsDetailed as cars } from "../../pages/VehicleCatalogue";

export interface CarType {
  slug: string;
  id: string;
  category: string;
  name: string;
  description: string;
  image: string[];
  tagline: string;
  stockId: string;
  tags: string[];
  specs: {
    engine: string;
    fuel: string;
    year: number;
    mileage: string;
    color: string;
    transmission: string;
    drive: string;
  };
}


export default function CarDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<CarType | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    const foundCar = cars.find((c) => c.slug === slug);
    if (foundCar) {
      setCar(foundCar);
    } else {
      setTimeout(() => {
        console.warn("Car not found, redirecting to 404");
        navigate("/404", { replace: true });
      }, 0);
    }
  }, [slug, navigate]);

  const handleImageError = () => {
    setImageError(true);
    setStatusMessage({
      type: "error",
      message: "One or more car images failed to load.",
    });
  };

  useEffect(() => {
    if (car && !imageError) {
      const timeout = setTimeout(() => {
        setStatusMessage({
          type: "success",
          message: "Car details loaded successfully.",
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [car, imageError]);

  if (!car) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-blue-950 text-white p-6 md:p-16">
      {statusMessage && (
        <div
          className={`text-center mb-6 text-sm font-medium ${
            statusMessage.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">{car.name}</h1>
        <p className="text-gray-300 italic">{car.tagline}</p>
        <p className="text-sm text-gray-400 mt-1">Stock ID: {car.stockId}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {car.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <CarImageGallery
          images={car.image}
          name={car.name}
          onError={handleImageError}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <CarSpecsCard car={car.specs} />
        <div className="text-gray-300 space-y-4">
          <h2 className="text-xl font-semibold text-white">About This Car</h2>
          <p>{car.description}</p>
          <PurchaseOptions />
        </div>
      </section>

      <section className="flex flex-wrap gap-4 justify-center mb-10">
        <ActionButton
          label="WhatsApp"
          href={`https://wa.me/254700000000?text=I'm%20interested%20in%20${encodeURIComponent(
            car.name
          )}`}
        />
        <ActionButton label="SMS" href="sms:+254700000000" />
        <ActionButton label="Call" href="tel:+254700000000" />
        <ActionButton label="Email" href="mailto:justice@automobiles.co.ke" />
        <ActionButton label="Rent This Car" onClick={() => setBookingOpen(true)} />
        <ActionButton label="Book This Car" onClick={() => setBookingOpen(true)} />
      </section>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        carName={car.name}
      />
    </main>
  );
}

function ActionButton({
  label,
  href,
  onClick,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="hover:shadow-glow transition-all">
      {href ? (
        <Button variant="outline" className="rounded-2xl px-6 py-2 text-sm">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onClick}
          className="rounded-2xl px-6 py-2 text-sm"
        >
          {label}
        </Button>
      )}
    </motion.div>
  );
}
