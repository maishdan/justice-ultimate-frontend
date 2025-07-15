import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRef } from 'react';

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
  const playCling = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
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
    console.log('Login form submitted');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    setLoading(true);
    setError('');
    try {
      console.log('Attempting to sign in with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        toast.error(error.message);
      } else if (data.session) {
        playCling();
        console.log('Login successful, session:', data.session);
        // Set tokens for route protection
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("authToken", data.session.access_token);
        localStorage.removeItem("guestSession"); // <-- Ensure guestSession is cleared
        // Fetch user role from Supabase user metadata
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User data:', user);
        console.log('User error:', userError);
        
        if (userError || !user) {
          console.error('Could not fetch user info:', userError);
          setError('Could not fetch user info.');
          toast.error('Could not fetch user info.');
          setLoading(false);
          return;
        }
        let role = user.user_metadata?.role || 'customer';
        let dashboardPath = '/dashboard/customer';
        if (role === 'admin') dashboardPath = '/dashboard/admin';
        else if (role === 'staff') dashboardPath = '/dashboard/staff';
        else if (role === 'mechanic') dashboardPath = '/dashboard/mechanic';
        else if (role === 'guest') dashboardPath = '/dashboard/guest';
        else if (role === 'customer') dashboardPath = '/dashboard/customer';
        else dashboardPath = '/dashboard/customer'; // fallback
        
        console.log('User role:', role);
        console.log('Redirecting to:', dashboardPath);
        
        toast.success('Login successful. Redirecting to dashboard...');
        setTimeout(() => {
          console.log('Navigating to:', dashboardPath);
          navigate(dashboardPath, { replace: true });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Login catch error:', err);
      setError('Login failed');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (provider: 'google' | 'github') => {
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
    if (error) {
      console.error(`${provider} login failed:`, error.message);
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
      <audio ref={audioRef} src="/sounds/iphone-notification.mp3" preload="auto" />
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-8 rounded-xl shadow-2xl w-[95%] max-w-md transition-all duration-300"
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all duration-300 shadow-md flex justify-center items-center"
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
          </button>
          
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
          
          <ContinueAsGuestButton />
          
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
