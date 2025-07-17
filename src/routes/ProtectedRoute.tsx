// ✅ ProtectedRoute.tsx
import React, { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRole, allowedRoles }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sessionValid, setSessionValid] = useState(false);
  
  const token = localStorage.getItem("token");
  const authToken = localStorage.getItem("authToken");
  const guestSession = localStorage.getItem("guestSession");
  const location = useLocation();

  // Session management for single-device login
  const checkSessionValidity = async () => {
    try {
      const currentSessionId = localStorage.getItem("sessionId");
      const userId = localStorage.getItem("userId");
      
      if (!currentSessionId || !userId) {
        return false;
      }

      // Check if this session is still valid on the server
      // This would typically involve an API call to verify the session
      // For now, we'll use a simple timestamp-based approach
      const sessionTimestamp = localStorage.getItem("sessionTimestamp");
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionTimestamp && Date.now() - parseInt(sessionTimestamp) > sessionTimeout) {
        // Session expired
        localStorage.clear();
        sessionStorage.clear();
        return false;
      }

      // Check if there's a newer session for this user
      const lastSessionId = localStorage.getItem("lastSessionId");
      if (lastSessionId && lastSessionId !== currentSessionId) {
        // Another device has logged in, invalidate this session
        localStorage.clear();
        sessionStorage.clear();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Session validation error:", error);
      return false;
    }
  };

  const createNewSession = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = localStorage.getItem("userId") || `user_${Date.now()}`;
    
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("lastSessionId", sessionId);
    localStorage.setItem("sessionTimestamp", Date.now().toString());
    localStorage.setItem("userId", userId);
    
    // Store session info in sessionStorage for cross-tab validation
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("userId", userId);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for valid tokens
        const hasValidToken = token || authToken;
        
        if (!hasValidToken) {
          setIsAuthenticated(false);
          setSessionValid(false);
          setIsLoading(false);
          return;
        }

        // Check session validity
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

        // Get user role from localStorage or session
        const storedRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
        setUserRole(storedRole);
        setIsAuthenticated(true);
        setSessionValid(true);
        
        // Validate token if needed (you can add API call here)
        // const response = await validateToken(token);
        // if (!response.valid) {
        //   localStorage.clear();
        //   sessionStorage.clear();
        //   setIsAuthenticated(false);
        //   setSessionValid(false);
        // }
        
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
        setSessionValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, authToken]);

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

  return <>{children}</>;
};

export default ProtectedRoute;
