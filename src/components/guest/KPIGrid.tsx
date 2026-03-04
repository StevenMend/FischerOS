// src/components/guest/KPIGrid.tsx - MINIMAL STYLE
import React from 'react';
import { TrendingUp, LucideIcon, Calendar, Crown, Star, Gift } from 'lucide-react';

interface KPI {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: LucideIcon;
}

interface KPIGridProps {
  kpis?: KPI[];
}

export default function KPIGrid({ kpis }: KPIGridProps) {
  const defaultKpis: KPI[] = [
    {
      title: 'Active Bookings',
      value: '3',
      trend: '+1',
      trendDirection: 'up',
      icon: Calendar
    },
    {
      title: 'Loyalty Points',
      value: '2,450',
      trend: '+150',
      trendDirection: 'up',
      icon: Crown
    },
    {
      title: 'Satisfaction',
      value: '4.9/5',
      trend: '+0.2',
      trendDirection: 'up',
      icon: Star
    },
    {
      title: 'Savings',
      value: '$340',
      trend: '+$85',
      trendDirection: 'up',
      icon: Gift
    }
  ];

  const data = kpis || defaultKpis;

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground font-display mb-4">Your Dashboard</h2>
        <p className="text-foreground/80 text-lg">Track your resort experience at a glance</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((kpi, index) => (
          <div key={index} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-surface-dark shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center">
                <kpi.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>{kpi.trend}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {kpi.value}
              </div>
              <div className="text-sm font-medium text-foreground/70">
                {kpi.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}