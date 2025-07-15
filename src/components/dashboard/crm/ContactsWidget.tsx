import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiStar
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'lead' | 'customer' | 'prospect';
  source: string;
  created_at: string;
  last_contact: string;
  notes: string;
  tags: string[];
}

const mockContacts: Contact[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@techsolutions.com',
    phone: '+254 722 123 456',
    company: 'Tech Solutions Ltd',
    position: 'CEO',
    department: 'Executive',
    status: 'customer',
    source: 'Website',
    created_at: '2024-01-10',
    last_contact: '2024-01-20',
    notes: 'Key decision maker, prefers luxury vehicles',
    tags: ['VIP', 'Luxury', 'Fleet']
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@startup.co.ke',
    phone: '+254 733 987 654',
    company: 'Startup Kenya',
    position: 'Operations Manager',
    department: 'Operations',
    status: 'lead',
    source: 'Referral',
    created_at: '2024-01-15',
    last_contact: '2024-01-19',
    notes: 'Interested in leasing options for startup',
    tags: ['Startup', 'Lease', 'Budget-conscious']
  },
  {
    id: '3',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'm.chen@globalcorp.com',
    phone: '+254 711 456 789',
    company: 'Global Corporation',
    position: 'Fleet Manager',
    department: 'Transportation',
    status: 'prospect',
    source: 'LinkedIn',
    created_at: '2024-01-20',
    last_contact: '2024-01-22',
    notes: 'Managing large fleet, looking for expansion',
    tags: ['Fleet', 'Corporate', 'Bulk Purchase']
  },
  {
    id: '4',
    first_name: 'Lisa',
    last_name: 'Wangari',
    email: 'lisa.w@familybusiness.com',
    phone: '+254 700 111 222',
    company: 'Family Business Group',
    position: 'Director',
    department: 'Management',
    status: 'customer',
    source: 'Cold Call',
    created_at: '2024-01-05',
    last_contact: '2024-01-21',
    notes: 'Family business, values reliability and prestige',
    tags: ['Family', 'Premium', 'Reliability']
  },
  {
    id: '5',
    first_name: 'David',
    last_name: 'Ochieng',
    email: 'd.ochieng@logistics.co.ke',
    phone: '+254 744 333 444',
    company: 'Logistics Kenya',
    position: 'Transport Coordinator',
    department: 'Logistics',
    status: 'lead',
    source: 'Trade Show',
    created_at: '2024-01-25',
    last_contact: '2024-01-26',
    notes: 'Looking for commercial vehicles for delivery fleet',
    tags: ['Commercial', 'Delivery', 'Fleet']
  }
];

const getStatusColor = (status: Contact['status']) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'default';
    case 'lead': return 'warning';
    case 'customer': return 'success';
    case 'prospect': return 'info';
    default: return 'default';
  }
};

const getStatusLabel = (status: Contact['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function ContactsWidget() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || contact.department === selectedDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: contacts.length,
    customers: contacts.filter(c => c.status === 'customer').length,
    leads: contacts.filter(c => c.status === 'lead').length,
    prospects: contacts.filter(c => c.status === 'prospect').length,
    active: contacts.filter(c => c.status === 'active').length
  };

  const departments = Array.from(new Set(contacts.map(c => c.department)));

  const handleAddContact = () => {
    // TODO: Implement add contact functionality
    alert('Add contact functionality coming soon!');
  };

  const handleEditContact = (contactId: string) => {
    // TODO: Implement edit contact functionality
    alert('Edit contact functionality coming soon!');
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== contactId));
    }
  };

  const handleUpdateStatus = (contactId: string, newStatus: Contact['status']) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId ? { ...contact, status: newStatus } : contact
    ));
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contact Management</h2>
            <p className="text-gray-600">Manage your customer and prospect contacts</p>
          </div>
          <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Contacts</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.customers}</p>
            <p className="text-sm text-gray-600">Customers</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.leads}</p>
            <p className="text-sm text-gray-600">Leads</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{stats.prospects}</p>
            <p className="text-sm text-gray-600">Prospects</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
            <option value="prospect">Prospect</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Contacts List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {contact.status === 'customer' && (
                      <FiStar className="text-yellow-500" />
                    )}
                  </div>
                  <p className="text-gray-600">{contact.position} at {contact.company}</p>
                  <p className="text-sm text-gray-500">{contact.department} Department</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(contact.status)}>
                    {getStatusLabel(contact.status)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditContact(contact.id)}
                    >
                      <FiEdit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="text-blue-500" />
                  {contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone className="text-green-500" />
                  {contact.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaBuilding className="text-purple-500" />
                  {contact.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMapPin className="text-red-500" />
                  {contact.source}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{contact.notes}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {contact.tags.map((tag, index) => (
                  <Badge key={index} variant="info" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FiMail className="mr-1" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <FiPhone className="mr-1" />
                    Call
                  </Button>
                  <select
                    value={contact.status}
                    onChange={(e) => handleUpdateStatus(contact.id, e.target.value as Contact['status'])}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="lead">Lead</option>
                    <option value="customer">Customer</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>
                <div className="text-xs text-gray-500">
                  Last contact: {new Date(contact.last_contact).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiUser className="mx-auto text-4xl mb-2" />
            <p>No contacts found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 