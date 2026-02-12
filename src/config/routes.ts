
// src/config/routes.ts - Route Definitions by Role
import { UserRole } from '../types';

// Route Path Constants — tenant paths include :slug placeholder
export const ROUTE_PATHS = {
  // MUNDO 1 — Marketing / FischerOS (no slug)
  landing: '/',
  pricing: '/pricing',
  demo: '/demo',

  // Auth Routes (marketing world — separate from tenant)
  auth: {
    guest: '/auth/guest',
    staff: '/auth/staff',
    admin: '/auth/admin'
  },

  // MUNDO 2 — Tenant (hotel) — all paths carry :slug
  guest: {
    base: '/:slug/guest',
    dashboard: '/:slug/guest/dashboard',
    restaurants: '/:slug/guest/restaurants',
    tours: '/:slug/guest/tours',
    spa: '/:slug/guest/spa',
    requests: '/:slug/guest/requests',
    profile: '/:slug/guest/profile'
  },

  staff: {
    base: '/:slug/staff',
    console: '/:slug/staff/console',
    requests: '/:slug/staff/requests',
    analytics: '/:slug/staff/analytics',
    coordination: '/:slug/staff/coordination',
    partners: '/:slug/staff/partners'
  },

  admin: {
    base: '/:slug/admin',
    dashboard: '/:slug/admin/dashboard',
    operations: '/:slug/admin/operations',
    analytics: '/:slug/admin/analytics',
    staff: '/:slug/admin/staff',
    partners: '/:slug/admin/partners',
    settings: '/:slug/admin/settings'
  }
} as const;

/** Resolve a ROUTE_PATHS template by replacing :slug with an actual value. */
export function resolvePath(template: string, slug: string): string {
  return template.replace(':slug', slug);
}

/** Build all tenant paths for a given slug (ready to navigate). */
export function buildTenantPaths(slug: string) {
  return {
    guest: {
      base: `/${slug}/guest`,
      dashboard: `/${slug}/guest/dashboard`,
      restaurants: `/${slug}/guest/restaurants`,
      tours: `/${slug}/guest/tours`,
      spa: `/${slug}/guest/spa`,
      requests: `/${slug}/guest/requests`,
      profile: `/${slug}/guest/profile`,
    },
    staff: {
      base: `/${slug}/staff`,
      console: `/${slug}/staff/console`,
      requests: `/${slug}/staff/requests`,
      analytics: `/${slug}/staff/analytics`,
      coordination: `/${slug}/staff/coordination`,
      partners: `/${slug}/staff/partners`,
    },
    admin: {
      base: `/${slug}/admin`,
      dashboard: `/${slug}/admin/dashboard`,
      operations: `/${slug}/admin/operations`,
      analytics: `/${slug}/admin/analytics`,
      staff: `/${slug}/admin/staff`,
      partners: `/${slug}/admin/partners`,
      settings: `/${slug}/admin/settings`,
    },
  } as const;
}

// Route Configuration by Role
export const ROUTE_CONFIG = {
  guest: {
    defaultRoute: ROUTE_PATHS.guest.dashboard,
    allowedRoutes: [
      ROUTE_PATHS.guest.dashboard,
      ROUTE_PATHS.guest.restaurants,
      ROUTE_PATHS.guest.tours,
      ROUTE_PATHS.guest.spa,
      ROUTE_PATHS.guest.requests,
      ROUTE_PATHS.guest.profile
    ],
    authRoute: ROUTE_PATHS.auth.guest,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    permissions: [
      { resource: 'restaurants', actions: ['read', 'book'], scope: 'own' },
      { resource: 'tours', actions: ['read', 'book'], scope: 'own' },
      { resource: 'spa', actions: ['read', 'book'], scope: 'own' },
      { resource: 'requests', actions: ['read', 'write'], scope: 'own' }
    ]
  },

  staff: {
    defaultRoute: ROUTE_PATHS.staff.console,
    allowedRoutes: [
      ROUTE_PATHS.staff.console,
      ROUTE_PATHS.staff.requests,
      ROUTE_PATHS.staff.analytics,
      ROUTE_PATHS.staff.coordination,
      ROUTE_PATHS.staff.partners
    ],
    authRoute: ROUTE_PATHS.auth.staff,
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    permissions: [
      { resource: 'requests', actions: ['read', 'write'], scope: 'department' },
      { resource: 'guests', actions: ['read'], scope: 'department' },
      { resource: 'partners', actions: ['read'], scope: 'department' },
      { resource: 'analytics', actions: ['read'], scope: 'department' }
    ]
  },

  admin: {
    defaultRoute: ROUTE_PATHS.admin.dashboard,
    allowedRoutes: [
      ROUTE_PATHS.admin.dashboard,
      ROUTE_PATHS.admin.operations,
      ROUTE_PATHS.admin.analytics,
      ROUTE_PATHS.admin.staff,
      ROUTE_PATHS.admin.partners,
      ROUTE_PATHS.admin.settings
    ],
    authRoute: ROUTE_PATHS.auth.admin,
    sessionTimeout: 4 * 60 * 60 * 1000, // 4 hours
    permissions: [
      { resource: '*', actions: ['read', 'write', 'delete'], scope: 'all' }
    ]
  }
} as const;

