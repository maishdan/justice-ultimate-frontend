// src/pages/Dashboard/CustomerDashboard.tsx
import useAuth from '../hooks/useAuth';
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
import VehicleTracker from '../components/dashboard/widgets/VehicleTracker.tsx';
import Footer from '../components/Footer';
import VirtualCarConsultant from '../components/dashboard/ai/VirtualCarConsultant';
import DocumentUploader from '../components/dashboard/uploads/DocumentUploader';
import TradeInEvaluator from '../components/dashboard/widgets/TradeInEvaluator';
import AffiliatePanel from '../components/dashboard/widgets/AffiliatePanel';
import NotificationCenter from '../components/dashboard/widgets/NotificationsCenter';
import AddOnStore from "../components/dashboard/widgets/AddOnStore";
import FinanceCalculator from "../components/dashboard/widgets/FinanceCalculator";

// New Functional Feature Imports
import DashboardHome from '../components/dashboard/customer/DashboardHome';
import ProfileInfo from '../components/dashboard/customer/ProfileInfo';
import BookingsAppointments from '../components/dashboard/customer/BookingsAppointments';
import MyCars from '../components/dashboard/customer/MyCars';
import Payments from '../components/dashboard/customer/Payments';
import AICarMatch from '../components/dashboard/customer/AICarMatch';
import OffersDeals from '../components/dashboard/customer/OffersDeals';
import DocumentsLegal from '../components/dashboard/customer/DocumentsLegal';
import Notifications from '../components/dashboard/customer/Notifications';
import SecuritySettings from '../components/dashboard/customer/SecuritySettings';
import Logout from '../components/dashboard/customer/Logout';

export default function CustomerDashboard() {
  useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeCard />

          {/* New Functional Section Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DashboardHome />
            <ProfileInfo />
            <BookingsAppointments />
            <MyCars />
            <Payments />
            <AICarMatch />
            <OffersDeals />
            <DocumentsLegal />
            <Notifications />
            <SecuritySettings />
            <Logout />
          </div>

          {/* Widgets */}
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
