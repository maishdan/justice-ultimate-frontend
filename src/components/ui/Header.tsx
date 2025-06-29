import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";

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

  const location = useLocation();

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
    ? "bg-green-500 text-black px-3 py-1 rounded"
    : "bg-green-600 text-white px-3 py-1 rounded";

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
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className={`w-full shadow-md z-50 sticky top-0 ${darkMode ? "bg-blue-950 text-white" : "bg-white text-black border-b border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-600 text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
            J
          </div>
          <span className="text-lg font-bold text-green-400">
            Justice Ultimate Automobiles
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) =>
            link.subMenu ? (
              <div
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
                        className="block px-4 py-2 hover:bg-green-600 hover:text-white transition-all"
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

          <Link to="/register" className="border border-green-400 px-3 py-1 rounded hover:bg-green-400 hover:text-black">
            📝 Register
          </Link>
          <Link to="/login" className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-400">
            🔐 Login
          </Link>

          <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-2 rounded">
            Logout
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="ml-2 hover:text-yellow-400" aria-label="Toggle Dark Mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={handleLanguageToggle} className="ml-2 border px-2 py-1 rounded hover:bg-green-100 text-xs">
            🌍 {language}
          </button>
        </nav>

        <Button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          ☰
        </Button>
      </div>

      {menuOpen && (
        <div className={`md:hidden px-4 pb-4 space-y-2 ${darkMode ? "bg-blue-900 text-white" : "bg-white text-black"}`}>
          {navLinks.map((link) =>
            link.subMenu ? (
              <div className="space-y-1">
                <span className="font-semibold cursor-pointer">{link.label}</span>
                {link.subMenu.map((sub) => (
                  <Link key={sub.path} to={sub.path} className="block ml-4" onClick={() => setMenuOpen(false)}>
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

          <Link to="/register" className="block" onClick={() => setMenuOpen(false)}>
            📝 Register
          </Link>
          <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>
            🔐 Login
          </Link>

          <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-2 rounded">
            Logout
          </button>

          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMenuOpen(false);
            }}
            className="mt-2 flex items-center gap-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            Toggle Theme
          </button>

          <button onClick={handleLanguageToggle} className="block mt-2 border px-2 py-1 rounded text-sm">
            🌍 {language}
          </button>
        </div>
      )}
    </header>
  );
}
