import { useAuth as useAuthContext } from '../auth/AuthProvider';

export const useAuth = useAuthContext;

export const useAuthRole = () => {
  const { user } = useAuth();
  return user?.role || null;
};

export const useAuthPermissions = () => {
  const { hasPermission } = useAuth();
  return { hasPermission };
};

export const useAuthSession = () => {
  const { session, isAuthenticated, isLoading } = useAuth();
  return { session, isAuthenticated, isLoading };
};