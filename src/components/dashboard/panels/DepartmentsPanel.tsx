import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiChevronLeft, FiChevronDown, FiChevronUp, FiUser } from 'react-icons/fi';
import { FaCar, FaKey, FaHeadset, FaBoxes, FaUserTie, FaFileAlt, FaChartBar, FaCogs, FaUserCircle, FaShieldAlt, FaGlobe, FaHandshake, FaTools, FaCubes, FaBoxOpen } from 'react-icons/fa';
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

const ADMIN = {
  name: localStorage.getItem('adminName') || 'Daniwest',
  avatar: localStorage.getItem('adminAvatar') || '/logo.png',
  role: 'Administrator',
};

const DEPARTMENT_LIST = [
  { key: 'overview', label: 'Departments Overview', icon: <FiMenu /> },
  { key: 'sales', label: 'Sales', icon: <FaCar /> },
  { key: 'rentals', label: 'Rentals', icon: <FaKey /> },
  { key: 'support', label: 'Customer Support', icon: <FaHeadset /> },
  { key: 'customer-service', label: 'Customer Service & After-Sales', icon: <FaHandshake /> },
  { key: 'inventory', label: 'Inventory', icon: <FaBoxes />, submenu: [
    { key: 'inventory-accessories', label: 'Accessories', icon: <FaCubes /> },
    { key: 'inventory-parts', label: 'Parts', icon: <FaTools /> },
    { key: 'inventory-stock', label: 'Stock', icon: <FaBoxOpen /> },
  ] },
  { key: 'hr', label: 'HR & Staff', icon: <FaUserTie /> },
  { key: 'documents', label: 'Documents', icon: <FaFileAlt /> },
  { key: 'bi', label: 'Business Intelligence', icon: <FaChartBar /> },
  { key: 'settings', label: 'System Settings', icon: <FaCogs /> },
  { key: 'profile', label: 'Admin Profile', icon: <FaUserCircle /> },
  { key: 'security', label: 'Access Logs & Security', icon: <FaShieldAlt /> },
  { key: 'i18n', label: 'Internationalization', icon: <FaGlobe /> },
];

const DEPARTMENT_COMPONENTS: Record<string, React.ReactNode> = {
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
  // Submenus (for demo, show InventoryDepartment)
  'inventory-accessories': <InventoryDepartment />,
  'inventory-parts': <InventoryDepartment />,
  'inventory-stock': <InventoryDepartment />,
};

function DepartmentsOverview({ onExplore }: { onExplore: (key: string) => void }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-8 py-8 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center"
           style={{ gridAutoRows: '1fr' }}>
        {DEPARTMENT_LIST.filter(d => d.key !== 'overview').map(dep => (
          <div
            key={dep.key}
            className="relative group bg-gradient-to-br from-blue-100/90 via-white/90 to-blue-200/90 dark:from-blue-900/90 dark:to-blue-800/90 glassmorphic shadow-lg rounded-xl flex flex-col items-center justify-center border border-blue-200 dark:border-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-10 cursor-pointer overflow-hidden w-full min-w-[210px] min-h-[210px] max-w-sm aspect-square m-4 ring-1 ring-blue-100 dark:ring-blue-900 hover:ring-4 hover:ring-blue-400"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-400/20 to-blue-700/20 pointer-events-none rounded-xl" />
            <div className="text-3xl mb-2 text-blue-600 dark:text-blue-300 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {dep.icon}
            </div>
            <div className="font-extrabold text-base md:text-lg mb-1 text-blue-900 dark:text-blue-100 tracking-tight text-center group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">
              {dep.label}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-xs text-center mb-2 px-2">
              Click to view <span className="font-semibold text-blue-700 dark:text-blue-200">{dep.label}</span> features & analytics
            </div>
            <button
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={e => { e.stopPropagation(); onExplore(dep.key); }}
              tabIndex={0}
            >
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const DepartmentsPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDept, setActiveDept] = useState('overview');
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sidebarOpen]);

  // Animated slide-in/out
  const sidebarClass = `fixed z-50 top-0 left-0 h-full w-80 max-w-full bg-white/90 dark:bg-gray-900/95 shadow-2xl glassmorphic border-r border-blue-200 dark:border-blue-900 transition-transform duration-500 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:w-72 md:shadow-none md:border-none`;

  // Collapsible submenu handler
  const handleSubmenuToggle = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Menu click handler
  const handleMenuClick = (key: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      handleSubmenuToggle(key);
    } else {
      setActiveDept(key);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[80vh]">
      {/* Sidebar (left) */}
      <div ref={sidebarRef} className={sidebarClass + ' md:h-screen md:sticky md:top-0'}>
        {/* Admin avatar & name */}
        <div className="flex items-center gap-4 p-6 border-b border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-900/80 to-blue-700/80 rounded-tr-2xl">
          <img src={ADMIN.avatar} alt="Admin Avatar" className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-lg" />
          <div>
            <div className="font-bold text-lg text-white drop-shadow">{ADMIN.name}</div>
            <div className="text-blue-200 text-xs font-semibold">{ADMIN.role}</div>
          </div>
        </div>
        {/* Hamburger/mega menu button and panel */}
        <div className="relative flex flex-col items-center mt-4">
          <button
            className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg flex items-center justify-center shadow-md"
            onClick={() => setOpenSubmenus(prev => ({ ...prev, mega: !prev.mega }))}
            aria-haspopup="true"
            aria-expanded={!!openSubmenus.mega}
          >
            <div className="space-y-1">
              <span className="block w-4 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
            </div>
          </button>
          {openSubmenus.mega && (
            <div className="absolute left-12 top-0 w-64 bg-white dark:bg-gray-900 shadow-2xl rounded-xl z-50 border border-blue-200 dark:border-blue-800 animate-fade-in">
              <ul className="divide-y divide-blue-100 dark:divide-blue-800">
                {DEPARTMENT_LIST.map(dep => (
                  <li key={dep.key} className="group">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-base font-semibold text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-800 transition-all"
                      onClick={() => { setActiveDept(dep.key); setOpenSubmenus(prev => ({ ...prev, mega: false })); setSidebarOpen(false); }}
                    >
                      <span className="text-xl">{dep.icon}</span>
                      <span>{dep.label}</span>
                    </button>
                    {dep.submenu && (
                      <ul className="ml-6 bg-blue-50 dark:bg-blue-900 rounded-lg mt-1">
                        {dep.submenu.map((sub: any) => (
                          <li key={sub.key}>
                            <button
                              className="w-full flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg"
                              onClick={() => { setActiveDept(sub.key); setOpenSubmenus(prev => ({ ...prev, mega: false })); setSidebarOpen(false); }}
                            >
                              <span className="text-lg">{sub.icon}</span>
                              <span>{sub.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden bg-blue-700 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-all"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>
      {/* Main content below menu, full width */}
      <main className="flex-1 w-full p-4 md:p-8 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/80 dark:to-blue-900/80 min-h-screen transition-all duration-300 flex flex-col items-center justify-center">
        <div className="animate-fade-in w-full flex flex-col items-center justify-center">
          {activeDept === 'overview'
            ? <DepartmentsOverview onExplore={setActiveDept} />
            : DEPARTMENT_COMPONENTS[activeDept]}
        </div>
      </main>
    </div>
  );
};

export default DepartmentsPanel; 