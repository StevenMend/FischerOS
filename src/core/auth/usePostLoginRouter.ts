// src/core/auth/usePostLoginRouter.ts — Post-login routing by role/department
import { useNavigate, useParams } from 'react-router-dom';
import { buildTenantPaths } from '../../config/routes';
import { DEFAULT_SLUG } from '../../config/tenant-defaults';
import { logger } from '../utils/logger';

interface StaffProfile {
  department: string;
  restaurantSlug?: string | null;
}

/** Department (lowercase) → relative staff sub-path */
const DEPARTMENT_ROUTE_MAP: Record<string, string> = {
  'food & beverage':    'restaurant',
  'restaurants':        'restaurant',
  'housekeeping':       'housekeeping',
  'maintenance':        'maintenance',
  'concierge':          'concierge',
  'spa':                'spa',
  'tours & activities': 'tours',
  'transportation':     'transportation',
  'front desk':         'console',
};

/**
 * Returns route helpers that navigate within the current tenant (`:slug`).
 *
 * The slug is read from the URL when available.  For callers that are
 * outside a tenant route (e.g. the marketing auth pages) a `slug`
 * parameter can be passed explicitly.
 */
export function usePostLoginRouter(slugOverride?: string) {
  const navigate = useNavigate();
  const params = useParams<{ slug: string }>();
  const slug = slugOverride ?? params.slug ?? DEFAULT_SLUG;

  const paths = buildTenantPaths(slug);

  const routeGuest = () => {
    navigate(paths.guest.dashboard);
  };

  const routeAdmin = () => {
    navigate(paths.admin.dashboard);
  };

  const routeStaff = (profile: StaffProfile) => {
    const dept = profile.department.toLowerCase();
    const sub = DEPARTMENT_ROUTE_MAP[dept] ?? 'console';

    let route: string;
    if (sub === 'restaurant' && profile.restaurantSlug) {
      route = `${paths.staff.base}/restaurant/${profile.restaurantSlug}`;
    } else if (sub === 'restaurant') {
      route = paths.staff.console; // no slug → fallback
    } else {
      route = `${paths.staff.base}/${sub}`;
    }

    logger.info('PostLoginRouter', `Routing staff to ${route}`, { department: dept });
    navigate(route);
  };

  return { routeGuest, routeAdmin, routeStaff };
}
