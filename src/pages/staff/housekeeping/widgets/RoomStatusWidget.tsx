// src/pages/staff/housekeeping/widgets/RoomStatusWidget.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/api/supabase';
import { Loader2 } from 'lucide-react';

interface StatusCardProps {
  icon: string;
  label: string;
  count: number;
  color: 'green' | 'red' | 'blue' | 'gray';
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, label, count, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

const TOTAL_ROOMS = 120;
const HK_DEPT_ID = '00000000-0000-0000-0001-000000000001';

function useRoomStatus() {
  return useQuery({
    queryKey: ['room-status-widget'],
    queryFn: async () => {
      const [occupiedResult, hkRequestsResult] = await Promise.all([
        supabase
          .from('guests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
          .from('service_requests')
          .select('status')
          .eq('department_id', HK_DEPT_ID)
          .in('status', ['pending', 'assigned', 'in-progress']),
      ]);

      const occupied = occupiedResult.count || 0;
      const vacant = TOTAL_ROOMS - occupied;
      const hkRequests = hkRequestsResult.data || [];
      const inProgress = hkRequests.filter(r => r.status === 'in-progress').length;
      const dirty = hkRequests.filter(r => ['pending', 'assigned'].includes(r.status)).length;
      const clean = Math.max(0, vacant - dirty - inProgress);

      return { occupied, vacant, clean, dirty, inProgress };
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export const RoomStatusWidget: React.FC = () => {
  const { data, isLoading } = useRoomStatus();

  const occupied = data?.occupied ?? 0;
  const vacant = data?.vacant ?? 0;
  const clean = data?.clean ?? 0;
  const dirty = data?.dirty ?? 0;
  const inProgress = data?.inProgress ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
        Room Status Overview
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatusCard icon="✓" label="Clean" count={clean} color="green" />
            <StatusCard icon="!" label="Needs Cleaning" count={dirty} color="red" />
            <StatusCard icon="~" label="In Progress" count={inProgress} color="blue" />
            <StatusCard icon="=" label="Vacant" count={vacant} color="gray" />
          </div>

          {/* Occupancy Bar */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Occupancy</span>
              <span className="font-semibold">{Math.round((occupied / TOTAL_ROOMS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(occupied / TOTAL_ROOMS) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{occupied} Occupied</span>
              <span>{vacant} Vacant</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
