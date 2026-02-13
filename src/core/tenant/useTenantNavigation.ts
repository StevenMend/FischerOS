// src/core/tenant/useTenantNavigation.ts — Slug-aware navigation helpers
import { useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_SLUG } from '../../config/tenant-defaults';

/**
 * Hook that provides slug-aware navigation for components inside /:slug routes.
 *
 * Usage:
 *   const { navigateGuest, guestPath, slug } = useTenantNavigation();
 *   navigateGuest('restaurants');      // navigates to /:slug/guest/restaurants
 *   <Link to={guestPath('spa')} />    // builds /:slug/guest/spa
 */
export function useTenantNavigation() {
  const navigate = useNavigate();
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const slug = urlSlug ?? DEFAULT_SLUG;

  return {
    slug,
    navigateGuest: (path: string) => navigate(`/${slug}/guest/${path}`),
    navigateStaff: (path: string) => navigate(`/${slug}/staff/${path}`),
    navigateAdmin: (path: string) => navigate(`/${slug}/admin/${path}`),
    guestPath: (path: string) => `/${slug}/guest/${path}`,
    staffPath: (path: string) => `/${slug}/staff/${path}`,
    adminPath: (path: string) => `/${slug}/admin/${path}`,
  };
}
