// src/pages/admin/settings/DepartmentSettings.tsx — Toggle/add departments
import React, { useState } from 'react';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { useAdminProperty } from '../../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export default function DepartmentSettings() {
  const { data: property } = useAdminProperty();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ['admin', 'departments', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, code, is_active')
        .eq('property_id', property!.id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!property?.id,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('departments').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'departments'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('departments').insert({
        property_id: property!.id,
        name: newName.trim(),
        code: newCode.trim().toUpperCase(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'departments'] });
      toast.success('Department added');
      setNewName('');
      setNewCode('');
      setShowAdd(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'departments'] });
      toast.success('Department removed');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{departments.length} departments configured</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showAdd && (
        <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Pool Bar" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-medium text-gray-600 mb-1">Code</label>
            <input value={newCode} onChange={(e) => setNewCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="PB" maxLength={3} />
          </div>
          <button onClick={() => addMutation.mutate()} disabled={!newName.trim() || !newCode.trim() || addMutation.isPending} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {departments.map((dept) => (
          <div key={dept.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">
                {dept.code}
              </span>
              <span className="font-medium text-gray-900 text-sm">{dept.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dept.is_active}
                  onChange={() => toggleMutation.mutate({ id: dept.id, is_active: !dept.is_active })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-accent/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
              </label>
              <button onClick={() => { if (confirm(`Delete ${dept.name}?`)) deleteMutation.mutate(dept.id); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
