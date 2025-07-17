import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiPlus, FiDownload, FiMessageCircle, FiBarChart2, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiClock, FiUser, FiAlertTriangle, FiCheckCircle, FiStar, FiCalendar, FiTool, FiShield, FiAward, FiHeadphones, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaHeadset, FaUser, FaWhatsapp, FaEnvelope, FaTools, FaCar, FaClipboardCheck, FaHandshake, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type CustomerService = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_id: string;
  service_type: string;
  priority: string;
  status: string;
  created_at: string;
  assigned_to: string;
  description?: string;
  category?: string;
  sla_deadline?: string;
  resolution_time?: string;
  satisfaction_rating?: number;
  follow_up_date?: string;
  warranty_claim?: boolean;
  service_appointment?: string;
  technician_notes?: string;
  customer_feedback?: string;
  escalation_level?: number;
};

type ServiceAppointment = {
  id: string;
  customer_name: string;
  vehicle_model: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  technician_assigned: string;
  estimated_duration: string;
  special_requirements?: string;
};

type WarrantyClaim = {
  id: string;
  customer_name: string;
  vehicle_id: string;
  claim_type: string;
  issue_description: string;
  claim_date: string;
  status: string;
  approved_by?: string;
  approved_date?: string;
  claim_amount?: number;
  resolution_notes?: string;
};

const initialCustomerService: Omit<CustomerService, 'id' | 'created_at'> = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  vehicle_id: '',
  service_type: '',
  priority: 'Medium',
  status: 'Open',
  assigned_to: '',
  description: '',
  category: 'General',
  sla_deadline: '',
  resolution_time: '',
  satisfaction_rating: 0,
  follow_up_date: '',
  warranty_claim: false,
  service_appointment: '',
  technician_notes: '',
  customer_feedback: '',
  escalation_level: 1,
};

