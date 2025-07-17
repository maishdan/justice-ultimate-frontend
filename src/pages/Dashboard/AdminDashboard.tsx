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
import { motion } from 'framer-motion';
// Add import for InboxPanel (to be implemented)
import InboxPanel from '../../components/dashboard/widgets/InboxPanel';

// Enhanced accessibility and performance hooks
const useKeyboardNavigation = () => {
  const [focusedPanel, setFocusedPanel] = useState('dashboard');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        const panels = ['dashboard', 'profile', 'cars', 'business', 'analytics', 'receipts', 'users', 'transactions', 'settings'];
        const index = parseInt(e.key) - 1;
        if (panels[index]) {
          setFocusedPanel(panels[index]);
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
    <div className="dashboard-layout" role="application" aria-label="Justice Ultimate Automobiles Admin Dashboard">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-green-600 text-white p-3 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={sidebarOpen}
        aria-controls="dashboard-sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Enhanced Sidebar */}
      <aside 
        id="dashboard-sidebar"
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Sidebar 
          activePanel={activePanel} 
          setActivePanel={handlePanelChange} 
          admin 
        />
      </aside>

      {/* Main Content Area */}
      <main 
        id="main-content"
        className="dashboard-main"
        role="main"
        aria-label="Dashboard content"
      >
        {/* Enhanced Header with Accessibility */}
        <motion.header
          className="sticky top-0 z-40 bg-gradient-to-r from-blue-900/90 via-green-900/90 to-yellow-100/80 dark:from-blue-900/90 dark:via-green-900/90 dark:to-yellow-200/80 backdrop-blur-2xl border-b-4 border-yellow-400/60 shadow-xl px-2 md:px-8 py-3"
          initial={{ opacity: 0, y: -30, clipPath: 'ellipse(60% 10% at 50% 0%)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'ellipse(120% 120% at 50% 50%)' }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.28 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 w-full">
            <div className="flex items-center gap-4 w-full md:w-auto min-w-0">
              <img src="https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg border-2 border-white/40 bg-white/20" />
              <div className="flex flex-col min-w-0">
                <span className="text-2xl md:text-3xl font-extrabold text-yellow-400 drop-shadow-glow leading-tight truncate">Justice Admin Dashboard</span>
                <span className="flex items-center gap-2 text-green-200 font-bold text-xs md:text-sm mt-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-end">
              {/* Keyboard shortcuts help */}
              <div className="relative">
                <button
                  ref={shortcutsBtnRef}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 text-blue-900 font-extrabold shadow-lg border-2 border-yellow-300 hover:from-yellow-300 hover:to-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
                  aria-label="Keyboard shortcuts"
                  onClick={() => setShowShortcuts(v => !v)}
                  aria-expanded={showShortcuts}
                  aria-controls="shortcuts-modal"
                >
                  ⌨️ Shortcuts
                </button>
                {showShortcuts && (
                  <div
                    id="shortcuts-modal"
                    className="absolute right-0 mt-2 w-72 max-w-full bg-white dark:bg-gray-900 border border-yellow-400 rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-2 animate-fade-in"
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                  >
                    <h4 className="font-bold mb-2 text-yellow-500 text-lg">Keyboard Shortcuts</h4>
                    <div className="flex flex-col gap-1">
                      {sidebarMenuItems.map((shortcut, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 px-2 py-1 rounded-lg shadow font-bold text-blue-900 text-sm border border-yellow-300">
                          <kbd className="bg-gray-900 text-yellow-300 px-2 py-1 rounded font-mono text-xs shadow-inner">{shortcut.shortcut}</kbd>
                          <span className="ml-1 text-blue-900 font-semibold truncate">{shortcut.label}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-3 px-3 py-1 rounded bg-yellow-400 text-blue-900 font-bold shadow hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      onClick={() => { setShowShortcuts(false); shortcutsBtnRef.current?.focus(); }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
              {/* Current panel indicator */}
              <div className="hidden md:block">
                <span className="text-base text-blue-900 dark:text-yellow-200 font-bold">
                  Current: <span className="font-extrabold text-yellow-500 dark:text-yellow-300">
                    {activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Welcome Section */}
          <section role="region" aria-label="Welcome and user information">
        <WelcomeCard user={adminUser} />
          </section>

          {/* Main Panel Content */}
          <section 
            className="enhanced-card p-4 md:p-6 min-h-[60vh]"
            role="region" 
            aria-label={`${activePanel} panel content`}
            aria-live="polite"
          >
          {PANEL_MAP[activePanel]}
          </section>

          {/* Enhanced Footer */}
          <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            <p>
              Justice Ultimate Automobiles Admin Dashboard v2.0 | 
              <span className="mx-2">•</span>
              Last updated: {new Date().toLocaleDateString()}
              <span className="mx-2">•</span>
              Session: {localStorage.getItem('sessionId')?.slice(-8) || 'N/A'}
            </p>
          </footer>
        </div>
      </main>

      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
