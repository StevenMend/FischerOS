import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './keys';
import { notificationsRemoteAdapter, type CreateNotificationDTO } from '../api';

export const useMarkAsRead = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationsRemoteAdapter.markAsRead(notificationId),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.byUser(userId) });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(userId) });
      }
    },
  });
};

export const useMarkAllAsRead = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsRemoteAdapter.markAllAsRead(userId!),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.byUser(userId) });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(userId) });
      }
    },
  });
};

export const useCreateNotification = () => {
  return useMutation({
    mutationFn: (dto: CreateNotificationDTO) => notificationsRemoteAdapter.create(dto),
  });
};
