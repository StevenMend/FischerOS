-- ============================================
-- PLANS TABLE — Pricing tiers for FischerOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  max_rooms INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plans_slug ON public.plans(slug);

-- ============================================
-- SEED: 3 pricing tiers
-- ============================================
INSERT INTO public.plans (id, name, slug, description, price_monthly, price_annual, max_rooms, features, display_order) VALUES
(
  '00000000-0000-0000-00f0-000000000001',
  'Starter',
  'starter',
  'Perfect for boutique hotels and small properties getting started with digital operations.',
  299.00, 2990.00, 50,
  '["Up to 50 rooms", "Guest portal & QR check-in", "3 departments", "Service requests", "Basic analytics", "Email support"]',
  1
),
(
  '00000000-0000-0000-00f0-000000000002',
  'Professional',
  'professional',
  'Full-featured platform for mid-size properties ready to modernize every department.',
  599.00, 5990.00, 200,
  '["Up to 200 rooms", "All guest features", "Unlimited departments", "Restaurant reservations", "Spa bookings", "Tour coordination", "Staff management", "Advanced analytics", "Priority support"]',
  2
),
(
  '00000000-0000-0000-00f0-000000000003',
  'Enterprise',
  'enterprise',
  'Custom solution for resort chains and large properties with advanced needs.',
  1299.00, 12990.00, 999,
  '["Unlimited rooms", "Everything in Professional", "Multi-property support", "Custom integrations", "API access", "Dedicated account manager", "SLA guarantee", "White-label option"]',
  3
)
ON CONFLICT (id) DO NOTHING;
