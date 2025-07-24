// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from 'zxcvbn';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import { testBackendConnection } from '../lib/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Car, CheckCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = '6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T';

const countries = [
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "NG", name: "Nigeria", dial: "+234" },
];

function ContinueAsGuestButton() {
  const navigate = useNavigate();
  return (
    <motion.button
      className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.setItem("guestSession", "true");
        navigate("/dashboard/guest");
      }}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Continue as Guest
    </motion.button>
  );
}

export default function RegisterPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize reCAPTCHA v3
  useEffect(() => {
    // Test backend connection for register
    console.log('🔍 Testing backend connectivity for register...');
    
    // Test general backend connection
    testBackendConnection().then(result => {
      if (result.success) {
        console.log('✅ Backend connection successful for register');
        toast.success('Backend connected successfully for registration');
      } else {
        console.error('❌ Backend connection failed for register:', result.error);
        toast.error('Backend connection failed for registration - check console for details');
      }
    });
    
    return () => {
      // No script to remove here
    };
  }, []);
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("KE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setRecaptchaError(null);

    // Password strength check
    const strong =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (!strong) {
      setError("Password must be at least 8 characters and include upper, lower, number, and special character.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Trigger invisible reCAPTCHA and get token
    let token = recaptchaToken;
    if (recaptchaRef.current) {
      token = await recaptchaRef.current.executeAsync();
      setRecaptchaToken(token);
    }

    if (!token) {
      setRecaptchaError('Please complete the reCAPTCHA.');
      setLoading(false);
      return;
    }

    // Verify reCAPTCHA with backend
    try {
      const backendUrl =
        window.location.hostname === 'localhost'
          ? 'http://localhost:5001'
          : import.meta.env.VITE_BACKEND_URL;
      const verifyRes = await fetch(`${backendUrl}/api/verify-recaptcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setRecaptchaError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setRecaptchaError('reCAPTCHA verification failed. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            country,
            phone_number: phoneNumber,
          },
          emailRedirectTo: window.location.origin + "/login",
        },
      });
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success("Registration successful! Please check your email to confirm your account.");
        localStorage.removeItem("guestSession");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const registerWithProvider = async (provider: 'google' | 'github') => {
    setLoading(true);
    console.log('OAuth button clicked:', provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard/customer'
      }
    });
    if (!error) {
      localStorage.removeItem("guestSession"); // <-- Ensure guestSession is cleared after OAuth
    }
    setLoading(false);
  };

  const selectedCountry = countries.find(c => c.code === country);

  return (
    <div 
      className="min-h-screen w-full pt-0"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Enhanced Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none z-10"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div className="relative z-10 w-full flex justify-center items-center">
        <motion.div 
          className="glass-panel rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-white/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ToastContainer />
          <audio ref={audioRef} src="/sounds/iphone-notification.mp3" preload="auto" />
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
              <Car className="w-6 h-6" /> Create Your Account
            </h2>
            <p className="text-white/80 text-sm">Join Justice Ultimate Automobiles today</p>
          </motion.div>

          {success ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Check your email to confirm your account!</h3>
              <p className="text-white/80 mb-6">We've sent a confirmation link to <span className="font-bold text-yellow-400">{email}</span>. Please confirm your email to activate your account and then log in.</p>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 font-semibold"
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Login
              </motion.button>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleRegister} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Full Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  placeholder="Your full name"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  placeholder="you@email.com"
                />
              </motion.div>

              {/* Country Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Country
                </label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 appearance-none cursor-pointer"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code} className="bg-gray-800 text-white">{c.name} ({c.dial})</option>
                  ))}
                </select>
              </motion.div>

              {/* Phone Number Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <div className="flex">
                  <span className="px-3 py-3 bg-white/10 border border-r-0 border-white/20 rounded-l-xl text-white/80 backdrop-blur-sm">
                    {selectedCountry?.dial}
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 border border-white/20 rounded-r-xl bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                    placeholder="Phone number"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setPasswordStrength(zxcvbn(e.target.value).score);
                  }}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  placeholder="Create a password"
                />
                <div className="text-xs mt-2 text-white/70">
                  Password strength: <span className={`font-semibold ${passwordStrength >= 3 ? 'text-green-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {["Weak","Fair","Good","Strong","Very strong"][passwordStrength]}
                  </span>
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <label className="block text-white/90 font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  placeholder="Confirm your password"
                />
              </motion.div>

              {error && (
                <motion.div 
                  className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
              
              {/* Register Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center ${
                  loading 
                    ? 'bg-white/20 text-white/60 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
              
              <ContinueAsGuestButton />

              {/* OAuth Buttons */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <motion.button
                  type="button"
                  onClick={() => registerWithProvider('google')}
                  disabled={loading}
                  className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center text-white hover:bg-white/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaGoogle className="mr-2" /> Sign up with Google
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => registerWithProvider('github')}
                  disabled={loading}
                  className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center text-white hover:bg-white/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaGithub className="mr-2" /> Sign up with GitHub
                </motion.button>
              </motion.div>
              
              {/* Login Link */}
              <motion.div 
                className="text-center text-sm mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                <span className="text-white/80">Already have an account?{' '}</span>
                <span
                  className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </motion.div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                size="invisible"
                badge="bottomright"
                onChange={(token: string | null) => setRecaptchaToken(token)}
                onErrored={() => setRecaptchaError('reCAPTCHA error. Please reload the page.')}
                style={{ display: 'none' }}
              />
              {recaptchaError && <div className="text-red-400 text-sm p-2">{recaptchaError}</div>}
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
