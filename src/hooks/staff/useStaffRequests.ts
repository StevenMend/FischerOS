// src/hooks/staff/useStaffRequests.ts - REFACTORED WITH REACT QUERY
import { useState, useEffect, useMemo } from 'react';
import { logger } from '../../core/utils/logger';
import { supabase } from '../../lib/api/supabase';
import { useAuthStore } from '../../lib/stores/useAuthStore';
import {
  useStaffRequestsQuery,
  useTakeRequestMutation,
  useUpdateStatusMutation,
} from '../../features/service-requests/queries';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  guest_id: string;
  guest_name: string;
  room_number: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  department_id: string;
  created_at: string;
  acknowledged_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  rating: number | null;
  feedback: string | null;
  guests?: {
    name: string;
    email: string;
    room_number: string;
  };
  departments?: {
    name: string;
    code: string;
  };
}

interface UseStaffRequestsResult {
  pendingRequests: ServiceRequest[];
  inProgressRequests: ServiceRequest[];
  completedRequests: ServiceRequest[];
  allRequests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  takeRequest: (requestId: string) => Promise<void>;
  updateStatus: (requestId: string, newStatus: string) => Promise<void>;
  loadMoreCompleted: () => Promise<void>;
  hasMoreCompleted: boolean;
  myDepartmentId: string | null;
  myDepartmentName: string | null;
}

export const useStaffRequests = (): UseStaffRequestsResult => {
  const session = useAuthStore((state) => state.session);
  const [myDepartmentId, setMyDepartmentId] = useState<string | null>(null);
  const [myDepartmentName, setMyDepartmentName] = useState<string | null>(null);
  const [myStaffInfo, setMyStaffInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const fetchStaffInfo = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select(`
            id,
            name,
            department_id,
            departments(name, code)
          `)
          .eq('id', session.user.id)
          .single();

        if (staffError) throw staffError;

        if (staffData) {
          setMyDepartmentId(staffData.department_id);
          setMyDepartmentName(staffData.departments?.name || null);
          setMyStaffInfo({ id: staffData.id, name: staffData.name });
        }
      } catch (err: any) {
        logger.error('StaffRequests', 'Error fetching staff info', err);
      }
    };

    fetchStaffInfo();
  }, [session?.user?.id]);

  const {
    data: allRequests = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useStaffRequestsQuery(myDepartmentId || '', !!myDepartmentId);

  const takeMutation = useTakeRequestMutation(myDepartmentId || '', myStaffInfo?.id || '');
  const updateMutation = useUpdateStatusMutation(myDepartmentId || '');

  const pendingRequests = useMemo(
    () => allRequests.filter((r) => r.status === 'pending'),
    [allRequests]
  );

  const inProgressRequests = useMemo(
    () => allRequests.filter((r) => r.status === 'in-progress' || r.status === 'assigned'),
    [allRequests]
  );

  const completedRequests = useMemo(
    () => allRequests.filter((r) => r.status === 'completed'),
    [allRequests]
  );

  const takeRequest = async (requestId: string) => {
    await takeMutation.mutateAsync(requestId);
  };

  const updateStatus = async (requestId: string, newStatus: string) => {
    await updateMutation.mutateAsync({ requestId, status: newStatus });
  };

  const loadMoreCompleted = async () => {
    logger.debug('StaffRequests', '�� Load more completed - TODO: implement pagination');
  };

  const hasMoreCompleted = completedRequests.length > 0 && completedRequests.length % 20 === 0;

  return {
    pendingRequests,
    inProgressRequests,
    completedRequests,
    allRequests,
    loading,
    error: queryError?.message || null,
    refetch: async () => {
      await refetch();
    },
    takeRequest,
    updateStatus,
    loadMoreCompleted,
    hasMoreCompleted,
    myDepartmentId,
    myDepartmentName,
  };
};
