// src/features/subscriptions/queries/keys.ts

export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  detail: (slug: string) => [...planKeys.all, 'detail', slug] as const,
};

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  property: (propertyId: string) => [...subscriptionKeys.all, 'property', propertyId] as const,
};
