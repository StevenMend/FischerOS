// src/auth/guards/AdminGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { ROUTE_PATHS } from '../../config/routes';
import { logger } from '../../core/utils/logger';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true';

export default function AdminGuard() {
  const { isAuthenticated, isRole } = useAuth();

  // Dev bypass - skip ALL auth checks
  if (DEV_BYPASS) {
    logger.info('Auth', 'AdminGuard BYPASSED (dev mode)');
    return <Outlet />;
  }

  if (!isAuthenticated || !isRole('admin')) {
    return <Navigate to={ROUTE_PATHS.auth.admin} replace />;
  }

  return <Outlet />;
}
