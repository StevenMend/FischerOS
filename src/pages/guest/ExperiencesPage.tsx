// src/pages/guest/ExperiencesPage.tsx — Unified Experiences with tab switcher
import { useState } from 'react';
import { UtensilsCrossed, Waves, Flower2 } from 'lucide-react';
import RestaurantsContent from '../../features/restaurants/pages/RestaurantsContent';
import ToursContent from '../../features/tours/pages/ToursContent';
import SpaContent from '../../features/spa/pages/SpaContent';

type ExperienceTab = 'dining' | 'adventures' | 'wellness';

const TABS: { key: ExperienceTab; label: string; icon: typeof UtensilsCrossed }[] = [
  { key: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { key: 'adventures', label: 'Adventures', icon: Waves },
  { key: 'wellness', label: 'Wellness', icon: Flower2 },
];

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
    </div>
  );
}
