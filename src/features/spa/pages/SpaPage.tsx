import React, { useState, useMemo } from 'react';
import { Flower2, Crown, Heart, Clock, Star } from 'lucide-react';
import { useTreatments, useCreateAppointment } from '../queries';
import type { SpaTreatment } from '../types';

interface SpaPageProps {
  onBack?: () => void;
}

export default function SpaPage({ onBack }: SpaPageProps = {}) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedTreatment, setSelectedTreatment] = useState<SpaTreatment | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const [appointmentData, setAppointmentData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    specialRequests: ''
  });

  // React Query hooks
  const { data: treatments, isLoading, error } = useTreatments();
  const createAppointmentMutation = useCreateAppointment();

  // Filters
  const filters = useMemo(() => {
    if (!treatments) return ['All'];
    const categories = new Set(treatments.map(t => t.category));
    return ['All', ...Array.from(categories)];
  }, [treatments]);

  // Filtered treatments
  const filteredTreatments = useMemo(() => {
    if (!treatments) return [];
    if (selectedFilter === 'All') return treatments;
    return treatments.filter(t => t.category === selectedFilter);
  }, [treatments, selectedFilter]);

  const handleBookTreatment = (treatment: SpaTreatment) => {
    setSelectedTreatment(treatment);
    setShowBookingModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedTreatment) return;
    
    try {
      await createAppointmentMutation.mutateAsync({
        treatment_id: selectedTreatment.id,
        appointment_date: appointmentData.date,
        time_slot: appointmentData.time,
        special_requests: appointmentData.specialRequests || undefined,
      });
      
      setShowBookingModal(false);
      setSelectedTreatment(null);
      setAppointmentData({
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        specialRequests: ''
      });
    } catch (error) {
      console.error('❌ Booking failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading spa treatments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading treatments</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white border-2 border-surface-dark rounded-3xl flex items-center justify-center shadow-lg">
              <Flower2 className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">Garden Spa & Wellness</h1>
              <p className="text-xl text-foreground/80">{filteredTreatments.length} treatments • Expert therapists • Premium experience</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-surface-dark shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 font-display">Wellness Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-foreground/80 text-sm">Improves circulation</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-accent" />
              </div>
              <p className="text-foreground/80 text-sm">Relieves stress</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Flower2 className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-foreground/80 text-sm">Detoxifies body</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <p className="text-foreground/80 text-sm">Improves sleep</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white/80 text-foreground hover:bg-white hover:shadow-md'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-surface-dark shadow-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="relative h-48">
                <img
                  src={treatment.images[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
                  alt={treatment.name}
                  className="w-full h-full object-cover"
                />
                {treatment.is_featured && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="text-sm font-semibold text-foreground">Featured</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{treatment.name}</h3>
                <p className="text-foreground/70 text-sm mb-4">{treatment.short_description || treatment.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-foreground/80">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{treatment.duration} min</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">${treatment.price}</div>
                </div>

                {treatment.benefits.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-foreground/60 mb-2">Benefits:</div>
                    <div className="flex flex-wrap gap-2">
                      {treatment.benefits.slice(0, 3).map((benefit) => (
                        <span
                          key={benefit}
                          className="px-2 py-1 bg-surface/50 rounded-lg text-xs text-foreground"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleBookTreatment(treatment)}
                  className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/70">No treatments found for this category</p>
          </div>
        )}
      </main>

      {showBookingModal && selectedTreatment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-foreground mb-4">Book {selectedTreatment.name}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                <select
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {selectedTreatment.available_times.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Special Requests</label>
                <textarea
                  value={appointmentData.specialRequests}
                  onChange={(e) => setAppointmentData({ ...appointmentData, specialRequests: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-surface-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Any preferences or requirements..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={createAppointmentMutation.isPending}
                className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {createAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}