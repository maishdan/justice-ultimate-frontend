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

export default function GuestDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors flex flex-col">
      <GuestNavbar />
      <main className="flex-1 overflow-y-auto p-0 md:p-6 space-y-8">
        <PromoBanner />
        <FeaturedCarGallery />
        <TestimonialCarousel />
        <GuestCalculator />
        <GuestContactBar />
        <section className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 my-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-blue-800 dark:text-green-300">Welcome to Justice Ultimate Automobiles</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">Explore our premium vehicles, read real customer reviews, and discover why thousands trust us. Ready to drive your dream? Register for full access!</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <a href="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md">Unlock Full Access 🚀</a>
            <a href="/contact" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-lg font-semibold shadow-md">Contact Us</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
