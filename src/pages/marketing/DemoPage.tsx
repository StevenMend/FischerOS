// src/pages/marketing/DemoPage.tsx — FischerOS demo request form
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, Send, CheckCircle2, Building2, Mail, User, MessageSquare, BedDouble } from 'lucide-react';
import { supabase } from '../../lib/api/supabase';
import { ToastService } from '../../lib/services/toast.service';

const navy = '#1a2744';
const bg = '#fafafa';
const bgWarm = '#faf8f5';

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'grr.la', 'temp-mail.org',
  'fakeinbox.com', 'trashmail.com', 'maildrop.cc', 'getnada.com',
  '10minutemail.com', 'mohmal.com', 'burnermail.io', 'mailsac.com',
]);

type FormData = {
  name: string;
  email: string;
  company: string;
  rooms: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

function validateForm(data: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.name.trim()) errors.name = 'Full name is required';
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  } else if (DISPOSABLE_DOMAINS.has(data.email.split('@')[1]?.toLowerCase())) {
    errors.email = 'Please use a business or personal email';
  }
  if (!data.company.trim()) errors.company = 'Company or hotel name is required';
  if (data.rooms && isNaN(Number(data.rooms))) errors.rooms = 'Must be a number';

  return errors;
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    rooms: '',
    message: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(formData);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const toastId = ToastService.loading('Sending your request...');

    try {
      const { data, error } = await supabase.functions.invoke('send-demo-request', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          company: formData.company.trim(),
          rooms: formData.rooms ? formData.rooms.trim() : undefined,
          message: formData.message.trim() || undefined,
        },
      });

      ToastService.dismiss(toastId);

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      ToastService.success('Demo request sent!', "Check your email for confirmation.");
      setSubmitted(true);
    } catch (err: any) {
      ToastService.dismiss(toastId);
      ToastService.error('Something went wrong', err?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: bg }}>
        <Nav navigate={navigate} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="bg-white rounded-[20px] p-8 sm:p-12 border border-gray-100 shadow-sm text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: '#059669' }}
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: navy }}>
              Request Received!
            </h1>
            <p className="text-gray-600 mb-2 max-w-md mx-auto leading-relaxed">
              We sent a confirmation to <strong>{formData.email}</strong>.
            </p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed text-sm">
              Our team will reach out within 24 hours to schedule your personalized demo.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <Nav navigate={navigate} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white rounded-[20px] p-8 sm:p-12 border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: navy }}
            >
              <CalendarCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: navy }}>
              Request a Demo
            </h1>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              See how FischerOS can transform your hotel operations. Fill in your details and we'll be in touch.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Field
              label="Full Name"
              icon={<User className="w-4 h-4" />}
              error={errors.name}
              required
            >
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="John Smith"
                className={inputClass(errors.name)}
              />
            </Field>

            {/* Email */}
            <Field
              label="Work Email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
            >
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="john@hotelname.com"
                className={inputClass(errors.email)}
              />
            </Field>

            {/* Company */}
            <Field
              label="Company / Hotel Name"
              icon={<Building2 className="w-4 h-4" />}
              error={errors.company}
              required
            >
              <input
                type="text"
                value={formData.company}
                onChange={e => handleChange('company', e.target.value)}
                placeholder="Grand Resort & Spa"
                className={inputClass(errors.company)}
              />
            </Field>

            {/* Rooms */}
            <Field
              label="Number of Rooms"
              icon={<BedDouble className="w-4 h-4" />}
              error={errors.rooms}
            >
              <input
                type="text"
                inputMode="numeric"
                value={formData.rooms}
                onChange={e => handleChange('rooms', e.target.value)}
                placeholder="e.g. 120"
                className={inputClass(errors.rooms)}
              />
            </Field>

            {/* Message */}
            <Field
              label="Message"
              icon={<MessageSquare className="w-4 h-4" />}
              error={errors.message}
            >
              <textarea
                value={formData.message}
                onChange={e => handleChange('message', e.target.value)}
                placeholder="Tell us about your property or any questions..."
                rows={3}
                className={inputClass(errors.message) + ' resize-none'}
              />
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 text-white font-semibold py-3.5 rounded-2xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: navy }}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request a Demo</span>
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared nav ──────────────────────────────────────────────────────
function Nav({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
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
          onClick={() => navigate('/pricing')}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
        >
          Pricing
        </button>
      </div>
    </nav>
  );
}

// ── Field wrapper ───────────────────────────────────────────────────
function Field({
  label, icon, error, required, children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 mb-1.5">
        <span className="text-gray-400">{icon}</span>
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Input style helper ──────────────────────────────────────────────
function inputClass(error?: string): string {
  return `w-full px-4 py-3 text-sm border-2 rounded-xl transition-colors bg-white focus:outline-none focus:ring-0 ${
    error
      ? 'border-red-300 focus:border-red-400'
      : 'border-gray-200 focus:border-gray-400'
  }`;
}
