// src/pages/staff/concierge/widgets/TourCoordinationWidget.tsx
import React from 'react';
import { MapPin, Users, Calendar, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/api/supabase';
import { logger } from '../../../../core/utils/logger';

function useTodayTourBookings() {
  return useQuery({
    queryKey: ['staff', 'concierge', 'tour-bookings-today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('tour_bookings')
        .select('id, booking_date, number_of_guests, status, total_price, tours(name)')
        .gte('booking_date', `${today}T00:00:00`)
        .lte('booking_date', `${today}T23:59:59`)
        .order('booking_date', { ascending: true });

      if (error) {
        logger.error('TourCoordination', 'Error fetching today tour bookings', { error });
        throw error;
      }

      return data || [];
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function TourCoordinationWidget() {
  const { data: bookings = [], isLoading } = useTodayTourBookings();

  const stats = {
    todayBookings: bookings.length,
    confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
    pending: bookings.filter((b: any) => b.status === 'pending').length,
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 border-b border-indigo-200">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-sm">Tour Coordination</h3>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 bg-indigo-50/50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-1 shadow-sm border border-indigo-100">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xl font-bold text-indigo-600">{stats.todayBookings}</p>
            <p className="text-xs text-gray-600">Today</p>
          </div>

          <div className="text-center border-x border-gray-200">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-1 shadow-sm border border-green-100">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl font-bold text-green-600">{stats.confirmed}</p>
            <p className="text-xs text-gray-600">Confirmed</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-1 shadow-sm border border-yellow-100">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
        </div>
      </div>

      {/* Upcoming Tours */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Upcoming Tours Today
        </h4>

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-2">
            {bookings.slice(0, 5).map((booking: any) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    {booking.tours?.name || 'Tour'}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{booking.number_of_guests} guests</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(booking.booking_date)}</span>
                    </span>
                  </div>
                </div>

                <div>
                  {booking.status === 'confirmed' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                      Confirmed
                    </span>
                  )}
                  {booking.status === 'pending' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg border border-yellow-200">
                      Pending
                    </span>
                  )}
                  {booking.status === 'in_progress' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No tours scheduled today</p>
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="px-4 pb-4">
        <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-semibold transition-colors border border-indigo-200">
          View All Tours
        </button>
      </div>
    </div>
  );
}
