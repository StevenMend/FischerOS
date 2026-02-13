// src/features/service-requests/queries/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createServiceRequestsRepository } from '../api';
import { serviceRequestsKeys } from './keys';
import { ServiceRequest, CreateRequestDTO } from '../api/types';
import { ToastService } from '../../../lib/services';
import { logger } from '../../../core/utils/logger';

/**
 * Mutation hook for creating a new service request
 * Includes optimistic update
 */
export const useCreateRequestMutation = (guestId: string) => {
  const queryClient = useQueryClient();
  const adapter = createServiceRequestsRepository();

  return useMutation({
    mutationFn: (request: CreateRequestDTO) => adapter.create(request),
    
    // OPTIMISTIC UPDATE - Before API call
    onMutate: async (newRequest) => {
      logger.debug('ServiceRequests', '[OPTIMISTIC] Creating request...');
      
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: serviceRequestsKeys.byGuest(guestId) });

      // Snapshot for rollback
      const previousRequests = queryClient.getQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byGuest(guestId)
      );

      // Optimistically add to cache
      queryClient.setQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byGuest(guestId),
        (old = []) => [
          {
            id: `temp-${Date.now()}`,
            guest_id: guestId,
            guest_name: 'You',
            room_number: '-',
            type: newRequest.type,
            priority: newRequest.priority,
            status: 'pending',
            title: newRequest.title,
            description: newRequest.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as ServiceRequest,
          ...old,
        ]
      );

      // Show loading toast
      ToastService.loading('Creating request...');

      return { previousRequests };
    },

    // SUCCESS
    onSuccess: (data) => {
      logger.info('ServiceRequests', 'Request created successfully', { id: data.id });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: serviceRequestsKeys.byGuest(guestId) });
      
      ToastService.dismiss();
      ToastService.success('Request created!', 'Your request has been submitted');
    },

    // ERROR - Rollback
    onError: (error, variables, context) => {
      logger.error('ServiceRequests', 'Failed to create request', { error });
      
      // Restore snapshot
      if (context?.previousRequests) {
        queryClient.setQueryData(
          serviceRequestsKeys.byGuest(guestId),
          context.previousRequests
        );
      }

      ToastService.dismiss();
      ToastService.error('Failed to create request', 'Please try again');
    },
  });
};

/**
 * Mutation hook for staff to take a request (assign to self)
 * Includes optimistic update
 */
export const useTakeRequestMutation = (departmentId: string, staffId: string) => {
  const queryClient = useQueryClient();
  const adapter = createServiceRequestsRepository();

  return useMutation({
    mutationFn: (requestId: string) => adapter.assignToStaff(requestId, staffId),
    
    // OPTIMISTIC UPDATE
    onMutate: async (requestId) => {
      logger.debug('ServiceRequests', '[OPTIMISTIC] Taking request', { requestId });
      
      await queryClient.cancelQueries({ queryKey: serviceRequestsKeys.byDepartment(departmentId) });

      const previousRequests = queryClient.getQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byDepartment(departmentId)
      );

      // Optimistically update status
      queryClient.setQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byDepartment(departmentId),
        (old = []) =>
          old.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: 'assigned' as const,
                  assigned_to: staffId,
                  assigned_to_name: 'You',
                  acknowledged_at: new Date().toISOString(),
                }
              : req
          )
      );

      ToastService.loading('Taking request...');

      return { previousRequests };
    },

    onSuccess: (data) => {
      logger.info('ServiceRequests', 'Request taken successfully', { id: data.id });
      
      queryClient.invalidateQueries({ queryKey: serviceRequestsKeys.byDepartment(departmentId) });
      
      ToastService.dismiss();
      ToastService.success('Request assigned!', `You're now handling this request`);
    },

    onError: (error, requestId, context) => {
      logger.error('ServiceRequests', 'Failed to take request', { error });
      
      if (context?.previousRequests) {
        queryClient.setQueryData(
          serviceRequestsKeys.byDepartment(departmentId),
          context.previousRequests
        );
      }

      ToastService.dismiss();
      ToastService.error('Failed to take request', 'It may have been assigned to someone else');
    },
  });
};

