import React from 'react';
import { Users2, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';

export default function CoordinationPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['staff', 'coordination'],
    queryFn: async () => {
      // Fetch requests with department info
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('id, status, priority, type, created_at, departments(name, code)')
        .in('status', ['pending', 'assigned', 'in-progress'])
        .order('created_at', { ascending: true });
      if (error) throw error;

      // Fetch active staff
      const { data: staff, error: staffErr } = await supabase
        .from('staff')
        .select('id, name, department, is_active')
        .eq('is_active', true);
      if (staffErr) throw staffErr;

      // Group by department
      const deptMap = new Map<string, { name: string; code: string; pending: number; active: number; staffCount: number }>();
      (requests || []).forEach((r: any) => {
        const deptName = r.departments?.name || 'Unknown';
        const deptCode = r.departments?.code || '??';
        if (!deptMap.has(deptName)) {
          deptMap.set(deptName, { name: deptName, code: deptCode, pending: 0, active: 0, staffCount: 0 });
        }
        const d = deptMap.get(deptName)!;
        if (r.status === 'pending') d.pending++;
        else d.active++;
      });

      // Count staff per dept
      (staff || []).forEach((s: any) => {
        const name = s.department || 'Unknown';
        if (!deptMap.has(name)) return;
        deptMap.get(name)!.staffCount++;
      });

      // Escalation queue: requests older than 30 minutes still pending
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const escalated = (requests || []).filter((r: any) => r.status === 'pending' && r.created_at < thirtyMinsAgo);

      return {
        departments: Array.from(deptMap.values()),
        totalOpen: (requests || []).length,
        escalated,
        activeStaff: (staff || []).length,
      };
    },
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Coordination</h1>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <span className="text-2xl font-bold text-accent">{data?.totalOpen || 0}</span>
          <p className="text-sm text-gray-600">Open Requests</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <span className="text-2xl font-bold text-red-600">{data?.escalated.length || 0}</span>
          <p className="text-sm text-gray-600">Need Attention</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <span className="text-2xl font-bold text-green-600">{data?.activeStaff || 0}</span>
          <p className="text-sm text-gray-600">Active Staff</p>
        </div>
      </div>

      {/* Department Status */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
          Department Load
        </div>
        <div className="divide-y divide-gray-100">
          {(data?.departments || []).map((dept) => (
            <div key={dept.code} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">{dept.code}</span>
                <div>
                  <p className="font-medium text-sm text-gray-900">{dept.name}</p>
                  <p className="text-xs text-gray-500">{dept.staffCount} staff</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-yellow-600"><Clock className="w-3.5 h-3.5" /> {dept.pending}</span>
                <span className="flex items-center gap-1 text-blue-600"><Users2 className="w-3.5 h-3.5" /> {dept.active}</span>
              </div>
            </div>
          ))}
          {(data?.departments || []).length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No active requests across departments</div>
          )}
        </div>
      </div>

      {/* Escalation Queue */}
      {data?.escalated && data.escalated.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200">
          <div className="px-4 py-3 border-b border-red-200 font-semibold text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Escalation Queue ({data.escalated.length})
          </div>
          <div className="divide-y divide-red-100">
            {data.escalated.map((req: any) => (
              <div key={req.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm text-gray-900">{req.type}</span>
                  <span className="text-xs text-gray-500 ml-2">{(req.departments as any)?.name}</span>
                </div>
                <span className="text-xs text-red-600">
                  {Math.round((Date.now() - new Date(req.created_at).getTime()) / 60000)}m waiting
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
