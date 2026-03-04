import { supabase } from '../../../lib/api/supabase';
import { AuthService, GuestService, PropertyService } from '../../../lib/services';
import { logger } from '../../../core/utils/logger';
import { ToursPort } from './port';
import {
  Tour,
  TourBooking,
  CreateTourBookingDTO,
  UpdateBookingStatusDTO,
  TourFilters,
  TourBookingStats,
  BookingRequest,
  Booking,
} from './types';

export class RemoteToursAdapter implements ToursPort {
  
  async getAll(filters?: TourFilters): Promise<Tour[]> {
    logger.info('ToursAdapter', 'getAll - Fetching from Supabase', filters);
    
    let query = supabase
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false });
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    
    if (filters?.minPrice) {
      query = query.gte('price_adult', filters.minPrice);
    }
    
    if (filters?.maxPrice) {
      query = query.lte('price_adult', filters.maxPrice);
    }
    
    if (filters?.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured);
    }
    
    const { data, error } = await query;
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching tours', error);
      throw new Error(`Failed to fetch tours: ${error.message}`);
    }
    
    logger.info('ToursAdapter', `Loaded ${data.length} tours from Supabase`);
    return data as Tour[];
  }
  
  async getById(idOrSlug: string): Promise<Tour> {
    logger.info('ToursAdapter', 'getById', idOrSlug);
    
    let query = supabase
      .from('tours')
      .select('*')
      .eq('is_active', true);
    
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    if (isUUID) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching tour', error);
      throw new Error(`Tour not found: ${idOrSlug}`);
    }
    
    logger.info('ToursAdapter', 'Tour loaded', data.name);
    return data as Tour;
  }
  
  async getByCategory(category: string): Promise<Tour[]> {
    logger.info('ToursAdapter', 'getByCategory', category);
    
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('rating', { ascending: false });
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching tours by category', error);
      throw new Error(`Failed to fetch tours: ${error.message}`);
    }
    
    logger.info('ToursAdapter', `Loaded ${data.length} tours in category: ${category}`);
    return data as Tour[];
  }
  
  async getFeatured(): Promise<Tour[]> {
    logger.info('ToursAdapter', 'getFeatured');
    
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(6);
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching featured tours', error);
      throw new Error(`Failed to fetch featured tours: ${error.message}`);
    }
    
    logger.info('ToursAdapter', `Loaded ${data.length} featured tours`);
    return data as Tour[];
  }
  
  async createBooking(dto: CreateTourBookingDTO): Promise<TourBooking> {
    logger.info('ToursAdapter', 'createBooking', dto);
    
    const userId = await AuthService.getCurrentUserId();
    const guestInfo = await GuestService.getGuestInfo(userId);
    const propertyId = await PropertyService.getDefaultPropertyId();
    
    const tour = await this.getById(dto.tour_id);
    
    const adults = dto.adults;
    const children = dto.children || 0;
    const total_participants = adults + children;
    const price_per_adult = tour.price_adult;
    const price_per_child = tour.price_child || tour.price_adult * 0.7;
    const total_price = (adults * price_per_adult) + (children * price_per_child);
    
    const { data, error } = await supabase
      .from('tour_bookings')
      .insert({
        tour_id: dto.tour_id,
        guest_id: userId,
        property_id: propertyId,
        guest_name: guestInfo.name,
        guest_email: guestInfo.email || null,
        guest_phone: guestInfo.phone || null,
        room_number: guestInfo.room_number || null,
        booking_date: dto.booking_date,
        time_slot: dto.time_slot,
        adults,
        children,
        total_participants,
        price_per_adult,
        price_per_child,
        total_price,
        currency: tour.currency,
        status: 'pending',
        skill_level: dto.skill_level || null,
        medical_conditions: dto.medical_conditions || null,
        emergency_contact: dto.emergency_contact || null,
        insurance_confirmed: dto.insurance_confirmed || false,
        waiver_signed: dto.waiver_signed || false,
        special_requests: dto.special_requests || null,
      })
      .select(`
        *,
        tour:tours(*)
      `)
      .single();
    
    if (error) {
      logger.error('ToursAdapter', 'Error creating booking', error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }
    
    logger.info('ToursAdapter', 'Booking created successfully', data.id);
    return data as TourBooking;
  }
  
  async getBookingsByGuest(guestId: string): Promise<TourBooking[]> {
    logger.info('ToursAdapter', 'getBookingsByGuest', guestId);
    
    const { data, error } = await supabase
      .from('tour_bookings')
      .select(`
        *,
        tour:tours(*)
      `)
      .eq('guest_id', guestId)
      .order('booking_date', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching bookings', error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
    
    logger.info('ToursAdapter', `Loaded ${data.length} bookings for guest`);
    return data as TourBooking[];
  }
  
  async getBookingById(id: string): Promise<TourBooking> {
    logger.info('ToursAdapter', 'getBookingById', id);
    
    const { data, error } = await supabase
      .from('tour_bookings')
      .select(`
        *,
        tour:tours(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching booking', error);
      throw new Error(`Booking not found: ${id}`);
    }
    
    logger.info('ToursAdapter', 'Booking loaded', data.id);
    return data as TourBooking;
  }
  
  async updateBookingStatus(
    id: string,
    dto: UpdateBookingStatusDTO
  ): Promise<TourBooking> {
    logger.info('ToursAdapter', 'updateBookingStatus', { id, dto });
    
    const updateData: any = {
      status: dto.status,
      updated_at: new Date().toISOString(),
    };
    
    if (dto.status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
    } else if (dto.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else if (dto.status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancellation_reason = dto.cancellation_reason || null;
    }
    
    const { data, error } = await supabase
      .from('tour_bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        tour:tours(*)
      `)
      .single();
    
    if (error) {
      logger.error('ToursAdapter', 'Error updating booking status', error);
      throw new Error(`Failed to update booking: ${error.message}`);
    }
    
    logger.info('ToursAdapter', 'Booking status updated', data.status);
    return data as TourBooking;
  }
  
  async cancelBooking(id: string, reason?: string): Promise<TourBooking> {
    logger.info('ToursAdapter', 'cancelBooking', { id, reason });
    
    return this.updateBookingStatus(id, {
      status: 'cancelled',
      cancellation_reason: reason,
    });
  }
  
  async getBookingStats(tourId?: string): Promise<TourBookingStats> {
    logger.info('ToursAdapter', 'getBookingStats', tourId);
    
    let query = supabase.from('tour_bookings').select('status, total_price');
    
    if (tourId) {
      query = query.eq('tour_id', tourId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      logger.error('ToursAdapter', 'Error fetching booking stats', error);
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
    
    const stats: TourBookingStats = {
      total: data.length,
      pending: data.filter(b => b.status === 'pending').length,
      confirmed: data.filter(b => b.status === 'confirmed').length,
      completed: data.filter(b => b.status === 'completed').length,
      cancelled: data.filter(b => b.status === 'cancelled').length,
      revenue: data
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + (b.total_price || 0), 0),
    };
    
    logger.info('ToursAdapter', 'Booking stats calculated', stats);
    return stats;
  }
  
  async getByName(name: string): Promise<Tour> {
    logger.warn('ToursAdapter', 'getByName is deprecated, use getById with slug');
    return this.getById(name);
  }
  
  async createLegacyBooking(request: BookingRequest): Promise<Booking> {
    logger.warn('ToursAdapter', 'createLegacyBooking is deprecated, use createBooking');
    
    const tours = await this.getAll();
    const tour = tours.find(t => t.name === request.tour || t.slug === request.tour);
    
    if (!tour) {
      throw new Error(`Tour not found: ${request.tour}`);
    }
    
    const dto: CreateTourBookingDTO = {
      tour_id: tour.id,
      booking_date: request.date,
      time_slot: request.time,
      adults: request.guests,
      children: 0,
      skill_level: request.skillLevel,
      medical_conditions: request.medicalConditions,
      emergency_contact: request.emergencyContact,
      insurance_confirmed: request.insurance,
      waiver_signed: request.waiverSigned,
      special_requests: request.specialRequests,
    };
    
    const booking = await this.createBooking(dto);
    
    return {
      id: booking.id,
      tour: tour.name,
      guests: booking.total_participants,
      date: booking.booking_date,
      time: booking.time_slot,
      skillLevel: booking.skill_level || undefined,
      medicalConditions: booking.medical_conditions || undefined,
      emergencyContact: booking.emergency_contact || undefined,
      insurance: booking.insurance_confirmed,
      waiverSigned: booking.waiver_signed,
      specialRequests: booking.special_requests || undefined,
      status: booking.status as 'pending' | 'confirmed' | 'cancelled',
      createdAt: booking.created_at,
    };
  }
}
