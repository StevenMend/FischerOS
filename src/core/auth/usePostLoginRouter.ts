// src/core/auth/usePostLoginRouter.ts — Post-login routing by role/department
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../config/routes';
import { logger } from '../utils/logger';

interface StaffProfile {
  department: string;
  restaurantSlug?: string | null;
}

/** Department (lowercase) → staff base route */
const DEPARTMENT_ROUTE_MAP: Record<string, string> = {
  'food & beverage':    '/staff/restaurant',
  'restaurants':        '/staff/restaurant',
  'housekeeping':       '/staff/housekeeping',
  'maintenance':        '/staff/maintenance',
  'concierge':          '/staff/concierge',
  'spa':                '/staff/spa',
  'tours & activities': '/staff/tours',
  'transportation':     '/staff/transportation',
  'front desk':         ROUTE_PATHS.staff.console,
};

export function usePostLoginRouter() {
  const navigate = useNavigate();

  const routeGuest = () => {
    navigate(ROUTE_PATHS.guest.dashboard);
  };

  const routeAdmin = () => {
    navigate(ROUTE_PATHS.admin.dashboard);
  };

  const routeStaff = (profile: StaffProfile) => {
    const dept = profile.department.toLowerCase();
    const base = DEPARTMENT_ROUTE_MAP[dept] ?? ROUTE_PATHS.staff.console;

    // Restaurant staff with a known slug get their specific dashboard
    let route: string;
    if (base === '/staff/restaurant' && profile.restaurantSlug) {
      route = `/staff/restaurant/${profile.restaurantSlug}`;
    } else if (base === '/staff/restaurant') {
      route = ROUTE_PATHS.staff.console; // no slug → fallback
    } else {
      route = base;
    }

    logger.info('PostLoginRouter', `Routing staff to ${route}`, { department: dept });
    navigate(route);
  };

  return { routeGuest, routeAdmin, routeStaff };
}
