import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { MessageCircle } from 'lucide-react';
import { carsData } from '../data/carData';

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading car details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center text-white">Car not found.</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-black py-8 px-2 md:px-8">
      <div className="container mx-auto px-2 md:px-4 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img src={car.image_url || car.main_image || (car.image?.[0])} alt={car.name} className="w-full h-64 object-cover rounded-xl mb-3" />
            <div className="flex gap-2 overflow-x-auto">
              {(car.image || car.additional_images || []).slice(0,6).map((img: string, i: number) => (
                <img key={i} src={img} alt="thumb" className="w-20 h-16 object-cover rounded border border-white/20" />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">{car.name}</h1>
            <p className="text-lg text-white mb-2">Brand: <span className="text-blue-300">{car.brand || car.make}</span></p>
            <p className="text-lg text-white mb-2">Price: <span className="text-green-400">KES {car.price?.toLocaleString?.() || car.price}</span></p>
            {car.description && <p className="text-white/90 mb-4 leading-relaxed">{car.description}</p>}
            <div className="flex gap-3 mt-4">
              <a
                href={`https://wa.me/254722827458?text=I'm%20interested%20in%20${encodeURIComponent(car.name)}%20(${encodeURIComponent(car.stockId || car.id)}).`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <Link to="/contact">
                <Button variant="outline">Contact Sales</Button>
              </Link>
              <Link to="/vehicle-catalogue">
                <Button variant="secondary">Back to Catalogue</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 