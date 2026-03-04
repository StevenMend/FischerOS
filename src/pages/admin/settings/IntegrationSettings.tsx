// src/pages/admin/settings/IntegrationSettings.tsx — Read-only integration status
import React from 'react';
import { CheckCircle2, XCircle, CreditCard, Mail, QrCode } from 'lucide-react';
import { hasStripeKey, isDemoMode } from '../../../config/demo-mode';

interface IntegrationRow {
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'not_configured' | 'demo';
  detail: string;
}

export default function IntegrationSettings() {
  const demoMode = isDemoMode();
  const stripeReady = hasStripeKey();

  const integrations: IntegrationRow[] = [
    {
      name: 'Stripe Payments',
      icon: <CreditCard className="w-5 h-5" />,
      status: stripeReady ? 'connected' : demoMode ? 'demo' : 'not_configured',
      detail: stripeReady
        ? 'Connected — processing payments'
        : demoMode
          ? 'Demo mode — billing shows toasts instead of charges'
          : 'Add VITE_STRIPE_PUBLISHABLE_KEY to activate',
    },
    {
      name: 'Email Notifications',
      icon: <Mail className="w-5 h-5" />,
      status: demoMode ? 'demo' : 'connected',
      detail: demoMode
        ? 'Demo mode — emails logged to console'
        : 'Active — sending via configured provider',
    },
    {
      name: 'QR Code System',
      icon: <QrCode className="w-5 h-5" />,
      status: 'connected',
      detail: 'Built-in — no external service needed',
    },
  ];

  const statusBadge = (status: IntegrationRow['status']) => {
    switch (status) {
      case 'connected':
        return <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-4 h-4" /> Connected</span>;
      case 'demo':
        return <span className="flex items-center gap-1 text-amber-600 text-xs font-medium"><CheckCircle2 className="w-4 h-4" /> Demo Mode</span>;
      case 'not_configured':
        return <span className="flex items-center gap-1 text-gray-400 text-xs font-medium"><XCircle className="w-4 h-4" /> Not Configured</span>;
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-gray-600">Integration status and configuration. Plug in API keys to activate services.</p>

      <div className="divide-y divide-gray-100">
        {integrations.map((integ) => (
          <div key={integ.name} className="flex items-center gap-4 py-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
              {integ.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900 text-sm">{integ.name}</span>
                {statusBadge(integ.status)}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{integ.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {demoMode && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Demo Mode Active</strong> — Set <code className="bg-amber-100 px-1 rounded">VITE_DEMO_MODE=false</code> and add API keys to enable live integrations.
          </p>
        </div>
      )}
    </div>
  );
}
