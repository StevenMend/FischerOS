// src/core/tenant/TenantProvider.tsx — Tenant context from :slug
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { SITE_CONFIG } from '../../config/site';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Tenant registry — hardcoded for now; will be replaced by Supabase lookup.
// ---------------------------------------------------------------------------

interface TenantConfig {
  propertyId: string;
  propertyName: string;
  slug: string;
  colors: typeof SITE_CONFIG.colors;
  features: typeof SITE_CONFIG.features;
}

const TENANT_REGISTRY: Record<string, TenantConfig> = {
  'tamarindo-diria': {
    propertyId: 'prop_tamarindo_diria',
    propertyName: 'Tamarindo Diriá Beach Resort',
    slug: 'tamarindo-diria',
    colors: SITE_CONFIG.colors,
    features: SITE_CONFIG.features,
  },
  'guanacaste': {
    propertyId: 'prop_guanacaste',
    propertyName: 'Guanacaste Resort',
    slug: 'guanacaste',
    colors: SITE_CONFIG.colors,
    features: SITE_CONFIG.features,
  },
  'manuel-antonio': {
    propertyId: 'prop_manuel_antonio',
    propertyName: 'Manuel Antonio',
    slug: 'manuel-antonio',
    colors: SITE_CONFIG.colors,
    features: SITE_CONFIG.features,
  },
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TenantContext = createContext<TenantConfig | null>(null);

interface TenantProviderProps {
  children: ReactNode;
}

/**
 * Reads `:slug` from the URL, resolves the tenant config,
 * and provides it to all children via React context.
 *
 * Must be rendered inside a route that contains a `:slug` param
 * (e.g. `<Route path="/:slug" element={<TenantRoutes />}>`).
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const { slug } = useParams<{ slug: string }>();

  const tenant = useMemo(() => {
    if (!slug) return null;
    const config = TENANT_REGISTRY[slug] ?? null;
    if (config) {
      logger.debug('TenantProvider', `Resolved tenant: ${config.propertyName}`);
    } else {
      logger.warn('TenantProvider', `No tenant config for slug "${slug}"`);
    }
    return config;
  }, [slug]);

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Access the current tenant context.
 * Throws if used outside TenantProvider.
 */
export function useTenant(): TenantConfig {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within a TenantProvider (inside /:slug route)');
  }
  return ctx;
}

/**
 * Access the current tenant context (nullable — for components that can
 * render both inside and outside a tenant route).
 */
export function useTenantOptional(): TenantConfig | null {
  return useContext(TenantContext);
}
