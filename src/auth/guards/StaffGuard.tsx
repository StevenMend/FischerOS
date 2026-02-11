// src/auth/guards/StaffGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { ROUTE_PATHS } from '../../config/routes';
import { logger } from '../../core/utils/logger';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true';

export default function StaffGuard() {
  const { isAuthenticated, isRole } = useAuth();

  // Dev bypass - skip ALL auth checks and loading
  if (DEV_BYPASS) {
    logger.info('Auth', 'StaffGuard BYPASSED (dev mode)');
    return <Outlet />;
  }

  if (!isAuthenticated || !isRole('staff')) {
    return <Navigate to={ROUTE_PATHS.auth.staff} replace />;
  }

  return <Outlet />;
}
