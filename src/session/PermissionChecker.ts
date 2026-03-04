// src/session/PermissionChecker.ts - Permission Logic Implementation
import { UserRole, Permission, AuthSession } from '../types';
import { ROUTE_CONFIG, ROUTE_GUARDS } from '../config/routes';

export class PermissionChecker {
  private session: AuthSession | null;

  constructor(session: AuthSession | null = null) {
    this.session = session;
  }

  // Update session context
  updateSession(session: AuthSession | null) {
    this.session = session;
  }

  // Check if user has specific permission
  hasPermission(resource: string, action: string, scope?: string): boolean {
    if (!this.session?.permissions) return false;

    return this.session.permissions.some(permission => {
      // Check resource match (exact or wildcard)
      const resourceMatch = permission.resource === resource || permission.resource === '*';
      
      // Check action match
      const actionMatch = permission.actions.includes(action as any);
      
      // Check scope if specified
      const scopeMatch = !scope || permission.scope === scope || permission.scope === 'all';
      
      return resourceMatch && actionMatch && scopeMatch;
    });
  }

  // Check if user has any of the required permissions
  hasAnyPermission(requiredPermissions: Array<{ resource: string; action: string; scope?: string }>): boolean {
    return requiredPermissions.some(({ resource, action, scope }) => 
      this.hasPermission(resource, action, scope)
    );
  }

  // Check if user has all required permissions
  hasAllPermissions(requiredPermissions: Array<{ resource: string; action: string; scope?: string }>): boolean {
    return requiredPermissions.every(({ resource, action, scope }) => 
      this.hasPermission(resource, action, scope)
    );
  }

  // Check if user can access a specific route
  canAccessRoute(route: string): boolean {
    if (!this.session) return false;

    const userRole = this.session.user.role;
    
    // Check if route is allowed for user's role
    const allowedRoutes = ROUTE_CONFIG[userRole]?.allowedRoutes || [];
    const isRouteAllowed = allowedRoutes.some(allowedRoute => 
      route.startsWith(allowedRoute) || route === allowedRoute
    );

    if (!isRouteAllowed) return false;

    // Check route-specific permissions if defined
    const routePermissions = ROUTE_GUARDS.permissionGuards[route];
    if (routePermissions) {
      return this.hasAllPermissions(routePermissions);
    }

    return true;
  }

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    return this.session?.user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    if (!this.session) return false;
    return roles.includes(this.session.user.role);
  }

  // Get user's effective permissions for a resource
  getResourcePermissions(resource: string): string[] {
    if (!this.session?.permissions) return [];

    return this.session.permissions
      .filter(permission => 
        permission.resource === resource || permission.resource === '*'
      )
      .flatMap(permission => permission.actions);
  }

  // Check department access for staff
  canAccessDepartment(department: string): boolean {
    if (!this.session) return false;
    
    const user = this.session.user;
    
    // Admins can access all departments
    if (user.role === 'admin') return true;
    
    // Staff can only access their own department
    if (user.role === 'staff') {
      return user.department === department;
    }
    
    // Guests cannot access departments
    return false;
  }

  // Check if user is in their session timeout window
  isSessionValid(): boolean {
    if (!this.session) return false;

    const now = new Date().getTime();
    const expiresAt = new Date(this.session.expiresAt).getTime();
    
    return now < expiresAt;
  }

  // Get time until session expires (in minutes)
  getTimeUntilExpiry(): number {
    if (!this.session) return 0;

    const now = new Date().getTime();
    const expiresAt = new Date(this.session.expiresAt).getTime();
    const timeDiff = expiresAt - now;
    
    return Math.max(0, Math.floor(timeDiff / (1000 * 60)));
  }

  // Check if session is expiring soon (within 10 minutes)
  isSessionExpiringSoon(): boolean {
    return this.getTimeUntilExpiry() <= 10;
  }
}

// Create singleton instance
export const permissionChecker = new PermissionChecker();

// Helper functions for common permission checks
export const checkPermission = (
  session: AuthSession | null,
  resource: string,
  action: string,
  scope?: string
): boolean => {
  const checker = new PermissionChecker(session);
  return checker.hasPermission(resource, action, scope);
};

export const checkRouteAccess = (
  session: AuthSession | null,
  route: string
): boolean => {
  const checker = new PermissionChecker(session);
  return checker.canAccessRoute(route);
};

export const checkDepartmentAccess = (
  session: AuthSession | null,
  department: string
): boolean => {
  const checker = new PermissionChecker(session);
  return checker.canAccessDepartment(department);
};
