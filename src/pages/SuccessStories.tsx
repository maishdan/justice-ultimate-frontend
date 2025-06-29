// src/pages/SuccessStories.tsx
import { useState } from "react";
import { FaMapMarkerAlt, FaStar, FaGlobeAfrica, FaCar, FaUserCheck, FaPlus, FaPlay, FaUpload } from "react-icons/fa";

const stories = [
  {
    id: 1,
    name: "Jane Wambui",
    location: "Nairobi, Kenya",
    car: "Toyota Prado 2023",
    image: "/assets/stories/jane.jpg",
    rating: 5,
    useCase: "Family",
    video: "https://www.youtube.com/embed/oHg5SJYRHA0",
    before: "/assets/stories/before1.jpg",
    after: "/assets/stories/after1.jpg",
    story: {
      problem: "Needed a reliable SUV for rural Kenya roads.",
      journey: "Found us on Facebook, visited the Nyeri branch, and test drove a Prado.",
      outcome: "We delivered in 2 days with insurance and logbook.",
      result: "Zero issues for 7 months, drives weekly 300km.",
    },
  },
  // Add more stories...
];

export default function SuccessStories() {
  const [filter, setFilter] = useState("All");

  const filtered = stories.filter(
    (s) => filter === "All" || s.useCase === filter || s.car.includes(filter)
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-950 to-black text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-yellow-400 border-b border-yellow-400 pb-2">
          🏆 Success Stories
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
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
        </div>

        {/* Carousel (simplified with scroll) */}
        <div className="flex overflow-x-auto gap-6 pb-4">
          {filtered.map((story) => (
            <div
              key={story.id}
              className="min-w-[300px] bg-blue-900 border border-yellow-400 rounded-xl p-4 shadow hover:shadow-yellow-400 transition-all duration-300 hover:scale-105"
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

        {/* Story Details */}
        {filtered.map((story) => (
          <div key={story.id} className="bg-blue-900 border border-yellow-400 rounded-xl p-6 shadow-lg space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
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

            {/* Video Testimonial */}
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

        {/* Submit Your Story Form */}
        <div className="bg-blue-800 border border-yellow-400 p-6 rounded-xl shadow-lg mt-10">
          <h3 className="text-2xl font-bold text-yellow-300 mb-4">✍️ Share Your Success Story</h3>
          <form className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Full Name" className="p-2 rounded bg-blue-100 text-black" required />
            <input type="text" placeholder="Location (City, Country)" className="p-2 rounded bg-blue-100 text-black" required />
            <input type="text" placeholder="Car Model Purchased" className="p-2 rounded bg-blue-100 text-black" required />
            <input type="file" className="p-2 rounded bg-blue-100 text-black" />
            <textarea placeholder="Your Story" rows={4} className="p-2 rounded bg-blue-100 text-black col-span-2" required></textarea>
            <button className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 transition col-span-2">
              <FaUpload className="inline mr-2" /> Submit Story
            </button>
          </form>
        </div>

        {/* Gamified Trust Section */}
        <div className="text-center pt-10">
          <h2 className="text-2xl text-yellow-400 font-bold">🧩 Trusted Globally</h2>
          <p className="text-gray-300">10,742 Cars Delivered • Active in 43 Countries • Avg. Rating: 4.9/5</p>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="mt-10 text-center text-yellow-300">
          <FaGlobeAfrica className="inline text-3xl mb-2" />
          <h3 className="text-xl font-semibold">🌍 Global Stories Map</h3>
          <p className="text-gray-400">Map showing where our happy customers are located — coming soon!</p>
        </div>
      </div>
    </div>
  );
}
