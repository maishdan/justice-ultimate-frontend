// ✅ ProtectedRoute.tsx
import React, { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { getUserRole } from '../lib/userRoleUtils';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const ProtectedRoute = ({ children, requiredRole, allowedRoles }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sessionValid, setSessionValid] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  
  const token = localStorage.getItem("token");
  const authToken = localStorage.getItem("authToken");
  const guestSession = localStorage.getItem("guestSession");
  const location = useLocation();

  // Enhanced session management
  const createNewSession = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = localStorage.getItem("userId") || `user_${Date.now()}`;
    
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("lastSessionId", sessionId);
    localStorage.setItem("sessionTimestamp", Date.now().toString());
    localStorage.setItem("userId", userId);
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("userId", userId);
  };

  const checkSessionValidity = async () => {
    try {
      // Quick token validation without database queries
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) return false;
      
      // Check if token is recent (within last 24 hours)
      const sessionTimestamp = localStorage.getItem("sessionTimestamp");
      if (sessionTimestamp) {
        const sessionAge = Date.now() - parseInt(sessionTimestamp);
        if (sessionAge > 24 * 60 * 60 * 1000) { // 24 hours
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Quick token check
        const hasValidToken = token || authToken;
        
        if (!hasValidToken) {
          setIsAuthenticated(false);
          setSessionValid(false);
          setIsLoading(false);
          return;
        }

        // Quick session validation
        const isValidSession = await checkSessionValidity();
        
        if (!isValidSession) {
          setIsAuthenticated(false);
          setSessionValid(false);
          setIsLoading(false);
          return;
        }

        // Create new session if needed
        if (!localStorage.getItem("sessionId")) {
          createNewSession();
        }

        // Get user role from localStorage first
        const storedRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
        
        if (storedRole) {
          setUserRole(storedRole);
          setIsAuthenticated(true);
          setSessionValid(true);
          
          // 2FA enforcement for admin
          if ((requiredRole === 'admin' || storedRole === 'admin') && !localStorage.getItem('2fa_passed')) {
            setRequire2FA(true);
            setIsLoading(false);
            return;
          }
          
          setIsLoading(false);
          return;
        }

        // If no stored role, try to get from database
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const dbRole = await getUserRole(user.id);
            
            if (dbRole) {
              // Role found, store it
              localStorage.setItem("userRole", dbRole);
              sessionStorage.setItem("userRole", dbRole);
              setUserRole(dbRole);
              setIsAuthenticated(true);
              setSessionValid(true);
              
              // 2FA enforcement for admin
              if ((requiredRole === 'admin' || dbRole === 'admin') && !localStorage.getItem('2fa_passed')) {
                setRequire2FA(true);
                setIsLoading(false);
                return;
              }
              
              setIsLoading(false);
              return;
            } else {
              // No role found, user needs to select role
              setNeedsRoleSelection(true);
              setIsAuthenticated(true); // User is authenticated but needs role
              setSessionValid(true);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // If we can't determine role, user needs to select
          setNeedsRoleSelection(true);
          setIsAuthenticated(true);
          setSessionValid(true);
          setIsLoading(false);
          return;
        }

        // Fallback - no role found
        setNeedsRoleSelection(true);
        setIsAuthenticated(true);
        setSessionValid(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setSessionValid(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, authToken, requiredRole]);

  // Listen for storage changes (other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lastSessionId" && e.newValue !== localStorage.getItem("sessionId")) {
        // Another tab/window has created a new session
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle guest sessions
  if (guestSession === "true" && !token && !authToken) {
    if (location.pathname.startsWith("/dashboard/guest")) {
      return <>{children}</>;
    }
    return <Navigate to="/dashboard/guest" replace />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated || !sessionValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user needs role selection
  if (needsRoleSelection) {
    return <Navigate to="/select-role" replace />;
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  // Redirect authenticated users away from guest dashboard
  if (isAuthenticated && location.pathname.startsWith("/dashboard/guest")) {
    return <Navigate to="/dashboard/customer" replace />;
  }

  if (require2FA) {
    return <Navigate to="/setup-2fa" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
