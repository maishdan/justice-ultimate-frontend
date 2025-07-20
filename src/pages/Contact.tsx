import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Phone, MapPin, Clock, Users, Car, FileText } from 'lucide-react';
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    type: 'General Inquiry',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  // Handle file upload and Supabase insert
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let fileUrl = '';
    const fileInput = (e.currentTarget.elements.namedItem('file') as HTMLInputElement);
    const file = fileInput?.files?.[0];
    if (file) {
      const { data, error } = await supabase.storage.from('contact_uploads').upload(`contact/${Date.now()}_${file.name}`, file);
      if (data?.path) fileUrl = data.path;
    }
    // Insert message into Supabase
    const { error: insertError } = await supabase.from('contact_messages').insert([
      { ...form, file_url: fileUrl }
    ]);
    // Send email via Supabase function or backend API
    await fetch('/api/send-contact-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        fileUrl,
        recipients: [
          'justiceultimateautomobiles@gmail.com',
          'daniwesttechnologies@gmail.com',
        ],
      }),
    });
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '', phone: '', type: 'General Inquiry' });
    fileInput.value = '';
  };

  // Genie effect and world-class UI
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
        <div className="max-w-6xl mx-auto space-y-12 px-6">
          {/* Hero Section with Premium Glass Morphism */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl">
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">📞 Contact </span>
                <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Us</span>
              </motion.h2>
              <motion.p 
                className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Get in touch with our global team. We're here to help with all your automotive needs, from sales to support.
              </motion.p>
            </div>
          </motion.section>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.1, rotate: 720, y: 300, clipPath: 'circle(0% at 90% 95%)' }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0, clipPath: 'circle(150% at 50% 50%)' }}
              exit={{ opacity: 0, scale: 0.1, rotate: -720, y: 300, clipPath: 'circle(0% at 90% 95%)' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="grid md:grid-cols-2 gap-12"
            >
              {/* Contact Form with Enhanced Glass Morphism */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6 glass-panel rounded-2xl shadow-xl p-8 border border-white/20 backdrop-blur-xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                autoComplete="off"
              >
                <div className="flex gap-4">
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    className="w-1/2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                    onChange={handleChange}
                    value={form.name}
                  />
                  <input
                    name="email"
                    placeholder="Email Address"
                    required
                    type="email"
                    className="w-1/2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    type="tel"
                    className="w-1/2 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                    onChange={handleChange}
                    value={form.phone}
                  />
                  <select
                    name="type"
                    className="w-1/2 p-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 appearance-none cursor-pointer"
                    onChange={handleChange}
                    value={form.type}
                  >
                    <option>General Inquiry</option>
                    <option>Sales</option>
                    <option>Support</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <input
                  name="subject"
                  placeholder="Subject"
                  required
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  onChange={handleChange}
                  value={form.subject}
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  required
                  rows={4}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 resize-none"
                  onChange={handleChange}
                  value={form.message}
                ></textarea>
                <input
                  name="file"
                  type="file"
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300"
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
                {submitted && (
                  <motion.p
                    className="text-green-300 mt-2 text-base font-medium animate-pulse text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✅ Message sent successfully! Our team will get back to you soon.
                  </motion.p>
                )}
              </motion.form>

              {/* Info Panel with Enhanced Glass Morphism */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" /> Departments
                  </h3>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li className="flex items-center gap-2">📩 Sales: sales@justiceultimate.com</li>
                    <li className="flex items-center gap-2">💁 Customer Support: support@justiceultimate.com</li>
                    <li className="flex items-center gap-2">🔧 Service & Repairs: service@justiceultimate.com</li>
                    <li className="flex items-center gap-2">🔩 Parts Department: parts@justiceultimate.com</li>
                    <li className="flex items-center gap-2">🏢 Corporate: corporate@justiceultimate.com</li>
                  </ul>
                </div>

                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6" /> Office Hours
                  </h3>
                  <p className="text-white/90">⏰ Nairobi (EAT): 8AM – 6PM, Mon–Sat</p>
                  <p className="text-white/90">⏰ London (GMT): 7AM – 5PM, Mon–Fri</p>
                </div>

                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6" /> Global Offices
                  </h3>
                  <p className="text-white/90">📍 Headquarters: Mpesi Lane 11, Westlands, Nairobi, Kenya</p>
                  <p className="text-white/90">🌐 Branches: USA · UK · Germany · South Africa · UAE</p>
                  <a
                    href="https://maps.app.goo.gl/8zb3pfQhgKdX2hJf8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 underline"
                  >
                    Get Directions
                  </a>
                </div>

                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Phone className="w-6 h-6" /> Emergency Contacts
                  </h3>
                  <p className="text-white/90">📞 0722827458</p>
                  <p className="text-white/90">📞 0751555544</p>
                  <p className="text-white/90">🚨 Roadside Assistance: +254 722 827458</p>
                  <p className="text-white/90">📋 Insurance Claims: claims@justiceultimate.com</p>
                </div>

                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Connect With Us</h3>
                  <div className="text-2xl flex gap-4">
                    <a
                      href="https://wa.me/254790293895"
                      target="_blank"
                      className="text-green-400 hover:scale-110 hover:drop-shadow-[0_0_10px_#22c55e] transition-all duration-300"
                    >
                      <FaWhatsapp />
                    </a>
                    <a
                      href="https://facebook.com/justiceultimate"
                      target="_blank"
                      className="text-blue-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#3b82f6] transition-all duration-300"
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href="https://twitter.com/justiceultimate"
                      target="_blank"
                      className="text-sky-400 hover:scale-110 hover:drop-shadow-[0_0_10px_#0ea5e9] transition-all duration-300"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="https://linkedin.com/company/justiceultimate"
                      target="_blank"
                      className="text-blue-700 hover:scale-110 hover:drop-shadow-[0_0_10px_#1d4ed8] transition-all duration-300"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href="https://youtube.com/@justiceultimate"
                      target="_blank"
                      className="text-red-600 hover:scale-110 hover:drop-shadow-[0_0_10px_#dc2626] transition-all duration-300"
                    >
                      <FaYoutube />
                    </a>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <div className="relative overflow-hidden rounded-xl">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8455589247724!2d36.803848773973975!3d-1.2652404356014013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17cf83d20673%3A0xe0e7e1768510ea56!2sJUSTICE%20ULTIMATE%20AUTOMOBILES!5e0!3m2!1sen!2ske!4v1752239190599!5m2!1sen!2ske"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    ></iframe>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Quick Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/vehicle-catalogue"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Car className="w-4 h-4" /> View Cars
                    </Link>

                    <Link
                      to="/book-test-drive"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> Test Drive
                    </Link>

                    <Link
                      to="/apply-financing"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      💳 Financing
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