const PRIORITIES = [
  { key: 'Low', color: 'text-green-600', bg: 'bg-green-100' },
  { key: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { key: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
  { key: 'Critical', color: 'text-red-600', bg: 'bg-red-100' },
];

const SERVICE_TYPES = [
  'General Inquiry', 'Technical Support', 'Warranty Claim', 'Service Appointment', 
  'Parts Inquiry', 'Billing Issue', 'Complaint', 'Feedback', 'Emergency Service'
];

const CATEGORIES = [
  'General', 'Technical', 'Billing', 'Sales', 'Service', 'Warranty', 'Parts', 'Emergency'
];

const CustomerServiceDepartment: React.FC = () => {
  const [customerServices, setCustomerServices] = useState<CustomerService[]>([]);
  const [appointments, setAppointments] = useState<ServiceAppointment[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<CustomerService>>(initialCustomerService);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('services');
  const [satisfactionModalOpen, setSatisfactionModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<CustomerService | null>(null);

  // Automation: overdue/escalated detection
  const now = new Date();
  const isOverdue = (sla: string | undefined, status: string) => {
    if (!sla || status === 'Resolved') return false;
    const deadline = new Date(sla);
    return deadline < now;
  };
  const isEscalated = (level: number | undefined) => level && level > 1;

  useEffect(() => {
    fetchCustomerServices();
    fetchAppointments();
    fetchWarrantyClaims();
  }, []);

  const fetchCustomerServices = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('customer_services').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setCustomerServices((data as CustomerService[]) || []);
    setLoading(false);
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from('service_appointments').select('*').order('appointment_date', { ascending: true });
    if (error) console.error('Error fetching appointments:', error);
    else setAppointments((data as ServiceAppointment[]) || []);
  };

  const fetchWarrantyClaims = async () => {
    const { data, error } = await supabase.from('warranty_claims').select('*').order('claim_date', { ascending: false });
    if (error) console.error('Error fetching warranty claims:', error);
    else setWarrantyClaims((data as WarrantyClaim[]) || []);
  };

  const handleOpenModal = (service?: CustomerService) => {
    setEditMode(!!service);
    setCurrentService(service ? { ...service } : initialCustomerService);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentService(initialCustomerService);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCurrentService({ ...currentService, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    
    if (editMode && currentService.id) {
      // Update
      const { error } = await supabase.from('customer_services').update({
        customer_name: currentService.customer_name,
        customer_email: currentService.customer_email,
        customer_phone: currentService.customer_phone,
        vehicle_id: currentService.vehicle_id,
        service_type: currentService.service_type,
        priority: currentService.priority,
        status: currentService.status,
        assigned_to: currentService.assigned_to,
        description: currentService.description,
        category: currentService.category,
        sla_deadline: currentService.sla_deadline,
        resolution_time: currentService.resolution_time,
        satisfaction_rating: currentService.satisfaction_rating,
        follow_up_date: currentService.follow_up_date,
        warranty_claim: currentService.warranty_claim,
        service_appointment: currentService.service_appointment,
        technician_notes: currentService.technician_notes,
        customer_feedback: currentService.customer_feedback,
        escalation_level: currentService.escalation_level,
      }).eq('id', currentService.id);
      
      if (error) setFeedback('Error updating service: ' + error.message);
      else setFeedback('Service updated successfully!');
    } else {
      // Add
      const { error } = await supabase.from('customer_services').insert([{
        customer_name: currentService.customer_name,
        customer_email: currentService.customer_email,
        customer_phone: currentService.customer_phone,
        vehicle_id: currentService.vehicle_id,
        service_type: currentService.service_type,
        priority: currentService.priority,
        status: currentService.status,
        assigned_to: currentService.assigned_to,
        description: currentService.description,
        category: currentService.category,
        sla_deadline: currentService.sla_deadline,
        resolution_time: currentService.resolution_time,
        satisfaction_rating: currentService.satisfaction_rating,
        follow_up_date: currentService.follow_up_date,
        warranty_claim: currentService.warranty_claim,
        service_appointment: currentService.service_appointment,
        technician_notes: currentService.technician_notes,
        customer_feedback: currentService.customer_feedback,
        escalation_level: currentService.escalation_level,
        created_at: new Date().toISOString(),
      }]);
      
      if (error) setFeedback('Error adding service: ' + error.message);
      else setFeedback('Service added successfully!');
    }
    
    setLoading(false);
    handleCloseModal();
    fetchCustomerServices();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service record?')) return;
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('customer_services').delete().eq('id', id);
    if (error) setFeedback('Error deleting service: ' + error.message);
    else setFeedback('Service deleted successfully!');
    setLoading(false);
    fetchCustomerServices();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);
    setFeedback(null);
    const { error } = await supabase.from('customer_services').update({ status: newStatus }).eq('id', id);
    if (error) setFeedback('Error updating status: ' + error.message);
    else setFeedback('Status updated successfully!');
    setLoading(false);
    fetchCustomerServices();
  };

  const handleExport = (type: 'all' | 'open' | 'resolved' | 'escalated') => {
    setExporting(true);
    let exportServices = customerServices;
    
    if (type === 'open') {
      exportServices = customerServices.filter(s => s.status === 'Open');
    } else if (type === 'resolved') {
      exportServices = customerServices.filter(s => s.status === 'Resolved');
    } else if (type === 'escalated') {
      exportServices = customerServices.filter(s => s.escalation_level && s.escalation_level > 1);
    }

    const csv = [
      ['Customer Name', 'Email', 'Phone', 'Service Type', 'Status', 'Priority', 'Category', 'Assigned To', 'Created', 'SLA Deadline', 'Satisfaction Rating'],
      ...exportServices.map(s => [
        s.customer_name, s.customer_email, s.customer_phone, s.service_type, s.status, s.priority, s.category || '', s.assigned_to, s.created_at, s.sla_deadline || '', s.satisfaction_rating?.toString() || ''
      ]),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-services-${type}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setExporting(false);
  };

  const filteredServices = customerServices.filter(service => {
    const matchesSearch = service.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || service.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || service.priority === priorityFilter;
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

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSatisfactionIcon = (rating: number) => {
    if (rating >= 4) return <FiStar className="text-green-600 fill-current" />;
    if (rating >= 3) return <FiStar className="text-yellow-600 fill-current" />;
    return <FiStar className="text-red-600 fill-current" />;
  };

  const openSatisfactionModal = (service: CustomerService) => {
    setSelectedService(service);
    setSatisfactionModalOpen(true);
  };

  const updateSatisfactionRating = async (rating: number) => {
    if (!selectedService) return;
    
    setLoading(true);
    const { error } = await supabase.from('customer_services').update({ 
      satisfaction_rating: rating 
    }).eq('id', selectedService.id);
    
    if (error) setFeedback('Error updating rating: ' + error.message);
    else setFeedback('Satisfaction rating updated successfully!');
    
    setLoading(false);
    setSatisfactionModalOpen(false);
    fetchCustomerServices();
  };

  return (
    <div className="space-y-8">
      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg"
            role="status"
            aria-live="polite"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-700">
            <FaHeadset /> Customer Service & After-Sales
          </h2>
          <p className="text-gray-500">Comprehensive customer service management, after-sales support, and satisfaction tracking.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary flex items-center gap-2" onClick={() => handleOpenModal()} aria-label="New Service Request">
            <FiPlus /> New Service Request
          </button>
          <button className="btn btn-secondary flex items-center gap-2" onClick={() => handleExport('all')} disabled={exporting} aria-label="Export">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glassmorphic bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-2xl p-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'services' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FaHeadset className="inline mr-2" />
            Service Requests
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'appointments' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiCalendar className="inline mr-2" />
            Service Appointments
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'warranty' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiShield className="inline mr-2" />
            Warranty Claims
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FaChartLine className="inline mr-2" />
            Analytics & Reports
          </button>
        </div>

        {/* Service Requests Tab */}
        <AnimatePresence>
        {activeTab === 'services' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, description..."
                  className="input w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
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

            {/* Services Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                  {filteredServices.map((service) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900 transition-all"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{service.customer_name}</div>
                          <div className="text-sm text-gray-500">{service.customer_email}</div>
                          <div className="text-sm text-gray-500">{service.customer_phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{service.service_type}</div>
                        <div className="text-sm text-gray-500">{service.category}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          service.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                          service.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          service.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {service.status}
                        </span>
                        {isOverdue(service.sla_deadline, service.status) && (
                          <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full animate-pulse" title="Overdue">Overdue</span>
                        )}
                        {isEscalated(service.escalation_level) && (
                          <span className="ml-2 px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full animate-bounce" title="Auto-Escalated">Escalated</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBg(service.priority)} ${getPriorityColor(service.priority)}`}>{service.priority}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {service.assigned_to || 'Unassigned'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {service.satisfaction_rating ? (
                          <div className="flex items-center gap-1">
                            {getSatisfactionIcon(service.satisfaction_rating)}
                            <span className={`text-sm ${getSatisfactionColor(service.satisfaction_rating)}`}>{service.satisfaction_rating}/5</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => openSatisfactionModal(service)}
                            className="text-sm text-gray-500 hover:text-purple-600 focus:ring-2 focus:ring-purple-400 rounded"
                            aria-label="Rate Satisfaction"
                          >
                            Rate
                          </button>
                        )}
                        {/* Satisfaction follow-up badge */}
                        {!service.satisfaction_rating && service.status === 'Resolved' && (
                          <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full animate-pulse" title="Follow-up Needed">Follow-up</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(service)}
                            className="btn btn-icon"
                            aria-label="Edit Service"
                            tabIndex={0}
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="btn btn-icon"
                            aria-label="Delete Service"
                            tabIndex={0}
                          >
                            <FiTrash2 size={16} />
                          </button>
                          <button
                            onClick={() => openSatisfactionModal(service)}
                            className="btn btn-icon"
                            aria-label="Rate Satisfaction"
                            tabIndex={0}
                          >
                            <FiStar size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Service Appointments Tab */}
        <AnimatePresence>
        {activeTab === 'appointments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Service Appointments</h3>
                <button className="btn btn-primary flex items-center gap-2">
                <FiPlus /> New Appointment
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-500"
                  >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{appointment.customer_name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{appointment.vehicle_model}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{appointment.service_type}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{appointment.appointment_date}</span>
                    <span>{appointment.appointment_time}</span>
                  </div>
                  </motion.div>
              ))}
            </div>
              {/* Calendar view placeholder */}
              <div className="mt-6">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl p-6 text-center text-blue-900 dark:text-blue-100 font-semibold shadow-lg">
                  <span>📅 Calendar View Coming Soon</span>
          </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Warranty Claims Tab */}
        <AnimatePresence>
        {activeTab === 'warranty' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Warranty Claims</h3>
                <button className="btn btn-primary flex items-center gap-2">
                <FiPlus /> New Claim
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {warrantyClaims.map((claim) => (
                      <motion.tr
                        key={claim.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {claim.customer_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {claim.claim_type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {claim.claim_date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {claim.claim_amount ? `KES ${claim.claim_amount.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                            <button className="btn btn-icon" aria-label="View Claim">
                            <FiEye size={16} />
                          </button>
                            <button className="btn btn-icon" aria-label="Approve Claim">
                            <FiCheckCircle size={16} />
                          </button>
                        </div>
                      </td>
                      </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Analytics Tab */}
        <AnimatePresence>
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Service Requests</p>
                  <p className="text-2xl font-bold">{customerServices.length}</p>
                </div>
                <FaHeadset className="text-3xl opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Resolved</p>
                  <p className="text-2xl font-bold">
                    {customerServices.filter(s => s.status === 'Resolved').length}
                  </p>
                </div>
                <FiCheckCircle className="text-3xl opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Pending</p>
                  <p className="text-2xl font-bold">
                    {customerServices.filter(s => s.status === 'Open').length}
                  </p>
                </div>
                <FiClock className="text-3xl opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg Satisfaction</p>
                  <p className="text-2xl font-bold">
                    {customerServices.filter(s => s.satisfaction_rating).length > 0 
                      ? (customerServices.reduce((acc, s) => acc + (s.satisfaction_rating || 0), 0) / 
                         customerServices.filter(s => s.satisfaction_rating).length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
                <FiStar className="text-3xl opacity-75" />
              </div>
            </div>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glassmorphic bg-white/90 dark:bg-gray-900/90 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editMode ? 'Edit Service Request' : 'New Service Request'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer Name</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={currentService.customer_name}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer Email</label>
                    <input
                      type="email"
                      name="customer_email"
                      value={currentService.customer_email}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer Phone</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={currentService.customer_phone}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vehicle ID</label>
                    <input
                      type="text"
                      name="vehicle_id"
                      value={currentService.vehicle_id}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Service Type</label>
                    <select
                      name="service_type"
                      value={currentService.service_type}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    >
                      <option value="">Select Service Type</option>
                      {SERVICE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      name="category"
                      value={currentService.category}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      name="priority"
                      value={currentService.priority}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {PRIORITIES.map(pri => (
                        <option key={pri.key} value={pri.key}>{pri.key}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={currentService.status}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Escalated">Escalated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assigned To</label>
                    <input
                      type="text"
                      name="assigned_to"
                      value={currentService.assigned_to}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SLA Deadline</label>
                    <input
                      type="datetime-local"
                      name="sla_deadline"
                      value={currentService.sla_deadline}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={currentService.description}
                    onChange={handleChange}
                    className="input w-full h-24"
                    placeholder="Describe the service request..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Technician Notes</label>
                  <textarea
                    name="technician_notes"
                    value={currentService.technician_notes}
                    onChange={handleChange}
                    className="input w-full h-24"
                    placeholder="Add technician notes..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editMode ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Satisfaction Rating Modal */}
      <AnimatePresence>
      {satisfactionModalOpen && selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glassmorphic bg-white/90 dark:bg-gray-900/90 rounded-lg max-w-md w-full shadow-2xl"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rate Customer Satisfaction</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Service: {selectedService.service_type} for {selectedService.customer_name}
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateSatisfactionRating(rating)}
                    className="text-3xl hover:scale-110 transition-transform"
                  >
                    <FiStar className={`${rating <= (selectedService.satisfaction_rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setSatisfactionModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerServiceDepartment; 