import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  FiCalendar,
  FiDollarSign,
  FiBell,
  FiClock,
  FiStar,
  FiAward,
  FiTarget,
  FiUser
} from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';
import { useUserProfile } from '../../../context/UserProfileContext';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeRentals: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    upcomingAppointments: 0,
    favoriteVehicles: 0
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Remove fetchUserData and fetchUserProfile, use context instead
  const fetchUserStats = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      setStats({
        totalBookings: 8,
        activeRentals: 2,
        totalSpent: 45000,
        loyaltyPoints: 1250,
        upcomingAppointments: 3,
        favoriteVehicles: 5
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Dynamic greeting and first name with exact time
  const now = new Date();
  const hour = now.getHours();
  let session = 'evening';
  if (hour < 12) session = 'morning';
  else if (hour < 18) session = 'afternoon';
  const greeting = `Good ${session}`;
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const timeString = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  const today = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const motivationMessages = [
    "Let’s make today amazing!",
    "Ready for your next adventure?",
    "Your world-class automotive experience starts here.",
    "Drive your dreams!",
    "Welcome to a new day of possibilities."
  ];
  const motivation = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

  const quickActions = [
    {
      title: "Book a Car",
      description: "Rent a vehicle for your next trip",
      icon: <AiFillCar className="text-2xl" />,
      action: () => navigate('/catalogue'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Schedule Test Drive",
      description: "Try before you buy",
      icon: <FiCalendar className="text-2xl" />,
      action: () => navigate('/book-test-drive'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "View Payments",
      description: "Check your transaction history",
      icon: <FiDollarSign className="text-2xl" />,
      action: () => navigate('/dashboard/payments'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Get AI Recommendations",
      description: "Discover perfect cars for you",
      icon: <FiTarget className="text-2xl" />,
      action: () => navigate('/dashboard/ai-match'),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const recentActivity = [
    {
      type: "booking",
      message: "Booked BMW X5 for weekend trip",
      time: "2 hours ago",
      status: "confirmed"
    },
    {
      type: "payment",
      message: "Payment of KES 15,000 completed",
      time: "1 day ago",
      status: "completed"
    },
    {
      type: "test-drive",
      message: "Test drive scheduled for Mercedes S-Class",
      time: "2 days ago",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full min-w-0">
        <CardContent className="p-6 w-full min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <FiUser className="text-4xl" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {greeting}, <span className="text-yellow-400">{firstName}</span>!
                </h1>
                <div className="flex gap-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/catalogue')}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <AiFillCar className="mr-2" />
                    Browse Cars
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard/notifications')}
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <FiBell className="mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-sm">Loyalty Points</p>
                <p className="text-2xl font-bold">{stats.loyaltyPoints}</p>
                <p className="text-xs">Gold Member</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full min-w-0">
        <Card className="bg-white hover:shadow-lg transition-shadow w-full min-w-0">
          <CardContent className="p-4 w-full min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBookings}</p>
              </div>
              <FiCalendar className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow w-full min-w-0">
          <CardContent className="p-4 w-full min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeRentals}</p>
              </div>
              <AiFillCar className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow w-full min-w-0">
          <CardContent className="p-4 w-full min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600">KES {stats.totalSpent.toLocaleString()}</p>
              </div>
              <FiDollarSign className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow w-full min-w-0">
          <CardContent className="p-4 w-full min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-orange-600">{stats.upcomingAppointments}</p>
              </div>
              <FiClock className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow w-full min-w-0">
          <CardContent className="p-4 w-full min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-red-600">{stats.favoriteVehicles}</p>
              </div>
              <FiStar className="text-red-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow w-full min-w-0">
          <CardContent className="p-4 w-full min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">4.8</p>
              </div>
              <FiAward className="text-yellow-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="w-full min-w-0">
        <CardContent className="p-6 w-full min-w-0 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2`}
              >
                {action.icon}
                <div className="text-center">
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        {/* Recent Activity */}
        <Card className="w-full min-w-0">
          <CardContent className="p-6 w-full min-w-0">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'booking' ? <AiFillCar /> :
                       activity.type === 'payment' ? <FiDollarSign /> :
                       <FiCalendar />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="info">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="w-full min-w-0">
          <CardContent className="p-6 w-full min-w-0">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-blue-600" />
                  <div>
                    <p className="font-medium">Test Drive - BMW X5</p>
                    <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                    <p className="text-sm text-gray-600">📍 Nairobi Showroom</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <AiFillCar className="text-green-600" />
                  <div>
                    <p className="font-medium">Car Return - Mercedes S-Class</p>
                    <p className="text-sm text-gray-600">Dec 25, 10:00 AM</p>
                    <p className="text-sm text-gray-600">📍 Mombasa Branch</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center gap-3">
                  <FiAward className="text-purple-600" />
                  <div>
                    <p className="font-medium">Loyalty Reward Available</p>
                    <p className="text-sm text-gray-600">Redeem 500 points</p>
                    <p className="text-sm text-gray-600">Get 10% off next rental</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Vehicles */}
      <Card className="w-full min-w-0">
        <CardContent className="p-6 w-full min-w-0">
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={`/images/BMW X5/${i}.jpg`} 
                    alt="Vehicle" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/1967-ford-mustang.png';
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">Popular</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">BMW X5 {i}</h3>
                  <p className="text-sm text-gray-600 mb-2">Luxury SUV • Automatic</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-blue-600">KES {85000 + (i * 5000)}/day</p>
                    <Button size="sm" onClick={() => navigate(`/car/${i}`)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
