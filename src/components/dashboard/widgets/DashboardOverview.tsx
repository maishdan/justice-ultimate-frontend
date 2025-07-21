import { useEffect, useState } from 'react';
import { BarChart, PieChart } from './Charts';
import { supabase } from '../../../lib/supabaseClient';
import { FaMoneyBill, FaCar, FaUsers } from 'react-icons/fa';

// Type for recent activity
interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
}

export default function DashboardOverview() {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchData() {
      // KPIs removed (not used in UI)
      
      // Set data immediately for fast loading
      // KPIs removed (not used in UI)
      
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

        // Fetch real data with timeout - only use existing tables
        const dataPromise = Promise.all([
          supabase.from('cars').select('count').limit(1),
          supabase.from('rentals').select('count').limit(1),
          supabase.from('sales').select('count').limit(1)
        ]);

        const results = await Promise.race([dataPromise, timeoutPromise]) as any;
        
        // No update needed (KPIs not used)
      } catch (error) {
        // Keep using mock data if real data fails
        console.log('Using mock data for dashboard overview');
      } finally {
        // setLoading(false); // Removed as per cleanup
      }
    }
    
    fetchData();
  }, []);

  // Quick Actions

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2 md:px-6 py-8 w-full min-w-0">
      {/* Tiles moved to the top as indicated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full min-w-0 mb-8">
        <div className="glass-panel rounded-xl shadow-xl p-6">
          <h3 className="font-bold text-lg mb-2" style={{ color: '#22c55e' }}>Sales & Rentals Trend</h3>
          <div className="h-56 flex items-center justify-center glass-panel rounded-xl p-2">
            <BarChart title="" />
          </div>
        </div>
        <div className="glass-panel rounded-xl shadow-xl p-6">
          <h3 className="font-bold text-lg mb-2" style={{ color: '#60a5fa' }}>Sales Distribution</h3>
          <div className="h-56 flex items-center justify-center glass-panel rounded-xl p-2">
            <PieChart />
          </div>
        </div>
      </div>
      {/* Header: Profile & Settings - removed as per user request */}
      {/* Recent Activity */}
      <div className="glass-panel rounded-xl p-4 shadow-lg w-full min-w-0">
        <h3 className="font-bold text-lg mb-4" style={{ color: '#a78bfa' }}>Recent Activity</h3>
        <div className="glass-panel rounded-xl shadow divide-y divide-gray-200 overflow-x-auto w-full min-w-0">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 font-medium" style={{ color: activity.type === 'sale' ? '#facc15' : activity.type === 'rental' ? '#60a5fa' : activity.type === 'user' ? '#a78bfa' : '#22c55e' }}>
                {activity.type === 'sale' && <FaMoneyBill className="text-yellow-400" />}
                {activity.type === 'rental' && <FaCar className="text-blue-400" />}
                {activity.type === 'user' && <FaUsers className="text-purple-400" />}
                {activity.type === 'car' && <FaCar className="text-green-400" />}
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