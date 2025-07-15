import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiStar
} from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';

export default function BookingsAppointments() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('bookings');

  useEffect(() => {
    fetchBookingsAndAppointments();
  }, []);

  const fetchBookingsAndAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch bookings
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select(`
            *,
            cars (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch appointments
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            cars (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setBookings(bookingsData || []);
        setAppointments(appointmentsData || []);
      }
    } catch (error) {
      console.error('Error fetching bookings and appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);

        if (error) throw error;
        
        // Refresh data
        fetchBookingsAndAppointments();
        alert('Booking cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
      }
    }
  };

  const handleRescheduleAppointment = async (appointmentId: string) => {
    // Implement reschedule logic
    alert('Reschedule functionality coming soon!');
  };

  const mockBookings = [
    {
      id: '1',
      car_name: 'BMW X5',
      start_date: '2024-01-15',
      end_date: '2024-01-18',
      total_amount: 45000,
      status: 'confirmed',
      pickup_location: 'Nairobi Airport',
      return_location: 'Nairobi Airport',
      car_image: '/images/BMW X5/1.jpg'
    },
    {
      id: '2',
      car_name: 'Mercedes S-Class',
      start_date: '2024-01-20',
      end_date: '2024-01-22',
      total_amount: 35000,
      status: 'pending',
      pickup_location: 'Mombasa Branch',
      return_location: 'Mombasa Branch',
      car_image: '/images/MERCEDES S CLASS/1.jpg'
    },
    {
      id: '3',
      car_name: 'Toyota Land Cruiser',
      start_date: '2024-01-10',
      end_date: '2024-01-12',
      total_amount: 55000,
      status: 'completed',
      pickup_location: 'Kisumu Branch',
      return_location: 'Kisumu Branch',
      car_image: '/images/landcruiser-v8/1.jpg'
    }
  ];

  const mockAppointments = [
    {
      id: '1',
      car_name: 'BMW X6',
      appointment_date: '2024-01-25',
      appointment_time: '14:00',
      type: 'test_drive',
      status: 'confirmed',
      location: 'Nairobi Showroom',
      car_image: '/images/BMW X5/2.jpg'
    },
    {
      id: '2',
      car_name: 'Range Rover Sport',
      appointment_date: '2024-01-28',
      appointment_time: '10:30',
      type: 'consultation',
      status: 'pending',
      location: 'Mombasa Branch',
      car_image: '/images/RANGE VOLVO/1.jpg'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings and appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings & Appointments</h1>
          <p className="text-gray-600">Manage your car rentals and scheduled appointments</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.href = '/vehicle-catalogue'}>
            <AiFillCar className="mr-2" />
            Book New Car
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/book-test-drive'}>
            <FiCalendar className="mr-2" />
            Schedule Test Drive
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{mockBookings.length}</p>
              </div>
              <AiFillCar className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockBookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockAppointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <FiCalendar className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600">
                  KES {mockBookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
                </p>
              </div>
              <FiDollarSign className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabsList>
          <TabsTrigger label="Car Rentals" selected={selectedTab === 'bookings'} onClick={() => setSelectedTab('bookings')} />
          <TabsTrigger label="Appointments" selected={selectedTab === 'appointments'} onClick={() => setSelectedTab('appointments')} />
        </TabsList>
        {selectedTab === 'bookings' && (
          <TabsContent>
            {/* Bookings Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={booking.car_image} 
                      alt={booking.car_name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/1967-ford-mustang.png';
                      }}
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{booking.car_name}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-500" />
                        <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-green-500" />
                        <span>Pickup: {booking.pickup_location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-red-500" />
                        <span>Return: {booking.return_location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="text-purple-500" />
                        <span className="font-semibold">KES {booking.total_amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === 'confirmed' && (
                        <>
                          <Button size="sm" className="flex-1">
                            <FiDownload className="mr-1" />
                            Download Receipt
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <FiXCircle className="mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" className="flex-1">
                            <FiEdit2 className="mr-1" />
                            Modify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <FiXCircle className="mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <Button size="sm" className="flex-1">
                            <FiStar className="mr-1" />
                            Rate Experience
                          </Button>
                          <Button size="sm" variant="outline">
                            <FiDownload className="mr-1" />
                            Receipt
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
        {selectedTab === 'appointments' && (
          <TabsContent>
            {/* Appointments Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={appointment.car_image} 
                      alt={appointment.car_name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/1967-ford-mustang.png';
                      }}
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{appointment.car_name}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-500" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-green-500" />
                        <span>{formatTime(appointment.appointment_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-purple-500" />
                        <span>{appointment.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AiFillCar className="text-orange-500" />
                        <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {appointment.status === 'confirmed' && (
                        <>
                          <Button size="sm" className="flex-1">
                            <FiCalendar className="mr-1" />
                            Add to Calendar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRescheduleAppointment(appointment.id)}
                          >
                            <FiEdit2 className="mr-1" />
                            Reschedule
                          </Button>
                        </>
                      )}
                      {appointment.status === 'pending' && (
                        <>
                          <Button size="sm" className="flex-1">
                            <FiCheckCircle className="mr-1" />
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline">
                            <FiXCircle className="mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
