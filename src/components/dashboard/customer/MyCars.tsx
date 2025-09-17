import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  FiClock, 
  FiMapPin, 
  FiDollarSign,
  FiCheckCircle,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiStar,
  FiSettings,
  FiCalendar,
  FiTrendingUp,
  FiShield
} from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';

export default function MyCars() {
  const [ownedCars, setOwnedCars] = useState<any[]>([]);
  const [rentalHistory, setRentalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('owned');

  useEffect(() => {
    fetchMyCars();
  }, []);

  const fetchMyCars = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch owned cars
        const { data: ownedCarsData } = await supabase
          .from('owned_cars')
          .select(`
            *,
            cars (*)
          `)
          .eq('user_id', user.id);

        // Fetch rental history
        const { data: rentalHistoryData } = await supabase
          .from('bookings')
          .select(`
            *,
            cars (*)
          `)
          .eq('user_id', user.id)
          .in('status', ['completed', 'cancelled'])
          .order('created_at', { ascending: false });

        setOwnedCars(ownedCarsData || []);
        setRentalHistory(rentalHistoryData || []);
      }
    } catch (error) {
      console.error('Error fetching my cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockOwnedCars = [
    {
      id: '1',
      car_name: 'Toyota Land Cruiser V8',
      year: '2020',
      mileage: '45,000 km',
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      color: 'White',
      license_plate: 'KCA 123A',
      insurance_status: 'Active',
      last_service: '2024-01-10',
      next_service: '2024-04-10',
      car_image: '/images/land-cruiser-v8 1.jpg',
      value: 8500000
    },
    {
      id: '2',
      car_name: 'BMW X5',
      year: '2021',
      mileage: '32,000 km',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      color: 'Black',
      license_plate: 'KDB 456B',
      insurance_status: 'Active',
      last_service: '2024-01-05',
      next_service: '2024-04-05',
      car_image: '/images/BMW X5/1.jpg',
      value: 6500000
    }
  ];

  const mockRentalHistory = [
    {
      id: '1',
      car_name: 'Mercedes S-Class',
      rental_date: '2024-01-15',
      return_date: '2024-01-18',
      total_amount: 45000,
      status: 'completed',
      rating: 5,
      car_image: '/images/MERCEDES S CLASS/1.jpg'
    },
    {
      id: '2',
      car_name: 'Range Rover Sport',
      rental_date: '2024-01-10',
      return_date: '2024-01-12',
      total_amount: 55000,
      status: 'completed',
      rating: 4,
      car_image: '/images/RANGE VOLVO/1.jpg'
    },
    {
      id: '3',
      car_name: 'Toyota Prado',
      rental_date: '2024-01-05',
      return_date: '2024-01-07',
      total_amount: 35000,
      status: 'completed',
      rating: 5,
      car_image: '/images/PRADO DIESEL/1.jpg'
    }
  ];

  const getServiceStatus = (nextServiceDate: string) => {
    const nextService = new Date(nextServiceDate);
    const today = new Date();
    const daysUntilService = Math.ceil((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilService < 0) {
      return { status: 'overdue', color: 'bg-red-100 text-red-800', text: 'Service Overdue' };
    } else if (daysUntilService <= 30) {
      return { status: 'due', color: 'bg-yellow-100 text-yellow-800', text: 'Service Due Soon' };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', text: 'Service Up to Date' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Cars</h1>
          <p className="text-gray-600">Manage your owned vehicles and view rental history</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.href = '/catalogue'}>
            <AiFillCar className="mr-2" />
            Add New Car
          </Button>
          <Button variant="outline">
            <FiSettings className="mr-2" />
            Vehicle Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Owned Vehicles</p>
                <p className="text-2xl font-bold">{mockOwnedCars.length}</p>
              </div>
              <AiFillCar className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  KES {(mockOwnedCars.reduce((sum, car) => sum + car.value, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <FiTrendingUp className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rentals Completed</p>
                <p className="text-2xl font-bold text-purple-600">{mockRentalHistory.length}</p>
              </div>
              <FiCheckCircle className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Insurance Status</p>
                <p className="text-2xl font-bold text-orange-600">Active</p>
              </div>
              <FiShield className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabsList>
          <TabsTrigger label="Owned Vehicles" selected={selectedTab === 'owned'} onClick={() => setSelectedTab('owned')} />
          <TabsTrigger label="Rental History" selected={selectedTab === 'history'} onClick={() => setSelectedTab('history')} />
        </TabsList>

        {selectedTab === 'owned' && (
          <TabsContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockOwnedCars.map((car) => {
                const serviceStatus = getServiceStatus(car.next_service);
                return (
                  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-64 bg-gray-200 relative">
                      <img 
                        src={car.car_image} 
                        alt={car.car_name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/1967-ford-mustang.png';
                        }}
                      />
                      <Badge className={`absolute top-2 right-2 ${serviceStatus.color}`}>{serviceStatus.text}</Badge>
                      <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800">{car.license_plate}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{car.car_name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <p><strong>Year:</strong> {car.year}</p>
                          <p><strong>Mileage:</strong> {car.mileage}</p>
                          <p><strong>Fuel:</strong> {car.fuel_type}</p>
                          <p><strong>Transmission:</strong> {car.transmission}</p>
                        </div>
                        <div>
                          <p><strong>Color:</strong> {car.color}</p>
                          <p><strong>Insurance:</strong> {car.insurance_status}</p>
                          <p><strong>Last Service:</strong> {formatDate(car.last_service)}</p>
                          <p><strong>Next Service:</strong> {formatDate(car.next_service)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Estimated Value</p>
                          <p className="text-lg font-bold text-green-600">KES {(car.value / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Service Status</p>
                          <Badge className={serviceStatus.color}>{serviceStatus.text}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1"><FiEdit2 className="mr-1" />Edit Details</Button>
                        <Button size="sm" variant="outline"><FiCalendar className="mr-1" />Schedule Service</Button>
                        <Button size="sm" variant="outline"><FiDownload className="mr-1" />Documents</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}

        {selectedTab === 'history' && (
          <TabsContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockRentalHistory.map((rental) => (
                <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={rental.car_image} 
                      alt={rental.car_name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/1967-ford-mustang.png';
                      }}
                    />
                    <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">{rental.status}</Badge>
                    <div className="absolute bottom-2 left-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`w-4 h-4 ${i < rental.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{rental.car_name}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2"><FiCalendar className="text-blue-500" /><span>{formatDate(rental.rental_date)} - {formatDate(rental.return_date)}</span></div>
                      <div className="flex items-center gap-2"><FiDollarSign className="text-green-500" /><span className="font-semibold">KES {rental.total_amount.toLocaleString()}</span></div>
                      <div className="flex items-center gap-2"><FiStar className="text-yellow-500" /><span>Rating: {rental.rating}/5</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1"><FiDownload className="mr-1" />Receipt</Button>
                      <Button size="sm" variant="outline"><FiStar className="mr-1" />Rate Again</Button>
                      <Button size="sm" variant="outline"><AiFillCar className="mr-1" />Rent Again</Button>
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