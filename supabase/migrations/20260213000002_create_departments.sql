-- ============================================
-- 002: DEPARTMENTS (per property)
-- ============================================

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id, code)
);

CREATE INDEX IF NOT EXISTS idx_departments_property ON public.departments(property_id);
CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments(code);
