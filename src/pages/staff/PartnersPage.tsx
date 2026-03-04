import React from 'react';
import { Handshake, MapPin, Phone, Globe, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';

export default function PartnersPage() {
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ['staff', 'partners', 'tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('id, name, category, meeting_point, price_adult, rating, review_count, is_active')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60_000,
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  // Group by category as "partners"
  const categories = [...new Set(tours.map((t: any) => t.category))];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Partners Directory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <span className="text-2xl font-bold text-accent">{tours.length}</span>
          <p className="text-sm text-gray-600">Tour Partners</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <span className="text-2xl font-bold text-green-600">{categories.length}</span>
          <p className="text-sm text-gray-600">Categories</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <span className="text-2xl font-bold text-amber-600">
            {tours.length > 0 ? (tours.reduce((s: number, t: any) => s + (t.rating || 0), 0) / tours.length).toFixed(1) : '—'}
          </span>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700 flex items-center gap-2">
            <Handshake className="w-4 h-4 text-accent" />
            {cat}
          </div>
          <div className="divide-y divide-gray-100">
            {tours.filter((t: any) => t.category === cat).map((tour: any) => (
              <div key={tour.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">{tour.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    {tour.meeting_point && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tour.meeting_point}</span>}
                    <span>${tour.price_adult}/adult</span>
                  </div>
                </div>
                <div className="text-right">
                  {tour.rating && <p className="text-sm font-medium text-amber-600">{tour.rating} / 5</p>}
                  <p className="text-xs text-gray-400">{tour.review_count || 0} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {tours.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Handshake className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">No tour partners configured. Add tours in Settings.</p>
        </div>
      )}
    </div>
  );
}
