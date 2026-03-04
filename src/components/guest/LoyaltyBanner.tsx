// src/components/guest/LoyaltyBanner.tsx - MINIMAL STYLE
import React from 'react';
import { Crown } from 'lucide-react';

interface LoyaltyBannerProps {
  points?: number;
  tier?: string;
  nextTier?: string;
  pointsToNext?: number;
}

export default function LoyaltyBanner({ 
  points = 2450, 
  tier = "Gold", 
  nextTier = "Platinum", 
  pointsToNext = 550 
}: LoyaltyBannerProps) {
  return (
    <div className="mb-20 bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-surface-dark shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-white border-2 border-surface-dark rounded-3xl flex items-center justify-center shadow-sm">
            <Crown className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{tier} Member Benefits</h3>
            <p className="text-foreground/80">Unlock exclusive experiences • Priority booking • Special rates</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-accent">{points.toLocaleString()} pts</div>
          <div className="text-foreground/70">{pointsToNext} to {nextTier}</div>
        </div>
      </div>
    </div>
  );
}