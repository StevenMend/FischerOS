-- ============================================
-- 004: ADD RATING + FEEDBACK TO ALL BOOKING TABLES
-- ============================================
-- Enables guests to rate restaurant, spa, and tour experiences
-- (service_requests already has rating + feedback columns)

-- Restaurant reservations
ALTER TABLE public.restaurant_reservations
  ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Spa appointments
ALTER TABLE public.spa_appointments
  ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Tour bookings
ALTER TABLE public.tour_bookings
  ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS feedback TEXT;
