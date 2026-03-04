// src/lib/services/toast.service.ts
import { toast as sonnerToast } from 'sonner';
import { logger } from '../../core/utils/logger';

/**
 * Centralized toast notification service using Sonner
 * Replaces legacy NotificationSystem.tsx
 */
export class ToastService {
  /**
   * Show success toast
   * @example ToastService.success('Request created!')
   */
  static success(message: string, description?: string) {
    return sonnerToast.success(message, {
      description,
      duration: 3000,
    });
  }

  /**
   * Show error toast
   * @example ToastService.error('Failed to create request')
   */
  static error(message: string, description?: string) {
    return sonnerToast.error(message, {
      description,
      duration: 4000,
    });
  }

  /**
   * Show loading toast
   * Returns toast ID to update/dismiss later
   * @example const id = ToastService.loading('Creating request...')
   */
  static loading(message: string) {
    return sonnerToast.loading(message);
  }

  /**
   * Show info toast
   * @example ToastService.info('Session expires in 5 minutes')
   */
  static info(message: string, description?: string) {
    return sonnerToast.info(message, {
      description,
      duration: 3000,
    });
  }

  /**
   * Show warning toast
   * @example ToastService.warning('Request already assigned')
   */
  static warning(message: string, description?: string) {
    return sonnerToast.warning(message, {
      description,
      duration: 3500,
    });
  }

  /**
   * Toast for promise-based operations
   * Automatically shows loading -> success/error
   * @example
   * ToastService.promise(
   *   createRequest(),
   *   {
   *     loading: 'Creating request...',
   *     success: 'Request created!',
   *     error: 'Failed to create request'
   *   }
   * )
   */
  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      duration: 3000,
    });
  }

  /**
   * Dismiss a specific toast
   * @example ToastService.dismiss(toastId)
   */
  static dismiss(toastId?: string | number) {
    sonnerToast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   * @example ToastService.dismissAll()
   */
  static dismissAll() {
    sonnerToast.dismiss();
  }

  /**
   * Custom toast with full control
   * @example
   * ToastService.custom(
   *   'Custom message',
   *   { duration: 5000, icon: '🎉' }
   * )
   */
  static custom(message: string, options?: any) {
    return sonnerToast(message, options);
  }
}

// ✅ NAMED EXPORTS - For convenience
export const toast = {
  success: ToastService.success,
  error: ToastService.error,
  loading: ToastService.loading,
  info: ToastService.info,
  warning: ToastService.warning,
  promise: ToastService.promise,
  dismiss: ToastService.dismiss,
  dismissAll: ToastService.dismissAll,
  custom: ToastService.custom,
};

// ✅ BACKWARD COMPATIBILITY
// Mantener la función showNotification para código legacy
// Eventualmente migrar todo a ToastService y remover esto
export const showNotification = (
  type: 'success' | 'warning' | 'error' | 'info',
  title: string,
  message: string,
  duration?: number
) => {
  logger.warn('ToastService', 'showNotification is deprecated. Use ToastService instead.');
  
  switch (type) {
    case 'success':
      return ToastService.success(title, message);
    case 'error':
      return ToastService.error(title, message);
    case 'warning':
      return ToastService.warning(title, message);
    case 'info':
      return ToastService.info(title, message);
  }
};
