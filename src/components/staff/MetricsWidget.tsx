// src/components/staff/MetricsWidget.tsx - PRO VERSION WITH REAL CALCULATIONS
import React, { useMemo } from 'react';
import { Target, Star, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { logger } from '../../core/utils/logger';

interface ServiceRequest {
  id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  rating: number | null;
}

interface MetricsWidgetProps {
  allRequests: ServiceRequest[];
}

export default function MetricsWidget({ allRequests }: MetricsWidgetProps) {
  logger.debug('MetricsWidget', 'calculating', { totalRequests: allRequests.length });

  const metrics = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Filter today's requests
    const todayRequests = allRequests.filter(r => 
      new Date(r.created_at) >= todayStart
    );
    
    // Calculate completed today
    const completedToday = todayRequests.filter(r => r.status === 'completed');
    
    // Calculate average response time (created → completed)
    const completedWithTime = completedToday.filter(r => r.completed_at);
    const avgTimeMs = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, r) => {
          const created = new Date(r.created_at).getTime();
          const completed = new Date(r.completed_at!).getTime();
          return sum + (completed - created);
        }, 0) / completedWithTime.length
      : 0;
    
    const avgTimeMins = Math.round(avgTimeMs / 60000);
    const avgTimeDisplay = avgTimeMins < 60 
      ? `${avgTimeMins} min` 
      : `${Math.floor(avgTimeMins / 60)}h ${avgTimeMins % 60}m`;
    
    // Calculate satisfaction
    const rated = completedToday.filter(r => r.rating !== null);
    const avgRating = rated.length > 0
      ? (rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length).toFixed(1)
      : '0.0';
    
    // Target (configurable - could come from settings)
    const target = 25;
    const progressPercentage = Math.min(Math.round((completedToday.length / target) * 100), 100);
    
    logger.debug('MetricsWidget', 'Metrics calculated', {
      todayTotal: todayRequests.length,
      completed: completedToday.length,
      avgTime: avgTimeDisplay,
      avgRating,
      progress: progressPercentage
    });
    
    return {
      todayTotal: todayRequests.length,
      completed: completedToday.length,
      avgTime: avgTimeDisplay,
      satisfaction: avgRating,
      target,
      progressPercentage
    };
  }, [allRequests]);

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
            <Target className="w-4 h-4 text-white" />
          </div>
          Today's Performance
        </h3>
        
        <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Completed */}
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:scale-105 transition-all duration-200">
          <div className="text-2xl font-bold text-blue-600">
            {metrics.completed}/{metrics.target}
          </div>
          <div className="text-xs text-gray-600 font-medium">Completed</div>
        </div>

        {/* Avg Time */}
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-center space-x-1">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-green-600">{metrics.avgTime}</span>
          </div>
          <div className="text-xs text-gray-600 font-medium text-center">Avg Time</div>
        </div>

        {/* Satisfaction */}
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-2xl font-bold text-gray-900">{metrics.satisfaction}</span>
          </div>
          <div className="text-xs text-gray-600 font-medium text-center">Rating</div>
        </div>

        {/* Progress */}
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:scale-105 transition-all duration-200">
          <div className="text-2xl font-bold text-purple-600">{metrics.progressPercentage}%</div>
          <div className="text-xs text-gray-600 font-medium">To Target</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-700">Daily Goal Progress</span>
          <BarChart3 className="w-4 h-4 text-blue-600" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-green-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${metrics.progressPercentage}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500">{metrics.target}</span>
        </div>
      </div>
    </div>
  );
}