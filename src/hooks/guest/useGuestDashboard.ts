// src/hooks/guest/useGuestDashboard.ts — Real data from Supabase
import { useMemo } from 'react';
import { useAuthStore } from '../../lib/stores/useAuthStore';
import { useGuestInfo } from './useGuestInfo';
import {
  useUnifiedActivitiesQuery,
} from '../../features/service-requests/queries/unified-activities-queries';
import { logger } from '../../core/utils/logger';
import {
  Calendar, CheckCircle, ClipboardList, Clock,
  Phone, MessageSquare, Coffee, Waves,
} from 'lucide-react';

export const useGuestDashboard = () => {
  const session = useAuthStore((s) => s.session);
  const user = session?.user;
  const userId = user?.id || '';

  // Real guest profile from `guests` table
  const { data: guestProfile, isLoading: profileLoading } = useGuestInfo();

  // Real activities from 4 Supabase tables
  const {
    data: activities = [],
    isLoading: activitiesLoading,
  } = useUnifiedActivitiesQuery(userId, !!userId);

  const isLoading = profileLoading || activitiesLoading;

  // Derive guest info from real sources
  const guestInfo = useMemo(() => ({
    name: guestProfile?.name || user?.name || 'Guest',
    room: guestProfile?.room_number || user?.room || '',
    email: guestProfile?.email || '',
    phone: guestProfile?.phone || '',
    checkIn: guestProfile?.check_in || '',
    checkOut: guestProfile?.check_out || '',
  }), [guestProfile, user]);

  // Real KPIs computed from unified activities
  const kpis = useMemo(() => {
    const active = activities.filter(
      (a) => a.status !== 'completed' && a.status !== 'cancelled'
    );
    const completed = activities.filter((a) => a.status === 'completed');
    const pending = activities.filter((a) => a.status === 'pending');

    return [
      {
        title: 'Active Bookings',
        value: String(active.length),
        trend: '',
        trendDirection: 'up' as const,
        icon: Calendar,
      },
      {
        title: 'Completed',
        value: String(completed.length),
        trend: '',
        trendDirection: 'up' as const,
        icon: CheckCircle,
      },
      {
        title: 'Total Activities',
        value: String(activities.length),
        trend: '',
        trendDirection: 'up' as const,
        icon: ClipboardList,
      },
      {
        title: 'Pending',
        value: String(pending.length),
        trend: '',
        trendDirection: 'up' as const,
        icon: Clock,
      },
    ];
  }, [activities]);

  // Loyalty — placeholder until a loyalty table exists
  const loyalty = useMemo(() => ({
    points: 0,
    tier: 'Member',
    nextTier: 'Silver',
    pointsToNext: 500,
  }), []);

  // Quick actions (static feature config)
  const quickActions = useMemo(() => [
    {
      icon: Phone,
      label: 'Call Concierge',
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      action: () => window.open('tel:+50626530001'),
      available: true,
    },
    {
      icon: MessageSquare,
      label: 'Chat Support',
      color: 'text-green-600',
      bg: 'bg-green-500/10',
      action: () => logger.debug('GuestDashboard', 'Open chat'),
      available: true,
    },
    {
      icon: Coffee,
      label: 'Room Service',
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      action: () => logger.debug('GuestDashboard', 'Room service'),
      available: true,
    },
    {
      icon: Waves,
      label: 'Pool & Beach',
      color: 'text-cyan-600',
      bg: 'bg-cyan-500/10',
      action: () => logger.debug('GuestDashboard', 'Pool info'),
      available: true,
    },
  ], []);

  return {
    guestInfo,
    kpis,
    loyalty,
    quickActions,
    isLoading,
  };
};
