// src/features/billing/queries/billing-mutations.ts

import { useMutation } from '@tanstack/react-query';
import { billingApi } from '../api';
import { toast } from 'sonner';

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ propertyId, planId }: { propertyId: string; planId: string }) =>
      billingApi.createCheckoutSession(propertyId, planId),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: (propertyId: string) => billingApi.createPortalSession(propertyId),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast.error(`Portal session failed: ${error.message}`);
    },
  });
}
