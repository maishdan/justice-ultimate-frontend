import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCar() {
      setLoading(true);
      const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
      if (error) setError(error.message);
      else setCar(data);
      setLoading(false);
    }
    fetchCar();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading car details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center text-white">Car not found.</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-black py-8 px-2 md:px-8">
      <div className="container mx-auto px-2 md:px-4 max-w-3xl">
        <img src={car.image_url} alt={car.name} className="w-full h-64 object-cover rounded-xl mb-6" />
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">{car.name}</h1>
        <p className="text-lg text-white mb-2">Brand: <span className="text-blue-300">{car.brand}</span></p>
        <p className="text-lg text-white mb-2">Price: <span className="text-green-400">KES {car.price}</span></p>
        {car.description && <p className="text-white mb-4">{car.description}</p>}
        {/* Add more specs as needed */}
        <div className="flex gap-4 mt-6">
          <Link to="/vehicle-catalogue">
            <Button variant="outline">Back to Catalogue</Button>
          </Link>
          {/* Add booking/purchase buttons here if needed */}
        </div>
      </div>
    </div>
  );
} 