import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const [darkMode, setDarkMode] = useState(false);

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
    <Router>
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
          </Routes>
        </main>

        <ChatBotWidget />
      </div>
    </Router>
  );
}

export default App;
