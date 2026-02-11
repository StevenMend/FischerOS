import { supabase } from '../../../lib/api/supabase';
import { AuthService, GuestService, PropertyService } from '../../../lib/services';
import type { SpaPort } from './port';
import type {
  SpaTreatment,
  SpaAppointment,
  CreateSpaAppointmentDTO,
  UpdateSpaAppointmentDTO,
  SpaFilters,
  SpaAppointmentFilters,
} from '../types';
import { logger } from '../../../core/utils/logger';

export class SupabaseSpaAdapter implements SpaPort {
  // ============================================
  // TREATMENTS
  // ============================================
  
  async getTreatments(filters?: SpaFilters): Promise<SpaTreatment[]> {
    let query = supabase
      .from('spa_treatments')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (filters?.category) {
      const categories = Array.isArray(filters.category) 
        ? filters.category 
        : [filters.category];
      query = query.in('category', categories);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.modality) {
      query = query.eq('modality', filters.modality);
    }

    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters?.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }

    if (filters?.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    if (filters?.max_duration !== undefined) {
      query = query.lte('duration', filters.max_duration);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getTreatmentById(id: string): Promise<SpaTreatment | null> {
    const { data, error } = await supabase
      .from('spa_treatments')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async getTreatmentBySlug(slug: string): Promise<SpaTreatment | null> {
    const { data, error } = await supabase
      .from('spa_treatments')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async getFeaturedTreatments(): Promise<SpaTreatment[]> {
    const { data, error } = await supabase
      .from('spa_treatments')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getTreatmentsByCategory(category: string): Promise<SpaTreatment[]> {
    const { data, error } = await supabase
      .from('spa_treatments')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // ============================================
  // APPOINTMENTS
  // ============================================

  async getAppointments(filters?: SpaAppointmentFilters): Promise<SpaAppointment[]> {
    let query = supabase
      .from('spa_appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (filters?.guest_id) {
      query = query.eq('guest_id', filters.guest_id);
    }

    if (filters?.treatment_id) {
      query = query.eq('treatment_id', filters.treatment_id);
    }

    if (filters?.therapist_id) {
      query = query.eq('therapist_id', filters.therapist_id);
    }

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) 
        ? filters.status 
        : [filters.status];
      query = query.in('status', statuses);
    }

    if (filters?.appointment_date) {
      query = query.eq('appointment_date', filters.appointment_date);
    }

    if (filters?.date_from) {
      query = query.gte('appointment_date', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('appointment_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getAppointmentById(id: string): Promise<SpaAppointment | null> {
    const { data, error } = await supabase
      .from('spa_appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async getGuestAppointments(guestId: string): Promise<SpaAppointment[]> {
    const { data, error } = await supabase
      .from('spa_appointments')
      .select('*')
      .eq('guest_id', guestId)
      .order('appointment_date', { ascending: false })
      .order('time_slot', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createAppointment(dto: CreateSpaAppointmentDTO): Promise<SpaAppointment> {
    logger.info('Spa', 'RemoteSpaAdapter.createAppointment()', dto);
    
    // Get authenticated user and guest info
    const userId = await AuthService.getCurrentUserId();
    const guestInfo = await GuestService.getGuestInfo(userId);
    const propertyId = await PropertyService.getDefaultPropertyId();
    
    // Get treatment info for denormalization
    const treatment = await this.getTreatmentById(dto.treatment_id);
    if (!treatment) {
      throw new Error('Treatment not found');
    }

    const { data, error } = await supabase
      .from('spa_appointments')
      .insert({
        treatment_id: dto.treatment_id,
        guest_id: userId,
        property_id: propertyId,
        guest_name: guestInfo.name,
        guest_email: guestInfo.email || dto.guest_email,
        guest_phone: guestInfo.phone || dto.guest_phone,
        room_number: guestInfo.room_number,
        treatment_name: treatment.name,
        treatment_duration: treatment.duration,
        appointment_date: dto.appointment_date,
        time_slot: dto.time_slot,
        guests: dto.guests || 1,
        therapist_preference: dto.therapist_preference,
        pressure_level: dto.pressure_level,
        add_ons: dto.add_ons || [],
        aromatherapy_preference: dto.aromatherapy_preference,
        music_preference: dto.music_preference,
        room_temperature: dto.room_temperature,
        allergies: dto.allergies || [],
        medical_notes: dto.medical_notes,
        special_requests: dto.special_requests,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error('Spa', 'Error creating appointment', { error });
      throw error;
    }
    
    logger.info('Spa', 'Appointment created', { data });
    return data;
  }

  async updateAppointment(id: string, dto: UpdateSpaAppointmentDTO): Promise<SpaAppointment> {
    const { data, error } = await supabase
      .from('spa_appointments')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async cancelAppointment(id: string, reason?: string): Promise<SpaAppointment> {
    return this.updateAppointment(id, {
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    });
  }

  async confirmAppointment(id: string, therapistId?: string): Promise<SpaAppointment> {
    const updateData: UpdateSpaAppointmentDTO = {
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    };

    if (therapistId) {
      updateData.therapist_id = therapistId;
    }

    return this.updateAppointment(id, updateData);
  }

  async startAppointment(id: string): Promise<SpaAppointment> {
    return this.updateAppointment(id, {
      status: 'in_progress',
      started_at: new Date().toISOString(),
    });
  }

  async completeAppointment(id: string): Promise<SpaAppointment> {
    return this.updateAppointment(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  }
}

export const spaAdapter = new SupabaseSpaAdapter();