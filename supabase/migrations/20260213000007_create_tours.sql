-- ============================================
-- 007: TOURS (catalog)
-- ============================================

CREATE TABLE IF NOT EXISTS public.tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'challenging', 'extreme')),
  duration TEXT NOT NULL,
  duration_hours DECIMAL(5,2) NOT NULL,
  price_adult DECIMAL(10,2) NOT NULL,
  price_child DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  min_participants INTEGER DEFAULT 1,
  max_participants INTEGER DEFAULT 20,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  what_to_bring TEXT[] DEFAULT '{}',
  meeting_point TEXT NOT NULL,
  departure_times TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  requires_skill_level BOOLEAN DEFAULT false,
  requires_waiver BOOLEAN DEFAULT false,
  requires_insurance BOOLEAN DEFAULT false,
  age_restriction TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tours_property ON public.tours(property_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON public.tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_active ON public.tours(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON public.tours(is_featured);
