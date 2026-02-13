-- ============================================
-- 012: NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- can be guest or staff
  user_type TEXT NOT NULL CHECK (user_type IN ('guest', 'staff', 'admin')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'action')),
  category TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  related_id UUID, -- reference to request/booking/etc
  related_type TEXT, -- 'service_request', 'reservation', 'appointment', 'booking'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_property ON public.notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
