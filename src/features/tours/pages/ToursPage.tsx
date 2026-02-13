import React from 'react';
import { Waves } from 'lucide-react';
import { useTours, SKILL_LEVELS, MEDICAL_OPTIONS } from '../hooks/useTours';
import {
  ExclusiveExperiencesBanner,
  ToursOperationalOverview,
  TourCategoryFilter,
  TourCard,
  TourBookingModal
} from '../components';

interface ToursPageProps {
  onBack: () => void;
}

export default function ToursPage({ onBack }: ToursPageProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark flex items-center justify-center">
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
              <Waves className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">Adventures & Experiences</h1>
              <p className="text-xl text-foreground/80">{tours.length} tours • Real-time coordination • Smart matching</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
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
      </main>

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
    </div>
  );
}
