import GuestNavbar from '../../components/guest/GuestNavbar';
import PromoBanner from '../../components/guest/PromoBanner';
import FeaturedCarGallery from '../../components/guest/FeaturedCarGallery';
import TestimonialCarousel from '../../components/guest/TestimonialCarousel';
import GuestCalculator from '../../components/guest/GuestCalculator';
import GuestContactBar from '../../components/guest/GuestContactBar';
import Footer from '../../components/Footer';
import { useEffect, useState } from "react";
import { supabase } from '../../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useLanguage } from '../../context/LanguageContext';
import { Car, Star, Users, Award, TrendingUp, Shield } from 'lucide-react';

export default function GuestDashboard() {
  const { t } = useLanguage();
  
  return (
    <div 
      className="min-h-screen w-full flex flex-col pt-0"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Enhanced Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/40 pointer-events-none z-10"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-300/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-orange-400/20 rounded-full animate-ping"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-2 md:p-6 space-y-8 w-full min-w-0">
        <div className="text-center text-2xl font-bold text-yellow-400 mt-10">
          Welcome to the Guest Dashboard! Explore our features and offers below.
        </div>
        {/* Promo Banner with Enhanced Glass Morphism */}
        <div>
          <PromoBanner />
        </div>

        {/* Featured Cars with Enhanced Glass Morphism */}
        <div>
          <FeaturedCarGallery />
        </div>

        {/* Testimonials with Enhanced Glass Morphism */}
        <div>
          <TestimonialCarousel />
        </div>

        {/* Calculator with Enhanced Glass Morphism */}
        <div>
          <GuestCalculator />
        </div>

        {/* Contact Bar with Enhanced Glass Morphism */}
        <div>
          <GuestContactBar />
        </div>

        {/* Enhanced Welcome Section with Glass Morphism */}
        <div 
          className="max-w-6xl mx-auto glass-panel rounded-2xl shadow-2xl p-6 md:p-10 my-8 text-center w-full border border-white/20 backdrop-blur-xl"
        >
          {/* Header with Icons */}
          <div
            className="mb-6"
          >
            <h2 className="text-4xl font-extrabold mb-4 text-yellow-400 flex items-center justify-center gap-3">
              <Car className="w-10 h-10" />
              {t('welcome')}
              <Star className="w-8 h-8 text-yellow-300" />
            </h2>
            <p className="text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              Experience the future of automotive excellence. Discover our premium vehicles, read real customer stories, and see why thousands trust us. Ready to drive your dream? {t('unlock')} or {t('contactUs').toLowerCase()} today!
            </p>
          </div>

          {/* Stats Section */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass-panel rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">10K+</span>
              </div>
              <p className="text-white/70 text-sm">Happy Customers</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Car className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">500+</span>
              </div>
              <p className="text-white/70 text-sm">Premium Vehicles</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">15+</span>
              </div>
              <p className="text-white/70 text-sm">Years Experience</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">99%</span>
              </div>
              <p className="text-white/70 text-sm">Satisfaction Rate</p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div 
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <a 
              href="/register" 
              className="glass-panel bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg shadow-xl border border-yellow-300/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {t('unlock')} 🚀
            </a>
            <a 
              href="/contact" 
              className="glass-panel bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl border border-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              {t('contactUs')}
            </a>
          </div>

          {/* Trust Indicators */}
          <div
            className="mt-8 pt-6 border-t border-white/10"
          >
            <p className="text-white/60 text-sm">
              🔒 Secure & Trusted • 🌍 International Service • ⭐ Premium Quality
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
