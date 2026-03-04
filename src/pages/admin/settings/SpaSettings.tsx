// src/pages/admin/settings/SpaSettings.tsx — CRUD spa treatments
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { useAdminProperty } from '../../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

interface SpaTreatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  duration: number;
  is_active: boolean;
  is_featured: boolean;
}

const emptyForm = {
  name: '', slug: '', category: 'massage', price: '0', duration: '60',
  short_description: '', description: '',
};

export default function SpaSettings() {
  const { data: property } = useAdminProperty();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: treatments = [], isLoading } = useQuery<SpaTreatment[]>({
    queryKey: ['admin', 'spa-treatments', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spa_treatments')
        .select('id, name, slug, category, price, duration, is_active, is_featured')
        .eq('property_id', property!.id)
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: !!property?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        short_description: form.short_description,
        description: form.description,
        property_id: property!.id,
      };
      if (editing && editing !== 'new') {
        const { error } = await supabase.from('spa_treatments').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('spa_treatments').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spa-treatments'] });
      toast.success(editing === 'new' ? 'Treatment created' : 'Treatment updated');
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('spa_treatments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spa-treatments'] });
      toast.success('Treatment deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const startEdit = async (id: string) => {
    const { data } = await supabase.from('spa_treatments').select('*').eq('id', id).single();
    if (data) {
      setForm({
        name: data.name || '', slug: data.slug || '', category: data.category || 'massage',
        price: String(data.price || 0), duration: String(data.duration || 60),
        short_description: data.short_description || '', description: data.description || '',
      });
      setEditing(id);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{treatments.length} treatments</p>
        <button onClick={() => { setForm(emptyForm); setEditing('new'); }} className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark">
          <Plus className="w-4 h-4" /> Add Treatment
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{editing === 'new' ? 'Add Treatment' : 'Edit Treatment'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field('Name', 'name')}
              {field('Slug', 'slug')}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="massage">Massage</option>
                  <option value="facial">Facial</option>
                  <option value="body_treatment">Body Treatment</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
              {field('Price ($)', 'price', 'number')}
              {field('Duration (min)', 'duration', 'number')}
            </div>
            <div className="mt-3">{field('Short Description', 'short_description')}</div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={!form.name.trim() || saveMutation.isPending} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Category</th>
              <th className="pb-2 pr-4">Price</th>
              <th className="pb-2 pr-4">Duration</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {treatments.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-900">{t.name}</td>
                <td className="py-3 pr-4 text-gray-600 capitalize">{t.category.replace('_', ' ')}</td>
                <td className="py-3 pr-4 text-gray-600">${t.price}</td>
                <td className="py-3 pr-4 text-gray-600">{t.duration} min</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button onClick={() => startEdit(t.id)} className="p-1.5 text-gray-400 hover:text-accent"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm(`Delete ${t.name}?`)) deleteMutation.mutate(t.id); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {treatments.length === 0 && <p className="text-center text-gray-400 py-8">No spa treatments yet. Add one to get started.</p>}
    </div>
  );
}
