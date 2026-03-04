// src/features/service-requests/queries/keys.ts
/**
 * Query keys factory for service requests
 * Hierarchical structure for efficient cache invalidation
 */
export const serviceRequestsKeys = {
  // Base key
  all: ['service-requests'] as const,
  
  // Guest-specific queries
  byGuest: (guestId: string) => [...serviceRequestsKeys.all, 'guest', guestId] as const,
  
  // Staff-specific queries
  byDepartment: (departmentId: string) => [...serviceRequestsKeys.all, 'department', departmentId] as const,
  
  // Single request
  byId: (id: string) => [...serviceRequestsKeys.all, id] as const,
};