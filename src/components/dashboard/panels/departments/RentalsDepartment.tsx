import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiPlus, FiDownload, FiCalendar, FiBarChart2, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { FaKey, FaCar } from 'react-icons/fa';

type Rental = {
  id: string;
  vehicle: string;
  customer: string;
  start_date: string;
  end_date: string;
  status: string;
  amount: number;
};

const initialRental: Omit<Rental, 'id'> = {
  vehicle: '',
  customer: '',
  start_date: '',
  end_date: '',
  status: 'Rented',
  amount: 0,
};

const RentalsDepartment: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRental, setCurrentRental] = useState<Partial<Rental>>(initialRental);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('rentals').select('*').order('start_date', { ascending: false });
    if (error) setError(error.message);
    else setRentals(data || []);
    setLoading(false);
  };

  const handleOpenModal = (rental?: Rental) => {
    setEditMode(!!rental);
    setCurrentRental(rental ? { ...rental } : initialRental);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentRental(initialRental);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentRental({ ...currentRental, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    if (editMode && currentRental.id) {
      // Update
      const { error } = await supabase.from('rentals').update({
        vehicle: currentRental.vehicle,
        customer: currentRental.customer,
        start_date: currentRental.start_date,
        end_date: currentRental.end_date,
        status: currentRental.status,
        amount: currentRental.amount,
      }).eq('id', currentRental.id);
      if (error) setFeedback('Error updating rental: ' + error.message);
      else setFeedback('Rental updated successfully!');
    } else {
      // Add
      const { error } = await supabase.from('rentals').insert([
        {
          vehicle: currentRental.vehicle,
          customer: currentRental.customer,
          start_date: currentRental.start_date,
          end_date: currentRental.end_date,
          status: currentRental.status,
          amount: currentRental.amount,
        },
      ]);
      if (error) setFeedback('Error adding rental: ' + error.message);
      else setFeedback('Rental added successfully!');
    }
    setLoading(false);
    handleCloseModal();
    fetchRentals();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this rental?')) return;
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('rentals').delete().eq('id', id);
    if (error) setFeedback('Error deleting rental: ' + error.message);
    else setFeedback('Rental deleted successfully!');
    setLoading(false);
    fetchRentals();
  };

  const handleExport = () => {
    setExporting(true);
    const csv = [
      ['Vehicle', 'Customer', 'Start Date', 'End Date', 'Status', 'Amount'],
      ...rentals.map(r => [r.vehicle, r.customer, r.start_date, r.end_date, r.status, r.amount]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rentals.csv';
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
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-700"><FaKey /> Rentals Department</h2>
          <p className="text-gray-500">Manage all fleet rentals, bookings, contracts, and analytics.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2" onClick={() => handleOpenModal()}><FiPlus /> Add Rental</button>
          <button className="btn-secondary flex items-center gap-2" onClick={handleExport} disabled={exporting}><FiDownload /> Export Logs</button>
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-green-600 font-bold">{rentals.length}</div>
          <div className="text-gray-500">Active Rentals</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-blue-600 font-bold">{[...new Set(rentals.map(r => r.vehicle))].length}</div>
          <div className="text-gray-500">Fleet Size</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-yellow-500 font-bold">{rentals.filter(r => r.status === 'Overdue').length}</div>
          <div className="text-gray-500">Overdue</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-purple-600 font-bold">{rentals.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}</div>
          <div className="text-gray-500">Total Revenue</div>
        </div>
      </div>
      {/* Rentals Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Vehicle</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Start Date</th>
              <th className="py-2">End Date</th>
              <th className="py-2">Status</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : rentals.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">No rentals found.</td></tr>
            ) : (
              rentals.map(rental => (
                <tr key={rental.id} className="border-b hover:bg-green-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FaCar className="text-green-600" /> {rental.vehicle}</td>
                  <td className="py-2">{rental.customer}</td>
                  <td className="py-2">{new Date(rental.start_date).toLocaleDateString()}</td>
                  <td className="py-2">{new Date(rental.end_date).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${rental.status === 'Returned' ? 'bg-blue-100 text-blue-700' : rental.status === 'Overdue' ? 'bg-yellow-100 text-yellow-700' : rental.status === 'Rented' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{rental.status}</span>
                  </td>
                  <td className="py-2">{rental.amount?.toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline" title="View" onClick={() => handleOpenModal(rental)}><FiEye /></button>
                    <button className="btn-xs btn-outline" title="Edit" onClick={() => handleOpenModal(rental)}><FiEdit /></button>
                    <button className="btn-xs btn-danger" title="Delete" onClick={() => handleDelete(rental.id)}><FiTrash2 /></button>
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
            <h3 className="text-xl font-bold mb-2 text-green-700">{editMode ? 'Edit Rental' : 'Add Rental'}</h3>
            <div className="space-y-2">
              <input className="input w-full" name="vehicle" placeholder="Vehicle" value={currentRental.vehicle || ''} onChange={handleChange} required />
              <input className="input w-full" name="customer" placeholder="Customer" value={currentRental.customer || ''} onChange={handleChange} required />
              <input className="input w-full" name="start_date" type="date" value={currentRental.start_date ? currentRental.start_date.substring(0, 10) : ''} onChange={handleChange} required />
              <input className="input w-full" name="end_date" type="date" value={currentRental.end_date ? currentRental.end_date.substring(0, 10) : ''} onChange={handleChange} required />
              <select className="input w-full" name="status" value={currentRental.status || 'Rented'} onChange={handleChange} required>
                <option value="Rented">Rented</option>
                <option value="Returned">Returned</option>
                <option value="Overdue">Overdue</option>
              </select>
              <input className="input w-full" name="amount" type="number" placeholder="Amount" value={currentRental.amount || ''} onChange={handleChange} required />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{editMode ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Placeholder for advanced features: calendar, analytics, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-green-700"><FiBarChart2 /> Rentals Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">Calendar, booking system, contracts, and more will appear here.</div>
      </div>
    </div>
  );
};

export default RentalsDepartment; 