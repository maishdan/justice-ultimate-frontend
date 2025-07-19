import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureLogout, fastLogout } from '../../../../lib/authUtils';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { 
  FiLogOut, 
  FiAlertTriangle,
  FiCheckCircle,
  FiUser,
  FiShield,
  FiClock
} from 'react-icons/fi';

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // Use fast logout for immediate response
    fastLogout('/login');
  };

  const handleLogoutAllDevices = async () => {
    if (confirm('Are you sure you want to sign out from all devices? This will end all active sessions.')) {
      setLoading(true);
      // Use fast logout for immediate response
      fastLogout('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl shadow-xl text-white relative overflow-hidden animate-fadein">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative group mb-4">
          <FiLogOut className="w-14 h-14 text-gray-100 hover:text-red-400 transition cursor-pointer drop-shadow-lg" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
            Logout
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 drop-shadow">Logout</h2>
        <p className="text-lg text-blue-100 mb-4 max-w-md text-center">You will be logged out of your account. Thank you for using Justice Ultimate Automobiles!</p>
        <span className="inline-block bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-full shadow animate-shimmer">Coming Soon</span>
      </div>
    </div>
  );
} 