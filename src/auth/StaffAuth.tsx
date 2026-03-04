import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ROUTE_PATHS } from '../config/routes';

export default function StaffAuth() {
  const { isAuthenticated, isRole } = useAuth();

  if (!isAuthenticated || !isRole('staff')) {
    return <Navigate to={ROUTE_PATHS.auth.staff} replace />;
  }

  return <Outlet />;
}