// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import AppShell from '../components/AppShell';
import { MarketingRoutes } from './MarketingRoutes';
import { TenantRoutes } from './TenantRoutes';
import { GuestRoutes } from './GuestRoutes';
import { StaffRoutes } from './StaffRoutes';
import { AdminRoutes } from './AdminRoutes';

/**
 * Application Router — Two worlds:
 *
 * MUNDO 1 — FischerOS (marketing/product):
 *   /            Landing
 *   /pricing     Pricing
 *   /demo        Demo
 *   /auth/*      Auth portals
 *
 * MUNDO 2 — Hotel (tenant, white-label):
 *   /:slug/guest/*   Guest experience
 *   /:slug/staff/*   Staff dashboards
 *   /:slug/admin/*   Admin console
 */
export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppShell>
            <Routes>
              {/* MUNDO 1 — Marketing / FischerOS */}
              <Route path="/*" element={<MarketingRoutes />} />

              {/* MUNDO 2 — Tenant (hotel) */}
              <Route path="/:slug" element={<TenantRoutes />}>
                <Route path="guest/*" element={<GuestRoutes />} />
                <Route path="staff/*" element={<StaffRoutes />} />
                <Route path="admin/*" element={<AdminRoutes />} />
                <Route index element={<Navigate to="guest/dashboard" replace />} />
              </Route>
            </Routes>
          </AppShell>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
