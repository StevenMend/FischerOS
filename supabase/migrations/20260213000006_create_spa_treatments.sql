-- ============================================
-- 006: SPA TREATMENTS (catalog)
-- ============================================

CREATE TABLE IF NOT EXISTS public.spa_treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,

  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('massage', 'facial', 'body_treatment', 'beauty', 'wellness')),
  type TEXT NOT NULL CHECK (type IN ('massage', 'treatment', 'therapy')),
  modality TEXT NOT NULL CHECK (modality IN ('individual', 'couple')),

  -- Pricing & Duration
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- minutes

  -- Media
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  thumbnail TEXT,

  -- Features
  benefits TEXT[] DEFAULT '{}',
  techniques TEXT[] DEFAULT '{}',
  recommended_for TEXT[] DEFAULT '{}',

  -- Requirements
  restrictions TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  contraindications TEXT[] DEFAULT '{}',

  -- Availability
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  available_days TEXT[] DEFAULT '{"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"}',
  available_times TEXT[] DEFAULT '{}',

  -- Metadata
  preparation_notes TEXT,
  what_to_bring TEXT,
  dress_code TEXT,
  display_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spa_treatments_property ON public.spa_treatments(property_id);
CREATE INDEX IF NOT EXISTS idx_spa_treatments_slug ON public.spa_treatments(slug);
CREATE INDEX IF NOT EXISTS idx_spa_treatments_category ON public.spa_treatments(category);
CREATE INDEX IF NOT EXISTS idx_spa_treatments_active ON public.spa_treatments(is_active);
CREATE INDEX IF NOT EXISTS idx_spa_treatments_featured ON public.spa_treatments(is_featured);
CREATE INDEX IF NOT EXISTS idx_spa_treatments_order ON public.spa_treatments(display_order);
