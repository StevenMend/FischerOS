// src/features/service-requests/queries/guest-queries.ts
import { useQuery } from '@tanstack/react-query';
import { serviceRequestsKeys } from './keys';
import { createServiceRequestsRepository } from '../api';

/**
 * Query hook for fetching guest's service requests
 * @param guestId - Guest user ID
 * @param options - React Query options
 */
export const useGuestRequestsQuery = (guestId: string, enabled = true) => {
  const adapter = createServiceRequestsRepository();
  
  return useQuery({
    queryKey: serviceRequestsKeys.byGuest(guestId),
    queryFn: () => adapter.getByGuest(guestId),
    staleTime: 1000 * 30, // 30 seconds - Guest requests stay fresh for 30s
    enabled: enabled && !!guestId,
  });
};

/**
 * Query hook for fetching a single request by ID
 * @param requestId - Request ID
 */
export const useRequestByIdQuery = (requestId: string, enabled = true) => {
  const adapter = createServiceRequestsRepository();
  
  return useQuery({
    queryKey: serviceRequestsKeys.byId(requestId),
    queryFn: () => adapter.getById(requestId),
    staleTime: 1000 * 60, // 1 minute
    enabled: enabled && !!requestId,
  });
};