// ============================================
// RESTAURANTS PAGE - Updated (Phase B.1)
// ============================================

import React from 'react';
import { Utensils } from 'lucide-react';
import { useRestaurants } from '../hooks/useRestaurants';
import {
  CuisineFilter,
  OperationalOverview,
  RestaurantCard,
  ReservationModal
} from '../components';
import { logger } from '../../../core/utils/logger';

interface RestaurantsPageProps {
  onBack: () => void;
}

export default function RestaurantsPage({ onBack }: RestaurantsPageProps) {
  const {
    filteredRestaurants,
    allRestaurants,
    selectedCuisine,
    setSelectedCuisine,
    cuisines,
    reservationData,
    updateReservationData,
    submitReservation,
    isSubmitting,
    loading,
    error,
    selectedRestaurant,
    isModalOpen,
    handleReservation,
    closeModal,
    occasions,
    timeSlots,
  } = useRestaurants();

  const handleSubmitReservation = async () => {
    if (!selectedRestaurant) return;
    
    try {
      await submitReservation();
    } catch (error) {
      logger.error('Restaurants', 'Reservation failed', { error });
    }
  };

  const handleDietaryToggle = (restriction: string) => {
    const current = reservationData.dietaryRestrictions;
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    updateReservationData('dietaryRestrictions', updated);
  };

  // Calculate operational overview
  const hasRestaurants = allRestaurants.length > 0;
  const avgRating = hasRestaurants
    ? allRestaurants.reduce((sum, r) => sum + r.rating, 0) / allRestaurants.length
    : 0;
  const featuredCount = allRestaurants.filter(r => r.is_featured).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading restaurants</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white border-2 border-surface-dark rounded-3xl flex items-center justify-center shadow-lg">
              <Utensils className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">
                Dining Experiences
              </h1>
              <p className="text-xl text-foreground/80">
                {filteredRestaurants.length} venues • World-class cuisine • Reserve now
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        
        {/* Operational Overview */}
        <OperationalOverview 
          totalRestaurants={allRestaurants.length}
          avgRating={avgRating}
          featuredCount={featuredCount}
        />
        
        {/* Cuisine Filter */}
        <CuisineFilter 
          cuisines={cuisines}
          selectedCuisine={selectedCuisine}
          onCuisineChange={setSelectedCuisine}
        />

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onReservation={handleReservation}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/70">
              No restaurants found for this cuisine
            </p>
          </div>
        )}
      </main>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        selectedRestaurant={selectedRestaurant}
        reservationData={reservationData}
        setReservationData={updateReservationData}
        occasions={occasions}
        timeSlots={timeSlots}
        onClose={closeModal}
        onSubmit={handleSubmitReservation}
        onDietaryToggle={handleDietaryToggle}
      />
    </div>
  );
}
