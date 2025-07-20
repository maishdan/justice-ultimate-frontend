import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { BarChart, PieChart } from '../widgets/Charts';
import StatsOverview from '../widgets/StatsOverview';
import OffersCarousel from '../widgets/OffersCarousel';
import TransactionManager from '../widgets/TransactionManager';
import { supabase } from '../../../lib/supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function BusinessHubPanel() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  // Set immediate mock data for fast loading
  const mockSales = [
    { id: 1, date: '2024-06-01', customer_name: 'John Doe', car_name: 'Toyota Land Cruiser', amount: 25000000, status: 'Completed' },
    { id: 2, date: '2024-05-28', customer_name: 'Jane Smith', car_name: 'BMW X5', amount: 18500000, status: 'Completed' },
    { id: 3, date: '2024-05-25', customer_name: 'Mike Johnson', car_name: 'Mercedes S-Class', amount: 32000000, status: 'Pending' },
  ];

  const mockRentals = [
    { id: 1, date: '2024-06-01', customer_name: 'Alice Brown', car_name: 'Toyota Camry', amount: 50000, status: 'Completed' },
    { id: 2, date: '2024-05-30', customer_name: 'Bob Wilson', car_name: 'Honda Civic', amount: 45000, status: 'Completed' },
    { id: 3, date: '2024-05-29', customer_name: 'Carol Davis', car_name: 'Nissan Altima', amount: 48000, status: 'Active' },
  ];

  const mockInventory = [
    { id: 1, name: 'Toyota Land Cruiser', brand: 'Toyota', year: '2023', price: 25000000, availability: 'Available' },
    { id: 2, name: 'BMW X5', brand: 'BMW', year: '2022', price: 18500000, availability: 'Sold' },
    { id: 3, name: 'Mercedes S-Class', brand: 'Mercedes', year: '2023', price: 32000000, availability: 'Available' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    
    // Set immediate mock data for fast loading
    setSales(mockSales);
    setRentals(mockRentals);
    setInventory(mockInventory);
    setLoading(false);
    
    // Try to fetch real data in background with timeout
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 2000)
      );
      
      const dataPromise = Promise.all([
        fetchSales(),
        fetchRentals(),
        fetchInventory()
      ]);
      
      await Promise.race([dataPromise, timeoutPromise]);
    } catch (error) {
      console.log('Using mock data due to timeout or error:', error);
      // Keep mock data if real data fails
    }
  }

  async function fetchSales() {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setSales(data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }

  async function fetchRentals() {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setRentals(data);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  }

  async function fetchInventory() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }

  const tabList = [
    { key: 'overview', label: t('Overview') || 'Overview' },
    { key: 'sales', label: t('Sales') || 'Sales' },
    { key: 'rentals', label: t('Rentals') || 'Rentals' },
    { key: 'inventory', label: t('Inventory') || 'Inventory' },
  ];

  // Helper: format currency
  const formatCurrency = (amount: number, currency: string = 'KES') =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  // PDF export helpers
  const exportPDF = (rows: any[], filename: string, title: string) => {
    if (!rows.length) return;
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(18);
    doc.text(title, 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Justice Ultimate Automobiles', 105, 40, { align: 'center' });
    doc.text('Date: ' + new Date().toLocaleDateString(), 105, 48, { align: 'center' });
    
    (doc as any).autoTable({
      startY: 60,
      head: [[...Object.keys(rows[0])]],
      body: rows.map((r: any) => Object.values(r)),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });
    
    doc.setFontSize(10);
    doc.text('Digital Signature:', 10, doc.internal.pageSize.getHeight() - 30);
    doc.line(45, doc.internal.pageSize.getHeight() - 32, 120, doc.internal.pageSize.getHeight() - 32);
    doc.save(filename);
  };

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sales Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Total Sales</div>
          <div className="text-lg font-extrabold text-white mb-2 text-center">{formatCurrency(sales.reduce((sum, s) => sum + (s.amount || 0), 0))}</div>
          <Button className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1" onClick={() => setTab('sales')}>View Sales</Button>
        </Card>
        
        {/* Rentals Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">🚗</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Total Rentals</div>
          <div className="text-lg font-extrabold text-white mb-2 text-center">{formatCurrency(rentals.reduce((sum, r) => sum + (r.amount || 0), 0))}</div>
          <Button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1" onClick={() => setTab('rentals')}>View Rentals</Button>
        </Card>
        
        {/* Inventory Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Inventory</div>
          <div className="text-lg font-extrabold text-white mb-2 text-center">{inventory.length}</div>
          <Button className="mt-auto w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1" onClick={() => setTab('inventory')}>View Inventory</Button>
        </Card>
        
        {/* Trade-Ins Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">🔄</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Trade-Ins</div>
          <div className="text-xs text-gray-300 mb-2 text-center px-2">Manage trade-in requests</div>
          <Button className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1">Go to Trade-Ins</Button>
        </Card>
        
        {/* Approvals Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Approvals</div>
          <div className="text-xs text-gray-300 mb-2 text-center px-2">Approve or reject requests</div>
          <Button className="mt-auto w-full bg-pink-600 hover:bg-pink-700 text-white text-xs py-1">Go to Approvals</Button>
        </Card>
        
        {/* Quick Reports Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Quick Reports</div>
          <div className="text-xs text-gray-300 mb-2 text-center px-2">Generate reports</div>
          <Button className="mt-auto w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs py-1" onClick={() => exportPDF(sales, 'sales_report.pdf', 'Sales Report')}>Export PDF</Button>
        </Card>
        
        {/* Marketing Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">📣</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Marketing</div>
          <div className="text-xs text-gray-300 mb-2 text-center px-2">Send campaigns</div>
          <Button className="mt-auto w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1">Open Marketing</Button>
        </Card>
        
        {/* Notifications Tile */}
        <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl flex flex-col items-center p-4 hover:bg-gray-800/70 transition-all duration-300 h-48">
          <div className="text-3xl mb-2">🔔</div>
          <div className="text-sm font-bold mb-1 text-white text-center">Notifications</div>
          <div className="text-xs text-gray-300 mb-2 text-center px-2">Manage notifications</div>
          <Button className="mt-auto w-full bg-gray-600 hover:bg-gray-700 text-white text-xs py-1">View Notifications</Button>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6 font-serif">Business Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Sales Performance</h3>
            <div className="h-64">
              <BarChart title="Sales by Month" />
            </div>
          </Card>
          <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Rental Trends</h3>
            <div className="h-64">
              <PieChart />
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-white">
                <span>Total Sales:</span>
                <span className="font-bold">{formatCurrency(sales.reduce((sum, s) => sum + (s.amount || 0), 0))}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Total Rentals:</span>
                <span className="font-bold">{formatCurrency(rentals.reduce((sum, r) => sum + (r.amount || 0), 0))}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Total Inventory:</span>
                <span className="font-bold">{inventory.length}</span>
              </div>
            </div>
          </Card>
          
          <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Quick Stats</h3>
            <StatsOverview />
          </Card>
          
          <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Recent Offers</h3>
            <OffersCarousel />
          </Card>
        </div>
        
        <div className="mt-6">
          <Card className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Transaction Manager</h3>
            <TransactionManager />
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 rounded-xl shadow-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Sales Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Car</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-700">
                <td className="p-2">{sale.date}</td>
                <td className="p-2">{sale.customer_name}</td>
                <td className="p-2">{sale.car_name}</td>
                <td className="p-2">{formatCurrency(sale.amount)}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    sale.status === 'Completed' ? 'bg-green-600' : 'bg-yellow-600'
                  }`}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRentals = () => (
    <div className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 rounded-xl shadow-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Rentals Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Car</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id} className="border-b border-gray-700">
                <td className="p-2">{rental.date}</td>
                <td className="p-2">{rental.customer_name}</td>
                <td className="p-2">{rental.car_name}</td>
                <td className="p-2">{formatCurrency(rental.amount)}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    rental.status === 'Completed' ? 'bg-green-600' : 
                    rental.status === 'Active' ? 'bg-blue-600' : 'bg-yellow-600'
                  }`}>
                    {rental.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 rounded-xl shadow-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Inventory Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Brand</th>
              <th className="text-left p-2">Year</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Availability</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.brand}</td>
                <td className="p-2">{item.year}</td>
                <td className="p-2">{formatCurrency(item.price)}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.availability === 'Available' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {item.availability}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8" style={{ paddingTop: '64px' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="backdrop-blur-md bg-gray-800/40 border border-gray-400/20 rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 font-serif">{t('Business Hub') || 'Business Hub'}</h1>
          <p className="text-lg text-gray-300 mb-6 font-medium">{t('businessHubDesc') || 'Centralized control for sales, rentals, inventory, and real-time business insights.'}</p>
          
          {loading ? (
            <div className="text-center text-gray-300 text-lg font-semibold py-12">Loading data...</div>
          ) : error ? (
            <div className="text-center text-red-400 text-lg font-semibold py-12">{error}</div>
          ) : (
            <div>
              {/* Tab Navigation */}
              <div className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 rounded-lg p-1 mb-8">
                <div className="flex gap-2">
                  {tabList.map(tabItem => (
                    <button
                      key={tabItem.key}
                      onClick={() => setTab(tabItem.key)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        tab === tabItem.key 
                          ? 'bg-gray-700/60 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/40'
                      }`}
                    >
                      {tabItem.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {tab === 'overview' && renderOverview()}
                {tab === 'sales' && renderSales()}
                {tab === 'rentals' && renderRentals()}
                {tab === 'inventory' && renderInventory()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 