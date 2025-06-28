<<<<<<< HEAD
// ✅ ProtectedRoute.tsx (same as your current working one)
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
=======
// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // your custom hook

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth(); // this should return auth state

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
