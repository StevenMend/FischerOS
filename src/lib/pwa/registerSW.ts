// src/lib/pwa/registerSW.ts
import { ToastService } from '../services/toast.service';
import { logger } from '../../core/utils/logger';

/**
 * Register Service Worker for PWA functionality
 * Handles offline caching, updates, and installation
 */
export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    logger.warn('PWA', 'Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        logger.info('PWA', 'Service Worker registered', { scope: registration.scope });

        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60000);

        // Handle SW updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' && 
                navigator.serviceWorker.controller
              ) {
                logger.info('PWA', 'New version available');
                
                ToastService.info(
                  'Update Available',
                  'A new version is ready. Refresh to update.'
                );
              }
            });
          }
        });
      })
      .catch((error) => {
        logger.error('PWA', 'Service Worker registration failed', error);
      });

    // Reload on controller change
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
};

/**
 * Check if app is running as installed PWA
 */
export const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

/**
 * PWA install prompt management
 */
let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  logger.info('PWA', 'Install prompt available');
});

/**
 * Prompt user to install PWA
 * Must be called from user gesture (click event)
 */
export const promptPWAInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    logger.warn('PWA', 'Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  logger.info('PWA', `User ${outcome} the install prompt`);
  deferredPrompt = null;
  
  return outcome === 'accepted';
};

/**
 * Check if PWA install prompt is available
 */
export const canInstallPWA = (): boolean => {
  return deferredPrompt !== null;
};
