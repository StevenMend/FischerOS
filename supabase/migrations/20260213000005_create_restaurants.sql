-- ============================================
-- 005: RESTAURANTS (catalog)
-- ============================================

CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  location TEXT NOT NULL,
  hours_open TEXT NOT NULL,
  hours_close TEXT NOT NULL,
  hours_text TEXT NOT NULL,
  dress_code TEXT DEFAULT 'casual',
  atmosphere TEXT,
  price_range TEXT NOT NULL,
  avg_price_per_person DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  total_tables INTEGER DEFAULT 0,
  max_party_size INTEGER DEFAULT 10,
  cover_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  dietary_support TEXT[] DEFAULT '{}',
  accepts_walkins BOOLEAN DEFAULT true,
  reservation_required BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK from staff.restaurant_id to restaurants.id
ALTER TABLE public.staff
  ADD CONSTRAINT fk_staff_restaurant
  FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_restaurants_property ON public.restaurants(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON public.restaurants(cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON public.restaurants(is_featured);
