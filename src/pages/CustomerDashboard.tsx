// src/pages/Dashboard/CustomerDashboard.tsx
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import WelcomeCard from '../components/dashboard/widgets/WelcomeCard';
import StatsOverview from '../components/dashboard/widgets/StatsOverview';
import UpcomingAppointments from '../components/dashboard/widgets/UpcomingAppointments';
import AIRecommendations from '../components/dashboard/widgets/AIRecommendations';
import OffersCarousel from '../components/dashboard/widgets/OffersCarousel';
import ProfileInfo from '../components/dashboard/customer/ProfileInfo';
import BookingsAppointments from '../components/dashboard/customer/BookingsAppointments';
import MyCars from '../components/dashboard/customer/MyCars';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import Overview from '../components/dashboard/customer/features/Overview';
import Profile from '../components/dashboard/customer/features/Profile';
import Vehicles from '../components/dashboard/customer/features/Vehicles';
import Payments from '../components/dashboard/customer/features/Payments';
import Bookings from '../components/dashboard/customer/features/Bookings';
import Offers from '../components/dashboard/customer/features/Offers';
import Notifications from '../components/dashboard/customer/features/Notifications';
import Documents from '../components/dashboard/customer/features/Documents';
import Security from '../components/dashboard/customer/features/Security';
import AICarMatch from '../components/dashboard/customer/features/AICarMatch';
import Support from '../components/dashboard/customer/features/Support';
import Loyalty from '../components/dashboard/customer/features/Loyalty';
import Carbon from '../components/dashboard/customer/features/Carbon';
import History from '../components/dashboard/customer/features/History';
import Insurance from '../components/dashboard/customer/features/Insurance';
import Recommendations from '../components/dashboard/customer/features/Recommendations';
import Community from '../components/dashboard/customer/features/Community';
import Refer from '../components/dashboard/customer/features/Refer';
import Logout from '../components/dashboard/customer/features/Logout';

const MENU = [
  { key: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
  { key: 'profile', label: 'Profile & Settings', icon: '👤' },
  { key: 'vehicles', label: 'My Vehicles', icon: '🚘' },
  { key: 'payments', label: 'Payments & Billing', icon: '💰' },
  { key: 'bookings', label: 'Bookings & Appointments', icon: '📅' },
  { key: 'offers', label: 'Offers & Deals', icon: '🎁' },
  { key: 'notifications', label: 'Notifications & Messages', icon: '🔔' },
  { key: 'documents', label: 'Documents & Legal', icon: '📄' },
  { key: 'security', label: 'Security & Privacy', icon: '🛡️' },
  { key: 'ai', label: 'AI Car Match', icon: '🤖' },
  { key: 'support', label: 'Support & Helpdesk', icon: '📞' },
  { key: 'loyalty', label: 'Loyalty & Rewards', icon: '🏅' },
  { key: 'carbon', label: 'Carbon Footprint Tracker', icon: '🌱' },
  { key: 'history', label: 'Vehicle History & Reports', icon: '📊' },
  { key: 'insurance', label: 'Insurance & Protection', icon: '🛡️' },
  { key: 'recommendations', label: 'Smart Recommendations', icon: '💡' },
  { key: 'community', label: 'Community & Events', icon: '🌐' },
  { key: 'refer', label: 'Refer a Friend', icon: '🤝' },
  { key: 'logout', label: 'Logout', icon: '🚪' },
];

export default function CustomerDashboard() {
  useAuth();
  const [user, setUser] = useState<{ name?: string; email?: string } | undefined>(undefined);
  const [activePanel, setActivePanel] = useState('dashboard');

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          name: data.user.user_metadata?.full_name || '',
          email: data.user.email || '',
        });
      }
    }
    fetchUser();
  }, []);

  // Panel rendering logic
  let mainPanel;
  switch (activePanel) {
    case 'dashboard':
      mainPanel = <Overview />;
      break;
    case 'profile':
      mainPanel = <Profile />;
      break;
    case 'vehicles':
      mainPanel = <Vehicles />;
      break;
    case 'payments':
      mainPanel = <Payments />;
      break;
    case 'bookings':
      mainPanel = <Bookings />;
      break;
    case 'offers':
      mainPanel = <Offers />;
      break;
    case 'notifications':
      mainPanel = <Notifications />;
      break;
    case 'documents':
      mainPanel = <Documents />;
      break;
    case 'security':
      mainPanel = <Security />;
      break;
    case 'ai':
      mainPanel = <AICarMatch />;
      break;
    case 'support':
      mainPanel = <Support />;
      break;
    case 'loyalty':
      mainPanel = <Loyalty />;
      break;
    case 'carbon':
      mainPanel = <Carbon />;
      break;
    case 'history':
      mainPanel = <History />;
      break;
    case 'insurance':
      mainPanel = <Insurance />;
      break;
    case 'recommendations':
      mainPanel = <Recommendations />;
      break;
    case 'community':
      mainPanel = <Community />;
      break;
    case 'refer':
      mainPanel = <Refer />;
      break;
    case 'logout':
      mainPanel = <Logout />;
      setTimeout(() => window.location.href = '/logout', 1200);
      break;
    default:
      mainPanel = <Overview />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-500 text-white flex">
      {/* Sidebar Menu */}
      <aside className="w-72 bg-gradient-to-r from-blue-600 to-purple-500 text-white min-h-screen p-6 shadow-xl flex flex-col">
        <div className="text-2xl font-extrabold mb-10 text-center tracking-wide drop-shadow-lg">Justice Ultimate Automobiles</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {MENU.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all font-semibold text-lg hover:bg-white/10 hover:shadow-lg hover:scale-[1.03] ${activePanel === item.key ? 'bg-white/20 shadow-lg scale-[1.03] text-yellow-400 ring-2 ring-yellow-400' : 'bg-white/5 text-white'}`}
                  onClick={() => setActivePanel(item.key)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 text-center text-xs text-blue-100">&copy; {new Date().getFullYear()} Justice Ultimate Automobiles</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-8 animate-fadein">
          {mainPanel}
        </main>
        <Footer />
      </div>
    </div>
  );
}
