// ============================================
// RESTAURANTS - DATABASE TYPES (Phase B.1)
// ============================================

// Restaurant from database
export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  description: string;
  short_description: string | null;
  location: string;
  hours_open: string;
  hours_close: string;
  hours_text: string;
  dress_code: string;
  atmosphere: string | null;
  price_range: string;
  avg_price_per_person: number | null;
  currency: string;
  total_tables: number;
  max_party_size: number;
  cover_image: string;
  gallery: string[];
  specialties: string[];
  dietary_support: string[];
  accepts_walkins: boolean;
  reservation_required: boolean;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  property_id: string | null;
  created_at: string;
  updated_at: string;
}

// Restaurant reservation from database
export interface RestaurantReservation {
  id: string;
  restaurant_id: string;
  guest_id: string;
  property_id: string | null;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  room_number: string | null;
  reservation_date: string;
  time_slot: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  occasion: string | null;
  dietary_restrictions: string[] | null;
  seating_preference: string | null;
  special_requests: string | null;
  table_number: string | null;
  confirmed_at: string | null;
  seated_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations (cuando se hace JOIN)
  restaurant?: Restaurant;
}

// DTO for creating a reservation
export interface CreateRestaurantReservationDTO {
  restaurant_id: string;
  reservation_date: string;
  time_slot: string;
  party_size: number;
  occasion?: string;
  dietary_restrictions?: string[];
  seating_preference?: string;
  special_requests?: string;
}

// DTO for updating reservation status
export interface UpdateReservationStatusDTO {
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  table_number?: string;
  cancellation_reason?: string;
}

// Filters
export interface RestaurantFilters {
  cuisine?: string;
  priceRange?: string;
  isFeatured?: boolean;
  acceptsWalkins?: boolean;
}

// Stats for admin/staff
export interface RestaurantReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  seated: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

// Legacy types for backward compatibility
export interface ReservationRequest extends CreateRestaurantReservationDTO {
  restaurant: string; // restaurant name instead of restaurant_id
  guests: number; // party_size
  date: string;
  time: string;
}

export interface Reservation {
  id: string;
  restaurant: string;
  guests: number;
  date: string;
  time: string;
  occasion?: string;
  dietaryRestrictions?: string[];
  seatingPreference?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
