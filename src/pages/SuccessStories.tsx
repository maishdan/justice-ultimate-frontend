// src/pages/SuccessStories.tsx
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaStar,
  FaGlobeAfrica,
  FaUpload,
  FaPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const stories = [
  {
    id: 1,
    name: "Jane Wambui",
    location: "Nairobi, Kenya",
    car: "Toyota Prado 2023",
    image: "/images/jane.jpg",
    rating: 5,
    useCase: "Family",
    video: "https://www.youtube.com/embed/F9XVdIV-VPc",
    before: "/images/before.jpg",
    after: "/images/after.jpg",
    story: {
      problem: "Needed a reliable SUV for rural Kenya roads.",
      journey: "Found us on Facebook, visited the Nyeri branch, and test drove a Prado.",
      outcome: "We delivered in 2 days with insurance and logbook.",
      result: "Zero issues for 7 months, drives weekly 300km.",
    },
  },
  // You can add more story objects here...
];

export default function SuccessStories() {
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 2;

  const filtered = stories.filter(
    (s) => filter === "All" || s.useCase === filter || s.car.includes(filter)
  );

  const totalPages = Math.ceil(filtered.length / storiesPerPage);
  const currentStories = filtered.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 bg-gradient-to-br from-blue-950 to-black text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 border-b border-yellow-400 pb-2">
          🏆 Success Stories
        </h1>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 bg-blue-100 text-black rounded"
          >
            <option value="All">All Stories</option>
            <option value="Family">Family</option>
            <option value="Business">Business</option>
            <option value="Ride-sharing">Ride-sharing</option>
            <option value="Toyota Prado">Toyota Prado</option>
            <option value="2023">2023 Models</option>
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 shadow hover:drop-shadow-[0_0_10px_#facc15]"
          >
            <FaPlus /> Share Story
          </button>
        </div>

        {/* Scrollable Cards */}
        <div className="flex overflow-x-auto gap-6 pb-4">
          {currentStories.map((story) => (
            <div
              key={story.id}
              className="min-w-[300px] bg-blue-900 border border-yellow-400 rounded-xl p-4 shadow transition-all duration-300 hover:scale-105 hover:shadow-yellow-400 hover:drop-shadow-[0_0_15px_#facc15]"
            >
              <img src={story.image} className="w-full h-48 object-cover rounded" />
              <h2 className="text-xl font-bold mt-2 text-yellow-300">{story.name}</h2>
              <p className="text-gray-300">
                <FaMapMarkerAlt className="inline mr-1" />
                {story.location}
              </p>
              <p className="mt-1 text-sm">🚘 {story.car}</p>
              <div className="flex text-yellow-400 text-sm mt-2">
                {Array.from({ length: story.rating }, (_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="mt-2 italic text-gray-400">"{story.story.outcome}"</p>
              <a href="#" className="text-yellow-400 hover:underline mt-2 inline-block">
                Read Full Story →
              </a>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-yellow-400 text-black"
                  : "bg-blue-800 text-yellow-300"
              } hover:scale-105 transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Story Details */}
        {currentStories.map((story) => (
          <div
            key={story.id}
            className="bg-blue-900 border border-yellow-400 rounded-xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:drop-shadow-[0_0_15px_#facc15]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img src={story.before} className="rounded shadow" alt="Before" />
              <img src={story.after} className="rounded shadow" alt="After" />
            </div>

            <div className="text-gray-300 space-y-2">
              <h3 className="text-2xl font-bold text-yellow-300">🎯 {story.name}'s Journey</h3>
              <p>📍 <strong>Location:</strong> {story.location}</p>
              <p>🚗 <strong>Car Bought:</strong> {story.car}</p>
              <p>💬 <strong>Problem:</strong> {story.story.problem}</p>
              <p>🛣 <strong>Journey:</strong> {story.story.journey}</p>
              <p>🎉 <strong>Outcome:</strong> {story.story.outcome}</p>
              <p>✅ <strong>Result:</strong> {story.story.result}</p>
            </div>

            {story.video && (
              <iframe
                width="100%"
                height="350"
                src={story.video}
                className="rounded mt-4"
                allowFullScreen
              ></iframe>
            )}
          </div>
        ))}

        {/* Trust Section */}
        <div className="text-center pt-10">
          <h2 className="text-2xl text-yellow-400 font-bold">🧩 Trusted Globally</h2>
          <p className="text-gray-300">
            10,742 Cars Delivered • Active in 43 Countries • Avg. Rating: 4.9/5
          </p>
        </div>

        {/* Live Map Embed */}
        <div className="mt-10">
          <h3 className="text-xl text-yellow-300 font-semibold mb-2 text-center">
            🌍 Where Our Clients Are
          </h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8455589247724!2d36.803848773973975!3d-1.2652404356014013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17cf83d20673%3A0xe0e7e1768510ea56!2sJUSTICE%20ULTIMATE%20AUTOMOBILES!5e0!3m2!1sen!2ske!4v1752239190599!5m2!1sen!2ske"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded shadow-md"
          />
        </div>
      </div>

      {/* Genie-Style Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 100 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-800 border border-yellow-400 p-6 rounded-xl shadow-xl w-full max-w-xl space-y-4"
            >
              <h3 className="text-2xl font-bold text-yellow-300">📢 Share Your Story</h3>
              <form className="grid gap-4 md:grid-cols-2">
                <input type="text" placeholder="Full Name" className="p-2 rounded bg-blue-100 text-black" required />
                <input type="text" placeholder="Location" className="p-2 rounded bg-blue-100 text-black" required />
                <input type="text" placeholder="Car Model" className="p-2 rounded bg-blue-100 text-black" required />
                <input type="file" className="p-2 rounded bg-blue-100 text-black" />
                <textarea placeholder="Your Journey" rows={4} className="p-2 rounded bg-blue-100 text-black col-span-2" required></textarea>
                <button className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 col-span-2">
                  <FaUpload className="inline mr-2" /> Submit Story
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-yellow-300 underline hover:text-yellow-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
