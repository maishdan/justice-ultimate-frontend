// src/pages/Videos.tsx
import { useState } from 'react';
import { motion } from "framer-motion";
import { Play, Calendar, Eye, ThumbsUp } from "lucide-react";
import Footer from "../components/Footer";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: string;
  category: string;
}

const videosData: Video[] = [
  {
    id: "1",
    title: "2024 Mercedes-Benz C-Class Review",
    description: "In-depth review of the latest Mercedes-Benz C-Class featuring luxury interior, performance specs, and driving experience.",
    thumbnail: "/images/mercedes-c-class.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "12:45",
    views: 15420,
    likes: 892,
    publishedAt: "2024-01-15",
    category: "Reviews"
  },
  {
    id: "2",
    title: "BMW X5 vs Audi Q7 Comparison",
    description: "Head-to-head comparison between two luxury SUVs, comparing performance, features, and value for money.",
    thumbnail: "/images/bmw-x5.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18:30",
    views: 23100,
    likes: 1250,
    publishedAt: "2024-01-10",
    category: "Comparisons"
  },
  {
    id: "3",
    title: "How to Choose Your First Car",
    description: "Complete guide for first-time car buyers covering budget, financing, insurance, and what to look for.",
    thumbnail: "/images/first-car-guide.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "15:20",
    views: 8750,
    likes: 445,
    publishedAt: "2024-01-05",
    category: "Guides"
  },
  {
    id: "4",
    title: "Toyota Prado 2024 Off-Road Test",
    description: "Testing the new Toyota Prado's off-road capabilities in challenging terrain and extreme conditions.",
    thumbnail: "/images/toyota-prado.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "20:15",
    views: 31200,
    likes: 1890,
    publishedAt: "2023-12-28",
    category: "Test Drives"
  },
  {
    id: "5",
    title: "Electric vs Hybrid vs Gasoline",
    description: "Comprehensive comparison of different engine types to help you choose the best option for your needs.",
    thumbnail: "/images/engine-comparison.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "22:10",
    views: 42300,
    likes: 2150,
    publishedAt: "2023-12-20",
    category: "Educational"
  },
  {
    id: "6",
    title: "Car Maintenance Tips for Beginners",
    description: "Essential car maintenance tips every car owner should know to keep their vehicle running smoothly.",
    thumbnail: "/images/car-maintenance.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "16:45",
    views: 19800,
    likes: 1020,
    publishedAt: "2023-12-15",
    category: "Maintenance"
  }
];

const categories = ["All", "Reviews", "Comparisons", "Guides", "Test Drives", "Educational", "Maintenance"];

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = selectedCategory === "All" 
    ? videosData 
    : videosData.filter(video => video.category === selectedCategory);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen w-full flex flex-col py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.section
            className="text-center mb-12 relative"
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
                <span className="text-white">Car </span>
                <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Videos</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                🎥 Watch our comprehensive car reviews, comparisons, and educational content to make informed automotive decisions.
              </motion.p>
            </div>
          </motion.section>

          {/* Category Filter */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Videos Grid */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-white/20 backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-car.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-semibold">
                      {video.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-white/60 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatNumber(video.views)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{formatNumber(video.likes)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Video Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative">
                <button 
                  className="absolute top-4 right-4 z-10 text-2xl text-gray-500 hover:text-yellow-500 bg-white/80 rounded-full p-2" 
                  onClick={() => setSelectedVideo(null)}
                >
                  &times;
                </button>
                <div className="aspect-video rounded-t-2xl overflow-hidden">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedVideo.title}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(selectedVideo.views)} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{formatNumber(selectedVideo.likes)} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(selectedVideo.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedVideo.category}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <motion.section
            className="py-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-10 shadow-2xl border border-white/20 backdrop-blur-xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">
                Want to See More Content?
              </h3>
              <p className="text-lg mb-8 max-w-xl mx-auto text-white/90 leading-relaxed">
                Subscribe to our channel for the latest car reviews, comparisons, and automotive insights.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl">
                  Subscribe on YouTube
                </button>
                <button className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl">
                  Follow on Social Media
                </button>
              </div>
            </div>
          </motion.section>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}