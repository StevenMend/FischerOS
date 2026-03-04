// src/features/subscriptions/api/remote.adapter.ts

import { SubscriptionsPort } from './port';
import { Plan, Subscription, CreateSubscriptionDTO, UpdateSubscriptionDTO } from './types';
import { supabase } from '../../../lib/api/supabase';
import { logger } from '../../../core/utils/logger';

export class RemoteSubscriptionsAdapter implements SubscriptionsPort {
  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      logger.error('Subscriptions', 'Error fetching plans', { error });
      throw error;
    }

    return (data || []).map(p => ({
      ...p,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
    }));
  }

  async getPlan(slug: string): Promise<Plan> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    return {
      ...data,
      features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || [],
    };
  }

  async getPropertySubscription(propertyId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plan:plans(*)')
      .eq('property_id', propertyId)
      .maybeSingle();

    if (error) {
      logger.error('Subscriptions', 'Error fetching subscription', { error });
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      plan: data.plan ? {
        ...data.plan,
        features: typeof data.plan.features === 'string'
          ? JSON.parse(data.plan.features)
          : data.plan.features || [],
      } : undefined,
    };
  }

  async createSubscription(dto: CreateSubscriptionDTO): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        property_id: dto.property_id,
        plan_id: dto.plan_id,
        status: 'trialing',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select('*, plan:plans(*)')
      .single();

    if (error) {
      logger.error('Subscriptions', 'Error creating subscription', { error });
      throw error;
    }

    return data as Subscription;
  }

  async updateSubscription(id: string, dto: UpdateSubscriptionDTO): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, plan:plans(*)')
      .single();

    if (error) throw error;
    return data as Subscription;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.updateSubscription(id, {
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    });
  }
}
