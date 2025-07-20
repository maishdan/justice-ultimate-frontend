import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectItem } from '../../components/ui/select';
import { Table, TableHeader, TableRow, TableCell, TableHeaderCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { 
  FiTool, 
  FiClock, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiSettings,
  FiTrendingUp,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiShield
} from 'react-icons/fi';
import { AiFillCar, AiOutlineTool } from 'react-icons/ai';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function MechanicDashboard() {
  useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const [stats, setStats] = useState({
    activeWorkOrders: 0,
    completedToday: 0,
    pendingDiagnostics: 0,
    totalVehicles: 0,
    averageRepairTime: 0,
    customerSatisfaction: 0
  });

  const [workOrders, setWorkOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');

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
    return <LoadingScreen text="Loading Mechanic Dashboard..." progress={progress} />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from Supabase
      const { count: totalVehicles } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });

      // Mock data for now - replace with actual Supabase queries
      setStats({
        activeWorkOrders: 8,
        completedToday: 5,
        pendingDiagnostics: 3,
        totalVehicles: totalVehicles || 0,
        averageRepairTime: 2.5,
        customerSatisfaction: 96
      });

      // Fetch work orders, vehicles, diagnostics
      // Add actual Supabase queries here
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const tabOptions = [
    { label: "Overview", key: "overview", icon: <FiTrendingUp /> },
    { label: "Work Orders", key: "workorders", icon: <FiTool /> },
    { label: "Vehicle Diagnostics", key: "diagnostics", icon: <AiOutlineTool /> },
    { label: "Service History", key: "history", icon: <FiCalendar /> },
    { label: "Parts Inventory", key: "inventory", icon: <FiShield /> },
    { label: "Performance", key: "performance", icon: <FiCheckCircle /> },
    { label: "Settings", key: "settings", icon: <FiSettings /> }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col" style={{ paddingTop: '64px' }}>
      {/* Header/Info Tile at the very top, full width */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 md:p-6 w-full flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl shadow-xl mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-400">Mechanic Dashboard</h1>
          <p className="text-gray-300">Professional vehicle service and maintenance management</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <FiAlertTriangle className="mr-2" />
            Alerts
          </Button>
          <Button size="sm" className="bg-orange-500 text-black hover:bg-orange-400">
            <FiTool className="mr-2" />
            New Work Order
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
                  <p className="text-sm text-gray-400">Active Work Orders</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.activeWorkOrders}</p>
                </div>
                <FiTool className="text-orange-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed Today</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completedToday}</p>
                </div>
                <FiCheckCircle className="text-green-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Diagnostics</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pendingDiagnostics}</p>
                </div>
                <AiOutlineTool className="text-yellow-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Vehicles</p>
                  <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                </div>
                <AiFillCar className="text-blue-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Repair Time</p>
                  <p className="text-2xl font-bold">{stats.averageRepairTime}h</p>
                </div>
                <FiClock className="text-purple-400 text-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Customer Satisfaction</p>
                  <p className="text-2xl font-bold">{stats.customerSatisfaction}%</p>
                </div>
                <FiUser className="text-green-400 text-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <Tabs>
              <TabsList className="grid w-full grid-cols-7 bg-gray-700">
                {tabOptions.map((tab) => (
                  <TabsTrigger 
                    key={tab.key} 
                    label={tab.label}
                    selected={selectedTab === tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                  />
                ))}
              </TabsList>

              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <TabsContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Active Work Orders</h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                              <div>
                                <p className="font-medium">BMW X5 - Engine Check</p>
                                <p className="text-sm text-gray-300">Order #{1000 + i} • In Progress</p>
                              </div>
                              <Badge variant="info">Priority {i}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
                        <div className="space-y-3">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                              <div>
                                <p className="font-medium">Mercedes S-Class Service</p>
                                <p className="text-sm text-gray-300">9:00 AM - Oil Change & Inspection</p>
                              </div>
                              <FiClock className="text-orange-400" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          <FiTool className="mr-2" />
                          New Work Order
                        </Button>
                        <Button variant="outline">
                          <AiOutlineTool className="mr-2" />
                          Run Diagnostics
                        </Button>
                        <Button variant="outline">
                          <FiCalendar className="mr-2" />
                          Schedule Service
                        </Button>
                        <Button variant="outline">
                          <FiShield className="mr-2" />
                          Check Inventory
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Work Orders Tab */}
              {selectedTab === 'workorders' && (
                <TabsContent>
                  <div className="flex gap-4 mb-4">
                    <Input placeholder="Search work orders..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </Select>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <FiTool className="mr-2" />
                      Create Work Order
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Order #</TableHeaderCell>
                        <TableHeaderCell>Vehicle</TableHeaderCell>
                        <TableHeaderCell>Service Type</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Priority</TableHeaderCell>
                        <TableHeaderCell>Assigned To</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableRow>
                      <TableCell>WO-{1000 + 1}</TableCell>
                      <TableCell>BMW X5 1</TableCell>
                      <TableCell>Engine Diagnostic</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="info">Medium</Badge>
                      </TableCell>
                      <TableCell>Mechanic 1</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>WO-{1000 + 2}</TableCell>
                      <TableCell>BMW X5 2</TableCell>
                      <TableCell>Oil Change & Inspection</TableCell>
                      <TableCell>
                        <Badge variant="info">In Progress</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="danger">High</Badge>
                      </TableCell>
                      <TableCell>Mechanic 2</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>WO-{1000 + 3}</TableCell>
                      <TableCell>BMW X5 3</TableCell>
                      <TableCell>Brake Repair</TableCell>
                      <TableCell>
                        <Badge variant="warning">Pending</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Low</Badge>
                      </TableCell>
                      <TableCell>Mechanic 1</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Details</Button>
                      </TableCell>
                    </TableRow>
                  </Table>
                </TabsContent>
              )}

              {/* Diagnostics Tab */}
              {selectedTab === 'diagnostics' && (
                <TabsContent>
                  <div className="flex gap-4 mb-4">
                    <Input placeholder="Search vehicles..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                    </Select>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <AiOutlineTool className="mr-2" />
                      Run New Diagnostic
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">BMW X5 {i}</h4>
                              <p className="text-sm text-gray-300">VIN: BMW123456789{i}</p>
                            </div>
                            <Badge variant={i % 2 === 0 ? "default" : "danger"}>
                              {i % 2 === 0 ? "Healthy" : "Issues Found"}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm mb-3">
                            <p><FiClock className="inline mr-2" />Last Check: 2024-01-{i.toString().padStart(2, '0')}</p>
                            <p><FiCheckCircle className="inline mr-2" />Engine: {i % 2 === 0 ? "OK" : "Warning"}</p>
                            <p><FiCheckCircle className="inline mr-2" />Transmission: OK</p>
                            <p><FiCheckCircle className="inline mr-2" />Brakes: OK</p>
                          </div>

                          {i % 2 === 1 && (
                            <div className="bg-red-900/50 p-2 rounded mb-3">
                              <p className="text-sm text-red-300">
                                ⚠️ Engine temperature sensor showing irregular readings
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
                              Run Diagnostic
                            </Button>
                            <Button size="sm" variant="outline">View Report</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Service History Tab */}
              {selectedTab === 'history' && (
                <TabsContent>
                  <div className="flex gap-4 mb-4">
                    <Input placeholder="Search service history..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                    </Select>
                    <Button variant="outline">Export Report</Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Date</TableHeaderCell>
                        <TableHeaderCell>Vehicle</TableHeaderCell>
                        <TableHeaderCell>Service Type</TableHeaderCell>
                        <TableHeaderCell>Technician</TableHeaderCell>
                        <TableHeaderCell>Cost</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableRow>
                      <TableCell>2024-01-01</TableCell>
                      <TableCell>BMW X5 1</TableCell>
                      <TableCell>Oil Change & Inspection</TableCell>
                      <TableCell>Mechanic 1</TableCell>
                      <TableCell className="text-green-400">${150}</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-01-02</TableCell>
                      <TableCell>BMW X5 2</TableCell>
                      <TableCell>Brake Repair</TableCell>
                      <TableCell>Mechanic 2</TableCell>
                      <TableCell className="text-red-400">${500}</TableCell>
                      <TableCell>
                        <Badge variant="warning">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-01-03</TableCell>
                      <TableCell>BMW X5 3</TableCell>
                      <TableCell>General Maintenance</TableCell>
                      <TableCell>Mechanic 1</TableCell>
                      <TableCell className="text-blue-400">${200}</TableCell>
                      <TableCell>
                        <Badge variant="info">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  </Table>
                </TabsContent>
              )}

              {/* Parts Inventory Tab */}
              {selectedTab === 'inventory' && (
                <TabsContent>
                  <div className="flex gap-4 mb-4">
                    <Input placeholder="Search parts..." className="flex-1" />
                    <Select>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="engine">Engine Parts</SelectItem>
                      <SelectItem value="brakes">Brake Parts</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                    </Select>
                    <Button className="bg-orange-500 hover:bg-orange-600">Add Part</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">Oil Filter {i}</h4>
                              <p className="text-sm text-gray-300">Part #: OF-{1000 + i}</p>
                            </div>
                            <Badge variant={i % 3 === 0 ? "danger" : i % 3 === 1 ? "info" : "default"}>
                              {i % 3 === 0 ? "Low Stock" : i % 3 === 1 ? "Medium" : "In Stock"}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm mb-3">
                            <p>Quantity: {10 - i}</p>
                            <p>Price: ${15 + (i * 2)}</p>
                            <p>Category: Engine Parts</p>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">Order More</Button>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Performance Tab */}
              {selectedTab === 'performance' && (
                <TabsContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiCheckCircle className="text-2xl text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Work Orders Completed</p>
                        <p className="text-xl font-bold">156</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiClock className="text-2xl text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Avg Repair Time</p>
                        <p className="text-xl font-bold">2.5h</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiUser className="text-2xl text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Customer Rating</p>
                        <p className="text-xl font-bold">4.8/5</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 text-center">
                        <FiDollarSign className="text-2xl text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Revenue Generated</p>
                        <p className="text-xl font-bold">$12,450</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Work Order Completion Rate</span>
                            <span>95%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{width: '95%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Customer Satisfaction</span>
                            <span>96%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{width: '96%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>On-Time Completion</span>
                            <span>88%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{width: '88%'}}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Settings Tab */}
              {selectedTab === 'settings' && (
                <TabsContent>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <Input defaultValue="John Mechanic" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input defaultValue="mechanic@justiceauto.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Specialization</label>
                          <Select>
                            <SelectItem value="engine">Engine Specialist</SelectItem>
                            <SelectItem value="electrical">Electrical Specialist</SelectItem>
                            <SelectItem value="general">General Mechanic</SelectItem>
                          </Select>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600">Update Profile</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Work Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Email Notifications</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS Alerts</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Auto-assign Work Orders</span>
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