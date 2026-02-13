-- ============================================
-- 020: ROW LEVEL SECURITY POLICIES
-- ============================================
-- Security model:
--   Guest: sees own data only (guest_id = auth.uid())
--   Staff: sees department-scoped data
--   Catalogs: public read for authenticated users
--   Admin: full access (handled via service_role key)
-- ============================================

-- ============================================
-- PROPERTIES (read-only for all authenticated)
-- ============================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- DEPARTMENTS (read-only for all authenticated)
-- ============================================
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- GUESTS
-- ============================================
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Guest sees only their own record
CREATE POLICY "Guests can view own profile"
  ON public.guests FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Guest can update own profile
CREATE POLICY "Guests can update own profile"
  ON public.guests FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Staff can view guests (for service context)
CREATE POLICY "Staff can view guests"
  ON public.guests FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- STAFF
-- ============================================
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Staff sees own record
CREATE POLICY "Staff can view own profile"
  ON public.staff FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Staff can see other staff in same property
CREATE POLICY "Staff can view property colleagues"
  ON public.staff FOR SELECT
  TO authenticated
  USING (
    property_id IN (SELECT property_id FROM public.staff WHERE id = auth.uid())
  );

-- ============================================
-- RESTAURANTS (public catalog)
-- ============================================
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active restaurants"
  ON public.restaurants FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Staff can view all restaurants (including inactive)
CREATE POLICY "Staff can view all restaurants"
  ON public.restaurants FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- SPA TREATMENTS (public catalog)
-- ============================================
ALTER TABLE public.spa_treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active treatments"
  ON public.spa_treatments FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Staff can view all treatments"
  ON public.spa_treatments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- TOURS (public catalog)
-- ============================================
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active tours"
  ON public.tours FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Staff can view all tours"
  ON public.tours FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- SERVICE REQUESTS
-- ============================================
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Guest sees own requests
CREATE POLICY "Guests can view own requests"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

-- Guest can create requests
CREATE POLICY "Guests can create requests"
  ON public.service_requests FOR INSERT
  TO authenticated
  WITH CHECK (guest_id = auth.uid());

-- Guest can update own pending requests (cancel, edit)
CREATE POLICY "Guests can update own pending requests"
  ON public.service_requests FOR UPDATE
  TO authenticated
  USING (guest_id = auth.uid() AND status = 'pending')
  WITH CHECK (guest_id = auth.uid());

-- Guest can rate own completed requests
CREATE POLICY "Guests can rate completed requests"
  ON public.service_requests FOR UPDATE
  TO authenticated
  USING (guest_id = auth.uid() AND status = 'completed')
  WITH CHECK (guest_id = auth.uid());

-- Staff sees requests for their department
CREATE POLICY "Staff can view department requests"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM public.staff WHERE id = auth.uid()
    )
  );

-- Staff can update requests in their department
CREATE POLICY "Staff can update department requests"
  ON public.service_requests FOR UPDATE
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM public.staff WHERE id = auth.uid()
    )
  );

-- ============================================
-- RESTAURANT RESERVATIONS
-- ============================================
ALTER TABLE public.restaurant_reservations ENABLE ROW LEVEL SECURITY;

-- Guest sees own reservations
CREATE POLICY "Guests can view own reservations"
  ON public.restaurant_reservations FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

-- Guest can create reservations
CREATE POLICY "Guests can create reservations"
  ON public.restaurant_reservations FOR INSERT
  TO authenticated
  WITH CHECK (guest_id = auth.uid());

-- Guest can cancel own pending reservations
CREATE POLICY "Guests can update own pending reservations"
  ON public.restaurant_reservations FOR UPDATE
  TO authenticated
  USING (guest_id = auth.uid() AND status = 'pending')
  WITH CHECK (guest_id = auth.uid());

-- Restaurant staff sees reservations for their restaurant
CREATE POLICY "Restaurant staff can view their reservations"
  ON public.restaurant_reservations FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.staff WHERE id = auth.uid() AND restaurant_id IS NOT NULL
    )
  );

-- Restaurant staff can update reservations
CREATE POLICY "Restaurant staff can update their reservations"
  ON public.restaurant_reservations FOR UPDATE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.staff WHERE id = auth.uid() AND restaurant_id IS NOT NULL
    )
  );

-- ============================================
-- SPA APPOINTMENTS
-- ============================================
ALTER TABLE public.spa_appointments ENABLE ROW LEVEL SECURITY;

-- Guest sees own appointments
CREATE POLICY "Guests can view own appointments"
  ON public.spa_appointments FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

-- Guest can create appointments
CREATE POLICY "Guests can create appointments"
  ON public.spa_appointments FOR INSERT
  TO authenticated
  WITH CHECK (guest_id = auth.uid());

-- Guest can cancel own pending appointments
CREATE POLICY "Guests can update own pending appointments"
  ON public.spa_appointments FOR UPDATE
  TO authenticated
  USING (guest_id = auth.uid() AND status = 'pending')
  WITH CHECK (guest_id = auth.uid());

-- Spa staff can view all appointments
CREATE POLICY "Spa staff can view appointments"
  ON public.spa_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- Spa staff can update appointments
CREATE POLICY "Spa staff can update appointments"
  ON public.spa_appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- TOUR BOOKINGS
-- ============================================
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;

-- Guest sees own bookings
CREATE POLICY "Guests can view own tour bookings"
  ON public.tour_bookings FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

-- Guest can create bookings
CREATE POLICY "Guests can create tour bookings"
  ON public.tour_bookings FOR INSERT
  TO authenticated
  WITH CHECK (guest_id = auth.uid());

-- Guest can cancel own pending bookings
CREATE POLICY "Guests can update own pending bookings"
  ON public.tour_bookings FOR UPDATE
  TO authenticated
  USING (guest_id = auth.uid() AND status = 'pending')
  WITH CHECK (guest_id = auth.uid());

-- Tours/Concierge staff can view bookings
CREATE POLICY "Tours staff can view bookings"
  ON public.tour_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      JOIN public.departments d ON s.department_id = d.id
      WHERE s.id = auth.uid()
      AND d.code IN ('TO', 'CO')
    )
  );

-- Tours staff can update bookings
CREATE POLICY "Tours staff can update bookings"
  ON public.tour_bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      JOIN public.departments d ON s.department_id = d.id
      WHERE s.id = auth.uid()
      AND d.code IN ('TO', 'CO')
    )
  );

-- ============================================
-- NOTIFICATIONS
-- ============================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users see only their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can mark own notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- AUDIT LOGS (read-only for staff/admin)
-- ============================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- DEPARTMENT METRICS (read-only for staff/admin)
-- ============================================
ALTER TABLE public.department_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view department metrics"
  ON public.department_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.staff WHERE staff.id = auth.uid())
  );

-- ============================================
-- DEMO REQUESTS (already has RLS enabled)
-- ============================================
-- demo_requests RLS already enabled in its migration
-- No user-facing policies needed (handled via edge function + service_role)
