import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiDownload, FiPlus, FiBarChart2, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { FaCar, FaCrown } from 'react-icons/fa';

// Example Sale type (adjust fields as per your Supabase schema)
type Sale = {
  id: string;
  car_name: string;
  customer_name: string;
  date: string;
  amount: number;
  status: string;
  staff: string;
};

const initialSale: Omit<Sale, 'id'> = {
  car_name: '',
  customer_name: '',
  date: '',
  amount: 0,
  status: 'Pending',
  staff: '',
};

const SalesDepartment: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSale, setCurrentSale] = useState<Partial<Sale>>(initialSale);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('sales').select('*').order('date', { ascending: false });
    if (error) setError(error.message);
    else setSales(data || []);
    setLoading(false);
  };

  const handleOpenModal = (sale?: Sale) => {
    setEditMode(!!sale);
    setCurrentSale(sale ? { ...sale } : initialSale);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentSale(initialSale);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentSale({ ...currentSale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    if (editMode && currentSale.id) {
      // Update
      const { error } = await supabase.from('sales').update({
        car_name: currentSale.car_name,
        customer_name: currentSale.customer_name,
        date: currentSale.date,
        amount: currentSale.amount,
        status: currentSale.status,
        staff: currentSale.staff,
      }).eq('id', currentSale.id);
      if (error) setFeedback('Error updating sale: ' + error.message);
      else setFeedback('Sale updated successfully!');
    } else {
      // Add
      const { error } = await supabase.from('sales').insert([
        {
          car_name: currentSale.car_name,
          customer_name: currentSale.customer_name,
          date: currentSale.date,
          amount: currentSale.amount,
          status: currentSale.status,
          staff: currentSale.staff,
        },
      ]);
      if (error) setFeedback('Error adding sale: ' + error.message);
      else setFeedback('Sale added successfully!');
    }
    setLoading(false);
    handleCloseModal();
    fetchSales();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) setFeedback('Error deleting sale: ' + error.message);
    else setFeedback('Sale deleted successfully!');
    setLoading(false);
    fetchSales();
  };

  const handleExport = () => {
    setExporting(true);
    const csv = [
      ['Car', 'Customer', 'Date', 'Amount', 'Status', 'Staff'],
      ...sales.map(s => [s.car_name, s.customer_name, s.date, s.amount, s.status, s.staff]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setExporting(false);
  };

  return (
    <div className="space-y-8">
      {/* Feedback */}
      {feedback && <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg">{feedback}</div>}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700"><FaCar /> Sales Department</h2>
          <p className="text-gray-500">Manage all car sales, contracts, analytics, and more.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2" onClick={() => handleOpenModal()}><FiPlus /> Add Sale</button>
          <button className="btn-secondary flex items-center gap-2" onClick={handleExport} disabled={exporting}><FiDownload /> Export CSV</button>
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-blue-600 font-bold">{sales.length}</div>
          <div className="text-gray-500">Total Sales</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-green-600 font-bold">{sales.filter(s => s.status === 'Completed').length}</div>
          <div className="text-gray-500">Completed</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-yellow-500 font-bold">{sales.filter(s => s.status === 'Pending').length}</div>
          <div className="text-gray-500">Pending</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-purple-600 font-bold">{sales.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}</div>
          <div className="text-gray-500">Total Revenue</div>
        </div>
      </div>
      {/* Sales Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Car</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Staff</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">No sales found.</td></tr>
            ) : (
              sales.map(sale => (
                <tr key={sale.id} className="border-b hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FaCar className="text-blue-600" /> {sale.car_name}</td>
                  <td className="py-2">{sale.customer_name}</td>
                  <td className="py-2">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-2">{sale.amount.toLocaleString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${sale.status === 'Completed' ? 'bg-green-100 text-green-700' : sale.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{sale.status}</span>
                  </td>
                  <td className="py-2">{sale.staff}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline" title="View" onClick={() => handleOpenModal(sale)}><FiEye /></button>
                    <button className="btn-xs btn-outline" title="Edit" onClick={() => handleOpenModal(sale)}><FiEdit /></button>
                    <button className="btn-xs btn-danger" title="Delete" onClick={() => handleDelete(sale.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit/View */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4 relative animate-fade-in" onSubmit={handleSubmit}>
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={handleCloseModal}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-blue-700">{editMode ? 'Edit Sale' : 'Add Sale'}</h3>
            <div className="space-y-2">
              <input className="input w-full" name="car_name" placeholder="Car Name" value={currentSale.car_name || ''} onChange={handleChange} required />
              <input className="input w-full" name="customer_name" placeholder="Customer Name" value={currentSale.customer_name || ''} onChange={handleChange} required />
              <input className="input w-full" name="date" type="date" value={currentSale.date ? currentSale.date.substring(0, 10) : ''} onChange={handleChange} required />
              <input className="input w-full" name="amount" type="number" placeholder="Amount" value={currentSale.amount || ''} onChange={handleChange} required />
              <select className="input w-full" name="status" value={currentSale.status || 'Pending'} onChange={handleChange} required>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <input className="input w-full" name="staff" placeholder="Staff" value={currentSale.staff || ''} onChange={handleChange} required />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{editMode ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Placeholder for advanced features: charts, contracts, receipts, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-blue-700"><FiBarChart2 /> Sales Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">3D charts, sales funnel, contracts, receipts, and more will appear here.</div>
      </div>
    </div>
  );
};

export default SalesDepartment; 