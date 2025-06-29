import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import WelcomeCard from '../../components/dashboard/widgets/WelcomeCard';
import OffersCarousel from '../../components/dashboard/widgets/OffersCarousel';
import Footer from '../../components/Footer';

export default function GuestDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeCard />
          <OffersCarousel />
          <p className="text-lg">
            Welcome to <span className="text-yellow-400 font-semibold">Justice Ultimate Automobiles</span>. 
            As a guest, you can browse vehicles, view news, and request test drives. For full access, please register or login.
          </p>
        </main>
        <Footer />
      </div>
    </div>
  );
}
