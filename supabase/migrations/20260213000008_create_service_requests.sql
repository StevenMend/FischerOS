-- ============================================
-- 008: SERVICE REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.staff(id) ON DELETE SET NULL,

  -- Guest info (denormalized)
  guest_name TEXT NOT NULL,
  room_number TEXT NOT NULL,

  -- Request details
  type TEXT NOT NULL CHECK (type IN ('housekeeping', 'transportation', 'concierge', 'maintenance', 'dining', 'spa', 'tour', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-progress', 'completed', 'cancelled')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,

  -- Staff info (denormalized)
  assigned_to_name TEXT,

  -- Scheduling
  scheduled_for TIMESTAMPTZ,

  -- Related booking
  related_booking_id UUID,

  -- Notes
  notes TEXT[] DEFAULT '{}',

  -- Rating
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,

  -- Flexible data
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  acknowledged_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_guest ON public.service_requests(guest_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_property ON public.service_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_department ON public.service_requests(department_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_type ON public.service_requests(type);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned ON public.service_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_requests_created ON public.service_requests(created_at DESC);
