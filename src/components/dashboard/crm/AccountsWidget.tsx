import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail,
  FiGlobe,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiTrendingUp
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

interface Account {
  id: string;
  name: string;
  industry: string;
  type: 'customer' | 'prospect' | 'partner' | 'vendor';
  size: 'small' | 'medium' | 'large' | 'enterprise';
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  annual_revenue: number;
  employee_count: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  last_activity: string;
  description: string;
  contacts: number;
  opportunities: number;
  total_value: number;
}

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Tech Solutions Ltd',
    industry: 'Technology',
    type: 'customer',
    size: 'medium',
    website: 'www.techsolutions.com',
    phone: '+254 20 123 4567',
    email: 'info@techsolutions.com',
    address: 'Westlands, Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    annual_revenue: 50000000,
    employee_count: 150,
    status: 'active',
    created_at: '2024-01-10',
    last_activity: '2024-01-20',
    description: 'Leading technology solutions provider in East Africa',
    contacts: 5,
    opportunities: 3,
    total_value: 25000000
  },
  {
    id: '2',
    name: 'Startup Kenya',
    industry: 'Startup',
    type: 'prospect',
    size: 'small',
    website: 'www.startup.co.ke',
    phone: '+254 733 987 654',
    email: 'hello@startup.co.ke',
    address: 'Kilimani, Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    annual_revenue: 5000000,
    employee_count: 25,
    status: 'active',
    created_at: '2024-01-15',
    last_activity: '2024-01-19',
    description: 'Innovative startup focused on digital solutions',
    contacts: 2,
    opportunities: 1,
    total_value: 8000000
  },
  {
    id: '3',
    name: 'Global Corporation',
    industry: 'Manufacturing',
    type: 'prospect',
    size: 'enterprise',
    website: 'www.globalcorp.com',
    phone: '+254 711 456 789',
    email: 'contact@globalcorp.com',
    address: 'Industrial Area, Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    annual_revenue: 200000000,
    employee_count: 500,
    status: 'active',
    created_at: '2024-01-20',
    last_activity: '2024-01-22',
    description: 'Multinational manufacturing company with operations in 5 countries',
    contacts: 8,
    opportunities: 2,
    total_value: 45000000
  },
  {
    id: '4',
    name: 'Family Business Group',
    industry: 'Retail',
    type: 'customer',
    size: 'medium',
    website: 'www.familybusiness.com',
    phone: '+254 700 111 222',
    email: 'info@familybusiness.com',
    address: 'CBD, Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    annual_revenue: 30000000,
    employee_count: 100,
    status: 'active',
    created_at: '2024-01-05',
    last_activity: '2024-01-21',
    description: 'Family-owned retail business with multiple locations',
    contacts: 3,
    opportunities: 1,
    total_value: 12000000
  },
  {
    id: '5',
    name: 'Logistics Kenya',
    industry: 'Transportation',
    type: 'prospect',
    size: 'large',
    website: 'www.logistics.co.ke',
    phone: '+254 744 333 444',
    email: 'info@logistics.co.ke',
    address: 'Mombasa Road, Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    annual_revenue: 80000000,
    employee_count: 300,
    status: 'pending',
    created_at: '2024-01-25',
    last_activity: '2024-01-26',
    description: 'Leading logistics and transportation company',
    contacts: 4,
    opportunities: 2,
    total_value: 15000000
  }
];

const getTypeColor = (type: Account['type']) => {
  switch (type) {
    case 'customer': return 'success';
    case 'prospect': return 'warning';
    case 'partner': return 'info';
    case 'vendor': return 'default';
    default: return 'default';
  }
};

const getSizeColor = (size: Account['size']) => {
  switch (size) {
    case 'small': return 'default';
    case 'medium': return 'info';
    case 'large': return 'warning';
    case 'enterprise': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status: Account['status']) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'default';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

export default function AccountsWidget() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || account.type === selectedType;
    const matchesIndustry = selectedIndustry === 'all' || account.industry === selectedIndustry;
    return matchesSearch && matchesType && matchesIndustry;
  });

  const stats = {
    total: accounts.length,
    customers: accounts.filter(a => a.type === 'customer').length,
    prospects: accounts.filter(a => a.type === 'prospect').length,
    active: accounts.filter(a => a.status === 'active').length,
    totalRevenue: accounts.reduce((sum, account) => sum + account.annual_revenue, 0),
    totalValue: accounts.reduce((sum, account) => sum + account.total_value, 0)
  };

  const industries = Array.from(new Set(accounts.map(a => a.industry)));

  const handleAddAccount = () => {
    // TODO: Implement add account functionality
    alert('Add account functionality coming soon!');
  };

  const handleEditAccount = (accountId: string) => {
    // TODO: Implement edit account functionality
    alert('Edit account functionality coming soon!');
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(prev => prev.filter(a => a.id !== accountId));
    }
  };

  const handleUpdateStatus = (accountId: string, newStatus: Account['status']) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId ? { ...account, status: newStatus } : account
    ));
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Account Management</h2>
            <p className="text-gray-600">Manage your customer and prospect accounts</p>
          </div>
          <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" />
            Add Account
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Accounts</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.customers}</p>
            <p className="text-sm text-gray-600">Customers</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.prospects}</p>
            <p className="text-sm text-gray-600">Prospects</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              KES {Math.round(stats.totalRevenue / 1000000)}M
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              KES {Math.round(stats.totalValue / 1000000)}M
            </p>
            <p className="text-sm text-gray-600">Pipeline Value</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="customer">Customer</option>
            <option value="prospect">Prospect</option>
            <option value="partner">Partner</option>
            <option value="vendor">Vendor</option>
          </select>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Accounts List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{account.name}</h3>
                  <p className="text-gray-600">{account.industry} • {account.city}, {account.country}</p>
                  <p className="text-sm text-gray-500">{account.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getTypeColor(account.type)}>
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                  </Badge>
                  <Badge variant={getSizeColor(account.size)}>
                    {account.size.charAt(0).toUpperCase() + account.size.slice(1)}
                  </Badge>
                  <Badge variant={getStatusColor(account.status)}>
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAccount(account.id)}
                    >
                      <FiEdit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiGlobe className="text-blue-500" />
                  <a href={`https://${account.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {account.website}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone className="text-green-500" />
                  {account.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="text-purple-500" />
                  {account.email}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-lg font-semibold text-gray-800">{account.contacts}</p>
                  <p className="text-xs text-gray-600">Contacts</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-lg font-semibold text-gray-800">{account.opportunities}</p>
                  <p className="text-xs text-gray-600">Opportunities</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-lg font-semibold text-green-600">
                    KES {Math.round(account.annual_revenue / 1000000)}M
                  </p>
                  <p className="text-xs text-gray-600">Annual Revenue</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-lg font-semibold text-blue-600">
                    KES {Math.round(account.total_value / 1000000)}M
                  </p>
                  <p className="text-xs text-gray-600">Pipeline Value</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FiUsers className="mr-1" />
                    View Contacts
                  </Button>
                  <Button size="sm" variant="outline">
                    <FiTrendingUp className="mr-1" />
                    View Opportunities
                  </Button>
                  <select
                    value={account.status}
                    onChange={(e) => handleUpdateStatus(account.id, e.target.value as Account['status'])}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="text-xs text-gray-500">
                  Last activity: {new Date(account.last_activity).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaBuilding className="mx-auto text-4xl mb-2" />
            <p>No accounts found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 