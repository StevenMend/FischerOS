// src/components/admin/RevenueAnalytics.tsx
import React from 'react';
import { BarChart3, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Maximize2, Minimize2 } from 'lucide-react';
import { getEfficiencyColor, getEfficiencyGradient } from '../../lib/theme/variants';

interface RevenueItem {
  service: string;
  revenue: string;
  margin: string;
  upsell: string;
  trend: 'up' | 'down';
  details: string;
  growth: string;
  forecast: string;
  efficiency: number;
}

interface RevenueAnalyticsProps {
  revenueBreakdown: RevenueItem[];
  expandedChart: string | null;
  onToggleExpand: () => void;
}

export default function RevenueAnalytics({ 
  revenueBreakdown, 
  expandedChart, 
  onToggleExpand 
}: RevenueAnalyticsProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-[1.01] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 bg-green-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            Revenue Analytics
          </h2>
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-green-100 rounded-lg transition-all duration-300 hover:scale-110"
          >
            {expandedChart === 'revenue' ? <Minimize2 className="w-4 h-4 text-green-600" /> : <Maximize2 className="w-4 h-4 text-green-600" />}
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {revenueBreakdown.map((item, index) => (
            <div key={index} className="group/revenue p-4 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-800">{item.service}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-green-600">{item.revenue}</span>
                  {item.trend === 'up' ? (
                    <div className="flex items-center space-x-1 bg-green-500/20 text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                      <TrendingUpIcon className="w-3 h-3" />
                      <span>{item.growth}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 bg-red-500/20 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                      <TrendingDownIcon className="w-3 h-3" />
                      <span>{item.growth}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Efficiency Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 font-medium">Efficiency</span>
                  <span className={`text-xs font-bold ${getEfficiencyColor(item.efficiency)}`}>{item.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${getEfficiencyGradient(item.efficiency)} h-1.5 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.efficiency}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="font-bold text-gray-800">{item.margin}</div>
                  <div className="text-gray-600">Margin</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="font-bold text-gray-800">{item.upsell}</div>
                  <div className="text-gray-600">Upsell</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="font-bold text-blue-600">{item.forecast}</div>
                  <div className="text-gray-600">Forecast</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 italic font-medium">{item.details}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/30">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl">
              <div className="text-xl font-bold text-green-600">+18%</div>
              <div className="text-xs text-gray-700 font-medium">vs Yesterday</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl">
              <div className="text-xl font-bold text-blue-600">$47K</div>
              <div className="text-xs text-gray-700 font-medium">Today Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}