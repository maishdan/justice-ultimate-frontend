import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from 'react';

import ProtectedRoute from "./routes/ProtectedRoute";
import PrivateRoute from "./routes/PrivateRoute";

import Header from "./components/ui/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
import CustomerDashboard from './pages/CustomerDashboard';
import GuestDashboard from './pages/Dashboard/GuestDashboard';

// ✅ Import the dynamic CarDetails page
import CarDetails from "./pages/app/CarDetails";

// ✅ Import Error Pages (which use ErrorLayout internally)
import NotFound404 from "./pages/errors/NotFound404";
import ServerError500 from "./pages/errors/ServerError500";
import Forbidden403 from "./pages/errors/Forbidden403";
import Unauthorized401 from "./pages/errors/Unauthorized401";
import GenericErrorPage from "./pages/errors/GenericErrorPage";

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

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

  // Detect preference from localStorage or system
  useEffect(() => {
    const localPref = localStorage.getItem("darkMode");
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = localPref !== null ? localPref === "true" : systemPref;

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  // Apply class and persist to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
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
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/book-test-drive" element={<BookTestDrive />} />
          <Route path="/vehicle-catalogue" element={<VehicleCatalogue />} />

          {/* ✅ Dynamic Car Details Route */}
          <Route path="/cars/:slug/:id" element={<CarDetails />} />

          {/* Dashboards */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute>
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/customer" element={
            <ProtectedRoute>
              <PrivateRoute>
                <CustomerDashboard />
              </PrivateRoute>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/guest" element={
            <ProtectedRoute>
              <PrivateRoute>
                <GuestDashboard />
              </PrivateRoute>
            </ProtectedRoute>
          } />

          {/* ✅ Error Routes */}
          <Route path="/401" element={<Unauthorized401 />} />
          <Route path="/403" element={<Forbidden403 />} />
          <Route path="/500" element={<ServerError500 />} />
          <Route path="/error" element={<GenericErrorPage />} />

          {/* ✅ Catch-all fallback */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </main>

      <ChatBotWidget />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
