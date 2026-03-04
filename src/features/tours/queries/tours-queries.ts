// ============================================
// TOURS - QUERIES (Phase A.1)
// ============================================

import { useQuery } from '@tanstack/react-query';
import { createToursRepository } from '../api';
import { tourKeys } from './keys';
import type { TourFilters } from '../api/types';

const toursRepo = createToursRepository();

/**
 * Get all tours with optional filters
 */
export function useToursQuery(filters?: TourFilters) {
  return useQuery({
    queryKey: tourKeys.list(filters),
    queryFn: () => toursRepo.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single tour by ID or slug
 */
export function useTourQuery(idOrSlug: string) {
  return useQuery({
    queryKey: tourKeys.detail(idOrSlug),
    queryFn: () => toursRepo.getById(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get featured tours
 */
export function useFeaturedToursQuery() {
  return useQuery({
    queryKey: tourKeys.featured(),
    queryFn: () => toursRepo.getFeatured(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get tours by category
 */
export function useToursByCategoryQuery(category: string) {
  return useQuery({
    queryKey: tourKeys.byCategory(category),
    queryFn: () => toursRepo.getByCategory(category),
    enabled: !!category && category !== 'All',
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get bookings for current guest
 */
export function useGuestBookingsQuery(guestId: string) {
  return useQuery({
    queryKey: tourKeys.bookings.byGuest(guestId),
    queryFn: () => toursRepo.getBookingsByGuest(guestId),
    enabled: !!guestId,
  });
}

/**
 * Get single booking
 */
export function useBookingQuery(id: string) {
  return useQuery({
    queryKey: tourKeys.bookings.detail(id),
    queryFn: () => toursRepo.getBookingById(id),
    enabled: !!id,
  });
}

/**
 * Get booking statistics
 */
export function useBookingStatsQuery(tourId?: string) {
  return useQuery({
    queryKey: tourKeys.bookings.stats(tourId),
    queryFn: () => toursRepo.getBookingStats(tourId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
