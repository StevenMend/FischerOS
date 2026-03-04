// src/features/tours/pages/ToursContent.tsx — Reusable content (no full-page shell)
import React from 'react';
import { useTours, SKILL_LEVELS, MEDICAL_OPTIONS } from '../hooks/useTours';
import {
  ExclusiveExperiencesBanner,
  ToursOperationalOverview,
  TourCategoryFilter,
  TourCard,
  TourBookingModal
} from '../components';

export default function ToursContent() {
  const {
    tours,
    allTours,
    categories,
    loading,
    error,
    selectedFilter,
    setSelectedFilter,
    selectedTour,
    showModal,
    openModal,
    closeModal,
    bookingData,
    updateBookingData,
    handleSubmit,
    isSubmitting,
  } = useTours();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading tours</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const operationalOverview = {
    partnerReliability: allTours.length > 0 ? '96%' : 'N/A',
    avgResponseTime: '11 min',
    equipmentAvailable: '92%',
    activeBookings: 0
  };

  return (
    <>
      <ExclusiveExperiencesBanner />
      <ToursOperationalOverview {...operationalOverview} />
      <TourCategoryFilter
        categories={categories}
        selectedCategory={selectedFilter}
        onCategoryChange={setSelectedFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour}
            weatherImpact={{ severity: 'low', message: 'Great conditions' }}
            onBookTour={openModal}
            calculatePackagePrice={() => 0}
          />
        ))}
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/70">No tours found for this category</p>
        </div>
      )}

      <TourBookingModal
        isOpen={showModal}
        selectedTour={selectedTour}
        bookingData={bookingData}
        setBookingData={(field, value) => updateBookingData(field, value)}
        skillLevels={SKILL_LEVELS}
        medicalOptions={MEDICAL_OPTIONS}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onMedicalToggle={(condition) => {
          const current = bookingData.medicalConditions;
          const updated = current.includes(condition)
            ? current.filter(c => c !== condition)
            : [...current, condition];
          updateBookingData('medicalConditions', updated);
        }}
      />
    </>
  );
}
