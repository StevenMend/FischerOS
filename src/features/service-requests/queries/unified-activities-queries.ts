// src/features/service-requests/queries/unified-activities-queries.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/api/supabase';
import { logger } from '../../../core/utils/logger';

export type ActivityType = 'service_request' | 'restaurant' | 'tour' | 'spa';

export interface UnifiedActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  metadata: {
    priority?: string;
    department?: string;
    assigned_to?: string;
    restaurant_name?: string;
    reservation_date?: string;
    time_slot?: string;
    party_size?: number;
    occasion?: string;
    tour_name?: string;
    booking_date?: string;
    adults?: number;
    children?: number;
    total_price?: number;
    treatment_name?: string;
    appointment_date?: string;
    guests?: number;
    therapist_preference?: string;
  };
  rating?: number | null;
  rating_feedback?: string | null;
}

function transformServiceRequest(req: any): UnifiedActivity {
  return {
    id: req.id,
    type: 'service_request',
    title: req.title,
    description: req.description,
    status: req.status,
    created_at: req.created_at,
    updated_at: req.updated_at,
    rating: req.rating,
    rating_feedback: req.rating_feedback,
    metadata: {
      priority: req.priority,
      department: req.department_code || req.type,
      assigned_to: req.assigned_to_name,
    }
  };
}

function transformRestaurantReservation(res: any): UnifiedActivity {
  return {
    id: res.id,
    type: 'restaurant',
    title: `Reservation at ${res.restaurants?.name || 'Restaurant'}`,
    description: `${res.party_size} guests on ${res.reservation_date} at ${res.time_slot}`,
    status: res.status,
    created_at: res.created_at,
    updated_at: res.updated_at,
    metadata: {
      restaurant_name: res.restaurants?.name,
      reservation_date: res.reservation_date,
      time_slot: res.time_slot,
      party_size: res.party_size,
      occasion: res.occasion,
    }
  };
}

function transformTourBooking(booking: any): UnifiedActivity {
  return {
    id: booking.id,
    type: 'tour',
    title: `Tour: ${booking.tours?.name || 'Tour Booking'}`,
    description: `${booking.total_participants} participants on ${booking.booking_date}`,
    status: booking.status,
    created_at: booking.created_at,
    updated_at: booking.updated_at,
    metadata: {
      tour_name: booking.tours?.name,
      booking_date: booking.booking_date,
      time_slot: booking.time_slot,
      adults: booking.adults,
      children: booking.children,
      total_price: booking.total_price,
    }
  };
}

function transformSpaAppointment(appt: any): UnifiedActivity {
  return {
    id: appt.id,
    type: 'spa',
    title: `Spa: ${appt.treatment_name}`,
    description: `${appt.guests} guest(s) on ${appt.appointment_date} at ${appt.time_slot}`,
    status: appt.status,
    created_at: appt.created_at,
    updated_at: appt.updated_at,
    metadata: {
      treatment_name: appt.treatment_name,
      appointment_date: appt.appointment_date,
      time_slot: appt.time_slot,
      guests: appt.guests,
      therapist_preference: appt.therapist_preference,
    }
  };
}

async function fetchUnifiedActivities(guestId: string): Promise<UnifiedActivity[]> {
  logger.debug('ServiceRequests', 'Fetching unified activities for guest', { guestId });

  const [serviceRequestsRes, restaurantReservationsRes, tourBookingsRes, spaAppointmentsRes] = await Promise.all([
    supabase.from('service_requests').select('*').eq('guest_id', guestId).order('created_at', { ascending: false }),
    supabase.from('restaurant_reservations').select('*, restaurants(name)').eq('guest_id', guestId).order('created_at', { ascending: false }),
    supabase.from('tour_bookings').select('*, tours(name, category)').eq('guest_id', guestId).order('created_at', { ascending: false }),
    supabase.from('spa_appointments').select('*').eq('guest_id', guestId).order('created_at', { ascending: false })
  ]);

  if (serviceRequestsRes.error) throw serviceRequestsRes.error;
  if (restaurantReservationsRes.error) throw restaurantReservationsRes.error;
  if (tourBookingsRes.error) throw tourBookingsRes.error;
  if (spaAppointmentsRes.error) throw spaAppointmentsRes.error;

  const activities: UnifiedActivity[] = [
    ...(serviceRequestsRes.data || []).map(transformServiceRequest),
    ...(restaurantReservationsRes.data || []).map(transformRestaurantReservation),
    ...(tourBookingsRes.data || []).map(transformTourBooking),
    ...(spaAppointmentsRes.data || []).map(transformSpaAppointment),
  ];

  activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  logger.info('ServiceRequests', 'Unified activities loaded', {
    service_requests: serviceRequestsRes.data?.length || 0,
    restaurants: restaurantReservationsRes.data?.length || 0,
    tours: tourBookingsRes.data?.length || 0,
    spa: spaAppointmentsRes.data?.length || 0,
    total: activities.length
  });

  return activities;
}

export const useUnifiedActivitiesQuery = (guestId: string, enabled = true) => {
  return useQuery({
    queryKey: ['unified-activities', guestId],
    queryFn: () => fetchUnifiedActivities(guestId),
    staleTime: 1000 * 30,
    enabled: enabled && !!guestId,
  });
};
