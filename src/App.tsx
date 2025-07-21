import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import React from 'react';

import ProtectedRoute from "./routes/ProtectedRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AllCarsShowcase from "./pages/AllCarsShowcase";
import ErrorBoundary from "./components/ErrorBoundary";

import Header from "./components/ui/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SelectRole from "./pages/SelectRole";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import News from "./pages/News";
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

  return (
    <UserProfileProvider>
      <Header />
      <div className="app-background min-h-screen transition-colors duration-300 clean-container" style={{ paddingTop: '64px' }}>
        <ErrorBoundary>
          <main className="main-content-responsive smooth-scroll">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<Services />} />
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
