import React, { useState } from 'react';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';
import { FaCar, FaKey, FaHeadset, FaBoxes, FaUserTie, FaFileAlt, FaChartBar, FaCogs, FaUserCircle, FaShieldAlt, FaGlobe, FaHandshake } from 'react-icons/fa';
import SalesDepartment from './departments/SalesDepartment';
import RentalsDepartment from './departments/RentalsDepartment';
import CustomerSupportDepartment from './departments/CustomerSupportDepartment';
import CustomerServiceDepartment from './departments/CustomerServiceDepartment';
import InventoryDepartment from './departments/InventoryDepartment';
import HRDepartment from './departments/HRDepartment';
import DocumentsDepartment from './departments/DocumentsDepartment';
import BusinessIntelligenceDepartment from './departments/BusinessIntelligenceDepartment';
import SystemSettingsDepartment from './departments/SystemSettingsDepartment';
import AdminProfileDepartment from './departments/AdminProfileDepartment';
import SecurityDepartment from './departments/SecurityDepartment';
import I18nDepartment from './departments/I18nDepartment';
// ... (import other department components as you create them)

const DEPARTMENT_LIST = [
  { key: 'overview', label: 'Departments Overview', icon: <FiMenu /> },
  { key: 'sales', label: 'Sales', icon: <FaCar /> },
  { key: 'rentals', label: 'Rentals', icon: <FaKey /> },
  { key: 'support', label: 'Customer Support', icon: <FaHeadset /> },
  { key: 'customer-service', label: 'Customer Service & After-Sales', icon: <FaHandshake /> },
  { key: 'inventory', label: 'Inventory', icon: <FaBoxes /> },
  { key: 'hr', label: 'HR & Staff', icon: <FaUserTie /> },
  { key: 'documents', label: 'Documents', icon: <FaFileAlt /> },
  { key: 'bi', label: 'Business Intelligence', icon: <FaChartBar /> },
  { key: 'settings', label: 'System Settings', icon: <FaCogs /> },
  { key: 'profile', label: 'Admin Profile', icon: <FaUserCircle /> },
  { key: 'security', label: 'Access Logs & Security', icon: <FaShieldAlt /> },
  { key: 'i18n', label: 'Internationalization', icon: <FaGlobe /> },
];

const DepartmentsOverview = () => (
  <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {DEPARTMENT_LIST.filter(d => d.key !== 'overview').map(dep => (
      <div key={dep.key} className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-2xl transition cursor-pointer">
        <div className="text-4xl mb-4 text-blue-600">{dep.icon}</div>
        <div className="font-bold text-lg mb-2">{dep.label}</div>
        <div className="text-gray-500 text-sm text-center">Click to view {dep.label} features & analytics</div>
      </div>
    ))}
  </div>
);

const DEPARTMENT_COMPONENTS: Record<string, React.ReactNode> = {
  overview: <DepartmentsOverview />,
  sales: <SalesDepartment />,
  rentals: <RentalsDepartment />,
  support: <CustomerSupportDepartment />,
  'customer-service': <CustomerServiceDepartment />,
  inventory: <InventoryDepartment />,
  hr: <HRDepartment />,
  documents: <DocumentsDepartment />,
  bi: <BusinessIntelligenceDepartment />,
  settings: <SystemSettingsDepartment />,
  profile: <AdminProfileDepartment />,
  security: <SecurityDepartment />,
  i18n: <I18nDepartment />,
};

const DepartmentsPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDept, setActiveDept] = useState('overview');

  const handleMenuClick = (key: string) => {
    setActiveDept(key);
    setSidebarOpen(false); // auto-close on mobile
  };

  return (
    <div className="flex h-full min-h-[80vh]">
      {/* Sidebar */}
      <div className={`fixed z-30 md:static top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 md:w-60 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <span className="font-bold text-xl text-blue-700">Departments</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><FiChevronLeft size={24} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {DEPARTMENT_LIST.map(dep => (
            <button
              key={dep.key}
              className={`w-full flex items-center px-6 py-3 text-left text-base font-medium transition hover:bg-blue-50 dark:hover:bg-gray-800 ${activeDept === dep.key ? 'bg-blue-100 dark:bg-gray-800 text-blue-700 font-bold' : 'text-gray-700 dark:text-gray-200'}`}
              onClick={() => handleMenuClick(dep.key)}
            >
              <span className="mr-3 text-lg">{dep.icon}</span> {dep.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-800"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open departments menu"
      >
        <FiMenu size={28} />
      </button>
      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-60 p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-all duration-300">
        {DEPARTMENT_COMPONENTS[activeDept]}
      </div>
    </div>
  );
};

export default DepartmentsPanel; 