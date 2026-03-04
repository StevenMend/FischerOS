// src/features/subscriptions/queries/plans-queries.ts

import { useQuery } from '@tanstack/react-query';
import { planKeys } from './keys';
import { subscriptionsApi } from '../api';

export function usePlans() {
  return useQuery({
    queryKey: planKeys.lists(),
    queryFn: () => subscriptionsApi.getPlans(),
    staleTime: 5 * 60 * 1000, // Plans rarely change
  });
}

export function usePlan(slug: string) {
  return useQuery({
    queryKey: planKeys.detail(slug),
    queryFn: () => subscriptionsApi.getPlan(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
