import React from 'react';
import { Activity, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';

export default function OperationsPage() {
  const today = new Date().toISOString().split('T')[0];

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin', 'operations', 'requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('id, guest_name, room_number, type, title, status, priority, created_at, assigned_to_name, departments(name)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30_000,
  });

  const { data: bookingsToday = [] } = useQuery({
    queryKey: ['admin', 'operations', 'bookings-today'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_reservations')
        .select('id, guest_name, reservation_date, time_slot, party_size, status, restaurants(name)')
        .gte('reservation_date', `${today}T00:00:00`)
        .lte('reservation_date', `${today}T23:59:59`)
        .order('time_slot');
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60_000,
  });

  const pending = requests.filter((r: any) => r.status === 'pending');
  const inProgress = requests.filter((r: any) => ['assigned', 'in-progress'].includes(r.status));
  const completed = requests.filter((r: any) => r.status === 'completed');

  const priorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in-progress': case 'assigned': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-accent">Operations Monitor</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-yellow-600"><Clock className="w-5 h-5" /><span className="text-2xl font-bold">{pending.length}</span></div>
          <p className="text-sm text-gray-600 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-blue-600"><Activity className="w-5 h-5" /><span className="text-2xl font-bold">{inProgress.length}</span></div>
          <p className="text-sm text-gray-600 mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-5 h-5" /><span className="text-2xl font-bold">{completed.length}</span></div>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-accent"><Activity className="w-5 h-5" /><span className="text-2xl font-bold">{bookingsToday.length}</span></div>
          <p className="text-sm text-gray-600 mt-1">Bookings Today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Request Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
            Live Service Requests
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {requests.slice(0, 20).map((req: any) => (
              <div key={req.id} className="px-4 py-3 hover:bg-gray-50 flex items-start gap-3">
                {statusIcon(req.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-gray-900 truncate">{req.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColor(req.priority)}`}>{req.priority}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{req.guest_name} · Room {req.room_number}</span>
                    <span>·</span>
                    <span>{(req.departments as any)?.name || req.type}</span>
                    {req.assigned_to_name && <><span>·</span><span>{req.assigned_to_name}</span></>}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(req.created_at)}</span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No service requests yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
            Today's Reservations
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {bookingsToday.map((b: any) => (
              <div key={b.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900">{b.guest_name}</span>
                  <span className="text-xs text-gray-500">{b.time_slot}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {(b.restaurants as any)?.name} · {b.party_size} guests
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
            {bookingsToday.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No reservations today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
