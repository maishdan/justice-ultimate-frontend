import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiPlus, FiDownload, FiBarChart2, FiBox, FiEdit, FiTrash2, FiEye, FiUpload, FiSearch, FiFilter, FiImage, FiPackage, FiTool, FiZap, FiHash } from 'react-icons/fi';
import { FaBoxes, FaCar, FaCog, FaHeadphones, FaOilCan } from 'react-icons/fa';

type InventoryItem = {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unit_price: number;
  currency: string;
  location: string;
  status: string;
  supplier?: string;
  serial_number?: string;
  warranty_period?: string;
  date_added: string;
  last_updated: string;
  images?: string[];
  tags?: string[];
};

const initialItem: Omit<InventoryItem, 'id' | 'date_added' | 'last_updated'> = {
  name: '',
  description: '',
  category: 'Parts',
  quantity: 0,
  unit_price: 0,
  currency: 'KES',
  location: '',
  status: 'Available',
  supplier: '',
  serial_number: '',
  warranty_period: '',
  images: [],
  tags: [],
};

const CATEGORIES = [
  { key: 'Parts', icon: <FaCog />, color: 'text-blue-600' },
  { key: 'Accessories', icon: <FaHeadphones />, color: 'text-purple-600' },
  { key: 'Consumables', icon: <FaOilCan />, color: 'text-green-600' },
  { key: 'Tools', icon: <FiTool />, color: 'text-orange-600' },
  { key: 'Electronics', icon: <FiZap />, color: 'text-red-600' },
];

