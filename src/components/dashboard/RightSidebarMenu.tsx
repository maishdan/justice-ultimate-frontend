import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';

interface RightSidebarMenuProps {
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

export default function RightSidebarMenu({ activePanel, setActivePanel }: RightSidebarMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as HTMLDivElement).contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const menu = (
    <div className="fixed top-20 right-0 z-[2147483647] flex flex-col items-end">
      <button
        className="m-4 p-3 rounded-full bg-green-600 hover:bg-green-700 shadow-lg border-2 border-white/60 focus:outline-none focus:ring-2 focus:ring-green-300"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        style={{transition: 'background 0.2s', zIndex: 2147483647, position: 'relative'}}
      >
        <FiMenu size={28} className="text-white" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="fixed top-36 right-4 w-72 max-h-[70vh] bg-gradient-to-br from-green-600 via-green-700 to-green-900 shadow-2xl border border-green-300 rounded-2xl overflow-y-auto animate-fade-in flex flex-col z-[2147483647]"
          style={{zIndex: 2147483647}}
        >
          <ul className="divide-y divide-green-400/30">
            {menuItems.map(item => (
              <li key={item.key}>
                <button
                  onClick={() => { setActivePanel(item.key); setOpen(false); }}
                  className={`w-full flex items-center gap-4 p-4 text-left font-extrabold tracking-wide text-lg transition-all duration-200 focus:bg-green-800/40 focus:text-yellow-200 hover:bg-green-800/40 hover:text-yellow-200 ${
                    activePanel === item.key
                      ? 'bg-green-400/30 text-yellow-200' : 'text-white'
                  }`}
                  role="menuitem"
                  aria-current={activePanel === item.key ? 'page' : undefined}
                  tabIndex={0}
                  style={{ minHeight: 56 }}
                >
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  <span className="font-extrabold truncate block text-lg">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t border-green-400/40 bg-green-800/30">
            <button
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-extrabold text-lg shadow-xl border-2 border-red-400 focus:ring-2 focus:ring-red-300"
            >
              <FiLogOut size={24} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(menu, document.body);
} 