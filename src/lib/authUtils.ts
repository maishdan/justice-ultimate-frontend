import { supabase } from './supabaseClient';

export interface LogoutOptions {
  clearAllSessions?: boolean;
  redirectTo?: string;
  showConfirmation?: boolean;
}

/**
 * Comprehensive logout function that handles all cleanup tasks
 */
export const secureLogout = async (options: LogoutOptions = {}) => {
  const {
    clearAllSessions = false,
    redirectTo = '/login',
    showConfirmation = false
  } = options;

  try {
    // Get current user before logout (non-blocking)
    const userPromise = supabase.auth.getUser();
    
    // Start logout process immediately
    const signOutPromise = supabase.auth.signOut();
    
    // Clear all local storage immediately
    const keysToPreserve = ['language', 'theme']; // Preserve user preferences
    const preservedData: Record<string, string> = {};
    
    keysToPreserve.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) preservedData[key] = value;
    });

    localStorage.clear();
    sessionStorage.clear();

    // Restore preserved data
    Object.entries(preservedData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Clear cookies immediately
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Wait for auth operations to complete
    const [userResult, signOutResult] = await Promise.all([userPromise, signOutPromise]);
    
    // Log the logout event in background (non-blocking)
    if (userResult.data?.user?.id) {
      logLogoutEvent(userResult.data.user.id, userResult.data.user.email, clearAllSessions).catch(() => {});
    }

    // If clearAllSessions is true, invalidate all sessions in background
    if (clearAllSessions && userResult.data?.user?.id) {
      invalidateAllUserSessions(userResult.data.user.id).catch(() => {});
    }

    // Redirect immediately after 100ms to ensure cleanup is complete
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 100);

  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, clear local data and redirect immediately
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = redirectTo;
  }
};

/**
 * Fast logout function for immediate logout without delays
 */
export const fastLogout = (redirectTo: string = '/login') => {
  // Clear all data immediately
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear cookies immediately
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Start Supabase logout in background (don't wait)
  supabase.auth.signOut().catch(() => {});
  
  // Redirect immediately
  window.location.href = redirectTo;
};

/**
 * Log logout event for security tracking
 */
const logLogoutEvent = async (userId: string, userEmail: string | undefined, clearAllSessions: boolean) => {
  try {
    await supabase.from('security_events').insert({
      user_id: userId,
      user_email: userEmail,
      event_type: 'logout',
      event_details: {
        clearAllSessions,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ipAddress: await getClientIP()
      },
      severity: 'low'
    });
  } catch (error) {
    console.log('Failed to log logout event:', error);
  }
};

/**
 * Invalidate all sessions for a specific user
 */
const invalidateAllUserSessions = async (userId: string) => {
  try {
    // Delete all sessions for this user from the database
    await supabase.from('user_sessions').delete().eq('user_id', userId);
    
    // Also clear any cached session data
    const sessionKeys = Object.keys(localStorage).filter(key => 
      key.includes('session') || key.includes('auth')
    );
    sessionKeys.forEach(key => localStorage.removeItem(key));
    
  } catch (error) {
    console.log('Failed to invalidate all sessions:', error);
  }
};

/**
 * Get client IP address (if available)
 */
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

/**
 * Check if user is currently logged in
 */
export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('supabase.auth.token');
  
  return Boolean(token);
};

/**
 * Get current user session info
 */
export const getCurrentUserSession = () => {
  const sessionData = localStorage.getItem('supabase.auth.token');
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Force logout with immediate redirect (for security purposes)
 */
export const forceLogout = () => {
  // Clear everything immediately
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Redirect immediately
  window.location.href = '/login';
}; 