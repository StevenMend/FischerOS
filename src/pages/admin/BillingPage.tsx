import React from 'react';
import { CreditCard, ArrowUpCircle, Receipt, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useAdminProperty } from '../../hooks/admin/useAdminProperty';
import { useSubscription } from '../../features/subscriptions/hooks/useSubscription';
import { usePlans } from '../../features/subscriptions/queries/plans-queries';
import { useCreateCheckout } from '../../features/billing/queries/billing-mutations';
import { useCancelSubscription } from '../../features/subscriptions/queries/subscription-mutations';
import { toast } from 'sonner';

export default function BillingPage() {
  const { data: property } = useAdminProperty();
  const { subscription, isTrialing, isActive, isPastDue, isCancelled, trialDaysRemaining, planName, canUpgrade } = useSubscription(property?.id);
  const { data: plans = [] } = usePlans();
  const checkoutMutation = useCreateCheckout();
  const cancelMutation = useCancelSubscription();

  const statusConfig = {
    trialing: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Trial' },
    active: { icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', label: 'Active' },
    past_due: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Past Due' },
    cancelled: { icon: AlertTriangle, color: 'text-gray-500 bg-gray-50 border-gray-200', label: 'Cancelled' },
  };

  const status = subscription?.status || 'trialing';
  const config = statusConfig[status] || statusConfig.trialing;
  const StatusIcon = config.icon;

  const handleUpgrade = (planId: string) => {
    if (!property?.id) return;
    checkoutMutation.mutate({ propertyId: property.id, planId });
  };

  const handleCancel = () => {
    if (!subscription?.id) return;
    if (confirm('Are you sure you want to cancel your subscription? You will lose access at the end of the current period.')) {
      cancelMutation.mutate(subscription.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-accent">Billing</h1>

      {/* Current Subscription */}
      <div className={`rounded-xl border-2 p-6 ${config.color}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon className="w-5 h-5" />
              <span className="font-semibold text-lg">{planName} Plan</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium border">{config.label}</span>
            </div>
            {isTrialing && (
              <p className="text-sm">
                {trialDaysRemaining > 0
                  ? `${trialDaysRemaining} days remaining in your free trial`
                  : 'Your trial has expired'}
              </p>
            )}
            {isActive && <p className="text-sm">Your subscription is active and renews automatically.</p>}
            {isPastDue && <p className="text-sm">Please update your payment method to continue service.</p>}
            {isCancelled && <p className="text-sm">Your subscription has been cancelled.</p>}
          </div>
          {subscription?.plan && (
            <div className="text-right">
              <p className="text-2xl font-bold">${subscription.plan.price_monthly}</p>
              <p className="text-xs opacity-75">/month</p>
            </div>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = subscription?.plan_id === plan.id;
            return (
              <div key={plan.id} className={`rounded-xl border-2 p-5 ${isCurrent ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'}`}>
                <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price_monthly}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <button disabled className="w-full py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 cursor-default">
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={checkoutMutation.isPending}
                    className="w-full py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
                  >
                    <ArrowUpCircle className="w-4 h-4 inline mr-1" />
                    {plan.price_monthly > (subscription?.plan?.price_monthly || 0) ? 'Upgrade' : 'Switch'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Invoice History</h2>
        </div>
        <div className="text-center py-8 text-gray-400">
          <CreditCard className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">No invoices yet. Invoices will appear here once billing is active.</p>
        </div>
      </div>

      {/* Cancel subscription */}
      {(isTrialing || isActive) && (
        <div className="border-t border-gray-200 pt-6">
          <button onClick={handleCancel} disabled={cancelMutation.isPending} className="text-sm text-red-500 hover:text-red-700 underline">
            Cancel subscription
          </button>
        </div>
      )}
    </div>
  );
}
