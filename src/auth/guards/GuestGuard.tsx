// src/auth/guards/GuestGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { ROUTE_PATHS } from '../../config/routes';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true';

export default function GuestGuard() {
  const { isAuthenticated, isRole } = useAuth();

  // Dev bypass - skip ALL auth checks
  if (DEV_BYPASS) {
    console.log('🔓 [DEV] GuestGuard BYPASSED');
    return <Outlet />;
  }

  if (!isAuthenticated || !isRole('guest')) {
    return <Navigate to={ROUTE_PATHS.auth.guest} replace />;
  }

  return <Outlet />;
}
