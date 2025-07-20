import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectItem } from '../../components/ui/select';
import { Table, TableHeader, TableRow, TableCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { 
  FiUsers, 
  FiDollarSign, 
  FiCalendar, 
  FiBell, 
  FiSettings,
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiClock
} from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';
import LeadsWidget from '../../components/dashboard/crm/LeadsWidget';
import OpportunitiesWidget from '../../components/dashboard/crm/OpportunitiesWidget';
import ContactsWidget from '../../components/dashboard/crm/ContactsWidget';
import AccountsWidget from '../../components/dashboard/crm/AccountsWidget';
import ActivitiesWidget from '../../components/dashboard/crm/ActivitiesWidget';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function StaffDashboard() {
  useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeLeads: 0,
    monthlySales: 0,
    pendingAppointments: 0,
    vehiclesAvailable: 0,
    conversionRate: 0
  });

  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen text="Loading Staff Dashboard..." progress={progress} />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const { count: totalCustomers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      const { count: vehiclesAvailable } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Mock data for now - replace with actual Supabase queries
      setStats({
        totalCustomers: totalCustomers || 0,
        activeLeads: 25,
        monthlySales: 45000,
        pendingAppointments: 8,
        vehiclesAvailable: vehiclesAvailable || 0,
        conversionRate: 68
      });

      // Fetch leads, appointments, vehicles
      // Add actual Supabase queries here
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const tabOptions = [
    { label: "Overview", key: "overview", icon: <FiTrendingUp /> },
    { label: "CRM", key: "crm", icon: <FiUsers /> },
    { label: "Leads & Customers", key: "leads", icon: <FiUsers /> },
    { label: "Vehicle Management", key: "vehicles", icon: <AiFillCar /> },
    { label: "Sales & Revenue", key: "sales", icon: <FiDollarSign /> },
    { label: "Appointments", key: "appointments", icon: <FiCalendar /> },
    { label: "Performance", key: "performance", icon: <FiTarget /> },
    { label: "Settings", key: "settings", icon: <FiSettings /> }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col" style={{ paddingTop: '64px' }}>
      {/* Header/Info Tile at the very top, full width */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 md:p-6 w-full flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl shadow-xl mb-6">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Staff Dashboard</h1>
          <p className="text-gray-300">Manage customers, vehicles, and sales efficiently</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <FiBell className="mr-2" />
            Notifications
          </Button>
          <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400">
            <FiAward className="mr-2" />
            Performance
          </Button>
        </div>
      </div>
      {/* Main Panel Content below the info tile, filling the rest of the page */}
      <div className="p-4 md:p-6 w-full flex-1 flex flex-col items-center justify-start max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 w-full">
          {/* Stats Cards */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
                <FiUsers className="text-blue-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Leads</p>
                  <p className="text-2xl font-bold">{stats.activeLeads}</p>
                </div>
                <FiTarget className="text-green-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Monthly Sales</p>
                  <p className="text-2xl font-bold">${stats.monthlySales.toLocaleString()}</p>
                </div>
                <FiDollarSign className="text-yellow-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Appointments</p>
                  <p className="text-2xl font-bold">{stats.pendingAppointments}</p>
                </div>
                <FiCalendar className="text-purple-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Vehicles Available</p>
                  <p className="text-2xl font-bold">{stats.vehiclesAvailable}</p>
                </div>
                <AiFillCar className="text-red-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                </div>
                <FiTrendingUp className="text-green-400 text-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CRM Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 w-full">
          <LeadsWidget />
          <OpportunitiesWidget />
          <ContactsWidget />
          <AccountsWidget />
          <ActivitiesWidget />
        </div>

        {/* Tabs */}
        <Card className="bg-gray-800 border-gray-700 w-full">
          <CardContent className="p-6">
            <Tabs>
              <TabsList>
                {tabOptions.map((tab) => (
                  <TabsTrigger 
                    key={tab.key} 
                    label={tab.label}
                    selected={selectedTab === tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                  />
                ))}
              </TabsList>

              {selectedTab === "overview" && (
                <TabsContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <Card className="bg-gray-700 border-gray-600 w-full">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                              <div>
                                <p className="font-medium">John Doe {i}</p>
                                <p className="text-sm text-gray-300">Interested in BMW X5</p>
                              </div>
                              <Badge variant="outline">New</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-700 border-gray-600 w-full">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
                        <div className="space-y-3">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                              <div>
                                <p className="font-medium">Test Drive - {i}</p>
                                <p className="text-sm text-gray-300">2:00 PM - Mercedes S-Class</p>
                              </div>
                              <FiClock className="text-yellow-400" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
              {selectedTab === 'crm' && (
                <TabsContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    <LeadsWidget />
                    <OpportunitiesWidget />
                    <ContactsWidget />
                    <AccountsWidget />
                    <ActivitiesWidget />
                  </div>
                </TabsContent>
              )}
              {selectedTab === "leads" && (
                <TabsContent>
                  <div className="flex gap-4 mb-4 w-full">
                    <Input placeholder="Search leads..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                    </Select>
                    <Button>Add New Lead</Button>
                  </div>

                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Interest</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i}>
                          <TableCell>John Doe {i}</TableCell>
                          <TableCell>john{i}@example.com</TableCell>
                          <TableCell>+254 700 000 {i}</TableCell>
                          <TableCell>BMW X5</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {i % 2 === 0 ? "Qualified" : "New"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Contact</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TabsContent>
              )}
              {selectedTab === "vehicles" && (
                <TabsContent>
                  <div className="flex gap-4 mb-4 w-full">
                    <Input placeholder="Search vehicles..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                    </Select>
                    <Button>Add Vehicle</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <img 
                            src={`/images/BMW X5/${i}.jpg`} 
                            alt="Vehicle" 
                            className="w-full h-32 object-cover rounded mb-3"
                            onError={(e) => {
                              e.currentTarget.src = '/images/1967-ford-mustang.png';
                            }}
                          />
                          <h4 className="font-semibold">BMW X5 {i}</h4>
                          <p className="text-sm text-gray-300 mb-2">2023 Model • Automatic</p>
                          <p className="text-lg font-bold text-yellow-400">$85,000</p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="flex-1">View Details</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}
              {selectedTab === "sales" && (
                <TabsContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-400">This Month</p>
                        <p className="text-2xl font-bold text-green-400">$45,000</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-400">Last Month</p>
                        <p className="text-2xl font-bold text-blue-400">$38,000</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-400">Growth</p>
                        <p className="text-2xl font-bold text-yellow-400">+18.4%</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Vehicle</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i}>
                          <TableCell>John Doe {i}</TableCell>
                          <TableCell>BMW X5</TableCell>
                          <TableCell className="text-green-400">$85,000</TableCell>
                          <TableCell>2024-01-{i.toString().padStart(2, '0')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TabsContent>
              )}
              {selectedTab === "appointments" && (
                <TabsContent>
                  <div className="flex gap-4 mb-4 w-full">
                    <Input placeholder="Search appointments..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="test-drive">Test Drive</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </Select>
                    <Button>Schedule Appointment</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">Test Drive - {i}</h4>
                              <p className="text-sm text-gray-300">John Doe {i}</p>
                            </div>
                            <Badge variant="outline">
                              {i % 2 === 0 ? "Confirmed" : "Pending"}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><FiCalendar className="inline mr-2" />2024-01-{i.toString().padStart(2, '0')}</p>
                            <p><FiClock className="inline mr-2" />2:00 PM</p>
                            <p>BMW X5 • 2 hours</p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="flex-1">Confirm</Button>
                            <Button size="sm" variant="outline">Reschedule</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}
              {selectedTab === "performance" && (
                <TabsContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiTarget className="text-2xl text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Monthly Target</p>
                        <p className="text-xl font-bold">$50,000</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiTrendingUp className="text-2xl text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Achieved</p>
                        <p className="text-xl font-bold">$45,000</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiAward className="text-2xl text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Conversion Rate</p>
                        <p className="text-xl font-bold">68%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiUsers className="text-2xl text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Leads Generated</p>
                        <p className="text-xl font-bold">25</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-700 border-gray-600 w-full">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Sales Target Progress</span>
                            <span>90%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Lead Conversion</span>
                            <span>68%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{width: '68%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Customer Satisfaction</span>
                            <span>95%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{width: '95%'}}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {selectedTab === "settings" && (
                <TabsContent>
                  <Card className="bg-gray-700 border-gray-600 w-full">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <Input defaultValue="John Staff" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input defaultValue="staff@justiceauto.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <Input defaultValue="+254 700 000 000" />
                        </div>
                        <Button>Update Profile</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-gray-600 w-full">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Email Notifications</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS Notifications</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Lead Alerts</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}