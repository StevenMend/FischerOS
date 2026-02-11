// src/hooks/admin/useAdminMetrics.ts
import { useState, useEffect } from 'react';
import { logger } from '../../core/utils/logger';
import { supabase } from '../../lib/api/supabase';
import { useAuthStore } from '../../lib/stores/useAuthStore';

interface DepartmentMetrics {
  department_id: string;
  department_name: string;
  department_code: string;
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  avg_response_time_minutes: number | null;
  avg_resolution_time_minutes: number | null;
  completion_rate: number;
}

interface StaffPerformance {
  staff_id: string;
  staff_name: string;
  department_name: string;
  requests_handled: number;
  requests_completed: number;
  avg_rating: number | null;
  avg_resolution_time_minutes: number | null;
}

interface UseAdminMetricsResult {
  departmentMetrics: DepartmentMetrics[];
  staffPerformance: StaffPerformance[];
  totalRequests: number;
  totalPending: number;
  totalInProgress: number;
  totalCompleted: number;
  overallSatisfaction: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  timeframe: 'today' | 'week' | 'month';
  setTimeframe: (tf: 'today' | 'week' | 'month') => void;
}

export const useAdminMetrics = (): UseAdminMetricsResult => {
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetrics[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalInProgress, setTotalInProgress] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [overallSatisfaction, setOverallSatisfaction] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const session = useAuthStore((state) => state.session);

  const getTimeframeFilter = () => {
    const now = new Date();
    switch (timeframe) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return weekAgo.toISOString();
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return monthAgo.toISOString();
      default:
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    }
  };

  const fetchMetrics = async () => {
    if (!session?.user?.id) {
      logger.debug('AdminMetrics', 'No session - skipping fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const timeFilter = getTimeframeFilter();
      logger.info('AdminMetrics', 'Fetching admin metrics', { timeframe });

      // Fetch all requests for the timeframe
      const { data: requests, error: requestsError } = await supabase
        .from('service_requests')
        .select(`
          *,
          departments(name, code),
          staff(name, department_id)
        `)
        .gte('created_at', timeFilter);

      if (requestsError) throw requestsError;

      logger.info('AdminMetrics', 'Total requests loaded', { count: requests?.length || 0 });

      // Calculate department metrics
      const deptMap = new Map<string, any>();
      
      requests?.forEach((req) => {
        const deptId = req.department_id;
        if (!deptId) return;

        if (!deptMap.has(deptId)) {
          deptMap.set(deptId, {
            department_id: deptId,
            department_name: req.departments?.name || 'Unknown',
            department_code: req.departments?.code || 'N/A',
            total_requests: 0,
            pending_requests: 0,
            in_progress_requests: 0,
            completed_requests: 0,
            total_response_time: 0,
            total_resolution_time: 0,
            response_count: 0,
            resolution_count: 0
          });
        }

        const dept = deptMap.get(deptId);
        dept.total_requests++;

        if (req.status === 'pending') dept.pending_requests++;
        if (req.status === 'in-progress' || req.status === 'assigned') dept.in_progress_requests++;
        if (req.status === 'completed') dept.completed_requests++;

        // Calculate response time (acknowledged - created)
        if (req.acknowledged_at && req.created_at) {
          const responseTime = (new Date(req.acknowledged_at).getTime() - new Date(req.created_at).getTime()) / (1000 * 60);
          dept.total_response_time += responseTime;
          dept.response_count++;
        }

        // Calculate resolution time (completed - created)
        if (req.completed_at && req.created_at) {
          const resolutionTime = (new Date(req.completed_at).getTime() - new Date(req.created_at).getTime()) / (1000 * 60);
          dept.total_resolution_time += resolutionTime;
          dept.resolution_count++;
        }
      });

      const deptMetrics: DepartmentMetrics[] = Array.from(deptMap.values()).map(dept => ({
        department_id: dept.department_id,
        department_name: dept.department_name,
        department_code: dept.department_code,
        total_requests: dept.total_requests,
        pending_requests: dept.pending_requests,
        in_progress_requests: dept.in_progress_requests,
        completed_requests: dept.completed_requests,
        avg_response_time_minutes: dept.response_count > 0 ? dept.total_response_time / dept.response_count : null,
        avg_resolution_time_minutes: dept.resolution_count > 0 ? dept.total_resolution_time / dept.resolution_count : null,
        completion_rate: dept.total_requests > 0 ? (dept.completed_requests / dept.total_requests) * 100 : 0
      }));

      setDepartmentMetrics(deptMetrics);

      // Calculate staff performance
      const staffMap = new Map<string, any>();

      requests?.forEach((req) => {
        if (!req.assigned_to) return;

        if (!staffMap.has(req.assigned_to)) {
          staffMap.set(req.assigned_to, {
            staff_id: req.assigned_to,
            staff_name: req.assigned_to_name || 'Unknown',
            department_name: req.departments?.name || 'Unknown',
            requests_handled: 0,
            requests_completed: 0,
            total_rating: 0,
            rating_count: 0,
            total_resolution_time: 0,
            resolution_count: 0
          });
        }

        const staff = staffMap.get(req.assigned_to);
        staff.requests_handled++;

        if (req.status === 'completed') {
          staff.requests_completed++;

          if (req.rating) {
            staff.total_rating += req.rating;
            staff.rating_count++;
          }

          if (req.completed_at && req.created_at) {
            const resolutionTime = (new Date(req.completed_at).getTime() - new Date(req.created_at).getTime()) / (1000 * 60);
            staff.total_resolution_time += resolutionTime;
            staff.resolution_count++;
          }
        }
      });

      const staffPerf: StaffPerformance[] = Array.from(staffMap.values()).map(staff => ({
        staff_id: staff.staff_id,
        staff_name: staff.staff_name,
        department_name: staff.department_name,
        requests_handled: staff.requests_handled,
        requests_completed: staff.requests_completed,
        avg_rating: staff.rating_count > 0 ? staff.total_rating / staff.rating_count : null,
        avg_resolution_time_minutes: staff.resolution_count > 0 ? staff.total_resolution_time / staff.resolution_count : null
      }));

      setStaffPerformance(staffPerf);

      // Calculate totals
      setTotalRequests(requests?.length || 0);
      setTotalPending(requests?.filter(r => r.status === 'pending').length || 0);
      setTotalInProgress(requests?.filter(r => r.status === 'in-progress' || r.status === 'assigned').length || 0);
      setTotalCompleted(requests?.filter(r => r.status === 'completed').length || 0);

      // Calculate overall satisfaction
      const ratingsSum = requests?.reduce((sum, r) => sum + (r.rating || 0), 0) || 0;
      const ratingsCount = requests?.filter(r => r.rating !== null).length || 0;
      setOverallSatisfaction(ratingsCount > 0 ? ratingsSum / ratingsCount : null);

      logger.info('AdminMetrics', 'Admin metrics calculated');
    } catch (err: any) {
      logger.error('AdminMetrics', 'Fetch metrics error', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscription for all requests
    logger.info('AdminMetrics', 'Setting up real-time subscription for admin metrics');
    
    const subscription = supabase
      .channel('admin-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests'
        },
        (payload) => {
          logger.debug('AdminMetrics', 'Real-time update (admin)', payload);
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      logger.debug('AdminMetrics', 'Unsubscribing from real-time updates (admin)');
      subscription.unsubscribe();
    };
  }, [session?.user?.id, timeframe]);

  return {
    departmentMetrics,
    staffPerformance,
    totalRequests,
    totalPending,
    totalInProgress,
    totalCompleted,
    overallSatisfaction,
    loading,
    error,
    refetch: fetchMetrics,
    timeframe,
    setTimeframe
  };
};