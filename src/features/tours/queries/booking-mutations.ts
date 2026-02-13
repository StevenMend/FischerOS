// ============================================
// TOURS - BOOKING MUTATIONS (Phase A.1)
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createToursRepository } from '../api';
import { tourKeys } from './keys';
import { ToastService } from '../../../lib/services/toast.service';
import { logger } from '../../../core/utils/logger';
import type { 
  CreateTourBookingDTO, 
  UpdateBookingStatusDTO,
  TourBooking 
} from '../api/types';

const toursRepo = createToursRepository();

/**
 * Create tour booking mutation
 */
export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateTourBookingDTO) => toursRepo.createBooking(dto),
    
    onMutate: async (dto) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: tourKeys.bookings.lists() });
      
      // Show optimistic toast
      ToastService.info('Creating booking...');
      
      return { dto };
    },
    
    onSuccess: (newBooking, variables, context) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.stats() });
      
      // Show success toast
      ToastService.success('Booking created successfully! 🎉');
    },
    
    onError: (error, variables, context) => {
      logger.error('Tours', 'Booking creation failed', error);
      ToastService.error(`Failed to create booking: ${error.message}`);
    },
  });
}

/**
 * Update booking status mutation
 */
export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBookingStatusDTO }) =>
      toursRepo.updateBookingStatus(id, dto),
    
    onMutate: async ({ id, dto }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: tourKeys.bookings.detail(id) });
      
      // Snapshot previous value
      const previousBooking = queryClient.getQueryData<TourBooking>(
        tourKeys.bookings.detail(id)
      );
      
      // Optimistically update
      if (previousBooking) {
        queryClient.setQueryData<TourBooking>(
          tourKeys.bookings.detail(id),
          {
            ...previousBooking,
            status: dto.status,
            updated_at: new Date().toISOString(),
          }
        );
      }
      
      return { previousBooking };
    },
    
    onSuccess: (updatedBooking) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.stats() });
      
      ToastService.success(`Booking ${updatedBooking.status}! ✅`);
    },
    
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousBooking) {
        queryClient.setQueryData(
          tourKeys.bookings.detail(id),
          context.previousBooking
        );
      }
      
      ToastService.error(`Failed to update booking: ${error.message}`);
    },
    
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.detail(id) });
    },
  });
}

/**
 * Cancel booking mutation
 */
export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      toursRepo.cancelBooking(id, reason),
    
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: tourKeys.bookings.detail(id) });
      
      const previousBooking = queryClient.getQueryData<TourBooking>(
        tourKeys.bookings.detail(id)
      );
      
      // Optimistically update to cancelled
      if (previousBooking) {
        queryClient.setQueryData<TourBooking>(
          tourKeys.bookings.detail(id),
          {
            ...previousBooking,
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          }
        );
      }
      
      ToastService.info('Cancelling booking...');
      
      return { previousBooking };
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.stats() });
      
      ToastService.success('Booking cancelled successfully');
    },
    
    onError: (error, { id }, context) => {
      if (context?.previousBooking) {
        queryClient.setQueryData(
          tourKeys.bookings.detail(id),
          context.previousBooking
        );
      }
      
      ToastService.error(`Failed to cancel booking: ${error.message}`);
    },
    
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.bookings.detail(id) });
    },
  });
}
