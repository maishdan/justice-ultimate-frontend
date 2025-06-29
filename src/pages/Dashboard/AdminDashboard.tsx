// src/pages/Dashboard/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth'; // ✅ Protect route
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

import { BarChart, LineChart, PieChart } from '../../components/dashboard/widgets/Charts';
import WelcomeCard from '../../components/dashboard/widgets/WelcomeCard';
import UserManagementPanel from '../../components/dashboard/panels/UserManagementPanel';
import SystemHealthMonitor from '../../components/dashboard/widgets/SystemHealthMonitor';
import NotificationsFeed from '../../components/dashboard/widgets/NotificationsFeed';
import ListingsManager from '../../components/dashboard/widgets/ListingsManager';
import TransactionManager from '../../components/dashboard/widgets/TransactionManager';
import ScheduleManager from '../../components/dashboard/widgets/ScheduleManager';
import AnalyticsPanel from '../../components/dashboard/widgets/AnalyticsPanel';
import SupportFeedbackPanel from '../../components/dashboard/widgets/SupportFeedbackPanel';
import SecurityPanel from '../../components/dashboard/widgets/SecurityPanel';
import ImpersonatorTool from '../../components/dashboard/widgets/ImpersonatorTool';
import ThemeAccessibilityControls from '../../components/dashboard/widgets/ThemeAccessibilityControls';
import LanguageCurrencySwitcher from '../../components/dashboard/widgets/LanguageCurrencySwitcher';

export default function AdminDashboard() {
  useAuth(); // 👈 Route protection added

  type Stats = {
    activeUsers: number;
    totalUsers: number;
    totalVehicles: number;
    pendingApprovals: number;
    dailySales: number;
    weeklySales: number;
    monthlySales: number;
  };

  const [stats, setStats] = useState<Stats>({
    activeUsers: 0,
    totalUsers: 0,
    totalVehicles: 0,
    pendingApprovals: 0,
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
  });

  const [selectedTab, setSelectedTab] = React.useState("users");

  useEffect(() => {
    axios.get('/api/admin/overview').then((res) => {
      setStats(res.data);
    });
  }, []);

  const tabOptions = [
    { label: "User Management", key: "users" },
    { label: "Vehicle Listings", key: "listings" },
    { label: "Transactions", key: "transactions" },
    { label: "Staff Scheduling", key: "schedules" },
    { label: "Advanced Analytics", key: "analytics" },
    { label: "Security", key: "security" },
    { label: "Support", key: "support" },
    { label: "Tools", key: "tools" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      
      <div className="flex justify-between p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Justice Ultimate Automobiles Admin Panel</h1>
        <LanguageCurrencySwitcher />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card><CardContent>Active Users: {stats.activeUsers}</CardContent></Card>
        <Card><CardContent>Registered Users: {stats.totalUsers}</CardContent></Card>
        <Card><CardContent>Vehicles Listed: {stats.totalVehicles}</CardContent></Card>
        <Card><CardContent>Pending Approvals: {stats.pendingApprovals}</CardContent></Card>
        <Card><CardContent>Daily Sales: {stats.dailySales}</CardContent></Card>
        <Card><CardContent>Weekly Sales: {stats.weeklySales}</CardContent></Card>
        <Card><CardContent>Monthly Sales: {stats.monthlySales}</CardContent></Card>
      </div>

      <div className="p-4">
        <WelcomeCard />

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

          {selectedTab === "users" && (
            <TabsContent>
              <UserManagementPanel />
            </TabsContent>
          )}

          {selectedTab === "listings" && (
            <TabsContent>
              <ListingsManager />
            </TabsContent>
          )}

          {selectedTab === "transactions" && (
            <TabsContent>
              <TransactionManager />
            </TabsContent>
          )}

          {selectedTab === "schedules" && (
            <TabsContent>
              <ScheduleManager />
            </TabsContent>
          )}

          {selectedTab === "analytics" && (
            <TabsContent>
              <AnalyticsPanel />
            </TabsContent>
          )}

          {selectedTab === "security" && (
            <TabsContent>
              <SecurityPanel />
            </TabsContent>
          )}

          {selectedTab === "support" && (
            <TabsContent>
              <SupportFeedbackPanel />
            </TabsContent>
          )}

          {selectedTab === "tools" && (
            <TabsContent>
              <>
                <ImpersonatorTool />
                <SystemHealthMonitor />
                <ThemeAccessibilityControls />
              </>
            </TabsContent>
          )}
        </Tabs>

        <div className="mt-6">
          <NotificationsFeed />
        </div>
      </div>
    </div>
  );
}
