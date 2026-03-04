// ============================================
// RESTAURANTS PORT - Extended (Phase B.1)
// ============================================

import {
  Restaurant,
  RestaurantReservation,
  CreateRestaurantReservationDTO,
  UpdateReservationStatusDTO,
  RestaurantFilters,
  RestaurantReservationStats,
  // Legacy types
  ReservationRequest,
  Reservation
} from './types';

export interface RestaurantsPort {
  // ========== RESTAURANTS CATALOG ==========
  
  /**
   * Get all active restaurants
   */
  getAll(filters?: RestaurantFilters): Promise<Restaurant[]>;
  
  /**
   * Get restaurant by ID or slug
   */
  getById(idOrSlug: string): Promise<Restaurant>;
  
  /**
   * Get restaurants by cuisine
   */
  getByCuisine(cuisine: string): Promise<Restaurant[]>;
  
  /**
   * Get featured restaurants
   */
  getFeatured(): Promise<Restaurant[]>;
  
  // ========== RESERVATIONS ==========
  
  /**
   * Create a new restaurant reservation
   */
  createReservation(dto: CreateRestaurantReservationDTO): Promise<RestaurantReservation>;
  
  /**
   * Get reservations by guest ID
   */
  getReservationsByGuest(guestId: string): Promise<RestaurantReservation[]>;
  
  /**
   * Get reservation by ID
   */
  getReservationById(id: string): Promise<RestaurantReservation>;
  
  /**
   * Update reservation status
   */
  updateReservationStatus(id: string, dto: UpdateReservationStatusDTO): Promise<RestaurantReservation>;
  
  /**
   * Cancel reservation
   */
  cancelReservation(id: string, reason?: string): Promise<RestaurantReservation>;
  
  // ========== STATS (for admin/staff) ==========
  
  /**
   * Get reservation statistics
   */
  getReservationStats(restaurantId?: string): Promise<RestaurantReservationStats>;
  
  // ========== LEGACY COMPATIBILITY ==========
  
  /**
   * @deprecated Use getById instead
   */
  getByName?(name: string): Promise<Restaurant>;
  
  /**
   * @deprecated Use createReservation with CreateRestaurantReservationDTO
   */
  createLegacyReservation?(request: ReservationRequest): Promise<Reservation>;
}
