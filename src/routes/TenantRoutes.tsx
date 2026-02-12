// src/routes/TenantRoutes.tsx — Validates :slug and wraps tenant children
import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { logger } from '../core/utils/logger';
import { TenantProvider } from '../core/tenant/TenantProvider';

/** Known property slugs derived from SITE_CONFIG (hardcoded for now). */
const KNOWN_SLUGS = ['tamarindo-diria', 'guanacaste', 'manuel-antonio'] as const;
export type PropertySlug = (typeof KNOWN_SLUGS)[number];

function isKnownSlug(value: string): value is PropertySlug {
  return (KNOWN_SLUGS as readonly string[]).includes(value);
}

/**
 * TenantRoutes reads :slug from the URL, validates it, and provides
 * the TenantProvider context to all children.
 *
 * If the slug is unknown the user is redirected to the marketing landing page.
 *
 * Mount this component at `/:slug` inside AppRouter.
 */
export function TenantRoutes() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !isKnownSlug(slug)) {
    logger.warn('TenantRoutes', `Unknown slug "${slug}" — redirecting to landing`);
    return <Navigate to="/" replace />;
  }

  logger.debug('TenantRoutes', `Tenant resolved: ${slug}`);

  return (
    <TenantProvider>
      <Outlet />
    </TenantProvider>
  );
}
