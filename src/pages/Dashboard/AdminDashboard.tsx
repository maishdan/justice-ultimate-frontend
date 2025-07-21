import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import WelcomeCard from '../../components/dashboard/widgets/WelcomeCard';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import CarManagementPanel from '../../components/dashboard/admin/CarManagementPanel';
import AdminProfilePanel from '../../components/dashboard/admin/AdminProfilePanel';
import BusinessHubPanel from '../../components/dashboard/admin/BusinessHubPanel';
import AnalyticsPanel from '../../components/dashboard/widgets/AnalyticsPanel';
import AdvancedAnalyticsPanel from '../../components/dashboard/widgets/AdvancedAnalyticsPanel';
import AutomationManager from '../../components/dashboard/widgets/AutomationManager';
import NotificationCenter from '../../components/dashboard/widgets/NotificationCenter';
import SystemMonitor from '../../components/dashboard/widgets/SystemMonitor';
import IntegrationHub from '../../components/dashboard/widgets/IntegrationHub';
import DashboardOverview from '../../components/dashboard/widgets/DashboardOverview';
import { ReceiptGenerator } from '../../components/ReceiptGenerator';
import UserManagementPanel from '../../components/dashboard/admin/UserManagementPanel';
import TransactionsPanel from '../../components/dashboard/admin/TransactionsPanel';
import SystemSettingsPanel from '../../components/dashboard/admin/SystemSettingsPanel';
import StaffPanel from '../../components/dashboard/panels/StaffPanel';
import DepartmentsPanel from '../../components/dashboard/panels/DepartmentsPanel';
import LoadingScreen from '../../components/ui/LoadingScreen';
import InventoryPanel from './InventoryPanel';
import ActivityLogsPanel from '../../components/dashboard/widgets/ActivityLogsPanel';
import BranchesPanel from '../../components/dashboard/widgets/BranchesPanel';
// Add import for InboxPanel (to be implemented)
import InboxPanel from '../../components/dashboard/widgets/InboxPanel';
import SecurityEventsTable from '../../components/security/SecurityEventsTable';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import SessionManager from '../../components/dashboard/widgets/SessionManager';
import RoleTestPanel from '../../components/RoleTestPanel';
import RightSidebarMenu from '../../components/dashboard/RightSidebarMenu';

// Enhanced accessibility and performance hooks
const useKeyboardNavigation = () => {
  const [focusedPanel, setFocusedPanel] = useState('dashboard');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        const key = e.key.toLowerCase();
        
        // Number shortcuts (Alt + 1-9)
        if (key >= '1' && key <= '9') {
          const panels = ['dashboard', 'profile', 'cars', 'business', 'analytics', 'receipts', 'users', 'transactions', 'settings'];
          const index = parseInt(key) - 1;
          if (panels[index]) {
            setFocusedPanel(panels[index]);
          }
        }
        
        // Letter shortcuts
        switch (key) {
          case 'a':
            setFocusedPanel('advancedAnalytics');
            break;
          case 'm':
            setFocusedPanel('automation');
            break;
          case 'n':
            setFocusedPanel('notifications');
            break;
          case 'q':
            setFocusedPanel('inbox');
            break;
          case 's':
            setFocusedPanel('sessions');
            break;
          case 'i':
            setFocusedPanel('integrations');
            break;
          case 'l':
            setFocusedPanel('logs');
            break;
          case 'b':
            setFocusedPanel('branches');
            break;
          case 'd':
            setFocusedPanel('departments');
            break;
          case '0':
            setFocusedPanel('staff');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return { focusedPanel, setFocusedPanel };
};

// Enhanced loading state management
const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false);
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, []);
  
  return { isLoading, loadingProgress };
};

