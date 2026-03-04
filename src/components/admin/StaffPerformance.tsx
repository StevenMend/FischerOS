// src/components/admin/StaffPerformance.tsx
import React from 'react';
import { Award, Star, TrendingUp as TrendingUpIcon, Maximize2, Minimize2 } from 'lucide-react';
import { getPerformanceBadge, getEfficiencyColor } from '../../lib/theme/variants';

interface StaffMember {
  name: string;
  department: string;
  rating: number;
  completed: number;
  avgTime: string;
  efficiency: number;
  trainingNeeds: string[];
  schedule: string;
  revenue: string;
  growth: string;
  streak: number;
  certifications: string[];
  performance: 'exceptional' | 'excellent' | 'good';
}

interface StaffPerformanceProps {
  staffPerformance: StaffMember[];
  expandedChart: string | null;
  onToggleExpand: () => void;
  onSelectStaff: (staff: StaffMember) => void;
}

export default function StaffPerformance({
  staffPerformance,
  expandedChart,
  onToggleExpand,
  onSelectStaff
}: StaffPerformanceProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-[1.01] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-4 h-4 text-white" />
            </div>
            Staff Performance
          </h2>
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-purple-100 rounded-lg transition-all duration-300 hover:scale-110"
          >
            {expandedChart === 'staff'
              ? <Minimize2 className="w-4 h-4 text-purple-600" />
              : <Maximize2 className="w-4 h-4 text-purple-600" />}
          </button>
        </div>

        <div className="space-y-3">
          {staffPerformance.slice(0, 4).map((staff, index) => (
            <div
              key={index}
              className="group/staff p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => onSelectStaff(staff)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-bold text-gray-900 text-sm">{staff.name}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getPerformanceBadge(staff.performance)}`}>
                      {staff.performance}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">{staff.department}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{staff.rating}</span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">{staff.completed} completed</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className={`text-sm font-bold ${getEfficiencyColor(staff.efficiency)}`}>{staff.efficiency}%</div>
                  <div className="text-xs text-gray-600">Efficiency</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-sm font-bold text-green-600">{staff.revenue}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-sm font-bold text-blue-600">{staff.streak}</div>
                  <div className="text-xs text-gray-600">Streak</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <div className="flex items-center space-x-1 bg-green-500/20 text-green-700 px-2 py-1 rounded-full font-bold">
                    <TrendingUpIcon className="w-3 h-3" />
                    <span>{staff.growth}</span>
                  </div>
                  {staff.trainingNeeds.length > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
                      Training needed
                    </span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full ${
                  staff.schedule === 'Optimal'
                    ? 'bg-green-100 text-green-700 font-bold'
                    : staff.schedule === 'Underutilized'
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'bg-orange-100 text-orange-700 font-bold'
                } shadow-sm`}>
                  {staff.schedule}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/30">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl">
              <div className="text-xl font-bold text-yellow-600">4.8</div>
              <div className="text-xs text-gray-700 font-medium">Avg Rating</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl">
              <div className="text-xl font-bold text-blue-600">11 min</div>
              <div className="text-xs text-gray-700 font-medium">Avg Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}