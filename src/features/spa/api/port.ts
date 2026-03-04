import type {
  SpaTreatment,
  SpaAppointment,
  CreateSpaAppointmentDTO,
  UpdateSpaAppointmentDTO,
  SpaFilters,
  SpaAppointmentFilters,
} from '../types';

/**
 * Port (Interface) for Spa Operations
 */
export interface SpaPort {
  // Treatments
  getTreatments(filters?: SpaFilters): Promise<SpaTreatment[]>;
  getTreatmentById(id: string): Promise<SpaTreatment | null>;
  getTreatmentBySlug(slug: string): Promise<SpaTreatment | null>;
  getFeaturedTreatments(): Promise<SpaTreatment[]>;
  getTreatmentsByCategory(category: string): Promise<SpaTreatment[]>;
  
  // Appointments
  getAppointments(filters?: SpaAppointmentFilters): Promise<SpaAppointment[]>;
  getAppointmentById(id: string): Promise<SpaAppointment | null>;
  getGuestAppointments(guestId: string): Promise<SpaAppointment[]>;
  createAppointment(data: CreateSpaAppointmentDTO): Promise<SpaAppointment>;
  updateAppointment(id: string, data: UpdateSpaAppointmentDTO): Promise<SpaAppointment>;
  cancelAppointment(id: string, reason?: string): Promise<SpaAppointment>;
  confirmAppointment(id: string, therapistId?: string): Promise<SpaAppointment>;
  startAppointment(id: string): Promise<SpaAppointment>;
  completeAppointment(id: string): Promise<SpaAppointment>;
}