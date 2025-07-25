import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getUserRole, getDashboardPath } from '../lib/userRoleUtils';
import { Eye, EyeOff, Mail, Lock, Car } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useEffect } from 'react';
import { testBackendConnection } from '../lib/api';
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
  
  // Test backend connection on component mount
  useEffect(() => {
    console.log('🔍 Testing backend connectivity for login...');
    
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
    
  }, []);
  
  const playCling = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.warn('Audio play failed:', error);
        });
      }
    } catch (error) {
      console.warn('Audio play error:', error);
    }
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let timeoutId: NodeJS.Timeout | null = null;
    let timedOut = false;
    timeoutId = setTimeout(() => {
      setError('Login is taking longer than expected. Please check your connection or try again.');
      setLoading(false);
      timedOut = true;
    }, 30000);
    try {
      // Clear any stale session data first
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("sessionId");

      // First, try admin email shortcut (no network call)
      if (email === 'daniwesttechnologies@gmail.com' || email === 'justicevincentt@gmail.com') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          toast.error(error.message);
          setLoading(false);
          return;
        }
        if (data.session) {
          playCling();
          localStorage.setItem("token", data.session.access_token);
          localStorage.setItem("authToken", data.session.access_token);
          localStorage.removeItem("guestSession");
          localStorage.setItem("userRole", "admin");
          sessionStorage.setItem("userRole", "admin");
          setLoading(false);
          setError("");
          navigate('/secure-admin-dashboard', { replace: true });
          return;
        }
      }

      // Otherwise, do login and fetch user info/role in parallel
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        toast.error(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        playCling();
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("authToken", data.session.access_token);
        localStorage.removeItem("guestSession");
        // Fetch user info and role in parallel
        const userPromise = supabase.auth.getUser();
        let user, userError;
        try {
          const userRes: any = await Promise.race([
            userPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('User fetch timeout')), 30000))
          ]);
          user = userRes.data.user;
          userError = userRes.error;
        } catch (err) {
          setError('Could not fetch user info.');
          toast.error('Could not fetch user info.');
          setLoading(false);
          return;
        }
        if (userError || !user) {
          setError('Could not fetch user info.');
          toast.error('Could not fetch user info.');
          setLoading(false);
          return;
        }
        // Fetch user role (with timeout)
        let role: string | null = null;
        try {
          role = await Promise.race< string | null >([
            getUserRole(user.id),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Role fetch timeout')), 30000))
          ]);
        } catch (roleError) {
          setError('Could not determine user role.');
          toast.error('Could not determine user role.');
          setLoading(false);
          return;
        }
        if (role) {
          localStorage.setItem("userRole", role);
          sessionStorage.setItem("userRole", role);
          let dashboardPath = '/dashboard/guest';
          switch (role.toLowerCase()) {
            case 'admin':
              dashboardPath = '/dashboard/admin';
              break;
            case 'staff':
              dashboardPath = '/dashboard/staff';
              break;
            case 'mechanic':
              dashboardPath = '/dashboard/mechanic';
              break;
            case 'customer':
              dashboardPath = '/dashboard/customer';
              break;
          }
          setLoading(false);
          setError("");
          navigate(dashboardPath, { replace: true });
          return;
        }
        // Fallback to role selection
        if (user && user.email) {
          setLoading(false);
          setError("");
          navigate('/select-role', { replace: true });
          return;
        }
      } else {
        setError('Login failed. No session created.');
        toast.error('Login failed. No session created.');
        setLoading(false);
      }
    } catch (loginError) {
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
      setLoading(false);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
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
            
            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg flex justify-center items-center ${
                loading 
                  ? 'bg-white/20 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
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
              {loading ? 'Logging in...' : 'Login'}
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
