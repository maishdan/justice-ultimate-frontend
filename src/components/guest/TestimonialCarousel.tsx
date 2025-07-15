import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Amina K.",
    avatar: "/images/avatars/amina.png",
    quote: "Justice Ultimate Automobiles made my dream car a reality. The process was smooth and the support was world-class!"
  },
  {
    name: "James O.",
    avatar: "/images/avatars/james.png",
    quote: "I booked a luxury SUV for my wedding and it was delivered on time, spotless, and with a smile. Highly recommended!"
  },
  {
    name: "Priya S.",
    avatar: "/images/avatars/priya.png",
    quote: "The guest experience is amazing. I felt valued even before signing up. Will definitely use again!"
  }
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-4 text-blue-900">What Our Guests Say</h3>
      <div className="relative max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
          >
            <img src={testimonials[index].avatar} alt={testimonials[index].name} className="w-16 h-16 rounded-full mb-3 border-2 border-blue-900" />
            <div className="font-semibold text-gray-900 mb-1">{testimonials[index].name}</div>
            <p className="text-gray-700 text-center italic">"{testimonials[index].quote}"</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={prev} className="text-blue-900 hover:text-blue-700 font-bold text-lg">&#8592;</button>
          <button onClick={next} className="text-blue-900 hover:text-blue-700 font-bold text-lg">&#8594;</button>
        </div>
      </div>
    </section>
  );
} 