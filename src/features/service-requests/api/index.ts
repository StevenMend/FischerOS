import { ServiceRequestsPort } from './port';
import { MockServiceRequestsAdapter } from './mock.adapter';
import { RemoteServiceRequestsAdapter } from './remote.adapter';
import { StaffRemoteServiceRequestsAdapter } from './staff-remote.adapter';
import { useAuthStore } from '../../../lib/stores/useAuthStore';
import { logger } from '../../../core/utils/logger';

export function createServiceRequestsRepository(): ServiceRequestsPort {
  const useRemote = import.meta.env.VITE_USE_REMOTE === 'true';

  if (useRemote) {
    // Detectar si es staff o guest
    const session = useAuthStore.getState().session;
    const isStaff = session?.user?.role === 'staff';

    if (isStaff) {
      logger.info('ServiceRequests', 'Using StaffRemoteServiceRequestsAdapter (All requests)');
      return new StaffRemoteServiceRequestsAdapter();
    }

    logger.info('ServiceRequests', 'Using RemoteServiceRequestsAdapter (Guest requests only)');
    return new RemoteServiceRequestsAdapter();
  }

  logger.info('ServiceRequests', 'Using MockServiceRequestsAdapter (Seed data)');
  return new MockServiceRequestsAdapter();
}

export type { ServiceRequest, CreateRequestDTO, UpdateRequestDTO, RequestType, RequestStatus, RequestPriority } from './types';
