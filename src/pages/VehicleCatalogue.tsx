// src/pages/VehicleCatalogue.tsx
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { Search, Filter } from 'lucide-react';
import Footer from "../components/Footer";
import { RealtimeChannel } from '@supabase/supabase-js';
import { CarCard } from '../components/CarCard';
// removed unused type import and page import
import { carsData } from '../data/carData';

export default function VehicleCatalogue() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [showTradeIn, setShowTradeIn] = useState(false);
  const [tradeInForm, setTradeInForm] = useState({
    user_name: '', user_email: '', user_phone: '', car_make: '', car_model: '', car_year: '', car_mileage: '', car_condition: '', notes: '', car_images: [] as File[]
  });
  const [tradeInLoading, setTradeInLoading] = useState(false);
  const [tradeInSuccess, setTradeInSuccess] = useState('');
  const [tradeInError, setTradeInError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showRentals] = useState(false);
  const [rentals, setRentals] = useState<any[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [rentalsError, setRentalsError] = useState('');
  
  // Car Management State
  const [showCarEditor, setShowCarEditor] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [carForm, setCarForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    fuel_type: '',
    transmission: '',
    drive_type: '',
    colors: [''],
    description: '',
    main_image: '',
    additional_images: [''],
    location: 'Nairobi, Kenya',
    status: 'published'
  });

  async function fetchRentals() {
    setRentalsLoading(true);
    setRentalsError('');
    const { data, error } = await supabase.from('rentals').select('*').order('created_at', { ascending: false });
    if (error) setRentalsError(error.message);
    else setRentals(data || []);
    setRentalsLoading(false);
  }

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      setError("");
      try {
        // Fetch cars from database
        const { data: dbCars, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
        if (error) setError(error.message);
        
        // Convert database cars to match CarCard format
        const formattedDbCars = (dbCars || []).map(dbCar => ({
          id: dbCar.id,
          slug: dbCar.name?.toLowerCase().replace(/\s+/g, '-') || dbCar.id,
          name: dbCar.name,
          tagline: dbCar.description || `${dbCar.brand} ${dbCar.model}`,
          stockId: dbCar.id,
          tags: dbCar.tags || [dbCar.brand, dbCar.fuel_type].filter(Boolean),
          price: dbCar.price,
          currency: "KES",
          specs: {
            fuel: dbCar.fuel_type,
            transmission: dbCar.transmission,
            drivetrain: dbCar.drive_type,
            color: dbCar.colors?.[0] || 'White',
            mileage: 0,
            year: parseInt(dbCar.year) || 2023,
          },
          location: dbCar.location || 'Nairobi, Kenya',
          image: dbCar.main_image ? [dbCar.main_image] : ['/images/default-car.jpg'],
          description: dbCar.description || `${dbCar.brand} ${dbCar.model} ${dbCar.year}`,
          featured: dbCar.status === 'published',
          availability: dbCar.is_sold ? 'Sold' : 'Available',
          ratings: dbCar.reputation_score || 4.5,
          // Add database source flag
          source: 'database'
        }));

        // Combine database cars with static cars from AllCarsShowcase
        const allCars = [...formattedDbCars, ...carsData];
        setCars(allCars);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to fetch cars');
      }
      setLoading(false);
    }
    fetchCars();

    // Set up real-time subscription
    const ch = supabase.channel('realtime-cars')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cars' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCars(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCars(prev => prev.map(car => car.id === payload.new.id ? payload.new : car));
          } else if (payload.eventType === 'DELETE') {
            setCars(prev => prev.filter(car => car.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    setChannel(ch);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      supabase.removeChannel(ch);
    };
  }, []);

  useEffect(() => {
    if (showRentals) fetchRentals();
  }, [showRentals]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Add null checks to prevent toLowerCase errors
      const carName = car.name || car.title || '';
      const carBrand = car.brand || car.make || '';
      const carModel = car.model || '';
      
      const matchesSearch =
        carName.toLowerCase().includes(search.toLowerCase()) ||
        carBrand.toLowerCase().includes(search.toLowerCase()) ||
        carModel.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? (car.category || '') === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [cars, search, category]);

  const carsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / carsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const sortedCars = useMemo(() => {
    const list = [...filteredCars];
    if (sortBy === 'newest') {
      list.sort((a: any, b: any) => (b.specs?.year || b.year || 0) - (a.specs?.year || a.year || 0));
    } else if (sortBy === 'price_low') {
      list.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_high') {
      list.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
    }
    return list;
  }, [filteredCars, sortBy]);

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * carsPerPage;
    return sortedCars.slice(start, start + carsPerPage);
  }, [sortedCars, currentPage]);

  useEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('page', String(currentPage));
      return params;
    }, { replace: true });
  }, [currentPage, setSearchParams]);

  const categories = useMemo(() => 
    Array.from(new Set(cars.map(car => car.category || ''))).filter(Boolean), [cars]
  );

  async function handleTradeInSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTradeInLoading(true);
    setTradeInSuccess('');
    setTradeInError('');
    try {
      // Upload images to Supabase Storage
      let imageUrls: string[] = [];
      for (const file of tradeInForm.car_images) {
        const ext = file.name.split('.').pop();
        const fileName = `trade_in_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('cars').upload(fileName, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('cars').getPublicUrl(fileName);
        imageUrls.push(publicUrlData.publicUrl);
      }
      // Insert trade-in record
      const { error } = await supabase.from('trade_ins').insert([{ ...tradeInForm, car_images: imageUrls }]);
      setTradeInLoading(false);
      if (error) setTradeInError(error.message);
      else {
        setTradeInSuccess('Trade-in request submitted! Our team will contact you soon.');
        setTradeInForm({ user_name: '', user_email: '', user_phone: '', car_make: '', car_model: '', car_year: '', car_mileage: '', car_condition: '', notes: '', car_images: [] });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setTradeInLoading(false);
      setTradeInError('Image upload failed: ' + (err.message || err));
    }
  }
  function handleTradeInInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setTradeInForm(prev => ({ ...prev, [name]: value }));
  }
  function handleTradeInFile(e: React.ChangeEvent<HTMLInputElement>) {
    setTradeInForm(prev => ({ ...prev, car_images: Array.from(e.target.files ?? []) }));
  }

  // Car Management Functions
  const openCarEditor = (car: any) => {
    setEditingCar(car);
    setCarForm({
      name: car.name || '',
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || '',
      price: car.price?.toString() || '',
      fuel_type: car.fuel_type || '',
      transmission: car.transmission || '',
      drive_type: car.drive_type || '',
      colors: car.colors || [''],
      description: car.description || '',
      main_image: car.main_image || '',
      additional_images: car.additional_images || [''],
      location: car.location || 'Nairobi, Kenya',
      status: car.status || 'published'
    });
    setShowCarEditor(true);
  };

  const saveCarChanges = async () => {
    try {
      const carData = {
        ...carForm,
        price: parseFloat(carForm.price) || 0,
        colors: carForm.colors.filter(color => color.trim() !== ''),
        additional_images: carForm.additional_images.filter(img => img.trim() !== '')
      };

      if (editingCar) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', editingCar.id);
        
        if (error) throw error;
        
        // Update local state
        setCars(prev => prev.map(car => 
          car.id === editingCar.id ? { ...car, ...carData } : car
        ));
      } else {
        // Add new car
        const { data, error } = await supabase
          .from('cars')
          .insert([carData])
          .select()
          .single();
        
        if (error) throw error;
        
        // Add to local state
        setCars(prev => [data, ...prev]);
      }
      
      setShowCarEditor(false);
      setEditingCar(null);
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Error saving car. Please try again.');
    }
  };

  const deleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);
      
      if (error) throw error;
      
      setCars(prev => prev.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car. Please try again.');
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
      <style>{`
        @keyframes fadecycle { 0%{opacity:0} 4%{opacity:1} 96%{opacity:1} 100%{opacity:0} }
        ${Array.from({length:12}).map((_,i)=>`.fade-slide-${i}{animation:fadecycle 720s infinite; animation-delay:${i*60}s}`).join('\n')}
      `}</style>
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
        <div className="container mx-auto px-4">
          {/* Hero Section with Premium Glass Morphism and Slideshow */}
          <motion.section
            className="text-center mb-12 relative"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl md:text-5xl font-bold mb-4 md:mb-0 text-left"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="text-white">CATALOGUE</span>
                </motion.h1>
              </div>
              <div className="flex gap-4 items-center justify-end">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-purple-400 hover:to-pink-300 transition-all duration-300" 
                  onClick={() => {
                    setEditingCar(null);
                    setCarForm({
                      name: '', brand: '', model: '', year: '', price: '', fuel_type: '', transmission: '', drive_type: '',
                      colors: [''], description: '', main_image: '', additional_images: [''], location: 'Nairobi, Kenya', status: 'published'
                    });
                    setShowCarEditor(true);
                  }}
                >
                  + Add Car
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-blue-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-green-400 hover:to-blue-300 transition-all duration-300" onClick={() => navigate('/rentals')}>
                  View Rentals
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-blue-400 hover:to-yellow-300 transition-all duration-300" onClick={() => setShowTradeIn(true)}>
                  Trade-In Your Car
                </Button>
              </div>
            </div>
            {/* slow single-image fade slideshow */}
            <div className="mt-6 relative h-36 flex items-center justify-center">
              {filteredCars.slice(0, 12).map((c: any, idx: number) => {
                const img = (c.image || c.additional_images || [c.main_image])?.[0];
                return (
                  <img
                    key={idx}
                    src={img}
                    className={`absolute h-36 w-64 object-cover rounded-xl border border-white/20 shadow fade-slide-${idx}`}
                    style={{ opacity: 0 }}
                  />
                );
              })}
            </div>
                        <motion.p 
               className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto mt-6"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
             >
               🚗 Discover our premium collection of vehicles from luxury cars to commercial vehicles, all available for rent or purchase.
             </motion.p>
          </motion.section>

                     {/* Search and Filter Section with Enhanced Glass Morphism */}
           <motion.section
             className="mb-12"
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
           >
             
            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or brand..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  />
                </div>
                <div className="relative w-full md:w-1/4">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="relative w-full md:w-1/4">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="w-full pl-4 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="price_low">Sort: Price (Low to High)</option>
                    <option value="price_high">Sort: Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Loading and Error States with Glass Morphism */}
          {loading && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-white/90 text-lg">Loading vehicles...</p>
              </div>
            </motion.div>
          )}

          {error && (
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
          )}

          {/* Vehicle Grid with Enhanced Glass Cards */}
          {!loading && !error && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {filteredCars.length === 0 ? (
                <div className="text-center py-12">
                  <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl inline-block">
                    <div className="w-16 h-16 text-white/60 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                    </div>
                    <p className="text-white/90 text-lg">No vehicles found matching your criteria.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
                  {paginatedCars.map((car: any) => (
                     <div key={car.id} className="relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
                       {/* Edit/Delete buttons for database cars */}
                       {car.source === 'database' && (
                         <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               openCarEditor(car);
                             }}
                             className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-xs"
                           >
                             ✏️
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               deleteCar(car.id);
                             }}
                             className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs"
                           >
                             🗑️
                           </button>
                         </div>
                       )}
                       <div onClick={() => navigate(`/car/${car.id}`)}>
                         <CarCard
                           car={car}
                           onSelect={() => navigate(`/car/${car.id}`)}
                         />
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </motion.section>
          )}

          {/* Pagination Controls */}
          {!loading && !error && filteredCars.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                className="px-3 py-1.5 rounded-md bg-white/10 text-white border border-white/20 disabled:opacity-40"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`px-3 py-1.5 rounded-md border ${p === currentPage ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-white/10 text-white border-white/20'}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-1.5 rounded-md bg-white/10 text-white border border-white/20 disabled:opacity-40"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          {/* Rentals Grid */}
          {showRentals && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {rentalsLoading ? (
                <div className="text-center py-12">
                  <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white/90 text-lg">Loading rentals...</p>
                  </div>
                </div>
              ) : rentalsError ? (
                <div className="text-center py-12">
                  <div className="glass-panel rounded-2xl p-8 shadow-xl border border-red-400/20 backdrop-blur-xl inline-block">
                    <p className="text-red-400 text-lg">Error: {rentalsError}</p>
                  </div>
                </div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-xl inline-block">
                    <div className="w-16 h-16 text-white/60 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                    </div>
                    <p className="text-white/90 text-lg">No rentals found.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rentals.map((rental: any) => (
                    <CarCard
                      key={rental.id}
                      car={rental}
                      onSelect={() => setSelectedCar(rental)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}
          {/* Car Detail Modal */}
          {selectedCar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative animate-fadein">
                <button className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-yellow-500" onClick={() => setSelectedCar(null)}>&times;</button>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <img src={selectedCar.image?.[0] || selectedCar.main_image || (selectedCar.additional_images?.[0])} alt={selectedCar.name} className="w-full h-64 object-cover rounded-xl shadow mb-4" />
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {(selectedCar.image || selectedCar.additional_images || []).map?.((img: string, i: number) => (
                        <img key={i} src={img} alt="car" className="w-20 h-16 object-cover rounded shadow" />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-yellow-500 mb-2">{selectedCar.name}</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-200 mb-2">{selectedCar.brand || selectedCar.make}</p>
                    <p className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">KES {selectedCar.price?.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedCar.tags?.map((tag: string) => (
                        <span key={tag} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">{tag}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <span><b>Year:</b> {selectedCar.specs?.year || selectedCar.year}</span>
                      <span><b>Color:</b> {selectedCar.specs?.color || (selectedCar.colors?.join?.(', ') || selectedCar.color)}</span>
                      <span><b>Fuel:</b> {selectedCar.specs?.fuel || selectedCar.fuel_type || selectedCar.fuel}</span>
                      <span><b>Transmission:</b> {selectedCar.specs?.transmission || selectedCar.transmission}</span>
                      <span><b>Mileage:</b> {selectedCar.specs?.mileage?.toLocaleString() || selectedCar.mileage}</span>
                      <span><b>Location:</b> {selectedCar.location}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{selectedCar.description}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="default"
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold"
                        onClick={() => window.open(`https://wa.me/254${selectedCar.whatsapp_number}?text=I'm%20interested%20in%20this%20car`, '_blank')}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `mailto:${selectedCar.email}`}
                      >
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `sms:+254${selectedCar.whatsapp_number}`}
                      >
                        SMS
                      </Button>
                      {selectedCar.location_link && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(selectedCar.location_link, '_blank')}
                        >
                          Map
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced CTA Section */}
          <motion.section
            className="py-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-10 shadow-2xl border border-white/20 backdrop-blur-xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-lg">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-lg mb-8 max-w-xl mx-auto text-white/90 leading-relaxed">
                Contact our team for custom vehicle sourcing, special requests, or to discuss your specific automotive needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl"
                  >
                    Contact Us
                  </Button>
                </Link>
                <Link to="/services">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-3 rounded-xl"
                  >
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Car Editor Modal */}
          {showCarEditor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
              <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-white/20 backdrop-blur-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingCar ? 'Edit Car' : 'Add New Car'}
                  </h2>
                  <button 
                    onClick={() => setShowCarEditor(false)}
                    className="text-white/60 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                  <input
                    placeholder="Car Name"
                    value={carForm.name}
                    onChange={(e) => setCarForm({...carForm, name: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                  />
                  <input
                    placeholder="Brand"
                    value={carForm.brand}
                    onChange={(e) => setCarForm({...carForm, brand: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                  />
                  <input
                    placeholder="Model"
                    value={carForm.model}
                    onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                  />
                  <input
                    placeholder="Year"
                    value={carForm.year}
                    onChange={(e) => setCarForm({...carForm, year: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                  />
                  <input
                    placeholder="Price (KES)"
                    type="number"
                    value={carForm.price}
                    onChange={(e) => setCarForm({...carForm, price: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                  />
                  <select
                    value={carForm.fuel_type}
                    onChange={(e) => setCarForm({...carForm, fuel_type: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white w-full p-3 rounded-lg"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                  <select
                    value={carForm.transmission}
                    onChange={(e) => setCarForm({...carForm, transmission: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white w-full p-3 rounded-lg"
                  >
                    <option value="">Select Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                  </select>
                  <select
                    value={carForm.drive_type}
                    onChange={(e) => setCarForm({...carForm, drive_type: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white w-full p-3 rounded-lg"
                  >
                    <option value="">Select Drive Type</option>
                    <option value="FWD">Front Wheel Drive</option>
                    <option value="RWD">Rear Wheel Drive</option>
                    <option value="AWD">All Wheel Drive</option>
                    <option value="4WD">4 Wheel Drive</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-yellow-200 font-semibold mb-2">Colors (one per line)</label>
                  <textarea
                    value={carForm.colors.join('\n')}
                    onChange={(e) => setCarForm({...carForm, colors: e.target.value.split('\n')})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                    placeholder="White&#10;Black&#10;Silver"
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-yellow-200 font-semibold mb-2">Description</label>
                  <textarea
                    value={carForm.description}
                    onChange={(e) => setCarForm({...carForm, description: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                    placeholder="Car description..."
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-yellow-200 font-semibold mb-2">Main Image URL</label>
                  <input
                    placeholder="https://example.com/car-image.jpg"
                    value={carForm.main_image}
                    onChange={(e) => setCarForm({...carForm, main_image: e.target.value})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-yellow-200 font-semibold mb-2">Additional Images (one URL per line)</label>
                  <textarea
                    value={carForm.additional_images.join('\n')}
                    onChange={(e) => setCarForm({...carForm, additional_images: e.target.value.split('\n')})}
                    className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">Location</label>
                    <input
                      value={carForm.location}
                      onChange={(e) => setCarForm({...carForm, location: e.target.value})}
                      className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 w-full p-3 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">Status</label>
                    <select
                      value={carForm.status}
                      onChange={(e) => setCarForm({...carForm, status: e.target.value})}
                      className="input bg-white/10 border border-yellow-400/30 text-white w-full p-3 rounded-lg"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={saveCarChanges}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:from-green-400 hover:to-blue-400 transition-all duration-300"
                  >
                    {editingCar ? 'Update Car' : 'Add Car'}
                  </button>
                  <button
                    onClick={() => setShowCarEditor(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trade-In Modal */}
          {showTradeIn && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <form onSubmit={handleTradeInSubmit} className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl max-w-lg w-full relative animate-fadein">
                <button type="button" className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-yellow-500" onClick={() => setShowTradeIn(false)}>&times;</button>
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">Trade-In Your Car</h2>
                <input name="user_name" placeholder="Your Name" value={tradeInForm.user_name} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="user_email" placeholder="Email" value={tradeInForm.user_email} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="user_phone" placeholder="Phone" value={tradeInForm.user_phone} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="car_make" placeholder="Car Make" value={tradeInForm.car_make} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="car_model" placeholder="Car Model" value={tradeInForm.car_model} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="car_year" placeholder="Year" value={tradeInForm.car_year} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="car_mileage" placeholder="Mileage" value={tradeInForm.car_mileage} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <input name="car_condition" placeholder="Condition" value={tradeInForm.car_condition} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" />
                <textarea name="notes" placeholder="Additional Notes" value={tradeInForm.notes} onChange={handleTradeInInput} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-2 w-full" rows={2} />
                <label className="block font-semibold mb-1 text-yellow-200">Upload Car Images</label>
                <input type="file" accept="image/*" multiple onChange={handleTradeInFile} ref={fileInputRef} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 mb-4 w-full" />
                <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-2 rounded-lg mt-4 shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300" disabled={tradeInLoading}>{tradeInLoading ? 'Submitting...' : 'Submit Trade-In'}</button>
                {tradeInSuccess && <div className="text-green-500 mt-2">{tradeInSuccess}</div>}
                {tradeInError && <div className="text-red-500 mt-2">{tradeInError}</div>}
              </form>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
