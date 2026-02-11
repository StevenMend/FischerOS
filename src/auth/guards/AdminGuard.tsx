// src/auth/guards/AdminGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { ROUTE_PATHS } from '../../config/routes';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true';

export default function AdminGuard() {
  const { isAuthenticated, isRole } = useAuth();

  // Dev bypass - skip ALL auth checks
  if (DEV_BYPASS) {
    console.log('🔓 [DEV] AdminGuard BYPASSED');
    return <Outlet />;
  }

  if (!isAuthenticated || !isRole('admin')) {
    return <Navigate to={ROUTE_PATHS.auth.admin} replace />;
  }

  return <Outlet />;
}
