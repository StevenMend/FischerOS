// src/features/subscriptions/api/demo.adapter.ts
// Used when VITE_DEMO_MODE=true — returns mock data, no Supabase calls

import { SubscriptionsPort } from './port';
import { Plan, Subscription, CreateSubscriptionDTO, UpdateSubscriptionDTO } from './types';
import { toast } from 'sonner';

const DEMO_PLANS: Plan[] = [
  {
    id: 'demo-plan-1',
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for boutique hotels and small properties.',
    price_monthly: 299,
    price_annual: 2990,
    max_rooms: 50,
    features: ['Up to 50 rooms', 'Guest portal & QR check-in', '3 departments', 'Service requests', 'Basic analytics', 'Email support'],
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-plan-2',
    name: 'Professional',
    slug: 'professional',
    description: 'Full-featured platform for mid-size properties.',
    price_monthly: 599,
    price_annual: 5990,
    max_rooms: 200,
    features: ['Up to 200 rooms', 'All guest features', 'Unlimited departments', 'Restaurant reservations', 'Spa bookings', 'Tour coordination', 'Staff management', 'Advanced analytics', 'Priority support'],
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-plan-3',
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Custom solution for resort chains and large properties.',
    price_monthly: 1299,
    price_annual: 12990,
    max_rooms: 999,
    features: ['Unlimited rooms', 'Everything in Professional', 'Multi-property support', 'Custom integrations', 'API access', 'Dedicated account manager', 'SLA guarantee', 'White-label option'],
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEMO_SUBSCRIPTION: Subscription = {
  id: 'demo-sub-1',
  property_id: 'demo-property',
  plan_id: 'demo-plan-2',
  status: 'trialing',
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  stripe_customer_id: null,
  stripe_subscription_id: null,
  cancelled_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  plan: DEMO_PLANS[1],
};

export class DemoSubscriptionsAdapter implements SubscriptionsPort {
  async getPlans(): Promise<Plan[]> {
    return DEMO_PLANS;
  }

  async getPlan(slug: string): Promise<Plan> {
    const plan = DEMO_PLANS.find(p => p.slug === slug);
    if (!plan) throw new Error(`Plan not found: ${slug}`);
    return plan;
  }

  async getPropertySubscription(): Promise<Subscription> {
    return DEMO_SUBSCRIPTION;
  }

  async createSubscription(dto: CreateSubscriptionDTO): Promise<Subscription> {
    toast.success('Demo mode: Subscription created (no charge)');
    return { ...DEMO_SUBSCRIPTION, plan_id: dto.plan_id };
  }

  async updateSubscription(_id: string, dto: UpdateSubscriptionDTO): Promise<Subscription> {
    toast.success('Demo mode: Subscription updated');
    return { ...DEMO_SUBSCRIPTION, ...dto };
  }

  async cancelSubscription(): Promise<Subscription> {
    toast.info('Demo mode: Subscription cancelled');
    return { ...DEMO_SUBSCRIPTION, status: 'cancelled', cancelled_at: new Date().toISOString() };
  }
}
