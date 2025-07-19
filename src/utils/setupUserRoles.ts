import { supabase } from '../lib/supabaseClient';
import { setUserRole } from '../lib/userRoleUtils';

/**
 * Utility to set up different user roles for testing
 * This helps ensure each user type gets redirected to their correct dashboard
 */

export const setupUserRoles = async () => {
  console.log('Setting up user roles for testing...');
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found');
      return false;
    }
    
    console.log('Current user:', user.email);
    
    // Set role based on email pattern or specific emails
    let role = 'customer'; // default
    
    if (user.email === 'daniwesttechnologies@gmail.com') {
      role = 'admin';
    } else if (user.email?.includes('staff') || user.email?.includes('employee')) {
      role = 'staff';
    } else if (user.email?.includes('mechanic') || user.email?.includes('service')) {
      role = 'mechanic';
    } else if (user.email?.includes('admin')) {
      role = 'admin';
    } else {
      role = 'customer';
    }
    
    console.log(`Setting role to: ${role}`);
    
    // Update user role
    const success = await setUserRole(user.id, user.email || '', role);
    
    if (success) {
      console.log(`Successfully set role to ${role} for ${user.email}`);
      
      // Update local storage
      localStorage.setItem("userRole", role);
      sessionStorage.setItem("userRole", role);
      
      return true;
    } else {
      console.error('Failed to set user role');
      return false;
    }
    
  } catch (error) {
    console.error('Error setting up user roles:', error);
    return false;
  }
};

/**
 * Get current user role
 */
export const getCurrentUserRole = (): string => {
  return localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || 'customer';
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole: string): boolean => {
  const currentRole = getCurrentUserRole();
  return currentRole === requiredRole;
};

/**
 * Get dashboard path for current user
 */
export const getCurrentDashboardPath = (): string => {
  const role = getCurrentUserRole();
  
  switch (role) {
    case 'admin':
      return '/secure-admin-dashboard';
    case 'staff':
      return '/secure-staff-dashboard';
    case 'mechanic':
      return '/secure-mechanic-dashboard';
    case 'customer':
    default:
      return '/secure-customer-dashboard';
  }
};

/**
 * Redirect user to their appropriate dashboard
 */
export const redirectToAppropriateDashboard = () => {
  const dashboardPath = getCurrentDashboardPath();
  window.location.href = dashboardPath;
};

/**
 * Clear all session data
 */
export const clearSessionData = () => {
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear specific auth items
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("sessionId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("lastSessionId");
  localStorage.removeItem("sessionTimestamp");
  
  sessionStorage.removeItem("userRole");
  sessionStorage.removeItem("sessionId");
  sessionStorage.removeItem("userId");
};

/**
 * Test function to verify role separation
 */
export const testRoleSeparation = async () => {
  console.log('=== Testing Role Separation ===');
  
  const currentRole = getCurrentUserRole();
  const dashboardPath = getCurrentDashboardPath();
  
  console.log('Current role:', currentRole);
  console.log('Dashboard path:', dashboardPath);
  console.log('Current URL:', window.location.pathname);
  
  // Check if user is on the correct dashboard
  const isOnCorrectDashboard = window.location.pathname === dashboardPath;
  
  console.log('On correct dashboard:', isOnCorrectDashboard);
  
  if (!isOnCorrectDashboard) {
    console.log('Redirecting to correct dashboard...');
    redirectToAppropriateDashboard();
  }
  
  return {
    currentRole,
    dashboardPath,
    isOnCorrectDashboard
  };
}; 