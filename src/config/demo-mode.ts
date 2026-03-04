// src/config/demo-mode.ts — Demo mode detection
// When VITE_DEMO_MODE=true, billing shows toasts instead of Stripe charges
// and emails are logged to console instead of sent via SMTP.

export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

export const hasStripeKey = (): boolean => {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};
