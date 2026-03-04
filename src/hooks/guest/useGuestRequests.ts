// src/hooks/guest/useGuestRequests.ts - UNIFIED ACTIVITIES VERSION
import { useMemo } from 'react';
import { useAuthStore } from '../../lib/stores/useAuthStore';
import { useRateRequestMutation } from '../../features/service-requests/queries';
import { useRateBookingMutation } from '../../features/shared/hooks/useRateBookingMutation';
import {
  useUnifiedActivitiesQuery,
  type UnifiedActivity
} from '../../features/service-requests/queries/unified-activities-queries';

const TABLE_MAP: Record<string, 'restaurant_reservations' | 'spa_appointments' | 'tour_bookings'> = {
  restaurant: 'restaurant_reservations',
  spa: 'spa_appointments',
  tour: 'tour_bookings',
};

interface UseGuestRequestsResult {
  activeRequests: UnifiedActivity[];
  completedRequests: UnifiedActivity[];
  allRequests: UnifiedActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  submitRating: (requestId: string, rating: number, feedback?: string, activityType?: string) => Promise<void>;
  hasUnratedCompleted: boolean;
}

export const useGuestRequests = (): UseGuestRequestsResult => {
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?.id || '';

  const {
    data: allRequests = [],
    isLoading: loading,
    error: queryError,
    refetch
  } = useUnifiedActivitiesQuery(userId, !!userId);

  const rateMutation = useRateRequestMutation(userId);
  const rateBookingMutation = useRateBookingMutation(userId);

  const activeRequests = useMemo(
    () => allRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled'),
    [allRequests]
  );

  const completedRequests = useMemo(
    () => allRequests.filter(r => r.status === 'completed'),
    [allRequests]
  );

  // Check ALL completed items without a rating
  const hasUnratedCompleted = useMemo(
    () => completedRequests.some(r => r.rating === null || r.rating === undefined),
    [completedRequests]
  );

  const submitRating = async (requestId: string, rating: number, feedback?: string, activityType?: string) => {
    const table = activityType ? TABLE_MAP[activityType] : undefined;

    if (table) {
      // Rate a booking (restaurant, spa, tour)
      await rateBookingMutation.mutateAsync({ table, bookingId: requestId, rating, feedback });
    } else {
      // Rate a service request
      await rateMutation.mutateAsync({ requestId, rating, feedback });
    }
  };

  return {
    activeRequests,
    completedRequests,
    allRequests,
    loading,
    error: queryError?.message || null,
    refetch: async () => { await refetch(); },
    submitRating,
    hasUnratedCompleted,
  };
};
