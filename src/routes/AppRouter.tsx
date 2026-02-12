// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import AppShell from '../components/AppShell';
import { PlaceholderPage } from './MarketingRoutes';
import { TenantRoutes } from './TenantRoutes';
import { GuestRoutes } from './GuestRoutes';
import { StaffRoutes } from './StaffRoutes';
import { AdminRoutes } from './AdminRoutes';

// Marketing page components
import GuestLanding from '../pages/public/GuestLanding';
import StaffPortal from '../pages/public/StaffPortal';
import GuestAuthForm from '../auth/forms/GuestAuthForm';
import StaffAuthForm from '../auth/forms/StaffAuthForm';
import AdminAuthForm from '../auth/forms/AdminAuthForm';

/**
 * Application Router — Two worlds:
 *
 * MUNDO 1 — FischerOS (marketing/product):
 *   /            Landing
 *   /portal      Staff/Admin portal selector
 *   /pricing     Pricing
 *   /demo        Demo
 *   /auth/*      Auth portals
 *
 * MUNDO 2 — Hotel (tenant, white-label):
 *   /:slug/guest/*   Guest experience
 *   /:slug/staff/*   Staff dashboards
 *   /:slug/admin/*   Admin console
 *
 * Marketing routes are declared as explicit paths so React Router
 * ranks them above the /:slug dynamic param.
 */
export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppShell>
            <Routes>
              {/* MUNDO 1 — Marketing / FischerOS (explicit paths beat /:slug) */}
              <Route path="/" element={<GuestLanding />} />
              <Route path="/portal" element={<StaffPortal />} />
              <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
              <Route path="/demo" element={<PlaceholderPage title="Demo" />} />
              <Route path="/auth/guest" element={<GuestAuthForm />} />
              <Route path="/auth/staff" element={<StaffAuthForm />} />
              <Route path="/auth/admin" element={<AdminAuthForm />} />

              {/* MUNDO 2 — Tenant (hotel) */}
              <Route path="/:slug" element={<TenantRoutes />}>
                <Route path="guest/*" element={<GuestRoutes />} />
                <Route path="staff/*" element={<StaffRoutes />} />
                <Route path="admin/*" element={<AdminRoutes />} />
                <Route index element={<Navigate to="guest/dashboard" replace />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
