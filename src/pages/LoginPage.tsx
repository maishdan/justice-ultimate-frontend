import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // Optional: Install lucide-react
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;

      // ✅ Save both tokens + user
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token); // For PrivateRoute
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful. Redirecting to dashboard...');

      setTimeout(() => {
        const roleRedirectMap: Record<string, string> = {
          admin: '/dashboard/admin',
          manager: '/dashboard/admin',
          sales_staff: '/dashboard/staff',
          agent: '/dashboard/staff',
          mechanic: '/dashboard/mechanic',
          car_owner: '/dashboard/customer',
          customer: '/dashboard/customer',
        };

        navigate(roleRedirectMap[user.role] || '/dashboard/customer');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      toast.error('Login failed. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <label className="block text-sm font-medium mb-1">Email / Phone</label>
          <input
            type="text"
            placeholder="justice@.com or +254..."
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

        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <a href="#" className="hover:underline">Forgot password?</a>
          <a href="/register" className="hover:underline">Register</a>
        </div>

        {/* 🌐 Language + Social login (future use) */}
        <div className="mt-6 text-xs text-center text-gray-400 dark:text-gray-500">
          <p>🌐 International login ready | v1.0</p>
        </div>
      </form>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Login;
