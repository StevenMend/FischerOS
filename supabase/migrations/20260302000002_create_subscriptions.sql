-- ============================================
-- SUBSCRIPTIONS TABLE — Property billing state
-- ============================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE UNIQUE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'trialing'
    CHECK (status IN ('trialing', 'active', 'past_due', 'cancelled')),
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days'),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_property ON public.subscriptions(property_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ============================================
-- ADD onboarding flag to properties
-- ============================================
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- ============================================
-- SEED: Demo resort gets Professional trial
-- ============================================
INSERT INTO public.subscriptions (id, property_id, plan_id, status, trial_ends_at)
VALUES (
  '00000000-0000-0000-00f1-000000000001',
  '00000000-0000-0000-0000-000000000001',  -- demo-resort
  '00000000-0000-0000-00f0-000000000002',  -- Professional
  'trialing',
  now() + INTERVAL '14 days'
)
ON CONFLICT (property_id) DO NOTHING;

-- Mark demo resort onboarding as done
UPDATE public.properties
SET onboarding_completed = true
WHERE id = '00000000-0000-0000-0000-000000000001';
