// src/routes/StaffRoutes.tsx - WITH ALL DEPARTMENT ROUTES
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../config/routes';
import { logger } from '../core/utils/logger';
import StaffGuard from '../auth/guards/StaffGuard';
import StaffLayout from '../components/layout/StaffLayout';
import StaffConsole from '../pages/staff/StaffConsole';
import AllRequestsPage from '../pages/staff/AllRequestsPage';
import CoordinationPage from '../pages/staff/CoordinationPage';
import PartnersPage from '../pages/staff/PartnersPage';
import StaffAnalyticsPage from '../pages/staff/StaffAnalyticsPage';

// Restaurant
import RestaurantStaffDashboard from '../features/restaurants/staff/pages/RestaurantStaffDashboard';
import RestaurantRedirect from '../features/restaurants/staff/components/RestaurantRedirect';

// Other Departments
import SpaDashboard from '../features/spa/staff/pages/SpaDashboard';
import ToursDashboard from '../features/tours/staff/pages/ToursDashboard';
import HousekeepingDashboard from '../pages/staff/housekeeping/HousekeepingDashboard';
import MaintenanceDashboard from '../pages/staff/maintenance/MaintenanceDashboard';
import TransportationDashboard from '../pages/staff/transportation/TransportationDashboard';
import ConciergeDashboard from '../pages/staff/concierge/ConciergeDashboard';

export function StaffRoutes() {
  logger.debug('Router', 'StaffRoutes executing');
  
  return (
    <Routes>
      <Route element={<StaffGuard />}>
        <Route element={<StaffLayout />}>
          {/* General Staff Routes */}
          <Route path="/console" element={<StaffConsole />} />
          <Route path="/requests" element={<AllRequestsPage />} />
          <Route path="/coordination" element={<CoordinationPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/analytics" element={<StaffAnalyticsPage />} />
          
          {/* ========== RESTAURANT ROUTES ========== */}
          <Route path="/restaurant" element={<RestaurantRedirect />} />
          <Route path="/restaurant/:slug" element={<RestaurantStaffDashboard />} />
          
          {/* ========== DEPARTMENT ROUTES ========== */}
          <Route path="/spa" element={<SpaDashboard />} />
          <Route path="/concierge/tours" element={<ToursDashboard />} />
          <Route path="/concierge" element={<ConciergeDashboard />} />
          <Route path="/housekeeping" element={<HousekeepingDashboard />} />
          <Route path="/maintenance" element={<MaintenanceDashboard />} />
          <Route path="/transportation" element={<TransportationDashboard />} />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to={ROUTE_PATHS.staff.console} replace />} />
          <Route path="*" element={<Navigate to={ROUTE_PATHS.staff.console} replace />} />
        </Route>
      </Route>
    </Routes>
  );
}