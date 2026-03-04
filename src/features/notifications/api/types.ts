export interface Notification {
  id: string;
  property_id: string;
  user_id: string;
  user_type: 'guest' | 'staff' | 'admin';
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
  category: string;
  is_read: boolean;
  action_url: string | null;
  related_id: string | null;
  related_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreateNotificationDTO {
  property_id: string;
  user_id: string;
  user_type: 'guest' | 'staff' | 'admin';
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
  category: string;
  action_url?: string;
  related_id?: string;
  related_type?: string;
  metadata?: Record<string, unknown>;
}
