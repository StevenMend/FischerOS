// src/features/restaurants/staff/components/RestaurantRedirect.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../../../lib/api/supabase';
import { useAuthStore } from '../../../../lib/stores/useAuthStore';
import { Utensils, AlertTriangle } from 'lucide-react';
import { logger } from '../../../../core/utils/logger';

interface StaffRestaurantInfo {
  restaurant_id: string | null;
  restaurant_slug: string | null;
  restaurant_name: string | null;
}

/**
 * RestaurantRedirect Component
 * 
 * This component redirects staff to their assigned restaurant dashboard.
 * - If staff has restaurant_id: Redirect to /staff/restaurant/:slug
 * - If staff has NO restaurant: Show error message
 * 
 * Usage: <Route path="/restaurant" element={<RestaurantRedirect />} />
 */
export default function RestaurantRedirect() {
  const session = useAuthStore((state) => state.session);
  const [loading, setLoading] = useState(true);
  const [staffInfo, setStaffInfo] = useState<StaffRestaurantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffRestaurant = async () => {
      if (!session?.user?.id) {
        setError('No active session');
        setLoading(false);
        return;
      }

      try {
        logger.info('RestaurantRedirect', 'Fetching restaurant assignment', session.user.id);

        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select(`
            id,
            restaurant_id,
            restaurants (
              slug,
              name
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (staffError) throw staffError;

        if (!staffData.restaurant_id || !staffData.restaurants) {
          setError('not_assigned');
          setLoading(false);
          return;
        }

        setStaffInfo({
          restaurant_id: staffData.restaurant_id,
          restaurant_slug: staffData.restaurants.slug,
          restaurant_name: staffData.restaurants.name,
        });

        logger.info('RestaurantRedirect', 'Staff restaurant found', {
          id: staffData.restaurant_id,
          slug: staffData.restaurants.slug,
          name: staffData.restaurants.name,
        });

        setLoading(false);
      } catch (err: any) {
        logger.error('RestaurantRedirect', 'Error fetching staff restaurant', err);
        setError(err.message || 'Failed to load restaurant assignment');
        setLoading(false);
      }
    };

    fetchStaffRestaurant();
  }, [session?.user?.id]);

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading your restaurant...</p>
          <p className="text-gray-500 text-sm mt-2">Just a moment</p>
        </div>
      </div>
    );
  }

  // Error State - Not Assigned
  if (error === 'not_assigned') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-8 max-w-md shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-amber-800 font-bold text-xl mb-2">No Restaurant Assigned</h3>
          <p className="text-amber-600 text-sm mb-4">
            You are not assigned to any restaurant. Please contact your manager to get assigned to a restaurant.
          </p>
          <button
            onClick={() => window.location.href = '/staff/console'}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            Go to Staff Console
          </button>
        </div>
      </div>
    );
  }

  // Error State - Other Errors
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-xl mb-2">Error Loading Restaurant</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success - Redirect to Restaurant Dashboard
  if (staffInfo?.restaurant_slug) {
    logger.info('RestaurantRedirect', `Redirecting to /staff/restaurant/${staffInfo.restaurant_slug}`);
    return <Navigate to={`/staff/restaurant/${staffInfo.restaurant_slug}`} replace />;
  }

  // Fallback
  return <Navigate to="/staff/console" replace />;
}