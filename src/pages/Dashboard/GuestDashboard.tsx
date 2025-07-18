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

export default function GuestDashboard() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors flex flex-col">
      <GuestNavbar />
      <main className="flex-1 overflow-y-auto p-2 md:p-6 space-y-8 w-full min-w-0">
        <PromoBanner />
        <FeaturedCarGallery />
        <TestimonialCarousel />
        <GuestCalculator />
        <GuestContactBar />
        <section className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-4 md:p-8 my-8 text-center w-full">
          <h2 className="text-3xl font-extrabold mb-2 text-blue-800 dark:text-green-300">{t('welcome')}</h2>
          <p className="mb-4 text-lg text-gray-700 dark:text-gray-200">Experience the future of automotive excellence. Discover our premium vehicles, read real customer stories, and see why thousands trust us. Ready to drive your dream? {t('unlock')} or {t('contactUs').toLowerCase()} today!</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <a href="/register" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-md transition">{t('unlock')} 🚀</a>
            <a href="/contact" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-8 py-4 rounded-lg font-bold text-lg shadow-md transition">{t('contactUs')}</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
