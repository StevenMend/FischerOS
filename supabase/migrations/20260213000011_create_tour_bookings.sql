-- ============================================
-- 011: TOUR BOOKINGS
-- ============================================

CREATE TABLE IF NOT EXISTS public.tour_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Guest info (denormalized)
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  room_number TEXT,

  -- Booking details
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  total_participants INTEGER NOT NULL DEFAULT 1,

  -- Pricing (denormalized from tour at booking time)
  price_per_adult DECIMAL(10,2) NOT NULL,
  price_per_child DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),

  -- Requirements
  skill_level TEXT,
  medical_conditions TEXT,
  emergency_contact TEXT,
  insurance_confirmed BOOLEAN DEFAULT false,
  waiver_signed BOOLEAN DEFAULT false,
  special_requests TEXT,

  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tour_bookings_tour ON public.tour_bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_guest ON public.tour_bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_property ON public.tour_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_date ON public.tour_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_status ON public.tour_bookings(status);
