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

const articles = [
  {
    id: 1,
    title: "Justice Ultimate Launches New 2025 Electric SUV",
    image: "/assets/news/ev-launch.jpg",
    author: "Daniel M. Wangui",
    date: "June 15, 2025",
    tags: ["Electric", "SUV", "Launch"],
    category: "Electric Cars",
    region: "Kenya",
    brand: "Toyota",
    summary: "Our latest electric SUV is here, blending power with eco-friendly technology...",
    video: "https://www.youtube.com/embed/oHg5SJYRHA0",
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
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-950 to-black text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl font-bold border-b border-white pb-2">📰 Latest News</h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded bg-blue-100 text-black w-full md:w-64"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded bg-blue-100 text-black"
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

        {/* Articles List */}
        <div className="grid gap-8 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-xl overflow-hidden border border-yellow-400 hover:shadow-yellow-300 shadow transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 space-y-3">
                <h2 className="text-2xl font-bold hover:text-yellow-400 transition">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-300">
                  ✍️ {article.author} · 📅 {article.date} · 📍 {article.region} · 🚘 {article.brand}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-yellow-400 text-black px-2 py-1 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-200">{article.summary}</p>
                <div className="flex gap-4 pt-2 text-lg">
                  <button title="Like"><FaRegThumbsUp /></button>
                  <button title="Love"><FaHeart /></button>
                  <button title="Car Fan"><FaCarSide /></button>
                  <button title="🔥"><FaFire /></button>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 text-xl">
                  <a href="#" className="hover:text-blue-400"><FaFacebook /></a>
                  <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
                  <a href="#" className="hover:text-blue-700"><FaLinkedin /></a>
                  <a href="#" className="hover:text-green-400"><FaWhatsapp /></a>
                  <a href="#" className="hover:text-yellow-400"><FaShareAlt /></a>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="hover:text-yellow-400 flex items-center gap-2">
                    <FaVolumeUp /> Listen
                  </button>
                  <button className="hover:text-green-400 flex items-center gap-2">
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
                <div className="mt-4 text-sm text-gray-300 italic">
                  Written by <span className="text-yellow-300">{article.author}</span>, car enthusiast and Justice Ultimate editor.
                </div>

                {/* Car of the Month */}
                <div className="mt-6 p-4 bg-blue-800 rounded-lg border border-yellow-500 shadow-md">
                  <h3 className="text-yellow-300 font-bold text-lg mb-2">🏆 Car of the Month</h3>
                  <p className="text-gray-200">2025 Toyota Hybrid X - Top seller with unmatched fuel efficiency and luxury.</p>
                  <button className="mt-2 text-sm underline hover:text-yellow-300 transition">Book a Test Drive →</button>
                </div>

                {/* Inquiry Tracker CTA */}
                <div className="mt-6 p-4 bg-black/20 border border-yellow-400 rounded-lg">
                  <h4 className="text-yellow-400 font-bold text-md">🧾 Track Your Inquiry</h4>
                  <p className="text-gray-300 text-sm">Already contacted us? Track your inquiry or case ID in the <a href="/inquiry-tracker" className="underline hover:text-yellow-300">Inquiry Tracker</a>.</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-blue-900 border border-yellow-400 rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-yellow-300">📧 Subscribe to our Newsletter</h3>
          <p className="text-gray-200">Stay updated with the latest car trends, deals & tips!</p>
          <form className="mt-4 flex flex-col md:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-2 rounded bg-blue-100 text-black w-full md:w-1/3"
              required
            />
            <button className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* Archives & Translate */}
        <div className="flex flex-col md:flex-row gap-6 mt-10">
          <div className="bg-blue-900 p-4 rounded-xl border border-yellow-500 md:w-1/2">
            <h4 className="font-bold text-yellow-300 mb-2">📅 Archives</h4>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="hover:underline hover:text-yellow-300">June 2025</a></li>
              <li><a href="#" className="hover:underline hover:text-yellow-300">May 2025</a></li>
              <li><a href="#" className="hover:underline hover:text-yellow-300">April 2025</a></li>
            </ul>
          </div>
          <div className="bg-blue-900 p-4 rounded-xl border border-yellow-500 md:w-1/2 text-center">
            <h4 className="font-bold text-yellow-300 mb-2">🌐 Translate</h4>
            <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition text-sm">🌍 Instant Translate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
