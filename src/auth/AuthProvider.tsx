// src/auth/AuthProvider.tsx - FIXED: Department normalization
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { UserSession, AuthSession, UserRole } from '../types';
import { SITE_CONFIG } from '../config/site';
import { getDefaultRouteForRole, getStaffRouteForDepartment } from '../config/routes';
import { supabase } from '../lib/api/supabase';
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
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (!session) return;
    const tokenExpiresAt = new Date(session.expiresAt).getTime();
    const now = new Date().getTime();
    const timeUntilExpiry = tokenExpiresAt - now;
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
    
    const timeout = setTimeout(() => {
      refreshToken().catch(() => {
        logout();
      });
    }, refreshTime);
    return () => clearTimeout(timeout);
  }, [session, refreshToken]);

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
    navigate(getDefaultRouteForRole('guest'));
  };

  const loginAsStaff = async (staffId: string, department: string, password: string, property: string = SITE_CONFIG.properties[0]) => {
    if (!SITE_CONFIG.departments.includes(department)) {
      throw new Error(`Invalid department: ${department}`);
    }
    
    logger.info('Auth', 'Authenticating staff', { staffId, department });
    await authenticateStaff(staffId, department, password, property);
    
    // Get current session
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !currentSession?.user) {
      logger.error('Auth', 'No session after authentication', sessionError);
      throw new Error('Failed to establish session');
    }

    logger.info('Auth', 'Session established, fetching staff data for user', currentSession.user.id);

    // Fetch staff details including restaurant info
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select(`
        id,
        name,
        email,
        department,
        department_id,
        restaurant_id,
        restaurants (
          id,
          slug,
          name
        )
      `)
      .eq('id', currentSession.user.id)
      .single();

    if (staffError) {
      logger.error('Auth', 'Error fetching staff data', staffError);
      throw new Error('Failed to load staff information');
    }

    if (!staffData) {
      logger.error('Auth', 'No staff data found for user', currentSession.user.id);
      throw new Error('Staff record not found');
    }

    logger.info('Auth', 'Staff data loaded', {
      name: staffData.name,
      department: staffData.department,
      restaurant_id: staffData.restaurant_id,
      restaurant_slug: staffData.restaurants?.slug
    });

    // Route to department-specific dashboard (logic centralized in config/routes.ts)
    const route = getStaffRouteForDepartment(
      staffData.department,
      staffData.restaurants?.slug
    );
    logger.info('Auth', `Redirecting staff to ${route}`);
    navigate(route);
  };

  const loginAsAdmin = async (email: string, password: string, property: string = SITE_CONFIG.properties[0]) => {
    await authenticateAdmin(email, password, property);
    navigate(getDefaultRouteForRole('admin'));
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