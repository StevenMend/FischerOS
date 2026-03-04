// ============================================
// SPA TREATMENT (Catalog)
// ============================================

export interface SpaTreatment {
  id: string;
  property_id: string | null;
  
  // Basic Info
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  
  // Categorization
  category: 'massage' | 'facial' | 'body_treatment' | 'beauty' | 'wellness';
  type: 'massage' | 'treatment' | 'therapy';
  modality: 'individual' | 'couple';
  
  // Pricing & Duration
  price: number;
  duration: number; // minutes
  
  // Media
  images: string[];
  videos: string[];
  thumbnail: string | null;
  
  // Features
  benefits: string[];
  techniques: string[];
  recommended_for: string[];
  
  // Requirements
  restrictions: string[];
  requirements: string[];
  contraindications: string[];
  
  // Availability
  is_featured: boolean;
  is_active: boolean;
  available_days: string[];
  available_times: string[];
  
  // Metadata
  preparation_notes: string | null;
  what_to_bring: string | null;
  dress_code: string | null;
  
  // SEO
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type SpaTreatmentCategory = SpaTreatment['category'];
export type SpaTreatmentType = SpaTreatment['type'];
export type SpaTreatmentModality = SpaTreatment['modality'];

// ============================================
// SPA APPOINTMENT (Booking)
// ============================================

export interface SpaAppointment {
  id: string;
  treatment_id: string;
  guest_id: string;
  property_id: string | null;
  
  // Guest Info
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  room_number: string | null;
  
  // Treatment Info (denormalized)
  treatment_name: string;
  treatment_duration: number;
  
  // Scheduling
  appointment_date: string; // Date
  time_slot: string; // Time
  guests: number;
  
  // Spa-specific preferences
  therapist_preference: 'male' | 'female' | 'no_preference' | null;
  therapist_id: string | null;
  pressure_level: 'light' | 'medium' | 'firm' | 'deep' | null;
  add_ons: string[];
  aromatherapy_preference: string | null;
  music_preference: string | null;
  room_temperature: string | null;
  
  // Health & Safety
  allergies: string[];
  medical_notes: string | null;
  
  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  special_requests: string | null;
  
  // Timestamps
  confirmed_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type SpaAppointmentStatus = SpaAppointment['status'];
export type TherapistPreference = NonNullable<SpaAppointment['therapist_preference']>;
export type PressureLevel = NonNullable<SpaAppointment['pressure_level']>;

// ============================================
// DTOs
// ============================================

export interface CreateSpaAppointmentDTO {
  treatment_id: string;
  
  // Scheduling
  appointment_date: string;
  time_slot: string;
  guests?: number;
  
  // Optional overrides (if guest wants different contact)
  guest_email?: string;
  guest_phone?: string;
  
  // Preferences
  therapist_preference?: TherapistPreference;
  pressure_level?: PressureLevel;
  add_ons?: string[];
  aromatherapy_preference?: string;
  music_preference?: string;
  room_temperature?: string;
  
  // Health
  allergies?: string[];
  medical_notes?: string;
  special_requests?: string;
}

export interface UpdateSpaAppointmentDTO {
  status?: SpaAppointmentStatus;
  therapist_id?: string;
  confirmed_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface SpaFilters {
  category?: SpaTreatmentCategory | SpaTreatmentCategory[];
  type?: SpaTreatmentType;
  modality?: SpaTreatmentModality;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  max_duration?: number;
}

export interface SpaAppointmentFilters {
  guest_id?: string;
  treatment_id?: string;
  therapist_id?: string;
  status?: SpaAppointmentStatus | SpaAppointmentStatus[];
  appointment_date?: string;
  date_from?: string;
  date_to?: string;
}