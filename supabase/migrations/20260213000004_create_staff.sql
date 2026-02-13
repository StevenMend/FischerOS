-- ============================================
-- 004: STAFF (linked to auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  restaurant_id UUID, -- FK added after restaurants table creation
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'supervisor', 'manager')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_property ON public.staff(property_id);
CREATE INDEX IF NOT EXISTS idx_staff_department ON public.staff(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_department_name ON public.staff(department);
