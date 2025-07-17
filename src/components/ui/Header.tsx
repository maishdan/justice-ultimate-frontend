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

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [genieOpen, setGenieOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
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
    switch (userRole) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'staff':
        navigate('/dashboard/staff');
        break;
      case 'mechanic':
        navigate('/dashboard/mechanic');
        break;
      case 'customer':
        navigate('/dashboard/customer');
        break;
      default:
        navigate('/dashboard/admin');
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
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={handleDashboardNavigation}
              className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">{t('returnToDashboard')}</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          </div>
        )}

        <nav className="hidden lg:flex items-center gap-2 sm:gap-4">
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
              <button onClick={handleLogout} className="flex items-center justify-center p-1 sm:p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition">
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

          <select
            value={language}
            onChange={e => setLanguage(e.target.value as any)}
            className="ml-2 border px-1 sm:px-2 py-1 rounded text-xs bg-white dark:bg-gray-900 dark:text-white"
            aria-label={t('language')}
          >
            <option value="EN">🇺🇸 English</option>
            <option value="SW">🇹🇿 Kiswahili</option>
            <option value="ES">🇪🇸 Español</option>
            <option value="FR">🇫🇷 Français</option>
            <option value="CN">🇨🇳 中文</option>
            <option value="DE">🇩🇪 Deutsch</option>
            <option value="IT">🇮🇹 Italiano</option>
            <option value="PT">🇵🇹 Português</option>
            <option value="RU">🇷🇺 Русский</option>
            <option value="JA">🇯🇵 日本語</option>
            <option value="KO">🇰🇷 한국어</option>
            <option value="AR">🇸🇦 العربية</option>
            <option value="HI">🇮🇳 हिन्दी</option>
            <option value="TR">🇹🇷 Türkçe</option>
            <option value="NL">🇳🇱 Nederlands</option>
            <option value="SV">🇸🇪 Svenska</option>
            <option value="NO">🇳🇴 Norsk</option>
            <option value="DA">🇩🇰 Dansk</option>
            <option value="FI">🇫🇮 Suomi</option>
            <option value="PL">🇵🇱 Polski</option>
            <option value="CS">🇨🇿 Čeština</option>
            <option value="HU">🇭🇺 Magyar</option>
            <option value="RO">🇷🇴 Română</option>
            <option value="BG">🇧🇬 Български</option>
            <option value="HR">🇭🇷 Hrvatski</option>
            <option value="SR">🇷🇸 Српски</option>
            <option value="SK">🇸🇰 Slovenčina</option>
            <option value="SL">🇸🇮 Slovenščina</option>
            <option value="ET">🇪🇪 Eesti</option>
            <option value="LV">🇱🇻 Latviešu</option>
            <option value="LT">🇱🇹 Lietuvių</option>
            <option value="MT">🇲🇹 Malti</option>
            <option value="EL">🇬🇷 Ελληνικά</option>
            <option value="HE">🇮🇱 עברית</option>
            <option value="TH">🇹🇭 ไทย</option>
            <option value="VI">🇻🇳 Tiếng Việt</option>
            <option value="ID">🇮🇩 Bahasa Indonesia</option>
            <option value="MS">🇲🇾 Bahasa Melayu</option>
            <option value="TL">🇵🇭 Filipino</option>
            <option value="BN">🇧🇩 বাংলা</option>
            <option value="UR">🇵🇰 اردو</option>
            <option value="FA">🇮🇷 فارسی</option>
            <option value="PS">🇦🇫 پښتو</option>
            <option value="KU">🇮🇶 کوردی</option>
            <option value="AM">🇪🇹 አማርኛ</option>
            <option value="NE">🇳🇵 नेपाली</option>
            <option value="SI">🇱🇰 සිංහල</option>
            <option value="MY">🇲🇲 မြန်မာစာ</option>
            <option value="KM">🇰🇭 ខ្មែរ</option>
            <option value="LO">🇱🇦 ລາວ</option>
          </select>
        </nav>

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
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="lg:hidden fixed top-0 left-0 h-[85%] w-3/4 sm:w-1/2 z-50 rounded-tr-2xl rounded-br-2xl backdrop-blur-lg bg-[rgba(11,31,58,0.92)] text-white shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 text-sm sm:text-base"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' }}
          >
            {/* Return to Dashboard Button in Mobile Menu for Authenticated Users */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleDashboardNavigation();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mb-4"
              >
                <ArrowLeft size={16} />
                <span>{t('returnToDashboard')}</span>
              </button>
            )}

            {navLinks.map((link) =>
              link.subMenu ? (
                <div className="space-y-1" key={link.label}>
                  <span className="font-semibold cursor-pointer animate-pulse shadow-md rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-sm">
                    {link.label}
                  </span>
                  {link.subMenu.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className="block ml-4 text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.path} to={link.path} className="block text-sm" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              )
            )}

            {!isAuthenticated && (
              <>
                <Link to="/register" className="block text-sm" onClick={() => setMenuOpen(false)}>
                  📝 {t('register')}
                </Link>
                <Link to="/login" className="block text-sm" onClick={() => setMenuOpen(false)}>
                  🔐 {t('login')}
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="relative group ml-2">
                <button onClick={handleLogout} className="flex items-center justify-center p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition">
                  <LogOut className="w-6 h-6 text-gray-700 dark:text-gray-200 hover:text-red-600 cursor-pointer" />
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  {t('logout')}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setMenuOpen(false);
              }}
              className="mt-2 flex items-center gap-2 text-sm"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />} {t('toggleTheme')}
            </button>

            <div className="mt-2">
              <label className="block text-sm mb-1">{t('language')}</label>
              <select
                value={language}
                onChange={e => {
                  setLanguage(e.target.value as any);
                  setMenuOpen(false);
                }}
                className="w-full border px-2 py-1 rounded text-sm bg-white dark:bg-gray-900 dark:text-white"
              >
                <option value="EN">🇺🇸 English</option>
                <option value="SW">🇹🇿 Kiswahili</option>
                <option value="ES">🇪🇸 Español</option>
                <option value="FR">🇫🇷 Français</option>
                <option value="CN">🇨🇳 中文</option>
                <option value="DE">🇩🇪 Deutsch</option>
                <option value="IT">🇮🇹 Italiano</option>
                <option value="PT">🇵🇹 Português</option>
                <option value="RU">🇷🇺 Русский</option>
                <option value="JA">🇯🇵 日本語</option>
                <option value="KO">🇰🇷 한국어</option>
                <option value="AR">🇸🇦 العربية</option>
                <option value="HI">🇮🇳 हिन्दी</option>
                <option value="TR">🇹🇷 Türkçe</option>
                <option value="NL">🇳🇱 Nederlands</option>
                <option value="SV">🇸🇪 Svenska</option>
                <option value="NO">🇳🇴 Norsk</option>
                <option value="DA">🇩🇰 Dansk</option>
                <option value="FI">🇫🇮 Suomi</option>
                <option value="PL">🇵🇱 Polski</option>
                <option value="CS">🇨🇿 Čeština</option>
                <option value="HU">🇭🇺 Magyar</option>
                <option value="RO">🇷🇴 Română</option>
                <option value="BG">🇧🇬 Български</option>
                <option value="HR">🇭🇷 Hrvatski</option>
                <option value="SR">🇷🇸 Српски</option>
                <option value="SK">🇸🇰 Slovenčina</option>
                <option value="SL">🇸🇮 Slovenščina</option>
                <option value="ET">🇪🇪 Eesti</option>
                <option value="LV">🇱🇻 Latviešu</option>
                <option value="LT">🇱🇹 Lietuvių</option>
                <option value="MT">🇲🇹 Malti</option>
                <option value="EL">🇬🇷 Ελληνικά</option>
                <option value="HE">🇮🇱 עברית</option>
                <option value="TH">🇹🇭 ไทย</option>
                <option value="VI">🇻🇳 Tiếng Việt</option>
                <option value="ID">🇮🇩 Bahasa Indonesia</option>
                <option value="MS">🇲🇾 Bahasa Melayu</option>
                <option value="TL">🇵🇭 Filipino</option>
                <option value="BN">🇧🇩 বাংলা</option>
                <option value="UR">🇵🇰 اردو</option>
                <option value="FA">🇮🇷 فارسی</option>
                <option value="PS">🇦🇫 پښتو</option>
                <option value="KU">🇮🇶 کوردی</option>
                <option value="AM">🇪🇹 አማርኛ</option>
                <option value="NE">🇳🇵 नेपाली</option>
                <option value="SI">🇱🇰 සිංහල</option>
                <option value="MY">🇲🇲 မြန်မာစာ</option>
                <option value="KM">🇰🇭 ខ្មែរ</option>
                <option value="LO">🇱🇦 ລາວ</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
