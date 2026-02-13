// src/config/tenant-defaults.ts — Single source of truth for tenant constants.
// When Supabase is connected, TENANT_REGISTRY becomes a DB fetch.

import { SITE_CONFIG } from './site';

// ── Default slug (used as fallback when URL has no :slug param) ─────
export const DEFAULT_SLUG = 'tamarindo-diria';

// ── Known slugs (validated by TenantRoutes before entering tenant context) ──
export const KNOWN_SLUGS = ['tamarindo-diria', 'guanacaste', 'manuel-antonio'] as const;
export type PropertySlug = (typeof KNOWN_SLUGS)[number];

// ── Tenant config shape ─────────────────────────────────────────────
export interface TenantConfig {
  propertyId: string;
  propertyName: string;
  slug: string;
  colors: typeof SITE_CONFIG.colors;
  features: typeof SITE_CONFIG.features;
}

// ── Registry — hardcoded for now; will be replaced by Supabase lookup ──
export const TENANT_REGISTRY: Record<string, TenantConfig> = {
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
