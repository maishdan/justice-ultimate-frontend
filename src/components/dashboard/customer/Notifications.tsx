import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  FiBell, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiInfo,
  FiX,
  FiSettings,
  FiFilter,
  FiTrash2,
  FiStar,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';
import { 
  AiFillCar 
} from 'react-icons/ai';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications = [
      {
        id: '1',
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your booking for BMW X5 has been confirmed for January 15-18, 2024.',
        timestamp: '2024-01-14T10:30:00Z',
        isRead: false,
        priority: 'high',
        category: 'booking'
      },
      {
        id: '2',
        type: 'payment_successful',
        title: 'Payment Successful',
        message: 'Payment of KES 135,000 for your rental has been processed successfully.',
        timestamp: '2024-01-14T09:15:00Z',
        isRead: true,
        priority: 'medium',
        category: 'payment'
      },
      {
        id: '3',
        type: 'reminder',
        title: 'Upcoming Test Drive',
        message: 'Reminder: Your test drive for Mercedes S-Class is scheduled for tomorrow at 2:00 PM.',
        timestamp: '2024-01-13T16:45:00Z',
        isRead: false,
        priority: 'high',
        category: 'reminder'
      },
      {
        id: '4',
        type: 'offer',
        title: 'Special Offer Available',
        message: 'Get 20% off on all luxury vehicles this weekend. Use code: LUXURY20',
        timestamp: '2024-01-13T14:20:00Z',
        isRead: false,
        priority: 'medium',
        category: 'offer'
      },
      {
        id: '5',
        type: 'service',
        title: 'Vehicle Service Due',
        message: 'Your Toyota Land Cruiser is due for service. Schedule an appointment now.',
        timestamp: '2024-01-13T11:30:00Z',
        isRead: true,
        priority: 'low',
        category: 'service'
      },
      {
        id: '6',
        type: 'security',
        title: 'New Login Detected',
        message: 'New login detected from Nairobi, Kenya. If this wasn\'t you, please contact support.',
        timestamp: '2024-01-12T20:15:00Z',
        isRead: true,
        priority: 'high',
        category: 'security'
      },
      {
        id: '7',
        type: 'loyalty',
        title: 'Loyalty Points Earned',
        message: 'You earned 250 loyalty points for your recent rental. Total points: 1,500',
        timestamp: '2024-01-12T18:30:00Z',
        isRead: false,
        priority: 'low',
        category: 'loyalty'
      },
      {
        id: '8',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on January 15, 2024 from 2:00 AM to 4:00 AM. Service may be temporarily unavailable.',
        timestamp: '2024-01-12T15:00:00Z',
        isRead: true,
        priority: 'medium',
        category: 'system'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return <FiCheckCircle className="text-green-500" />;
      case 'payment_successful':
        return <FiDollarSign className="text-green-500" />;
      case 'reminder':
        return <FiCalendar className="text-blue-500" />;
      case 'offer':
        return <FiStar className="text-yellow-500" />;
      case 'service':
        return <AiFillCar className="text-orange-500" />;
      case 'security':
        return <FiAlertTriangle className="text-red-500" />;
      case 'loyalty':
        return <FiStar className="text-purple-500" />;
      case 'system':
        return <FiInfo className="text-gray-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !notif.isRead;
    return notif.category === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Stay updated with your account activity and important alerts</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
            <FiCheckCircle className="mr-2" />
            Mark All as Read
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <FiSettings className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <FiBell className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <FiAlertTriangle className="text-red-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
              </div>
              <FiAlertTriangle className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => {
                    const today = new Date().toDateString();
                    return new Date(n.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
              <FiCalendar className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Booking Confirmations</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Alerts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Promotional Offers</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs>
        <TabsList>
          <TabsTrigger label="All" selected={selectedTab === 'all'} onClick={() => setSelectedTab('all')} />
          <TabsTrigger label="Unread" selected={selectedTab === 'unread'} onClick={() => setSelectedTab('unread')} />
          <TabsTrigger label="Bookings" selected={selectedTab === 'booking'} onClick={() => setSelectedTab('booking')} />
          <TabsTrigger label="Payments" selected={selectedTab === 'payment'} onClick={() => setSelectedTab('payment')} />
          <TabsTrigger label="Reminders" selected={selectedTab === 'reminder'} onClick={() => setSelectedTab('reminder')} />
        </TabsList>
        <TabsContent>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <FiBell className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-600">No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.isRead ? 'bg-gray-50' : 'bg-white'
                      } ${!notification.isRead ? 'border-blue-200' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              {!notification.isRead && (
                                <Badge className="bg-blue-100 text-blue-800">New</Badge>
                              )}
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <p className="text-sm text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}