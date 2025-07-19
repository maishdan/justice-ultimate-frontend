import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient'; // Added import for supabase
import LogoutButton from '../auth/LogoutButton';
import { FiLogOut, FiMenu, FiX, FiMap, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  admin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePanel, setActivePanel, admin }) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const menuItems = [
    { 
      name: 'Dashboard', 
      key: 'dashboard', 
      icon: '🏠', 
      description: 'Main dashboard overview',
      shortcut: 'Alt + 1'
    },
    { 
      name: 'Admin Profile', 
      key: 'profile', 
      icon: '👤', 
      description: 'Admin profile and settings',
      shortcut: 'Alt + 2'
    },
    { 
      name: 'Cars Management', 
      key: 'cars', 
      icon: '🚗', 
      description: 'Vehicle inventory management',
      shortcut: 'Alt + 3'
    },
    { 
      name: 'Business Hub', 
      key: 'business', 
      icon: '🏢', 
      description: 'Business operations and analytics',
      shortcut: 'Alt + 4'
    },
    { 
      name: 'Analytics', 
      key: 'analytics', 
      icon: '📊', 
      description: 'Data analytics and insights',
      shortcut: 'Alt + 5'
    },
    { 
      name: 'Advanced Analytics', 
      key: 'advancedAnalytics', 
      icon: '📈', 
      description: 'Advanced data analysis',
      shortcut: 'Alt + A'
    },
    { 
      name: 'Automation', 
      key: 'automation', 
      icon: '⚙️', 
      description: 'System automation tools',
      shortcut: 'Alt + M'
    },
    { 
      name: 'Notifications', 
      key: 'notifications', 
      icon: '🔔', 
      description: 'Notification center',
      shortcut: 'Alt + N'
    },
    { 
      name: 'Inbox', 
      key: 'inbox', 
      icon: '📧', 
      description: 'Message inbox',
      shortcut: 'Alt + Q'
    },
    { 
      name: 'System Monitor', 
      key: 'monitor', 
      icon: '🖥️', 
      description: 'System health monitoring',
      shortcut: 'Alt + S'
    },
    { 
      name: 'Integrations', 
      key: 'integrations', 
      icon: '🔗', 
      description: 'Third-party integrations',
      shortcut: 'Alt + I'
    },
    { 
      name: 'Receipts', 
      key: 'receipts', 
      icon: '🧾', 
      description: 'Receipt generation and management',
      shortcut: 'Alt + 6'
    },
    { 
      name: 'User Management', 
      key: 'users', 
      icon: '👥', 
      description: 'User account management',
      shortcut: 'Alt + 7'
    },
    { 
      name: 'Transactions', 
      key: 'transactions', 
      icon: '💰', 
      description: 'Financial transactions',
      shortcut: 'Alt + 8'
    },
    { 
      name: 'System Settings', 
      key: 'settings', 
      icon: '⚙️', 
      description: 'System configuration',
      shortcut: 'Alt + 9'
    },
    { 
      name: 'Staff Panel', 
      key: 'staff', 
      icon: '👨‍💼', 
      description: 'Staff management and HR',
      shortcut: 'Alt + 0'
    },
    { 
      name: 'Departments', 
      key: 'departments', 
      icon: '🏢', 
      description: 'Department management',
      shortcut: 'Alt + D'
    },
    { 
      name: 'Inventory', 
      key: 'inventory', 
      icon: '📦', 
      description: 'Inventory management system',
      shortcut: 'Alt + I'
    },
    { 
      name: 'Activity Logs', 
      key: 'logs', 
      icon: '📋', 
      description: 'System activity and audit logs',
      shortcut: 'Alt + L'
    },
    { 
      name: 'Sessions', 
      key: 'sessions', 
      icon: '🛡️', 
      description: 'Active session management',
      shortcut: 'Alt + S'
    },
    { 
      name: 'Branches', 
      key: 'branches', 
      icon: '🏢', 
      description: 'Branch management and locations',
      shortcut: 'Alt + B'
    },
    { 
      name: 'Role Test', 
      key: 'roleTest', 
      icon: '🧪', 
      description: 'Test role separation and dashboard access',
      shortcut: 'Alt + R'
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).closest('.sidebar')) {
        const currentIndex = focusedIndex;
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setFocusedIndex(prev => Math.min(prev + 1, menuItems.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setFocusedIndex(prev => Math.max(prev - 1, 0));
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (currentIndex >= 0 && currentIndex < menuItems.length) {
              setActivePanel(menuItems[currentIndex].key);
            }
            break;
          case 'Home':
            e.preventDefault();
            setFocusedIndex(0);
            break;
          case 'End':
            e.preventDefault();
            setFocusedIndex(menuItems.length - 1);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, menuItems, setActivePanel]);

  // Greeting logic
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
  const userName = localStorage.getItem('adminName') || 'Admin';

  return (
    <AnimatePresence>
      <motion.aside
        key={isCollapsed ? 'collapsed' : 'open'}
        initial={{
          x: isCollapsed ? -120 : 0,
          opacity: 0.7,
          clipPath: isCollapsed
            ? 'ellipse(60% 10% at 0% 0%)'
            : 'ellipse(120% 120% at 50% 50%)',
          boxShadow: '0 0 0px #00FFAA',
        }}
        animate={{
          x: 0,
          opacity: 1,
          clipPath: isCollapsed
            ? 'ellipse(60% 10% at 0% 0%)'
            : 'ellipse(120% 120% at 50% 50%)',
          boxShadow: isCollapsed
            ? '0 0 0px #00FFAA'
            : '0 12px 48px 0 rgba(0,255,170,0.30), 0 0 24px #00FFAA',
          transition: { type: 'spring', stiffness: 120, damping: 18 },
        }}
        exit={{
          x: -120,
          opacity: 0,
          clipPath: 'ellipse(60% 10% at 0% 0%)',
        }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.32 }}
        className={`dashboard-sidebar fixed top-0 left-0 h-full z-50 bg-gradient-to-br from-blue-900/90 via-green-900/90 to-black/95 backdrop-blur-2xl shadow-2xl border-r-4 border-yellow-400/80 w-64 md:w-80 transition-all flex flex-col min-w-0 w-full md:static md:relative md:z-auto md:h-auto md:border-none md:shadow-none md:bg-none`}
        role="navigation"
        aria-label="Main navigation menu"
      >
        {/* Header with animated logo and greeting */}
        <motion.div
          className="flex flex-col items-center justify-center p-6 border-b border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-green-900/10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-green-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/40 mb-2"
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <img src="https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full text-center"
            >
              <h2 className="text-2xl font-extrabold text-yellow-400 tracking-wide drop-shadow-glow mb-1">Justice Admin</h2>
              <p className="text-xs text-green-200 font-mono mb-2">v2.0 &bull; World-Class System</p>
              <div className="text-lg font-bold text-white/90 mb-1 animate-pulse">
                {getGreeting()}, {userName}!
              </div>
              <div className="text-xs text-blue-200 italic">Empowering Excellence Every Day</div>
            </motion.div>
          )}
          {/* Collapse/Expand button - always visible, floating */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-4 right-4 p-2 rounded-full bg-yellow-400/90 hover:bg-yellow-500 shadow-lg border-2 border-white/60 z-50 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            style={{ boxShadow: '0 2px 12px 0 #facc15' }}
          >
            {isCollapsed ? <FiMenu size={24} className="text-blue-900" /> : <FiX size={24} className="text-blue-900" />}
          </button>
        </motion.div>

        {/* Navigation Menu with genie effect */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar" role="menubar">
          <motion.ul
            className="space-y-2 p-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.18,
                },
              },
            }}
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={item.key}
                role="none"
                initial={{ opacity: 0, x: -60, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              >
            <button
              onClick={() => setActivePanel(item.key)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(-1)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left group relative font-extrabold tracking-wide text-lg shadow-lg border-2 border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 ${
                    activePanel === item.key 
                      ? 'bg-gradient-to-r from-yellow-400 via-green-500 to-blue-700 text-blue-900 shadow-2xl border-yellow-400' 
                      : 'text-green-100 bg-gradient-to-r from-blue-900/60 via-green-900/60 to-black/80 hover:bg-green-700/40 hover:text-yellow-300'
                  } ${
                    focusedIndex === index ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-green-950' : ''
                  }`}
                  role="menuitem"
                  aria-current={activePanel === item.key ? 'page' : undefined}
                  aria-describedby={`tooltip-${item.key}`}
                  tabIndex={0}
                  style={{ minHeight: 56 }}
                >
                  <span className="text-3xl flex-shrink-0 drop-shadow-glow" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold truncate block text-lg">{item.name}</span>
                      <span className="text-xs text-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        {item.shortcut}
                      </span>
                    </div>
                  )}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div 
                      id={`tooltip-${item.key}`}
                      className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg"
                      role="tooltip"
                    >
                      {item.name}
                      <div className="text-xs text-gray-300">{item.description}</div>
                      <div className="text-xs text-yellow-400">{item.shortcut}</div>
                    </div>
                  )}
            </button>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Footer */}
        <motion.div
          className="p-6 border-t border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-green-900/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {!isCollapsed && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-800/60 via-blue-900/60 to-green-900/60 rounded-2xl shadow-inner">
              <button
                onClick={() => setActivePanel('sessions')}
                className="w-full text-left hover:bg-green-700/40 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center gap-2 text-base text-yellow-200 font-bold">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Session Active</span>
                </div>
                <div className="text-xs text-yellow-300 mt-1 font-mono">
                  {localStorage.getItem('sessionId')?.slice(-8) || 'N/A'}
                </div>
              </button>
            </div>
          )}
          <LogoutButton
            variant="destructive"
            size="lg"
            showConfirmation={true}
            clearAllSessions={false}
            fastMode={true}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-white transition-colors font-extrabold text-lg shadow-xl border-2 border-red-400 focus:ring-2 focus:ring-red-300"
            data-testid="logout-button"
          >
            <FiLogOut size={26} />
            {!isCollapsed && <span>{t('logout')}</span>}
          </LogoutButton>
        </motion.div>

        {/* Accessibility announcements */}
        <div className="sr-only" aria-live="polite">
          {activePanel && `Current panel: ${activePanel}`}
      </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
