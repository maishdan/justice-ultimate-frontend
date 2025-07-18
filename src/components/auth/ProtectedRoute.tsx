import { useUser } from '@supabase/auth-helpers-react';
import type { User } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';
import Require2FA from './Require2FA';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  require2FA?: boolean;
}

export default function ProtectedRoute({ children, requiredRole, require2FA }: ProtectedRouteProps) {
  const user = useUser() as User & { aal?: string };
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.app_metadata?.role !== requiredRole) return <Navigate to="/unauthorized" replace />;
  if (require2FA && user.aal !== 'aal2') return <Navigate to="/setup-2fa" replace />;
  return <>{children}</>;
} 