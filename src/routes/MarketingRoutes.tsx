// src/routes/MarketingRoutes.tsx — FischerOS marketing / public routes
import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MUNDO 1 — FischerOS (marketing / product)
 *
 * Layout wrapper for marketing pages.
 * Individual routes are declared explicitly in AppRouter so that
 * React Router ranks them higher than the /:slug catch-all.
 */
export function MarketingLayout() {
  return <Outlet />;
}

/** Minimal placeholder until real pages exist. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-600">{title} — Coming soon</h1>
    </div>
  );
}
