import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { 
  FiLogOut, 
  FiAlertTriangle,
  FiCheckCircle,
  FiUser,
  FiShield,
  FiClock
} from 'react-icons/fi';

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local storage or session data
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (confirm('Are you sure you want to sign out from all devices? This will end all active sessions.')) {
      setLoading(true);
      try {
        // This would typically call an API to invalidate all sessions
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear all local data
        localStorage.clear();
        sessionStorage.clear();
        
        navigate('/');
      } catch (error) {
        console.error('Error signing out from all devices:', error);
        alert('Error signing out from all devices. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Account Logout</h1>
        <p className="text-gray-600">Safely sign out of your account</p>
      </div>

      {/* Logout Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Current Device Logout */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Sign Out</h2>
              <p className="text-gray-600 mb-4">
                Sign out from this device only. You can sign back in anytime.
              </p>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FiUser className="text-blue-500" />
                  <span>Current session will end</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-green-500" />
                  <span>Other devices remain active</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-orange-500" />
                  <span>Quick sign-in available</span>
                </div>
              </div>

              <Button 
                onClick={() => setShowConfirm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                <FiLogOut className="mr-2" />
                {loading ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Devices Logout */}
        <Card className="hover:shadow-lg transition-shadow border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Sign Out All Devices</h2>
              <p className="text-gray-600 mb-4">
                Sign out from all devices and end all active sessions.
              </p>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FiUser className="text-red-500" />
                  <span>All sessions will end</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-red-500" />
                  <span>Maximum security</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-red-500" />
                  <span>Requires re-authentication</span>
                </div>
              </div>

              <Button 
                onClick={handleLogoutAllDevices}
                variant="destructive"
                className="w-full"
                disabled={loading}
              >
                <FiAlertTriangle className="mr-2" />
                {loading ? 'Signing Out...' : 'Sign Out All Devices'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLogOut className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Confirm Sign Out</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to sign out from this device?
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleLogout}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    <FiCheckCircle className="mr-2" />
                    {loading ? 'Signing Out...' : 'Yes, Sign Out'}
                  </Button>
                  <Button
                    onClick={() => setShowConfirm(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Information */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Session Info</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Device:</span>
                <span className="font-medium">Chrome on Windows</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">Nairobi, Kenya</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-medium">192.168.1.100</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Login Time:</span>
                <span className="font-medium">Today, 10:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Duration:</span>
                <span className="font-medium">2 hours 15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Sessions:</span>
                <span className="font-medium">3 devices</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Reminder */}
      <Card className="max-w-4xl mx-auto bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <FiShield className="text-yellow-600 text-xl mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Security Reminder</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Always sign out when using shared or public computers</li>
                <li>• Keep your login credentials secure and never share them</li>
                <li>• Enable two-factor authentication for additional security</li>
                <li>• Regularly review your active sessions and revoke unknown ones</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}