// Stubs for main panels (to be implemented)
// DashboardOverview is now a real component
const AdminProfile = () => <AdminProfilePanel />;
const CarManagement = () => <CarManagementPanel />;
const BusinessHub = () => <BusinessHubPanel />;
const AnalyticsPanelComp = () => <AnalyticsPanel />;
const AdvancedAnalyticsPanelComp = () => <AdvancedAnalyticsPanel />;
const AutomationManagerComp = () => <AutomationManager />;
const NotificationCenterComp = () => <NotificationCenter />;
const SystemMonitorComp = () => <SystemMonitor />;
const IntegrationHubComp = () => <IntegrationHub />;
const ReceiptsPanel = () => (
  <section className="enhanced-card p-6" role="region" aria-label="Receipts Management">
    <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-200">Receipts (PDF, QR, Email)</h2>
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
const InventoryPanelComp = () => <InventoryPanel />;
const ActivityLogs = () => <ActivityLogsPanel />;
const BranchesPanelComp = () => <BranchesPanel />;

const PANEL_MAP: Record<string, React.ReactNode> = {
  dashboard: <DashboardOverview />,
  profile: <AdminProfile />,
  cars: <CarManagement />,
  business: <BusinessHub />,
  analytics: <AnalyticsPanelComp />,
  advancedAnalytics: <AdvancedAnalyticsPanelComp />,
  automation: <AutomationManagerComp />,
  notifications: <NotificationCenterComp />,
  inbox: <InboxPanel />, // Add inbox panel here
  monitor: <SystemMonitorComp />,
  integrations: <IntegrationHubComp />,
  receipts: <ReceiptsPanel />,
  users: <UserManagement />,
  transactions: <TransactionsPanelComp />,
  settings: <SystemSettings />,
  staff: <StaffPanelComp />,
  departments: <DepartmentsPanelComp />,
  inventory: <InventoryPanelComp />,
  logs: <ActivityLogs />,
  branches: <BranchesPanelComp />,
  sessions: <SessionManager />,
  roleTest: <RoleTestPanel />,
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const [activePanel, setActivePanel] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { focusedPanel, setFocusedPanel } = useKeyboardNavigation();
  const { isLoading, loadingProgress } = useLoadingState();
  const adminUser = { name: 'Daniwest', role: t('administrator') };

  // Sync focused panel with active panel
  useEffect(() => {
    setFocusedPanel(activePanel);
  }, [activePanel, setFocusedPanel]);

  // Keyboard shortcuts info (read from sidebar menuItems)
  const sidebarMenuItems = [
    { key: 'dashboard', label: 'Dashboard', shortcut: 'Alt + 1' },
    { key: 'profile', label: 'Profile', shortcut: 'Alt + 2' },
    { key: 'cars', label: 'Cars', shortcut: 'Alt + 3' },
    { key: 'business', label: 'Business Hub', shortcut: 'Alt + 4' },
    { key: 'analytics', label: 'Analytics', shortcut: 'Alt + 5' },
    { key: 'advancedAnalytics', label: 'Advanced Analytics', shortcut: 'Alt + A' },
    { key: 'automation', label: 'Automation', shortcut: 'Alt + M' },
    { key: 'notifications', label: 'Notifications', shortcut: 'Alt + N' },
    { key: 'monitor', label: 'System Monitor', shortcut: 'Alt + S' },
    { key: 'integrations', label: 'Integrations', shortcut: 'Alt + I' },
    { key: 'receipts', label: 'Receipts', shortcut: 'Alt + 6' },
    { key: 'users', label: 'User Management', shortcut: 'Alt + 7' },
    { key: 'transactions', label: 'Transactions', shortcut: 'Alt + 8' },
    { key: 'settings', label: 'Settings', shortcut: 'Alt + 9' },
    { key: 'staff', label: 'Staff Panel', shortcut: 'Alt + 0' },
    { key: 'departments', label: 'Departments', shortcut: 'Alt + D' },
    { key: 'inventory', label: 'Inventory', shortcut: 'Alt + I' },
    { key: 'logs', label: 'Activity Logs', shortcut: 'Alt + L' },
    { key: 'branches', label: 'Branches', shortcut: 'Alt + B' },
  ];
  const shortcutKeyMap = Object.fromEntries(sidebarMenuItems.map(item => [item.shortcut.replace('Alt + ', '').toLowerCase(), item.key]));
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcutsBtnRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcut handler for all sidebar shortcuts
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        let key = e.key.toLowerCase();
        if (shortcutKeyMap[key]) {
          setActivePanel(shortcutKeyMap[key]);
          setFocusedPanel(shortcutKeyMap[key]);
          e.preventDefault();
        }
      }
      // Escape closes shortcuts modal
      if (showShortcuts && e.key === 'Escape') {
        setShowShortcuts(false);
        shortcutsBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [setActivePanel, setFocusedPanel, showShortcuts, shortcutKeyMap]);

  // Handle panel change with accessibility
  const handlePanelChange = (panel: string) => {
    setActivePanel(panel);
    setFocusedPanel(panel);
    // Close sidebar on mobile after panel selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return <LoadingScreen text="Loading Justice Admin Dashboard..." progress={loadingProgress} />;
  }

  return (
    <div
      className="min-h-screen w-full flex pt-0 clean-container"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Right Sidebar Menu - fixed top right */}
      <RightSidebarMenu activePanel={activePanel} setActivePanel={setActivePanel} />
      {/* Main Content Area */}
      <main 
        id="main-content"
        className="dashboard-main w-full min-w-0 flex-1 flex flex-col overflow-x-auto p-2 sm:p-4 md:p-6 lg:p-8"
        role="main"
        aria-label="Dashboard content"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(2px) saturate(120%)',
          WebkitBackdropFilter: 'blur(2px) saturate(120%)',
          borderRadius: '2rem',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)'
        }}
      >
        {/* Welcome/Info Tile at the very top, full width */}
        <section role="region" aria-label="Welcome and user information" className="glass-panel mb-6 w-full max-w-4xl mx-auto rounded-2xl p-6 flex flex-col items-center justify-center">
          <WelcomeCard user={adminUser} setActivePanel={setActivePanel} onLogout={() => {}} />
        </section>
        {/* Main Panel Content below the info tile, filling the rest of the page */}
        <section 
          className="enhanced-card p-4 md:p-6 min-h-[60vh] flex flex-col items-center justify-start w-full max-w-6xl mx-auto"
          role="region" 
          aria-label={`${activePanel} panel content`}
          aria-live="polite"
        >
          {PANEL_MAP[activePanel] || (
            <div className="text-center text-2xl font-bold text-yellow-400">
              Welcome to your Admin Dashboard! Select a panel to get started.
            </div>
          )}
          {activePanel === 'monitor' && (
            <SecurityEventsTable />
          )}
        </section>
        {/* Enhanced Footer */}
        <footer className="glass-panel text-center text-sm text-gray-200 dark:text-gray-400 py-4 mt-8">
          <p>
            Justice Ultimate Automobiles Admin Dashboard v2.0 | 
            <span className="mx-2">•</span>
            Last updated: {new Date().toLocaleDateString()}
            <span className="mx-2">•</span>
            Session: {localStorage.getItem('sessionId')?.slice(-8) || 'N/A'}
          </p>
        </footer>
      </main>
      {/* Mobile overlay for sidebar */}
      {/* Removed sidebar overlay */}
    </div>
  );
}
