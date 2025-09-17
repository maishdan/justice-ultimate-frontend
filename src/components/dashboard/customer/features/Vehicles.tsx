import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { FiDownload, FiUpload, FiMapPin, FiCheckCircle, FiAlertTriangle, FiCalendar, FiSettings, FiTrendingUp, FiShield, FiSend } from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';

const mockOwnedCars = [
  {
    id: '1',
    car_name: 'Toyota Land Cruiser V8',
    year: '2020',
    mileage: '45,000 km',
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    color: 'White',
    license_plate: 'KCA 123A',
    insurance_status: 'Active',
    last_service: '2024-01-10',
    next_service: '2024-04-10',
    car_image: '/images/land-cruiser-v8 1.jpg',
    value: 8500000,
    logbook: true,
    delivery: '2024-04-20',
    gps: true,
  },
  {
    id: '2',
    car_name: 'BMW X5',
    year: '2021',
    mileage: '32,000 km',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    color: 'Black',
    license_plate: 'KDB 456B',
    insurance_status: 'Active',
    last_service: '2024-01-05',
    next_service: '2024-04-05',
    car_image: '/images/BMW X5/1.jpg',
    value: 6500000,
    logbook: false,
    delivery: '2024-05-01',
    gps: false,
  }
];

const mockMaintenance = [
  { car_id: '1', date: '2024-01-10', type: 'Service', details: 'Oil change, tire rotation', status: 'Completed' },
  { car_id: '2', date: '2024-01-05', type: 'Service', details: 'Brake check', status: 'Completed' },
];

const mockTransfers = [
  { car_id: '2', status: 'Pending', requested_on: '2024-03-01', doc_uploaded: false },
];