const InventoryDepartment: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InventoryItem>>(initialItem);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [auditLogsOpen, setAuditLogsOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('inventory').select('*').order('last_updated', { ascending: false });
    if (error) setError(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const handleOpenModal = (item?: InventoryItem) => {
    setEditMode(!!item);
    setCurrentItem(item ? { ...item } : initialItem);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentItem(initialItem);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    if (editMode && currentItem.id) {
      // Update
      const { error } = await supabase.from('inventory').update({
        name: currentItem.name,
        description: currentItem.description,
        category: currentItem.category,
        quantity: currentItem.quantity,
        unit_price: currentItem.unit_price,
        currency: currentItem.currency,
        location: currentItem.location,
        status: currentItem.status,
        supplier: currentItem.supplier,
        serial_number: currentItem.serial_number,
        warranty_period: currentItem.warranty_period,
        images: currentItem.images,
        tags: currentItem.tags,
        last_updated: new Date().toISOString(),
      }).eq('id', currentItem.id);
      if (error) setFeedback('Error updating item: ' + error.message);
      else setFeedback('Item updated successfully!');
    } else {
      // Add
      const { error } = await supabase.from('inventory').insert([
        {
          name: currentItem.name,
          description: currentItem.description,
          category: currentItem.category,
          quantity: currentItem.quantity,
          unit_price: currentItem.unit_price,
          currency: currentItem.currency,
          location: currentItem.location,
          status: currentItem.status,
          supplier: currentItem.supplier,
          serial_number: currentItem.serial_number,
          warranty_period: currentItem.warranty_period,
          images: currentItem.images,
          tags: currentItem.tags,
          date_added: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        },
      ]);
      if (error) setFeedback('Error adding item: ' + error.message);
      else setFeedback('Item added successfully!');
    }
    setLoading(false);
    handleCloseModal();
    fetchInventory();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) setFeedback('Error deleting item: ' + error.message);
    else setFeedback('Item deleted successfully!');
    setLoading(false);
    fetchInventory();
  };

  const handleExport = (type: 'all' | 'low-stock' | 'category') => {
    setExporting(true);
    let exportItems = items;
    
    if (type === 'low-stock') {
      exportItems = items.filter(item => item.status === 'Low Stock');
    } else if (type === 'category' && activeCategory !== 'All') {
      exportItems = items.filter(item => item.category === activeCategory);
    }

    const csv = [
      ['Name', 'Description', 'Category', 'Quantity', 'Unit Price', 'Currency', 'Location', 'Status', 'Supplier', 'Serial Number', 'Warranty Period', 'Date Added', 'Last Updated'],
      ...exportItems.map(i => [
        i.name, i.description || '', i.category, i.quantity, i.unit_price, i.currency, i.location, i.status, 
        i.supplier || '', i.serial_number || '', i.warranty_period || '', i.date_added, i.last_updated
      ]),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${type}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setExporting(false);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.key === category);
    return cat ? cat.icon : <FiBox />;
  };

  const getCategoryColor = (category: string) => {
    const cat = CATEGORIES.find(c => c.key === category);
    return cat ? cat.color : 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Feedback */}
      {feedback && <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg">{feedback}</div>}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-700"><FaBoxes /> Inventory Management</h2>
          <p className="text-gray-500">Professional Parts, Accessories, Consumables, Tools & Electronics Management</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2" onClick={() => handleOpenModal()}><FiPlus /> Add Item</button>
          <button className="btn-secondary flex items-center gap-2" onClick={() => setBulkUploadOpen(true)}><FiUpload /> Bulk Upload</button>
          <button className="btn-secondary flex items-center gap-2" onClick={() => setAuditLogsOpen(true)}><FiBarChart2 /> Audit Logs</button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, description, supplier..."
              className="input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline flex items-center gap-2" onClick={() => handleExport('all')} disabled={exporting}>
              <FiDownload /> Export All
            </button>
            <button className="btn-outline flex items-center gap-2" onClick={() => handleExport('low-stock')} disabled={exporting}>
              <FiDownload /> Low Stock
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${activeCategory === 'All' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveCategory('All')}
          >
            All Categories
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category.key}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeCategory === category.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.icon} {category.key}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-orange-600 font-bold">{filteredItems.length}</div>
          <div className="text-gray-500">Total Items</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-blue-600 font-bold">{[...new Set(filteredItems.map(i => i.category))].length}</div>
          <div className="text-gray-500">Categories</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-yellow-500 font-bold">{filteredItems.filter(i => i.status === 'Low Stock').length}</div>
          <div className="text-gray-500">Low Stock</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-green-600 font-bold">
            {filteredItems.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0).toLocaleString()}
          </div>
          <div className="text-gray-500">Total Value</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Item</th>
              <th className="py-2">Category</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Unit Price</th>
              <th className="py-2">Status</th>
              <th className="py-2">Location</th>
              <th className="py-2">Supplier</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={8} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8">No items found.</td></tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-orange-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{item.name}</div>
                        {item.serial_number && <div className="text-xs text-gray-500">SN: {item.serial_number}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{item.unit_price.toLocaleString()} {item.currency}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 
                      item.status === 'Available' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2">{item.location}</td>
                  <td className="py-2">{item.supplier}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline" title="View" onClick={() => handleOpenModal(item)}><FiEye /></button>
                    <button className="btn-xs btn-outline" title="Edit" onClick={() => handleOpenModal(item)}><FiEdit /></button>
                    <button className="btn-xs btn-outline" title="QR Code"><FiHash /></button>
                    <button className="btn-xs btn-danger" title="Delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Modal for Add/Edit/View */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-2xl space-y-4 relative animate-fade-in overflow-y-auto max-h-[90vh]" onSubmit={handleSubmit}>
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={handleCloseModal}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-orange-700">{editMode ? 'Edit Item' : 'Add Item'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input className="input w-full" name="name" placeholder="Item Name" value={currentItem.name || ''} onChange={handleChange} required />
                <textarea className="input w-full" name="description" placeholder="Description" value={currentItem.description || ''} onChange={handleChange} rows={3} />
                <select className="input w-full" name="category" value={currentItem.category || 'Parts'} onChange={handleChange} required>
                  {CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.key}</option>
                  ))}
                </select>
                <input className="input w-full" name="quantity" type="number" placeholder="Quantity" value={currentItem.quantity || ''} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <input className="input w-full" name="unit_price" type="number" placeholder="Unit Price" value={currentItem.unit_price || ''} onChange={handleChange} required />
                <select className="input w-full" name="currency" value={currentItem.currency || 'KES'} onChange={handleChange} required>
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <select className="input w-full" name="status" value={currentItem.status || 'Available'} onChange={handleChange} required>
                  <option value="Available">Available</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
                <input className="input w-full" name="location" placeholder="Location" value={currentItem.location || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input w-full" name="supplier" placeholder="Supplier" value={currentItem.supplier || ''} onChange={handleChange} />
              <input className="input w-full" name="serial_number" placeholder="Serial Number" value={currentItem.serial_number || ''} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input w-full" name="warranty_period" placeholder="Warranty Period (e.g., 6 months)" value={currentItem.warranty_period || ''} onChange={handleChange} />
              <input className="input w-full" name="tags" placeholder="Tags (comma-separated)" value={currentItem.tags?.join(', ') || ''} onChange={(e) => setCurrentItem({...currentItem, tags: e.target.value.split(',').map(t => t.trim())})} />
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{editMode ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {bulkUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4 relative">
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={() => setBulkUploadOpen(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-orange-700">Bulk Upload</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">Drag and drop CSV file here or click to browse</p>
                <input type="file" accept=".csv" className="hidden" />
              </div>
              <button className="btn-primary w-full">Upload File</button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {auditLogsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={() => setAuditLogsOpen(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-orange-700">Audit Logs</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Recent inventory changes will appear here...</div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-orange-700"><FiBarChart2 /> Advanced Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">
          3D charts, inventory turnover, supplier analytics, barcode/QR integration, and more will appear here.
        </div>
      </div>
    </div>
  );
};

export default InventoryDepartment; 