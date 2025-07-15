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
  FiCalendar,
  FiTrendingUp,
  FiPlus,
  FiSearch
} from 'react-icons/fi';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  value: number;
  created_at: string;
  last_contact: string;
  notes: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+254 722 123 456',
    company: 'Tech Solutions Ltd',
    source: 'Website',
    status: 'qualified',
    value: 2500000,
    created_at: '2024-01-15',
    last_contact: '2024-01-20',
    notes: 'Interested in luxury SUV for executive transport'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@startup.co.ke',
    phone: '+254 733 987 654',
    company: 'Startup Kenya',
    source: 'Referral',
    status: 'contacted',
    value: 1800000,
    created_at: '2024-01-18',
    last_contact: '2024-01-19',
    notes: 'Looking for reliable sedan for business use'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@globalcorp.com',
    phone: '+254 711 456 789',
    company: 'Global Corporation',
    source: 'LinkedIn',
    status: 'new',
    value: 3500000,
    created_at: '2024-01-22',
    last_contact: '2024-01-22',
    notes: 'Fleet purchase inquiry - 5 vehicles needed'
  },
  {
    id: '4',
    name: 'Lisa Wangari',
    email: 'lisa.w@familybusiness.com',
    phone: '+254 700 111 222',
    company: 'Family Business Group',
    source: 'Cold Call',
    status: 'proposal',
    value: 4200000,
    created_at: '2024-01-10',
    last_contact: '2024-01-21',
    notes: 'Premium vehicle for family use, budget flexible'
  }
];

const getStatusColor = (status: Lead['status']) => {
  switch (status) {
    case 'new': return 'default';
    case 'contacted': return 'info';
    case 'qualified': return 'warning';
    case 'proposal': return 'success';
    case 'won': return 'success';
    case 'lost': return 'danger';
    default: return 'default';
  }
};

const getStatusLabel = (status: Lead['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function LeadsWidget() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    won: leads.filter(l => l.status === 'won').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0)
  };

  const handleAddLead = () => {
    // TODO: Implement add lead functionality
    alert('Add lead functionality coming soon!');
  };

  const handleUpdateStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Leads Management</h2>
            <p className="text-gray-600">Track and manage potential customers</p>
          </div>
          <Button onClick={handleAddLead} className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Leads</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.new}</p>
            <p className="text-sm text-gray-600">New</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{stats.qualified}</p>
            <p className="text-sm text-gray-600">Qualified</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.won}</p>
            <p className="text-sm text-gray-600">Won</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              KES {stats.totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search leads..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Leads List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{lead.name}</h3>
                  <p className="text-gray-600">{lead.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(lead.status)}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                  <span className="text-sm font-semibold text-green-600">
                    KES {lead.value.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="text-blue-500" />
                  {lead.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone className="text-green-500" />
                  {lead.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMapPin className="text-red-500" />
                  {lead.source}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCalendar className="text-purple-500" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{lead.notes}</p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <FiMail className="mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline">
                  <FiTrendingUp className="mr-1" />
                  Update Status
                </Button>
                <select
                  value={lead.status}
                  onChange={(e) => handleUpdateStatus(lead.id, e.target.value as Lead['status'])}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiUser className="mx-auto text-4xl mb-2" />
            <p>No leads found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 