export default function Vehicles() {
  const [ownedCars] = useState(mockOwnedCars);
  const [maintenance] = useState(mockMaintenance);
  const [transfers] = useState(mockTransfers);
  const [uploading, setUploading] = useState(false);

  // Placeholder for file upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, carId: string, type: string) => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert(`${type} uploaded for car ${carId}!`);
    }, 1200);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">My Vehicles</h1>
          <p className="text-blue-100 mt-2">Manage your owned, booked, and delivered vehicles.</p>
        </div>
        <div className="flex gap-4 ml-auto">
          <Button onClick={() => window.location.href = '/catalogue'}>
            <AiFillCar className="mr-2" />Add New Car
          </Button>
          <Button variant="outline"><FiSettings className="mr-2" />Vehicle Settings</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <AiFillCar className="text-3xl mb-2 text-yellow-400" />
            <div className="text-lg font-bold">{ownedCars.length}</div>
            <div className="text-xs text-blue-100">Owned Vehicles</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiTrendingUp className="text-3xl mb-2 text-green-400" />
            <div className="text-lg font-bold">KES {(ownedCars.reduce((sum, car) => sum + car.value, 0)).toLocaleString()}</div>
            <div className="text-xs text-blue-100">Total Value</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiShield className="text-3xl mb-2 text-orange-400" />
            <div className="text-lg font-bold">Active</div>
            <div className="text-xs text-blue-100">Insurance Status</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiCheckCircle className="text-3xl mb-2 text-purple-400" />
            <div className="text-lg font-bold">{maintenance.length}</div>
            <div className="text-xs text-blue-100">Maintenance Records</div>
          </CardContent>
        </Card>
      </div>

      {/* Owned Vehicles List */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Owned Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedCars.map((car) => (
            <Card key={car.id} className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-blue-700/80 to-purple-600/80 p-4">
              <img src={car.car_image} alt={car.car_name} className="w-24 h-16 object-cover rounded-lg shadow" />
              <div className="flex-1">
                <div className="font-bold text-lg">{car.car_name} <span className="text-xs text-blue-100 ml-2">({car.year})</span></div>
                <div className="text-xs text-blue-100">{car.license_plate} • {car.status || 'Owned'}</div>
                <div className="text-xs text-blue-200">{car.mileage} • {car.fuel_type} • {car.transmission} • {car.color}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-yellow-400 text-blue-900 font-bold">{car.insurance_status}</Badge>
                  <Badge className="bg-purple-400 text-white font-bold">KES {car.value.toLocaleString()}</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-blue-100">Last Service: {car.last_service}</span>
                  <span className="text-xs text-blue-100">Next: {car.next_service}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-blue-100">Delivery: {car.delivery}</span>
                </div>
              </div>
              {/* Logbook Upload/Download */}
              <div className="flex flex-col gap-2 items-center">
                {car.logbook ? (
                  <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => alert('Download logbook PDF!')}>
                    <FiDownload className="mr-1" /> Logbook
                  </Button>
                ) : (
                  <label className="flex items-center gap-1 cursor-pointer">
                    <FiUpload className="mr-1" />
                    <input type="file" accept="application/pdf" className="hidden" onChange={e => handleUpload(e, car.id, 'Logbook')} />
                    <span className="text-xs">Upload Logbook</span>
                  </label>
                )}
                {/* GPS Tracker (Premium) */}
                {car.gps && (
                  <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => alert('Show GPS location (mock)!')}>
                    <FiMapPin className="mr-1" /> GPS Tracker
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Maintenance Records */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Maintenance Records</h2>
        <div className="space-y-2">
          {maintenance.map((rec, i) => (
            <Card key={i} className="flex items-center gap-4 bg-white/10 p-4">
              <FiCheckCircle className="text-green-400 text-2xl" />
              <div>
                <div className="font-semibold text-white">{rec.type} - {rec.details}</div>
                <div className="text-xs text-blue-100">{rec.date} • {rec.status}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Transfer Requests */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Transfer Requests</h2>
        <div className="space-y-2">
          {transfers.length === 0 && <div className="text-blue-100">No transfer requests.</div>}
          {transfers.map((tr, i) => (
            <Card key={i} className="flex items-center gap-4 bg-white/10 p-4">
              <FiSend className="text-yellow-400 text-2xl" />
              <div>
                <div className="font-semibold text-white">Transfer for Car ID: {tr.car_id}</div>
                <div className="text-xs text-blue-100">Status: {tr.status} • Requested: {tr.requested_on}</div>
              </div>
              <div className="ml-auto">
                {tr.doc_uploaded ? (
                  <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => alert('Download transfer doc!')}>
                    <FiDownload className="mr-1" /> Transfer Doc
                  </Button>
                ) : (
                  <label className="flex items-center gap-1 cursor-pointer">
                    <FiUpload className="mr-1" />
                    <input type="file" accept="application/pdf" className="hidden" onChange={e => handleUpload(e, tr.car_id, 'Transfer Doc')} />
                    <span className="text-xs">Upload Transfer Doc</span>
                  </label>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Document Uploads */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Document Uploads</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-lg shadow hover:bg-white/20 transition">
            <FiUpload className="text-yellow-400" />
            <input type="file" accept="application/pdf,image/*" className="hidden" onChange={e => handleUpload(e, 'all', 'KRA PIN')} />
            <span className="text-xs">Upload KRA PIN</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-lg shadow hover:bg-white/20 transition">
            <FiUpload className="text-yellow-400" />
            <input type="file" accept="application/pdf,image/*" className="hidden" onChange={e => handleUpload(e, 'all', 'National ID')} />
            <span className="text-xs">Upload National ID</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-lg shadow hover:bg-white/20 transition">
            <FiUpload className="text-yellow-400" />
            <input type="file" accept="application/pdf,image/*" className="hidden" onChange={e => handleUpload(e, 'all', 'Proof of Payment')} />
            <span className="text-xs">Upload Proof of Payment</span>
          </label>
        </div>
        {uploading && <div className="text-blue-200 mt-2 animate-pulse">Uploading...</div>}
      </div>
    </div>
  );
} 