// src/features/billing/api/index.ts

import { isDemoMode, hasStripeKey } from '../../../config/demo-mode';
import { RemoteBillingAdapter } from './remote.adapter';
import { DemoBillingAdapter } from './demo.adapter';

export * from './types';
export * from './port';

// Use demo adapter if demo mode OR no Stripe key
export const billingApi = (isDemoMode() || !hasStripeKey())
  ? new DemoBillingAdapter()
  : new RemoteBillingAdapter();

export default billingApi;
