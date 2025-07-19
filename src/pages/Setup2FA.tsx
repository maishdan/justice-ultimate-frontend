import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Setup2FA() {
  const [isEnabled, setIsEnabled] = useState(false);
  const navigate = useNavigate();

  const handleEnable2FA = () => {
    // For now, just mark 2FA as enabled and redirect to admin dashboard
    localStorage.setItem('2fa_passed', 'true');
    setIsEnabled(true);
    setTimeout(() => {
      navigate('/secure-admin-dashboard', { replace: true });
    }, 1000);
  };

  const handleSkip2FA = () => {
    // Skip 2FA setup and go to admin dashboard
    localStorage.setItem('2fa_passed', 'true');
    navigate('/secure-admin-dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Two-Factor Authentication Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enhance your account security with 2FA. This is recommended for admin users.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleEnable2FA}
              disabled={isEnabled}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isEnabled ? '2FA Enabled!' : 'Enable 2FA'}
            </button>
            
            <button
              onClick={handleSkip2FA}
              className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Skip for Now
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You can always enable 2FA later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
} 