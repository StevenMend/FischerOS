// src/lib/stores/useAuthStore.ts - Authentication State Management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthSession, UserSession, UserRole } from '../../types';
import { supabase, signOut } from '../api/supabase';
import { logger } from '../../core/utils/logger';

interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  authenticateGuest: (roomNumber?: string, confirmationCode?: string, property?: string) => Promise<void>;
  authenticateStaff: (staffId: string, department: string, password: string, property?: string) => Promise<void>;
  authenticateAdmin: (email: string, password: string, property?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  
  getUser: () => UserSession | null;
  hasPermission: (resource: string, action: string) => boolean;
  isRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Guest Authentication - FIXED: usar signInWithPassword
      authenticateGuest: async (roomNumber = '', confirmationCode = '', property = 'Default Property') => {
        set({ isLoading: true, error: null });
        
        try {
          // Password-based authentication for guests
          const { data, error } = await supabase.auth.signInWithPassword({
            email: `guest-${roomNumber}@hotel.local`,
            password: confirmationCode
          });

          if (error) throw error;

          // Create session from Supabase auth
          const session: AuthSession = {
            user: {
              id: data.user?.id || '',
              name: `Guest - Room ${roomNumber}`,
              role: 'guest',
              room: roomNumber,
              property: property,
            },
            token: data.session?.access_token || '',
            expiresAt: data.session?.expires_at 
              ? new Date(data.session.expires_at * 1000).toISOString()
              : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            permissions: [
              { resource: 'restaurants', actions: ['read', 'write'], scope: 'own' },
              { resource: 'tours', actions: ['read', 'write'], scope: 'own' },
              { resource: 'bookings', actions: ['read', 'write'], scope: 'own' }
            ]
          };
          
          set({ session, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Authentication failed',
            isLoading: false 
          });
          throw error;
        }
      },


      authenticateStaff: async (staffId, department, password, property = 'Default Property') => {
  set({ isLoading: true, error: null });
  
  try {
    logger.debug('Auth', 'Attempting staff login', { staffId, department });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: staffId,
      password: password,
    });

    if (error) {
      logger.error('Auth', 'Staff login failed', { message: error.message, status: error.status });
      throw error;
    }

    logger.debug('Auth', 'Staff login successful');

    const session: AuthSession = {
      user: {
        id: data.user?.id || '',
        name: data.user?.user_metadata?.name || staffId,
        role: 'staff',
        department: department,
        property: property,
      },
      token: data.session?.access_token || '',
      expiresAt: data.session?.expires_at
        ? new Date(data.session.expires_at * 1000).toISOString()
        : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      permissions: [
        { resource: 'requests', actions: ['read', 'write'], scope: 'department' },
        { resource: 'bookings', actions: ['read', 'write'], scope: 'department' },
        { resource: 'guests', actions: ['read'], scope: 'department' }
      ]
    };
    
    set({ session, isAuthenticated: true, isLoading: false });
  } catch (error) {
    logger.error('Auth', 'Staff auth failed', error);
    set({ 
      error: error instanceof Error ? error.message : 'Authentication failed',
      isLoading: false 
    });
    throw error;
  }
},



      // Admin Authentication
      authenticateAdmin: async (email, password, property = 'Default Property') => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (error) throw error;

          const session: AuthSession = {
            user: {
              id: data.user?.id || '',
              name: data.user?.user_metadata?.name || email,
              role: 'admin',
              property: property,
            },
            token: data.session?.access_token || '',
            expiresAt: data.session?.expires_at
              ? new Date(data.session.expires_at * 1000).toISOString()
              : new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            permissions: [
              { resource: '*', actions: ['read', 'write', 'delete'], scope: 'all' }
            ]
          };
          
          set({ session, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Authentication failed',
            isLoading: false 
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await signOut();
        } catch (error) {
          logger.error('Auth', 'Logout failed', error);
        }
        
        set({ 
          session: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      // Refresh Token
      refreshToken: async () => {
        const { session } = get();
        
        if (!session?.token) {
          throw new Error('No session to refresh');
        }
        
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) throw error;

          const newSession: AuthSession = {
            ...session,
            token: data.session?.access_token || session.token,
            expiresAt: data.session?.expires_at
              ? new Date(data.session.expires_at * 1000).toISOString()
              : session.expiresAt
          };

          set({ session: newSession });
        } catch (error) {
          await get().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      getUser: () => {
        const { session } = get();
        return session?.user || null;
      },

      hasPermission: (resource: string, action: string) => {
        const { session } = get();
        if (!session?.permissions) return false;
        
        return session.permissions.some(permission => 
          (permission.resource === resource || permission.resource === '*') &&
          permission.actions.includes(action as any)
        );
      },

      isRole: (role: UserRole) => {
        const { session } = get();
        return session?.user?.role === role;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        session: state.session,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);