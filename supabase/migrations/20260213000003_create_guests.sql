-- ============================================
-- 003: GUESTS (linked to auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  room_number TEXT NOT NULL,
  confirmation_code TEXT NOT NULL,
  check_in DATE,
  check_out DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'checked_out', 'cancelled')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guests_property ON public.guests(property_id);
CREATE INDEX IF NOT EXISTS idx_guests_room ON public.guests(room_number);
CREATE INDEX IF NOT EXISTS idx_guests_status ON public.guests(status);
