// src/components/ui/carousel.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className }) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % children.length);
  const prev = () => setCurrent((prev) => (prev - 1 + children.length) % children.length);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {children[current]}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md z-10"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md z-10"
      >
        ▶
      </button>
    </div>
  );
};

export const CarouselContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full">{children}</div>
);

export const CarouselItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full">{children}</div>
);
