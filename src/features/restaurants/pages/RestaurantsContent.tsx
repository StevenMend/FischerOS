// src/features/restaurants/pages/RestaurantsContent.tsx — Reusable content (no full-page shell)
import React from 'react';
import { useRestaurants } from '../hooks/useRestaurants';
import {
  CuisineFilter,
  OperationalOverview,
  RestaurantCard,
  ReservationModal
} from '../components';
import { logger } from '../../../core/utils/logger';

export default function RestaurantsContent() {
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

  const hasRestaurants = allRestaurants.length > 0;
  const avgRating = hasRestaurants
    ? allRestaurants.reduce((sum, r) => sum + r.rating, 0) / allRestaurants.length
    : 0;
  const featuredCount = allRestaurants.filter(r => r.is_featured).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-foreground">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading restaurants</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OperationalOverview
        totalRestaurants={allRestaurants.length}
        avgRating={avgRating}
        featuredCount={featuredCount}
      />

      <CuisineFilter
        cuisines={cuisines}
        selectedCuisine={selectedCuisine}
        onCuisineChange={setSelectedCuisine}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onReservation={handleReservation}
          />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/70">No restaurants found for this cuisine</p>
        </div>
      )}

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
    </>
  );
}
