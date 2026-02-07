// src/features/tours/api/port.ts

import {
  Tour,
  TourBooking,
  CreateTourBookingDTO,
  UpdateBookingStatusDTO,
  TourFilters,
  TourBookingStats,
  BookingRequest,
  Booking
} from './types';

export interface ToursPort {
  // Tours Catalog
  getAll(filters?: TourFilters): Promise<Tour[]>;
  getById(idOrSlug: string): Promise<Tour>;
  getByCategory(category: string): Promise<Tour[]>;
  getFeatured(): Promise<Tour[]>;

  // Bookings
  createBooking(dto: CreateTourBookingDTO): Promise<TourBooking>;
  getBookingsByGuest(guestId: string): Promise<TourBooking[]>;
  getBookingById(id: string): Promise<TourBooking>;
  updateBookingStatus(id: string, dto: UpdateBookingStatusDTO): Promise<TourBooking>;
  cancelBooking(id: string, reason?: string): Promise<TourBooking>;

  // Stats
  getBookingStats(tourId?: string): Promise<TourBookingStats>;

  // Legacy compatibility
  /** @deprecated Use getById instead */
  getByName?(name: string): Promise<Tour>;
  /** @deprecated Use createBooking with CreateTourBookingDTO */
  createLegacyBooking?(request: BookingRequest): Promise<Booking>;
}
