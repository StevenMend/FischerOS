// src/features/billing/api/remote.adapter.ts
// Calls Supabase edge functions that proxy to Stripe

import { BillingPort } from './port';
import { BillingInfo, Invoice, CheckoutSessionResult, PortalSessionResult } from './types';
import { supabase } from '../../../lib/api/supabase';
import { logger } from '../../../core/utils/logger';

export class RemoteBillingAdapter implements BillingPort {
  async getBillingInfo(propertyId: string): Promise<BillingInfo> {
    const { data, error } = await supabase.functions.invoke('billing-info', {
      body: { property_id: propertyId },
    });
    if (error) {
      logger.error('Billing', 'Error fetching billing info', { error });
      return { has_payment_method: false, payment_method_last4: null, payment_method_brand: null };
    }
    return data as BillingInfo;
  }

  async getInvoices(propertyId: string): Promise<Invoice[]> {
    const { data, error } = await supabase.functions.invoke('billing-invoices', {
      body: { property_id: propertyId },
    });
    if (error) {
      logger.error('Billing', 'Error fetching invoices', { error });
      return [];
    }
    return (data?.invoices || []) as Invoice[];
  }

  async createCheckoutSession(propertyId: string, planId: string): Promise<CheckoutSessionResult> {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { property_id: propertyId, plan_id: planId },
    });
    if (error) throw error;
    return data as CheckoutSessionResult;
  }

  async createPortalSession(propertyId: string): Promise<PortalSessionResult> {
    const { data, error } = await supabase.functions.invoke('stripe-portal', {
      body: { property_id: propertyId },
    });
    if (error) throw error;
    return data as PortalSessionResult;
  }
}
