import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { FiCalendar, FiCheckCircle, FiXCircle, FiAlertTriangle, FiEdit2, FiDownload, FiClock } from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';

const mockBookings = [
  {
    id: '1',
    car_name: 'BMW X5',
    start_date: '2024-01-15',
    end_date: '2024-01-18',
    total_amount: 45000,
    status: 'confirmed',
    pickup_location: 'Nairobi Airport',
    return_location: 'Nairobi Airport',
    car_image: '/images/BMW X5/1.jpg'
  },
  {
    id: '2',
    car_name: 'Mercedes S-Class',
    start_date: '2024-01-20',
    end_date: '2024-01-22',
    total_amount: 35000,
    status: 'pending',
    pickup_location: 'Mombasa Branch',
    return_location: 'Mombasa Branch',
    car_image: '/images/MERCEDES S CLASS/1.jpg'
  },
  {
    id: '3',
    car_name: 'Toyota Land Cruiser',
    start_date: '2024-01-10',
    end_date: '2024-01-12',
    total_amount: 55000,
    status: 'completed',
    pickup_location: 'Kisumu Branch',
    return_location: 'Kisumu Branch',
    car_image: '/images/landcruiser-v8/1.jpg'
  }
];

const mockAppointments = [
  {
    id: '1',
    car_name: 'BMW X6',
    appointment_date: '2024-01-25',
    appointment_time: '14:00',
    type: 'test_drive',
    status: 'confirmed',
    location: 'Nairobi Showroom',
    car_image: '/images/BMW X5/2.jpg'
  },
  {
    id: '2',
    car_name: 'Range Rover Sport',
    appointment_date: '2024-01-28',
    appointment_time: '10:30',
    type: 'consultation',
    status: 'pending',
    location: 'Mombasa Branch',
    car_image: '/images/RANGE VOLVO/1.jpg'
  }
];

export default function Bookings() {
  const [bookings, setBookings] = useState(mockBookings);
  const [appointments, setAppointments] = useState(mockAppointments);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      alert('Booking cancelled successfully!');
    }
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    alert('Reschedule functionality coming soon!');
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Bookings & Appointments</h1>
          <p className="text-blue-100 mt-2">Manage your car rentals, test drives, and appointments.</p>
        </div>
        <div className="flex gap-4 ml-auto">
          <Button onClick={() => window.location.href = '/vehicle-catalogue'}>
            <AiFillCar className="mr-2" />Book New Car
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/book-test-drive'}>
            <FiCalendar className="mr-2" />Schedule Test Drive
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <AiFillCar className="text-3xl mb-2 text-yellow-400" />
            <div className="text-lg font-bold">{bookings.length}</div>
            <div className="text-xs text-blue-100">Total Bookings</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiCheckCircle className="text-3xl mb-2 text-green-400" />
            <div className="text-lg font-bold">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="text-xs text-blue-100">Active Rentals</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiCalendar className="text-3xl mb-2 text-orange-400" />
            <div className="text-lg font-bold">{appointments.filter(a => a.status === 'confirmed').length}</div>
            <div className="text-xs text-blue-100">Upcoming Appointments</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiXCircle className="text-3xl mb-2 text-red-400" />
            <div className="text-lg font-bold">{bookings.filter(b => b.status === 'cancelled').length}</div>
            <div className="text-xs text-blue-100">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Car Bookings</h2>
        <div className="space-y-2">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-blue-700/80 to-purple-600/80 p-4">
              <img src={b.car_image} alt={b.car_name} className="w-24 h-16 object-cover rounded-lg shadow" />
              <div className="flex-1">
                <div className="font-bold text-lg">{b.car_name}</div>
                <div className="text-xs text-blue-100">{b.pickup_location} → {b.return_location}</div>
                <div className="text-xs text-blue-200">{b.start_date} to {b.end_date}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-yellow-400 text-blue-900 font-bold">KES {b.total_amount.toLocaleString()}</Badge>
                  <Badge className="ml-2 font-bold text-xs px-2 py-1 " style={{ background: b.status === 'confirmed' ? '#34d399' : b.status === 'pending' ? '#fbbf24' : '#f87171', color: '#1e293b' }}>{b.status.toUpperCase()}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                {b.status !== 'cancelled' && (
                  <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleCancelBooking(b.id)}>
                    <FiXCircle className="mr-1" /> Cancel
                  </Button>
                )}
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => alert('Download booking PDF!')}>
                  <FiDownload className="mr-1" /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Appointments & Test Drives</h2>
        <div className="space-y-2">
          {appointments.map((a) => (
            <Card key={a.id} className="flex flex-col md:flex-row items-center gap-4 bg-white/10 p-4">
              <img src={a.car_image} alt={a.car_name} className="w-24 h-16 object-cover rounded-lg shadow" />
              <div className="flex-1">
                <div className="font-bold text-lg">{a.car_name}</div>
                <div className="text-xs text-blue-100">{a.location}</div>
                <div className="text-xs text-blue-200">{a.appointment_date} at {a.appointment_time}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-yellow-400 text-blue-900 font-bold">{a.type.replace('_', ' ').toUpperCase()}</Badge>
                  <Badge className="ml-2 font-bold text-xs px-2 py-1 " style={{ background: a.status === 'confirmed' ? '#34d399' : a.status === 'pending' ? '#fbbf24' : '#f87171', color: '#1e293b' }}>{a.status.toUpperCase()}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleRescheduleAppointment(a.id)}>
                  <FiEdit2 className="mr-1" /> Reschedule
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => alert('Download appointment PDF!')}>
                  <FiDownload className="mr-1" /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 