// src/features/shared/hooks/useRateBookingMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { ToastService } from '../../../lib/services';
import { logger } from '../../../core/utils/logger';

type BookingTable = 'restaurant_reservations' | 'spa_appointments' | 'tour_bookings';

interface RateBookingParams {
  table: BookingTable;
  bookingId: string;
  rating: number;
  feedback?: string;
}

export const useRateBookingMutation = (guestId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ table, bookingId, rating, feedback }: RateBookingParams) => {
      const { error } = await supabase
        .from(table)
        .update({ rating, feedback })
        .eq('id', bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-activities', guestId] });
      ToastService.success('Thank you!', 'Your feedback helps us improve');
    },
    onError: (error) => {
      logger.error('RateBooking', 'Failed to submit rating', { error });
      ToastService.error('Failed to submit rating', 'Please try again');
    },
  });
};
