// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import allCountries from "../data/allCountries";
import zxcvbn from 'zxcvbn';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import { API_ENDPOINTS } from '../lib/api';

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
    <button
      className="w-full mt-4 py-2 px-4 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.setItem("guestSession", "true");
        navigate("/dashboard/guest");
      }}
      type="button"
    >
      Continue as Guest
    </button>
  );
}

export default function RegisterPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize reCAPTCHA v3
  useEffect(() => {
    // Load reCAPTCHA v3 script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  const playCling = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };
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
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    let recaptchaToken: string;
    
    try {
      setCaptchaLoading(true);
      // Execute reCAPTCHA v3
      recaptchaToken = await new Promise<string>((resolve, reject) => {
        if (typeof window !== 'undefined' && (window as any).grecaptcha) {
          (window as any).grecaptcha.ready(() => {
            (window as any).grecaptcha.execute('6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T', { action: 'register' })
              .then((token: string) => resolve(token))
              .catch((error: any) => reject(error));
          });
        } else {
          reject(new Error('reCAPTCHA not loaded'));
        }
      });
      
      setCaptchaVerified(true);
      setCaptchaLoading(false);
    } catch (error) {
      setCaptchaLoading(false);
      setError('reCAPTCHA verification failed. Please try again.');
      toast.error('reCAPTCHA verification failed. Please try again.');
      setLoading(false);
      return;
    }

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

    try {
      // Verify reCAPTCHA with backend
      const recaptchaResponse = await fetch(API_ENDPOINTS.verifyRecaptcha, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'g-recaptcha-response': recaptchaToken
        }),
      });

      if (!recaptchaResponse.ok) {
        setError('reCAPTCHA verification failed. Please try again.');
        toast.error('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }

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
      setCaptchaVerified(false);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-4">
      <ToastContainer />
      <audio ref={audioRef} src="/sounds/iphone-notification.mp3" preload="auto" />
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Create Your Account</h2>
        {success ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Check your email to confirm your account!</h3>
            <p className="text-gray-700 mb-4">We've sent a confirmation link to <span className="font-bold">{email}</span>. Please confirm your email to activate your account and then log in.</p>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >Go to Login</button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Country</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <div className="flex">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l text-gray-600">
                  {selectedCountry?.dial}
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setPasswordStrength(zxcvbn(e.target.value).score);
                }}
                required
                minLength={8}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Create a password"
              />
              <div className="text-xs mt-1">
                Password strength: {["Weak","Fair","Good","Strong","Very strong"][passwordStrength]}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm your password"
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            
            {/* reCAPTCHA v3 Status Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                {captchaLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-600">Verifying reCAPTCHA...</span>
                  </>
                ) : captchaVerified ? (
                  <>
                    <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-green-600">reCAPTCHA verified ✓</span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">reCAPTCHA verification required</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                This site is protected by reCAPTCHA v3
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading || captchaLoading}
              className={`w-full py-2 px-4 rounded font-semibold transition ${
                loading || captchaLoading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? "Registering..." : captchaLoading ? "Verifying..." : "Register"}
            </button>
            
            <ContinueAsGuestButton />
            {/* OAuth Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => registerWithProvider('google')}
                disabled={loading}
                className="w-full py-2 bg-white border border-gray-300 rounded font-semibold transition-all duration-300 shadow-md flex justify-center items-center text-gray-700 hover:bg-gray-50"
              >
                <FaGoogle className="mr-2" /> Sign up with Google
              </button>
              <button
                type="button"
                onClick={() => registerWithProvider('github')}
                disabled={loading}
                className="w-full py-2 bg-black text-white rounded font-semibold transition-all duration-300 shadow-md flex justify-center items-center hover:bg-gray-800"
              >
                <FaGithub className="mr-2" /> Sign up with GitHub
              </button>
            </div>
            
            <div className="text-center text-sm mt-2">
              Already have an account?{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >Login</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
