import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from '../lib/supabaseClient';

const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#fb7185', '#818cf8'];

export default function Analytics() {
  const [carViews, setCarViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchViews() {
      setLoading(true);
      const { data, error } = await supabase.from('cars').select('id, name, view_count');
      if (!error && data) {
        setCarViews(data.map((car: any) => ({
          name: car.name || 'Car',
          views: car.view_count || 0,
        })));
      }
      setLoading(false);
    }
    fetchViews();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-black py-8 px-2 md:px-8">
      <div className="container mx-auto px-2 md:px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center drop-shadow">Car Views Analytics</h1>
        {loading ? (
          <div className="text-center text-white">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
              <h2 className="text-xl font-bold text-blue-200 mb-4 drop-shadow">Views per Car (Bar Chart)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carViews}>
                  <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#fff' }} />
                  <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                  <Tooltip contentStyle={{ background: '#222', color: '#fff' }} />
                  <Bar dataKey="views" fill="#34d399">
                    {carViews.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
              <h2 className="text-xl font-bold text-green-200 mb-4 drop-shadow">Views Distribution (Pie Chart)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={carViews}
                    dataKey="views"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#60a5fa"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {carViews.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ background: '#222', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 