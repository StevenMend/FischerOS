// import React from 'react';
// import { Award, Clock, Settings, Activity } from 'lucide-react';

// interface ToursOperationalOverviewProps {
//   partnerReliability: string;
//   avgResponseTime: string;
//   equipmentAvailable: string;
//   activeBookings: number;
// }

// export const ToursOperationalOverview: React.FC<ToursOperationalOverviewProps> = ({
//   partnerReliability,
//   avgResponseTime,
//   equipmentAvailable,
//   activeBookings
// }) => {
//   return (
//     <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-2xl font-bold text-primary">{partnerReliability}</div>
//             <div className="text-sm text-gray-600">Partner Reliability</div>
//           </div>
//           <Award className="w-8 h-8 text-green-500" />
//         </div>
//       </div>
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-2xl font-bold text-primary">{avgResponseTime}</div>
//             <div className="text-sm text-gray-600">Avg Response Time</div>
//           </div>
//           <Clock className="w-8 h-8 text-blue-500" />
//         </div>
//       </div>
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-2xl font-bold text-primary">{equipmentAvailable}</div>
//             <div className="text-sm text-gray-600">Equipment Available</div>
//           </div>
//           <Settings className="w-8 h-8 text-orange-500" />
//         </div>
//       </div>
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-2xl font-bold text-primary">{activeBookings}</div>
//             <div className="text-sm text-gray-600">Active Bookings</div>
//           </div>
//           <Activity className="w-8 h-8 text-purple-500" />
//         </div>
//       </div>
//     </div>
//   );
// };

// src/components/tours/ToursOperationalOverview.tsx - MOBILE COMPACT
import React from 'react';
import { Award, Clock, Settings, Activity } from 'lucide-react';

interface ToursOperationalOverviewProps {
  partnerReliability: string;
  avgResponseTime: string;
  equipmentAvailable: string;
  activeBookings: number;
}

export const ToursOperationalOverview: React.FC<ToursOperationalOverviewProps> = ({
  partnerReliability,
  avgResponseTime,
  equipmentAvailable,
  activeBookings
}) => {
  return (
    <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-surface-dark">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold text-primary truncate">{partnerReliability}</div>
            <div className="text-[10px] sm:text-xs text-foreground/70 leading-tight">Partner Reliability</div>
          </div>
          <Award className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 flex-shrink-0 ml-2" />
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-surface-dark">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold text-primary truncate">{avgResponseTime}</div>
            <div className="text-[10px] sm:text-xs text-foreground/70 leading-tight">Avg Response Time</div>
          </div>
          <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 flex-shrink-0 ml-2" />
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-surface-dark">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold text-primary truncate">{equipmentAvailable}</div>
            <div className="text-[10px] sm:text-xs text-foreground/70 leading-tight">Equipment Available</div>
          </div>
          <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 flex-shrink-0 ml-2" />
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-surface-dark">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-bold text-primary truncate">{activeBookings}</div>
            <div className="text-[10px] sm:text-xs text-foreground/70 leading-tight">Active Bookings</div>
          </div>
          <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500 flex-shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );
};