// src/features/subscriptions/queries/subscription-queries.ts

import { useQuery } from '@tanstack/react-query';
import { subscriptionKeys } from './keys';
import { subscriptionsApi } from '../api';

export function usePropertySubscription(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: subscriptionKeys.property(propertyId || ''),
    queryFn: () => subscriptionsApi.getPropertySubscription(propertyId!),
    enabled: !!propertyId,
    staleTime: 60_000,
  });
}
