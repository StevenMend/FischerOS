
// src/components/shared/ProtectedRoute.tsx - Route Guard Component
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  isAllowed: boolean;
  redirectTo: string;
  requiredPermissions?: Array<{
    resource: string;
    action: string;
  }>;
}

export default function ProtectedRoute({ 
  children, 
  isAllowed, 
  redirectTo,
  requiredPermissions = [] 
}: ProtectedRouteProps) {
  const { isLoading, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Check basic authentication
  if (!isAllowed) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check specific permissions if required
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(
      ({ resource, action }) => hasPermission(resource, action)
    );

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
