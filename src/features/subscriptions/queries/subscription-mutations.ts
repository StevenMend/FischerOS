// src/features/subscriptions/queries/subscription-mutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionKeys } from './keys';
import { subscriptionsApi, CreateSubscriptionDTO, UpdateSubscriptionDTO } from '../api';
import { toast } from 'sonner';

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateSubscriptionDTO) => subscriptionsApi.createSubscription(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.property(data.property_id) });
      toast.success('Subscription created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subscription: ${error.message}`);
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubscriptionDTO }) =>
      subscriptionsApi.updateSubscription(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.property(data.property_id) });
      toast.success('Subscription updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update subscription: ${error.message}`);
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.cancelSubscription(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.property(data.property_id) });
      toast.info('Subscription cancelled');
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    },
  });
}
