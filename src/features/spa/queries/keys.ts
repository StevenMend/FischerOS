export const spaKeys = {
  all: ['spa'] as const,
  
  // Treatments
  treatments: () => [...spaKeys.all, 'treatments'] as const,
  treatment: (id: string) => [...spaKeys.treatments(), id] as const,
  treatmentBySlug: (slug: string) => [...spaKeys.treatments(), 'slug', slug] as const,
  featuredTreatments: () => [...spaKeys.treatments(), 'featured'] as const,
  treatmentsByCategory: (category: string) => [...spaKeys.treatments(), 'category', category] as const,
  
  // Appointments
  appointments: () => [...spaKeys.all, 'appointments'] as const,
  appointment: (id: string) => [...spaKeys.appointments(), id] as const,
  guestAppointments: (guestId: string) => [...spaKeys.appointments(), 'guest', guestId] as const,
};