import { useEffect, useState } from 'react';
import { CarCard } from '../components/CarCard';
import { useNavigate } from 'react-router-dom';

export default function Whitelist() {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('whitelist') || '[]');
      setItems(Array.isArray(list) ? list : []);
    } catch { setItems([]); }
  }, []);
  return (
    <div className="min-h-screen w-full py-10 px-4" style={{ backgroundImage: "url('/images/bg-landing.png')", backgroundSize: 'cover' }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-6">My Whitelist</h1>
        {items.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-white/90">No cars whitelisted yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((car: any) => (
              <div key={car.id} onClick={() => navigate(`/car/${car.id}`)}>
                <CarCard car={car} onSelect={() => navigate(`/car/${car.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


