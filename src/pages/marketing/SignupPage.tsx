// src/pages/marketing/SignupPage.tsx — Property signup with plan selection
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/api/supabase';
import { usePlans } from '../../features/subscriptions/queries/plans-queries';
import { toast } from 'sonner';

const navy = '#1a2744';

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan') || 'professional';
  const { data: plans = [], isLoading: plansLoading } = usePlans();

  const [step, setStep] = useState(1); // 1=plan, 2=property, 3=admin account
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [propertyForm, setPropertyForm] = useState({
    name: '', slug: '', email: '', phone: '',
  });

  const [adminForm, setAdminForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });

  // Auto-select plan from URL
  React.useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      const match = plans.find(p => p.slug === preselectedPlan) || plans[1];
      if (match) setSelectedPlanId(match.id);
    }
  }, [plans, preselectedPlan, selectedPlanId]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async () => {
    if (adminForm.password !== adminForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (adminForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminForm.email,
        password: adminForm.password,
        options: { data: { name: adminForm.name, role: 'admin' } },
      });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error('User creation failed');

      // 2. Create property
      const slug = propertyForm.slug || generateSlug(propertyForm.name);
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .insert({
          name: propertyForm.name,
          code: slug,
          email: propertyForm.email,
          phone: propertyForm.phone,
          onboarding_completed: false,
        })
        .select('id')
        .single();
      if (propError) throw propError;

      // 3. Create staff record (role=manager)
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          id: userId,
          property_id: propData.id,
          name: adminForm.name,
          email: adminForm.email,
          department: 'Management',
          role: 'manager',
        });
      if (staffError) throw staffError;

      // 4. Create subscription (trialing)
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          property_id: propData.id,
          plan_id: selectedPlanId,
          status: 'trialing',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        });
      if (subError) throw subError;

      toast.success('Account created! Redirecting to setup...');
      navigate(`/${slug}/admin/dashboard`);
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: navy }}>F</div>
            <span className="text-lg font-bold" style={{ color: navy }}>FischerOS</span>
          </button>
          <button onClick={() => navigate('/pricing')} className="text-sm text-gray-600 hover:text-gray-900">
            View Pricing
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-2 ${s <= step ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s < step ? 'bg-green-500 text-white' : s === step ? 'text-white' : 'bg-gray-200 text-gray-500'}`} style={s === step ? { backgroundColor: navy } : undefined}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{s === 1 ? 'Plan' : s === 2 ? 'Property' : 'Account'}</span>
              {s < 3 && <div className={`w-8 h-px ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {/* Step 1: Plan selection */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: navy }}>Choose your plan</h2>
              <p className="text-sm text-gray-500 mb-6">Start with a 14-day free trial. No credit card required.</p>

              {plansLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
              ) : (
                <div className="space-y-3">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${selectedPlanId === plan.id ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900">{plan.name}</span>
                          <span className="text-sm text-gray-500 ml-2">${plan.price_monthly}/mo</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlanId === plan.id ? 'border-accent' : 'border-gray-300'}`}>
                          {selectedPlanId === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedPlanId}
                className="w-full mt-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ backgroundColor: navy }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Property info */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: navy }}>Property information</h2>
              <p className="text-sm text-gray-500 mb-6">Tell us about your property.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                  <input value={propertyForm.name} onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="e.g. Hotel Tamarindo Bay" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">fischeros.com/</span>
                    <input value={propertyForm.slug} onChange={(e) => setPropertyForm({ ...propertyForm, slug: e.target.value })} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="hotel-tamarindo-bay" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={propertyForm.email} onChange={(e) => setPropertyForm({ ...propertyForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="info@hotel.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={propertyForm.phone} onChange={(e) => setPropertyForm({ ...propertyForm, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="+506 2222-0000" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!propertyForm.name.trim()}
                  className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: navy }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Admin account */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: navy }}>Create your account</h2>
              <p className="text-sm text-gray-500 mb-6">This will be the admin account for {propertyForm.name || 'your property'}.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="you@hotel.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="Min. 6 characters" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input type="password" value={adminForm.confirmPassword} onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm" placeholder="Repeat password" />
                </div>
              </div>

              {selectedPlan && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">{selectedPlan.name} — ${selectedPlan.price_monthly}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trial</span>
                    <span className="font-medium text-green-600">14 days free</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.password || submitting}
                  className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: navy }}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
