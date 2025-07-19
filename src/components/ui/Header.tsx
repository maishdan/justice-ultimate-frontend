// ✅ Install Required Package (if not already installed):
// npm install framer-motion

// 📁 File: src/components/ui/Header.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient'; // Added supabase import
import { secureLogout, fastLogout } from '../../lib/authUtils';

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [genieOpen, setGenieOpen] = useState(false);

  // Real-time date and time state
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(systemPrefersDark);
  }, [setDarkMode]);

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('services'), path: '/services' },
    { label: t('showroom'), path: '/vehicle-catalogue' },
    {
      label: t('company'), path: '#', subMenu: [
        { label: t('news'), path: '/news' },
        { label: t('successStories'), path: '/success-stories' },
        { label: t('about'), path: '/about' },
      ]
    },
    { label: t('contact'), path: '/contact' },
  ];

  const activeLinkClass = darkMode
    ? "animate-pulse shadow-xl shadow-green-400 bg-green-500 text-black px-3 py-1 rounded"
    : "animate-pulse shadow-xl shadow-green-600 bg-green-600 text-white px-3 py-1 rounded";

  const handleDropdownOpen = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 500);
  };

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout? This will end your current session.');
    if (!confirmed) return;

    // Immediate visual feedback
    const logoutButton = document.querySelector('[data-testid="header-logout-button"]') as HTMLButtonElement;
    if (logoutButton) {
      logoutButton.disabled = true;
      logoutButton.textContent = 'Logging out...';
    }
    
    // Use fast logout for immediate response
    fastLogout('/login');
  };

  const isAuthenticated = Boolean(localStorage.getItem("token") || localStorage.getItem("authToken"));
  const isDashboard = location.pathname.includes('/dashboard');

  // Get user role to determine which dashboard to navigate to
  const getUserRole = () => {
    const userRole = localStorage.getItem('userRole') || 'admin';
    return userRole;
  };

  const handleDashboardNavigation = () => {
    const userRole = getUserRole();
    if (userRole === 'admin') {
      navigate('/dashboard/admin');
    } else if (userRole === 'customer') {
      navigate('/dashboard/customer');
    } else {
      navigate('/dashboard/guest');
    }
  };

  const getLanguageLabel = (code: string) => {
    const labels = {
      'EN': 'English',
      'SW': 'Kiswahili', 
      'ES': 'Español',
      'FR': 'Français',
      'CN': '中文'
    };
    return labels[code as keyof typeof labels] || code;
  };

  return (
    <header className={`w-full z-50 fixed top-0 left-0 transition-colors duration-1000 animate-gradientShift ${darkMode ? "bg-blue-950 text-white" : "bg-white text-black border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <img src={logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full animate-pulse shadow-md" />
          <span className="text-sm sm:text-lg font-bold text-green-400 whitespace-nowrap animate-pulse hidden sm:block">
            Justice Ultimate Automobiles
          </span>
          <span className="text-xs sm:text-sm font-bold text-green-400 whitespace-nowrap animate-pulse sm:hidden">
            JUA
          </span>
        </div>

        {/* Return to Dashboard Button for Authenticated Users - Always Visible */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={handleDashboardNavigation}
              className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </button>
          </div>
        )}

        {/* Install JUA Button */}
        <button
          className="ml-2 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs rounded shadow font-semibold transition-colors"
          style={{ fontFamily: 'inherit' }}
          onClick={() => {
            if (window.installJUA) window.installJUA();
            else alert('To install, use your browser\'s install option.');
          }}
        >
          Install JUA
        </button>

        <nav className="hidden lg:flex items-center gap-2 sm:gap-4">
          {/* Home and other nav links */}
          {navLinks.map((link, index) =>
            link.subMenu ? (
              <div
                key={`nav-${index}`}
                className="relative"
                onMouseEnter={handleDropdownOpen}
                onMouseLeave={handleDropdownClose}
              >
                <span
                  className="cursor-pointer hover:text-green-400 text-xs sm:text-sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {link.label}
                </span>
                {dropdownOpen && (
                  <div className="absolute mt-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded shadow-xl py-2 z-50 min-w-[180px]">
                    {link.subMenu.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-green-600 hover:text-white transition-all rounded-md text-sm"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-green-400 text-xs sm:text-sm ${location.pathname === link.path ? activeLinkClass : ""}`}
              >
                {link.label}
              </Link>
            )
          )}

          {!isAuthenticated && (
            <>
              <Link to="/register" className="border border-green-400 px-2 sm:px-3 py-1 rounded hover:bg-green-400 hover:text-black text-xs">
                📝 {t('register')}
              </Link>
              <Link to="/login" className="bg-green-500 px-2 sm:px-3 py-1 rounded text-white hover:bg-green-400 text-xs">
                🔐 {t('login')}
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="relative group ml-2">
              <button 
                onClick={handleLogout} 
                data-testid="header-logout-button"
                className="flex items-center justify-center p-1 sm:p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
              >
                <LogOut className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200 hover:text-red-600 cursor-pointer" />
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                {t('logout')}
              </div>
            </div>
          )}

          <button onClick={() => setDarkMode(!darkMode)} className="ml-2 hover:text-yellow-400" aria-label={t('toggleTheme')}>
            {darkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>

          {/* Desktop language switcher */}
          <select
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            className="ml-2 border px-1 sm:px-2 py-1 rounded text-xs bg-white dark:bg-gray-900 dark:text-white"
            aria-label={t('language')}
          >
            <option value="en">🇺🇸 English</option>
            <option value="sw">🇰🇪 Kiswahili</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="cn">🇨🇳 中文</option>
          </select>
        </nav>

        {/* Move time and date to the far right, small size */}
        <div className="flex flex-col items-end gap-0 ml-auto min-w-[90px]">
          <span className="text-blue-400 font-bold text-[10px] sm:text-xs flex items-center gap-1">
            <span role="img" aria-label="clock">⏰</span>
            {now.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-yellow-500 font-semibold text-[10px] sm:text-xs flex items-center gap-1">
            <span role="img" aria-label="calendar">📅</span>
            {now.toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
          </span>
        </div>

        <Button className="lg:hidden ml-auto" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          ☰
        </Button>
      </div>

      {/* Mobile Off-Canvas Menu (with fixed height like screenshot) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1, rotate: 720, y: 300, clipPath: "circle(0% at 90% 95%)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0, clipPath: "circle(150% at 50% 50%)" }}
            exit={{ opacity: 0, scale: 0.1, rotate: -720, y: 300, clipPath: "circle(0% at 90% 95%)" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.32, ease: "easeInOut" }}
            className="lg:hidden fixed top-0 left-0 h-[90%] w-11/12 sm:w-2/3 z-50 rounded-tr-3xl rounded-br-3xl backdrop-blur-2xl bg-gradient-to-br from-blue-900/95 via-green-900/90 to-yellow-100/90 text-white shadow-2xl p-4 sm:p-6 space-y-4 text-base font-bold border-r-4 border-yellow-400/80"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' }}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            {/* Logo and company name with animation */}
            <motion.div
              className="flex flex-col items-center mb-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <motion.img
                src={logo}
                alt="Logo"
                className="w-14 h-14 rounded-2xl shadow-xl border-4 border-white/40 mb-2"
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              />
              <span className="text-xl font-extrabold text-yellow-400 drop-shadow-glow tracking-wide text-center">Justice Ultimate Automobiles</span>
            </motion.div>
            {/* Return to Dashboard Button in Mobile Menu for Authenticated Users */}
            {isAuthenticated && (
              <motion.button
                onClick={() => {
                  handleDashboardNavigation();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-green-600 via-blue-700 to-green-800 hover:from-green-700 hover:to-blue-900 text-white rounded-2xl transition-colors mb-4 shadow-xl font-bold text-lg border-2 border-green-400"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 18 }}
              >
                <ArrowLeft size={18} />
                <span>{t('Dashboard')}</span>
              </motion.button>
            )}
            {/* Animated menu tiles */}
            <motion.div
              className="flex flex-col gap-3 mt-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.18,
                  },
                },
              }}
            >
              {navLinks.map((link, idx) =>
                link.subMenu ? (
                  <motion.div
                    key={link.label}
                    className="space-y-1"
                    initial={{ opacity: 0, x: -40, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  >
                    <span className="font-semibold cursor-pointer shadow-md rounded-xl px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-yellow-100 text-base">
                      {link.label}
                    </span>
                    {link.subMenu.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="block ml-4 text-base font-bold text-blue-100 hover:text-yellow-300 transition-all rounded-md py-1 px-2"
                        onClick={() => setMenuOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -40, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  >
                    <Link
                      to={link.path}
                      className="block text-base font-extrabold bg-gradient-to-r from-blue-800 via-green-700 to-yellow-400 text-white hover:text-yellow-300 shadow-lg rounded-xl py-2 px-4 mb-1 border-2 border-yellow-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </motion.div>
            {/* Auth and settings buttons */}
            {!isAuthenticated && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link to="/register" className="block text-base font-bold bg-yellow-400 text-blue-900 rounded-xl py-2 px-4 mb-1 shadow border-2 border-yellow-300" onClick={() => setMenuOpen(false)}>
                    📝 {t('Register')}
                  </Link>
                  <Link to="/login" className="block text-base font-bold bg-green-500 text-white rounded-xl py-2 px-4 mb-1 shadow border-2 border-green-300" onClick={() => setMenuOpen(false)}>
                    🔐 {t('Login')}
                  </Link>
                </motion.div>
              </>
            )}
            {isAuthenticated && (
              <motion.div
                className="relative group ml-2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button onClick={handleLogout} className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow border-2 border-red-300 hover:bg-red-700 transition">
                  <LogOut className="w-6 h-6" />
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  {t('Logout')}
                </div>
              </motion.div>
            )}
            <motion.button
              onClick={() => {
                setDarkMode(!darkMode);
                setMenuOpen(false);
              }}
              className="mt-2 flex items-center gap-2 text-base font-bold bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 text-blue-900 rounded-xl py-2 px-4 shadow border-2 border-yellow-200"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />} {t('toggleTheme')}
            </motion.button>
            {/* Mobile menu language switcher (if present) */}
            <label className="block text-base font-bold mb-1">{t('language')}</label>
            <select
              value={i18n.language}
              onChange={e => {
                i18n.changeLanguage(e.target.value);
                setMenuOpen(false);
              }}
              className="block w-full border px-2 py-2 rounded text-base bg-white dark:bg-gray-900 dark:text-white mb-2"
              aria-label={t('language')}
            >
              <option value="EN">🇺🇸 English</option>
              <option value="SW">🇹🇿 Kiswahili</option>
              <option value="ES">🇪🇸 Español</option>
              <option value="FR">🇫🇷 Français</option>
              <option value="CN">🇨🇳 中文</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
