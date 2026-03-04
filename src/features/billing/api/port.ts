// src/features/billing/api/port.ts

import { BillingInfo, Invoice, CheckoutSessionResult, PortalSessionResult } from './types';

export interface BillingPort {
  getBillingInfo(propertyId: string): Promise<BillingInfo>;
  getInvoices(propertyId: string): Promise<Invoice[]>;
  createCheckoutSession(propertyId: string, planId: string): Promise<CheckoutSessionResult>;
  createPortalSession(propertyId: string): Promise<PortalSessionResult>;
}
