// src/features/spa/staff/pages/SpaDashboard.tsx — Interactive Kanban
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Flower2, Calendar, Users, TrendingUp, Loader2, Clock,
  User, MapPin, CheckCircle, Play, AlertTriangle, Activity, XCircle,
} from 'lucide-react';
import { supabase } from '../../../../lib/api/supabase';
import { useAuth } from '../../../../auth/AuthProvider';
import { ToastService } from '../../../../lib/services/toast.service';
import {
  useConfirmAppointment,
  useStartAppointment,
  useCompleteAppointment,
  useCancelAppointment,
} from '../../queries/appointment-mutations';

const SPA_DEPT_ID = '00000000-0000-0000-0001-000000000005';

interface SpaAppointment {
  id: string;
  guest_name: string;
  room_number: string;
  treatment_name: string;
  treatment_duration: number;
  appointment_date: string;
  time_slot: string;
  status: string;
  therapist_preference: string | null;
  pressure_level: string | null;
  add_ons: string[] | null;
  aromatherapy_preference: string | null;
  allergies: string[] | null;
  medical_notes: string | null;
  special_requests: string | null;
  created_at: string;
}

function useSpaStaffDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['spa-staff-dashboard', today],
    queryFn: async () => {
      const [appts, therapists, weeklyCompleted] = await Promise.all([
        supabase
          .from('spa_appointments')
          .select('id, guest_name, room_number, treatment_name, treatment_duration, appointment_date, time_slot, status, therapist_preference, pressure_level, add_ons, aromatherapy_preference, allergies, medical_notes, special_requests, created_at')
          .eq('appointment_date', today)
          .order('time_slot'),
        supabase
          .from('staff')
          .select('id, name', { count: 'exact' })
          .eq('department_id', SPA_DEPT_ID)
          .eq('is_active', true),
        supabase
          .from('spa_appointments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('appointment_date', weekAgo),
      ]);

      const allAppts = (appts.data || []) as SpaAppointment[];
      const therapistList = (therapists.data || []) as { id: string; name: string }[];
      const weeklyCount = weeklyCompleted.count || 0;

      return { allAppts, therapistList, therapistCount: therapistList.length, weeklyCount };
    },
    staleTime: 1000 * 15,
  });
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
  in_progress: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Progress' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Cancelled' },
};

type TabType = 'pending' | 'active' | 'completed';

