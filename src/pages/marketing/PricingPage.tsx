// src/pages/marketing/PricingPage.tsx — FischerOS pricing (placeholder)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const navy = '#1a2744';
const bg = '#fafafa';
const bgWarm = '#faf8f5';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: navy }}
            >
              F
            </div>
            <span className="text-lg font-bold" style={{ color: navy }}>FischerOS</span>
          </button>
          <button
            onClick={() => navigate('/demo')}
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-2xl transition-all hover:opacity-90"
            style={{ backgroundColor: navy }}
          >
            Book a Demo
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-20 pb-16 text-center" style={{ backgroundColor: bgWarm }}>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: navy }}>
          Pricing
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Simple plans that scale with your property. No per-guest fees.
        </p>
      </section>

      {/* Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Starter', price: '$299', desc: 'Small boutique hotels', features: ['Up to 50 rooms', 'Guest portal', 'Staff dashboards', 'Basic analytics', 'Email support'] },
            { name: 'Professional', price: '$599', desc: 'Mid-size resorts', popular: true, features: ['Up to 200 rooms', 'Everything in Starter', 'Multi-department coordination', 'Advanced analytics', 'Priority support', 'Custom branding'] },
            { name: 'Enterprise', price: 'Custom', desc: 'Hotel groups & chains', features: ['Unlimited rooms', 'Everything in Professional', 'Multi-property management', 'API access & integrations', 'Dedicated account manager', 'SLA guarantees'] },
          ].map(tier => (
            <div
              key={tier.name}
              className={`bg-white rounded-[20px] p-8 flex flex-col ${tier.popular ? 'border-2 shadow-lg relative' : 'border border-gray-100 shadow-sm'}`}
              style={tier.popular ? { borderColor: navy } : undefined}
            >
              {tier.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full"
                  style={{ backgroundColor: navy }}
                >
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: navy }}>{tier.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{tier.desc}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: navy }}>{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-gray-500 text-sm">/month</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start space-x-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/demo')}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all ${tier.popular ? 'text-white hover:opacity-90' : 'border border-gray-200 hover:bg-gray-50'}`}
                style={tier.popular ? { backgroundColor: navy } : { color: navy }}
              >
                {tier.name === 'Enterprise' ? 'Contact Sales' : 'Request a Demo'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 text-center px-4">
        <p className="text-gray-500 mb-4">Not sure which plan fits?</p>
        <button
          onClick={() => navigate('/demo')}
          className="inline-flex items-center space-x-2 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:opacity-90 shadow-lg"
          style={{ backgroundColor: navy }}
        >
          <span>Book a Demo</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
