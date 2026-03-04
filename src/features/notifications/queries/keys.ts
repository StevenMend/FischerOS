export const notificationKeys = {
  all: ['notifications'] as const,
  byUser: (userId: string) => [...notificationKeys.all, userId] as const,
  unreadCount: (userId: string) => [...notificationKeys.all, 'unread', userId] as const,
};