export default function SpaDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useSpaStaffDashboard();
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const confirmMutation = useConfirmAppointment();
  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const cancelMutation = useCancelAppointment();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">Loading Spa...</p>
        </div>
      </div>
    );
  }

  const allAppts = data?.allAppts || [];
  const pending = allAppts.filter((a) => a.status === 'pending');
  const active = allAppts.filter((a) => a.status === 'confirmed' || a.status === 'in_progress');
  const completed = allAppts.filter((a) => a.status === 'completed');

  const completedToday = completed.length;

  const handleConfirm = async (id: string, therapistId?: string) => {
    try {
      await confirmMutation.mutateAsync({ id, therapistId });
      ToastService.success('Appointment confirmed');
    } catch {
      ToastService.error('Failed to confirm appointment');
    }
  };

  const handleStart = async (id: string) => {
    try {
      await startMutation.mutateAsync(id);
      ToastService.success('Treatment started');
    } catch {
      ToastService.error('Failed to start treatment');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync(id);
      ToastService.success('Treatment completed');
    } catch {
      ToastService.error('Failed to complete treatment');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync({ id });
      ToastService.success('Appointment cancelled');
    } catch {
      ToastService.error('Failed to cancel appointment');
    }
  };

  const renderAppointmentCard = (appt: SpaAppointment) => {
    const cfg = statusConfig[appt.status] || statusConfig.pending;
    const hasAlerts = (appt.allergies && appt.allergies.length > 0) || appt.medical_notes;

    return (
      <div
        key={appt.id}
        className="bg-white/90 backdrop-blur-xl rounded-xl p-3 sm:p-4 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-500 font-medium">{appt.time_slot}</span>
        </div>

        {/* Guest Info */}
        <div className="mb-3 space-y-1">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="font-bold text-gray-900 text-sm">{appt.guest_name}</h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">Room {appt.room_number}</span>
          </div>
        </div>

        {/* Treatment Info */}
        <div className="mb-3 p-2.5 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-gray-900">{appt.treatment_name}</h4>
          <p className="text-xs text-gray-600">{appt.treatment_duration} min</p>
          {appt.pressure_level && (
            <p className="text-xs text-purple-600 mt-1">Pressure: {appt.pressure_level}</p>
          )}
          {appt.therapist_preference && appt.therapist_preference !== 'no_preference' && (
            <p className="text-xs text-purple-600">Therapist pref: {appt.therapist_preference}</p>
          )}
        </div>

        {/* Alerts */}
        {hasAlerts && (
          <div className="mb-3 p-2 bg-red-50 rounded-lg border border-red-200">
            {appt.allergies && appt.allergies.length > 0 && (
              <p className="text-xs text-red-700 font-medium">
                Allergies: {appt.allergies.join(', ')}
              </p>
            )}
            {appt.medical_notes && (
              <p className="text-xs text-red-600 mt-1">Medical: {appt.medical_notes}</p>
            )}
          </div>
        )}

        {/* Extras */}
        {appt.add_ons && appt.add_ons.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {appt.add_ons.map((addon) => (
              <span key={addon} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {addon}
              </span>
            ))}
          </div>
        )}

        {appt.special_requests && (
          <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">"{appt.special_requests}"</p>
        )}

        {/* Actions */}
        {appt.status === 'pending' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleConfirm(appt.id)}
              disabled={confirmMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-xs transition-all disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => handleCancel(appt.id)}
              disabled={cancelMutation.isPending}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-xs transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {appt.status === 'confirmed' && (
          <button
            onClick={() => handleStart(appt.id)}
            disabled={startMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Treatment</span>
          </button>
        )}

        {appt.status === 'in_progress' && (
          <button
            onClick={() => handleComplete(appt.id)}
            disabled={completeMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Complete Treatment</span>
          </button>
        )}

        {appt.status === 'completed' && (
          <div className="flex items-center justify-center space-x-1 text-green-600 text-xs font-semibold py-2">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
      </div>
    );
  };

  const tabData: Record<TabType, { items: SpaAppointment[]; icon: typeof AlertTriangle; label: string; color: string; activeColor: string }> = {
    pending: { items: pending, icon: AlertTriangle, label: 'Pending', color: 'yellow', activeColor: 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' },
    active: { items: active, icon: Activity, label: 'Active', color: 'purple', activeColor: 'bg-purple-50 text-purple-700 border-2 border-purple-200' },
    completed: { items: completed, icon: CheckCircle, label: 'Done', color: 'green', activeColor: 'bg-green-50 text-green-700 border-2 border-green-200' },
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <Flower2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Spa</h1>
            <p className="text-sm text-gray-500">{user?.name || 'Staff'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-bold">Live</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-2xl font-bold text-purple-600">{active.length}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center border-r border-gray-200">
            <p className="text-2xl font-bold text-green-600">{completedToday}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{data?.therapistCount ?? 0}</p>
            <p className="text-xs text-gray-600">Therapists</p>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <nav className="lg:hidden sticky top-14 bg-white border border-gray-200 rounded-xl z-30 shadow-sm mb-4">
        <div className="w-full px-4 py-3">
          <div className="flex gap-2">
            {(Object.keys(tabData) as TabType[]).map((tab) => {
              const t = tabData[tab];
              const Icon = t.icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    isActive ? t.activeColor + ' shadow-sm' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? `bg-${t.color}-500 text-white` : 'bg-gray-200 text-gray-600'
                  }`}>
                    {t.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {tabData[activeTab].items.length > 0 ? (
          tabData[activeTab].items.map(renderAppointmentCard)
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No {activeTab} appointments</p>
          </div>
        )}
      </div>

      {/* Desktop Kanban */}
      <div className="hidden lg:block pt-2">
        <div className="grid grid-cols-3 gap-6">
          {(Object.keys(tabData) as TabType[]).map((tab) => {
            const t = tabData[tab];
            const Icon = t.icon;
            const colorMap: Record<string, { header: string; badge: string; badgeText: string }> = {
              yellow: { header: 'from-yellow-500 to-yellow-600', badge: 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200', badgeText: '' },
              purple: { header: 'from-purple-500 to-purple-600', badge: 'bg-purple-50 text-purple-700 border-2 border-purple-200', badgeText: '' },
              green: { header: 'from-green-500 to-green-600', badge: 'bg-green-50 text-green-700 border-2 border-green-200', badgeText: '' },
            };
            const cm = colorMap[t.color];

            return (
              <section key={tab} className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${cm.header} rounded-xl flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{t.label}</h2>
                  </div>
                  <div className={`${cm.badge} px-4 py-1.5 rounded-xl text-sm font-bold`}>
                    {t.items.length}
                  </div>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
                  {t.items.map(renderAppointmentCard)}
                  {t.items.length === 0 && (
                    <div className="text-center py-8">
                      <Icon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No {t.label.toLowerCase()}</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
