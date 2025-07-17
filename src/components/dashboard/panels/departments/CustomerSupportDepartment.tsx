import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiPlus, FiDownload, FiMessageCircle, FiBarChart2, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiClock, FiUser, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { FaHeadset, FaUser, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: string;
  priority: string;
  created_at: string;
  assigned_to: string;
  description?: string;
  category?: string;
  sla_deadline?: string;
  resolution_time?: string;
  customer_email?: string;
  customer_phone?: string;
};

const initialTicket: Omit<Ticket, 'id' | 'created_at'> = {
  subject: '',
  customer: '',
  status: 'Pending',
  priority: 'Medium',
  assigned_to: '',
  description: '',
  category: 'General',
  sla_deadline: '',
  resolution_time: '',
  customer_email: '',
  customer_phone: '',
};

const PRIORITIES = [
  { key: 'Low', color: 'text-green-600', bg: 'bg-green-100' },
  { key: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { key: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
  { key: 'Critical', color: 'text-red-600', bg: 'bg-red-100' },
];

const CATEGORIES = [
  'General', 'Technical', 'Billing', 'Sales', 'Rental', 'Complaint', 'Feature Request'
];

const CustomerSupportDepartment: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Partial<Ticket>>(initialTicket);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setTickets(data || []);
    setLoading(false);
  };

  const handleOpenModal = (ticket?: Ticket) => {
    setEditMode(!!ticket);
    setCurrentTicket(ticket ? { ...ticket } : initialTicket);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTicket(initialTicket);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCurrentTicket({ ...currentTicket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    if (editMode && currentTicket.id) {
      // Update
      const { error } = await supabase.from('support_tickets').update({
        subject: currentTicket.subject,
        customer: currentTicket.customer,
        status: currentTicket.status,
        priority: currentTicket.priority,
        assigned_to: currentTicket.assigned_to,
        description: currentTicket.description,
        category: currentTicket.category,
        sla_deadline: currentTicket.sla_deadline,
        resolution_time: currentTicket.resolution_time,
        customer_email: currentTicket.customer_email,
        customer_phone: currentTicket.customer_phone,
      }).eq('id', currentTicket.id);
      if (error) setFeedback('Error updating ticket: ' + error.message);
      else setFeedback('Ticket updated successfully!');
    } else {
      // Add
      const { error } = await supabase.from('support_tickets').insert([
        {
          subject: currentTicket.subject,
          customer: currentTicket.customer,
          status: currentTicket.status,
          priority: currentTicket.priority,
          assigned_to: currentTicket.assigned_to,
          description: currentTicket.description,
          category: currentTicket.category,
          sla_deadline: currentTicket.sla_deadline,
          resolution_time: currentTicket.resolution_time,
          customer_email: currentTicket.customer_email,
          customer_phone: currentTicket.customer_phone,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) setFeedback('Error adding ticket: ' + error.message);
      else setFeedback('Ticket added successfully!');
    }
    setLoading(false);
    handleCloseModal();
    fetchTickets();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('support_tickets').delete().eq('id', id);
    if (error) setFeedback('Error deleting ticket: ' + error.message);
    else setFeedback('Ticket deleted successfully!');
    setLoading(false);
    fetchTickets();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('support_tickets').update({ status: newStatus }).eq('id', id);
    if (error) setFeedback('Error updating status: ' + error.message);
    else setFeedback('Status updated successfully!');
    setLoading(false);
    fetchTickets();
  };

  const handleExport = (type: 'all' | 'pending' | 'resolved' | 'escalated') => {
    setExporting(true);
    let exportTickets = tickets;
    
    if (type === 'pending') {
      exportTickets = tickets.filter(t => t.status === 'Pending');
    } else if (type === 'resolved') {
      exportTickets = tickets.filter(t => t.status === 'Resolved');
    } else if (type === 'escalated') {
      exportTickets = tickets.filter(t => t.status === 'Escalated');
    }

    const csv = [
      ['Subject', 'Customer', 'Status', 'Priority', 'Category', 'Assigned To', 'Created', 'SLA Deadline'],
      ...exportTickets.map(t => [
        t.subject, t.customer, t.status, t.priority, t.category || '', t.assigned_to, t.created_at, t.sla_deadline || ''
      ]),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support-tickets-${type}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setExporting(false);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    const pri = PRIORITIES.find(p => p.key === priority);
    return pri ? pri.color : 'text-gray-600';
  };

  const getPriorityBg = (priority: string) => {
    const pri = PRIORITIES.find(p => p.key === priority);
    return pri ? pri.bg : 'bg-gray-100';
  };

  return (
    <div className="space-y-8">
      {/* Feedback */}
      {feedback && <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg">{feedback}</div>}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-pink-700"><FaHeadset /> Customer Support</h2>
          <p className="text-gray-500">Unified ticketing, chat, escalation, and analytics.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2" onClick={() => handleOpenModal()}><FiPlus /> New Ticket</button>
          <button className="btn-secondary flex items-center gap-2" onClick={() => handleExport('all')} disabled={exporting}><FiDownload /> Export</button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets by subject, customer, description..."
              className="input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
            <select className="input" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-pink-600 font-bold">{filteredTickets.length}</div>
          <div className="text-gray-500">Total Tickets</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-green-600 font-bold">{filteredTickets.filter(t => t.status === 'Resolved').length}</div>
          <div className="text-gray-500">Resolved</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-yellow-500 font-bold">{filteredTickets.filter(t => t.status === 'Pending').length}</div>
          <div className="text-gray-500">Pending</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-red-600 font-bold">{filteredTickets.filter(t => t.status === 'Escalated').length}</div>
          <div className="text-gray-500">Escalated</div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Ticket</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Status</th>
              <th className="py-2">Priority</th>
              <th className="py-2">Category</th>
              <th className="py-2">Assigned</th>
              <th className="py-2">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={8} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : filteredTickets.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8">No tickets found.</td></tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr key={ticket.id} className="border-b hover:bg-pink-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <FiMessageCircle className="text-pink-600" />
                      <div>
                        <div className="font-bold">{ticket.subject}</div>
                        {ticket.description && <div className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <div>
                        <div>{ticket.customer}</div>
                        {ticket.customer_email && <div className="text-xs text-gray-500">{ticket.customer_email}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      ticket.status === 'Escalated' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityBg(ticket.priority)} ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {ticket.category || 'General'}
                    </span>
                  </td>
                  <td className="py-2">{ticket.assigned_to}</td>
                  <td className="py-2">{new Date(ticket.created_at).toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline" title="View" onClick={() => handleOpenModal(ticket)}><FiEye /></button>
                    <button className="btn-xs btn-outline" title="Edit" onClick={() => handleOpenModal(ticket)}><FiEdit /></button>
                    <button className="btn-xs btn-outline" title="Chat" onClick={() => {setSelectedTicket(ticket); setChatModalOpen(true);}}><FaWhatsapp /></button>
                    <button className="btn-xs btn-danger" title="Delete" onClick={() => handleDelete(ticket.id)}><FiTrash2 /></button>
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
            <h3 className="text-xl font-bold mb-2 text-pink-700">{editMode ? 'Edit Ticket' : 'New Ticket'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input className="input w-full" name="subject" placeholder="Subject" value={currentTicket.subject || ''} onChange={handleChange} required />
                <input className="input w-full" name="customer" placeholder="Customer Name" value={currentTicket.customer || ''} onChange={handleChange} required />
                <input className="input w-full" name="customer_email" placeholder="Customer Email" value={currentTicket.customer_email || ''} onChange={handleChange} />
                <input className="input w-full" name="customer_phone" placeholder="Customer Phone" value={currentTicket.customer_phone || ''} onChange={handleChange} />
              </div>
              
              <div className="space-y-2">
                <select className="input w-full" name="priority" value={currentTicket.priority || 'Medium'} onChange={handleChange} required>
                  {PRIORITIES.map(pri => (
                    <option key={pri.key} value={pri.key}>{pri.key}</option>
                  ))}
                </select>
                <select className="input w-full" name="status" value={currentTicket.status || 'Pending'} onChange={handleChange} required>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
                <select className="input w-full" name="category" value={currentTicket.category || 'General'} onChange={handleChange} required>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input className="input w-full" name="assigned_to" placeholder="Assign To" value={currentTicket.assigned_to || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <textarea className="input w-full" name="description" placeholder="Description" value={currentTicket.description || ''} onChange={handleChange} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input w-full" name="sla_deadline" type="datetime-local" placeholder="SLA Deadline" value={currentTicket.sla_deadline || ''} onChange={handleChange} />
              <input className="input w-full" name="resolution_time" placeholder="Resolution Time" value={currentTicket.resolution_time || ''} onChange={handleChange} />
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{editMode ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Modal */}
      {chatModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-4xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={() => setChatModalOpen(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-pink-700">Chat with {selectedTicket.customer}</h3>
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="font-bold">Ticket: {selectedTicket.subject}</div>
                <div className="text-sm text-gray-600">{selectedTicket.description}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Chat interface will appear here...</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-pink-700"><FiBarChart2 /> Support Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-pink-100 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">
          SLA tracking, response time analytics, customer satisfaction, and more will appear here.
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportDepartment; 