// Navigation Configuration
export const NAV_CONFIG = {
  guest: [
    {
      path: ROUTE_PATHS.guest.dashboard,
      label: 'Dashboard',
      icon: 'Home',
      description: 'Overview & quick actions'
    },
    {
      path: ROUTE_PATHS.guest.restaurants,
      label: 'Restaurants',
      icon: 'UtensilsCrossed',
      description: '8 dining venues'
    },
    {
      path: ROUTE_PATHS.guest.tours,
      label: 'Tours',
      icon: 'MapPin',
      description: '60+ experiences'
    },
    {
      path: ROUTE_PATHS.guest.spa,
      label: 'Spa',
      icon: 'Flower2',
      description: 'Wellness & relaxation'
    },
    {
      path: ROUTE_PATHS.guest.requests,
      label: 'My Requests',
      icon: 'MessageCircle',
      description: 'Track your bookings'
    }
  ],

  staff: [
    {
      path: ROUTE_PATHS.staff.console,
      label: 'Console',
      icon: 'Layout3',
      description: 'Request management'
    },
    {
      path: ROUTE_PATHS.staff.requests,
      label: 'All Requests',
      icon: 'Inbox',
      description: 'Department queue'
    },
    {
      path: ROUTE_PATHS.staff.coordination,
      label: 'Coordination',
      icon: 'Users',
      description: 'Real-time updates'
    },
    {
      path: ROUTE_PATHS.staff.partners,
      label: 'Partners',
      icon: 'Handshake',
      description: 'External contacts'
    },
    {
      path: ROUTE_PATHS.staff.analytics,
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Performance metrics'
    }
  ],

  admin: [
    {
      path: ROUTE_PATHS.admin.dashboard,
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      description: 'Executive overview'
    },
    {
      path: ROUTE_PATHS.admin.operations,
      label: 'Operations',
      icon: 'Activity',
      description: 'Live monitoring'
    },
    {
      path: ROUTE_PATHS.admin.analytics,
      label: 'Analytics',
      icon: 'TrendingUp',
      description: 'Business intelligence'
    },
    {
      path: ROUTE_PATHS.admin.staff,
      label: 'Staff',
      icon: 'Users',
      description: 'Team management'
    },
    {
      path: ROUTE_PATHS.admin.partners,
      label: 'Partners',
      icon: 'Building2',
      description: 'Partner network'
    },
    {
      path: ROUTE_PATHS.admin.settings,
      label: 'Settings',
      icon: 'Settings',
      description: 'System configuration'
    }
  ]
} as const;

// Route Guards Configuration
export const ROUTE_GUARDS = {
  // Routes that require authentication
  protected: [
    ...ROUTE_CONFIG.guest.allowedRoutes,
    ...ROUTE_CONFIG.staff.allowedRoutes,
    ...ROUTE_CONFIG.admin.allowedRoutes
  ],

  // Routes that require specific roles
  roleGuards: {
    [ROUTE_PATHS.guest.base]: ['guest'],
    [ROUTE_PATHS.staff.base]: ['staff'],
    [ROUTE_PATHS.admin.base]: ['admin']
  },

  // Routes that require specific permissions
  permissionGuards: {
    [ROUTE_PATHS.admin.settings]: [
      { resource: 'system', actions: ['write'], scope: 'all' }
    ],
    [ROUTE_PATHS.staff.partners]: [
      { resource: 'partners', actions: ['read'], scope: 'department' }
    ]
  },

  // Redirect rules
  redirects: {
    '/': (role: UserRole | null) => {
      if (!role) return ROUTE_PATHS.landing;
      return ROUTE_CONFIG[role].defaultRoute;
    },
  }
} as const;

// Export utility functions
export const getDefaultRouteForRole = (role: UserRole): string => {
  return ROUTE_CONFIG[role].defaultRoute;
};

/** Resolve the default route for a role, replacing :slug with the actual slug. */
export const getDefaultRouteForRoleResolved = (role: UserRole, slug: string): string => {
  return resolvePath(ROUTE_CONFIG[role].defaultRoute, slug);
};

export const getAuthRouteForRole = (role: UserRole): string => {
  return ROUTE_CONFIG[role].authRoute;
};

export const isRouteAllowedForRole = (route: string, role: UserRole): boolean => {
  return (ROUTE_CONFIG[role].allowedRoutes as readonly string[]).includes(route);
};

export const getNavConfigForRole = (role: UserRole) => {
  return NAV_CONFIG[role];
};

export const getSessionTimeoutForRole = (role: UserRole): number => {
  return ROUTE_CONFIG[role].sessionTimeout;
};

export const getPermissionsForRole = (role: UserRole) => {
  return ROUTE_CONFIG[role].permissions;
};
