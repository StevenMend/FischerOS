// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import AppShell from '../components/AppShell';
import { TenantRoutes } from './TenantRoutes';
import { GuestRoutes } from './GuestRoutes';
import { StaffRoutes } from './StaffRoutes';
import { AdminRoutes } from './AdminRoutes';

// Marketing page components (FischerOS)
import LandingPage from '../pages/marketing/LandingPage';
import PricingPage from '../pages/marketing/PricingPage';
import DemoPage from '../pages/marketing/DemoPage';
import StaffPortal from '../pages/public/StaffPortal';
import GuestAuthForm from '../auth/forms/GuestAuthForm';
import StaffAuthForm from '../auth/forms/StaffAuthForm';
import AdminAuthForm from '../auth/forms/AdminAuthForm';

/**
 * Application Router — Two worlds:
 *
 * MUNDO 1 — FischerOS marketing (sells the software):
 *   /            FischerOS product landing (like visiting stripe.com)
 *   /pricing     Pricing page
 *   /demo        Demo request page
 *
 * APP — Public entry points (used by hotel staff & guests):
 *   /portal      Staff/Admin portal selector
 *   /auth/*      Auth forms (guest, staff, admin)
 *
 * MUNDO 2 — Hotel product (tenant, white-label):
 *   /:slug/guest/*   Guest experience (arrived via QR)
 *   /:slug/staff/*   Staff dashboards
 *   /:slug/admin/*   Admin console
 *
 * Explicit paths are declared first so React Router ranks them
 * above the /:slug dynamic param.
 */
export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppShell>
            <Routes>
              {/* MUNDO 1 — FischerOS marketing (sells the software) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo" element={<DemoPage />} />

              {/* APP — Public entry points (staff portal + auth) */}
              <Route path="/portal" element={<StaffPortal />} />
              <Route path="/auth/guest" element={<GuestAuthForm />} />
              <Route path="/auth/staff" element={<StaffAuthForm />} />
              <Route path="/auth/admin" element={<AdminAuthForm />} />

              {/* MUNDO 2 — Tenant (hotel) */}
              <Route path="/:slug" element={<TenantRoutes />}>
                <Route path="guest/*" element={<GuestRoutes />} />
                <Route path="staff/*" element={<StaffRoutes />} />
                <Route path="admin/*" element={<AdminRoutes />} />
                <Route index element={<Navigate to="guest" replace />} />
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
