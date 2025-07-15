import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  FiDollarSign, 
  FiCalendar, 
  FiTrendingUp,
  FiUser,
  FiTarget,
  FiPlus,
  FiSearch,
  FiClock
} from 'react-icons/fi';

interface Opportunity {
  id: string;
  title: string;
  lead_name: string;
  company: string;
  value: number;
  probability: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date: string;
  created_at: string;
  description: string;
  products: string[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Fleet Purchase - Tech Solutions Ltd',
    lead_name: 'John Smith',
    company: 'Tech Solutions Ltd',
    value: 25000000,
    probability: 85,
    stage: 'negotiation',
    expected_close_date: '2024-02-15',
    created_at: '2024-01-10',
    description: 'Purchase of 5 luxury SUVs for executive transport services',
    products: ['BMW X5', 'Mercedes S-Class', 'Range Rover Sport']
  },
  {
    id: '2',
    title: 'Startup Vehicle Lease',
    lead_name: 'Sarah Johnson',
    company: 'Startup Kenya',
    value: 8000000,
    probability: 70,
    stage: 'proposal',
    expected_close_date: '2024-02-28',
    created_at: '2024-01-15',
    description: '2-year lease agreement for 3 sedans and 1 SUV',
    products: ['Toyota Camry', 'Honda Accord', 'BMW X3']
  },
  {
    id: '3',
    title: 'Corporate Fleet Expansion',
    lead_name: 'Michael Chen',
    company: 'Global Corporation',
    value: 45000000,
    probability: 60,
    stage: 'qualification',
    expected_close_date: '2024-03-10',
    created_at: '2024-01-20',
    description: 'Expansion of existing fleet with 8 new vehicles',
    products: ['Toyota Land Cruiser', 'Mercedes V-Class', 'BMW 7 Series']
  },
  {
    id: '4',
    title: 'Family Business Vehicle',
    lead_name: 'Lisa Wangari',
    company: 'Family Business Group',
    value: 12000000,
    probability: 90,
    stage: 'closed_won',
    expected_close_date: '2024-01-25',
    created_at: '2024-01-05',
    description: 'Premium vehicle for family business executives',
    products: ['Mercedes S-Class', 'BMW 7 Series']
  }
];

const getStageColor = (stage: Opportunity['stage']) => {
  switch (stage) {
    case 'prospecting': return 'default';
    case 'qualification': return 'info';
    case 'proposal': return 'warning';
    case 'negotiation': return 'success';
    case 'closed_won': return 'success';
    case 'closed_lost': return 'danger';
    default: return 'default';
  }
};

const getStageLabel = (stage: Opportunity['stage']) => {
  return stage.replace('_', ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default function OpportunitiesWidget() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.lead_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || opp.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const stats = {
    total: opportunities.length,
    totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
    weightedValue: opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0),
    won: opportunities.filter(opp => opp.stage === 'closed_won').length,
    lost: opportunities.filter(opp => opp.stage === 'closed_lost').length
  };

  const handleAddOpportunity = () => {
    // TODO: Implement add opportunity functionality
    alert('Add opportunity functionality coming soon!');
  };

  const handleUpdateStage = (oppId: string, newStage: Opportunity['stage']) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === oppId ? { ...opp, stage: newStage } : opp
    ));
  };

  const getDaysUntilClose = (closeDate: string) => {
    const today = new Date();
    const close = new Date(closeDate);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sales Opportunities</h2>
            <p className="text-gray-600">Track and manage potential sales</p>
          </div>
          <Button onClick={handleAddOpportunity} className="bg-green-600 hover:bg-green-700">
            <FiPlus className="mr-2" />
            Add Opportunity
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Opportunities</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              KES {stats.totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              KES {Math.round(stats.weightedValue).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Weighted Value</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">{stats.won}</p>
            <p className="text-sm text-gray-600">Won</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
            <p className="text-sm text-gray-600">Lost</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredOpportunities.map((opp) => {
            const daysUntilClose = getDaysUntilClose(opp.expected_close_date);
            return (
              <div key={opp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{opp.title}</h3>
                    <p className="text-gray-600">{opp.company} • {opp.lead_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStageColor(opp.stage)}>
                      {getStageLabel(opp.stage)}
                    </Badge>
                    <span className="text-sm font-semibold text-green-600">
                      KES {opp.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiDollarSign className="text-green-500" />
                    <span>Value: KES {opp.value.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiTarget className="text-blue-500" />
                    <span>Probability: {opp.probability}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-purple-500" />
                    <span>Close: {new Date(opp.expected_close_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{opp.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {opp.products.map((product, index) => (
                    <Badge key={index} variant="info" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FiUser className="mr-1" />
                      View Lead
                    </Button>
                    <Button size="sm" variant="outline">
                      <FiTrendingUp className="mr-1" />
                      Update Stage
                    </Button>
                    <select
                      value={opp.stage}
                      onChange={(e) => handleUpdateStage(opp.id, e.target.value as Opportunity['stage'])}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="prospecting">Prospecting</option>
                      <option value="qualification">Qualification</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiClock className="text-orange-500" />
                    <span className={daysUntilClose < 7 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {daysUntilClose > 0 ? `${daysUntilClose} days left` : 'Overdue'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiTarget className="mx-auto text-4xl mb-2" />
            <p>No opportunities found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 