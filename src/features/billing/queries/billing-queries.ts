// src/features/billing/queries/billing-queries.ts

import { useQuery } from '@tanstack/react-query';
import { billingKeys } from './keys';
import { billingApi } from '../api';

export function useBillingInfo(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: billingKeys.info(propertyId || ''),
    queryFn: () => billingApi.getBillingInfo(propertyId!),
    enabled: !!propertyId,
    staleTime: 5 * 60_000,
  });
}

export function useInvoices(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: billingKeys.invoices(propertyId || ''),
    queryFn: () => billingApi.getInvoices(propertyId!),
    enabled: !!propertyId,
    staleTime: 5 * 60_000,
  });
}
