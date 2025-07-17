// ✅ PrivateRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
  requiredRole?: string;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  
  const authToken = localStorage.getItem("authToken");
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Session validation for single-device login
  const validateSession = async () => {
    try {
      const currentSessionId = localStorage.getItem("sessionId");
      const sessionTimestamp = localStorage.getItem("sessionTimestamp");
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
      
      // Check if session exists and is not expired
      if (!currentSessionId || !sessionTimestamp) {
        return false;
      }
      
      if (Date.now() - parseInt(sessionTimestamp) > sessionTimeout) {
        localStorage.clear();
        sessionStorage.clear();
        return false;
      }
      
      // Check if this is the most recent session for the user
      const lastSessionId = localStorage.getItem("lastSessionId");
      if (lastSessionId && lastSessionId !== currentSessionId) {
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

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check for valid tokens
        const hasValidToken = authToken || token;
        
        if (!hasValidToken) {
          setIsValid(false);
          setSessionValid(false);
          setIsLoading(false);
          return;
        }

        // Validate session
        const isValidSession = await validateSession();
        if (!isValidSession) {
          setIsValid(false);
          setSessionValid(false);
          setIsLoading(false);
          return;
        }

        // Get user role if required
        if (requiredRole) {
          const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
          if (userRole !== requiredRole) {
            setIsValid(false);
            setSessionValid(false);
            setIsLoading(false);
            return;
          }
        }

        // Additional token validation can be added here
        // const response = await validateToken(authToken || token);
        // if (!response.valid) {
        //   localStorage.clear();
        //   sessionStorage.clear();
        //   setIsValid(false);
        //   setSessionValid(false);
        //   setIsLoading(false);
        //   return;
        // }

        setIsValid(true);
        setSessionValid(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.clear();
        sessionStorage.clear();
        setIsValid(false);
        setSessionValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [authToken, token, requiredRole]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isValid || !sessionValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
