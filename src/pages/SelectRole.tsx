import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { createUserProfile, getDashboardPath } from '../lib/userRoleUtils';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SelectRole = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('tempUserEmail');
    const id = localStorage.getItem('tempUserId');
    
    if (!email || !id) {
      toast.error('User information not found. Please login again.');
      navigate('/login', { replace: true });
      return;
    }
    
    setUserEmail(email);
    setUserId(id);
  }, [navigate]);

  const handleRoleSelection = async (role: string) => {
    setSelectedRole(role);
  };

  const handleConfirmRole = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue.');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('User session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }

      // Create user profile with selected role
      const profileCreated = await createUserProfile(user, selectedRole);
      
      if (!profileCreated) {
        toast.error('Failed to create user profile. Please try again.');
        setLoading(false);
        return;
      }

      // Get dashboard path for selected role
      const dashboardPath = getDashboardPath(selectedRole);
      
      if (!dashboardPath) {
        toast.error('Invalid role configuration.');
        setLoading(false);
        return;
      }

      // Store user role
      localStorage.setItem("userRole", selectedRole);
      sessionStorage.setItem("userRole", selectedRole);
      
      // Set session values
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("lastSessionId", sessionId);
      localStorage.setItem("sessionTimestamp", Date.now().toString());
      localStorage.setItem("userId", user.id);
      sessionStorage.setItem("sessionId", sessionId);
      sessionStorage.setItem("userId", user.id);
      
      // Clear temporary user data
      localStorage.removeItem("tempUserId");
      localStorage.removeItem("tempUserEmail");
      
      toast.success(`Role set successfully! Welcome ${selectedRole}!`);
      navigate(dashboardPath, { replace: true });
      
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const roles = [
    {
      key: 'admin',
      name: 'Administrator',
      description: 'Full system access and management',
      icon: '👑',
      color: 'from-red-600 to-red-800',
      features: ['User Management', 'System Settings', 'Analytics', 'All Features']
    },
    {
      key: 'staff',
      name: 'Staff Member',
      description: 'Staff management and operations',
      icon: '👨‍💼',
      color: 'from-blue-600 to-blue-800',
      features: ['Staff Management', 'Customer Service', 'Reports', 'Limited Admin']
    },
    {
      key: 'mechanic',
      name: 'Mechanic',
      description: 'Service and maintenance operations',
      icon: '🔧',
      color: 'from-green-600 to-green-800',
      features: ['Service Management', 'Vehicle Maintenance', 'Work Orders', 'Service Reports']
    },
    {
      key: 'customer',
      name: 'Customer',
      description: 'Customer portal and services',
      icon: '👤',
      color: 'from-purple-600 to-purple-800',
      features: ['Vehicle Booking', 'Service History', 'Payments', 'Customer Support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Select Your Role
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Welcome, <span className="font-semibold text-blue-600 dark:text-blue-400">{userEmail}</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Please select your role to access the appropriate dashboard
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => (
            <motion.div
              key={role.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                selectedRole === role.key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleRoleSelection(role.key)}
            >
              {/* Selection Indicator */}
              {selectedRole === role.key && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Role Icon and Name */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center text-2xl mr-4`}>
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role.description}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Access to:
                </h4>
                <ul className="space-y-1">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleConfirmRole}
            disabled={!selectedRole || loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Setting Role...' : 'Confirm Role'}
          </button>
          
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Security Notice
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Please select the role that matches your actual position. Incorrect role selection may result in restricted access or account suspension.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectRole; 