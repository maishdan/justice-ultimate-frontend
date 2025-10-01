import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { carsData } from '../data/carData';
import Footer from "../components/Footer";

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [allCars, setAllCars] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCar() {
      setLoading(true);
      const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
      if (error || !data) {
        const fallback = carsData.find(c => c.id === id);
        if (fallback) {
          setCar({ ...fallback, image_url: fallback.image?.[0] || fallback.main_image });
          setError('');
        } else {
          setError(error?.message || 'Car not found');
        }
      } else {
        setCar(data);
      }
      setLoading(false);
    }
    fetchCar();
  }, [id]);

  useEffect(() => {
    async function fetchAll() {
      const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      const merged = [...(data || []), ...carsData];
      setAllCars(merged);
    }
    fetchAll();
  }, []);

  const images: string[] = useMemo(() => {
    const list = (car?.image || car?.additional_images || []) as string[];
    const main = car?.image_url || car?.main_image;
    const unique = [main, ...list].filter(Boolean) as string[];
    return Array.from(new Set(unique));
  }, [car]);

  // Compute suggestions and navigation consistently (even when car is null)
  const sameBrand = useMemo(() => {
    if (!car) return [] as any[];
    const brand = car.brand || car.make;
    return allCars.filter(c => (c.id !== car.id) && ((c.brand || c.make) === brand)).slice(0, 8);
  }, [allCars, car]);

  const youMayAlsoLike = useMemo(() => {
    if (!car) return [] as any[];
    return allCars.filter(c => c.id !== car.id).slice(0, 8);
  }, [allCars, car]);

  const idxInAll = useMemo(() => allCars.findIndex(c => c.id === car?.id), [allCars, car]);
  const prevCar = idxInAll > 0 ? allCars[idxInAll - 1] : null;
  const nextCar = (idxInAll >= 0 && idxInAll < allCars.length - 1) ? allCars[idxInAll + 1] : null;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading car details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center text-white">Car not found.</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-black py-8 px-2 md:px-8">
      <div className="container mx-auto px-2 md:px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="text-white/80 text-sm mb-4 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-yellow-300">Homepage</Link>
          <span>—</span>
          <Link to="/vehicle-catalogue" className="hover:text-yellow-300">Search</Link>
          {car?.brand && (<><span>—</span><span className="uppercase">{(car.brand || car.make)}</span></>)}
          {car?.model && (<><span>—</span><span className="uppercase">{car.model}</span></>)}
          <span>—</span>
          <span className="uppercase">{car.name}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-xl bg-white/5">
              <img src={(images[activeIndex] || car.image_url || car.main_image || (car.image?.[0]) || '/images/placeholder-car.jpg')} alt={car.name} className="w-full h-80 object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" onClick={() => setActiveIndex(i => (i - 1 + images.length) % images.length)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" onClick={() => setActiveIndex(i => (i + 1) % images.length)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" onClick={() => {
                  const url = images[activeIndex] || car.image_url || car.main_image;
                  if (!url) return;
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${(car.name || 'car').replace(/\s+/g,'-')}-${activeIndex+1}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto mt-3">
              {images.slice(0, 12).map((img, i) => (
                <img key={i} src={img} alt="thumb" onClick={() => setActiveIndex(i)} className={`w-20 h-16 object-cover rounded border ${i===activeIndex ? 'border-yellow-400' : 'border-white/20'} cursor-pointer`} />
              ))}
            </div>
          </div>
          <div>
            <div className="md:sticky md:top-24 space-y-3">
              <div className="glass-panel rounded-2xl p-4 border border-white/20 backdrop-blur-xl">
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{car.name}</h1>
                <p className="text-white/90">{car.brand || car.make} • {car.model} • {car.specs?.year || car.year}</p>
                <p className="text-lg text-white mt-2">Price: <span className="text-green-400 font-semibold">KES {car.price?.toLocaleString?.() || car.price}</span></p>
              </div>
              <div className="glass-panel rounded-2xl p-3 border border-white/20 backdrop-blur-xl">
                <div className="flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60" placeholder="Our search accepts free text e.g. Audi sunroof" />
                  <Link to="/vehicle-catalogue"><Button>Search</Button></Link>
                </div>
              </div>
              <a href="tel:+254748222222" className="block w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl">+254 748-222-222</a>
              <a href="mailto:inquiry@alhusnainmotors.co.ke" className="block w-full text-center px-4 py-3 bg-white/10 hover:bg白/20 text-white rounded-xl">inquiry@alhusnainmotors.co.ke</a>
              <a
                href={`https://wa.me/254722827458?text=I'm%20interested%20in%20${encodeURIComponent(car.name)}%20(${encodeURIComponent(car.stockId || car.id)}).`}
                target="_blank" rel="noreferrer"
                className="block w-full text-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >Whatsapp</a>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white" onClick={() => navigate('/vehicle-catalogue')}>Compare</Button>
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white" onClick={() => navigate('/vehicle-catalogue')}>Trade in</Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white" disabled={!prevCar} onClick={() => prevCar && navigate(`/car/${prevCar.id}`)}>Previous Vehicle</Button>
                <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white" disabled={!nextCar} onClick={() => nextCar && navigate(`/car/${nextCar.id}`)}>Next Vehicle</Button>
              </div>
              <Link to="/vehicle-catalogue" className="block text-center text-white/80 hover:text-yellow-300">Back to Catalogue</Link>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/20 backdrop-blur-xl mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white/90">
            <div><span className="text-white/60">Make:</span> {car.brand || car.make}</div>
            <div><span className="text-white/60">Model:</span> {car.model}</div>
            <div><span className="text-white/60">Year:</span> {car.specs?.year || car.year}</div>
            <div><span className="text-white/60">Mileage:</span> {(car.specs?.mileage || car.mileage)?.toLocaleString?.()} km</div>
            <div><span className="text-white/60">Engine:</span> {car.engine_cc || car.specs?.engine || '—'}</div>
            <div><span className="text-white/60">Fuel Type:</span> {car.specs?.fuel || car.fuel_type}</div>
            <div><span className="text-white/60">Transmission:</span> {car.specs?.transmission || car.transmission}</div>
            <div><span className="text-white/60">Drive:</span> {car.drive_type || car.specs?.drivetrain}</div>
            <div><span className="text-white/60">Color:</span> {car.specs?.color || (car.colors?.[0] || car.color)}</div>
            <div><span className="text-white/60">Stock ID:</span> {car.stockId || car.id}</div>
          </div>
        </div>

        {sameBrand.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Similar Vehicles From {car.brand || car.make}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sameBrand.map((c: any) => (
                <div key={c.id} className="glass-panel rounded-xl p-3 border border-white/20 backdrop-blur-xl cursor-pointer" onClick={() => navigate(`/car/${c.id}`)}>
                  <img src={c.image?.[0] || c.main_image || c.additional_images?.[0] || '/images/placeholder-car.jpg'} alt={c.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <div className="text-white font-medium text-sm">{c.name}</div>
                  <div className="text-white/70 text-xs">{c.brand || c.make} {c.model} {c.specs?.year || c.year}</div>
                  <div className="text-yellow-300 text-sm font-semibold">{(c.currency ?? 'KES') === 'KES' ? 'Ksh' : '$'} {c.price?.toLocaleString?.()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {youMayAlsoLike.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">You may also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {youMayAlsoLike.map((c: any) => (
                <div key={c.id} className="glass-panel rounded-xl p-3 border border-white/20 backdrop-blur-xl cursor-pointer" onClick={() => navigate(`/car/${c.id}`)}>
                  <img src={c.image?.[0] || c.main_image || c.additional_images?.[0] || '/images/placeholder-car.jpg'} alt={c.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <div className="text-white font-medium text-sm">{c.name}</div>
                  <div className="text-white/70 text-xs">{c.brand || c.make} {c.model} {c.specs?.year || c.year}</div>
                  <div className="text-yellow-300 text-sm font-semibold">{(c.currency ?? 'KES') === 'KES' ? 'Ksh' : '$'} {c.price?.toLocaleString?.()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
} 