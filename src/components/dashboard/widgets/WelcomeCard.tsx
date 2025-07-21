import React, { useState, useRef } from 'react';
import { FiSettings, FiLogOut, FiUser, FiSliders } from 'react-icons/fi';

interface WelcomeCardProps {
  user?: {
    name?: string;
    role?: string;
    photo?: string;
  };
  setActivePanel: (panel: string) => void;
  onLogout: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user, setActivePanel, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  if (!user || !user.name || !user.role) return null;
  // Determine greeting
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Admin!';
    if (hour < 18) return 'Good afternoon, Admin!';
    return 'Good evening, Admin!';
  }
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-2 border-4 border-transparent bg-clip-padding bg-gradient-to-br from-blue-800/90 via-purple-900/80 to-blue-950/95" style={{ boxShadow: '0 8px 32px 0 rgba(0, 60, 255, 0.25), 0 0 24px 4px #6366f1, 0 0 0 6px #facc15 inset' }}>
      {/* Greeting at the top */}
      <div className="mb-2 text-center font-extrabold" style={{ color: '#ffd700', fontSize: '1.5rem', fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '0.03em', textShadow: '0 2px 12px #1e293b, 0 0 16px #ffd700' }}>{getGreeting()}</div>
      {/* Main Row: Profile (left), Info (center), Settings (right) */}
      <div className="flex items-center justify-between w-full mb-2 gap-4">
        {/* Profile Picture Far Left */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <img
            src={user.photo || '/default-avatar.png'}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-4 border-blue-400 shadow-lg bg-white/20"
            style={{ boxShadow: '0 0 16px 4px #3b82f6, 0 2px 12px #1e293b99' }}
          />
        </div>
        {/* Centered Info */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          {/* Strong visible gradient for name */}
          <h2 className="mb-1 text-center truncate font-extrabold" style={{
            fontSize: '2.3rem',
            fontFamily: 'Montserrat, Arial, sans-serif',
            letterSpacing: '0.01em',
            background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 12px #1e293b, 0 0 16px #6366f1',
            lineHeight: 1.1
          }}>Welcome, {user.name}!</h2>
          <p className="mb-1 text-center font-bold" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Poppins, Arial, sans-serif', letterSpacing: '0.01em', textShadow: '0 2px 12px #1e293b, 0 0 8px #38bdf8' }}>Administrator</p>
        </div>
        {/* Settings Button Far Right */}
        <div className="flex-shrink-0 flex items-center justify-center relative" ref={dropdownRef}>
          <button
            className="p-3 rounded-full glass-panel bg-gradient-to-br from-blue-700/80 to-blue-900/80 border border-blue-400/40 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Open settings menu"
          >
            <FiSettings className="text-2xl text-white" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel bg-gradient-to-br from-blue-800/90 to-blue-950/90 border border-blue-400/30 rounded-xl py-2 backdrop-blur-xl animate-fade-in">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-700/40 rounded-xl transition-all text-lg font-semibold"
                onClick={() => { setActivePanel('settings'); setDropdownOpen(false); }}
              >
                <FiSliders className="text-xl" /> System Settings
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-700/40 rounded-xl transition-all text-lg font-semibold"
                onClick={() => { setActivePanel('profile'); setDropdownOpen(false); }}
              >
                <FiUser className="text-xl" /> Profile
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-700/30 rounded-xl transition-all text-lg font-semibold"
                onClick={() => { setDropdownOpen(false); onLogout(); }}
              >
                <FiLogOut className="text-xl" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Quote at the bottom */}
      <div className="mt-4 text-center opacity-90 font-semibold" style={{ color: '#60a5fa', fontStyle: 'italic', fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 600, fontSize: '1.15rem', letterSpacing: '0.01em', textShadow: '0 2px 12px #1e293b, 0 0 16px #60a5fa' }}>Empowering Excellence Every Day</div>
    </div>
  );
};

export default WelcomeCard;
