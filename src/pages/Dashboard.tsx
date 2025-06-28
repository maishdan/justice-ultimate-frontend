// Due to the scope and size of a full-featured dashboard with more than 1000 lines of code
// including authentication, dynamic data, protected routes, sidebar, topbar, widgets, payment
// system, profile management, language switcher, etc., we'll modularize it into multiple components.
// Here's a complete scaffold with placeholders and example implementation to get you started.

// 📁 src/pages/Dashboard.tsx

import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Custom hook to check if user is authenticated
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import WelcomeCard from '../components/dashboard/widgets/WelcomeCard';
import StatsOverview from '../components/dashboard/widgets/StatsOverview';
import UpcomingAppointments from '../components/dashboard/widgets/UpcomingAppointments';
import AIRecommendations from '../components/dashboard/widgets/AIRecommendations';
import NotificationsFeed from '../components/dashboard/widgets/NotificationsFeed';
import LanguageCurrencySwitcher from '../components/dashboard/widgets/LanguageCurrencySwitcher';
import OffersCarousel from '../components/dashboard/widgets/OffersCarousel';
import SecurityPanel from '../components/dashboard/widgets/SecurityPanel';
import VehicleTracker from '../components/dashboard/widgets/VehicleTracker';
import Footer from '../components/Footer';
import VirtualCarConsultant from '../components/dashboard/ai/VirtualCarConsultant';
import DocumentUploader from '../components/dashboard/uploads/DocumentUploader';
import TradeInEvaluator from '../components/dashboard/widgets/TradeInEvaluator';
import AffiliatePanel from '../components/dashboard/widgets/AffiliatePanel';
import NotificationCenter from '../components/dashboard/widgets/NotificationsCenter';
import AddOnStore from "../components/dashboard/widgets/AddOnStore";
import FinanceCalculator from "../components/dashboard/widgets/FinanceCalculator";



export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeCard />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsOverview />
            <UpcomingAppointments />
            <AIRecommendations />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VirtualCarConsultant />
            <DocumentUploader />
            <NotificationCenter />
            <TradeInEvaluator />
            <AffiliatePanel />
            <NotificationsFeed />
            <LanguageCurrencySwitcher />
            <VehicleTracker />
            <OffersCarousel />
            <FinanceCalculator />
            <SecurityPanel />
            <AddOnStore />
          </div>
          <SecurityPanel />
        </main>
        <Footer />
      </div>
    </div>
  );
}
