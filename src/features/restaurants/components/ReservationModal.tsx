// ============================================
// RESERVATION MODAL - Updated (Phase B.1)
// ============================================

import React from 'react';
import { X, AlertTriangle, Sparkles, Crown, Utensils } from 'lucide-react';
import type { Restaurant } from '../api/types';

interface ReservationData {
  guests: number;
  date: string;
  time: string;
  occasion: string;
  dietaryRestrictions: string[];
  seatingPreference: string;
  specialRequests: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  selectedRestaurant: Restaurant | null;
  reservationData: ReservationData;
  setReservationData: (field: string, value: any) => void;
  occasions?: string[];
  timeSlots?: string[];
  seatingOptions?: string[];
  onClose: () => void;
  onSubmit: () => void;
  onDietaryToggle: (restriction: string) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  selectedRestaurant,
  reservationData,
  setReservationData,
  occasions = [],
  timeSlots = [],
  seatingOptions = ['No Preference', 'Window', 'Quiet Area', 'Bar', 'Patio'],
  onClose,
  onSubmit,
  onDietaryToggle
}) => {
  if (!isOpen || !selectedRestaurant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-surface-dark">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-dark sticky top-0 bg-white/95 backdrop-blur-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground font-display">Reserve Table</h2>
              <p className="text-sm text-foreground/80">{selectedRestaurant.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-surface/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
              <select
                value={reservationData.guests}
                onChange={(e) => setReservationData('guests', parseInt(e.target.value))}
                className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground text-sm"
              >
                {Array.from({ length: selectedRestaurant.max_party_size }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <input
                type="date"
                value={reservationData.date}
                onChange={(e) => setReservationData('date', e.target.value)}
                className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground text-sm"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time ({selectedRestaurant.hours_text})
            </label>
            {timeSlots.length > 0 ? (
              <select
                value={reservationData.time}
                onChange={(e) => setReservationData('time', e.target.value)}
                className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground text-sm"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            ) : (
              <input
                type="time"
                value={reservationData.time}
                onChange={(e) => setReservationData('time', e.target.value)}
                className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground text-sm"
              />
            )}
          </div>

          {/* Occasion */}
          {occasions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Special Occasion (Optional)
              </label>
              <select
                value={reservationData.occasion}
                onChange={(e) => setReservationData('occasion', e.target.value)}
                className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground text-sm"
              >
                <option value="">No special occasion</option>
                {occasions.map(occasion => (
                  <option key={occasion} value={occasion}>{occasion}</option>
                ))}
              </select>
            </div>
          )}

          {/* Dietary Restrictions */}
          {selectedRestaurant.dietary_support && selectedRestaurant.dietary_support.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Dietary Restrictions (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedRestaurant.dietary_support.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onDietaryToggle(option)}
                    className={`p-2 text-xs rounded-xl border-2 transition-all duration-300 font-medium ${
                      reservationData.dietaryRestrictions.includes(option)
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : 'bg-white text-foreground border-surface-dark hover:border-primary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seating Preference */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Seating Preference (Optional)
            </label>
            <select
              value={reservationData.seatingPreference}
              onChange={(e) => setReservationData('seatingPreference', e.target.value)}
              className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground text-sm"
            >
              {seatingOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={reservationData.specialRequests}
              onChange={(e) => setReservationData('specialRequests', e.target.value)}
              placeholder="Allergies, celebrations, accessibility needs..."
              className="w-full px-3 py-2 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/50 text-foreground resize-none text-sm"
              rows={3}
            />
          </div>

          {/* Dietary Alert */}
          {reservationData.dietaryRestrictions.length > 0 && (
            <div className="p-3 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 text-sm">Kitchen Notification</span>
              </div>
              <p className="text-xs text-green-700">
                Your dietary needs will be communicated to the kitchen staff
              </p>
            </div>
          )}

          {/* Restaurant Info */}
          <div className="p-3 bg-surface/30 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground text-sm">Restaurant Info</span>
            </div>
            <div className="space-y-1 text-xs text-foreground/80">
              <p>📍 {selectedRestaurant.location}</p>
              <p>👔 {selectedRestaurant.dress_code}</p>
              {selectedRestaurant.atmosphere && (
                <p>✨ {selectedRestaurant.atmosphere}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 hover:shadow-md transition-all duration-300"
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
};
