// src/pages/admin/settings/PropertySettings.tsx — Edit property info
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { useAdminProperty } from '../../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

export default function PropertySettings() {
  const { data: property, isLoading } = useAdminProperty();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'America/Costa_Rica',
    currency: 'USD',
  });

  useEffect(() => {
    if (property) {
      setForm({
        name: property.name || '',
        description: property.description || '',
        address: property.address || '',
        phone: property.phone || '',
        email: property.email || '',
        website: property.website || '',
        timezone: property.timezone || 'America/Costa_Rica',
        currency: property.currency || 'USD',
      });
    }
  }, [property]);

  const updateMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const { error } = await supabase
        .from('properties')
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq('id', property!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'property'] });
      toast.success('Property updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Property Name', 'name')}
        {field('Email', 'email', 'email')}
        {field('Phone', 'phone', 'tel')}
        {field('Website', 'website', 'url')}
        {field('Address', 'address')}
        {field('Timezone', 'timezone')}
        {field('Currency', 'currency')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
      >
        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Changes
      </button>
    </form>
  );
}
