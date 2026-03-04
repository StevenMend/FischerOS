// src/pages/staff/concierge/widgets/CreateRequestWidget.tsx
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/api/supabase';
import { useAuthStore } from '../../../../lib/stores/useAuthStore';
import { useTenant } from '../../../../core/tenant/TenantProvider';
import { DepartmentService } from '../../../../lib/services/department.service';
import { ToastService } from '../../../../lib/services';
import { logger } from '../../../../core/utils/logger';
import type { RequestType } from '../../../../features/service-requests/api/types';

const DEPARTMENT_OPTIONS: { label: string; type: RequestType }[] = [
  { label: 'Housekeeping', type: 'housekeeping' },
  { label: 'Maintenance', type: 'maintenance' },
  { label: 'Transportation', type: 'transportation' },
  { label: 'Dining', type: 'dining' },
  { label: 'Spa', type: 'spa' },
  { label: 'Tours', type: 'tour' },
  { label: 'General', type: 'general' },
];

export function CreateRequestWidget() {
  const session = useAuthStore((s) => s.session);
  const { property } = useTenant();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    guestName: '',
    roomNumber: '',
    department: 'general' as RequestType,
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  const handleSubmit = async () => {
    if (!form.guestName.trim() || !form.title.trim() || !form.description.trim()) {
      ToastService.error('Missing fields', 'Guest name, title and description are required');
      return;
    }

    setSubmitting(true);
    try {
      const departmentId = await DepartmentService.getDepartmentIdByType(form.department);

      const { error } = await supabase.from('service_requests').insert({
        guest_id: session?.user?.id,
        guest_name: form.guestName.trim(),
        room_number: form.roomNumber.trim() || 'Lobby',
        type: form.department,
        priority: form.priority,
        status: 'pending',
        title: form.title.trim(),
        description: form.description.trim(),
        department_id: departmentId,
        property_id: property?.id,
      });

      if (error) throw error;

      ToastService.success('Request created', `Routed to ${DEPARTMENT_OPTIONS.find((d) => d.type === form.department)?.label}`);
      setForm({ guestName: '', roomNumber: '', department: 'general', title: '', description: '', priority: 'medium' });
      logger.info('Concierge', 'Created request for guest', { dept: form.department, guest: form.guestName });
    } catch (err: any) {
      logger.error('Concierge', 'Failed to create request', err);
      ToastService.error('Failed', err.message || 'Could not create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
        <div className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-sm">Create Request for Guest</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Guest Info Row */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={form.guestName}
            onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
            placeholder="Guest name *"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="text"
            value={form.roomNumber}
            onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}
            placeholder="Room #"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Department + Priority */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value as RequestType }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {DEPARTMENT_OPTIONS.map((d) => (
              <option key={d.type} value={d.type}>
                {d.label}
              </option>
            ))}
          </select>
          <select
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Title */}
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Request title *"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Description */}
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Description *"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {submitting ? 'Creating...' : 'Create Request'}
        </button>
      </div>
    </div>
  );
}
