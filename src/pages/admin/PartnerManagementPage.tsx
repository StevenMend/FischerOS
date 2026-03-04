import React from 'react';
import { Handshake, Star, Users, Palmtree, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';
import { useAdminProperty } from '../../hooks/admin/useAdminProperty';

export default function PartnerManagementPage() {
  const { data: property } = useAdminProperty();

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ['admin', 'partners', 'tours', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('id, name, slug, category, difficulty, price_adult, price_child, duration_hours, rating, review_count, max_participants, is_active, is_featured')
        .eq('property_id', property!.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!property?.id,
  });

  const { data: bookingStats = [] } = useQuery({
    queryKey: ['admin', 'partners', 'booking-stats', property?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_bookings')
        .select('tour_id, total_price, status')
        .eq('property_id', property!.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!property?.id,
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  const activeTours = tours.filter((t: any) => t.is_active);
  const totalRevenue = bookingStats.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0);
  const avgRating = tours.length > 0 ? tours.reduce((s: number, t: any) => s + (t.rating || 0), 0) / tours.filter((t: any) => t.rating).length : 0;

  // Bookings per tour
  const bookingsPerTour = new Map<string, { count: number; revenue: number }>();
  bookingStats.forEach((b: any) => {
    if (!bookingsPerTour.has(b.tour_id)) bookingsPerTour.set(b.tour_id, { count: 0, revenue: 0 });
    const t = bookingsPerTour.get(b.tour_id)!;
    t.count++;
    t.revenue += b.total_price || 0;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-accent">Partner Network</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-accent"><Palmtree className="w-5 h-5" /><span className="text-2xl font-bold">{activeTours.length}</span></div>
          <p className="text-sm text-gray-600 mt-1">Active Tours</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-green-600"><Users className="w-5 h-5" /><span className="text-2xl font-bold">{bookingStats.length}</span></div>
          <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-amber-600"><Star className="w-5 h-5" /><span className="text-2xl font-bold">{avgRating ? avgRating.toFixed(1) : '—'}</span></div>
          <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</span>
          <p className="text-sm text-gray-600 mt-1">Tour Revenue</p>
        </div>
      </div>

      {/* Tour Partners Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700 flex items-center gap-2">
          <Handshake className="w-4 h-4 text-accent" /> Tour Partners
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3">Tour</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Bookings</th>
                <th className="px-4 py-3">Revenue</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tours.map((tour: any) => {
                const tourStats = bookingsPerTour.get(tour.id) || { count: 0, revenue: 0 };
                return (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{tour.name}</td>
                    <td className="px-4 py-3 text-gray-600">{tour.category}</td>
                    <td className="px-4 py-3 text-gray-600">${tour.price_adult}</td>
                    <td className="px-4 py-3 text-gray-600">{tourStats.count}</td>
                    <td className="px-4 py-3 text-gray-600">${tourStats.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {tour.rating ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {tour.rating}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tour.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tour.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tours.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Handshake className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No tour partners. Add tours in Settings to manage partners.</p>
          </div>
        )}
      </div>
    </div>
  );
}
