// src/components/GuestDashboard.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Crown } from 'lucide-react';
import { useGuestDashboard } from '../hooks/guest/useGuestDashboard';
import ToursPage from "../features/tours/pages/ToursPage";
import RestaurantsPage from "../features/restaurants/pages/RestaurantsPage";
import KPIGrid from './guest/KPIGrid';
import LoyaltyBanner from './guest/LoyaltyBanner';
import BottomNavigation from './guest/BottomNavigation';
import { logger } from '../core/utils/logger';

interface GuestDashboardProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function GuestDashboard({ currentPage, onNavigate }: GuestDashboardProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const dashboardData = useGuestDashboard();

  logger.debug('GuestDashboard', 'render', { currentPage });

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
      title: 'Garden Spa Treatments',
      subtitle: 'Ocean view relaxation',
      price: 'from $50',
      action: () => onNavigate('spa'),
      badge: 'Available Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop',
      title: 'Catamaran Sunset',
      subtitle: 'Most popular tour • 4.9★',
      price: 'from $75',
      action: () => onNavigate('tours'),
      badge: 'Trending'
    },
    {
      image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&h=600&fit=crop',
      title: 'El Pelícano Restaurant',
      subtitle: '8 world-class venues',
      price: 'Reserve table',
      action: () => onNavigate('restaurants'),
      badge: '6 available'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (currentPage === 'tours') {
    logger.debug('GuestDashboard', 'Rendering ToursPage');
    return <ToursPage onBack={() => onNavigate('dashboard')} />;
  }

  if (currentPage === 'restaurants') {
    logger.debug('GuestDashboard', 'Rendering RestaurantsPage');
    return <RestaurantsPage onBack={() => onNavigate('dashboard')} />;
  }

  if (!dashboardData) return null;

  const currentSlide = heroSlides[currentHeroIndex];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 max-w-7xl mx-auto">
        
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-surface-dark mb-4 sm:mb-6 md:mb-8 overflow-hidden">
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{ backgroundImage: `url(${currentSlide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-end p-3 sm:p-4 md:p-6 text-white">
              <div className="max-w-full">
                <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mb-2">
                  <Crown className="w-3 h-3" />
                  <span className="text-[10px] sm:text-xs font-semibold">{currentSlide.badge}</span>
                </div>
                
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight">{currentSlide.title}</h2>
                <p className="text-xs sm:text-sm md:text-base mb-2 sm:mb-3 text-white/90 leading-tight">{currentSlide.subtitle}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="text-base sm:text-lg md:text-xl font-bold">{currentSlide.price}</div>
                  <button 
                    onClick={currentSlide.action}
                    className="bg-white border-2 border-white text-foreground px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl font-semibold flex items-center space-x-2 transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentHeroIndex ? 'bg-white w-4 sm:w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <KPIGrid kpis={dashboardData.kpis} />
        
        <LoyaltyBanner 
          points={dashboardData.loyalty.points}
          tier={dashboardData.loyalty.tier}
          nextTier={dashboardData.loyalty.nextTier}
          pointsToNext={dashboardData.loyalty.pointsToNext}
        />
      </div>

      <BottomNavigation 
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </div>
  );
}