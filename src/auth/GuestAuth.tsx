import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ROUTE_PATHS } from '../config/routes';

export default function GuestAuth() {
  const { isAuthenticated, isRole } = useAuth();

  if (!isAuthenticated || !isRole('guest')) {
    return <Navigate to={ROUTE_PATHS.auth.guest} replace />;
  }

  return <Outlet />;
}