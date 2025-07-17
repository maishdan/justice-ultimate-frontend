import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import WelcomeCard from '../../components/dashboard/widgets/WelcomeCard';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import CarManagementPanel from '../../components/dashboard/admin/CarManagementPanel';
import AdminProfilePanel from '../../components/dashboard/admin/AdminProfilePanel';
import BusinessHubPanel from '../../components/dashboard/admin/BusinessHubPanel';
import AnalyticsPanel from '../../components/dashboard/widgets/AnalyticsPanel';
import DashboardOverview from '../../components/dashboard/widgets/DashboardOverview';
import { ReceiptGenerator } from '../../components/ReceiptGenerator';
import UserManagementPanel from '../../components/dashboard/admin/UserManagementPanel';
import TransactionsPanel from '../../components/dashboard/admin/TransactionsPanel';
import SystemSettingsPanel from '../../components/dashboard/admin/SystemSettingsPanel';
import StaffPanel from '../../components/dashboard/panels/StaffPanel';
import DepartmentsPanel from '../../components/dashboard/panels/DepartmentsPanel';

// Stubs for main panels (to be implemented)
// DashboardOverview is now a real component
const AdminProfile = () => <AdminProfilePanel />;
const CarManagement = () => <CarManagementPanel />;
const BusinessHub = () => <BusinessHubPanel />;
const AnalyticsPanelComp = () => <AnalyticsPanel />;
const ReceiptsPanel = () => (
  <section className="max-w-2xl mx-auto mt-4 p-6 bg-white rounded-xl shadow-xl">
    <h2 className="text-2xl font-bold mb-4">Receipts (PDF, QR, Email)</h2>
    <ReceiptGenerator
      name="Daniwest"
      carName="Toyota Land Cruiser"
      amount={2500000}
      stockId="STK-2025-001"
    />
  </section>
);
const UserManagement = () => <UserManagementPanel />;
const TransactionsPanelComp = () => <TransactionsPanel />;
const SystemSettings = () => <SystemSettingsPanel />;
const StaffPanelComp = () => <StaffPanel />;
const DepartmentsPanelComp = () => <DepartmentsPanel />;
const InventoryPanel = () => <div className="p-6">Inventory (Parts, Accessories, Stock)</div>;
const ActivityLogs = () => <div className="p-6">Activity Logs (Actions, Errors, Access)</div>;
const BranchesPanel = () => <div className="p-6">Branches (Locations, Staff, Sales)</div>;

const PANEL_MAP: Record<string, React.ReactNode> = {
  dashboard: <DashboardOverview />,
  profile: <AdminProfile />,
  cars: <CarManagement />,
  business: <BusinessHub />,
  analytics: <AnalyticsPanelComp />,
  receipts: <ReceiptsPanel />,
  users: <UserManagement />,
  transactions: <TransactionsPanelComp />,
  settings: <SystemSettings />,
  staff: <StaffPanelComp />,
  departments: <DepartmentsPanelComp />,
  inventory: <InventoryPanel />,
  logs: <ActivityLogs />,
  branches: <BranchesPanel />,
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const [activePanel, setActivePanel] = useState('dashboard');
  const adminUser = { name: 'Daniwest', role: t('administrator') };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} admin />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <WelcomeCard user={adminUser} />
        <div className="mt-6 rounded-xl shadow-xl bg-white/80 dark:bg-gray-900/80 p-4 min-h-[60vh]">
          {PANEL_MAP[activePanel]}
        </div>
      </main>
    </div>
  );
}
