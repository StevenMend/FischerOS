// src/features/billing/api/demo.adapter.ts
// Demo mode: toasts instead of real Stripe calls

import { BillingPort } from './port';
import { BillingInfo, Invoice, CheckoutSessionResult, PortalSessionResult } from './types';
import { toast } from 'sonner';

export class DemoBillingAdapter implements BillingPort {
  async getBillingInfo(): Promise<BillingInfo> {
    return { has_payment_method: false, payment_method_last4: null, payment_method_brand: null };
  }

  async getInvoices(): Promise<Invoice[]> {
    return [];
  }

  async createCheckoutSession(): Promise<CheckoutSessionResult> {
    toast.info('Stripe ready — add your API key to activate payments');
    return { url: '' };
  }

  async createPortalSession(): Promise<PortalSessionResult> {
    toast.info('Stripe ready — add your API key to manage billing');
    return { url: '' };
  }
}
