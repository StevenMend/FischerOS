// src/components/guest/BottomNavigation.tsx - MINIMAL STYLE
import React from 'react';
import { Activity, Calendar, Heart, Settings } from 'lucide-react';

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  page: string;
  active: boolean;
}

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navigationItems: NavigationItem[] = [
    { icon: Activity, label: 'Dashboard', page: 'dashboard', active: currentPage === 'dashboard' },
    { icon: Calendar, label: 'Bookings', page: 'bookings', active: currentPage === 'bookings' },
    { icon: Heart, label: 'Favorites', page: 'favorites', active: currentPage === 'favorites' },
    { icon: Settings, label: 'Settings', page: 'settings', active: currentPage === 'settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-surface-dark shadow-lg z-50">
      <div className="flex items-center justify-around py-4 px-6 max-w-md mx-auto">
        {navigationItems.map((item, index) => (
          <button 
            key={index}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center space-y-2 p-3 rounded-2xl transition-all duration-300 ${
              item.active 
                ? 'text-primary' 
                : 'text-foreground/60 hover:text-primary'
            }`}
          >
            <item.icon className={`w-6 h-6 transition-transform duration-300 ${item.active ? 'scale-110' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}