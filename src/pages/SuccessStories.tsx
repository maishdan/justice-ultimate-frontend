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
import { Filter, Trophy, Users, MapPin } from "lucide-react";

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
    <div 
      className="min-h-screen w-full pt-0"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Enhanced Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none z-10"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div className="relative z-10 min-h-screen w-full flex flex-col py-8">
        <div className="max-w-7xl mx-auto space-y-10 px-4 md:px-6">
          {/* Hero Section with Premium Glass Morphism */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">🏆 Success </span>
                <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Stories</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover real stories from our satisfied customers who found their perfect vehicles with Justice Ultimate Automobiles.
              </motion.p>
            </div>
          </motion.section>

          {/* Filter Bar with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="All">All Stories</option>
                    <option value="Family">Family</option>
                    <option value="Business">Business</option>
                    <option value="Ride-sharing">Ride-sharing</option>
                    <option value="Toyota Prado">Toyota Prado</option>
                    <option value="2023">2023 Models</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
                >
                  <FaPlus /> Share Story
                </button>
              </div>
            </div>
          </motion.section>

          {/* Scrollable Cards with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex overflow-x-auto gap-6 pb-4">
              {currentStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="min-w-[300px] glass-panel border border-white/20 rounded-2xl p-6 shadow-xl backdrop-blur-xl group relative overflow-hidden"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img src={story.image} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h2 className="text-xl font-bold mt-2 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">{story.name}</h2>
                  <p className="text-white/80 flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="text-yellow-400" />
                    {story.location}
                  </p>
                  <p className="mt-2 text-sm text-white/90">🚘 {story.car}</p>
                  <div className="flex text-yellow-400 text-sm mt-3">
                    {Array.from({ length: story.rating }, (_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="mt-3 italic text-white/80">"{story.story.outcome}"</p>
                  <a href="#" className="text-yellow-400 hover:text-yellow-300 mt-3 inline-block transition-colors duration-300 font-medium">
                    Read Full Story →
                  </a>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Pagination Controls with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center"
          >
            <div className="glass-panel rounded-2xl p-4 shadow-xl border border-white/20 backdrop-blur-xl">
              <div className="flex gap-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                        : "bg-white/10 text-yellow-300 hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Story Details with Enhanced Glass Morphism */}
          {currentStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass-panel border border-white/20 rounded-2xl p-8 shadow-xl backdrop-blur-xl space-y-6 group relative overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-xl">
                  <img src={story.before} className="rounded-xl shadow group-hover:scale-105 transition-transform duration-300" alt="Before" />
                </div>
                <div className="relative overflow-hidden rounded-xl">
                  <img src={story.after} className="rounded-xl shadow group-hover:scale-105 transition-transform duration-300" alt="After" />
                </div>
              </div>

              <div className="text-white/90 space-y-3">
                <h3 className="text-2xl font-bold text-yellow-300">🎯 {story.name}'s Journey</h3>
                <p className="flex items-center gap-2"><MapPin className="text-yellow-400" /> <strong>Location:</strong> {story.location}</p>
                <p>🚗 <strong>Car Bought:</strong> {story.car}</p>
                <p>💬 <strong>Problem:</strong> {story.story.problem}</p>
                <p>🛣 <strong>Journey:</strong> {story.story.journey}</p>
                <p>🎉 <strong>Outcome:</strong> {story.story.outcome}</p>
                <p>✅ <strong>Result:</strong> {story.story.result}</p>
              </div>

              {story.video && (
                <div className="relative overflow-hidden rounded-xl">
                  <iframe
                    width="100%"
                    height="350"
                    src={story.video}
                    className="rounded-xl shadow-lg"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}

          {/* Trust Section with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center pt-10"
          >
            <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl">
              <h2 className="text-2xl text-yellow-400 font-bold mb-4 flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" /> Trusted Globally
              </h2>
              <p className="text-white/90 text-lg">
                10,742 Cars Delivered • Active in 43 Countries • Avg. Rating: 4.9/5
              </p>
            </div>
          </motion.section>

          {/* Live Map Embed with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
              <h3 className="text-xl text-yellow-300 font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6" /> Where Our Clients Are
              </h3>
              <div className="relative overflow-hidden rounded-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8455589247724!2d36.803848773973975!3d-1.2652404356014013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17cf83d20673%3A0xe0e7e1768510ea56!2sJUSTICE%20ULTIMATE%20AUTOMOBILES!5e0!3m2!1sen!2ske!4v1752242628966!5m2!1sen!2ske"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Enhanced Modal with Glass Morphism */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              transition={{ duration: 0.3 }}
              className="glass-panel border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                <FaUpload /> Share Your Story
              </h3>
              <form className="grid gap-4 sm:grid-cols-2">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Car Model" 
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 sm:col-span-2" 
                  required 
                />
                <input 
                  type="file" 
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 sm:col-span-2" 
                />
                <textarea 
                  placeholder="Your Journey" 
                  rows={4} 
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 sm:col-span-2" 
                  required
                ></textarea>
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-semibold sm:col-span-2">
                  <FaUpload className="inline mr-2" /> Submit Story
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-yellow-300 underline hover:text-yellow-200 mt-6 transition-colors duration-300"
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
