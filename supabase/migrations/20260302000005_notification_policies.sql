-- ============================================
-- 005: NOTIFICATION INSERT + UPDATE POLICIES
-- ============================================
-- The notifications table exists (migration 012) with RLS enabled
-- but has no INSERT or UPDATE policies, so nobody can create
-- or mark-as-read notifications.

-- Authenticated users can create notifications
CREATE POLICY "Authenticated users can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Staff can read notifications for their property
CREATE POLICY "Staff can read property notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.staff
      WHERE staff.id = auth.uid()
        AND staff.property_id = notifications.property_id
    )
  );
