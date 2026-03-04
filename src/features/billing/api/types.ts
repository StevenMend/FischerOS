// src/features/billing/api/types.ts

export interface BillingInfo {
  has_payment_method: boolean;
  payment_method_last4: string | null;
  payment_method_brand: string | null;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'draft';
  description: string;
  created_at: string;
  pdf_url: string | null;
}

export interface CheckoutSessionResult {
  url: string;
}

export interface PortalSessionResult {
  url: string;
}
