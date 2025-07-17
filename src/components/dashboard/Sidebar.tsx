import { useLanguage } from '../../context/LanguageContext';
import {
  FiHome, FiUser, FiSettings, FiLogOut, FiTruck, FiCalendar, FiCreditCard, FiBell, FiMap, FiGift, FiShield, FiDollarSign, FiBarChart2, FiFileText, FiUsers, FiTool, FiBox, FiClock, FiBriefcase, FiLayers, FiGlobe
} from 'react-icons/fi';

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  admin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePanel, setActivePanel, admin }) => {
  const { t } = useLanguage();
  const menuItems = [
    { name: t('dashboard'), key: 'dashboard', icon: <FiHome /> },
    { name: t('adminProfile'), key: 'profile', icon: <FiUser /> },
    { name: t('carsManagement'), key: 'cars', icon: <FiTruck /> },
    { name: t('businessHub'), key: 'business', icon: <FiBriefcase /> },
    { name: t('analytics'), key: 'analytics', icon: <FiBarChart2 /> },
    { name: t('receipts'), key: 'receipts', icon: <FiFileText /> },
    { name: t('userManagement'), key: 'users', icon: <FiUsers /> },
    { name: t('transactions'), key: 'transactions', icon: <FiDollarSign /> },
    { name: t('settings'), key: 'settings', icon: <FiSettings /> },
    { name: t('staffPanel'), key: 'staff', icon: <FiTool /> },
    { name: t('departments'), key: 'departments', icon: <FiLayers /> },
    { name: t('inventory'), key: 'inventory', icon: <FiBox /> },
    { name: t('activityLogs'), key: 'logs', icon: <FiClock /> },
    { name: t('branches'), key: 'branches', icon: <FiGlobe /> },
  ];

  return (
    <aside className="w-72 bg-green-950 text-white min-h-screen p-4 shadow-xl hidden md:block">
      <div className="text-2xl font-bold mb-8 text-center">Justice Admin</div>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setActivePanel(item.key)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all hover:bg-green-700 hover:shadow-lg ${
                activePanel === item.key ? 'bg-green-700 font-semibold' : 'bg-green-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <button className="flex items-center gap-2 mx-auto px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition">
          <FiLogOut /> {t('logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
