
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Utensils, Clock, CheckCircle, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../../lib/api/supabase';
import { useRestaurantStaff } from '../hooks/useRestaurantStaff';
import ReservationCard from '../components/ReservationCard';
import { logger } from '../../../../core/utils/logger';
import { useTenantNavigation } from '../../../../core/tenant/useTenantNavigation';

type TabType = 'pending' | 'confirmed' | 'seated' | 'completed';

export default function RestaurantStaffDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { navigateStaff } = useTenantNavigation();
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);

  logger.debug('Restaurants', 'RestaurantStaffDashboard rendering for slug', { slug });

  // Fetch restaurant data by slug
  useEffect(() => {
    const fetchRestaurantBySlug = async () => {
      if (!slug) {
        setRestaurantError('No restaurant slug provided');
        setLoadingRestaurant(false);
        return;
      }

      try {
        logger.debug('Restaurants', 'Fetching restaurant by slug', { slug });

        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name, slug')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (!data) {
          setRestaurantError('Restaurant not found');
          setLoadingRestaurant(false);
          return;
        }

        logger.info('Restaurants', 'Restaurant found', { data });

        setRestaurantId(data.id);
        setRestaurantName(data.name);
        setLoadingRestaurant(false);
      } catch (err: any) {
        logger.error('Restaurants', 'Error fetching restaurant', { error: err });
        setRestaurantError(err.message || 'Failed to load restaurant');
        setLoadingRestaurant(false);
      }
    };

    fetchRestaurantBySlug();
  }, [slug]);

  const {
    pendingReservations,
    confirmedReservations,
    seatedReservations,
    completedReservations,
    allReservations,
    loading: loadingReservations,
    error: reservationsError,
    confirmReservation,
    seatReservation,
    completeReservation,
    cancelReservation,
  } = useRestaurantStaff({ restaurantId: restaurantId || undefined });

  logger.debug('Restaurants', 'Dashboard state', {
    slug,
    restaurantId,
    restaurantName,
    pending: pendingReservations.length,
    confirmed: confirmedReservations.length,
    seated: seatedReservations.length,
    completed: completedReservations.length,
    total: allReservations.length,
    loadingRestaurant,
    loadingReservations,
    restaurantError,
    reservationsError,
  });

  // Loading State - Restaurant
  if (loadingRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading restaurant...</p>
          <p className="text-gray-500 text-sm mt-2">Setting up dashboard for {slug}</p>
        </div>
      </div>
    );
  }

  // Error State - Restaurant Not Found
  if (restaurantError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-xl mb-2">Restaurant Not Found</h3>
          <p className="text-red-600 text-sm mb-2">{restaurantError}</p>
          <p className="text-gray-500 text-xs mb-4">Slug: {slug}</p>
          <button
            onClick={() => navigateStaff('console')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            Go to Staff Console
          </button>
        </div>
      </div>
    );
  }

  // Loading State - Reservations
  if (loadingReservations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading reservations...</p>
          <p className="text-gray-500 text-sm mt-2">{restaurantName}</p>
        </div>
      </div>
    );
  }

  // Error State - Reservations
  if (reservationsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-xl mb-2 text-center">Error Loading Reservations</h3>
          <p className="text-red-600 text-sm text-center mb-4">{reservationsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const todayReservations = allReservations.filter((r) => {
    const reservationDate = new Date(r.reservation_date).toDateString();
    const today = new Date().toDateString();
    return reservationDate === today;
  });

  const upcomingToday = todayReservations.filter(
    (r) => r.status === 'pending' || r.status === 'confirmed'
  ).length;

  const currentlySeated = seatedReservations.length;

  return (
    <>
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 border-b border-amber-600 px-4 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{restaurantName}</h1>
                <p className="text-sm text-white/90">Restaurant Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-bold">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{upcomingToday}</p>
            <p className="text-xs text-gray-600">Today's Upcoming</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-2xl font-bold text-purple-600">{currentlySeated}</p>
            <p className="text-xs text-gray-600">Currently Seated</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {completedReservations.filter((r) => {
                const completedDate = new Date(r.completed_at || '').toDateString();
                const today = new Date().toDateString();
                return completedDate === today;
              }).length}
            </p>
            <p className="text-xs text-gray-600">Completed Today</p>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <nav className="lg:hidden sticky top-16 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="w-full px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {pendingReservations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('confirmed')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                activeTab === 'confirmed'
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmed</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {confirmedReservations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('seated')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                activeTab === 'seated'
                  ? 'bg-purple-50 text-purple-700 border-2 border-purple-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Seated</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'seated' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {seatedReservations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {completedReservations.length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Mobile View */}
        <div className="lg:hidden w-full px-4 py-4 space-y-4">
          {activeTab === 'pending' &&
            (pendingReservations.length > 0 ? (
              pendingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onConfirm={confirmReservation}
                  onCancel={cancelReservation}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No pending reservations</p>
              </div>
            ))}

          {activeTab === 'confirmed' &&
            (confirmedReservations.length > 0 ? (
              confirmedReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onSeat={seatReservation}
                  onCancel={cancelReservation}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No confirmed reservations</p>
              </div>
            ))}

          {activeTab === 'seated' &&
            (seatedReservations.length > 0 ? (
              seatedReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onComplete={completeReservation}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No seated guests</p>
              </div>
            ))}

          {activeTab === 'completed' &&
            (completedReservations.length > 0 ? (
              completedReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No completed reservations</p>
              </div>
            ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block w-full min-h-[calc(100vh-200px)] px-6 pb-6">
          <div className="grid grid-cols-4 gap-6 max-w-[2000px] mx-auto">
            {/* Pending Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Pending</h2>
                </div>
                <div className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-yellow-200 shadow-sm">
                  {pendingReservations.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                {pendingReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onConfirm={confirmReservation}
                    onCancel={cancelReservation}
                  />
                ))}
                {pendingReservations.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No pending</p>
                  </div>
                )}
              </div>
            </section>

            {/* Confirmed Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Confirmed</h2>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-blue-200 shadow-sm">
                  {confirmedReservations.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                {confirmedReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onSeat={seatReservation}
                    onCancel={cancelReservation}
                  />
                ))}
                {confirmedReservations.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No confirmed</p>
                  </div>
                )}
              </div>
            </section>

            {/* Seated Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Seated</h2>
                </div>
                <div className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-purple-200 shadow-sm">
                  {seatedReservations.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                {seatedReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onComplete={completeReservation}
                  />
                ))}
                {seatedReservations.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No seated guests</p>
                  </div>
                )}
              </div>
            </section>

            {/* Completed Column */}
            <section className="flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Completed</h2>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-green-200 shadow-sm">
                  {completedReservations.length}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                {completedReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
                {completedReservations.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No completed</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}