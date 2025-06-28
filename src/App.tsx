import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

<<<<<<< HEAD
import ProtectedRoute from "./routes/ProtectedRoute";
import PrivateRoute from "./routes/PrivateRoute";

=======
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
import Header from "./components/ui/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
<<<<<<< HEAD
=======
import Dashboard from "./pages/Dashboard";
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Cookies from "./pages/Cookies";
import SuccessStories from "./pages/SuccessStories";
<<<<<<< HEAD
import BookTestDrive from "./pages/BookTestDrive";
import VehicleCatalogue from "./pages/VehicleCatalogue";
import ChatBotWidget from "./components/ChatBot/ChatBotWidget";

import AdminDashboard from './pages/Dashboard/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import GuestDashboard from './pages/Dashboard/GuestDashboard';
=======
import BookTestDrive from './pages/BookTestDrive';
import VehicleCatalogue from "./pages/VehicleCatalogue";
import ChatBotWidget from "./components/ChatBot/ChatBotWidget";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import GuestDashboard from "./pages/Dashboard/GuestDashboard";
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Router>
      <div className={darkMode ? "dark bg-gradient-to-r from-blue-950 to-black text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="transition-colors duration-300">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
<<<<<<< HEAD
=======
            <Route path="/dashboard" element={<Dashboard />} />
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/book-test-drive" element={<BookTestDrive />} />
            <Route path="/vehicle-catalogue" element={<VehicleCatalogue />} />

<<<<<<< HEAD
            {/* ✅ Role-based Secured Dashboards */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute>
                  <PrivateRoute>
                    <CustomerDashboard />
                  </PrivateRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/guest"
              element={
                <ProtectedRoute>
                  <PrivateRoute>
                    <GuestDashboard />
                  </PrivateRoute>
                </ProtectedRoute>
              }
            />
=======
            {/* ✅ Role-based Dashboards */}
            <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/guest" element={<ProtectedRoute><GuestDashboard /></ProtectedRoute>} />
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
          </Routes>
        </main>

        <ChatBotWidget />
      </div>
    </Router>
  );
}

export default App;
