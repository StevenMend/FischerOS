// src/components/admin/TrialBanner.tsx — Shows trial countdown in admin layout
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useTenantNavigation } from '../../core/tenant/useTenantNavigation';

interface TrialBannerProps {
  daysRemaining: number;
}

export default function TrialBanner({ daysRemaining }: TrialBannerProps) {
  const { navigateAdmin } = useTenantNavigation();

  const urgency = daysRemaining <= 3 ? 'bg-red-600' : daysRemaining <= 7 ? 'bg-amber-500' : 'bg-accent';

  return (
    <div className={`${urgency} text-white px-4 py-2 text-center text-sm`}>
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-4 h-4" />
        <span>
          {daysRemaining > 0
            ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left in your free trial.`
            : 'Your trial has expired.'}
        </span>
        <button
          onClick={() => navigateAdmin('billing')}
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-90"
        >
          Upgrade now <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
