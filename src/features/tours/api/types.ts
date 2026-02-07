// src/features/tours/api/types.ts

export interface Tour {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description?: string;
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  duration: string;
  duration_hours: number;
  price_adult: number;
  price_child?: number;
  currency: string;
  min_participants: number;
  max_participants: number;
  rating: number;
  review_count: number;
  image: string;
  gallery?: string[];
  includes: string[];
  excludes?: string[];
  what_to_bring?: string[];
  meeting_point: string;
  departure_times: string[];
  is_featured: boolean;
  is_active: boolean;
  requires_skill_level?: boolean;
  requires_waiver?: boolean;
  requires_insurance?: boolean;
  age_restriction?: string;
  created_at: string;
  updated_at: string;
}

export interface TourBooking {
  id: string;
  tour_id: string;
  guest_id: string;
  property_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  room_number?: string;
  booking_date: string;
  time_slot: string;
  adults: number;
  children: number;
  total_participants: number;
  price_per_adult: number;
  price_per_child: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  skill_level?: string;
  medical_conditions?: string;
  emergency_contact?: string;
  insurance_confirmed: boolean;
  waiver_signed: boolean;
  special_requests?: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  tour?: Tour;
}

export interface CreateTourBookingDTO {
  tour_id: string;
  booking_date: string;
  time_slot: string;
  adults: number;
  children?: number;
  skill_level?: string;
  medical_conditions?: string;
  emergency_contact?: string;
  insurance_confirmed?: boolean;
  waiver_signed?: boolean;
  special_requests?: string;
}

export interface UpdateBookingStatusDTO {
  status: TourBooking['status'];
  cancellation_reason?: string;
}

export interface TourFilters {
  category?: string;
  difficulty?: Tour['difficulty'];
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}

export interface TourBookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  revenue: number;
}

// Legacy types for backward compatibility
export interface BookingRequest {
  tour: string;
  guests: number;
  date: string;
  time: string;
  skillLevel?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  insurance?: boolean;
  waiverSigned?: boolean;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  tour: string;
  guests: number;
  date: string;
  time: string;
  skillLevel?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  insurance?: boolean;
  waiverSigned?: boolean;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
