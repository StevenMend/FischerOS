// src/components/admin/OperationsMonitor.tsx
import React from 'react';
import { Monitor, Eye, Radar, Star } from 'lucide-react';
import { getStatusBadge, getHeatMapColor, getEfficiencyColor } from '../../lib/theme/variants';

interface ResortArea {
  area: string;
  status: 'optimal' | 'attention' | 'crisis';
  load: number;
  issues: number;
  revenue: string;
}

interface Department {
  name: string;
  status: 'optimal' | 'high' | 'normal';
  load: number;
  revenue: string;
  efficiency: number;
  trend: string;
  alerts: number;
  satisfaction: number;
}

interface OperationsMonitorProps {
  resortHeatMap: ResortArea[];
  departmentStatus: Department[];
  showHeatMap: boolean;
  onToggleHeatMap: () => void;
}

export default function OperationsMonitor({ 
  resortHeatMap, 
  departmentStatus, 
  showHeatMap, 
  onToggleHeatMap 
}: OperationsMonitorProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-[1.01] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            Live Operations Monitor
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleHeatMap}
              className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <Eye className="w-4 h-4 text-primary" />
            </button>
            <div className="flex items-center space-x-1 bg-green-500/20 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
        
        {/* Resort Heat Map */}
        {showHeatMap && (
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl border border-white/30">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
              <Radar className="w-4 h-4 mr-2 text-blue-600" />
              Resort Heat Map
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {resortHeatMap.map((area, index) => (
                <div key={index} className="group/area flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getHeatMapColor(area.status)} shadow-lg group-hover/area:scale-125 transition-transform duration-300`}></div>
                    <span className="text-xs font-bold text-gray-800">{area.area}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${getEfficiencyColor(area.load)}`}>{area.load}%</div>
                    {area.issues > 0 && (
                      <div className="text-xs text-red-600 font-medium">{area.issues} issues</div>
                    )}
                    <div className="text-xs text-gray-600 font-medium">{area.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {departmentStatus.map((dept, index) => (
            <div key={index} className="group/dept flex items-center justify-between p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full shadow-lg group-hover/dept:scale-125 transition-transform duration-300 ${
                  dept.status === 'optimal' ? 'bg-green-500' :
                  dept.status === 'high' ? 'bg-yellow-500' :
                  dept.status === 'normal' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <span className="font-bold text-gray-900">{dept.name}</span>
                {dept.alerts > 0 && (
                  <div className="bg-red-500/20 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                    {dept.alerts} alerts
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-800">{dept.revenue}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium text-gray-600">{dept.satisfaction}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(dept.status)}`}>
                  {dept.status}
                </span>
                <span className={`text-sm font-bold ${getEfficiencyColor(dept.load)}`}>{dept.load}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/30">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl">
              <div className="text-xl font-bold text-green-600">94%</div>
              <div className="text-xs text-gray-700 font-medium">Avg Efficiency</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl">
              <div className="text-xl font-bold text-blue-600">12 min</div>
              <div className="text-xs text-gray-700 font-medium">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}