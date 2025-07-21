import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { supabase } from '../lib/supabaseClient';

const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#fb7185', '#818cf8'];

export default function BusinessHub() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSales() {
      setLoading(true);
      // Fetch all cars marked as sold
      const { data, error } = await supabase.from('cars').select('id, name, price, sold_out_date, is_sold, cost, brand, category');
      if (!error && data) {
        const soldCars = data.filter((car: any) => car.is_sold && car.sold_out_date);
        setSales(soldCars.map((car: any) => ({
          id: car.id,
          name: car.name || 'Car',
          price: car.price || 0,
          cost: car.cost || 0,
          date: car.sold_out_date,
          brand: car.brand || 'Other',
          category: car.category || 'Other',
        })));
        // Calculate gross profit/loss
        let totalProfit = 0;
        let totalLoss = 0;
        soldCars.forEach((car: any) => {
          const profit = (car.price || 0) - (car.cost || 0);
          if (profit >= 0) totalProfit += profit;
          else totalLoss += Math.abs(profit);
        });
        setProfit(totalProfit);
        setLoss(totalLoss);
        // Business suggestions
        const slowSellers = soldCars.filter((car: any) => (car.price || 0) < (car.cost || 0));
        const bestSellers = soldCars.filter((car: any) => (car.price || 0) > (car.cost || 0));
        const suggestionsArr = [];
        if (slowSellers.length > 0) suggestionsArr.push('Consider reviewing pricing for slow-selling cars.');
        if (bestSellers.length > 0) suggestionsArr.push('Stock more of your best-selling models.');
        if (totalProfit > totalLoss) suggestionsArr.push('Your business is profitable. Keep up the good work!');
        else suggestionsArr.push('Review your cost structure to improve profitability.');
        setSuggestions(suggestionsArr);
      }
      setLoading(false);
    }
    fetchSales();
  }, []);

  // Prepare chart data
  const salesByCar = sales.map(s => ({ name: s.name, sales: s.price }));
  const salesByDate = sales.reduce((acc, s) => {
    const date = s.date ? s.date.slice(0, 10) : 'Unknown';
    acc[date] = (acc[date] || 0) + s.price;
    return acc;
  }, {} as Record<string, number>);
  const salesByDateArr = Object.entries(salesByDate).map(([date, sales]) => ({ date, sales }));
  const salesByBrand = sales.reduce((acc, s) => {
    acc[s.brand] = (acc[s.brand] || 0) + s.price;
    return acc;
  }, {} as Record<string, number>);
  const salesByBrandArr = Object.entries(salesByBrand).map(([brand, sales]) => ({ name: brand, value: sales }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-black py-8 px-2 md:px-8">
      <div className="container mx-auto px-2 md:px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center drop-shadow">Business Hub</h1>
        {loading ? (
          <div className="text-center text-white">Loading business analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
                <h2 className="text-xl font-bold text-green-200 mb-4 drop-shadow">Gross Profit</h2>
                <div className="text-3xl font-extrabold text-green-400 mb-2">Ksh {profit.toLocaleString()}</div>
                <h2 className="text-xl font-bold text-red-200 mb-4 drop-shadow">Gross Loss</h2>
                <div className="text-3xl font-extrabold text-red-400 mb-2">Ksh {loss.toLocaleString()}</div>
              </div>
              <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
                <h2 className="text-xl font-bold text-blue-200 mb-4 drop-shadow">Business Suggestions</h2>
                <ul className="list-disc pl-6 text-white/90">
                  {suggestions.map((s, i) => (
                    <li key={i} className="mb-2">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
                <h2 className="text-xl font-bold text-yellow-200 mb-4 drop-shadow">Sales by Car (Bar Chart)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByCar}>
                    <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#fff' }} />
                    <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ background: '#222', color: '#fff' }} />
                    <Bar dataKey="sales" fill="#fbbf24">
                      {salesByCar.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
                <h2 className="text-xl font-bold text-blue-200 mb-4 drop-shadow">Sales Trend (Line Chart)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesByDateArr}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#fff" tick={{ fill: '#fff' }} />
                    <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                    <Tooltip contentStyle={{ background: '#222', color: '#fff' }} />
                    <Line type="monotone" dataKey="sales" stroke="#60a5fa" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
              <h2 className="text-xl font-bold text-pink-200 mb-4 drop-shadow">Sales by Brand (Pie Chart)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByBrandArr}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#f472b6"
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    {salesByBrandArr.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ background: '#222', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-gradient-to-br from-blue-700/80 via-blue-900/70 to-blue-950/90 ring-2 ring-blue-400/20 hover:ring-blue-300/40 transition-all duration-300" style={{boxShadow:'0 8px 32px 0 rgba(0, 60, 255, 0.25)'}}>
              <h2 className="text-xl font-bold text-yellow-200 mb-4 drop-shadow">Sales Records</h2>
              <table className="min-w-full table-auto text-white">
                <thead>
                  <tr>
                    <th className="p-2">Car</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Cost</th>
                    <th className="p-2">Profit/Loss</th>
                    <th className="p-2">Date Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s, i) => (
                    <tr key={s.id} className="border-t border-white/10">
                      <td className="p-2 font-bold">{s.name}</td>
                      <td className="p-2">Ksh {s.price?.toLocaleString()}</td>
                      <td className="p-2">Ksh {s.cost?.toLocaleString()}</td>
                      <td className={`p-2 font-bold ${s.price - s.cost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {s.price - s.cost >= 0 ? '+' : '-'}Ksh {Math.abs(s.price - s.cost).toLocaleString()}
                      </td>
                      <td className="p-2">{s.date ? new Date(s.date).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 