import { useUser } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

export default function Require2FA({ children }: { children: React.ReactNode }) {
  const user = useUser();
  if (!user) return <Navigate to="/login" />;
  // Supabase sets aal to 'aal2' if 2FA is enabled and verified
  if (user.aal !== 'aal2') return <Navigate to="/setup-2fa" />;
  return <>{children}</>;
} 