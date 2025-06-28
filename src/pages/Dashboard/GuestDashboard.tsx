<<<<<<< HEAD
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import WelcomeCard from '../../components/dashboard/widgets/WelcomeCard';
import OffersCarousel from '../../components/dashboard/widgets/OffersCarousel';
import Footer from '../../components/Footer';

export default function GuestDashboard() {

// interface Auth and useAuth definition removed because useAuth is already imported

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeCard />
          <OffersCarousel />
          <p className="text-lg">
            Welcome to Justice Ultimate Automobiles. As a guest, you can browse vehicles, view news, and request test drives.
          </p>
        </main>
        <Footer />
      </div>
=======
export default function GuestDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 text-white">
      <h2 className="text-3xl font-semibold">Guest Dashboard</h2>
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
    </div>
  );
}
