// src/features/service-requests/queries/staff-queries.ts
import { useQuery } from '@tanstack/react-query';
import { serviceRequestsKeys } from './keys';
import { createServiceRequestsRepository } from '../api';
import { useRealtimeSubscription } from '../../../hooks/useRealtimeSubscription';

/**
 * Query hook for fetching department's service requests.
 * Uses Supabase Realtime for instant updates + polling fallback.
 */
export const useStaffRequestsQuery = (departmentId: string, enabled = true) => {
  const adapter = createServiceRequestsRepository();

  // Realtime: invalidate cache on any service_requests change
  useRealtimeSubscription(
    `staff-requests-${departmentId}`,
    [{ table: 'service_requests' }],
    [serviceRequestsKeys.byDepartment(departmentId)],
    enabled && !!departmentId
  );

  return useQuery({
    queryKey: serviceRequestsKeys.byDepartment(departmentId),
    queryFn: () => adapter.getByDepartment(departmentId),
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30, // Polling fallback
    enabled: enabled && !!departmentId,
  });
};