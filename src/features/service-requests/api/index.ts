import { ServiceRequestsPort } from './port';
import { RemoteServiceRequestsAdapter } from './remote.adapter';
import { StaffRemoteServiceRequestsAdapter } from './staff-remote.adapter';
import { useAuthStore } from '../../../lib/stores/useAuthStore';

export function createServiceRequestsRepository(): ServiceRequestsPort {
  const session = useAuthStore.getState().session;
  const isStaff = session?.user?.role === 'staff';

  if (isStaff) {
    return new StaffRemoteServiceRequestsAdapter();
  }

  return new RemoteServiceRequestsAdapter();
}

export type { ServiceRequest, CreateRequestDTO, UpdateRequestDTO, RequestType, RequestStatus, RequestPriority } from './types';
