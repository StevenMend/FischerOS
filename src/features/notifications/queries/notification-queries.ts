import { useQuery } from '@tanstack/react-query';
import { notificationKeys } from './keys';
import { notificationsRemoteAdapter } from '../api';
import { useRealtimeSubscription } from '../../../hooks/useRealtimeSubscription';

export const useNotifications = (userId: string | undefined) => {
  useRealtimeSubscription(
    `notifications-${userId}`,
    [{ table: 'notifications' }],
    [
      notificationKeys.byUser(userId || ''),
      notificationKeys.unreadCount(userId || ''),
    ],
    !!userId
  );

  return useQuery({
    queryKey: notificationKeys.byUser(userId || ''),
    queryFn: () => notificationsRemoteAdapter.getAll(userId!),
    staleTime: 60_000,
    enabled: !!userId,
  });
};

export const useUnreadCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId || ''),
    queryFn: () => notificationsRemoteAdapter.getUnreadCount(userId!),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!userId,
  });
};
