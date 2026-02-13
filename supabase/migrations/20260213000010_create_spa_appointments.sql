-- ============================================
-- 010: SPA APPOINTMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.spa_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_id UUID NOT NULL REFERENCES public.spa_treatments(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,

  -- Guest info (denormalized)
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  room_number TEXT,

  -- Treatment info (denormalized)
  treatment_name TEXT NOT NULL,
  treatment_duration INTEGER NOT NULL, -- minutes

  -- Scheduling
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  guests INTEGER DEFAULT 1,

  -- Spa preferences
  therapist_preference TEXT CHECK (therapist_preference IN ('male', 'female', 'no_preference')),
  pressure_level TEXT CHECK (pressure_level IN ('light', 'medium', 'firm', 'deep')),
  add_ons TEXT[] DEFAULT '{}',
  aromatherapy_preference TEXT,
  music_preference TEXT,
  room_temperature TEXT,

  -- Health & Safety
  allergies TEXT[] DEFAULT '{}',
  medical_notes TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  special_requests TEXT,

  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spa_appointments_treatment ON public.spa_appointments(treatment_id);
CREATE INDEX IF NOT EXISTS idx_spa_appointments_guest ON public.spa_appointments(guest_id);
CREATE INDEX IF NOT EXISTS idx_spa_appointments_property ON public.spa_appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_spa_appointments_therapist ON public.spa_appointments(therapist_id);
CREATE INDEX IF NOT EXISTS idx_spa_appointments_date ON public.spa_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_spa_appointments_status ON public.spa_appointments(status);
