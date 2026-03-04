// src/pages/staff/concierge/widgets/TransportationWidget.tsx
import React from 'react';
import { Car, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/api/supabase';
import { logger } from '../../../../core/utils/logger';

function useTransportRequests() {
  return useQuery({
    queryKey: ['staff', 'concierge', 'transport-requests'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('service_requests')
        .select('id, guest_name, room_number, title, description, status, priority, created_at')
        .eq('type', 'transportation')
        .in('status', ['pending', 'assigned', 'in_progress', 'completed'])
        .gte('created_at', `${today}T00:00:00`)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Transportation', 'Error fetching transport requests', { error });
        throw error;
      }

      return data || [];
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function TransportationWidget() {
  const { data: requests = [], isLoading } = useTransportRequests();

  const activeRequests = requests.filter((r: any) => ['pending', 'assigned', 'in_progress'].includes(r.status));
  const completedCount = requests.filter((r: any) => r.status === 'completed').length;

  const stats = {
    active: activeRequests.filter((r: any) => ['assigned', 'in_progress'].includes(r.status)).length,
    pending: activeRequests.filter((r: any) => r.status === 'pending').length,
    completed: completedCount,
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
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 border-b border-blue-200">
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-sm">Transportation</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-blue-50/50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-600">Today</p>
          </div>
        </div>
      </div>

      {/* Active Requests */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Active Requests
        </h4>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : activeRequests.length > 0 ? (
          <div className="space-y-2">
            {activeRequests.slice(0, 5).map((request: any) => (
              <div
                key={request.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900 text-sm">
                      {request.guest_name || `Room ${request.room_number}`}
                    </span>
                  </div>
                  {request.status === 'assigned' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                      Assigned
                    </span>
                  )}
                  {request.status === 'in_progress' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                      In Transit
                    </span>
                  )}
                  {request.status === 'pending' && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded border border-yellow-200">
                      Pending
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>{request.title || request.description || 'Transport request'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(request.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Car className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No active requests</p>
          </div>
        )}
      </div>

      {/* New Request Button */}
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-200">
          + New Transport Request
        </button>
      </div>
    </div>
  );
}
