import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Video, Play, Upload, Globe, Plus, X } from "lucide-react";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    type: 'local', // 'local', 'youtube', 'tiktok'
    src: '',
    description: ''
  });

  // Local video templates from the videos folder
  const localTemplates = [
    { id: 1, title: 'Showroom Highlights', src: '/videos/drive 3.mp4', type: 'local', description: 'Tour our premium showroom facilities' },
    { id: 2, title: 'Customer Testimonials', src: '/videos/drive .mp4', type: 'local', description: 'Hear from our satisfied customers' },
    { id: 3, title: 'Behind the Scenes', src: '/videos/drive 1.mp4', type: 'local', description: 'See how we prepare your vehicles' },
  ];

  // Sample embedded videos (can be managed from admin)
  const embeddedVideos = [
    {
      id: 4,
      title: 'Car Review: Latest Models',
      type: 'youtube',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Professional review of our latest car models'
    },
    {
      id: 5,
      title: 'Quick Car Tips',
      type: 'tiktok',
      src: 'https://www.tiktok.com/embed/v2/7234567890123456789',
      description: 'Quick tips for car maintenance'
    }
  ];

  useEffect(() => {
    // Load videos from localStorage or default templates
    const savedVideos = localStorage.getItem('justice_videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    } else {
      const allVideos = [...localTemplates, ...embeddedVideos];
      setVideos(allVideos);
      localStorage.setItem('justice_videos', JSON.stringify(allVideos));
    }
  }, []);

  const addVideo = () => {
    if (!newVideoForm.title || !newVideoForm.src) return;
    
    const newVideo = {
      id: Date.now(),
      ...newVideoForm
    };
    
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    localStorage.setItem('justice_videos', JSON.stringify(updatedVideos));
    
    setNewVideoForm({ title: '', type: 'local', src: '', description: '' });
    setShowAddModal(false);
  };

  const removeVideo = (id) => {
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem('justice_videos', JSON.stringify(updatedVideos));
  };

  const getVideoEmbed = (video) => {
    switch (video.type) {
      case 'youtube':
        return (
          <iframe
            src={video.src}
            className="w-full h-48 rounded-xl"
            frameBorder="0"
            allowFullScreen
            title={video.title}
          />
        );
      case 'tiktok':
        return (
          <iframe
            src={video.src}
            className="w-full h-48 rounded-xl"
            frameBorder="0"
            allowFullScreen
            title={video.title}
          />
        );
      default:
        return (
          <video
            src={video.src}
            className="w-full h-48 object-cover rounded-xl"
            controls
            preload="metadata"
            onMouseEnter={(e) => { try { e.currentTarget.play(); } catch {} }}
            onClick={(e) => { 
              const vid = e.currentTarget;
              if (vid.paused) vid.play(); 
              else vid.pause(); 
            }}
          />
        );
    }
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
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none z-10"></div>
      <div className="relative z-10 min-h-screen w-full flex flex-col py-10 px-4">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
                  <Video className="text-yellow-400" size={40} />
                  Videos
                </h1>
                <p className="text-white/80 mt-3">
                  🎥 Explore our video collection - local content and embedded videos from YouTube & TikTok
                </p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Video
              </Button>
            </div>
          </motion.div>

          {/* Videos Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                className="glass-panel rounded-2xl p-4 shadow-2xl border border-white/20 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Video Type Badge */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {video.type === 'youtube' && <Globe size={16} className="text-red-500" />}
                    {video.type === 'tiktok' && <Globe size={16} className="text-pink-500" />}
                    {video.type === 'local' && <Upload size={16} className="text-green-500" />}
                    <span className="text-xs text-white/60 uppercase font-medium">
                      {video.type}
                    </span>
                  </div>
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Video Player/Embed */}
                <div className="relative overflow-hidden rounded-xl mb-3">
                  {getVideoEmbed(video)}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="text-white" size={32} />
                  </div>
                </div>

                {/* Video Info */}
                <div className="text-white">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  {video.description && (
                    <p className="text-white/70 text-sm">{video.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-2xl p-12 text-center"
            >
              <Video size={64} className="text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Videos Yet</h3>
              <p className="text-white/70 mb-6">Add your first video to get started</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Video
              </Button>
            </motion.div>
          )}
        </div>

        {/* Add Video Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-2xl p-6 w-full max-w-md border border-white/20 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add New Video</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newVideoForm.title}
                    onChange={(e) => setNewVideoForm({...newVideoForm, title: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Type</label>
                  <select
                    value={newVideoForm.type}
                    onChange={(e) => setNewVideoForm({...newVideoForm, type: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="local">Local Video</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    {newVideoForm.type === 'local' ? 'Video Path' : 'Embed URL'}
                  </label>
                  <input
                    type="text"
                    value={newVideoForm.src}
                    onChange={(e) => setNewVideoForm({...newVideoForm, src: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      newVideoForm.type === 'local' 
                        ? '/videos/filename.mp4' 
                        : newVideoForm.type === 'youtube'
                        ? 'https://www.youtube.com/embed/VIDEO_ID'
                        : 'https://www.tiktok.com/embed/v2/VIDEO_ID'
                    }
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Description (Optional)</label>
                  <textarea
                    value={newVideoForm.description}
                    onChange={(e) => setNewVideoForm({...newVideoForm, description: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the video"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={addVideo}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white"
                  >
                    Add Video
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(false)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}


