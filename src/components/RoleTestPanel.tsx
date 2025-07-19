import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getUserRole, getDashboardPath } from '../lib/userRoleUtils';
import { testRoleSeparation, getCurrentUserRole, getCurrentDashboardPath } from '../utils/setupUserRoles';

export default function RoleTestPanel() {
  const [currentRole, setCurrentRole] = useState<string>('');
  const [currentDashboard, setCurrentDashboard] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserInfo(user);
        
        // Get current role from storage
        const role = getCurrentUserRole();
        setCurrentRole(role);
        
        // Get current dashboard path
        const dashboard = getCurrentDashboardPath();
        setCurrentDashboard(dashboard);
        
        // Also try to get role from database
        try {
          const dbRole = await getUserRole(user.id);
          console.log('Role from database:', dbRole);
          console.log('Role from storage:', role);
        } catch (error) {
          console.error('Error fetching role from database:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const runRoleTest = async () => {
    setLoading(true);
    try {
      const results = await testRoleSeparation();
      setTestResults(results);
    } catch (error) {
      console.error('Error running role test:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (newRole: string) => {
    setLoading(true);
    try {
      if (!userInfo) return;
      
      // Update role in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userInfo.id,
          email: userInfo.email,
          role: newRole,
          status: 'active',
          created_at: userInfo.created_at,
          full_name: userInfo.user_metadata?.full_name || '',
          first_name: userInfo.user_metadata?.first_name || '',
          last_name: userInfo.user_metadata?.last_name || '',
          avatar_url: userInfo.user_metadata?.avatar_url || '',
          verified: true
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating role:', error);
        return;
      }

      // Update local storage
      localStorage.setItem("userRole", newRole);
      sessionStorage.setItem("userRole", newRole);
      
      // Reload user info
      await loadUserInfo();
      
      // Redirect to appropriate dashboard
      const dashboardPath = getDashboardPath(newRole);
      window.location.href = dashboardPath;
      
    } catch (error) {
      console.error('Error switching role:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Role Test Panel
      </h2>
      
      <div className="space-y-4">
        {/* User Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-2">User Information</h3>
          <p><strong>Email:</strong> {userInfo?.email}</p>
          <p><strong>Current Role:</strong> {currentRole}</p>
          <p><strong>Current Dashboard:</strong> {currentDashboard}</p>
          <p><strong>Current URL:</strong> {window.location.pathname}</p>
        </div>

        {/* Role Test Results */}
        {testResults && (
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Test Results</h3>
            <p><strong>Role:</strong> {testResults.currentRole}</p>
            <p><strong>Expected Dashboard:</strong> {testResults.dashboardPath}</p>
            <p><strong>On Correct Dashboard:</strong> {testResults.isOnCorrectDashboard ? '✅ Yes' : '❌ No'}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={runRoleTest}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Test...' : 'Run Role Separation Test'}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => switchRole('admin')}
              disabled={loading}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Switch to Admin
            </button>
            <button
              onClick={() => switchRole('staff')}
              disabled={loading}
              className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Switch to Staff
            </button>
            <button
              onClick={() => switchRole('mechanic')}
              disabled={loading}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Switch to Mechanic
            </button>
            <button
              onClick={() => switchRole('customer')}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Switch to Customer
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Run the role separation test to verify current setup</li>
            <li>Use the role switch buttons to test different user types</li>
            <li>Each role should redirect to its specific dashboard</li>
            <li>Admin: /secure-admin-dashboard</li>
            <li>Staff: /secure-staff-dashboard</li>
            <li>Mechanic: /secure-mechanic-dashboard</li>
            <li>Customer: /secure-customer-dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 