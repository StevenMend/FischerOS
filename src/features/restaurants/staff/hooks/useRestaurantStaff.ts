// // src/features/restaurants/staff/hooks/useRestaurantStaff.ts - FIXED
// import { useState, useEffect, useMemo } from 'react';
// import { supabase } from '../../../../lib/api/supabase';
// import { useAuthStore } from '../../../../lib/stores/useAuthStore';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import type { RestaurantReservation, UpdateReservationStatusDTO } from '../../api/types';
// import { ToastService } from '../../../../lib/services';

// interface StaffRestaurantInfo {
//   id: string;
//   name: string;
//   restaurant_id: string | null;
//   restaurant_name: string | null;
// }

// interface UseRestaurantStaffResult {
//   pendingReservations: RestaurantReservation[];
//   confirmedReservations: RestaurantReservation[];
//   seatedReservations: RestaurantReservation[];
//   completedReservations: RestaurantReservation[];
//   allReservations: RestaurantReservation[];
//   loading: boolean;
//   error: string | null;
//   refetch: () => Promise<void>;
//   confirmReservation: (reservationId: string, tableNumber?: string) => Promise<void>;
//   seatReservation: (reservationId: string) => Promise<void>;
//   completeReservation: (reservationId: string) => Promise<void>;
//   cancelReservation: (reservationId: string, reason: string) => Promise<void>;
//   myRestaurantId: string | null;
//   myRestaurantName: string | null;
// }

// async function fetchRestaurantReservations(restaurantId: string): Promise<RestaurantReservation[]> {
//   console.log('🍽️ Fetching reservations for restaurant:', restaurantId);

//   const { data, error } = await supabase
//     .from('restaurant_reservations')
//     .select(`
//       *,
//       restaurants (
//         name,
//         cuisine,
//         location
//       )
//     `)
//     .eq('restaurant_id', restaurantId)
//     .order('reservation_date', { ascending: true })
//     .order('time_slot', { ascending: true });

//   if (error) throw error;

//   console.log('✅ Fetched reservations:', data?.length || 0);
//   return data || [];
// }

// async function updateReservationStatus(
//   reservationId: string, 
//   updates: UpdateReservationStatusDTO
// ): Promise<RestaurantReservation> {
//   console.log('📝 Updating reservation status:', { reservationId, updates });

//   const payload: any = {
//     status: updates.status,
//     updated_at: new Date().toISOString(),
//   };

//   if (updates.status === 'confirmed') {
//     payload.confirmed_at = new Date().toISOString();
//   } else if (updates.status === 'seated') {
//     payload.seated_at = new Date().toISOString();
//   } else if (updates.status === 'completed') {
//     payload.completed_at = new Date().toISOString();
//   } else if (updates.status === 'cancelled') {
//     payload.cancelled_at = new Date().toISOString();
//     payload.cancellation_reason = updates.cancellation_reason;
//   }

//   if (updates.table_number) {
//     payload.table_number = updates.table_number;
//   }

//   const { data, error } = await supabase
//     .from('restaurant_reservations')
//     .update(payload)
//     .eq('id', reservationId)
//     .select()
//     .single();

//   if (error) throw error;

//   console.log('✅ Reservation updated:', data);
//   return data;
// }

// export const useRestaurantStaff = (): UseRestaurantStaffResult => {
//   const session = useAuthStore((state) => state.session);
//   const queryClient = useQueryClient();
//   const [staffInfo, setStaffInfo] = useState<StaffRestaurantInfo | null>(null);

//   useEffect(() => {
//     const fetchStaffInfo = async () => {
//       if (!session?.user?.id) return;

//       try {
//         // ✅ FIX: Leer restaurant_id directamente de la columna
//         const { data: staffData, error: staffError } = await supabase
//           .from('staff')
//           .select(`
//             id,
//             name,
//             restaurant_id,
//             restaurants (
//               name
//             )
//           `)
//           .eq('id', session.user.id)
//           .single();

//         if (staffError) throw staffError;

//         setStaffInfo({
//           id: staffData.id,
//           name: staffData.name,
//           restaurant_id: staffData.restaurant_id,
//           restaurant_name: staffData.restaurants?.name || null,
//         });

//         console.log('✅ Staff info loaded:', { 
//           name: staffData.name, 
//           restaurant: staffData.restaurants?.name 
//         });
//       } catch (err: any) {
//         console.error('❌ Error fetching staff info:', err);
//       }
//     };

//     fetchStaffInfo();
//   }, [session?.user?.id]);

