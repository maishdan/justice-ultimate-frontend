import { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaRegThumbsUp,
  FaHeart,
  FaCarSide,
  FaFire,
  FaVolumeUp,
  FaShareAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import Footer from "../components/Footer";

const articles = [
  {
    id: 1,
    title: "Justice Ultimate Launches New 2025 Electric SUV",
    image: "/images/MERCEDES S CLASS/1.jpg",
    author: "Daniel M. Wangui",
    date: "June 15, 2025",
    tags: ["Electric", "SUV", "Launch"],
    category: "Electric Cars",
    region: "Kenya",
    brand: "Toyota",
    summary: "Our latest electric SUV is here, blending power with eco-friendly technology...",
    video: "https://www.youtube.com/embed/-4zsY28t76k",

  },
];

export default function News() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || article.category === filter)
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
        <div className="max-w-6xl mx-auto space-y-10 px-6">
          {/* Hero Section with Premium Glass Morphism */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">📰 Latest </span>
                <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">News</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Stay updated with the latest automotive trends, launches, and industry insights from Justice Ultimate Automobiles.
              </motion.p>
            </div>
          </motion.section>

          {/* Search and Filter Section with Enhanced Glass Morphism */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  />
                </div>
                <div className="relative w-full md:w-1/4">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option>All</option>
                    <option>Electric Cars</option>
                    <option>Promotions</option>
                    <option>Company News</option>
                    <option>Tips</option>
                    <option>Technology</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Articles List with Enhanced Glass Cards */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid gap-8 md:grid-cols-2">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -3,
                    transition: { duration: 0.3 }
                  }}
                  className="glass-panel rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl overflow-hidden group relative"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 space-y-3 relative z-10">
                    <h2 className="text-2xl font-bold hover:text-yellow-400 transition-colors duration-300">
                      {article.title}
                    </h2>
                    <p className="text-sm text-white/80">
                      ✍️ {article.author} · 📅 {article.date} · 📍 {article.region} · 🚘 {article.brand}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded text-sm border border-yellow-400/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/90">{article.summary}</p>
                    <div className="flex gap-4 pt-2 text-lg">
                      <button title="Like" className="hover:text-yellow-400 transition-colors duration-300"><FaRegThumbsUp /></button>
                      <button title="Love" className="hover:text-red-400 transition-colors duration-300"><FaHeart /></button>
                      <button title="Car Fan" className="hover:text-blue-400 transition-colors duration-300"><FaCarSide /></button>
                      <button title="🔥" className="hover:text-orange-400 transition-colors duration-300"><FaFire /></button>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 text-xl">
                      <a href="#" className="hover:text-blue-400 transition-colors duration-300"><FaFacebook /></a>
                      <a href="#" className="hover:text-sky-400 transition-colors duration-300"><FaTwitter /></a>
                      <a href="#" className="hover:text-blue-700 transition-colors duration-300"><FaLinkedin /></a>
                      <a href="#" className="hover:text-green-400 transition-colors duration-300"><FaWhatsapp /></a>
                      <a href="#" className="hover:text-yellow-400 transition-colors duration-300"><FaShareAlt /></a>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button className="hover:text-yellow-400 flex items-center gap-2 transition-colors duration-300">
                        <FaVolumeUp /> Listen
                      </button>
                      <button className="hover:text-green-400 flex items-center gap-2 transition-colors duration-300">
                        ⚡ Quick Summary (AI)
                      </button>
                    </div>

                    {article.video && (
                      <div className="mt-4">
                        <iframe
                          width="100%"
                          height="250"
                          src={article.video}
                          title="Video"
                          allowFullScreen
                          className="rounded shadow"
                        ></iframe>
                      </div>
                    )}

                    {/* Author Bio */}
                    <div className="mt-4 text-sm text-white/80 italic">
                      Written by <span className="text-yellow-300">{article.author}</span>, car enthusiast and Justice Ultimate editor.
                    </div>

                    {/* Car of the Month */}
                    <div className="mt-6 p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/30 shadow-md">
                      <h3 className="text-yellow-300 font-bold text-lg mb-2">🏆 Car of the Month</h3>
                      <p className="text-white/90">2025 Toyota Hybrid X - Top seller with unmatched fuel efficiency and luxury.</p>
                      <button className="mt-2 text-sm underline hover:text-yellow-300 transition-colors duration-300">Book a Test Drive →</button>
                    </div>

                    {/* Inquiry Tracker CTA */}
                    <div className="mt-6 p-4 bg-white/5 border border-yellow-400/30 rounded-xl">
                      <h4 className="text-yellow-400 font-bold text-md">🧾 Track Your Inquiry</h4>
                      <p className="text-white/80 text-sm">Already contacted us? Track your inquiry or case ID in the <a href="/inquiry-tracker" className="underline hover:text-yellow-300 transition-colors duration-300">Inquiry Tracker</a>.</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Newsletter Subscription with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl text-center">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">📧 Subscribe to our Newsletter</h3>
              <p className="text-white/90 mb-6">Stay updated with the latest car trends, deals & tips!</p>
              <form className="flex flex-col md:flex-row justify-center gap-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 w-full md:w-1/3"
                  required
                />
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </motion.section>

          {/* Archives & Translate with Enhanced Glass Morphism */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6 mt-10"
          >
            <div className="glass-panel p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl md:w-1/2">
              <h4 className="font-bold text-yellow-400 mb-4">📅 Archives</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:underline hover:text-yellow-300 transition-colors duration-300">June 2025</a></li>
                <li><a href="#" className="hover:underline hover:text-yellow-300 transition-colors duration-300">May 2025</a></li>
                <li><a href="#" className="hover:underline hover:text-yellow-300 transition-colors duration-300">April 2025</a></li>
              </ul>
            </div>
            <div className="glass-panel p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl md:w-1/2 text-center">
              <h4 className="font-bold text-yellow-400 mb-4">🌐 Translate</h4>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-semibold text-sm">
                🌍 Instant Translate
              </button>
            </div>
          </motion.section>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
