// src/features/subscriptions/api/types.ts

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_annual: number;
  max_rooms: number;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  property_id: string;
  plan_id: string;
  status: 'trialing' | 'active' | 'past_due' | 'cancelled';
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  plan?: Plan;
}

export interface CreateSubscriptionDTO {
  property_id: string;
  plan_id: string;
}

export interface UpdateSubscriptionDTO {
  plan_id?: string;
  status?: Subscription['status'];
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  cancelled_at?: string | null;
}
