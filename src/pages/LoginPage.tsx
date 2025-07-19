import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getUserRole, getDashboardPath, createUserProfile } from '../lib/userRoleUtils';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import { API_ENDPOINTS, testBackendConnection } from '../lib/api';

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
    console.log('Current backend URL:', API_ENDPOINTS.verifyRecaptcha);
    testBackendConnection().then(result => {
      if (result.success) {
        console.log('✅ Backend connection successful');
      } else {
        console.error('❌ Backend connection failed:', result.error);
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
              localStorage.setItem("tempUserId", user.id);
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
              // No valid role found - redirect to role selection
              localStorage.setItem("tempUserId", user.id);
              localStorage.setItem("tempUserEmail", user.email || '');
              
              toast.info('Please select your user role to continue.');
              navigate('/select-role', { replace: true });
              return;
            }
          }
          
        } catch (userErr) {
          console.error('User info fetch failed:', userErr);
          
          // Final fallback - use session user data
          const sessionUser = data.session.user;
          const authRole = sessionUser.app_metadata?.role || sessionUser.user_metadata?.role;
          
          if (authRole && ['admin', 'staff', 'mechanic', 'customer'].includes(authRole)) {
            const dashboardPath = getDashboardPath(authRole);
            
            if (dashboardPath) {
              localStorage.setItem("userRole", authRole);
              sessionStorage.setItem("userRole", authRole);
              
              const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const userId = sessionUser.id || `user_${Date.now()}`;
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
          
          // No valid role found - redirect to role selection
          localStorage.setItem("tempUserId", sessionUser.id);
          localStorage.setItem("tempUserEmail", sessionUser.email || '');
          
          toast.info('Please select your user role to continue.');
          navigate('/select-role', { replace: true });
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
      <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6 md:p-8 rounded-xl shadow-2xl w-[95%] max-w-md transition-all duration-300"
          style={{
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-green-300 mb-6 tracking-tight">
            Justice Ultimate Login
          </h2>
          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="justice@.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:border-gray-600"
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          
          {/* reCAPTCHA v3 Status Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              {captchaLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Verifying reCAPTCHA...</span>
                </>
              ) : captchaVerified ? (
                <>
                  <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400">reCAPTCHA verified ✓</span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">reCAPTCHA verification required</span>
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
            className={`w-full py-2 mt-2 text-white rounded-lg font-semibold transition-all duration-300 shadow-md flex justify-center items-center ${
              loading || captchaLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
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
          </button>
          
          <ContinueAsGuestButton />
          {/* OAuth Buttons */}
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => loginWithProvider('google')}
              disabled={loading}
              className="w-full py-2 bg-white border border-gray-300 rounded-lg font-semibold transition-all duration-300 shadow-md flex justify-center items-center text-gray-700 hover:bg-gray-50"
            >
              <FaGoogle className="mr-2" /> Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => loginWithProvider('github')}
              disabled={loading}
              className="w-full py-2 bg-black text-white rounded-lg font-semibold transition-all duration-300 shadow-md flex justify-center items-center hover:bg-gray-800"
            >
              <FaGithub className="mr-2" /> Sign in with GitHub
            </button>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <a href="/reset-password" className="hover:underline">Forgot password?</a>
            <a href="/register" className="hover:underline">Register</a>
          </div>
          <div className="mt-6 text-xs text-center text-gray-400 dark:text-gray-500">
            <p>🌐 International login ready | v1.0</p>
          </div>
        </form>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default Login;
