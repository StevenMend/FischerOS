import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spaAdapter } from '../api';
import { spaKeys } from './keys';
import { ToastService } from '../../../lib/services';
import { notify } from '../../notifications/api';
import { logger } from '../../../core/utils/logger';
import type { CreateSpaAppointmentDTO, UpdateSpaAppointmentDTO } from '../types';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSpaAppointmentDTO) => spaAdapter.createAppointment(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: spaKeys.appointments() });
      ToastService.success('Appointment booked!', 'Your spa appointment has been scheduled');
      if (data?.guest_id) {
        notify({
          userId: data.guest_id,
          type: 'success',
          title: 'Spa Appointment Booked',
          body: `Your spa appointment has been scheduled.`,
          category: 'spa',
          relatedId: data.id,
          relatedType: 'spa_appointment',
        });
      }
    },
    onError: (error: Error) => {
      logger.error('Spa', 'Failed to create appointment', error);
      ToastService.error('Booking failed', error.message);
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpaAppointmentDTO }) =>
      spaAdapter.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaKeys.appointments() });
      ToastService.success('Appointment updated');
    },
    onError: (error: Error) => {
      logger.error('Spa', 'Failed to update appointment', error);
      ToastService.error('Update failed', error.message);
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      spaAdapter.cancelAppointment(id, reason),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: spaKeys.appointments() });
      ToastService.success('Appointment cancelled');
      if (data?.guest_id) {
        notify({
          userId: data.guest_id,
          type: 'warning',
          title: 'Spa Appointment Cancelled',
          body: `Your spa appointment has been cancelled.`,
          category: 'spa',
          relatedId: data.id,
          relatedType: 'spa_appointment',
        });
      }
    },
    onError: (error: Error) => {
      logger.error('Spa', 'Failed to cancel appointment', error);
      ToastService.error('Cancellation failed', error.message);
    },
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, therapistId }: { id: string; therapistId?: string }) =>
      spaAdapter.confirmAppointment(id, therapistId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: spaKeys.appointments() });
      ToastService.success('Appointment confirmed');
      if (data?.guest_id) {
        notify({
          userId: data.guest_id,
          type: 'success',
          title: 'Spa Appointment Confirmed',
          body: `Your spa appointment has been confirmed.`,
          category: 'spa',
          relatedId: data.id,
          relatedType: 'spa_appointment',
        });
      }
    },
    onError: (error: Error) => {
      logger.error('Spa', 'Failed to confirm appointment', error);
      ToastService.error('Confirmation failed', error.message);
    },
  });
}

export function useStartAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => spaAdapter.startAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaKeys.appointments() });
      ToastService.success('Treatment started');
    },
    onError: (error: Error) => {
      logger.error('Spa', 'Failed to start appointment', error);
      ToastService.error('Failed to start treatment', error.message);
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => spaAdapter.completeAppointment(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: spaKeys.appointments() });
      ToastService.success('Treatment completed');
      if (data?.guest_id) {
        notify({
          userId: data.guest_id,
          type: 'success',
          title: 'Spa Treatment Complete',
          body: `Your spa treatment has been completed. We hope you enjoyed it!`,
          category: 'spa',
          relatedId: data.id,
          relatedType: 'spa_appointment',
        });
      }
    },
    onError: (error: Error) => {
      logger.error('Spa', 'Failed to complete appointment', error);
      ToastService.error('Failed to complete treatment', error.message);
    },
  });
}
