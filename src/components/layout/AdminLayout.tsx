// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { LogOut, LayoutDashboard, Activity, BarChart3, Users, Handshake, CreditCard, Settings } from 'lucide-react';
import { logger } from '../../core/utils/logger';
import { NotificationBell } from '../../features/notifications/components';
import { useTenantNavigation } from '../../core/tenant/useTenantNavigation';
import { useAdminProperty } from '../../hooks/admin/useAdminProperty';
import { useSubscription } from '../../features/subscriptions/hooks/useSubscription';
import TrialBanner from '../admin/TrialBanner';

const NAV_ITEMS = [
  { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'operations', label: 'Operations', icon: Activity },
  { path: 'analytics', label: 'Analytics', icon: BarChart3 },
  { path: 'staff', label: 'Staff', icon: Users },
  { path: 'partners', label: 'Partners', icon: Handshake },
  { path: 'billing', label: 'Billing', icon: CreditCard },
  { path: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { adminPath } = useTenantNavigation();
  const location = useLocation();
  const { data: property } = useAdminProperty();
  const { isTrialing, trialDaysRemaining } = useSubscription(property?.id);

  logger.debug('AdminLayout', 'rendering');

  return (
    <div className="min-h-screen bg-gray-50">
      {isTrialing && <TrialBanner daysRemaining={trialDaysRemaining} />}

      <header className="bg-gradient-to-r from-accent to-accent-dark text-white">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-sm sm:text-base">Admin - {property?.name || user?.property}</span>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationBell userId={user?.id} />
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-7xl mx-auto px-4 pb-1 flex overflow-x-auto gap-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const fullPath = adminPath(path);
            const isActive = location.pathname === fullPath || location.pathname.endsWith(`/${path}`);
            return (
              <a
                key={path}
                href={fullPath}
                onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', fullPath); window.dispatchEvent(new PopStateEvent('popstate')); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white/90'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            );
          })}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
