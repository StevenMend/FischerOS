-- ============================================
-- RLS + ADMIN CRUD POLICIES
-- ============================================
-- Adds:
--   1. Plans RLS (public read)
--   2. Subscriptions RLS (admin of property)
--   3. Admin INSERT/UPDATE/DELETE for catalog tables
--   4. Admin CRUD for staff table
-- ============================================
-- "Admin" = staff with role='manager' in the same property
-- ============================================

-- Helper: is_property_admin(property_uuid) returns true if
-- current user is a manager in that property.
CREATE OR REPLACE FUNCTION public.is_property_admin(p_property_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = auth.uid()
      AND property_id = p_property_id
      AND role = 'manager'
      AND is_active = true
  );
$$;

-- ============================================
-- PLANS (public read for all authenticated)
-- ============================================
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
  ON public.plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Allow anon to view plans too (for pricing page before login)
CREATE POLICY "Anon can view active plans"
  ON public.plans FOR SELECT
  TO anon
  USING (is_active = true);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Admin can view their property subscription
CREATE POLICY "Admin can view property subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.is_property_admin(property_id));

-- Staff (non-admin) can also read subscription for trial banner
CREATE POLICY "Staff can view property subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    property_id IN (SELECT property_id FROM public.staff WHERE id = auth.uid())
  );

-- Admin can insert subscription (signup flow uses service_role, but keep for completeness)
CREATE POLICY "Admin can create subscription"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_property_admin(property_id));

-- Admin can update subscription (upgrade, cancel)
CREATE POLICY "Admin can update subscription"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(property_id))
  WITH CHECK (public.is_property_admin(property_id));

-- ============================================
-- ADMIN CRUD: PROPERTIES
-- ============================================
CREATE POLICY "Admin can update own property"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(id))
  WITH CHECK (public.is_property_admin(id));

-- ============================================
-- ADMIN CRUD: DEPARTMENTS
-- ============================================
CREATE POLICY "Admin can insert departments"
  ON public.departments FOR INSERT
  TO authenticated
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can update departments"
  ON public.departments FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(property_id))
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can delete departments"
  ON public.departments FOR DELETE
  TO authenticated
  USING (public.is_property_admin(property_id));

-- ============================================
-- ADMIN CRUD: RESTAURANTS
-- ============================================
CREATE POLICY "Admin can insert restaurants"
  ON public.restaurants FOR INSERT
  TO authenticated
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can update restaurants"
  ON public.restaurants FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(property_id))
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can delete restaurants"
  ON public.restaurants FOR DELETE
  TO authenticated
  USING (public.is_property_admin(property_id));

-- ============================================
-- ADMIN CRUD: SPA TREATMENTS
-- ============================================
CREATE POLICY "Admin can insert spa treatments"
  ON public.spa_treatments FOR INSERT
  TO authenticated
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can update spa treatments"
  ON public.spa_treatments FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(property_id))
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can delete spa treatments"
  ON public.spa_treatments FOR DELETE
  TO authenticated
  USING (public.is_property_admin(property_id));

-- ============================================
-- ADMIN CRUD: TOURS
-- ============================================
CREATE POLICY "Admin can insert tours"
  ON public.tours FOR INSERT
  TO authenticated
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can update tours"
  ON public.tours FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(property_id))
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can delete tours"
  ON public.tours FOR DELETE
  TO authenticated
  USING (public.is_property_admin(property_id));

-- ============================================
-- ADMIN CRUD: STAFF
-- ============================================
CREATE POLICY "Admin can insert staff"
  ON public.staff FOR INSERT
  TO authenticated
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can update staff"
  ON public.staff FOR UPDATE
  TO authenticated
  USING (public.is_property_admin(property_id))
  WITH CHECK (public.is_property_admin(property_id));

CREATE POLICY "Admin can delete staff"
  ON public.staff FOR DELETE
  TO authenticated
  USING (public.is_property_admin(property_id));

-- ============================================
-- ADMIN CRUD: SERVICE REQUESTS (all in property)
-- ============================================
CREATE POLICY "Admin can view all property requests"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM public.staff
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

CREATE POLICY "Admin can update all property requests"
  ON public.service_requests FOR UPDATE
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM public.staff
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- ADMIN: RESTAURANT RESERVATIONS
-- ============================================
CREATE POLICY "Admin can view all property reservations"
  ON public.restaurant_reservations FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM public.staff
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- ADMIN: SPA APPOINTMENTS
-- ============================================
CREATE POLICY "Admin can view all property appointments"
  ON public.spa_appointments FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM public.staff
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- ADMIN: TOUR BOOKINGS
-- ============================================
CREATE POLICY "Admin can view all property tour bookings"
  ON public.tour_bookings FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM public.staff
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- ============================================
-- NOTIFICATIONS: System can insert for any user
-- ============================================
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
