import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { FiMapPin, FiPhone, FiGlobe } from 'react-icons/fi';

const branches = [
  {
    name: 'Nairobi Showroom',
    address: 'Westlands, Nairobi, Kenya',
    phone: '+254 722 827 458',
    mapUrl: 'https://www.google.com/maps?q=-1.2648,36.8006',
  },
  {
    name: 'Mombasa Branch',
    address: 'Moi Avenue, Mombasa, Kenya',
    phone: '+254 733 123 456',
    mapUrl: 'https://www.google.com/maps?q=-4.0435,39.6682',
  },
  {
    name: 'Kisumu Branch',
    address: 'Oginga Odinga St, Kisumu, Kenya',
    phone: '+254 711 987 654',
    mapUrl: 'https://www.google.com/maps?q=-0.0917,34.7680',
  },
];

export default function BranchLocator() {
  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Branch Locator</h1>
          <p className="text-blue-100 mt-2">Find your nearest showroom or support center and get directions instantly.</p>
        </div>
      </div>

      {/* Google Maps Embed (centered on Nairobi for demo) */}
      <div className="w-full flex justify-center mb-8">
        <iframe
          title="Google Maps - Nairobi Showroom"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.07284772231!2d36.8006!3d-1.2648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e9e1e1e1e1%3A0x1e1e1e1e1e1e1e1e!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1680000000000!5m2!1sen!2ske"
          width="600"
          height="350"
          style={{ border: 0, borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      </div>

      {/* Branch List */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Our Branches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b, i) => (
            <Card key={i} className="flex flex-col md:flex-row items-center gap-4 bg-white/10 p-4">
              <FiMapPin className="text-blue-400 text-2xl" />
              <div className="flex-1">
                <div className="font-semibold text-white">{b.name}</div>
                <div className="text-xs text-blue-100">{b.address}</div>
                <div className="text-xs text-blue-200 flex items-center gap-2"><FiPhone /> {b.phone}</div>
              </div>
              <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded shadow hover:bg-yellow-300 flex items-center gap-2"><FiGlobe /> Get Directions</a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 