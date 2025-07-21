import { FC } from 'react';
import { FiLogOut } from 'react-icons/fi';

interface RightSidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const menuItems = [
  { name: 'Dashboard', key: 'dashboard', icon: '🏠' },
  { name: 'Admin Profile', key: 'profile', icon: '👤' },
  { name: 'Cars Management', key: 'cars', icon: '🚗' },
  { name: 'Business Hub', key: 'business', icon: '🏢' },
  { name: 'Analytics', key: 'analytics', icon: '📊' },
  { name: 'Advanced Analytics', key: 'advancedAnalytics', icon: '📈' },
  { name: 'Automation', key: 'automation', icon: '⚙️' },
  { name: 'Notifications', key: 'notifications', icon: '🔔' },
  { name: 'Inbox', key: 'inbox', icon: '📧' },
  { name: 'System Monitor', key: 'monitor', icon: '🖥️' },
  { name: 'Integrations', key: 'integrations', icon: '🔗' },
  { name: 'Receipts', key: 'receipts', icon: '🧾' },
  { name: 'User Management', key: 'users', icon: '👥' },
  { name: 'Transactions', key: 'transactions', icon: '💰' },
  { name: 'System Settings', key: 'settings', icon: '⚙️' },
  { name: 'Staff Panel', key: 'staff', icon: '👨‍💼' },
  { name: 'Departments', key: 'departments', icon: '🏢' },
  { name: 'Inventory', key: 'inventory', icon: '📦' },
  { name: 'Activity Logs', key: 'logs', icon: '📋' },
  { name: 'Sessions', key: 'sessions', icon: '🛡️' },
  { name: 'Branches', key: 'branches', icon: '🏢' },
  { name: 'Role Test', key: 'roleTest', icon: '🧪' },
];

const RightSidebar: FC<RightSidebarProps> = ({ activePanel, setActivePanel }) => (
  <aside className="fixed top-0 right-0 h-full w-64 z-50 bg-gradient-to-br from-blue-900/90 via-green-900/90 to-black/95 shadow-2xl border-l-4 border-yellow-400/80 flex flex-col min-w-0">
    <div className="flex flex-col items-center justify-center p-6 border-b border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-green-900/10">
      <h2 className="text-2xl font-extrabold text-yellow-400 tracking-wide mb-1">Admin Menu</h2>
    </div>
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {menuItems.map(item => (
          <li key={item.key}>
            <button
              onClick={() => setActivePanel(item.key)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left font-extrabold tracking-wide text-lg shadow-lg border-2 border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 ${
                activePanel === item.key
                  ? 'bg-gradient-to-r from-yellow-400 via-green-500 to-blue-700 text-blue-900 shadow-2xl border-yellow-400'
                  : 'text-green-100 bg-gradient-to-r from-blue-900/60 via-green-900/60 to-black/80 hover:bg-green-700/40 hover:text-yellow-300'
              }`}
              role="menuitem"
              aria-current={activePanel === item.key ? 'page' : undefined}
              tabIndex={0}
              style={{ minHeight: 56 }}
            >
              <span className="text-3xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
              <span className="font-extrabold truncate block text-lg">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
    <div className="p-6 border-t border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-green-900/10">
      <button
        className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-extrabold text-lg shadow-xl border-2 border-red-400 focus:ring-2 focus:ring-red-300"
      >
        <FiLogOut size={26} />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

export default RightSidebar; 