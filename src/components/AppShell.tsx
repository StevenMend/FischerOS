// src/components/AppShell.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import SessionWarningModal from './shared/SessionWarningModal';
import SessionExpiredModal from './shared/SessionExpiredModal';
import { Toaster, toast } from 'sonner';
import { SITE_CONFIG } from '../config/site';
import { logger } from '../core/utils/logger';

/**
 * Application Shell
 * Wraps all routes and provides:
 * - Session management modals
 * - Toast notifications (Sonner)
 * - Online/offline detection
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  useEffect(() => {
    // Log startup in development
    if (SITE_CONFIG.environment === 'development') {
      logger.info('App', 'Guest App Started');
      logger.info('App', 'Features', SITE_CONFIG.features);
      logger.info('App', 'Properties', SITE_CONFIG.properties);
    }

    // ✅ Online/Offline detection
    const handleOnline = () => {
      logger.info('Network', 'Back online');
      toast.success('Back Online', {
        description: 'Connection restored'
      });
    };

    const handleOffline = () => {
      logger.info('Network', 'Offline mode');
      toast.warning('Offline Mode', {
        description: 'Some features may be limited'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      <SessionWarningModal />
      <SessionExpiredModal />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          className: 'font-sans',
        }}
      />
    </>
  );
}
