// src/routes/GuestRoutes.tsx - ALL IMPORTS FROM FEATURES
import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { logger } from '../core/utils/logger';
import GuestGuard from '../auth/guards/GuestGuard';
import GuestLayout from '../components/layout/GuestLayout';
import GuestDashboard from '../components/GuestDashboard';
import RestaurantsPage from '../features/restaurants/pages/RestaurantsPage';
import ToursPage from '../features/tours/pages/ToursPage';
import SpaPage from '../features/spa/pages/SpaPage';
import RequestsPage from '../features/service-requests/pages/RequestsPage';
import ProfilePage from '../pages/guest/ProfilePage';

function GuestDashboardWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  logger.debug('Router', 'GuestDashboardWrapper - current path:', location.pathname);

  // Use relative navigation — we are inside /:slug/guest/*
  const handleNavigate = (page: string) => {
    logger.debug('Router', 'Navigating to:', page);
    switch(page) {
      case 'restaurants': navigate('restaurants'); break;
      case 'tours': navigate('tours'); break;
      case 'spa': navigate('spa'); break;
      case 'requests': navigate('requests'); break;
      case 'profile': navigate('profile'); break;
      default: navigate('dashboard');
    }
  };

  const currentPage = location.pathname.split('/').pop() || 'dashboard';

  return <GuestDashboard currentPage={currentPage} onNavigate={handleNavigate} />;
}

export function GuestRoutes() {
  logger.debug('Router', 'GuestRoutes initialized - all pages from features/');
  
  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route element={<GuestLayout />}>
          <Route path="/dashboard" element={<GuestDashboardWrapper />} />
          <Route path="/restaurants" element={<RestaurantsPage onBack={() => {}} />} />
          <Route path="/tours" element={<ToursPage onBack={() => {}} />} />
          <Route path="/spa" element={<SpaPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}