// src/features/subscriptions/hooks/useSubscription.ts

import { useMemo } from 'react';
import { usePropertySubscription } from '../queries/subscription-queries';
import { Subscription } from '../api/types';

interface SubscriptionInfo {
  subscription: Subscription | null | undefined;
  isLoading: boolean;
  isTrialing: boolean;
  isActive: boolean;
  isPastDue: boolean;
  isCancelled: boolean;
  daysRemaining: number;
  trialDaysRemaining: number;
  canUpgrade: boolean;
  planName: string;
}

export function useSubscription(propertyId: string | null | undefined): SubscriptionInfo {
  const { data: subscription, isLoading } = usePropertySubscription(propertyId);

  return useMemo(() => {
    if (!subscription) {
      return {
        subscription,
        isLoading,
        isTrialing: false,
        isActive: false,
        isPastDue: false,
        isCancelled: false,
        daysRemaining: 0,
        trialDaysRemaining: 0,
        canUpgrade: true,
        planName: 'No plan',
      };
    }

    const now = Date.now();

    const trialEnd = subscription.trial_ends_at
      ? new Date(subscription.trial_ends_at).getTime()
      : 0;
    const periodEnd = new Date(subscription.current_period_end).getTime();

    const trialDaysRemaining = subscription.trial_ends_at
      ? Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)))
      : 0;

    const daysRemaining = Math.max(0, Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24)));

    const planSlug = subscription.plan?.slug || '';
    const canUpgrade = planSlug !== 'enterprise';

    return {
      subscription,
      isLoading,
      isTrialing: subscription.status === 'trialing',
      isActive: subscription.status === 'active',
      isPastDue: subscription.status === 'past_due',
      isCancelled: subscription.status === 'cancelled',
      daysRemaining,
      trialDaysRemaining,
      canUpgrade,
      planName: subscription.plan?.name || 'Unknown',
    };
  }, [subscription, isLoading]);
}
