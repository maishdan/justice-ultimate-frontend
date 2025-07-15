// ✅ ProtectedRoute.tsx
import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  const guestSession = localStorage.getItem("guestSession");
  const location = useLocation();

  if (guestSession === "true" && !token) {
    if (location.pathname.startsWith("/dashboard/guest")) {
      return <>{children}</>;
    }
    return <Navigate to="/dashboard/guest" replace />;
  }

  if (token) {
    if (location.pathname.startsWith("/dashboard/guest")) {
      return <Navigate to="/dashboard/customer" replace />;
    }
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
