// src/features/tours/staff/pages/ToursDashboard.tsx — Interactive Kanban
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Calendar, Users, TrendingUp, Loader2, Clock,
  User, CheckCircle, Play, AlertTriangle, Activity, Shield, FileText,
} from 'lucide-react';
import { supabase } from '../../../../lib/api/supabase';
import { useAuth } from '../../../../auth/AuthProvider';
import { ToastService } from '../../../../lib/services/toast.service';
import { useUpdateBookingStatusMutation, useCancelBookingMutation } from '../../queries/booking-mutations';

interface TourBooking {
  id: string;
  guest_name: string;
  room_number: string;
  booking_date: string;
  time_slot: string;
  adults: number;
  children: number;
  total_participants: number;
  total_price: number;
  status: string;
  skill_level: string | null;
  medical_conditions: string | null;
  emergency_contact: string | null;
  insurance_confirmed: boolean;
  waiver_signed: boolean;
  special_requests: string | null;
  created_at: string;
  tour_name: string;
}

function useToursStaffDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['tours-staff-dashboard', today],
    queryFn: async () => {
      const [bookings, weeklyBookings] = await Promise.all([
        supabase
          .from('tour_bookings')
          .select('id, guest_name, room_number, booking_date, time_slot, adults, children, total_participants, total_price, status, skill_level, medical_conditions, emergency_contact, insurance_confirmed, waiver_signed, special_requests, created_at, tours(name)')
          .eq('booking_date', today)
          .order('time_slot'),
        supabase
          .from('tour_bookings')
          .select('id', { count: 'exact', head: true })
          .gte('booking_date', weekAgo)
          .not('status', 'eq', 'cancelled'),
      ]);

      const allBookings = ((bookings.data || []) as any[]).map((b) => ({
        ...b,
        tour_name: b.tours?.name || 'Tour',
      })) as TourBooking[];

      const weeklyCount = weeklyBookings.count || 0;
      const totalGuests = allBookings.reduce((sum, b) => sum + (b.total_participants || 1), 0);

      return { allBookings, weeklyCount, totalGuests };
    },
    staleTime: 1000 * 15,
  });
}

type TabType = 'pending' | 'active' | 'completed';

export default function ToursDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useToursStaffDashboard();
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const updateStatusMutation = useUpdateBookingStatusMutation();
  const cancelMutation = useCancelBookingMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">Loading Tours...</p>
        </div>
      </div>
    );
  }

  const all = data?.allBookings || [];
  const pending = all.filter((b) => b.status === 'pending');
  const active = all.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const completed = all.filter((b) => b.status === 'completed');

  const handleConfirm = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, dto: { status: 'confirmed' } });
    } catch {
      ToastService.error('Failed to confirm booking');
    }
  };

  const handleStart = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, dto: { status: 'in_progress' } });
      ToastService.success('Tour started');
    } catch {
      ToastService.error('Failed to start tour');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, dto: { status: 'completed' } });
    } catch {
      ToastService.error('Failed to complete tour');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync({ id });
    } catch {
      ToastService.error('Failed to cancel booking');
    }
  };

  const renderBookingCard = (booking: TourBooking) => {
    const statusColors: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
      in_progress: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Progress' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    };
    const cfg = statusColors[booking.status] || statusColors.pending;

    return (
      <div
        key={booking.id}
        className="bg-white/90 backdrop-blur-xl rounded-xl p-3 sm:p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-500 font-medium">{booking.time_slot}</span>
        </div>

        {/* Guest Info */}
        <div className="mb-3 space-y-1">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="font-bold text-gray-900 text-sm">{booking.guest_name}</h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">Room {booking.room_number}</span>
          </div>
        </div>

        {/* Tour Info */}
        <div className="mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-900">{booking.tour_name}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
            <span>{booking.adults} adult{booking.adults !== 1 ? 's' : ''}</span>
            {booking.children > 0 && <span>{booking.children} child{booking.children !== 1 ? 'ren' : ''}</span>}
            <span className="font-semibold text-blue-700">${booking.total_price}</span>
          </div>
          {booking.skill_level && (
            <p className="text-xs text-blue-600 mt-1">Level: {booking.skill_level}</p>
          )}
        </div>

        {/* Safety Indicators */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
            booking.waiver_signed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <FileText className="w-3 h-3" />
            Waiver {booking.waiver_signed ? 'Signed' : 'Missing'}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
            booking.insurance_confirmed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <Shield className="w-3 h-3" />
            Insurance {booking.insurance_confirmed ? 'OK' : 'Missing'}
          </span>
        </div>

        {/* Alerts */}
        {booking.medical_conditions && (
          <div className="mb-3 p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium">Medical: {booking.medical_conditions}</p>
          </div>
        )}

        {booking.emergency_contact && (
          <p className="text-xs text-gray-500 mb-3">Emergency: {booking.emergency_contact}</p>
        )}

        {booking.special_requests && (
          <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">"{booking.special_requests}"</p>
        )}

        {/* Actions */}
        {booking.status === 'pending' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleConfirm(booking.id)}
              disabled={updateStatusMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-xs transition-all disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => handleCancel(booking.id)}
              disabled={cancelMutation.isPending}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-xs transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {booking.status === 'confirmed' && (
          <button
            onClick={() => handleStart(booking.id)}
            disabled={updateStatusMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Tour</span>
          </button>
        )}

        {booking.status === 'in_progress' && (
          <button
            onClick={() => handleComplete(booking.id)}
            disabled={updateStatusMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Complete Tour</span>
          </button>
        )}

        {booking.status === 'completed' && (
          <div className="flex items-center justify-center space-x-1 text-green-600 text-xs font-semibold py-2">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
      </div>
    );
  };

  const tabData: Record<TabType, { items: TourBooking[]; icon: typeof AlertTriangle; label: string; color: string; activeColor: string }> = {
    pending: { items: pending, icon: AlertTriangle, label: 'Pending', color: 'yellow', activeColor: 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' },
    active: { items: active, icon: Activity, label: 'Active', color: 'blue', activeColor: 'bg-blue-50 text-blue-700 border-2 border-blue-200' },
    completed: { items: completed, icon: CheckCircle, label: 'Done', color: 'green', activeColor: 'bg-green-50 text-green-700 border-2 border-green-200' },
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tours</h1>
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
            <p className="text-2xl font-bold text-blue-600">{active.length}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center border-r border-gray-200">
            <p className="text-2xl font-bold text-green-600">{completed.length}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{data?.totalGuests ?? 0}</p>
            <p className="text-xs text-gray-600">Guests</p>
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
          tabData[activeTab].items.map(renderBookingCard)
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No {activeTab} bookings</p>
          </div>
        )}
      </div>

      {/* Desktop Kanban */}
      <div className="hidden lg:block pt-2">
        <div className="grid grid-cols-3 gap-6">
          {(Object.keys(tabData) as TabType[]).map((tab) => {
            const t = tabData[tab];
            const Icon = t.icon;
            const colorMap: Record<string, { header: string; badge: string }> = {
              yellow: { header: 'from-yellow-500 to-yellow-600', badge: 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' },
              blue: { header: 'from-blue-500 to-blue-600', badge: 'bg-blue-50 text-blue-700 border-2 border-blue-200' },
              green: { header: 'from-green-500 to-green-600', badge: 'bg-green-50 text-green-700 border-2 border-green-200' },
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
                  {t.items.map(renderBookingCard)}
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
