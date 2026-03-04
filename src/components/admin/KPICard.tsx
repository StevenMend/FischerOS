// src/components/admin/KPICard.tsx
import React from 'react';
import { LucideIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from 'lucide-react';
import { getKpiColor, getKpiGradient, getKpiProgressBar } from '../../lib/theme/variants';

interface KPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  detail: string;
  calculation: string;
  target: number;
  current: number;
  forecast: string;
  benchmark: string;
}

interface KPICardProps {
  kpis: KPI[];
  animationEnabled?: boolean;
}

export default function KPICard({ kpis, animationEnabled = true }: KPICardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div key={index} className={`group relative bg-gradient-to-br ${getKpiGradient(kpi.color)} backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-white/20 overflow-hidden`}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-20 h-20 bg-current rounded-full blur-2xl"></div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getKpiColor(kpi.color)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${kpi.trend === 'up' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                {kpi.trend === 'up' ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                <span>{kpi.change}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">{kpi.value}</div>
            <div className="text-sm font-medium text-gray-700 mb-3">{kpi.title}</div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Progress to Target</span>
                <span className="text-xs font-bold text-gray-700">{Math.round((kpi.current / kpi.target) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r ${getKpiProgressBar(kpi.color)} h-2 rounded-full transition-all duration-1000 ${animationEnabled ? 'animate-pulse' : ''}`}
                  style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                >
                  <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600 font-medium">{kpi.detail}</div>
              <div className="text-xs text-blue-600 font-medium">{kpi.forecast}</div>
              <div className="text-xs text-gray-500">{kpi.benchmark}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}