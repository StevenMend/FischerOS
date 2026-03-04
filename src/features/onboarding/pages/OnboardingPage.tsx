// src/features/onboarding/pages/OnboardingPage.tsx — Multi-step onboarding wizard
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Loader2, Building2, Grid3X3, UtensilsCrossed, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { useAdminProperty } from '../../../hooks/admin/useAdminProperty';
import { useTenantNavigation } from '../../../core/tenant/useTenantNavigation';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, label: 'Property', icon: Building2 },
  { id: 2, label: 'Departments', icon: Grid3X3 },
  { id: 3, label: 'Restaurant', icon: UtensilsCrossed },
  { id: 4, label: 'Staff', icon: Users },
];

const DEFAULT_DEPARTMENTS = [
  { name: 'Front Desk', code: 'FD', enabled: true },
  { name: 'Housekeeping', code: 'HK', enabled: true },
  { name: 'Maintenance', code: 'MT', enabled: true },
  { name: 'Concierge', code: 'CO', enabled: true },
  { name: 'Food & Beverage', code: 'FB', enabled: true },
  { name: 'Spa & Wellness', code: 'SP', enabled: false },
  { name: 'Tours & Activities', code: 'TO', enabled: false },
  { name: 'Transportation', code: 'TR', enabled: false },
];

export default function OnboardingPage() {
  const { data: property, isLoading: propLoading } = useAdminProperty();
  const { slug, navigateAdmin } = useTenantNavigation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);

  // Step 1: Property details
  const [propForm, setPropForm] = useState({ name: '', description: '', phone: '', address: '' });
  React.useEffect(() => {
    if (property) {
      setPropForm({
        name: property.name || '', description: property.description || '',
        phone: property.phone || '', address: property.address || '',
      });
    }
  }, [property]);

  // Step 2: Departments
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);

  // Step 3: Restaurant
  const [restaurant, setRestaurant] = useState({ name: '', cuisine: '', hours_text: '' });

  // Step 4: Staff
  const [staffMembers, setStaffMembers] = useState([{ name: '', email: '', department: '', role: 'agent' }]);

  // Existing departments query
  const { data: existingDepts = [] } = useQuery({
    queryKey: ['onboarding', 'departments', property?.id],
    queryFn: async () => {
      const { data } = await supabase.from('departments').select('code').eq('property_id', property!.id);
      return (data || []).map((d: any) => d.code);
    },
    enabled: !!property?.id,
  });

  const savePropertyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('properties').update(propForm).eq('id', property!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'property'] });
      setStep(2);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const saveDepartmentsMutation = useMutation({
    mutationFn: async () => {
      const enabled = departments.filter(d => d.enabled && !existingDepts.includes(d.code));
      if (enabled.length > 0) {
        const { error } = await supabase.from('departments').insert(
          enabled.map(d => ({ property_id: property!.id, name: d.name, code: d.code }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'departments'] });
      setStep(3);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const saveRestaurantMutation = useMutation({
    mutationFn: async () => {
      if (!restaurant.name.trim()) return; // Skip if empty
      const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { error } = await supabase.from('restaurants').insert({
        property_id: property!.id, name: restaurant.name, slug,
        cuisine: restaurant.cuisine || 'International', hours_text: restaurant.hours_text || '',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      setStep(4);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const finishMutation = useMutation({
    mutationFn: async () => {
      // Save staff members
      const validStaff = staffMembers.filter(s => s.name.trim() && s.email.trim());
      if (validStaff.length > 0) {
        const { error } = await supabase.from('staff').insert(
          validStaff.map(s => ({
            property_id: property!.id, name: s.name, email: s.email,
            department: s.department || 'General', role: s.role,
          }))
        );
        if (error) throw error;
      }
      // Mark onboarding complete
      const { error: propError } = await supabase.from('properties').update({ onboarding_completed: true }).eq('id', property!.id);
      if (propError) throw propError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'property'] });
      toast.success('Setup complete!');
      navigateAdmin('dashboard');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (propLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  const addStaffRow = () => setStaffMembers([...staffMembers, { name: '', email: '', department: '', role: 'agent' }]);
  const updateStaff = (i: number, field: string, value: string) => {
    const updated = [...staffMembers];
    (updated[i] as any)[field] = value;
    setStaffMembers(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent mb-2">Set Up {propForm.name || 'Your Property'}</h1>
          <p className="text-sm text-gray-500">Complete these steps to get started. You can always change settings later.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                s.id < step ? 'bg-green-100 text-green-700' : s.id === step ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {s.id < step ? <Check className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-px ${s.id < step ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Step 1: Property */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input value={propForm.name} onChange={(e) => setPropForm({ ...propForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input value={propForm.phone} onChange={(e) => setPropForm({ ...propForm, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <input value={propForm.address} onChange={(e) => setPropForm({ ...propForm, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={propForm.description} onChange={(e) => setPropForm({ ...propForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <button onClick={() => savePropertyMutation.mutate()} disabled={savePropertyMutation.isPending} className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark disabled:opacity-50">
                {savePropertyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Next <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* Step 2: Departments */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">Enable Departments</h2>
              <p className="text-sm text-gray-500">Select which departments your property operates.</p>
              <div className="grid grid-cols-2 gap-3">
                {departments.map((dept, i) => (
                  <button
                    key={dept.code}
                    onClick={() => {
                      const updated = [...departments];
                      updated[i].enabled = !updated[i].enabled;
                      setDepartments(updated);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${dept.enabled ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900">{dept.name}</span>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dept.enabled ? 'border-accent bg-accent' : 'border-gray-300'}`}>
                        {dept.enabled && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{dept.code}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 px-4 py-3 border border-gray-300 rounded-xl text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => saveDepartmentsMutation.mutate()} disabled={saveDepartmentsMutation.isPending} className="flex-1 py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark disabled:opacity-50">
                  {saveDepartmentsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Next <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Restaurant */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">Add Your First Restaurant</h2>
              <p className="text-sm text-gray-500">Optional — you can add more later in Settings.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. La Terraza" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Cuisine</label>
                  <input value={restaurant.cuisine} onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. International" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hours</label>
                <input value={restaurant.hours_text} onChange={(e) => setRestaurant({ ...restaurant, hours_text: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 7:00 AM - 10:00 PM" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 px-4 py-3 border border-gray-300 rounded-xl text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => saveRestaurantMutation.mutate()} disabled={saveRestaurantMutation.isPending} className="flex-1 py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark disabled:opacity-50">
                  {saveRestaurantMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{restaurant.name.trim() ? 'Save & Next' : 'Skip'} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Staff */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">Add Staff Members</h2>
              <p className="text-sm text-gray-500">Optional — add key staff now or later from Staff Management.</p>
              {staffMembers.map((s, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  <input value={s.name} onChange={(e) => updateStaff(i, 'name', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Name" />
                  <input value={s.email} onChange={(e) => updateStaff(i, 'email', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Email" />
                  <input value={s.department} onChange={(e) => updateStaff(i, 'department', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Department" />
                  <select value={s.role} onChange={(e) => updateStaff(i, 'role', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="agent">Agent</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              ))}
              <button onClick={addStaffRow} className="text-sm text-accent font-medium hover:underline">+ Add another</button>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex items-center gap-1 px-4 py-3 border border-gray-300 rounded-xl text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => finishMutation.mutate()} disabled={finishMutation.isPending} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50">
                  {finishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finish Setup <Check className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
