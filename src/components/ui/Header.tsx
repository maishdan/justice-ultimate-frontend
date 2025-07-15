// ✅ Install Required Package (if not already installed):
// npm install framer-motion

// 📁 File: src/components/ui/Header.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.png";

export default function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}) {
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
    { label: "🏠 Home", path: "/" },
    { label: "🧾 Services", path: "/services" },
    { label: "🚘 Showroom", path: "/vehicle-catalogue" },
    {
      label: "🏢 Company", path: "#", subMenu: [
        { label: "📰 News", path: "/news" },
        { label: "🌟 Success Stories", path: "/success-stories" },
        { label: "📖 About Us", path: "/about" },
      ]
    },
    { label: "✉️ Contact Us", path: "/contact" },
  ];

  const [language, setLanguage] = useState("EN");
  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "EN" ? "SW" : "EN"));
  };

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

  return (
    <header className={`w-full z-50 fixed top-0 left-0 transition-colors duration-1000 animate-gradientShift ${darkMode ? "bg-blue-950 text-white" : "bg-white text-black border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full animate-pulse shadow-md" />
          <span className="text-lg font-bold text-green-400 whitespace-nowrap animate-pulse">
            Justice Ultimate Automobiles
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link, index) =>
            link.subMenu ? (
              <div
                key={`nav-${index}`}
                className="relative"
                onMouseEnter={handleDropdownOpen}
                onMouseLeave={handleDropdownClose}
              >
                <span
                  className="cursor-pointer hover:text-green-400"
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
                        className="block px-4 py-2 hover:bg-green-600 hover:text-white transition-all rounded-md"
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
                className={`hover:text-green-400 ${location.pathname === link.path ? activeLinkClass : ""}`}
              >
                {link.label}
              </Link>
            )
          )}

          {!isAuthenticated && (
            <>
              <Link to="/register" className="border border-green-400 px-3 py-1 rounded hover:bg-green-400 hover:text-black">
                📝 Register
              </Link>
              <Link to="/login" className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-400">
                🔐 Login
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="relative group ml-2">
              <button onClick={handleLogout} className="flex items-center justify-center p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition">
                <LogOut className="w-6 h-6 text-gray-700 dark:text-gray-200 hover:text-red-600 cursor-pointer" />
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                Logout
              </div>
            </div>
          )}

          <button onClick={() => setDarkMode(!darkMode)} className="ml-2 hover:text-yellow-400" aria-label="Toggle Dark Mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={handleLanguageToggle} className="ml-2 border px-2 py-1 rounded hover:bg-green-100 text-xs">
            🌍 {language}
          </button>
        </nav>

        <Button className="md:hidden ml-auto" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
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
            className="md:hidden fixed top-0 left-0 h-[85%] w-1/2 z-50 rounded-tr-2xl rounded-br-2xl backdrop-blur-lg bg-[rgba(11,31,58,0.92)] text-white shadow-2xl p-6 space-y-4 text-base"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' }}
          >
            {navLinks.map((link) =>
              link.subMenu ? (
                <div className="space-y-1" key={link.label}>
                  <span className="font-semibold cursor-pointer animate-pulse shadow-md rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-blue-500">
                    {link.label}
                  </span>
                  {link.subMenu.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className="block ml-4"
                      onClick={() => setMenuOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.path} to={link.path} className="block" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              )
            )}

            {!isAuthenticated && (
              <>
                <Link to="/register" className="block" onClick={() => setMenuOpen(false)}>
                  📝 Register
                </Link>
                <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>
                  🔐 Login
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="relative group ml-2">
                <button onClick={handleLogout} className="flex items-center justify-center p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition">
                  <LogOut className="w-6 h-6 text-gray-700 dark:text-gray-200 hover:text-red-600 cursor-pointer" />
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  Logout
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setMenuOpen(false);
              }}
              className="mt-2 flex items-center gap-2"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />} Toggle Theme
            </button>

            <button onClick={handleLanguageToggle} className="block mt-2 border px-2 py-1 rounded text-sm">
              🌍 {language}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
