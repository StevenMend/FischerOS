// src/pages/guest/ExperiencesPage.tsx — Unified Experiences with tab switcher
import { useState } from 'react';
import { UtensilsCrossed, Waves, Flower2, CalendarCheck, Sparkles } from 'lucide-react';
import RestaurantsContent from '../../features/restaurants/pages/RestaurantsContent';
import ToursContent from '../../features/tours/pages/ToursContent';
import SpaContent from '../../features/spa/pages/SpaContent';
import { useGuestRequests } from '../../hooks/guest/useGuestRequests';
import GuestRequestCard from '../../features/service-requests/components/GuestRequestCard';
import RatingModal from '../../features/service-requests/components/RatingModal';

type ExperienceTab = 'dining' | 'adventures' | 'wellness' | 'bookings';

const TABS: { key: ExperienceTab; label: string; icon: typeof UtensilsCrossed }[] = [
  { key: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { key: 'adventures', label: 'Adventures', icon: Waves },
  { key: 'wellness', label: 'Wellness', icon: Flower2 },
  { key: 'bookings', label: 'My Bookings', icon: CalendarCheck },
];

function MyBookingsContent() {
  const { allRequests, submitRating } = useGuestRequests();
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedForRating, setSelectedForRating] = useState<any>(null);

  // Only show booking-type items (restaurant, spa, tour)
  const bookings = allRequests.filter(r => ['restaurant', 'spa', 'tour'].includes(r.type));
  const upcoming = bookings.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const past = bookings.filter(r => r.status === 'completed' || r.status === 'cancelled');

  const handleOpenRating = (request: any) => {
    setSelectedForRating(request);
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async (rating: number, feedback?: string) => {
    if (!selectedForRating) return;
    await submitRating(selectedForRating.id, rating, feedback, selectedForRating.type);
    setRatingModalOpen(false);
    setSelectedForRating(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-surface-dark">
        <CalendarCheck className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
        <p className="text-foreground/70 font-medium">No bookings yet</p>
        <p className="text-foreground/50 text-sm mt-1">Browse Dining, Adventures, or Wellness to make a reservation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <GuestRequestCard key={b.id} request={b} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" />
            Past
          </h2>
          <div className="space-y-3">
            {past.map((b) => (
              <GuestRequestCard
                key={b.id}
                request={b}
                onRate={b.status === 'completed' && !b.rating ? () => handleOpenRating(b) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      <RatingModal
        request={selectedForRating}
        isOpen={ratingModalOpen}
        onClose={() => { setRatingModalOpen(false); setSelectedForRating(null); }}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
}

export default function ExperiencesPage() {
  const [activeTab, setActiveTab] = useState<ExperienceTab>('dining');

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary/10 text-primary border-2 border-primary/20'
                  : 'bg-white text-foreground/70 border-2 border-gray-200 hover:border-primary/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'dining' && <RestaurantsContent />}
      {activeTab === 'adventures' && <ToursContent />}
      {activeTab === 'wellness' && <SpaContent />}
      {activeTab === 'bookings' && <MyBookingsContent />}
    </div>
  );
}
