import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
// React import preserved by tooling; leaving as is

import ProtectedRoute from "./routes/ProtectedRoute";
// removed unused PrivateRoute import
import AllCarsShowcase from "./pages/AllCarsShowcase";
import ErrorBoundary from "./components/ErrorBoundary";
import InstallPrompt from "./components/InstallPrompt";

import Header from "./components/ui/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SelectRole from "./pages/SelectRole";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Videos from "./pages/Videos";
import Whitelist from "./pages/Whitelist";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Cookies from "./pages/Cookies";
import SuccessStories from "./pages/SuccessStories";
import BookTestDrive from "./pages/BookTestDrive";
import VehicleCatalogue from "./pages/VehicleCatalogue";
import ChatBotWidget from "./components/ChatBot/ChatBotWidget";
import ApplyForFinancing from "./pages/ApplyForFinancing";
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import StaffDashboard from './pages/Dashboard/StaffDashboard';
import MechanicDashboard from './pages/Dashboard/MechanicDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import GuestDashboard from './pages/Dashboard/GuestDashboard';
import ScrollToTop from "./components/ScrollToTop";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import CarDetailPage from "./pages/CarDetailPage";
import SetNewPassword from './pages/SetNewPassword';
import Setup2FA from './pages/Setup2FA';
import { UserProfileProvider } from './context/UserProfileContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from 'react-i18next';
import RentalsPage from './pages/RentalsPage';
import TestHeaderFixed from "./pages/TestHeaderFixed";

// ✅ Import the dynamic CarDetails page

// ✅ Import Error Pages (which use ErrorLayout internally)
import NotFound404 from "./pages/errors/NotFound404";
import ServerError500 from "./pages/errors/ServerError500";
import Forbidden403 from "./pages/errors/Forbidden403";
import Unauthorized401 from "./pages/errors/Unauthorized401";
import GenericErrorPage from "./pages/errors/GenericErrorPage";

