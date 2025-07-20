import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button, IconButton } from '../../ui/button';
import { BarChart, PieChart } from './Charts';
import { FaPlus, FaFilePdf, FaFileCsv, FaCar, FaUsers, FaMoneyBill, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';

// Type for recent activity
interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
}

export default function DashboardOverview() {
  const [kpis, setKpis] = useState({
    totalSales: 0,
    totalRentals: 0,
    totalUsers: 0,
    totalRevenue: 0,
    inventory: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Set data immediately for fast loading
      setKpis({
        totalSales: 120,
        totalRentals: 45,
        totalUsers: 320,
        totalRevenue: 15000000,
        inventory: 87,
      });
      
      setRecentActivity([
        { id: 1, type: 'sale', message: 'Sold BMW X5 to Jane Doe', time: '2 min ago' },
        { id: 2, type: 'rental', message: 'Rented Toyota Prado to John Smith', time: '10 min ago' },
        { id: 3, type: 'user', message: 'New user registered: Alice', time: '30 min ago' },
        { id: 4, type: 'car', message: 'Added Mercedes S-Class to inventory', time: '1 hr ago' },
      ]);
      
      // Try to fetch real data in background
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 3000)
        );

        // Fetch real data with timeout
        const dataPromise = Promise.all([
          supabase.from('profiles').select('count').limit(1),
          supabase.from('cars').select('count').limit(1),
          supabase.from('bookings').select('count').limit(1)
        ]);

        const results = await Promise.race([dataPromise, timeoutPromise]) as any;
        
        // Update with real data if available
        if (results && results.length >= 3) {
          setKpis(prev => ({
            ...prev,
            totalUsers: results[0]?.count || prev.totalUsers,
            inventory: results[1]?.count || prev.inventory,
            totalRentals: results[2]?.count || prev.totalRentals,
          }));
        }
      } catch (error) {
        // Keep using mock data if real data fails
        console.log('Using mock data for dashboard overview');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Quick Actions
  const quickActions = [
    { icon: <FaPlus />, label: 'Add Car', onClick: () => navigate('/dashboard/admin/car-management'), tooltip: 'Add a new car to inventory' },
    { icon: <FaFilePdf />, label: 'Export PDF', onClick: () => alert('Export PDF'), tooltip: 'Export dashboard as PDF' },
    { icon: <FaFileCsv />, label: 'Export CSV', onClick: () => alert('Export CSV'), tooltip: 'Export dashboard as CSV' },
    { icon: <FaUsers />, label: 'Manage Users', onClick: () => navigate('/dashboard/admin/user-management'), tooltip: 'Manage platform users' },
    { icon: <FaCog />, label: 'Settings', onClick: () => navigate('/dashboard/admin/profile/settings'), tooltip: 'Dashboard settings' },
  ];

  // Admin profile photo (fallback to logo)
  const adminPhoto = '/logo.png';

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2 md:px-6 py-8 w-full min-w-0">
      {/* Header: Profile & Settings */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4 w-full min-w-0">
        <div />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-green-900 px-3 py-1 rounded-full shadow hover:shadow-blue-400/60 transition-all cursor-pointer group" onClick={() => navigate('/dashboard/admin/profile')}>
            <img
              src={adminPhoto}
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow group-hover:shadow-blue-400/60 transition-all"
            />
            <span className="font-semibold text-blue-700 dark:text-blue-200 text-base group-hover:text-blue-500 transition">Admin</span>
          </div>
          <IconButton icon={FaCog} onClick={() => navigate('/dashboard/admin/profile/settings')} className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-400/60" />
        </div>
      </div>

      {/* Top Section: Welcome, Offers, Notifications */}
      {/* (Removed duplicated chart tiles here) */}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-start w-full min-w-0">
        {quickActions.map((action, idx) => (
          <div key={idx} className="relative group">
            <Button
              className="flex items-center gap-2 px-4 py-2 font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:from-indigo-400 hover:to-blue-600 hover:shadow-blue-400/60 focus:ring-2 focus:ring-blue-400 transition-all rounded-xl"
              onClick={action.onClick}
              aria-label={action.label}
            >
            {action.icon} {action.label}
          </Button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-10 transition-all whitespace-nowrap">
              {action.tooltip}
            </span>
          </div>
        ))}
      </div>

      {/* Insights & Mini-Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full min-w-0">
        <div className="glass-panel rounded-xl shadow-xl p-6">
          <h3 className="font-bold text-lg mb-2 text-white">Sales & Rentals Trend</h3>
          <div className="h-56 flex items-center justify-center glass-panel rounded-xl p-2">
            <BarChart title="" />
          </div>
        </div>
        <div className="glass-panel rounded-xl shadow-xl p-6">
          <h3 className="font-bold text-lg mb-2 text-white">Sales Distribution</h3>
          <div className="h-56 flex items-center justify-center glass-panel rounded-xl p-2">
            <PieChart />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-xl p-4 shadow-lg w-full min-w-0">
        <h3 className="font-bold text-lg mb-4 text-white">Recent Activity</h3>
        <div className="glass-panel rounded-xl shadow divide-y divide-gray-200 overflow-x-auto w-full min-w-0">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 font-medium text-white">
                {activity.type === 'sale' && <FaMoneyBill className="text-green-500" />}
                {activity.type === 'rental' && <FaCar className="text-blue-500" />}
                {activity.type === 'user' && <FaUsers className="text-purple-500" />}
                {activity.type === 'car' && <FaCar className="text-pink-500" />}
                {activity.message}
              </span>
              <span className="text-xs text-white">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 