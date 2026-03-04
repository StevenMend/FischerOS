// src/pages/admin/settings/RestaurantSettings.tsx — CRUD restaurants
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { useAdminProperty } from '../../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  short_description: string | null;
  location: string | null;
  hours_text: string | null;
  price_range: string;
  is_active: boolean;
}

const emptyForm = {
  name: '', slug: '', cuisine: '', short_description: '', location: '',
  hours_open: '07:00', hours_close: '22:00', hours_text: '',
  dress_code: 'Smart Casual', price_range: '$$', description: '',
};

export default function RestaurantSettings() {
  const { data: property } = useAdminProperty();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ['admin', 'restaurants', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, slug, cuisine, short_description, location, hours_text, price_range, is_active')
        .eq('property_id', property!.id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!property?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, property_id: property!.id, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') };
      if (editing && editing !== 'new') {
        const { error } = await supabase.from('restaurants').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('restaurants').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success(editing === 'new' ? 'Restaurant created' : 'Restaurant updated');
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('restaurants').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success('Restaurant deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const startEdit = async (id: string) => {
    const { data } = await supabase.from('restaurants').select('*').eq('id', id).single();
    if (data) {
      setForm({
        name: data.name || '', slug: data.slug || '', cuisine: data.cuisine || '',
        short_description: data.short_description || '', location: data.location || '',
        hours_open: data.hours_open || '07:00', hours_close: data.hours_close || '22:00',
        hours_text: data.hours_text || '', dress_code: data.dress_code || 'Smart Casual',
        price_range: data.price_range || '$$', description: data.description || '',
      });
      setEditing(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{restaurants.length} restaurants</p>
        <button onClick={() => { setForm(emptyForm); setEditing('new'); }} className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark">
          <Plus className="w-4 h-4" /> Add Restaurant
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{editing === 'new' ? 'Add Restaurant' : 'Edit Restaurant'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field('Name', 'name')}
              {field('Slug', 'slug')}
              {field('Cuisine', 'cuisine')}
              {field('Price Range', 'price_range')}
              {field('Location', 'location')}
              {field('Dress Code', 'dress_code')}
              {field('Opens', 'hours_open', 'time')}
              {field('Closes', 'hours_close', 'time')}
            </div>
            <div className="mt-3">{field('Hours Text', 'hours_text')}</div>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Cuisine</th>
              <th className="pb-2 pr-4">Location</th>
              <th className="pb-2 pr-4">Hours</th>
              <th className="pb-2 pr-4">Price</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {restaurants.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-900">{r.name}</td>
                <td className="py-3 pr-4 text-gray-600">{r.cuisine}</td>
                <td className="py-3 pr-4 text-gray-600">{r.location || '—'}</td>
                <td className="py-3 pr-4 text-gray-600">{r.hours_text || '—'}</td>
                <td className="py-3 pr-4 text-gray-600">{r.price_range}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button onClick={() => startEdit(r.id)} className="p-1.5 text-gray-400 hover:text-accent"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm(`Delete ${r.name}?`)) deleteMutation.mutate(r.id); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {restaurants.length === 0 && <p className="text-center text-gray-400 py-8">No restaurants yet. Add one to get started.</p>}
    </div>
  );
}
