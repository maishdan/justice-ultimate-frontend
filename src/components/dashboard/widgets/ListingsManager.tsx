import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const initialCar = {
  name: '',
  brand: '',
  price: '',
  image_url: '',
};

const ListingsManager = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialCar);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setCars(data || []);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAddOrEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      // Edit car
      const { error } = await supabase.from('cars').update(form).eq('id', editingId);
      if (error) setError(error.message);
      else {
        setForm(initialCar);
        setEditingId(null);
        fetchCars();
      }
    } else {
      // Add car
      const { error } = await supabase.from('cars').insert([{ ...form }]);
      if (error) setError(error.message);
      else {
        setForm(initialCar);
        fetchCars();
      }
    }
    setSaving(false);
  }

  function handleEdit(car: any) {
    setForm({ name: car.name, brand: car.brand, price: car.price, image_url: car.image_url });
    setEditingId(car.id);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this car?')) return;
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchCars();
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Listings Management</h2>
      <form onSubmit={handleAddOrEdit} className="space-y-2 mb-6">
        <div className="flex gap-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Car Name"
            className="p-2 rounded border w-1/4"
            required
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="p-2 rounded border w-1/4"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="p-2 rounded border w-1/4"
            required
          />
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-2 rounded border w-1/4"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>
          {editingId ? 'Update Car' : 'Add Car'}
        </button>
        {editingId && (
          <button type="button" className="ml-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setForm(initialCar); setEditingId(null); }}>
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading cars...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="p-2">Name</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Price</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id} className="border-b">
                <td className="p-2">{car.name}</td>
                <td className="p-2">{car.brand}</td>
                <td className="p-2">{car.price}</td>
                <td className="p-2">
                  {car.image_url && <img src={car.image_url} alt={car.name} className="w-16 h-10 object-cover rounded" />}
                </td>
                <td className="p-2">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(car)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(car.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListingsManager;