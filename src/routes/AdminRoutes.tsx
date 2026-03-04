
// ========================================
// 4. src/routes/AdminRoutes.tsx - CORRECTED
// ========================================
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { logger } from '../core/utils/logger';
import AdminGuard from '../auth/guards/AdminGuard';
import AdminLayout from '../components/layout/AdminLayout';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import AdminDashboard from '../components/AdminDashboard';
import OperationsPage from '../pages/admin/OperationsPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import StaffManagementPage from '../pages/admin/StaffManagementPage';
import PartnerManagementPage from '../pages/admin/PartnerManagementPage';
import SettingsPage from '../pages/admin/SettingsPage';
import BillingPage from '../pages/admin/BillingPage';
import QRCodePage from '../pages/admin/QRCodePage';

export function AdminRoutes() {
  logger.debug('Router', 'AdminRoutes executing');

  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route element={<ErrorBoundary><AdminLayout /></ErrorBoundary>}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/staff" element={<StaffManagementPage />} />
          <Route path="/partners" element={<PartnerManagementPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/qr-codes" element={<QRCodePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}