// src/features/billing/queries/keys.ts

export const billingKeys = {
  all: ['billing'] as const,
  info: (propertyId: string) => [...billingKeys.all, 'info', propertyId] as const,
  invoices: (propertyId: string) => [...billingKeys.all, 'invoices', propertyId] as const,
};