//   const {
//     data: allReservations = [],
//     isLoading: loading,
//     error: queryError,
//     refetch,
//   } = useQuery({
//     queryKey: ['restaurant-staff-reservations', staffInfo?.restaurant_id],
//     queryFn: () => fetchRestaurantReservations(staffInfo!.restaurant_id!),
//     enabled: !!staffInfo?.restaurant_id,
//     staleTime: 1000 * 30,
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ reservationId, updates }: { 
//       reservationId: string; 
//       updates: UpdateReservationStatusDTO 
//     }) => updateReservationStatus(reservationId, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ 
//         queryKey: ['restaurant-staff-reservations', staffInfo?.restaurant_id] 
//       });
//       ToastService.success('Updated successfully');
//     },
//     onError: (error: any) => {
//       console.error('❌ Update failed:', error);
//       ToastService.error('Update failed', error.message);
//     },
//   });

//   const pendingReservations = useMemo(
//     () => allReservations.filter((r) => r.status === 'pending'),
//     [allReservations]
//   );

//   const confirmedReservations = useMemo(
//     () => allReservations.filter((r) => r.status === 'confirmed'),
//     [allReservations]
//   );

//   const seatedReservations = useMemo(
//     () => allReservations.filter((r) => r.status === 'seated'),
//     [allReservations]
//   );

//   const completedReservations = useMemo(
//     () => allReservations.filter((r) => r.status === 'completed'),
//     [allReservations]
//   );

//   const confirmReservation = async (reservationId: string, tableNumber?: string) => {
//     await updateMutation.mutateAsync({
//       reservationId,
//       updates: { status: 'confirmed', table_number: tableNumber },
//     });
//   };

//   const seatReservation = async (reservationId: string) => {
//     await updateMutation.mutateAsync({
//       reservationId,
//       updates: { status: 'seated' },
//     });
//   };

//   const completeReservation = async (reservationId: string) => {
//     await updateMutation.mutateAsync({
//       reservationId,
//       updates: { status: 'completed' },
//     });
//   };

//   const cancelReservation = async (reservationId: string, reason: string) => {
//     await updateMutation.mutateAsync({
//       reservationId,
//       updates: { status: 'cancelled', cancellation_reason: reason },
//     });
//   };

//   return {
//     pendingReservations,
//     confirmedReservations,
//     seatedReservations,
//     completedReservations,
//     allReservations,
//     loading,
//     error: queryError?.message || null,
//     refetch: async () => { await refetch(); },
//     confirmReservation,
//     seatReservation,
//     completeReservation,
//     cancelReservation,
//     myRestaurantId: staffInfo?.restaurant_id || null,
//     myRestaurantName: staffInfo?.restaurant_name || null,
//   };
// };
// src/features/restaurants/staff/hooks/useRestaurantStaff.ts - REFACTORED FOR DYNAMIC RESTAURANTS
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../lib/api/supabase';
import { useAuthStore } from '../../../../lib/stores/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RestaurantReservation, UpdateReservationStatusDTO } from '../../api/types';
import { ToastService } from '../../../../lib/services';
import { logger } from '../../../../core/utils/logger';

interface StaffRestaurantInfo {
  id: string;
  name: string;
  restaurant_id: string | null;
  restaurant_slug: string | null;
  restaurant_name: string | null;
}

interface UseRestaurantStaffParams {
  /**
   * Restaurant ID to load reservations for.
   * - If provided: Load this specific restaurant (for dynamic routes)
   * - If NOT provided: Load staff's assigned restaurant (fallback)
   */
  restaurantId?: string;
}

interface UseRestaurantStaffResult {
  pendingReservations: RestaurantReservation[];
  confirmedReservations: RestaurantReservation[];
  seatedReservations: RestaurantReservation[];
  completedReservations: RestaurantReservation[];
  allReservations: RestaurantReservation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirmReservation: (reservationId: string, tableNumber?: string) => Promise<void>;
  seatReservation: (reservationId: string) => Promise<void>;
  completeReservation: (reservationId: string) => Promise<void>;
  cancelReservation: (reservationId: string, reason: string) => Promise<void>;
  myRestaurantId: string | null;
  myRestaurantSlug: string | null;
  myRestaurantName: string | null;
  activeRestaurantId: string | null; // The restaurant currently being managed
}

async function fetchRestaurantReservations(restaurantId: string): Promise<RestaurantReservation[]> {
  logger.debug('Restaurants', 'Fetching reservations for restaurant', { restaurantId });

  const { data, error } = await supabase
    .from('restaurant_reservations')
    .select(`
      *,
      restaurants (
        name,
        cuisine,
        location
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('reservation_date', { ascending: true })
    .order('time_slot', { ascending: true });

  if (error) throw error;

  logger.info('RestaurantStaff', 'Fetched reservations', data?.length || 0);
  return data || [];
}

async function updateReservationStatus(
  reservationId: string, 
  updates: UpdateReservationStatusDTO
): Promise<RestaurantReservation> {
  logger.info('RestaurantStaff', 'Updating reservation status', { reservationId, updates });

  const payload: any = {
    status: updates.status,
    updated_at: new Date().toISOString(),
  };

  if (updates.status === 'confirmed') {
    payload.confirmed_at = new Date().toISOString();
  } else if (updates.status === 'seated') {
    payload.seated_at = new Date().toISOString();
  } else if (updates.status === 'completed') {
    payload.completed_at = new Date().toISOString();
  } else if (updates.status === 'cancelled') {
    payload.cancelled_at = new Date().toISOString();
    payload.cancellation_reason = updates.cancellation_reason;
  }

  if (updates.table_number) {
    payload.table_number = updates.table_number;
  }

  const { data, error } = await supabase
    .from('restaurant_reservations')
    .update(payload)
    .eq('id', reservationId)
    .select()
    .single();

  if (error) throw error;

  logger.info('RestaurantStaff', 'Reservation updated', data);
  return data;
}

/**
 * useRestaurantStaff Hook
 * 
 * Manages restaurant reservations for staff members.
 * 
 * @param params - Optional parameters
 * @param params.restaurantId - Specific restaurant ID to manage (for dynamic routes)
 * 
 * @example
 * // Option 1: Use staff's assigned restaurant (fallback)
 * const { ... } = useRestaurantStaff();
 * 
 * @example
 * // Option 2: Manage specific restaurant (dynamic route)
 * const { restaurantId } = useParams();
 * const { ... } = useRestaurantStaff({ restaurantId });
 */
export const useRestaurantStaff = (
  params: UseRestaurantStaffParams = {}
): UseRestaurantStaffResult => {
  const { restaurantId: paramRestaurantId } = params;
  const session = useAuthStore((state) => state.session);
  const queryClient = useQueryClient();
  const [staffInfo, setStaffInfo] = useState<StaffRestaurantInfo | null>(null);

  // Fetch staff's assigned restaurant info
  useEffect(() => {
    const fetchStaffInfo = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select(`
            id,
            name,
            restaurant_id,
            restaurants (
              slug,
              name
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (staffError) throw staffError;

        setStaffInfo({
          id: staffData.id,
          name: staffData.name,
          restaurant_id: staffData.restaurant_id,
          restaurant_slug: staffData.restaurants?.slug || null,
          restaurant_name: staffData.restaurants?.name || null,
        });

        logger.info('RestaurantStaff', 'Staff info loaded', {
          name: staffData.name,
          restaurant: staffData.restaurants?.name,
          slug: staffData.restaurants?.slug,
        });
      } catch (err: any) {
        logger.error('RestaurantStaff', 'Error fetching staff info', err);
      }
    };

    fetchStaffInfo();
  }, [session?.user?.id]);

  // Determine which restaurant to manage
  // Priority: paramRestaurantId > staffInfo.restaurant_id
  const activeRestaurantId = paramRestaurantId || staffInfo?.restaurant_id || null;

  logger.debug('RestaurantStaff', 'Active Restaurant ID', {
    param: paramRestaurantId,
    staff: staffInfo?.restaurant_id,
    active: activeRestaurantId,
  });

  // Fetch reservations for the active restaurant
  const {
    data: allReservations = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['restaurant-staff-reservations', activeRestaurantId],
    queryFn: () => fetchRestaurantReservations(activeRestaurantId!),
    enabled: !!activeRestaurantId,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Mutation for updating reservation status
  const updateMutation = useMutation({
    mutationFn: ({ reservationId, updates }: { 
      reservationId: string; 
      updates: UpdateReservationStatusDTO 
    }) => updateReservationStatus(reservationId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['restaurant-staff-reservations', activeRestaurantId] 
      });
      ToastService.success('Updated successfully');
    },
    onError: (error: any) => {
      logger.error('RestaurantStaff', 'Update failed', error);
      ToastService.error('Update failed', error.message);
    },
  });

  // Filtered reservations by status
  const pendingReservations = useMemo(
    () => allReservations.filter((r) => r.status === 'pending'),
    [allReservations]
  );

  const confirmedReservations = useMemo(
    () => allReservations.filter((r) => r.status === 'confirmed'),
    [allReservations]
  );

  const seatedReservations = useMemo(
    () => allReservations.filter((r) => r.status === 'seated'),
    [allReservations]
  );

  const completedReservations = useMemo(
    () => allReservations.filter((r) => r.status === 'completed'),
    [allReservations]
  );

  // Actions
  const confirmReservation = async (reservationId: string, tableNumber?: string) => {
    await updateMutation.mutateAsync({
      reservationId,
      updates: { status: 'confirmed', table_number: tableNumber },
    });
  };

  const seatReservation = async (reservationId: string) => {
    await updateMutation.mutateAsync({
      reservationId,
      updates: { status: 'seated' },
    });
  };

  const completeReservation = async (reservationId: string) => {
    await updateMutation.mutateAsync({
      reservationId,
      updates: { status: 'completed' },
    });
  };

  const cancelReservation = async (reservationId: string, reason: string) => {
    await updateMutation.mutateAsync({
      reservationId,
      updates: { status: 'cancelled', cancellation_reason: reason },
    });
  };

  return {
    pendingReservations,
    confirmedReservations,
    seatedReservations,
    completedReservations,
    allReservations,
    loading,
    error: queryError?.message || null,
    refetch: async () => { await refetch(); },
    confirmReservation,
    seatReservation,
    completeReservation,
    cancelReservation,
    myRestaurantId: staffInfo?.restaurant_id || null,
    myRestaurantSlug: staffInfo?.restaurant_slug || null,
    myRestaurantName: staffInfo?.restaurant_name || null,
    activeRestaurantId,
  };
};