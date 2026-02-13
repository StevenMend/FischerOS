// ============================================
// OPERATIONAL OVERVIEW - Simplified (Phase B.1)
// ============================================

import React from 'react';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';

interface OperationalOverviewProps {
  totalRestaurants: number;
  avgRating: number;
  featuredCount: number;
}

export const OperationalOverview: React.FC<OperationalOverviewProps> = ({
  totalRestaurants,
  avgRating,
  featuredCount,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-surface-dark mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Dining Overview</h3>
        <TrendingUp className="w-6 h-6 text-primary" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-surface/30 rounded-2xl">
          <Users className="w-5 h-5 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalRestaurants}</div>
          <div className="text-xs text-foreground/70">Venues</div>
        </div>
        
        <div className="text-center p-4 bg-surface/30 rounded-2xl">
          <Star className="w-5 h-5 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</div>
          <div className="text-xs text-foreground/70">Avg Rating</div>
        </div>
        
        <div className="text-center p-4 bg-surface/30 rounded-2xl">
          <Clock className="w-5 h-5 text-foreground mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{featuredCount}</div>
          <div className="text-xs text-foreground/70">Featured</div>
        </div>
      </div>
    </div>
  );
};
