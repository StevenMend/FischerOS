import React from 'react';
import { X, Shield, Waves } from 'lucide-react';
import type { Tour } from '../api/types';

interface BookingData {
  guests: number;
  date: string;
  time: string;
  skillLevel: string;
  medicalConditions: string[];
  emergencyContact: { name: string; phone: string };
  insurance: boolean;
  waiverSigned: boolean;
  specialRequests: string;
}

interface TourBookingModalProps {
  isOpen: boolean;
  selectedTour: Tour | null;
  bookingData: BookingData;
  setBookingData: (field: string, value: any) => void;
  skillLevels: string[];
  medicalOptions: string[];
  onClose: () => void;
  onSubmit: () => void;
  onMedicalToggle: (condition: string) => void;
}

export const TourBookingModal: React.FC<TourBookingModalProps> = ({
  isOpen,
  selectedTour,
  bookingData,
  setBookingData,
  skillLevels,
  medicalOptions,
  onClose,
  onSubmit,
  onMedicalToggle
}) => {
  if (!isOpen || !selectedTour) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 overflow-hidden">
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg border-t sm:border border-surface-dark flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh', maxWidth: '100vw' }}
      >
        
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-surface-dark bg-white/98">
          <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
            <div className="w-9 h-9 bg-white border-2 border-surface-dark rounded-xl flex items-center justify-center flex-shrink-0">
              <Waves className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-foreground truncate">Smart Booking</h2>
              <p className="text-xs text-foreground/80 truncate">{selectedTour.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface/50 rounded-xl transition-colors flex-shrink-0">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Guests</label>
              <select
                value={bookingData.guests}
                onChange={(e) => setBookingData('guests', parseInt(e.target.value))}
                className="w-full px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground text-xs"
              >
                {Array.from({length: selectedTour.max_participants}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Date</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData('date', e.target.value)}
                className="w-full px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground text-xs"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Time</label>
            <select
              value={bookingData.time}
              onChange={(e) => setBookingData('time', e.target.value)}
              className="w-full px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground text-xs"
            >
              <option value="09:00">9:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="15:00">3:00 PM</option>
            </select>
          </div>

          {selectedTour.skill_required && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Skill Level</label>
              <select
                value={bookingData.skillLevel}
                onChange={(e) => setBookingData('skillLevel', e.target.value)}
                className="w-full px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground text-xs"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <p className="text-[10px] text-foreground/70 mt-1">
                Required: {selectedTour.skill_required}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Medical Conditions</label>
            <div className="grid grid-cols-2 gap-1.5">
              {medicalOptions.map(condition => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => onMedicalToggle(condition)}
                  className={`px-2 py-1.5 text-[10px] rounded-lg border-2 transition-all font-medium ${
                    bookingData.medicalConditions.includes(condition)
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-white text-foreground border-surface-dark'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Emergency Contact</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={bookingData.emergencyContact.name}
                onChange={(e) => setBookingData('emergencyContact', {
                  ...bookingData.emergencyContact, 
                  name: e.target.value
                })}
                className="px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground text-xs"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={bookingData.emergencyContact.phone}
                onChange={(e) => setBookingData('emergencyContact', {
                  ...bookingData.emergencyContact, 
                  phone: e.target.value
                })}
                className="px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            {selectedTour.insurance_required && (
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingData.insurance}
                  onChange={(e) => setBookingData('insurance', e.target.checked)}
                  className="w-4 h-4 text-primary border-surface-dark rounded mt-0.5 flex-shrink-0"
                />
                <span className="text-[11px] text-foreground leading-tight">
                  <strong className="text-red-600">* Insurance required</strong> for this tour
                </span>
              </label>
            )}
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bookingData.waiverSigned}
                onChange={(e) => setBookingData('waiverSigned', e.target.checked)}
                className="w-4 h-4 text-primary border-surface-dark rounded mt-0.5 flex-shrink-0"
              />
              <span className="text-[11px] text-foreground leading-tight">
                <strong className="text-red-600">* I agree</strong> to liability waiver & safety protocols
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Special Requests</label>
            <textarea
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData('specialRequests', e.target.value)}
              placeholder="Any special requirements or concerns..."
              className="w-full px-2.5 py-1.5 border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-primary bg-white/50 text-foreground resize-none text-xs"
              rows={2}
            />
          </div>

          {selectedTour.partner_emergency_protocol && (
            <div className="p-2.5 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <Shield className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span className="font-medium text-green-800 text-[11px]">Safety Protocol</span>
              </div>
              <p className="text-[10px] text-green-700 leading-snug">
                {selectedTour.partner_emergency_protocol}
              </p>
              {selectedTour.partner_phone && (
                <p className="text-[10px] text-green-700 mt-1">
                  Emergency: {selectedTour.partner_phone}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-3 border-t border-surface-dark bg-white/98">
          <button
            onClick={onSubmit}
            disabled={
              !bookingData.waiverSigned || 
              (selectedTour.insurance_required && !bookingData.insurance) ||
              !bookingData.emergencyContact.name ||
              !bookingData.emergencyContact.phone
            }
            className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};
