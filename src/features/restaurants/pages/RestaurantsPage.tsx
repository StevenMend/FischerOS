// src/features/restaurants/pages/RestaurantsPage.tsx — Full-page shell delegating to RestaurantsContent
import React from 'react';
import { Utensils } from 'lucide-react';
import RestaurantsContent from './RestaurantsContent';

interface RestaurantsPageProps {
  onBack: () => void;
}

export default function RestaurantsPage({ onBack }: RestaurantsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white border-2 border-surface-dark rounded-3xl flex items-center justify-center shadow-lg">
              <Utensils className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">Dining Experiences</h1>
              <p className="text-xl text-foreground/80">World-class cuisine</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <RestaurantsContent />
      </main>
    </div>
  );
}
