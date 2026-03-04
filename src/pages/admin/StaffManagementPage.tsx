import React, { useState } from 'react';
import { Users, Plus, Pencil, Trash2, Loader2, X, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';
import { useAdminProperty } from '../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  department_id: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const emptyForm = {
  name: '', email: '', password: '', department_id: '', department: '', role: 'agent',
};

export default function StaffManagementPage() {
  const { data: property } = useAdminProperty();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const { data: staff = [], isLoading } = useQuery<StaffMember[]>({
    queryKey: ['admin', 'staff', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, email, department, department_id, role, is_active, created_at')
        .eq('property_id', property!.id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!property?.id,
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['admin', 'departments', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, code')
        .eq('property_id', property!.id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!property?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const dept = departments.find(d => d.id === form.department_id);
      if (editing === 'new') {
        // For new staff, create auth user via supabase admin (requires service_role)
        // In demo/development, we insert directly into staff table
        const { error } = await supabase.from('staff').insert({
          property_id: property!.id,
          name: form.name,
          email: form.email,
          department_id: form.department_id || null,
          department: dept?.name || form.department || 'General',
          role: form.role,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('staff').update({
          name: form.name,
          email: form.email,
          department_id: form.department_id || null,
          department: dept?.name || form.department || 'General',
          role: form.role,
        }).eq('id', editing!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });
      toast.success(editing === 'new' ? 'Staff member added' : 'Staff member updated');
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('staff').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });
      toast.success('Staff member removed');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const startEdit = (member: StaffMember) => {
    setForm({
      name: member.name,
      email: member.email,
      password: '',
      department_id: member.department_id || '',
      department: member.department || '',
      role: member.role,
    });
    setEditing(member.id);
  };

  // Stats
  const activeCount = staff.filter(s => s.is_active).length;
  const deptCounts = departments.map(d => ({
    ...d,
    count: staff.filter(s => s.department_id === d.id).length,
  }));

  // Filter
  const filtered = staff.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || s.department_id === filterDept;
    return matchesSearch && matchesDept;
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      manager: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-blue-100 text-blue-700',
      agent: 'bg-gray-100 text-gray-600',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[role] || colors.agent}`}>{role}</span>;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl lg:text-3xl font-bold text-accent">Staff Management</h1>
        <button onClick={() => { setForm(emptyForm); setEditing('new'); }} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold text-gray-900">{staff.length}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Total Staff</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <span className="text-2xl font-bold text-green-600">{activeCount}</span>
          <p className="text-sm text-gray-600 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <span className="text-2xl font-bold text-purple-600">{staff.filter(s => s.role === 'manager').length}</span>
          <p className="text-sm text-gray-600 mt-1">Managers</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <span className="text-2xl font-bold text-blue-600">{departments.length}</span>
          <p className="text-sm text-gray-600 mt-1">Departments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="all">All Departments</option>
          {deptCounts.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.count})</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{member.name}</td>
                  <td className="px-4 py-3 text-gray-600">{member.email}</td>
                  <td className="px-4 py-3 text-gray-600">{member.department}</td>
                  <td className="px-4 py-3">{roleBadge(member.role)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActiveMutation.mutate({ id: member.id, is_active: !member.is_active })}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {member.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(member)} className="p-1.5 text-gray-400 hover:text-accent"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm(`Remove ${member.name}?`)) deleteMutation.mutate(member.id); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No staff members found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{editing === 'new' ? 'Add Staff Member' : 'Edit Staff Member'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="agent">Agent</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={!form.name.trim() || !form.email.trim() || saveMutation.isPending} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
