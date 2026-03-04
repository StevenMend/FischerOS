// ============================================
// RESTAURANT CARD - Updated (Phase B.1)
// ============================================

import React from 'react';
import { Clock, MapPin, Users, Star, Utensils } from 'lucide-react';
import type { Restaurant } from '../api/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onReservation: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onReservation
}) => {
  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600';
      case '$$': return 'text-primary';
      case '$$$': return 'text-accent';
      case '$$$$': return 'text-foreground';
      default: return 'text-foreground';
    }
  };

  const getDressCodeIcon = (dressCode: string) => {
    if (dressCode.toLowerCase().includes('casual')) return '👕';
    if (dressCode.toLowerCase().includes('smart')) return '👔';
    if (dressCode.toLowerCase().includes('formal')) return '🎩';
    return '👕';
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-surface-dark overflow-hidden">
      
      {/* Restaurant Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={restaurant.cover_image} 
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured Badge */}
        {restaurant.is_featured && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-white">
              ⭐ Featured
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            restaurant.accepts_walkins 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              restaurant.accepts_walkins ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            {restaurant.accepts_walkins ? 'Walk-ins OK' : 'Reservations Only'}
          </span>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-xl font-display mb-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-foreground/70">{restaurant.cuisine}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-foreground/70">{restaurant.rating}</span>
            </div>
            <span className={`text-lg font-bold ${getPriceColor(restaurant.price_range)}`}>
              {restaurant.price_range}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
          {restaurant.short_description || restaurant.description}
        </p>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-foreground/80">
            <Clock className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span>{restaurant.hours_text}</span>
          </div>
          <div className="flex items-center text-sm text-foreground/80">
            <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span>{restaurant.location}</span>
          </div>
          <div className="flex items-center text-sm text-foreground/80">
            <Users className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span>{getDressCodeIcon(restaurant.dress_code)} {restaurant.dress_code}</span>
          </div>
        </div>

        {/* Specialties */}
        {restaurant.specialties && restaurant.specialties.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-xs text-foreground/70 mb-2">
              <Utensils className="w-3 h-3 mr-1" />
              <span>Specialties:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-surface/50 text-foreground rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
              {restaurant.specialties.length > 3 && (
                <span className="px-2 py-1 text-foreground/70 text-xs">
                  +{restaurant.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dietary Support */}
        {restaurant.dietary_support && restaurant.dietary_support.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-foreground/70 mb-2">Dietary Options:</div>
            <div className="flex flex-wrap gap-1">
              {restaurant.dietary_support.map((diet, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200"
                >
                  {diet}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reservation Button */}
        <button 
          onClick={() => onReservation(restaurant)}
          className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 hover:shadow-md transition-all duration-300"
        >
          {restaurant.reservation_required ? 'Reserve Now' : 'Reserve Table'}
        </button>
      </div>
    </div>
  );
};
