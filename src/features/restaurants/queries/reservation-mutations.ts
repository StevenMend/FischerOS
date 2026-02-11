// ============================================
// RESTAURANTS - MUTATIONS (Phase B.1)
// ============================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantsApi } from '../api';
import { reservationKeys } from './keys';
import { toast } from '../../../lib/services/toast.service';
import { logger } from '../../../core/utils/logger';
import type {
  CreateRestaurantReservationDTO,
  UpdateReservationStatusDTO,
} from '../api/types';

// ========== CREATE RESERVATION ==========

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateRestaurantReservationDTO) => 
      restaurantsApi.createReservation(dto),
    
    onSuccess: (data) => {
      // Invalidate guest reservations
      queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
      
      // Invalidate stats
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.stats(data.restaurant_id) 
      });
      
      toast.success('Reservation created successfully! 🎉');
    },
    
    onError: (error: Error) => {
      logger.error('Restaurants', 'Error creating reservation', error);
      toast.error(`Failed to create reservation: ${error.message}`);
    },
  });
};

// ========== UPDATE RESERVATION STATUS ==========

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateReservationStatusDTO }) =>
      restaurantsApi.updateReservationStatus(id, dto),
    
    onSuccess: (data) => {
      // Invalidate specific reservation
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.detail(data.id) 
      });
      
      // Invalidate guest reservations list
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.list(data.guest_id) 
      });
      
      // Invalidate stats
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.stats(data.restaurant_id) 
      });
      
      toast.success(`Reservation ${data.status}! ✅`);
    },
    
    onError: (error: Error) => {
      logger.error('Restaurants', 'Error updating reservation', error);
      toast.error(`Failed to update reservation: ${error.message}`);
    },
  });
};

// ========== CANCEL RESERVATION ==========

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      restaurantsApi.cancelReservation(id, reason),
    
    onSuccess: (data) => {
      // Invalidate specific reservation
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.detail(data.id) 
      });
      
      // Invalidate guest reservations list
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.list(data.guest_id) 
      });
      
      // Invalidate stats
      queryClient.invalidateQueries({ 
        queryKey: reservationKeys.stats(data.restaurant_id) 
      });
      
      toast.success('Reservation cancelled');
    },
    
    onError: (error: Error) => {
      logger.error('Restaurants', 'Error cancelling reservation', error);
      toast.error(`Failed to cancel reservation: ${error.message}`);
    },
  });
};
