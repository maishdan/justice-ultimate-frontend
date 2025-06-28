// src/components/dashboard/widgets/VehicleTracker.tsx
import React from 'react';

export default function VehicleTracker() {
  return (
    <div className="bg-green-900/80 text-white rounded-lg p-6 shadow-xl hover:shadow-green-400 transition duration-300">
      <h3 className="text-2xl font-bold mb-4">📍 Real-Time Vehicle Tracker</h3>
      <div className="space-y-2">
        <p className="text-sm">Vehicle ID: JU-234XZ</p>
        <p className="text-sm">Speed: 65 km/h</p>
        <p className="text-sm">Mileage: 24,510 km</p>
        <p className="text-sm">Battery: 88%</p>
        <p className="text-sm">Location: Nyeri, Kenya</p>

        <div className="mt-4">
          <iframe
            title="Live Car Map"
            src="https://maps.google.com/maps?q=Nyeri&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="200"
            className="rounded shadow"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
