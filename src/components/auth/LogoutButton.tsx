import React, { useState } from 'react';
import { secureLogout, fastLogout } from '../../lib/authUtils';
import { Button } from '../ui/button';
import { 
  FiLogOut, 
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiClock
} from 'react-icons/fi';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showConfirmation?: boolean;
  clearAllSessions?: boolean;
  className?: string;
  children?: React.ReactNode;
  fastMode?: boolean; // New prop for fast logout
}

export default function LogoutButton({
  variant = 'destructive',
  size = 'md',
  showConfirmation = true,
  clearAllSessions = false,
  className = '',
  children,
  fastMode = false // Default to secure logout
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    if (showConfirmation && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }

    setLoading(true);
    
    if (fastMode) {
      // Use fast logout for immediate response
      fastLogout('/login');
    } else {
      try {
        // Start logout immediately without waiting for completion
        secureLogout({
          clearAllSessions,
          redirectTo: '/login',
          showConfirmation: false
        });
        // Don't wait for the logout to complete - let it happen in background
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleConfirmLogout = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    
    if (fastMode) {
      // Use fast logout for immediate response
      fastLogout('/login');
    } else {
      // Start logout immediately
      try {
        secureLogout({
          clearAllSessions,
          redirectTo: '/login',
          showConfirmation: false
        });
        // Don't wait for completion - redirect happens automatically
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleCancelLogout = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        disabled={loading}
        className={className}
        data-testid="logout-button"
      >
        <FiLogOut className="mr-2" />
        {loading ? 'Logging out...' : children || 'Logout'}
      </Button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">
                {clearAllSessions 
                  ? 'Are you sure you want to logout from all devices? This will end all active sessions.'
                  : 'Are you sure you want to logout? This will end your current session.'
                }
              </p>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FiShield className="text-red-500" />
                  <span>Your session will end</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-orange-500" />
                  <span>You'll need to login again</span>
                </div>
                {clearAllSessions && (
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="text-red-500" />
                    <span>All devices will be logged out</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmLogout}
                  variant="destructive"
                  className="flex-1"
                  disabled={loading}
                >
                  <FiCheckCircle className="mr-2" />
                  {loading ? 'Logging out...' : 'Yes, Logout'}
                </Button>
                <Button
                  onClick={handleCancelLogout}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 