function App() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Silently update: skip waiting and activate new SW without popup
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  // Optionally, reload automatically (or just do nothing for silent update)
                  // window.location.reload();
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  // ✅ Car Start Sound: Play only on initial homepage load with debug log
  useEffect(() => {
    if (location.pathname === "/") {
      const audio = new Audio("/car-start.mp3");
      const hasPlayed = sessionStorage.getItem("carStartPlayed");
      if (!hasPlayed) {
        audio.play()
          .then(() => console.log("✅ Sound played"))
          .catch((e) => console.warn("🚫 Autoplay blocked:", e));
        sessionStorage.setItem("carStartPlayed", "true");
      }
    }
  }, [location.pathname]);

  // RTL/LTR switching
  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [i18n.language]);

  // WhatsApp tip show every minute (global functionality)
  useEffect(() => {
    const showTip = () => {
      const tip = document.getElementById('wa-tip');
      if (!tip) return;
      tip.classList.remove('hidden');
      tip.classList.add('flex');
      setTimeout(() => { 
        if (tip) {
          tip.classList.add('hidden'); 
          tip.classList.remove('flex'); 
        }
      }, 4000);
    };
    
    const interval = setInterval(showTip, 60000);
    // initial slight delay
    const initialTimer = setTimeout(showTip, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <UserProfileProvider>
      {/* Global WhatsApp Widget Styles */}
      <style>{`
        .whatsapp-floating-widget {
          position: fixed !important;
          bottom: 1.5rem !important;
          right: 1.5rem !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
        }
        .whatsapp-floating-widget > * {
          pointer-events: auto !important;
        }
      `}</style>
      
      <InstallPrompt />
      <Header />
      {/* Enhanced Floating WhatsApp Widget (Global - Above All Content) */}
      <div className="whatsapp-floating-widget fixed z-[2147483647] bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-none" style={{ zIndex: 2147483647 }}>
        {/* Enhanced Popup Message with Animation */}
        <div 
          id="wa-tip" 
          className="hidden glass-panel px-4 py-3 rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl pointer-events-auto transform translate-x-2 animate-bounce"
          style={{
            background: 'rgba(37, 211, 102, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="text-white text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            We're online — Chat with us on WhatsApp!
          </div>
          <div className="absolute -bottom-1 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#25D366]"></div>
        </div>
        
        {/* Enhanced WhatsApp Button */}
        <a
          href="https://wa.me/254722827458?text=Hello%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20vehicles%20and%20services.%20Could%20you%20please%20assist%20me%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto group relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] shadow-2xl hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110"
          style={{ zIndex: 2147483647 }}
          aria-label="WhatsApp Support"
        >
          {/* Pulse Animation Ring */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></div>
          
          {/* WhatsApp Icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 32 32" 
            fill="white" 
            className="h-9 w-9 relative z-10 group-hover:scale-110 transition-transform duration-300"
          >
            <path d="M19.11 17.59c-.27-.14-1.59-.79-1.83-.88-.24-.09-.42-.14-.6.14-.18.27-.69.88-.84 1.06-.15.18-.31.2-.58.07-.27-.14-1.16-.43-2.2-1.36-.81-.72-1.36-1.61-1.52-1.88-.15-.27-.02-.41.11-.55.11-.11.27-.29.4-.43.13-.15.18-.25.27-.43.09-.18.05-.32-.02-.45-.07-.14-.6-1.45-.82-1.98-.22-.53-.44-.45-.6-.46-.15-.01-.32-.01-.49-.01-.18 0-.45.07-.68.32-.24.27-.9.88-.9 2.15 0 1.27.92 2.5 1.05 2.67.13.18 1.81 2.75 4.4 3.86.62.27 1.1.43 1.48.55.62.2 1.18.17 1.62.1.49-.07 1.59-.65 1.82-1.28.22-.63.22-1.16.15-1.28-.07-.11-.24-.18-.51-.32z"/>
            <path d="M26.07 5.93C23.56 3.42 20.37 2 17 2 9.83 2 4 7.83 4 15c0 2.29.61 4.52 1.77 6.48L4 30l8.69-1.69C14.61 28.39 15.8 28.6 17 28.6c7.17 0 13-5.83 13-13 0-3.37-1.42-6.56-3.93-9.07zM17 26.6c-1.05 0-2.09-.18-3.09-.54l-.22-.08-5.14 1 1-5.02-.1-.23C8.5 20.03 8 17.55 8 15 8 8.93 12.93 4 19 4c3.09 0 6 1.2 8.21 3.4C29.41 9.6 30.6 12.51 30.6 15.6c0 6.07-4.93 11-11 11z"/>
          </svg>
          
          {/* Badge Notification */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </a>
      </div>

      <div className="app-background min-h-screen transition-colors duration-300 clean-container" style={{ paddingTop: '64px' }}>
        <ErrorBoundary>
          <main className="main-content-responsive smooth-scroll">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/whitelist" element={<Whitelist />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/apply-financing" element={<ApplyForFinancing />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/book-test-drive" element={<BookTestDrive />} />
              <Route path="/vehicle-catalogue" element={<VehicleCatalogue />} />
              <Route path="/catalogue" element={<VehicleCatalogue />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/car/:id" element={<CarDetailPage />} />
              <Route path="/set-new-password" element={<SetNewPassword />} />
              <Route path="/setup-2fa" element={<Setup2FA />} />
              <Route path="/rentals" element={<RentalsPage />} />
              <Route path="/test-header" element={<TestHeaderFixed />} />

              {/* ✅ Dynamic Car Details Route */}
             <Route path="/all-cars-showcase" element={<AllCarsShowcase />} />
              

              {/* Obfuscated dashboard routes for extra obscurity (security by obscurity is not primary defense) */}
              <Route path="/secure-admin-dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/secure-staff-dashboard" element={
                <ProtectedRoute requiredRole="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              } />
              <Route path="/secure-mechanic-dashboard" element={
                <ProtectedRoute requiredRole="mechanic">
                  <MechanicDashboard />
                </ProtectedRoute>
              } />
              <Route path="/secure-customer-dashboard" element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/secure-guest-dashboard" element={<GuestDashboard />} />

              {/* Legacy dashboard routes: redirect to obfuscated paths if authenticated, else to login */}
              <Route path="/dashboard/admin" element={<Navigate to="/secure-admin-dashboard" replace />} />
              <Route path="/dashboard/staff" element={<Navigate to="/secure-staff-dashboard" replace />} />
              <Route path="/dashboard/mechanic" element={<Navigate to="/secure-mechanic-dashboard" replace />} />
              <Route path="/dashboard/customer" element={<Navigate to="/secure-customer-dashboard" replace />} />
              <Route path="/dashboard/guest" element={<Navigate to="/secure-guest-dashboard" replace />} />

              {/* Catch-all for /dashboard/* to prevent enumeration */}
              <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />

              {/* ✅ Error Routes */}
              <Route path="/401" element={<Unauthorized401 />} />
              <Route path="/403" element={<Forbidden403 />} />
              <Route path="/500" element={<ServerError500 />} />
              <Route path="/error" element={<GenericErrorPage />} />

              {/* ✅ Catch-all fallback */}
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </main>
        </ErrorBoundary>

        <ChatBotWidget />
      </div>
    </UserProfileProvider>
  );
}

export default function WrappedApp() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <ThemeProvider>
        <LanguageProvider>
          <ErrorBoundary>
            <div
              className="min-h-screen"
              style={{
                backgroundImage: "url('/images/bg-landing.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Overlay for brand color harmony and readability */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(11,31,58,0.7) 0%, rgba(34,197,94,0.5) 100%)',
                  zIndex: 0,
                }}
              />
              <App />
            </div>
          </ErrorBoundary>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}
