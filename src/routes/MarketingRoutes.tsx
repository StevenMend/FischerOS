// src/routes/MarketingRoutes.tsx — FischerOS marketing / public routes
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GuestLanding from '../pages/public/GuestLanding';
import GuestAuthForm from '../auth/forms/GuestAuthForm';
import StaffAuthForm from '../auth/forms/StaffAuthForm';
import AdminAuthForm from '../auth/forms/AdminAuthForm';

/**
 * MUNDO 1 — FischerOS (marketing / product)
 *
 *  /              Landing page (marketplace)
 *  /pricing       Pricing          (placeholder)
 *  /demo          Demo             (placeholder)
 *  /auth/guest    Guest login
 *  /auth/staff    Staff login
 *  /auth/admin    Admin login
 */
export function MarketingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GuestLanding />} />
      <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
      <Route path="/demo" element={<PlaceholderPage title="Demo" />} />
      <Route path="/auth/guest" element={<GuestAuthForm />} />
      <Route path="/auth/staff" element={<StaffAuthForm />} />
      <Route path="/auth/admin" element={<AdminAuthForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Minimal placeholder until real pages exist. */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-600">{title} — Coming soon</h1>
    </div>
  );
}
