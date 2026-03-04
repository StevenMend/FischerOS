import { supabase } from '../../../lib/api/supabase';
import { logger } from '../../../core/utils/logger';
import type { Notification, CreateNotificationDTO } from './types';

const DEMO_PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Fire-and-forget notification helper.
 * Fills in property_id and user_type defaults so callers only need the essentials.
 */
export function notify(params: {
  userId: string;
  userType?: 'guest' | 'staff' | 'admin';
  type?: 'info' | 'success' | 'warning' | 'error' | 'action';
  title: string;
  body: string;
  category?: string;
  relatedId?: string;
  relatedType?: string;
}) {
  notificationsRemoteAdapter
    .create({
      property_id: DEMO_PROPERTY_ID,
      user_id: params.userId,
      user_type: params.userType || 'guest',
      type: params.type || 'info',
      title: params.title,
      body: params.body,
      category: params.category || 'general',
      related_id: params.relatedId,
      related_type: params.relatedType,
    })
    .catch((err) => logger.warn('Notifications', 'Failed to send notification', { err }));
}

export const notificationsRemoteAdapter = {
  async getAll(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data || []) as Notification[];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return count || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
  },

  async create(dto: CreateNotificationDTO): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(dto)
      .select()
      .single();
    if (error) throw error;
    return data as Notification;
  },

  async delete(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    if (error) throw error;
  },

  async deleteAll(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  },
};
