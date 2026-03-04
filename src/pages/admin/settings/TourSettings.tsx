// src/pages/admin/settings/TourSettings.tsx — CRUD tours
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { useAdminProperty } from '../../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

interface Tour {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  price_adult: number;
  duration_hours: number;
  is_active: boolean;
  is_featured: boolean;
}

const emptyForm = {
  name: '', slug: '', category: 'Adventure', difficulty: 'easy',
  price_adult: '0', price_child: '0', duration_hours: '2',
  short_description: '', description: '', max_participants: '20',
};

export default function TourSettings() {
  const { data: property } = useAdminProperty();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ['admin', 'tours', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('id, name, slug, category, difficulty, price_adult, duration_hours, is_active, is_featured')
        .eq('property_id', property!.id)
        .order('name');
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
        difficulty: form.difficulty,
        price_adult: parseFloat(form.price_adult),
        price_child: parseFloat(form.price_child),
        duration_hours: parseFloat(form.duration_hours),
        max_participants: parseInt(form.max_participants),
        short_description: form.short_description,
        description: form.description,
        property_id: property!.id,
      };
      if (editing && editing !== 'new') {
        const { error } = await supabase.from('tours').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tours').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
      toast.success(editing === 'new' ? 'Tour created' : 'Tour updated');
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
      toast.success('Tour deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const startEdit = async (id: string) => {
    const { data } = await supabase.from('tours').select('*').eq('id', id).single();
    if (data) {
      setForm({
        name: data.name || '', slug: data.slug || '', category: data.category || 'Adventure',
        difficulty: data.difficulty || 'easy', price_adult: String(data.price_adult || 0),
        price_child: String(data.price_child || 0), duration_hours: String(data.duration_hours || 2),
        short_description: data.short_description || '', description: data.description || '',
        max_participants: String(data.max_participants || 20),
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
        <p className="text-sm text-gray-600">{tours.length} tours</p>
        <button onClick={() => { setForm(emptyForm); setEditing('new'); }} className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark">
          <Plus className="w-4 h-4" /> Add Tour
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{editing === 'new' ? 'Add Tour' : 'Edit Tour'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field('Name', 'name')}
              {field('Slug', 'slug')}
              {field('Category', 'category')}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
              {field('Adult Price ($)', 'price_adult', 'number')}
              {field('Child Price ($)', 'price_child', 'number')}
              {field('Duration (hrs)', 'duration_hours', 'number')}
              {field('Max Participants', 'max_participants', 'number')}
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
              <th className="pb-2 pr-4">Difficulty</th>
              <th className="pb-2 pr-4">Price</th>
              <th className="pb-2 pr-4">Duration</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-gray-900">{t.name}</td>
                <td className="py-3 pr-4 text-gray-600">{t.category}</td>
                <td className="py-3 pr-4 text-gray-600 capitalize">{t.difficulty}</td>
                <td className="py-3 pr-4 text-gray-600">${t.price_adult}</td>
                <td className="py-3 pr-4 text-gray-600">{t.duration_hours}h</td>
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

      {tours.length === 0 && <p className="text-center text-gray-400 py-8">No tours yet. Add one to get started.</p>}
    </div>
  );
}
