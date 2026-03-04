// ============================================
// RESTAURANTS - QUERIES (Phase B.1)
// ============================================

import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '../api';
import { restaurantKeys, reservationKeys } from './keys';
import type { RestaurantFilters } from '../api/types';

// ========== RESTAURANTS ==========

export const useRestaurants = (filters?: RestaurantFilters) => {
  return useQuery({
    queryKey: restaurantKeys.list(filters),
    queryFn: () => restaurantsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRestaurant = (idOrSlug: string) => {
  return useQuery({
    queryKey: restaurantKeys.detail(idOrSlug),
    queryFn: () => restaurantsApi.getById(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRestaurantsByCuisine = (cuisine: string) => {
  return useQuery({
    queryKey: restaurantKeys.byCuisine(cuisine),
    queryFn: () => restaurantsApi.getByCuisine(cuisine),
    enabled: !!cuisine,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedRestaurants = () => {
  return useQuery({
    queryKey: restaurantKeys.featured(),
    queryFn: () => restaurantsApi.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
};

// ========== RESERVATIONS ==========

export const useGuestReservations = (guestId: string) => {
  return useQuery({
    queryKey: reservationKeys.list(guestId),
    queryFn: () => restaurantsApi.getReservationsByGuest(guestId),
    enabled: !!guestId,
    staleTime: 1 * 60 * 1000, // 1 minute (más fresh para reservas)
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => restaurantsApi.getReservationById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useReservationStats = (restaurantId?: string) => {
  return useQuery({
    queryKey: reservationKeys.stats(restaurantId),
    queryFn: () => restaurantsApi.getReservationStats(restaurantId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
