// src/auth/AuthProvider.tsx — Auth context (session, login, logout, permissions)
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { UserSession, AuthSession, UserRole } from '../types';
import { SITE_CONFIG } from '../config/site';
import { usePostLoginRouter } from '../core/auth/usePostLoginRouter';
import { logger } from '../core/utils/logger';

interface AuthContextType {
  session: AuthSession | null;
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAsGuest: (roomNumber?: string, confirmationCode?: string, property?: string) => Promise<void>;
  loginAsStaff: (staffId: string, department: string, password: string, property?: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string, property?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  isRole: (role: UserRole) => boolean;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { routeGuest, routeAdmin, routeStaff } = usePostLoginRouter();

  const {
    session,
    isAuthenticated,
    isLoading,
    error,
    authenticateGuest,
    authenticateStaff,
    authenticateAdmin,
    logout: authLogout,
    getUser,
    hasPermission,
    isRole,
    clearError,
    refreshToken
  } = useAuthStore();

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!session) return;
    const tokenExpiresAt = new Date(session.expiresAt).getTime();
    const refreshTime = Math.max(0, tokenExpiresAt - Date.now() - 5 * 60 * 1000);

    const timeout = setTimeout(() => {
      refreshToken().catch(() => { logout(); });
    }, refreshTime);
    return () => clearTimeout(timeout);
  }, [session, refreshToken]);

  // Session expiry warning
  useEffect(() => {
    if (!session) return;
    const role = session.user.role;
    const sessionTimeout = SITE_CONFIG.sessionTimeouts[role];
    const warningTime = sessionTimeout - 10 * 60 * 1000;

    const timeout = setTimeout(() => {
      logger.warn('Auth', `Session expires in 10 minutes for ${role}`);
    }, warningTime);
    return () => clearTimeout(timeout);
  }, [session]);

  const loginAsGuest = async (roomNumber?: string, confirmationCode?: string, property: string = SITE_CONFIG.properties[0]) => {
    await authenticateGuest(roomNumber, confirmationCode, property);
    routeGuest();
  };

  const loginAsStaff = async (staffId: string, department: string, password: string, property: string = SITE_CONFIG.properties[0]) => {
    if (!SITE_CONFIG.departments.includes(department)) {
      throw new Error(`Invalid department: ${department}`);
    }

    await authenticateStaff(staffId, department, password, property);

    // Staff profile (department + restaurantSlug) is now in the session
    const user = useAuthStore.getState().session?.user;
    routeStaff({
      department: user?.department || department,
      restaurantSlug: user?.restaurantSlug,
    });
  };

  const loginAsAdmin = async (email: string, password: string, property: string = SITE_CONFIG.properties[0]) => {
    await authenticateAdmin(email, password, property);
    routeAdmin();
  };

  const logout = async () => {
    await authLogout();
  };

  const value: AuthContextType = {
    session,
    user: getUser(),
    isAuthenticated,
    isLoading,
    error,
    loginAsGuest,
    loginAsStaff,
    loginAsAdmin,
    logout,
    hasPermission,
    isRole,
    clearError,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
