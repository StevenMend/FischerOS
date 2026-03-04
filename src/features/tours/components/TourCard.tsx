import React, { useState } from 'react';
import { Star, Clock, Users, ChevronDown, ChevronUp, Shield, MapPin } from 'lucide-react';
import type { Tour } from '../api/types';

interface WeatherImpact {
  severity: string;
  message: string;
}

interface TourCardProps {
  tour: Tour;
  weatherImpact: WeatherImpact;
  onBookTour: (tour: Tour) => void;
  calculatePackagePrice: (price: number) => number;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  weatherImpact,
  onBookTour,
}) => {
  const [showMore, setShowMore] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'challenging': return 'bg-red-100 text-red-700';
      default: return 'bg-surface/50 text-foreground';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-surface-dark overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={tour.cover_image} 
          alt={tour.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
            {tour.difficulty}
          </span>
        </div>
        {tour.is_featured && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-white">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground text-xl font-display">{tour.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-foreground/70">{tour.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-foreground">
            ${tour.price_adult}
            {tour.price_child && (
              <span className="text-sm text-foreground/70 ml-2">
                (Child: ${tour.price_child})
              </span>
            )}
          </span>
          <div className="flex items-center text-sm text-foreground/70">
            <Clock className="w-4 h-4 mr-1 text-primary" />
            {tour.duration_text}
          </div>
        </div>

        <div className="mb-4 p-4 bg-surface/30 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{tour.partner_name}</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {tour.category}
            </span>
          </div>
          {tour.partner_phone && (
            <div className="text-xs text-foreground/70">
              📞 {tour.partner_phone}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-foreground/80">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium">Max group:</span> {tour.max_participants} people
          </div>
          {tour.skill_required && (
            <div className="flex items-center text-sm text-foreground/80">
              <Shield className="w-4 h-4 mr-2 text-primary" />
              <span className="font-medium">Skill:</span> {tour.skill_required}
            </div>
          )}
          {tour.safety_rating && (
            <div className="flex items-center text-sm text-foreground/80">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium">Safety:</span> {tour.safety_rating}
            </div>
          )}
        </div>

        <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
          {tour.short_description || tour.description}
        </p>

        {showMore && (
          <div className="mb-4 space-y-3 p-4 bg-surface/20 rounded-2xl">
            <div className="text-xs">
              <div className="font-medium text-foreground mb-1">Full Description:</div>
              <p className="text-foreground/70">{tour.description}</p>
            </div>

            {tour.includes && tour.includes.length > 0 && (
              <div className="text-xs">
                <div className="font-medium text-foreground mb-1">Includes:</div>
                <ul className="text-foreground/70 list-disc list-inside">
                  {tour.includes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {tour.what_to_bring && tour.what_to_bring.length > 0 && (
              <div className="text-xs">
                <div className="font-medium text-foreground mb-1">What to Bring:</div>
                <ul className="text-foreground/70 list-disc list-inside">
                  {tour.what_to_bring.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {tour.insurance_required && (
              <div className="text-xs p-2 bg-yellow-50 rounded-lg">
                <div className="font-medium text-yellow-800">⚠️ Insurance Required</div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full mb-4 flex items-center justify-center space-x-2 text-primary font-medium text-sm hover:underline"
        >
          <span>{showMore ? 'Show Less' : 'Show More Details'}</span>
          {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button 
          onClick={() => onBookTour(tour)}
          className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 hover:shadow-md transition-all duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
