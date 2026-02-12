// src/pages/marketing/LandingPage.tsx — FischerOS product landing
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hotel,
  Zap,
  BarChart3,
  Globe,
  Clock,
  Users,
  Layers,
  ArrowRight,
  Check,
  MessageSquare,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

/* ── colour tokens (Tailwind arbitrary values) ─────────────────────── */
const navy = '#1a2744';
const bg = '#fafafa';
const bgWarm = '#faf8f5';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center space-x-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: navy }}
            >
              F
            </div>
            <span className="text-lg font-bold" style={{ color: navy }}>
              FischerOS
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>

          <button
            onClick={() => navigate('/demo')}
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-2xl transition-all hover:opacity-90"
            style={{ backgroundColor: navy }}
          >
            Request a Demo
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: bgWarm }}>
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Built for modern hospitality</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ color: navy }}
          >
            The Hotel<br />Operating System
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Guest experience, staff coordination, and property analytics — unified in one
            platform your entire team actually wants to use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center space-x-2 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: navy }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 font-semibold px-8 py-4 rounded-2xl text-base border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              style={{ color: navy }}
            >
              <span>See How it Works</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust bar */}
          <p className="mt-14 text-sm text-gray-400 font-medium tracking-wide uppercase">
            Trusted by boutique hotels &amp; resorts across Latin America
          </p>
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-wide uppercase text-amber-600 mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
              Hotels run on chaos
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Most properties juggle disconnected tools, lost requests, and frustrated guests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageSquare,
                title: 'Lost Guest Requests',
                desc: 'Requests on paper, WhatsApp, and email — nothing tracked, nothing measured.',
              },
              {
                icon: Users,
                title: 'Staff Silos',
                desc: 'Concierge, housekeeping, and F&B operate in isolation with no shared context.',
              },
              {
                icon: BarChart3,
                title: 'Zero Visibility',
                desc: 'Managers fly blind — no real-time data on operations or guest satisfaction.',
              },
              {
                icon: Clock,
                title: 'Slow Response Times',
                desc: 'Guests wait, follow up, and ultimately leave negative reviews.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-[20px] p-6 sm:p-8 border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: navy }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28" style={{ backgroundColor: bgWarm }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-wide uppercase text-amber-600 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
              Everything your hotel needs
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              One platform for guests, staff, and management — no more duct-taping tools together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Guest Experience App',
                desc: 'White-label mobile portal where guests browse restaurants, book tours, request services, and track everything in real time.',
                color: 'bg-blue-50',
                iconColor: 'text-blue-500',
              },
              {
                icon: Layers,
                title: 'Staff Command Center',
                desc: 'Department-specific dashboards for concierge, housekeeping, F&B, and maintenance — with live request queues and coordination tools.',
                color: 'bg-emerald-50',
                iconColor: 'text-emerald-500',
              },
              {
                icon: BarChart3,
                title: 'Property Analytics',
                desc: 'Real-time metrics on response times, guest satisfaction, revenue per service, and staff performance — all in one executive dashboard.',
                color: 'bg-violet-50',
                iconColor: 'text-violet-500',
              },
              {
                icon: Globe,
                title: 'Multi-Property Ready',
                desc: 'Manage multiple hotels from one account. Each property gets its own branded experience, staff workspace, and analytics.',
                color: 'bg-amber-50',
                iconColor: 'text-amber-500',
              },
            ].map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div
                key={title}
                className="bg-white rounded-[20px] p-8 sm:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: navy }}>{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-wide uppercase text-amber-600 mb-3">How it Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
              Live in 4 steps
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From onboarding to full operations in under a week.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Connect Your Property', desc: 'Add your hotel details, rooms, services, and branding. We help you set up.' },
              { step: '02', title: 'Invite Your Team', desc: 'Staff get role-based dashboards instantly — concierge, housekeeping, F&B, maintenance.' },
              { step: '03', title: 'Launch Guest Portal', desc: 'Guests scan a QR or visit your branded link to access the full service catalog.' },
              { step: '04', title: 'Operate & Optimize', desc: 'Track every request, measure response times, and continuously improve service.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative bg-white rounded-[20px] p-6 sm:p-8 border border-gray-100 shadow-sm">
                <span
                  className="text-5xl font-black opacity-10 absolute top-4 right-6"
                  style={{ color: navy }}
                >
                  {step}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-5"
                  style={{ backgroundColor: navy }}
                >
                  {step}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: navy }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28" style={{ backgroundColor: bgWarm }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-wide uppercase text-amber-600 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              No per-guest fees. No hidden charges. Pay for the plan that fits your property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold mb-1" style={{ color: navy }}>Starter</h3>
              <p className="text-sm text-gray-500 mb-6">For small boutique hotels</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: navy }}>$299</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Up to 50 rooms', 'Guest portal', 'Staff dashboards', 'Basic analytics', 'Email support'].map(f => (
                  <li key={f} className="flex items-start space-x-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/demo')}
                className="w-full py-3 rounded-2xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ color: navy }}
              >
                Get Started
              </button>
            </div>

            {/* Professional */}
            <div
              className="rounded-[20px] p-8 border-2 shadow-lg flex flex-col relative"
              style={{ borderColor: navy, backgroundColor: 'white' }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full"
                style={{ backgroundColor: navy }}
              >
                Most Popular
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: navy }}>Professional</h3>
              <p className="text-sm text-gray-500 mb-6">For mid-size resorts</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: navy }}>$599</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Up to 200 rooms',
                  'Everything in Starter',
                  'Multi-department coordination',
                  'Advanced analytics',
                  'Priority support',
                  'Custom branding',
                ].map(f => (
                  <li key={f} className="flex items-start space-x-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/demo')}
                className="w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: navy }}
              >
                Get Started
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold mb-1" style={{ color: navy }}>Enterprise</h3>
              <p className="text-sm text-gray-500 mb-6">For hotel groups &amp; chains</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: navy }}>Custom</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited rooms',
                  'Everything in Professional',
                  'Multi-property management',
                  'API access & integrations',
                  'Dedicated account manager',
                  'SLA guarantees',
                ].map(f => (
                  <li key={f} className="flex items-start space-x-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/demo')}
                className="w-full py-3 rounded-2xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ color: navy }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: bg }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-[20px] p-10 sm:p-14 border border-gray-100 shadow-sm">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: navy }}
            >
              <Hotel className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
              Ready to modernize your hotel?
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Join properties across Latin America that use FischerOS to deliver exceptional
              guest experiences while running tighter operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/demo')}
                className="inline-flex items-center space-x-2 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: navy }}
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center space-x-2 font-semibold px-8 py-4 rounded-2xl text-base border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                style={{ color: navy }}
              >
                <span>View Pricing</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: navy }}
            >
              F
            </div>
            <span className="text-sm font-semibold" style={{ color: navy }}>FischerOS</span>
          </div>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} FischerOS. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <a href="/pricing" className="hover:text-gray-700 transition-colors">Pricing</a>
            <a href="/demo" className="hover:text-gray-700 transition-colors">Request Demo</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
