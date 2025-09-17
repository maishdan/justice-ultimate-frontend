// ✅ Install Required Package (if not already installed):
// npm install framer-motion

// 📁 File: src/components/ui/Header.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, ArrowLeft, User, Shield } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { fastLogout } from '../../lib/authUtils';
import { createPortal } from "react-dom";

function HeaderPortal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <header id="GLOBAL-FIXED-HEADER">
      {children}
    </header>,
    document.body
  );
}

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  
  // Debug menu state
  useEffect(() => {
    console.log('Menu state changed:', menuOpen);
  }, [menuOpen]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(systemPrefersDark);
  }, [setDarkMode]);

  useEffect(() => {
    // Listen for beforeinstallprompt to show the button
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
    };

    // Check if app is already installed
    const checkIfInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches;
    };

    // Show install button if not already installed
    if (!checkIfInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Also show button after a delay if beforeinstallprompt hasn't fired
      const timer = setTimeout(() => {
        if (!checkIfInstalled()) {
          setCanInstall(true);
        }
      }, 2000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    } else {
      setCanInstall(false);
    }
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'services', path: '/services' },
    { label: 'CATALOGUE', path: '/vehicle-catalogue' },
    { label: 'Videos', path: '/videos' },
    { label: 'Contact', path: '/contact' },
  ];

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

  const handleInstallClick = () => {
    if ((window as any).installJUA) {
      (window as any).installJUA();
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        alert('To install the app:\n\n1. Tap the share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
      } else {
        alert('To install the app:\n\n1. Click the install icon in your browser\'s address bar\n2. Click "Install"');
      }
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
        {/* Logo & Company Name */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <Link to="/" className="block">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <img 
                src={logo} 
                alt="Justice Ultimate Automobiles Logo" 
                className="h-14 w-14 rounded-full border-4 border-white shadow-lg object-cover bg-white" style={{ maxHeight: '3.5rem', maxWidth: '3.5rem' }}
              />
            </Link>
            {/* Hamburger Menu Button - now just below the logo */}
            <div className="absolute left-1 top-full mt-1 z-[9999]">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg bg-blue-600/90 hover:bg-blue-700/90 transition-all duration-300 backdrop-blur-sm border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 active:scale-95 shadow-lg"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="w-6 h-5 flex flex-col justify-center items-center gap-1">
                  <div className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0 scale-0' : ''}`}></div>
                  <div className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
              JUSTICE ULTIMATE AUTO
            </span>
          </div>
        </div>

          {/* Center Section - Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                    onChange={e => { if (e.target.value) navigate(e.target.value); }}
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
          <div className="flex items-center gap-1 xl:gap-2 min-w-0 flex-shrink-0">
            
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
              {canInstall && (
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-md text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm border border-yellow-300/30"
                  onClick={handleInstallClick}
                >
                  Install JUA
                </button>
              )}
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


            

          </div>
        </div>

      {/* Professional Dropdown Menu - Left Side with Click Outside */}
      {menuOpen && (
        <>
          {/* Backdrop for click outside */}
          <div 
            className="fixed inset-0 bg-black/20 z-[2147483645]"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-full left-0 w-80 z-[2147483646] bg-gradient-to-br from-blue-950/95 via-blue-900/90 to-blue-800/95 backdrop-blur-2xl text-white shadow-2xl border border-blue-400/30 rounded-2xl mt-2 overflow-hidden">
            <div className="p-4 space-y-3">
              {/* Dashboard Button */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleDashboardNavigation();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-green-600/90 hover:bg-green-700/90 text-white rounded-xl font-medium transition-all duration-300 text-sm shadow-lg"
                >
                  Dashboard
                </button>
              )}
              
              {/* Install JUA Button */}
              {canInstall && (
                <button
                  className="w-full px-3 py-2 bg-yellow-500/90 hover:bg-yellow-600/90 text-black rounded-xl font-medium transition-all duration-300 text-sm shadow-lg"
                  onClick={() => {
                    handleInstallClick();
                    setMenuOpen(false);
                  }}
                >
                  Install JUA
                </button>
              )}
              
              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-blue-200 px-2 py-1 uppercase tracking-wider">Navigation</div>
                {navLinks.map((link) =>
                  link.subMenu ? (
                    <div key={link.label} className="space-y-1">
                      <div className="font-medium text-yellow-400 px-2 py-1 text-sm">{link.label}</div>
                      {link.subMenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block ml-3 px-2 py-1 text-blue-100 hover:text-yellow-400 hover:bg-blue-800/50 transition-all duration-300 rounded-lg text-sm"
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
                      className="block px-2 py-1 text-blue-100 hover:text-yellow-400 hover:bg-blue-800/50 transition-all duration-300 rounded-lg text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
              
              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="space-y-2 pt-3 border-t border-blue-400/20">
                  <div className="text-xs font-semibold text-blue-200 px-2 py-1 uppercase tracking-wider">Account</div>
                  <Link 
                    to="/register" 
                    className="block w-full px-3 py-2 border border-green-400/70 text-green-400 hover:bg-green-400/20 hover:text-white rounded-xl font-medium transition-all duration-300 text-center text-sm shadow-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="block w-full px-3 py-2 bg-green-600/90 hover:bg-green-700/90 text-white rounded-xl font-medium transition-all duration-300 text-center text-sm shadow-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-blue-400/20">
                  <div className="text-xs font-semibold text-blue-200 px-2 py-1 uppercase tracking-wider">Account</div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }} 
                    className="w-full px-3 py-2 bg-red-600/90 hover:bg-red-700/90 text-white rounded-xl font-medium transition-all duration-300 text-sm shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
              
              {/* Settings */}
              <div className="pt-3 border-t border-blue-400/20">
                <div className="text-xs font-semibold text-blue-200 px-2 py-1 uppercase tracking-wider">Settings</div>
                <button 
                  onClick={() => setDarkMode(!darkMode)} 
                  className="w-full flex items-center justify-between px-3 py-2 bg-blue-800/50 hover:bg-blue-700/50 transition-all duration-300 rounded-xl text-sm"
                >
                  <span className="text-blue-100">Theme</span>
                  <span className="text-xs text-blue-200">{darkMode ? 'Dark' : 'Light'}</span>
                </button>
                <select
                  value={i18n.language}
                  onChange={e => i18n.changeLanguage(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-blue-800/50 hover:bg-blue-700/50 transition-all duration-300 rounded-xl text-sm border border-blue-400/30 cursor-pointer text-blue-100"
                >
                  <option value="en" className="bg-blue-900 text-white">🇺🇸 English</option>
                  <option value="sw" className="bg-blue-900 text-white">🇰🇪 Kiswahili</option>
                  <option value="fr" className="bg-blue-900 text-white">🇫🇷 Français</option>
                  <option value="ar" className="bg-blue-900 text-white">🇸🇦 العربية</option>
                  <option value="cn" className="bg-blue-900 text-white">🇨🇳 中文</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </HeaderPortal>
  );
}