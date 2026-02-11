// ========================================
// 2. src/components/layout/AdminLayout.tsx - FIXED
// ========================================
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { LogOut } from 'lucide-react';
import { logger } from '../../core/utils/logger';

// REMOVED children prop - using Outlet instead
export default function AdminLayout() {
  const { user, logout } = useAuth();

  logger.debug('AdminLayout', 'rendering');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-accent to-accent-dark text-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TD</span>
            </div>
            <span className="font-semibold">Admin Dashboard - {user?.property}</span>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}