import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, Zap, Loader2, Trash2 } from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../queries';
import { notificationsRemoteAdapter } from '../api';
import { useQueryClient } from '@tanstack/react-query';
import type { Notification } from '../api/types';

interface NotificationDropdownProps {
  userId: string;
  onClose: () => void;
}

const typeIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    case 'action': return <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />;
    default: return <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />;
  }
};

const timeAgo = (dateStr: string) => {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function NotificationDropdown({ userId, onClose }: NotificationDropdownProps) {
  const { data: notifications = [], isLoading } = useNotifications(userId);
  const markAsRead = useMarkAsRead(userId);
  const markAllAsRead = useMarkAllAsRead(userId);
  const queryClient = useQueryClient();

  const recent = notifications.slice(0, 10);
  const hasUnread = recent.some(n => !n.is_read);

  const handleClearAll = async () => {
    await notificationsRemoteAdapter.deleteAll(userId);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-[100] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
        {hasUnread && (
          <button
            onClick={() => markAllAsRead.mutate()}
            className="text-xs text-primary hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && recent.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400">
            No notifications yet
          </div>
        )}

        {recent.map((n) => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 ${
              !n.is_read ? 'bg-blue-50/40' : ''
            }`}
          >
            <div className="mt-0.5">{typeIcon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm truncate ${!n.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {n.title}
                </p>
                {!n.is_read && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
              <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Clear All Footer */}
      {recent.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <button
            onClick={handleClearAll}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}
