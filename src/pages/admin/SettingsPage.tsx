import React, { useState } from 'react';
import { Building2, Grid3X3, UtensilsCrossed, Sparkles, Palmtree, Plug } from 'lucide-react';
import PropertySettings from './settings/PropertySettings';
import DepartmentSettings from './settings/DepartmentSettings';
import RestaurantSettings from './settings/RestaurantSettings';
import SpaSettings from './settings/SpaSettings';
import TourSettings from './settings/TourSettings';
import IntegrationSettings from './settings/IntegrationSettings';

const TABS = [
  { id: 'property', label: 'Property', icon: Building2 },
  { id: 'departments', label: 'Departments', icon: Grid3X3 },
  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { id: 'spa', label: 'Spa', icon: Sparkles },
  { id: 'tours', label: 'Tours', icon: Palmtree },
  { id: 'integrations', label: 'Integrations', icon: Plug },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('property');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-accent">Settings</h1>

      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'bg-white text-accent shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === 'property' && <PropertySettings />}
        {activeTab === 'departments' && <DepartmentSettings />}
        {activeTab === 'restaurants' && <RestaurantSettings />}
        {activeTab === 'spa' && <SpaSettings />}
        {activeTab === 'tours' && <TourSettings />}
        {activeTab === 'integrations' && <IntegrationSettings />}
      </div>
    </div>
  );
}
