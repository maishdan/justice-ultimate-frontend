import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { FiDownload, FiAlertTriangle, FiCheckCircle, FiBell, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';

// Mock data for demonstration (replace with Supabase integration as needed)
const mockUser = {
  full_name: 'Daniel Mwangi',
  email: 'daniel@example.com',
  avatar: '/images/avatar-default.png',
};

const mockVehicles = [
  {
    id: '1',
    car_name: 'Toyota Land Cruiser V8',
    status: 'Owned',
    license_plate: 'KCA 123A',
    car_image: '/images/land-cruiser-v8 1.jpg',
  },
  {
    id: '2',
    car_name: 'BMW X5',
    status: 'Awaiting Delivery',
    license_plate: 'KDB 456B',
    car_image: '/images/BMW X5/1.jpg',
  },
];

const mockPendingActions = [
  { id: 1, type: 'payment', message: 'Unpaid installment for BMW X5', priority: 'high' },
  { id: 2, type: 'document', message: 'Upload your National ID for Land Cruiser', priority: 'medium' },
];

const mockNotifications = [
  { id: '1', title: 'Logbook Ready', message: 'Your logbook for Land Cruiser is ready.', timestamp: '2 hours ago', type: 'info' },
  { id: '2', title: 'Payment Due', message: 'Next payment for BMW X5 due in 3 days.', timestamp: '1 day ago', type: 'alert' },
  { id: '3', title: 'Appointment Confirmed', message: 'Your service appointment is confirmed for Friday.', timestamp: '3 days ago', type: 'success' },
];

const mockSummary = {
  totalVehicles: 2,
  totalPaid: 12000000,
  outstanding: 350000,
  appointments: 1,
};

export default function Overview() {
  // In real app, fetch from Supabase and set state
  const [user] = useState(mockUser);
  const [vehicles] = useState(mockVehicles);
  const [pendingActions] = useState(mockPendingActions);
  const [notifications] = useState(mockNotifications);
  const [summary] = useState(mockSummary);

  return (
    <div className="space-y-8 w-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative">
          <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">Welcome back, <span className="text-yellow-400">{user.full_name}</span></h1>
          <p className="text-blue-100 mt-2">Your world-class automotive experience starts here.</p>
        </div>
      </div>

      {/* Quick Summary Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <AiFillCar className="text-3xl mb-2 text-yellow-400" />
            <div className="text-lg font-bold">{summary.totalVehicles}</div>
            <div className="text-xs text-blue-100">Total Vehicles</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiDollarSign className="text-3xl mb-2 text-green-400" />
            <div className="text-lg font-bold">KES {summary.totalPaid.toLocaleString()}</div>
            <div className="text-xs text-blue-100">Total Paid</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiAlertTriangle className="text-3xl mb-2 text-red-400" />
            <div className="text-lg font-bold">KES {summary.outstanding.toLocaleString()}</div>
            <div className="text-xs text-blue-100">Outstanding</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 text-white">
          <CardContent className="p-4 flex flex-col items-center">
            <FiCalendar className="text-3xl mb-2 text-purple-400" />
            <div className="text-lg font-bold">{summary.appointments}</div>
            <div className="text-xs text-blue-100">Appointments</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Vehicles */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Your Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((car) => (
            <Card key={car.id} className="flex items-center gap-4 bg-gradient-to-r from-blue-700/80 to-purple-600/80 p-4">
              <img src={car.car_image} alt={car.car_name} className="w-20 h-14 object-cover rounded-lg shadow" />
              <div>
                <div className="font-bold text-lg">{car.car_name}</div>
                <div className="text-xs text-blue-100">{car.license_plate} • {car.status}</div>
              </div>
              <Badge className="ml-auto bg-yellow-400 text-blue-900 font-bold">{car.status}</Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2 text-yellow-400">Pending Actions</h2>
          <div className="space-y-2">
            {pendingActions.map((action) => (
              <Card key={action.id} className="flex items-center gap-4 bg-red-100/10 p-4 border-l-4 border-yellow-400">
                <FiAlertTriangle className="text-red-400 text-2xl" />
                <div className="text-white font-semibold">{action.message}</div>
                <Badge className={`ml-auto ${action.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'} text-blue-900 font-bold`}>{action.type.toUpperCase()}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notifications */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Recent Notifications</h2>
        <div className="space-y-2">
          {notifications.slice(0, 3).map((notif) => (
            <Card key={notif.id} className="flex items-center gap-4 bg-white/10 p-4">
              <FiBell className="text-yellow-400 text-2xl" />
              <div>
                <div className="font-semibold text-white">{notif.title}</div>
                <div className="text-xs text-blue-100">{notif.message}</div>
              </div>
              <div className="ml-auto text-xs text-blue-200">{notif.timestamp}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 