/**
 * Mutation hook for updating request status
 * Includes optimistic update
 */
export const useUpdateStatusMutation = (departmentId: string, guestId?: string) => {
  const queryClient = useQueryClient();
  const adapter = createServiceRequestsRepository();

  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: string }) =>
      adapter.updateStatus(requestId, status),
    
    // OPTIMISTIC UPDATE
    onMutate: async ({ requestId, status }) => {
      logger.debug('ServiceRequests', '[OPTIMISTIC] Updating status', { requestId, status });
      
      await queryClient.cancelQueries({ queryKey: serviceRequestsKeys.byDepartment(departmentId) });

      const previousRequests = queryClient.getQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byDepartment(departmentId)
      );

      // Calculate timestamp
      const timestamp = new Date().toISOString();
      const timestampField =
        status === 'in-progress'
          ? 'started_at'
          : status === 'completed'
          ? 'completed_at'
          : null;

      // Optimistically update
      queryClient.setQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byDepartment(departmentId),
        (old = []) =>
          old.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: status as any,
                  ...(timestampField ? { [timestampField]: timestamp } : {}),
                }
              : req
          )
      );

      ToastService.loading(`Updating to ${status}...`);

      return { previousRequests };
    },

    onSuccess: (data, { status }) => {
      logger.info('ServiceRequests', 'Status updated successfully', { id: data.id });
      
      // Invalidate department queries
      queryClient.invalidateQueries({ queryKey: serviceRequestsKeys.byDepartment(departmentId) });
      
      // If completed, also invalidate guest queries (so they can rate)
      if (status === 'completed' && guestId) {
        queryClient.invalidateQueries({ queryKey: serviceRequestsKeys.byGuest(data.guest_id) });
      }
      
      ToastService.dismiss();
      ToastService.success('Status updated!', `Request marked as ${status}`);
    },

    onError: (error, variables, context) => {
      logger.error('ServiceRequests', 'Failed to update status', { error });
      
      if (context?.previousRequests) {
        queryClient.setQueryData(
          serviceRequestsKeys.byDepartment(departmentId),
          context.previousRequests
        );
      }

      ToastService.dismiss();
      ToastService.error('Failed to update status', 'Please try again');
    },
  });
};

/**
 * Mutation hook for rating a completed request (guest only)
 * Includes optimistic update
 */
export const useRateRequestMutation = (guestId: string) => {
  const queryClient = useQueryClient();
  const adapter = createServiceRequestsRepository();

  return useMutation({
    mutationFn: ({ requestId, rating, feedback }: { requestId: string; rating: number; feedback?: string }) =>
      adapter.rate(requestId, rating, feedback),
    
    // OPTIMISTIC UPDATE
    onMutate: async ({ requestId, rating, feedback }) => {
      logger.debug('ServiceRequests', '[OPTIMISTIC] Rating request', { requestId, rating });
      
      await queryClient.cancelQueries({ queryKey: serviceRequestsKeys.byGuest(guestId) });

      const previousRequests = queryClient.getQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byGuest(guestId)
      );

      // Optimistically add rating
      queryClient.setQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byGuest(guestId),
        (old = []) =>
          old.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  rating,
                  feedback: feedback || null,
                }
              : req
          )
      );

      ToastService.loading('Submitting rating...');

      return { previousRequests };
    },

    onSuccess: (data) => {
      logger.info('ServiceRequests', 'Rating submitted successfully', { id: data.id });
      
      // Don't invalidate, just update in place (more efficient)
      queryClient.setQueryData<ServiceRequest[]>(
        serviceRequestsKeys.byGuest(guestId),
        (old = []) =>
          old.map((req) => (req.id === data.id ? data : req))
      );
      
      ToastService.dismiss();
      ToastService.success('Thank you!', 'Your feedback helps us improve');
    },

    onError: (error, variables, context) => {
      logger.error('ServiceRequests', 'Failed to submit rating', { error });
      
      if (context?.previousRequests) {
        queryClient.setQueryData(
          serviceRequestsKeys.byGuest(guestId),
          context.previousRequests
        );
      }

      ToastService.dismiss();
      ToastService.error('Failed to submit rating', 'Please try again');
    },
  });
};