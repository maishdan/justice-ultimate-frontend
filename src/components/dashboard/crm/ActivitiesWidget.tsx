import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'follow_up';
  subject: string;
  description: string;
  contact_name: string;
  account_name: string;
  status: 'completed' | 'pending' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  completed_date?: string;
  created_at: string;
  assigned_to: string;
  duration?: number; // in minutes
  outcome?: string;
  tags: string[];
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    subject: 'Follow-up call with John Smith',
    description: 'Discuss proposal for fleet purchase and address concerns about delivery timeline',
    contact_name: 'John Smith',
    account_name: 'Tech Solutions Ltd',
    status: 'completed',
    priority: 'high',
    due_date: '2024-01-20',
    completed_date: '2024-01-20',
    created_at: '2024-01-18',
    assigned_to: 'Sales Team',
    duration: 30,
    outcome: 'Positive response, proposal accepted with minor modifications',
    tags: ['Follow-up', 'Proposal', 'Fleet']
  },
  {
    id: '2',
    type: 'meeting',
    subject: 'Product demonstration for Startup Kenya',
    description: 'Showcase our latest vehicle models and financing options',
    contact_name: 'Sarah Johnson',
    account_name: 'Startup Kenya',
    status: 'pending',
    priority: 'medium',
    due_date: '2024-01-25',
    created_at: '2024-01-22',
    assigned_to: 'Demo Team',
    tags: ['Demo', 'Financing', 'Startup']
  },
  {
    id: '3',
    type: 'email',
    subject: 'Quote request for Global Corporation',
    description: 'Send detailed quote for 8 vehicles including bulk discount options',
    contact_name: 'Michael Chen',
    account_name: 'Global Corporation',
    status: 'pending',
    priority: 'high',
    due_date: '2024-01-23',
    created_at: '2024-01-21',
    assigned_to: 'Sales Team',
    tags: ['Quote', 'Bulk Purchase', 'Corporate']
  },
  {
    id: '4',
    type: 'task',
    subject: 'Prepare contract for Family Business Group',
    description: 'Draft and review contract terms for premium vehicle purchase',
    contact_name: 'Lisa Wangari',
    account_name: 'Family Business Group',
    status: 'overdue',
    priority: 'urgent',
    due_date: '2024-01-19',
    created_at: '2024-01-15',
    assigned_to: 'Legal Team',
    tags: ['Contract', 'Legal', 'Premium']
  },
  {
    id: '5',
    type: 'note',
    subject: 'Site visit notes - Logistics Kenya',
    description: 'Document findings from site visit and vehicle requirements assessment',
    contact_name: 'David Ochieng',
    account_name: 'Logistics Kenya',
    status: 'completed',
    priority: 'medium',
    due_date: '2024-01-24',
    completed_date: '2024-01-24',
    created_at: '2024-01-23',
    assigned_to: 'Field Team',
    tags: ['Site Visit', 'Assessment', 'Logistics']
  },
  {
    id: '6',
    type: 'follow_up',
    subject: 'Post-sale follow-up call',
    description: 'Check customer satisfaction and address any post-purchase concerns',
    contact_name: 'John Smith',
    account_name: 'Tech Solutions Ltd',
    status: 'pending',
    priority: 'low',
    due_date: '2024-01-30',
    created_at: '2024-01-25',
    assigned_to: 'Customer Success',
    tags: ['Follow-up', 'Customer Success', 'Post-sale']
  }
];

const getTypeColor = (type: Activity['type']) => {
  switch (type) {
    case 'call': return 'success';
    case 'email': return 'info';
    case 'meeting': return 'warning';
    case 'task': return 'danger';
    case 'note': return 'default';
    case 'follow_up': return 'success';
    default: return 'default';
  }
};

const getTypeIcon = (type: Activity['type']) => {
  switch (type) {
    case 'call': return <FiPhone />;
    case 'email': return <FiMail />;
    case 'meeting': return <FiCalendar />;
    case 'task': return <FiCheckCircle />;
    case 'note': return <FiMessageSquare />;
    case 'follow_up': return <FiClock />;
    default: return <FiCalendar />;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'overdue': return 'danger';
    case 'cancelled': return 'default';
    default: return 'default';
  }
};

const getPriorityColor = (priority: Activity['priority']) => {
  switch (priority) {
    case 'low': return 'default';
    case 'medium': return 'info';
    case 'high': return 'warning';
    case 'urgent': return 'danger';
    default: return 'default';
  }
};

export default function ActivitiesWidget() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.account_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || activity.priority === selectedPriority;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'completed').length,
    pending: activities.filter(a => a.status === 'pending').length,
    overdue: activities.filter(a => a.status === 'overdue').length,
    today: activities.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.due_date === today;
    }).length
  };

  const handleAddActivity = () => {
    // TODO: Implement add activity functionality
    alert('Add activity functionality coming soon!');
  };

  const handleEditActivity = (activityId: string) => {
    // TODO: Implement edit activity functionality
    alert('Edit activity functionality coming soon!');
  };

  const handleDeleteActivity = (activityId: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities(prev => prev.filter(a => a.id !== activityId));
    }
  };

  const handleUpdateStatus = (activityId: string, newStatus: Activity['status']) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId ? { 
        ...activity, 
        status: newStatus,
        completed_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
      } : activity
    ));
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Activity Management</h2>
            <p className="text-gray-600">Track and manage customer interactions and tasks</p>
          </div>
          <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" />
            Add Activity
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Activities</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
            <p className="text-sm text-gray-600">Due Today</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search activities..."
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
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="note">Note</option>
            <option value="follow_up">Follow-up</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Activities List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => {
            const daysUntilDue = getDaysUntilDue(activity.due_date);
            return (
              <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg text-white ${getTypeColor(activity.type) === 'success' ? 'bg-green-500' : 
                                   getTypeColor(activity.type) === 'info' ? 'bg-blue-500' : 
                                   getTypeColor(activity.type) === 'warning' ? 'bg-yellow-500' : 
                                   getTypeColor(activity.type) === 'danger' ? 'bg-red-500' : 'bg-gray-500'}`}>
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{activity.subject}</h3>
                      <p className="text-gray-600">{activity.contact_name} • {activity.account_name}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(activity.status)}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                    <Badge variant={getPriorityColor(activity.priority)}>
                      {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditActivity(activity.id)}
                      >
                        <FiEdit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-blue-500" />
                    <span>Due: {new Date(activity.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUser className="text-green-500" />
                    <span>Assigned: {activity.assigned_to}</span>
                  </div>
                  {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiClock className="text-purple-500" />
                      <span>Duration: {activity.duration} min</span>
                    </div>
                  )}
                </div>

                {activity.outcome && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Outcome:</p>
                    <p className="text-sm text-gray-600">{activity.outcome}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {activity.tags.map((tag, index) => (
                    <Badge key={index} variant="info" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FiUser className="mr-1" />
                      View Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <FiCalendar className="mr-1" />
                      Schedule
                    </Button>
                    <select
                      value={activity.status}
                      onChange={(e) => handleUpdateStatus(activity.id, e.target.value as Activity['status'])}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-500">
                    {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                     daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                     'Due today'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiCalendar className="mx-auto text-4xl mb-2" />
            <p>No activities found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 