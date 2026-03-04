// src/features/subscriptions/api/port.ts

import { Plan, Subscription, CreateSubscriptionDTO, UpdateSubscriptionDTO } from './types';

export interface SubscriptionsPort {
  getPlans(): Promise<Plan[]>;
  getPlan(slug: string): Promise<Plan>;
  getPropertySubscription(propertyId: string): Promise<Subscription | null>;
  createSubscription(dto: CreateSubscriptionDTO): Promise<Subscription>;
  updateSubscription(id: string, dto: UpdateSubscriptionDTO): Promise<Subscription>;
  cancelSubscription(id: string): Promise<Subscription>;
}
