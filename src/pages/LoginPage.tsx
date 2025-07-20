import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getUserRole, getDashboardPath, createUserProfile } from '../lib/userRoleUtils';
import { Eye, EyeOff, Mail, Lock, Shield, User, Car } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import { API_ENDPOINTS, testBackendConnection, testRecaptchaEndpoint } from '../lib/api';
import { motion } from 'framer-motion';

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

const Login = () => {
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
  
  // Test backend connection on component mount
  useEffect(() => {
    console.log('🔍 Testing backend connectivity for login...');
    console.log('Current backend URL:', API_ENDPOINTS.verifyRecaptcha);
    
    // Test general backend connection
    testBackendConnection().then(result => {
      if (result.success) {
        console.log('✅ Backend connection successful');
        toast.success('Backend connected successfully');
      } else {
        console.error('❌ Backend connection failed:', result.error);
        toast.error('Backend connection failed - check console for details');
      }
    });
    
    // Test reCAPTCHA endpoint specifically
    testRecaptchaEndpoint().then(result => {
      if (result.success) {
        console.log('✅ reCAPTCHA endpoint accessible');
      } else {
        console.error('❌ reCAPTCHA endpoint failed:', result.error);
        toast.error('reCAPTCHA endpoint not accessible - check console for details');
      }
    });
  }, []);
  
  const playCling = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.warn('Audio playback failed:', error);
        });
      } catch (error) {
        console.warn('Audio playback error:', error);
      }
    }
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let recaptchaToken: string;
    
    try {
      setCaptchaLoading(true);
      // Execute reCAPTCHA v3
      recaptchaToken = await new Promise<string>((resolve, reject) => {
        if (typeof window !== 'undefined' && (window as any).grecaptcha) {
          (window as any).grecaptcha.ready(() => {
            (window as any).grecaptcha.execute('6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T', { action: 'login' })
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
    
    // Very short timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      setError('Login timeout. Please try again.');
      setLoading(false);
    }, 10000); // 10 second timeout
    
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

      // Clear any stale session data first
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("sessionId");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      clearTimeout(timeoutId);
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        setLoading(false);
        return;
      }
      
      if (data.session) {
        playCling();
        
        // Set tokens immediately
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("authToken", data.session.access_token);
        localStorage.removeItem("guestSession");
        
        // Get user info and determine role
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            setError('Could not fetch user info.');
            toast.error('Could not fetch user info.');
            setLoading(false);
            return;
          }
          
          console.log('User authenticated:', user.email);
          
          // Determine user role - NO DEFAULTS
          let role: string | null = null;
          let dashboardPath: string | null = null;
          
          try {
            // First, try to get role from profiles table
            role = await getUserRole(user.id);
            console.log('Role determined:', role);
            
            if (role) {
              // Role found, get dashboard path
              dashboardPath = getDashboardPath(role);
              
              if (dashboardPath) {
                // Store user role
                localStorage.setItem("userRole", role);
                sessionStorage.setItem("userRole", role);
                
                // Set session values
                const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const userId = user.id || `user_${Date.now()}`;
                localStorage.setItem("sessionId", sessionId);
                localStorage.setItem("lastSessionId", sessionId);
                localStorage.setItem("sessionTimestamp", Date.now().toString());
                localStorage.setItem("userId", userId);
                sessionStorage.setItem("sessionId", sessionId);
                sessionStorage.setItem("userId", userId);
                
                toast.success(`Login successful! Welcome ${role}!`);
                navigate(dashboardPath, { replace: true });
                return;
              } else {
                console.error('Invalid dashboard path for role:', role);
                setError('Invalid user role configuration.');
                toast.error('Invalid user role configuration.');
                setLoading(false);
                return;
              }
            } else {
              // No role found - redirect to role selection
              console.log('No role assigned to user, redirecting to role selection');
              
              // Store user info for role selection
              localStorage.setItem("tempUserId", user.id || '');
              localStorage.setItem("tempUserEmail", user.email || '');
              
              toast.info('Please select your user role to continue.');
              navigate('/select-role', { replace: true });
              return;
            }
          } catch (profileErr) {
            console.log('Profile operation failed:', profileErr);
            
            // Fallback to auth metadata
            const authRole = user.app_metadata?.role || user.user_metadata?.role;
            if (authRole && ['admin', 'staff', 'mechanic', 'customer'].includes(authRole)) {
              role = authRole;
              console.log('Using role from auth metadata:', role);
              
              if (role) {
                dashboardPath = getDashboardPath(role);
                if (dashboardPath) {
                  // Store user role
                  localStorage.setItem("userRole", role);
                  sessionStorage.setItem("userRole", role);
                  
                  // Set session values
                  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  const userId = user.id || `user_${Date.now()}`;
                  localStorage.setItem("sessionId", sessionId);
                  localStorage.setItem("lastSessionId", sessionId);
                  localStorage.setItem("sessionTimestamp", Date.now().toString());
                  localStorage.setItem("userId", userId);
                  sessionStorage.setItem("sessionId", sessionId);
                  sessionStorage.setItem("userId", userId);
                  
                  toast.success(`Login successful! Welcome ${authRole}!`);
                  navigate(dashboardPath, { replace: true });
                  return;
                }
              }
            }
            
            // No valid role found - redirect to role selection
            localStorage.setItem("tempUserId", user.id || '');
            localStorage.setItem("tempUserEmail", user.email || '');
            
            toast.info('Please select your user role to continue.');
            navigate('/select-role', { replace: true });
            return;
          }
        } catch (err: any) {
          console.error('User info fetch error:', err);
          setError('Could not fetch user information.');
          toast.error('Could not fetch user information.');
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setCaptchaVerified(false);
    }
  };

  const loginWithProvider = async (provider: 'google' | 'github') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard/customer'
      }
    });
    if (!error) {
      localStorage.removeItem("guestSession"); // <-- Ensure guestSession is cleared after OAuth
    }
    if (error) {
      setError(`Login with ${provider} failed. Please try again.`);
      toast.error(`Login with ${provider} failed. Please try again.`);
    }
    setLoading(false);
  };

  const handleGuestLogin = () => {
    localStorage.setItem('role', 'guest');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    navigate('/dashboard/guest', { replace: true });
  };

  return (
    <>
      <audio ref={audioRef} src="/car-start.mp3" preload="none" />
      <div 
        className="min-h-screen w-full relative overflow-hidden flex justify-center items-center"
        style={{
          backgroundImage: "url('/images/bg-landing.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Enhanced Background Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none"></div>
        
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
        <div className="relative z-10 w-full flex justify-center items-center p-4">
          <motion.form
            onSubmit={handleLogin}
            className="glass-panel rounded-2xl shadow-2xl p-8 md:p-10 w-[95%] max-w-md border border-white/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header Section */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                <Car className="w-8 h-8" /> Justice Ultimate Login
              </h2>
              <p className="text-white/80 text-sm">Welcome back! Sign in to your account</p>
            </motion.div>

            {error && (
              <motion.p 
                className="text-sm text-red-400 text-center mb-6 p-3 bg-red-500/10 rounded-xl border border-red-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}

            {/* Email Input */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2 text-white/90 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                placeholder="justice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              className="mb-6 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-2 text-white/90 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white/60 hover:text-white transition-colors duration-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </motion.div>
            
            {/* reCAPTCHA v3 Status Indicator */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-2 p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                {captchaLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-white/80">Verifying reCAPTCHA...</span>
                  </>
                ) : captchaVerified ? (
                  <>
                    <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-green-400">reCAPTCHA verified ✓</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60">reCAPTCHA verification required</span>
                  </>
                )}
              </div>
              <p className="text-xs text-white/50 text-center mt-2">
                This site is protected by reCAPTCHA v3
              </p>
            </motion.div>
            
            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading || captchaLoading}
              className={`w-full py-3 mt-2 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center ${
                loading || captchaLoading 
                  ? 'bg-white/20 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: loading || captchaLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {loading ? 'Logging in...' : captchaLoading ? 'Verifying...' : 'Login'}
            </motion.button>
            
            <ContinueAsGuestButton />

            {/* OAuth Buttons */}
            <motion.div 
              className="mt-6 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.button
                type="button"
                onClick={() => loginWithProvider('google')}
                disabled={loading}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center text-white hover:bg-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGoogle className="mr-2" /> Sign in with Google
              </motion.button>
              <motion.button
                type="button"
                onClick={() => loginWithProvider('github')}
                disabled={loading}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center text-white hover:bg-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGithub className="mr-2" /> Sign in with GitHub
              </motion.button>
            </motion.div>
            
            {/* Links */}
            <motion.div 
              className="flex justify-between text-sm text-white/80 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a href="/reset-password" className="hover:text-yellow-400 transition-colors duration-300">Forgot password?</a>
              <a href="/register" className="hover:text-yellow-400 transition-colors duration-300">Register</a>
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="mt-6 text-xs text-center text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <p>🌐 International login ready | v1.0</p>
            </motion.div>
          </motion.form>
        </div>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default Login;
