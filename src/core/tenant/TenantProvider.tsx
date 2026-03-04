// src/core/tenant/TenantProvider.tsx — Tenant context from :slug
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { TENANT_REGISTRY, TenantConfig } from '../../config/tenant-defaults';
import { logger } from '../utils/logger';

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
