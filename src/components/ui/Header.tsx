// ✅ Install Required Package (if not already installed):
// npm install framer-motion

// 📁 File: src/components/ui/Header.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, ArrowLeft, ChevronDown, User, Shield } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { fastLogout } from '../../lib/authUtils';

function HeaderPortal({ children }: { children: React.ReactNode }) {
  return (
    <header id="GLOBAL-FIXED-HEADER">
      {children}
    </header>
  );
}

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [now, setNow] = useState(new Date());

  // Real-time date and time state
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

  // Get user role to determine which dashboard to navigate to
  const getUserRole = () => {
    const userRole = localStorage.getItem('userRole') || 'admin';
    return userRole;
  };

  const handleDashboardNavigation = () => {
    const userRole = getUserRole();
    if (userRole === 'admin') {
      navigate('/secure-admin-dashboard');
    } else if (userRole === 'customer') {
      navigate('/secure-customer-dashboard');
    } else {
      navigate('/secure-guest-dashboard');
    }
  };

  // ULTIMATE FIXED HEADER STYLES - Cannot be overridden
  useEffect(() => {
    // Remove any existing styles first
    const existingStyle = document.getElementById('ULTIMATE-HEADER-STYLES');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'ULTIMATE-HEADER-STYLES';
    style.innerHTML = `
      /* ULTIMATE FIXED HEADER - CANNOT BE OVERRIDDEN */
      #GLOBAL-FIXED-HEADER {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 64px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        background: linear-gradient(to right, #172554 95%, #1e293b 100%) !important;
        color: #fff !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        transform: none !important;
        transition: none !important;
      }
      
      /* FORCE BODY SPACING */
      body {
        padding-top: 64px !important;
        margin-top: 0 !important;
      }
      
      /* OVERRIDE ALL OTHER FIXED ELEMENTS */
      *:not(#GLOBAL-FIXED-HEADER) {
        z-index: auto !important;
      }
      
      /* ENSURE NO OTHER HEADERS INTERFERE */
      header:not(#GLOBAL-FIXED-HEADER) {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* OVERRIDE ANY CONFLICTING STYLES */
      .header-clean, .fixed-header, .header-fixed-responsive {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* ENSURE MAIN CONTENT FLOWS UNDER HEADER */
      .main-content-responsive {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      /* OVERRIDE CHAT CONTAINER Z-INDEX */
      #chatContainer {
        z-index: 999999 !important;
      }
      
      /* ENSURE ALL PAGES START BELOW HEADER */
      .min-h-screen {
        padding-top: 0 !important;
      }
      
      /* FORCE ALL CONTENT TO FLOW UNDER HEADER */
      .app-background, .clean-container, .page-background {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      /* ADDITIONAL HEADER FIXES FOR ALL SCENARIOS */
      .dashboard-background, .page-background, .app-background {
        padding-top: 64px !important;
      }
      
      /* ENSURE NO OTHER ELEMENTS OVERLAP HEADER */
      header:not(#GLOBAL-FIXED-HEADER), 
      .header:not(#GLOBAL-FIXED-HEADER),
      .fixed-header:not(#GLOBAL-FIXED-HEADER) {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* OVERRIDE ANY CONFLICTING Z-INDEX VALUES */
      .z-50, .z-40, .z-30, .z-20, .z-10 {
        z-index: auto !important;
      }
      
      /* ENSURE CHAT WIDGET STAYS BELOW HEADER */
      #chatContainer, .chat-widget, .chat-container {
        z-index: 999999 !important;
      }
      
      /* FORCE ALL PAGES TO RESPECT HEADER SPACE */
      .pt-16, .pt-20, .pt-24 {
        padding-top: 64px !important;
      }
      
      /* ULTIMATE HEADER FIX - OVERRIDE EVERYTHING */
      #GLOBAL-FIXED-HEADER {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 64px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        background: linear-gradient(to right, #172554 95%, #1e293b 100%) !important;
        color: #fff !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        transform: none !important;
        transition: none !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* FORCE BODY TO RESPECT HEADER */
      body {
        padding-top: 64px !important;
        margin-top: 0 !important;
      }
      
      /* OVERRIDE ALL OTHER FIXED ELEMENTS */
      *:not(#GLOBAL-FIXED-HEADER) {
        z-index: auto !important;
      }
      
      /* ENSURE NO OTHER HEADERS INTERFERE */
      header:not(#GLOBAL-FIXED-HEADER) {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* OVERRIDE ANY CONFLICTING STYLES */
      .header-clean, .fixed-header, .header-fixed-responsive {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* ENSURE MAIN CONTENT FLOWS UNDER HEADER */
      .main-content-responsive {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      /* OVERRIDE CHAT CONTAINER Z-INDEX */
      #chatContainer {
        z-index: 999999 !important;
      }
      
      /* ENSURE ALL PAGES START BELOW HEADER */
      .min-h-screen {
        padding-top: 0 !important;
      }
      
      /* FORCE ALL CONTENT TO FLOW UNDER HEADER */
      .app-background, .clean-container, .page-background {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      /* ADDITIONAL HEADER FIXES FOR ALL SCENARIOS */
      .dashboard-background, .page-background, .app-background {
        padding-top: 64px !important;
      }
      
      /* ENSURE NO OTHER ELEMENTS OVERLAP HEADER */
      header:not(#GLOBAL-FIXED-HEADER), 
      .header:not(#GLOBAL-FIXED-HEADER),
      .fixed-header:not(#GLOBAL-FIXED-HEADER) {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* OVERRIDE ANY CONFLICTING Z-INDEX VALUES */
      .z-50, .z-40, .z-30, .z-20, .z-10 {
        z-index: auto !important;
      }
      
      /* ENSURE CHAT WIDGET STAYS BELOW HEADER */
      #chatContainer, .chat-widget, .chat-container {
        z-index: 999999 !important;
      }
      
      /* FORCE ALL PAGES TO RESPECT HEADER SPACE */
      .pt-16, .pt-20, .pt-24 {
        padding-top: 64px !important;
      }
      
      /* ULTIMATE HEADER FIX - OVERRIDE EVERYTHING */
      #GLOBAL-FIXED-HEADER {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 64px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        background: linear-gradient(to right, #172554 95%, #1e293b 100%) !important;
        color: #fff !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        overflow: visible !important;
        padding: 0 !important;
        margin: 0 !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        transform: none !important;
        transition: none !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* OVERRIDE ANY FRAMER MOTION TRANSFORMS */
      #GLOBAL-FIXED-HEADER * {
        transform: none !important;
        transition: none !important;
      }
      
      /* ENSURE NO STACKING CONTEXT INTERFERENCE */
      .relative, .absolute {
        z-index: auto !important;
      }
      
      /* FORCE BODY TO RESPECT HEADER */
      body {
        padding-top: 64px !important;
        margin-top: 0 !important;
      }
      
      /* OVERRIDE ALL OTHER FIXED ELEMENTS */
      *:not(#GLOBAL-FIXED-HEADER) {
        z-index: auto !important;
      }
      
      /* ENSURE NO OTHER HEADERS INTERFERE */
      header:not(#GLOBAL-FIXED-HEADER) {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* OVERRIDE ANY CONFLICTING STYLES */
      .header-clean, .fixed-header, .header-fixed-responsive {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* ENSURE MAIN CONTENT FLOWS UNDER HEADER */
      .main-content-responsive {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      /* OVERRIDE CHAT CONTAINER Z-INDEX */
      #chatContainer {
        z-index: 999999 !important;
      }
      
      /* ENSURE ALL PAGES START BELOW HEADER */
      .min-h-screen {
        padding-top: 0 !important;
      }
      
      /* FORCE ALL CONTENT TO FLOW UNDER HEADER */
      .app-background, .clean-container, .page-background {
        padding-top: 0 !important;
        margin-top: 0 !important;
      }
      
      /* ADDITIONAL HEADER FIXES FOR ALL SCENARIOS */
      .dashboard-background, .page-background, .app-background {
        padding-top: 64px !important;
      }
      
      /* ENSURE NO OTHER ELEMENTS OVERLAP HEADER */
      header:not(#GLOBAL-FIXED-HEADER), 
      .header:not(#GLOBAL-FIXED-HEADER),
      .fixed-header:not(#GLOBAL-FIXED-HEADER) {
        position: relative !important;
        z-index: auto !important;
      }
      
      /* OVERRIDE ANY CONFLICTING Z-INDEX VALUES */
      .z-50, .z-40, .z-30, .z-20, .z-10 {
        z-index: auto !important;
      }
      
      /* ENSURE CHAT WIDGET STAYS BELOW HEADER */
      #chatContainer, .chat-widget, .chat-container {
        z-index: 999999 !important;
      }
      
      /* FORCE ALL PAGES TO RESPECT HEADER SPACE */
      .pt-16, .pt-20, .pt-24 {
        padding-top: 64px !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById('ULTIMATE-HEADER-STYLES');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return (
    <HeaderPortal>
      <div className="flex items-center justify-between w-full px-4" style={{height: '64px'}}>
          
          {/* Left Section - Logo & Company Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Link to="/" className="block">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                <img 
                  src={logo} 
                  alt="Justice Ultimate Automobiles Logo" 
                  className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl border-2 border-yellow-400/70 cursor-pointer hover:shadow-yellow-400/60 hover:scale-105 transition-all duration-300 bg-white object-cover z-10" 
                />
              </Link>
            </div>
            
            <div className="flex items-center">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
                JUSTICE ULTIMATE AUTO
              </span>
            </div>
          </div>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link, index) => (
              <div key={`nav-${index}`} className="flex items-center">
                {link.subMenu ? (
                  <select
                    className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm border border-white/20 backdrop-blur-sm cursor-pointer text-white appearance-none flex items-center gap-1 font-medium"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onChange={e => { if (e.target.value) navigate(e.target.value); setDropdownOpen(false); }}
                    onClick={e => e.stopPropagation()}
                    value={location.pathname.startsWith('/news') ? '/news' : location.pathname.startsWith('/success-stories') ? '/success-stories' : location.pathname.startsWith('/about') ? '/about' : ''}
                  >
                    <option value="" disabled>{link.label}</option>
                    {link.subMenu.map((sub) => (
                      <option key={sub.path} value={sub.path}>{sub.label}</option>
                    ))}
                  </select>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-yellow-400 backdrop-blur-sm border border-white/10 ${
                      location.pathname === link.path ? "bg-gradient-to-r from-green-500/30 to-yellow-500/30 text-yellow-400 font-bold border-yellow-400/30" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
                {/* Vertical Separator */}
                {index < navLinks.length - 1 && (
                  <div className="w-px h-6 bg-white/20 mx-2"></div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section - Actions & Info */}
          <div className="flex items-center gap-1 xl:gap-2">
            
            {/* Dashboard Button for Authenticated Users */}
            {isAuthenticated && (
              <div className="flex items-center">
                <button
                  onClick={handleDashboardNavigation}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500/90 to-green-600/90 hover:from-green-600 hover:to-green-700 text-white rounded-md text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm border border-green-400/30"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
              </div>
            )}

            {/* Install JUA Button */}
            <div className="flex items-center">
              <button
                className="px-3 py-1.5 bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-md text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm border border-yellow-300/30"
                onClick={() => {
                  if ((window as any).installJUA) (window as any).installJUA();
                  else alert('To install, use your browser\'s install option.');
                }}
              >
                Install JUA
              </button>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
            </div>

            {/* Auth Buttons for Non-Authenticated Users */}
            {!isAuthenticated && (
              <div className="flex items-center">
                <Link 
                  to="/register" 
                  className="flex items-center gap-1 px-3 py-1.5 border border-green-400/70 text-green-400 hover:bg-green-400/20 hover:text-white rounded-md text-sm font-medium transition-all duration-300 backdrop-blur-sm"
                >
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('register')}</span>
                </Link>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
                <Link 
                  to="/login" 
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500/90 to-green-600/90 hover:from-green-600 hover:to-green-700 text-white rounded-md text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm border border-green-400/30"
                >
                  <Shield className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </Link>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
              </div>
            )}

            {/* Logout Button for Authenticated Users */}
            {isAuthenticated && (
              <div className="flex items-center">
                <button 
                  onClick={handleLogout} 
                  data-testid="header-logout-button"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 text-white rounded-md text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm border border-red-400/30"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
              </div>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
                aria-label={t('toggleTheme')}
              >
                {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
              </button>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center">
              <select
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm border border-white/20 backdrop-blur-sm cursor-pointer text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
                aria-label={t('language')}
              >
                <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
                <option value="sw" className="bg-gray-800 text-white">🇰🇪 Kiswahili</option>
                <option value="fr" className="bg-gray-800 text-white">🇫🇷 Français</option>
                <option value="ar" className="bg-gray-800 text-white">🇸🇦 العربية</option>
                <option value="cn" className="bg-gray-800 text-white">🇨🇳 中文</option>
              </select>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <button 
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 ml-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onClick={() => setMenuOpen(!menuOpen)} 
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-7 h-7 flex flex-col justify-center items-center gap-1">
                <div className={`w-6 h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

      {/* Mobile Off-Canvas Menu (Enhanced) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] z-[2147483646] bg-gradient-to-br from-blue-950/95 via-blue-900/90 to-blue-800/95 backdrop-blur-2xl text-white shadow-2xl border-l border-white/20 flex flex-col"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            {/* Mobile Menu Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full shadow-lg border-2 border-yellow-400/30" />
                <div>
                  <div className="text-lg font-bold text-yellow-400">JUSTICE ULTIMATE</div>
                  <div className="text-sm text-green-400">Automobiles</div>
                </div>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            {/* Mobile Menu Content */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Dashboard Button for Authenticated Users */}
              {isAuthenticated && (
                <motion.button
                  onClick={() => {
                    handleDashboardNavigation();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Dashboard</span>
                </motion.button>
              )}
              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) =>
                  link.subMenu ? (
                    <div key={link.label} className="space-y-1">
                      <div className="font-semibold text-yellow-400 px-3 py-2">{link.label}</div>
                      {link.subMenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block ml-4 px-3 py-2 text-white/80 hover:text-yellow-400 transition-all duration-300 rounded-lg"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-3 py-2 text-white/80 hover:text-yellow-400 hover:bg-white/10 transition-all duration-300 rounded-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
              {/* Auth Buttons for Non-Authenticated Users */}
              {!isAuthenticated && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <Link 
                    to="/register" 
                    className="block w-full px-4 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white rounded-lg font-semibold transition-all duration-300 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all duration-300 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
              {/* Logout Button for Authenticated Users */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-white/10">
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </HeaderPortal>
  );
}