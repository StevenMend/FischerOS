-- ============================================
-- 009: RESTAURANT RESERVATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS public.restaurant_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Guest info (denormalized)
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  room_number TEXT,

  -- Reservation details
  reservation_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  party_size INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),

  -- Preferences
  occasion TEXT,
  dietary_restrictions TEXT[] DEFAULT '{}',
  seating_preference TEXT,
  special_requests TEXT,
  table_number TEXT,

  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  seated_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON public.restaurant_reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guest ON public.restaurant_reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_property ON public.restaurant_reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.restaurant_reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.restaurant_reservations(status);
