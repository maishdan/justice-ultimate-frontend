import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { CarCard } from '../components/CarCard';
import Footer from '../components/Footer';
import { Car } from 'lucide-react';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRentals() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.from('rentals').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setRentals(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRentals();
    const channel = supabase.channel('realtime-rentals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, fetchRentals)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen w-full pt-0" style={{
      backgroundImage: "url('/images/bg-landing.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none z-10"></div>
      <div className="relative z-10 min-h-screen w-full flex flex-col py-8">
        <div className="container mx-auto px-4">
          <motion.section
            className="text-center mb-12"
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
                <span className="text-blue-400">Rental </span>
                <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">Cars</span>
              </motion.h1>
              <motion.p
                className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                🚙 Browse our premium rental fleet. All cars are available for instant booking and real-time updates.
              </motion.p>
            </div>
          </motion.section>
          {loading ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-panel rounded-2xl p-8 shadow-xl border border-blue-400/20 backdrop-blur-xl inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white/90 text-lg">Loading rentals...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-panel rounded-2xl p-8 shadow-xl border border-red-400/20 backdrop-blur-xl inline-block">
                <p className="text-red-400 text-lg">Error: {error}</p>
              </div>
            </motion.div>
          ) : rentals.length === 0 ? (
            <div className="text-center py-12">
              <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl inline-block">
                <Car className="w-16 h-16 text-white/60 mx-auto mb-4" />
                <p className="text-white/90 text-lg">No rentals found.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentals.map((rental: any, index: number) => (
                <CarCard
                  key={rental.id}
                  car={rental}
                  onSelect={() => {}}
                />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
} 