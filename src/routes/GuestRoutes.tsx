// src/routes/GuestRoutes.tsx — 4 consolidated guest routes
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { logger } from '../core/utils/logger';
import GuestGuard from '../auth/guards/GuestGuard';
import GuestLayout from '../components/layout/GuestLayout';
import GuestDashboard from '../components/GuestDashboard';
import ExperiencesPage from '../pages/guest/ExperiencesPage';
import RequestsPage from '../features/service-requests/pages/RequestsPage';
import GuestCardPage from '../pages/guest/GuestCardPage';
import { useTenantNavigation } from '../core/tenant/useTenantNavigation';

function LobbyWrapper() {
  const { navigateGuest } = useTenantNavigation();

  const handleNavigate = (page: string) => {
    logger.debug('Router', 'Lobby navigate:', page);
    switch (page) {
      case 'restaurants':
      case 'tours':
      case 'spa':
        navigateGuest('experiences');
        break;
      case 'requests':
        navigateGuest('requests');
        break;
      case 'profile':
        navigateGuest('card');
        break;
      default:
        break;
    }
  };

  return <GuestDashboard currentPage="lobby" onNavigate={handleNavigate} />;
}

export function GuestRoutes() {
  logger.debug('Router', 'GuestRoutes initialized — 4 consolidated routes');

  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route element={<GuestLayout />}>
          {/* Primary 4 routes */}
          <Route index element={<LobbyWrapper />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/card" element={<GuestCardPage />} />

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to=".." replace />} />
          <Route path="/restaurants" element={<Navigate to="../experiences" replace />} />
          <Route path="/tours" element={<Navigate to="../experiences" replace />} />
          <Route path="/spa" element={<Navigate to="../experiences" replace />} />
          <Route path="/profile" element={<Navigate to="../card" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to=".." replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
