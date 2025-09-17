import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Videos() {
  const templates = [
    { title: 'Showroom Highlights', src: '/videos/drive 3.mp4' },
    { title: 'Customer Testimonials', src: '/videos/drive .mp4' },
    { title: 'Behind the Scenes', src: '/videos/drive 1.mp4' },
  ];
  return (
    <div className="min-h-screen w-full pt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none z-10"></div>
      <div className="relative z-10 min-h-screen w-full flex flex-col py-10 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white"
          >
            Videos
          </motion.h1>
          <motion.p className="text-white/80 mt-3">Autoplay templates. Replace with real videos later.</motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {templates.map((v, i) => (
              <motion.div
                key={i}
                className="glass-panel rounded-2xl p-3 shadow-2xl border border-white/20 backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative overflow-hidden rounded-xl group">
                  <video
                    src={v.src}
                    className="w-full h-48 object-cover"
                    controls
                    preload="metadata"
                    onMouseEnter={(e) => { try { (e.currentTarget as HTMLVideoElement).play(); } catch {} }}
                    onClick={(e) => { const vid = e.currentTarget as HTMLVideoElement; if (vid.paused) vid.play(); else vid.pause(); }}
                  />
                </div>
                <div className="mt-3 text-white/90 font-semibold">{v.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}


